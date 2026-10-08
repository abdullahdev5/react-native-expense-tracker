import { Types } from "mongoose";
import { Transaction } from "../models/Transaction";
import { ChartData, InsightsRequestQueryParams, InsightsResponse } from "../types/insight";
import moment from "moment";
import { User } from "../models/User";
import { HttpError } from "../utils/errors.util";
import { socketService } from "./socket.service";
import { SOCKET_EVENTS } from "../constants/socketEvents";

class InsightService {
  public async getInsights(
    userId: string,
    query: InsightsRequestQueryParams,
  ): Promise<InsightsResponse> {
    let startDate, endDate, groupBy, format;
    let dataPoints: ChartData[] = [];

    const user = await User.findById(new Types.ObjectId(userId));

    if (!user) {
        throw new HttpError('UnAuthorized!', 401);
    }

    if (query.period === "daily") {
      startDate = moment().startOf("isoWeek");
      endDate = moment().endOf("isoWeek");
      groupBy = { $dayOfWeek: "$date" };

      const currentDayIndex = moment().isoWeek();

      dataPoints = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
        (day, i) => ({
          index: i + 1,
          label: day,
          value: 0,
          isCurrent: (i + 1) === currentDayIndex
        }),
      );
    } else if (query.period === "monthly") {
      startDate = moment().startOf("month");
      endDate = moment().endOf("month");
      groupBy = { $dayOfMonth: "$date" };

      const currentDayOfMonth = moment().date();
      const daysInMonth = moment().daysInMonth();

      for (let i = 1; i <= daysInMonth; i++) {
        dataPoints.push({
          index: i,
          label: `${i}`,
          value: 0,
          isCurrent: i === currentDayOfMonth
        });
      }

    } else if (query.period === "yearly") {
      startDate = moment().startOf("year");
      endDate = moment().endOf("year");
      groupBy = { $month: "$date" };

      const currentMonthIndex = moment().month() + 1;

      dataPoints = moment.monthsShort().map((month, index) => ({
        index: index + 1,
        label: month,
        value: 0,
        isCurrent: (index + 1) === currentMonthIndex,
      }));
    }

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          type: query.type,
          date: { $gte: startDate?.toDate(), $lte: endDate?.toDate() }
        },
      },

      {
        $group: {
            _id: groupBy,
            total: { $sum: "$amount" }
        }
      }
    ]);

    stats.forEach(stat => {
        const point = dataPoints.find(p => p.index === stat._id);
        if (point) point.value = stat.total;
    });

    const totalAmount = dataPoints.reduce((acc, curr) => acc + curr.value, 0);

    return {
      summary: {
        totalAmount,
        baseCurrency: user?.baseCurrency ?? 'PKR',
        period: query.period,
        type: query.type,
        label: query.type === 'income' ? "Total Income" : "Total Expense"
      },
      chartData: dataPoints
    };
  }


  public async emitInsightUpdate(userId: string, query: InsightsRequestQueryParams) {
    const insightData = await this.getInsights(userId, query);

    socketService.emitToUser(userId, SOCKET_EVENTS.insightUpdate, insightData);
  }
}


export const insightService = new InsightService();

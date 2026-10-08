import { Types } from "mongoose";
import { Transaction } from "../models/Transaction";
import { Wallet } from "../models/Wallet";
import { COLLECTION_NAMES } from "../constants/dbConstants";
import { User } from "../models/User";
import { currencyService } from "./currency.service";
import { HttpError } from "../utils/errors.util";
import { ITransaction } from "../types/transaction";
import {
  DashboardResponse,
  DashboardUpdate,
  TopDashboardCategory,
} from "../types/dashboard";
import { socketService } from "./socket.service";
import { SOCKET_EVENTS } from "../constants/socketEvents";

class DashboardService {
  public async getDashboard(userId: string): Promise<DashboardResponse> {
    const user = await User.findById(userId);
    if (!user?.baseCurrency) {
      throw new HttpError("your base currency is not set!", 400);
    }

    const baseCurrency = user.baseCurrency;

    // Run independent tasks in parallel for better performance
    const [totalBalance, topCategories] = await Promise.all(
      [
        this.getTotalBalance(userId, baseCurrency),
        this.getTopCategories(userId, baseCurrency),
      ],
    );

    return {
      totalBalance,
      baseCurrency,
      topCategories,
    };
  }

  /* TOTAL BALANCE LOGIC */
  private async getTotalBalance(
    userId: string,
    baseCurrency: string,
  ): Promise<number> {
    const wallets = await Wallet.find({ userId });
    const currencies = [...new Set(wallets.map((w) => w.currency))];
    const ratesMap: Record<string, number> = {};

    await Promise.all(
      currencies.map(async (currency) => {
        ratesMap[currency] = await currencyService.getRate(
          currency,
          baseCurrency,
        );
      }),
    );

    let totalBalance = 0;
    for (const wallet of wallets) {
      totalBalance += wallet.balance * (ratesMap[wallet.currency] ?? 1);
    }
    return Number(totalBalance.toFixed(2));
  }

  /* TOP CATEGORIES LOGIC */
  private async getTopCategories(
    userId: string,
    baseCurrency: string,
  ): Promise<TopDashboardCategory[]> {
    const categoryAgg = await Transaction.aggregate([
      { $match: { userId: new Types.ObjectId(userId), type: "expense" } },
      {
        $lookup: {
          from: COLLECTION_NAMES.categories,
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$categoryId",
          total: { $sum: "$amount" },
          currency: { $first: "$currency" },
          name: { $first: "$category.name" },
          color: { $first: "$category.color" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 3 },
    ]);

    if (categoryAgg.length <= 1) {
      return [];
    }

    const catCurrencies = [...new Set(categoryAgg.map((c) => c.currency))];
    const ratesMap: Record<string, number> = {};

    await Promise.all(
      catCurrencies.map(async (currency) => {
        ratesMap[currency] = await currencyService.getRate(
          currency,
          baseCurrency,
        );
      }),
    );

    let totalExpenses = 0;
    const processed = categoryAgg.map((c) => {
      const converted = c.total * (ratesMap[c.currency] ?? 1);
      totalExpenses += converted;
      return {
        categoryId: c._id,
        name: c.name,
        color: c.color,
        total: converted,
      };
    });

    return processed.map((c) => ({
      ...c,
      percentage: totalExpenses
        ? Number(((c.total / totalExpenses) * 100).toFixed(0))
        : 0,
    }));
  }

  async emitDashboardUpdate(userId: string, baseCurrency: string) {
    const [totalBalance, topCategories] = await Promise.all([
      this.getTotalBalance(userId, baseCurrency),
      this.getTopCategories(userId, baseCurrency),
    ]);

    // This object matches your Partial<DashboardResponseDTO> from earlier!
    socketService.emitToUser<DashboardUpdate>(
      userId,
      SOCKET_EVENTS.dashboardUpdate,
      {
        totalBalance,
        baseCurrency,
        topCategories,
      },
    );
  }

  // public async getDashboard(userId: string): Promise<DashboardResponse | any> {
  //   const user = await User.findById(userId);

  //   if (!user?.baseCurrency) {
  //     throw new HttpError("your base currency is not set!", 400);
  //   }

  //   const baseCurrency = user.baseCurrency;

  //   /* TOTAL BALANCE */

  //   const wallets = await Wallet.find({ userId });

  //   const currencies = [...new Set(wallets.map((w) => w.currency))];

  //   const ratesMap: Record<string, number> = {};

  //   await Promise.all(
  //     currencies.map(async (currency) => {
  //       ratesMap[currency] = await currencyService.getRate(
  //         currency,
  //         baseCurrency,
  //       );
  //     }),
  //   );

  //   let totalBalance = 0;

  //   for (const wallet of wallets) {
  //     totalBalance += wallet.balance * (ratesMap[wallet.currency] ?? 1);
  //   }

  //   /* TOP CATEGORIES */

  //   const categoryAgg = await Transaction.aggregate([
  //     {
  //       $match: {
  //         userId: new Types.ObjectId(userId),
  //         type: "expense",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "categories",
  //         localField: "categoryId",
  //         foreignField: "_id",
  //         as: "category",
  //       },
  //     },
  //     { $unwind: "$category" },
  //     {
  //       $group: {
  //         _id: "$categoryId",
  //         total: { $sum: "$amount" },
  //         currency: { $first: "$currency" },
  //         name: { $first: "$category.name" },
  //         color: { $first: "$category.color" },
  //       },
  //     },
  //     { $sort: { total: -1 } },
  //     { $limit: 3 },
  //   ]);

  //   // Get currencies used
  //   const catCurrencies = [...new Set(categoryAgg.map((c) => c.currency))];

  //   await Promise.all(
  //     catCurrencies.map(async (currency) => {
  //       if (!ratesMap[currency]) {
  //         ratesMap[currency] = await currencyService.getRate(
  //           currency,
  //           baseCurrency,
  //         );
  //       }
  //     }),
  //   );

  //   let totalExpenses = 0;

  //   const processedCategories = categoryAgg.map((c) => {
  //     const converted = c.total * (ratesMap[c.currency] ?? 1);
  //     totalExpenses += converted;

  //     return {
  //       categoryId: c._id,
  //       name: c.name,
  //       color: c.color,
  //       total: converted,
  //     };
  //   });

  //   const topCategories = processedCategories.map((c) => ({
  //     ...c,
  //     percentage: totalExpenses
  //       ? Number(((c.total / totalExpenses) * 100).toFixed(0))
  //       : 0,
  //   }));

  //   const recentTransactions = await Transaction.getWithDetails({ userId });

  //   return {
  //     totalBalance: Number(totalBalance.toFixed(2)),
  //     baseCurrency,
  //     topCategories,
  //     recentTransactions,
  //   };
  // }
}

export const dashboardService = new DashboardService();

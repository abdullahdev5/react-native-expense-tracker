import { Request, Response, NextFunction } from "express"
import { responseHelper } from "../helpers/responseHelper";
import { InsightsPeriod, InsightsRequestQueryParams } from "../types/insight";
import { TransactionType } from "../types/transaction";
import { insightService } from "../services/insight.service";


const getInsights = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!._id;
        const query = req.query;

        if (!query.period || !query.type) {
            return responseHelper.sendError(
                res,
                'Please Select the Period and the Transaction Type!',
                400
            );
        }

        const data: InsightsRequestQueryParams = {
            period: query.period as InsightsPeriod,
            type: query.type as TransactionType
        };

        const responseData = await insightService.getInsights(userId.toString(), data);

        return responseHelper.sendSuccess(
            res,
            responseData,
            'Statistics Fetched Successfully',
        );
    } catch (e) {
        next(e);
    }
}


export { getInsights }
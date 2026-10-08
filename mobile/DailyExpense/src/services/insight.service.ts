import { getInsightsApi } from "../api/insight.api";
import { ApiResponse } from "../types/api";
import { InsightsPeriod, InsightsResponse } from "../types/insight";
import { TransactionType } from "../types/transaction";
import { errorResponse, getErrorMessage } from "../utils/error";
import { mapInsightsResponse } from "../utils/mapper";


export const getInsightsService = async (
    period: InsightsPeriod,
    type: TransactionType
): Promise<ApiResponse<InsightsResponse>> => {
    try {
        const res = await getInsightsApi(period, type);

        return {
            ...res,

            data: res.data ? mapInsightsResponse(res.data) : undefined
        };
    } catch (e: any) {
        return errorResponse({ message: getErrorMessage(e) });
    }
}
import { apiClient } from "../config/axios";
import { REQUEST_URL_CONSTANTS } from "../constants/apiConstants";
import { ApiResponse } from "../types/api";
import { InsightsPeriod, InsightsResponseDTO } from "../types/insight";
import { TransactionType } from "../types/transaction";


export const getInsightsApi = async (
    period: InsightsPeriod,
    type: TransactionType
): Promise<ApiResponse<InsightsResponseDTO>> => {
    const url = new URL(REQUEST_URL_CONSTANTS.getInsights);
    if (period) {
        url.searchParams.append('period', period);
    }
    if (type) {
        url.searchParams.append('type', type);
    }
    const res = await apiClient.get<ApiResponse<InsightsResponseDTO>>
    (url.toString());

    return res.data;
};
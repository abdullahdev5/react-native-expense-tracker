import { apiClient } from "../config/axios"
import { REQUEST_URL_CONSTANTS } from "../constants/apiConstants"
import { ApiResponse } from "../types/api"
import { DashboardResponseDTO } from "../types/dashboard"

export const getDashboardApi = async () => {
    const res = await apiClient.get<ApiResponse<DashboardResponseDTO>>
    (`${REQUEST_URL_CONSTANTS.getDashboard}`);

    return res.data;
};
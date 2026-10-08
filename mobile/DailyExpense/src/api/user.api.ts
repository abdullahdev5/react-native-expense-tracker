import { AxiosResponse } from "axios";
import { apiClient } from "../config/axios";
import { ApiResponse } from "../types/api";
import { UserDTO } from "../types/auth";
import { REQUEST_URL_CONSTANTS } from "../constants/apiConstants";
import { UpdateProfilePayload } from "../types/user";


export const getUserApi = async () => {
    const res = await apiClient.get<ApiResponse<UserDTO>>(REQUEST_URL_CONSTANTS.user);

    return res.data;
};


export const setBaseCurrencyApi = async (baseCurrency: string) => {
    const res = await apiClient.post<ApiResponse<UserDTO>>
    (REQUEST_URL_CONSTANTS.setBaseCurrency, { baseCurrency });

    return res.data;
};


export const updateProfileApi = async (payload: UpdateProfilePayload) => {
    const res = await apiClient.post<ApiResponse<UserDTO>>
        (REQUEST_URL_CONSTANTS.updateProfile, payload);

    return res.data;
}
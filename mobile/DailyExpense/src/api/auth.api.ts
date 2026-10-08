import { AxiosResponse } from "axios";
import { apiClient } from "../config/axios";
import { ApiResponse } from "../types/api";
import { AuthDataDTO, LoginPayload, RegisterPayload } from "../types/auth";
import { REQUEST_URL_CONSTANTS } from "../constants/apiConstants";


export const registerApi = async (data: RegisterPayload) => {
    const res = await apiClient.post<ApiResponse<AuthDataDTO>>(
        REQUEST_URL_CONSTANTS.register, data
    );

    return res.data;
}

export const loginApi = async (data: LoginPayload) => {
    const res = await apiClient.post<ApiResponse<AuthDataDTO>>(
        REQUEST_URL_CONSTANTS.login,
        data
    );

    return res.data;
}

export const googleSignInApi = async (idToken: string, baseCurrency?: string) => {
    const res = await apiClient.post<ApiResponse<AuthDataDTO>>(
        REQUEST_URL_CONSTANTS.googleAuth,
        { idToken, baseCurrency }
    );

    return res.data;
}

export const facebookSignInApi = async (accessToken: string, baseCurrency?: string) => {
    const res = await apiClient.post<ApiResponse<AuthDataDTO>>(
        REQUEST_URL_CONSTANTS.facebookAuth,
        { accessToken, baseCurrency }
    );

    return res.data;
}
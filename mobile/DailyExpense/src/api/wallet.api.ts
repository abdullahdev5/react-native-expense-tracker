import { apiClient } from "../config/axios";
import { REQUEST_URL_CONSTANTS } from "../constants/apiConstants";
import { ApiResponse } from "../types/api";
import { CreateWalletPayload, WalletDTO } from "../types/wallet";


export const createWalletApi = async (data: CreateWalletPayload) => {
    const res = await apiClient.post<ApiResponse<WalletDTO>>
    (REQUEST_URL_CONSTANTS.createWallet, data);

    return res.data;
};

export const getWalletsApi = async () => {
    const res = apiClient.get<ApiResponse<WalletDTO[]>>
    (REQUEST_URL_CONSTANTS.getWallets);

    return (await res).data;
}
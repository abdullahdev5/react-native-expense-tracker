import { createWalletApi, getWalletsApi } from '../api/wallet.api';
import { fakeWalletsData } from '../constants/walletConstants';
import { ApiResponse } from '../types/api';
import { CreateWalletPayload, Wallet } from '../types/wallet';
import { errorResponse, getErrorMessage } from '../utils/error';
import { mapWallet } from '../utils/mapper';

export const createWalletService = async (
  data: CreateWalletPayload,
): Promise<Wallet | null> => {
  const res = await createWalletApi(data);

  if (!res.success) {
    throw new Error(res.message || 'failed to create the Wallet!');
  }

  return res.data ? mapWallet(res.data) : null;
};

// export const createWalletService = async (
//     data: CreateWalletPayload
// ): Promise<ApiResponse<Wallet>> => {
//     try {

//         const res = await createWalletApi(data);

//         return {
//             ...res,
//             data: res.data ? mapWallet(res.data) : undefined
//         };
//     } catch (e: any) {
//         return errorResponse({
//             message: getErrorMessage(e),
//         })
//     }
// }

export const getWalletsService = async (): Promise<Wallet[]> => {
  const res = await getWalletsApi();

  if (!res || !res.data) {
    throw new Error(res.message || 'No Wallets found!');
  }

  return res.data.map(mapWallet);
};

// export const getWalletsService = async (): Promise<ApiResponse<Wallet[]>> => {
//   try {
//     const res = await getWalletsApi();

//     const mappedData = res.data?.map(mapWallet);

//     return {
//       ...res,

//       data: mappedData,
//     };
//   } catch (e) {
//     return errorResponse({ message: getErrorMessage(e) });
//   }
// };

import { getUserApi, setBaseCurrencyApi, updateProfileApi } from '../api/user.api';
import { removeToken } from '../storage/auth.storage';
import { userStore } from '../store/userStore';
import { ApiResponse } from '../types/api';
import {
  User,
  UserDTO,
} from '../types/auth';
import { UpdateProfilePayload } from '../types/user';
import { errorResponse, getErrorMessage } from '../utils/error';
import { mapUser } from '../utils/mapper';



export const getUserService = async (): Promise<ApiResponse<User>> => {
  try {
    const res: ApiResponse<UserDTO> = await getUserApi();

    return {
      ...res,
      data: res.data ? mapUser(res.data) : undefined,
    };
  } catch (e: any) {
    return errorResponse({
      message: getErrorMessage(e),
    });
  }
};

export const setBaseCurrencyService = async (baseCurrency: string): Promise<ApiResponse<User>> => {
  try {
    const res: ApiResponse<UserDTO> = await setBaseCurrencyApi(baseCurrency);

    return {
      ...res,
      data: res.data ? mapUser(res.data) : undefined,
    };
  } catch (e: any) {
    return errorResponse({
      message: getErrorMessage(e),
    });
  }
};

export const updateProfileService = async (payload: UpdateProfilePayload): Promise<ApiResponse<User>> => {
  try {
    const res: ApiResponse<UserDTO> = await updateProfileApi(payload);

    return {
      ...res,
      data: res.data ? mapUser(res.data) : undefined,
    };
  } catch (e: any) {
    return errorResponse({
      message: getErrorMessage(e),
    });
  }
};

export const logoutService = () => {
  removeToken();
  userStore.getState().logout();
  console.log('Logout()');
};

import {
  facebookSignInApi,
  googleSignInApi,
  loginApi,
  registerApi,
} from '../api/auth.api';
import { ERRORS } from '../constants/errorConstants';
import { removeToken, storeToken } from '../storage/auth.storage';
import { userStore } from '../store/userStore';
import { ApiResponse } from '../types/api';
import {
  AuthData,
  AuthDataDTO,
  AuthMetadata,
  LoginPayload,
  RegisterPayload,
  User,
  UserDTO,
} from '../types/auth';
import { errorResponse, getErrorMessage } from '../utils/error';
import { mapAuthData, mapUser } from '../utils/mapper';
import { getAccessToken } from './facebook.service';
import { handleGoogleSignIn } from './google.service';

export const registerService = async (
  data: RegisterPayload,
): Promise<ApiResponse<AuthData>> => {
  try {
    const res: ApiResponse<AuthDataDTO> = await registerApi(data);

    const resData = res.data ? mapAuthData(res.data) : undefined;

    if (!resData || !resData.token || !resData) {
      return errorResponse({
        message: 'Registration succeeded, but profile data is missing!',
      });
    }

    // Storing & User Token
    userStore.getState().setAuth(resData.user, resData.token);

    return {
      ...res,
      data: resData,
    };
  } catch (e: any) {
    return errorResponse({ message: getErrorMessage(e) });
  }
};

export const loginService = async (
  data: LoginPayload,
): Promise<ApiResponse<AuthData>> => {
  try {
    const res: ApiResponse<AuthDataDTO> = await loginApi(data);

    const resData = res.data ? mapAuthData(res.data) : undefined;

    if (!resData || !resData.token || !resData) {
      return errorResponse({
        message: 'Login succeeded, but profile data is missing!',
      });
    }

    // Storing & User Token
    userStore.getState().setAuth(resData.user, resData.token);

    return {
      ...res,
      data: resData,
    };
  } catch (e: any) {
    return errorResponse({
      message: getErrorMessage(e),
    });
  }
};

export const googleSignInService = async (
  metadata?: AuthMetadata,
): Promise<ApiResponse<AuthData>> => {
  try {
    const { idToken, error } = await handleGoogleSignIn();

    if (idToken) {
      const res = await googleSignInApi(idToken, metadata?.baseCurrency);

      const resData = res.data ? mapAuthData(res.data) : undefined;

      if (!resData || !resData.token || !resData) {
        return errorResponse({
          message: 'SignIn succeeded, but profile data is missing!',
        });
      }

      // Storing & User Token
      userStore.getState().setAuth(resData.user, resData.token);

      return {
        ...res,
        data: resData,
      };
    } else {
      return errorResponse({
        message: getErrorMessage(error),
      });
    }
  } catch (e: any) {
    return errorResponse({
      message: getErrorMessage(e),
    });
  }
};

export const facebookSignInService = async (
  metadata?: AuthMetadata,
): Promise<ApiResponse<AuthData>> => {
  try {
    const { accessToken, error } = await getAccessToken();

    if (accessToken) {
      const res = await facebookSignInApi(accessToken, metadata?.baseCurrency);
      
      const resData = res.data ? mapAuthData(res.data) : undefined;

      if (!resData || !resData.token || !resData) {
        return errorResponse({
          message: 'SignIn succeeded, but profile data is missing!',
        });
      }

      // Storing & User Token
      userStore.getState().setAuth(resData.user, resData.token);

      return {
        ...res,
        data: resData,
      };
    } else {
      return errorResponse({
        message: getErrorMessage(error),
      });
    }
  } catch (e) {
    return errorResponse({
      message: getErrorMessage(e),
    });
  }
};

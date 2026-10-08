import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { ERRORS } from '../constants/errorConstants';
import { getErrorMessage } from '../utils/error';

type FacebookSignInResponse = {
  accessToken: string | null;
  error: string | null;
};

export const getAccessToken = async (): Promise<FacebookSignInResponse> => {
  try {
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      return {
        accessToken: null,
        error: 'Failed to retrieve Facebook ACCESS Token!',
      };
    }

    return {
      accessToken: data.accessToken.toString(),
      error: null,
    };
  } catch (e: any) {
    return {
      accessToken: null,
      error: getErrorMessage(e),
    };
  }
};
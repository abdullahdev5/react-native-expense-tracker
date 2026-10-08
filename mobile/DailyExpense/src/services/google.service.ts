import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getErrorMessage } from "../utils/error";
import { ERRORS } from "../constants/errorConstants";

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    offlineAccess: true
});


type GoogleSignInResponse = {
    idToken: string | null;
    error: string | null;
}

export const handleGoogleSignIn = async (): Promise<GoogleSignInResponse> => {
    try {
        await GoogleSignin.hasPlayServices();
        const res = await GoogleSignin.signIn();

        if (res.type === 'cancelled') {
            return {
                idToken: null,
                error: ERRORS.oops,
            };
        }

        const { idToken } = res.data;

        if (!idToken) {
            return {
                idToken: null,
                error: 'Failed to retrieve ID Token!'
            };
        }

        return {
            idToken,
            error: null
        }
    } catch (e: any) {
        return {
            error: getErrorMessage(e),
            idToken: null
        };
    }
}
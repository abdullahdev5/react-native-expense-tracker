import axios, { isAxiosError, AxiosError } from 'axios';
import { getToken } from '../storage/auth.storage';
import { useSnackbarStore } from '../store/snackbarStore';
import { ERRORS } from '../constants/errorConstants';
import { logoutService } from '../services/user.service';
import { REQUEST_URL_CONSTANTS } from '../constants/apiConstants';
import { ApiResponse } from '../types/api';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  async config => {
    // Attach JWT
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`(API Request)`);
    console.log(`baseUrl: ${config.baseURL}`);
    console.log(`url: ${config.url}`);
    console.log(`data: ${config.data}`);

    return config;
  },
  error => Promise.reject(error),
);

let isLoggedOut = false;

// Response Interceptor
apiClient.interceptors.response.use(
  response => {
    console.log('(API Response)');
    console.log(`data: ${JSON.stringify(response.data)}`);

    return response;
  },
  (error: AxiosError) => {
    console.log('(API Error)');
    console.log(`message: ${error.message}`);
    console.log(`Response data: ${JSON.stringify(error.response?.data)}`);

    const originalRequest = error.config;

    // Handle Unauthorized (token expired)
    // Logout
    if (error.response?.status === 401 && originalRequest) {
      const url = originalRequest.url || '';

      const isAuthUrl = [
        REQUEST_URL_CONSTANTS.register,
        REQUEST_URL_CONSTANTS.login,
        REQUEST_URL_CONSTANTS.googleAuth,
        REQUEST_URL_CONSTANTS.facebookAuth,
      ].some(authPath => url.includes(authPath));

      if (!isAuthUrl && !isLoggedOut) {
        isLoggedOut = true;

        console.log('JWT Expired (401 Status)');

        const responseData = error.response.data as ApiResponse;

        console.log('Error Snackbar is showing');
        // Showing Error Snackbar
        useSnackbarStore
          .getState()
          .showSnackbar(responseData.message || ERRORS.unauthorized, {
            type: 'error',
            autoDismiss: false,
            dismissButtonShown: true
          });

        setTimeout(() => {
          logoutService(); // Logging out
          isLoggedOut = false;
        }, 2000);
      }
    }

    return Promise.reject(error);
  },
);

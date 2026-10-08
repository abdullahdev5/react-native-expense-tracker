import { AxiosError, isAxiosError } from "axios";
import { ERRORS } from "../constants/errorConstants";
import { ApiResponse } from "../types/api";

export const getErrorMessage = (error: unknown): string => {
  // If Error is String
  if (typeof error === 'string') return error;

  // Check if it's an AxiosError
  if (isAxiosError(error)) {
    // Try server response message first
    return error.response?.data?.message
        || error.message 
        || ERRORS.unknown;
  }

  // Fallback for other errors
  if (error instanceof Error) {
    return error.message;
  }

  return ERRORS.unknown;
};

export function errorResponse<T>(
  props: Partial<Omit<ApiResponse<T>, 'success'>>
): ApiResponse {
  return {
    success: false,
    message: props.message || ERRORS.unknown,
    statusCode: props.statusCode,
    data: props.data
  }
}
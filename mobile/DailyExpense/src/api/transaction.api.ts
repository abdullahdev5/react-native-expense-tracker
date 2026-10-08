import { apiClient } from '../config/axios';
import { REQUEST_URL_CONSTANTS } from '../constants/apiConstants';
import { ApiResponse } from '../types/api';
import {
  CreateTransactionPayload,
  FetchTransactionsQueryParams,
  TransactionDTO,
  FetchTransactionsResponseDTO,
  TransactionsPushResponseDTO,
} from '../types/transaction';

export const pushTransactionsApi = async (data: CreateTransactionPayload[]) => {
  const res = await apiClient.post<ApiResponse<TransactionsPushResponseDTO>>(
    REQUEST_URL_CONSTANTS.createTransaction,
    data,
  );

  return res.data;
};

export const getTransactionsApi = async (
  query: FetchTransactionsQueryParams,
) => {
  const urlParams = new URLSearchParams();

  if (query.includeDetails) {
    urlParams.append('includeDetails', query.includeDetails.toString());
  }
  if (query.lastSyncedAt) {
    urlParams.append('lastSyncedAt', query.lastSyncedAt.toString());
  }

  const res = await apiClient.get<ApiResponse<FetchTransactionsResponseDTO>>(
    `${REQUEST_URL_CONSTANTS.getTransactions}?${urlParams.toString()}`,
  );

  return res.data;
};
import { getDashboardApi } from '../api/dashboard.api';
import { ApiResponse } from '../types/api';
import { DashboardResponse } from '../types/dashboard';
import { errorResponse, getErrorMessage } from '../utils/error';
import { mapDashboardResponse } from '../utils/mapper';

import { Transaction } from '../types/transaction';
import { TransactionType } from '../types/transaction'; // Assuming these enums exist
import { CurrencyCode } from '../types/types';
import { CategoryIcon } from '../types/category';
import { getCategoriesFromLocalDB } from '../db/operations/categoryOps';
import { getWalletsFromLocalDB } from '../db/operations/walletOps';
import { getTransactionsFromLocalDB } from '../db/operations/transactionOps';
import { useCategoryStore } from '../store/useCategoryStore';
import { useWalletStore } from '../store/useWalletStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { getAllCategoriesService } from './category.service';
import { getWalletsService } from './wallet.service';
import { getTransactionsService } from './transaction.service';
import { saveInitialDataToLocalDB } from '../db/operations/syncOps';
import { useDashboardStore } from '../store/useDashboardStore';

export const getDashboardService = async (): Promise<DashboardResponse> => {
  const res = await getDashboardApi();

  if (!res.success || !res.data) {
    throw new Error(res.message || 'failed to fetch the Dashbaord data!');
  }

  return mapDashboardResponse(res.data);
};
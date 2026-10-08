import { AuthData, AuthDataDTO, User, UserDTO } from '../types/auth';
import {
  Category,
  CategoryColor,
  CategoryDTO,
  CategoryIcon,
} from '../types/category';
import {
  DashboardResponse,
  DashboardResponseDTO,
  TopDashboardCategory,
  TopDashboardCategoryDTO,
} from '../types/dashboard';
import {
  ChartData,
  ChartDataDTO,
  InsightsPeriod,
  InsightsResponse,
  InsightsResponseDTO,
  InsightsResponseSummary,
  InsightsResponseSummaryDTO,
} from '../types/insight';
import {
  Transaction,
  TransactionCategory,
  TransactionCategoryDTO,
  TransactionDTO,
  FetchTransactionsResponse,
  FetchTransactionsResponseDTO,
  TransactionType,
  TransactionWallet,
  TransactionWalletDTO,
  TransactionsPushResponseDTO,
  TransactionsPushResponse,
} from '../types/transaction';
import { CurrencyCode } from '../types/types';
import {
  AllWalletProviders,
  Wallet,
  WalletDTO,
  WalletType,
} from '../types/wallet';

const getDefaultUser = (): User => ({
  id: '',
  name: '',
  email: '',
  picture: '',
  provider: 'email',
  providerId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
});

// User Map
export const mapUser = (user: UserDTO): User => ({
  id: user.id ?? '',
  name: user.name ?? '',
  email: user.email ?? '',
  picture: user.picture ?? '',
  provider: user.provider ?? 'email',
  providerId: user.providerId ?? '',
  baseCurrency: user.baseCurrency ?? null,
  createdAt: new Date(user.createdAt ?? Date.now()),
  updatedAt: new Date(user.updatedAt ?? Date.now()),
});
// AuthData map
export const mapAuthData = (authData: AuthDataDTO): AuthData => ({
  token: authData?.token ?? '',
  user: authData.user ? mapUser(authData.user) : getDefaultUser(),
});

// Wallet Map
export const mapWallet = (wallet: WalletDTO): Wallet => ({
  id: wallet.id ?? '',
  name: wallet.name ?? '',
  type: (wallet.type ?? 'cash') as WalletType,
  provider: (wallet?.provider ?? null) as AllWalletProviders | null,
  currency: wallet.currency ?? '',
  balance: wallet.balance ?? 0,
  createdAt: new Date(wallet.createdAt ?? Date.now()),
  updatedAt: new Date(wallet.updatedAt ?? Date.now()),
});

// Category Map
export const mapCategory = (category: CategoryDTO): Category => ({
  id: category.id ?? '',
  name: category.name ?? '',
  type: category.type ?? 'expense',
  icon: (category.icon ?? 'other') as CategoryIcon,
  color: (category.color ?? 'yellow') as CategoryColor,
  isDefault: category.isDefault ?? true,
  createdAt: new Date(category.createdAt ?? Date.now()),
  updatedAt: new Date(category.updatedAt ?? Date.now()),
});

// Transaction Map
/* Transaction Category Map */
export const mapTransactionCategory = (
  category: TransactionCategoryDTO,
): TransactionCategory => ({
  id: category.id ?? '',
  name: category.name ?? '',
  color: (category.color ?? 'yellow') as CategoryColor,
  icon: (category.icon ?? 'yellow') as CategoryIcon,
});
/* Transaction Wallet Map */
export const mapTransactionWallet = (
  wallet: TransactionWalletDTO,
): TransactionWallet => ({
  id: wallet.id ?? '',
  name: wallet.name ?? '',
  type: (wallet.type ?? 'cash') as WalletType,
  provider: (wallet.provider || null) as AllWalletProviders | null,
  currency: (wallet.currency ?? 'PKR') as CurrencyCode,
});

export const mapTransaction = (transaction: TransactionDTO): Transaction => ({
  id: transaction.id ?? '',
  title: transaction.title ?? '',
  description: transaction.description ?? 'expense',
  type: (transaction.type ?? 'expense') as TransactionType,
  amount: transaction.amount ?? 0,
  categoryId: transaction.categoryId ?? '',
  category: transaction.category
    ? mapTransactionCategory(transaction.category)
    : null,
  walletId: transaction.walletId ?? '',
  wallet: transaction.wallet ? mapTransactionWallet(transaction.wallet) : null,
  currency: (transaction.currency ?? 'PKR') as CurrencyCode,
  date: new Date(transaction.date ?? Date.now()),
  updatedAt: new Date(transaction.updatedAt ?? Date.now()),
  merchantName: transaction.merchantName ?? '',
  merchantLogo: transaction.merchantLogo || null,
});

export const mapTransactionResponse = (
  res: FetchTransactionsResponseDTO,
): FetchTransactionsResponse => ({
  data: res.data ? res.data.map(mapTransaction) : [],
  syncTimestamp: res.syncTimestamp ?? Date.now(),
});

export const mapTransacrionsPushResponse = (
  res: TransactionsPushResponseDTO
): TransactionsPushResponse => ({
  transactions: res.transactions ? res.transactions.map(mapTransaction) : [],
  syncTime: res.syncTime
});

// Dashboard Response Map
/* Top Dashboard Category Map */
export const mapTopDashboardCategory = (
  topCategory: TopDashboardCategoryDTO,
): TopDashboardCategory => ({
  categoryId: topCategory.categoryId ?? '',
  name: topCategory.name ?? '',
  color: topCategory.color ?? '',
  total: topCategory.total ?? 0,
  percentage: topCategory.percentage ?? 0,
});

export const mapDashboardResponse = (
  response: DashboardResponseDTO,
): DashboardResponse => {
  return {
    totalBalance: response.totalBalance ?? 0,
    baseCurrency: (response.baseCurrency as CurrencyCode) ?? 'PKR',
    topCategories: response.topCategories
      ? response.topCategories.map(mapTopDashboardCategory)
      : [],
  };
};

// export const mapDashboardResponse = (response: DashboardResponseDTO): Partial<DashboardResponse> => {
//     // const mapped: Partial<DashboardResponse> = {};

//     // if (response.totalBalance) mapped.totalBalance = response.totalBalance;
//     // if (response.baseCurrency) mapped.baseCurrency = response.baseCurrency as CurrencyCode;

//     // if (response.topCategories) {
//     //     mapped.topCategories = response.topCategories.map(mapTopDashboardCategory);
//     // }

//     // if (response.recentTransactions) {
//     //     mapped.recentTransactions = response.recentTransactions.map(mapTransaction);
//     // }

//     return {
//         ...(response.totalBalance !== undefined && { totalBalance: response.totalBalance }),
//         ...(response.baseCurrency && { baseCurrency: response.baseCurrency as CurrencyCode }),
//         ...(response.topCategories && {
//             topCategories: response.topCategories.map(mapTopDashboardCategory)
//         }),
//         ...(response.recentTransactions && {
//             recentTransactions: response.recentTransactions.map(mapTransaction)
//         }),
//     };

//     // return mapped;

//     // totalBalance: response.totalBalance ?? 0,
//     // baseCurrency: (response.baseCurrency ?? 'PKR') as CurrencyCode,
//     // topCategories: response.topCategories ? response.topCategories.map(mapTopDashboardCategory) : [],
//     // recentTransactions: response.recentTransactions ? response.recentTransactions.map(mapTransaction) : []
// };

// Statistics Mapper
// Chart Data Mapper
export const mapInsightsSummary = (
  summary: InsightsResponseSummaryDTO,
): InsightsResponseSummary => ({
  totalAmount: summary.totalAmount,
  baseCurrency: summary.baseCurrency as CurrencyCode,
  period: summary.period as InsightsPeriod,
  type: summary.type as TransactionType,
  label: summary.label,
});
export const mapChartData = (chartData: ChartDataDTO): ChartData => ({
  index: chartData.index,
  label: chartData.label,
  value: chartData.value,
  isCurrent: chartData.isCurrent,
});
export const mapInsightsResponse = (
  rawStats: InsightsResponseDTO,
): InsightsResponse => ({
  summary: mapInsightsSummary(rawStats.summary),
  chartData: rawStats.chartData.map(mapChartData),
});
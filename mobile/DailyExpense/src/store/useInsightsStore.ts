import { create } from 'zustand';
import {
  ChartData,
  InsightsPeriod,
  InsightsResponse,
  InsightsResponseSummary,
} from '../types/insight';
import { getInsightsService } from '../services/insight.service';
import { TransactionType } from '../types/transaction';
import { ApiResponse } from '../types/api';


const getCacheKey = (period: InsightsPeriod, type: TransactionType) => `${period}_${type}`;

type FetchInsightsParams = {
    period: InsightsPeriod,
    type: TransactionType,
    forceRefresh?: boolean;
}

export type InsightsState = {
  cache: Record<string, { summary: InsightsResponseSummary; chartData: ChartData[] }>;
  // summary: InsightsResponseSummary | null;
  // chartData: ChartData[];
  isLoading: boolean;
  errorMessage: string | null;
  // cachedPeriod: InsightsPeriod;
  // cachedType: TransactionType;
  fetchInsights: (params: FetchInsightsParams) => Promise<ApiResponse<InsightsResponse> | null>;
  updateInsights: (newInsights: InsightsResponse) => void;
  clearCache: () => void;
};

export const useInsightsStore = create<InsightsState>((set, get) => ({
  // summary: null,
  // chartData: [],
  cache: {},
  isLoading: false,
  errorMessage: null,
  // cachedPeriod: 'daily',
  // cachedType: 'income',
  fetchInsights: async ({ period, type, forceRefresh = false }: FetchInsightsParams) => {
    // const { cachedPeriod, cachedType, chartData } = get();
    const { cache } = get();
    const cacheKey = getCacheKey(period, type);

    if (!forceRefresh && cache[cacheKey]) {
      console.log(`Insights Already Exists for ${type} - ${period}. Skipping fetching!`);
      return null;
    }

    // if (
    //   !forceRefresh && chartData.length > 0
    //   && cachedPeriod === period
    //   && cachedType === type
    // ) {
    //   console.log(`Insights Already Exists for ${type} - ${period}. Skipping fetching!`);
    //   return null;
    // }


    set({ isLoading: true, errorMessage: null });

    const res = await getInsightsService(period, type);

    if (res.success && res.data) {

      set((state) => ({
        isLoading: false,
        cache: {
          ...state.cache,

          [cacheKey]: {
            summary: res.data!.summary,
            chartData: res.data!.chartData
          }
        },
        // summary: res.data.summary,
        // chartData: res.data.chartData,
        // cachedPeriod: period,
        // cachedType: type
      }));
    } else {
      set({
        isLoading: false,
        errorMessage: res.message,
      });
    }

    return res;
  },
  updateInsights: (newInsights: InsightsResponse) => {
    const cacheKey = getCacheKey(newInsights.summary.period, newInsights.summary.type);
    set((state) => ({
      cache: {
        ...state.cache,

        [cacheKey]: {
          summary: newInsights.summary,
          chartData: newInsights.chartData
        }
      }
      // summary: newInsights.summary,
      // chartData: newInsights.chartData,
    }));
  },
  clearCache: () => set({ cache: {} })
}));

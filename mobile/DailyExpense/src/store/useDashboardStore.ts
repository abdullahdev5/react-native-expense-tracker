import { create } from 'zustand';
import { DashboardResponse } from '../types/dashboard';
import { getDashboardService } from '../services/dashboard.service';

export type DashboardState = {
  data: DashboardResponse | null;
  error: string | null;
  updateDashboard: (update: Partial<DashboardResponse>) => void;
  fetchDashboard: () => void;
};

export const useDashboardStore = create<DashboardState>(set => ({
  data: null,
  error: null,
  updateDashboard: update =>
    set(state => ({
      data: state.data
        ? { ...state.data, ...update }
        : (update as DashboardResponse),
    })),
  fetchDashboard: async () => {
    try {
      const dashboardData = await getDashboardService();

      set({
        data: dashboardData,
        error: null,
      });
    } catch (e: any) {
      set({
        error: e.message,
      });
    }
  },
}));

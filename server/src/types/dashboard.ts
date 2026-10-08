import { ITransaction } from "./transaction";


export interface TopDashboardCategory {
    categoryId: string;
    name: string;
    color: string;
    total: number;
    percentage: number;
}

export interface DashboardResponse {
  totalBalance: number;
  baseCurrency: string;
  topCategories: TopDashboardCategory[];
}


export type DashboardUpdate = {
  totalBalance: number;
  baseCurrency: string;
  topCategories: TopDashboardCategory[];
}
import { Transaction, TransactionDTO } from "./transaction";
import { CurrencyCode } from "./types";

/* Models */
export interface TopDashboardCategory {
    categoryId: string;
    name: string;
    color: string;
    total: number;
    percentage: number;
}

export interface DashboardResponse {
  totalBalance: number;
  baseCurrency: CurrencyCode;
  topCategories: TopDashboardCategory[];
}


/* DTO's */
export interface DashboardResponseDTO {
  totalBalance?: number;
  baseCurrency?: string;
  topCategories?: TopDashboardCategoryDTO[] | null;
}

export interface TopDashboardCategoryDTO {
    categoryId?: string;
    name?: string;
    color?: string;
    total?: number;
    percentage?: number;
}

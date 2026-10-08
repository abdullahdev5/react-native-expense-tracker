import { TransactionType } from "./transaction";
import { CurrencyCode } from "./types";

/* Models */
export interface InsightsResponse {
    summary: InsightsResponseSummary;
    chartData: ChartData[];
};

export interface InsightsResponseSummary {
    totalAmount: number;
    baseCurrency: CurrencyCode;
    period: InsightsPeriod;
    type: TransactionType;
    label: string;
}

export interface ChartData {
    index: number;
    label: string;
    value: number; // amount
    isCurrent: boolean;
};



/* DTO's */
export interface InsightsResponseDTO {
    summary: InsightsResponseSummaryDTO;
    chartData: ChartDataDTO[];
}

export interface InsightsResponseSummaryDTO {
    totalAmount: number;
    baseCurrency: string;
    period: string;
    type: string;
    label: string;
}

export interface ChartDataDTO {
    index: number;
    label: string;
    value: number;
    isCurrent: boolean;
}



/* Types */
export type InsightsPeriod = 'daily' | 'monthly' | 'yearly';
export enum InsightsPeriods {
    daily = 'daily',
    monthly = 'monthly',
    yearly = 'yearly'
}

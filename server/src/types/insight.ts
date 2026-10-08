import { TransactionType } from "./transaction";

export type ChartData = {
  index: number; // starts from 1
  label: string; // daily (Sun, Mon), yearly (Jan, Feb)
  value: number; // Amount
  isCurrent: boolean; // Current Day, Month or Not
};

export interface InsightsResponse {
  summary: InsightsResponseSummary;
  chartData: ChartData[];
};

export type InsightsResponseSummary = {
  totalAmount: number;
  baseCurrency: string;
  period: InsightsPeriod;
  type: TransactionType;
  label: string;
}

export type InsightsRequestQueryParams = {
  period: InsightsPeriod;
  type: TransactionType;
}

export type InsightsPeriod = 'daily' | 'monthly' | 'yearly';
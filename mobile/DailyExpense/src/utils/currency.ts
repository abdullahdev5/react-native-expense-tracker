import { currencies } from "../constants/currencies";
import { CurrencyBase } from "../types/types";

const currencyMap = new Map<string, CurrencyBase>(
    currencies.map(c => [c.code, c])
);

export const getCurrencySymbol = (code?: string | null): string => {
  if (!code) return '';
  return currencyMap.get(code)?.symbol ?? code;
};

export const getCurrencyName = (code?: string | null): string => {
  if (!code) return '';
  return currencyMap.get(code)?.name ?? code;
};
import { DropdownItem } from "@components/Dropdown";
import { CurrencyBase } from "../types/types";

export const currencies = [
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨.' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM.' },
] as const satisfies readonly CurrencyBase[];


export const currenciesDropdownData: DropdownItem<CurrencyBase>[] = 
    currencies.map(c => ({
        label: `${c.code} - ${c.name}`,
        value: c.code,
        data: c,
    }));
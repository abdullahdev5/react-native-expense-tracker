import { currencies } from "../constants/currencies";


export type CurrencyBase = {
  code: string;
  name: string;
  symbol: string;
};

export type CurrencyCode = (typeof currencies)[number]['code'];
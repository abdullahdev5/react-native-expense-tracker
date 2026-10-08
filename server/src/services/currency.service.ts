import axios from "axios";
import { ExchangeRate } from "../models/ExchangeRate";

class CurrencyService {

  public async getRate(from: string, to: string) {
    if (from === to) return 1;

    const existing = await ExchangeRate.findOne({ from, to });

    const isFresh = existing &&
        (Date.now() - existing.updatedAt.getTime()) < (6 * 60 * 60 * 1000); // 6 hours

    if (isFresh) {
        return existing.rate;
    }

    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${from}`,
    );

    const rate = response.data.rates[to];

    await ExchangeRate.findOneAndUpdate(
        { from, to },
        { rate, updatedAt: new Date() },
        { upsert: true }
    );

    return rate;
  }
}

export const currencyService = new CurrencyService();

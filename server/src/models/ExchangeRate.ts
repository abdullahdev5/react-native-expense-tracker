import mongoose from "mongoose";
import { IExchangeRate } from "../types/currency";
import { MODEL_NAMES } from "../constants/dbConstants";

const exchangeRateSchema = new mongoose.Schema<
  IExchangeRate,
  mongoose.Model<IExchangeRate, {}, {}>,
  {}
>(
  {
    from: {
      type: String,
      required: true,
      trim: true
    },
    to: { type: String, required: true, trim: true },
    rate: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);


export const ExchangeRate = mongoose.model<
  IExchangeRate,
  mongoose.Model<IExchangeRate, {}, {}>
>(MODEL_NAMES.EXCHANGE_RATE, exchangeRateSchema);

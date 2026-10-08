import { Document } from "mongoose";

export interface IExchangeRate extends Document {
    from: string;
    to: string;
    rate: number;
    updatedAt: Date;
};
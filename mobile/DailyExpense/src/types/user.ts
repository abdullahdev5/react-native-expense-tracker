import { CurrencyCode } from "./types";


export type UpdateProfilePayload = {
    name?: string;
    picture?: string;
    baseCurrency?: CurrencyCode;
}
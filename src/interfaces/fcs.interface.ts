import { Document } from "mongoose";

export interface IFCS extends Document {
    FEE_ID: string;
    FEE_CURRENCY: "NGN";
    FEE_LOCALE: "LOCL" | "INTL";
    FEE_ENTITY: "CREDIT-CARD" | "DEBIT-CARD" | "BANK-ACCOUNT" | "USSD" | "WALLET-ID";
    ENTITY_PROPERTY: string;
    FEE_TYPE: "FLAT" | "PERC" | "FLAT_PERC";
    FEE_VALUE: string;
    generateFCS(): IFCS;
}

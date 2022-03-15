import { Document } from "mongoose";

export interface IPaymentEntity extends Document {
    Issuer: string;
    Brand: string;
    Number: string;
    SixID: number;
    Type: "CREDIT-CARD" | "DEBIT-CARD" | "BANK-ACCOUNT" | "USSD" | "WALLET-ID";
    Country: string;
};
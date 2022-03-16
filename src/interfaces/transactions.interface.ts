import { Document } from "mongoose";

interface ICustomer {
    ID: number;
    EmailAddress: string;
    FullName: string;
    BearsFee: boolean;
}

interface IPaymentEntity {
    ID: number;
    Issuer: string;
    Brand: string;
    Number: string;
    SixID: number;
    Type: "CREDIT-CARD" | "DEBIT-CARD" | "BANK-ACCOUNT" | "USSD" | "WALLET-ID";
    Country: string;
};

export interface ITransaction extends Document {
    ID: number;
    Amount: number;
    Currency: string;
    CurrencyCountry: string;
    Customer: ICustomer
    PaymentEntity: IPaymentEntity
}
import { Schema, model } from "mongoose";
import { ITransaction } from "@interfaces/transactions.interface";

const TransactionSchema = new Schema<ITransaction>({
    ID: { type: Number, required: true },
    Amount: { type: Number, required: true },
    Currency: { type: String, required: true },
    CurrencyCountry: { type: String, required: true },
    Customer: { 
        ID: { type: Number, required: true },
        EmailAddress: { type: String, required: true },
        FullName: { type: String, required: true },
        BearsFee: { type: Boolean, required: true },
    },
    PaymentEntity: { 
        ID: { type: Number, required: true },
        Issuer: { type: String, required: true },
        Brand: { type: String, required: true },
        Number: { type: String, required: true },
        SixID: { type: Number, required: true },
        Type: { type: String, enum: ["CREDIT-CARD", "DEBIT-CARD", "BANK-ACCOUNT", "USSD", "WALLET-ID"], required: true },
        Country: { type: String, required: true },
     }
});

export default model<ITransaction>('Transaction', TransactionSchema);
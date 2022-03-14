import { Schema, model } from "mongoose";
import { ITransaction } from "@interfaces/transactions.interface";

const TransactionSchema = new Schema<ITransaction>({
    Amount: { type: Number, required: true },
    Currency: { type: String, required: true },
    CurrencyCountry: { type: String, required: true },
    Customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    PaymentEntity: { type: Schema.Types.ObjectId, ref: "PaymentEntity", required: true }
});

export default model<ITransaction>('Transaction', TransactionSchema);
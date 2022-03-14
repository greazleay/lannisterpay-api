import { Schema, model } from "mongoose";
import { IPaymentEntity } from "@interfaces/paymentEntity.interface";

const PaymentEntitySchema = new Schema<IPaymentEntity>({
    Issuer: { type: String, required: true },
    Brand: { type: String, required: true },
    Number: { type: String, required: true, minlength: 16, maxlength: 16 },
    SixID: { type: Number, required: true, min: 6, max: 6 },
    Type: { type: String, enum: ["CREDIT-CARD", "DEBIT-CARD", "BANK-ACCOUNT", "USSD", "WALLET-ID"], required: true },
    Country: { type: String, required: true }
});

export default model<IPaymentEntity>('PaymentEntity', PaymentEntitySchema);
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
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
        Type: { type: String, enum: ["CREDIT-CARD", "DEBIT-CARD", "BANK-ACCOUNT", "USSD", "WALLET-ID", "*"], required: true },
        Country: { type: String, required: true },
    }
});
exports.default = (0, mongoose_1.model)('Transaction', TransactionSchema);

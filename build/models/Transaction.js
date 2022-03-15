"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    Amount: { type: Number, required: true },
    Currency: { type: String, required: true },
    CurrencyCountry: { type: String, required: true },
    Customer: { type: mongoose_1.Schema.Types.ObjectId, ref: "Customer", required: true },
    PaymentEntity: { type: mongoose_1.Schema.Types.ObjectId, ref: "PaymentEntity", required: true }
});
exports.default = (0, mongoose_1.model)('Transaction', TransactionSchema);

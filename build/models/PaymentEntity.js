"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PaymentEntitySchema = new mongoose_1.Schema({
    Issuer: { type: String, required: true },
    Brand: { type: String, required: true },
    Number: { type: String, required: true, minlength: 16, maxlength: 16 },
    SixID: { type: Number, required: true, min: 6, max: 6 },
    Type: { type: String, enum: ["CREDIT-CARD", "DEBIT-CARD", "BANK-ACCOUNT", "USSD", "WALLET-ID"], required: true },
    Country: { type: String, required: true }
});
exports.default = (0, mongoose_1.model)('PaymentEntity', PaymentEntitySchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FCSSchema = new mongoose_1.Schema({
    FEE_ID: { type: String, required: true },
    FEE_CURRENCY: { type: String, required: true },
    FEE_LOCALE: { type: String, enum: ["LOCL", "INTL"], required: true },
    FEE_ENTITY: { type: String, enum: ["CREDIT-CARD", "DEBIT-CARD", "BANK-ACCOUNT", "USSD", "WALLET-ID"], required: true },
    ENTITY_PROPERTY: { type: String, required: true },
    FEE_TYPE: { type: String, enum: ["FLAT", "PERC", "FLAT_PERC"], required: true },
    FEE_VALUE: { type: String, required: true }
});
FCSSchema.methods.generateFCS = function () {
    return {
        FEE_ID: this.FEE_ID,
        FEE_CURRENCY: this.FEE_CURRENCY,
        FEE_LOCALE: this.FEE_LOCALE,
        FEE_ENTITY: this.FEE_ENTITY,
        ENTITY_PROPERTY: this.ENTITY_PROPERTY,
        FEE_TYPE: this.FEE_TYPE,
        FEE_VALUE: this.FEE_VALUE
    };
};
exports.default = (0, mongoose_1.model)('FCS', FCSSchema);

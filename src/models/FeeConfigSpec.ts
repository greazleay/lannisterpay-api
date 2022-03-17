import { Schema, model } from "mongoose";
import { IFeeConfigSpec } from "@src/interfaces/feeConfigSpec.interface";

const FeeConfigSpecSchema = new Schema<IFeeConfigSpec>({
    FEE_ID: { type: String, required: true },
    FEE_CURRENCY: { type: String, required: true },
    FEE_LOCALE: { type: String, enum: ["LOCL", "INTL", "*"], required: true },
    FEE_ENTITY: { type: String, enum: ["CREDIT-CARD", "DEBIT-CARD", "BANK-ACCOUNT", "USSD", "WALLET-ID", "*"], required: true },
    ENTITY_PROPERTY: { type: String, required: true },
    FEE_TYPE: { type: String, enum: ["FLAT", "PERC", "FLAT_PERC"], required: true },
    FEE_VALUE: { type: String, required: true }
});


FeeConfigSpecSchema.methods.generateFeeConfigSpec = function () {
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

FeeConfigSpecSchema.methods.computeFee = function (amount: number) {
    switch (this.FEE_TYPE) {
        case "FLAT":
            return parseFloat(this.FEE_VALUE);
        case "PERC":
            return amount * parseFloat(this.FEE_VALUE) / 100;
        case "FLAT_PERC":
            const splitFeeValue: string[] = this.FEE_VALUE.split(":");
            return (amount * parseFloat(splitFeeValue[1]) / 100) + parseFloat(splitFeeValue[0]);
        default:
            return 0;
    };
};


export default model<IFeeConfigSpec>('FeeConfigSpec', FeeConfigSpecSchema);
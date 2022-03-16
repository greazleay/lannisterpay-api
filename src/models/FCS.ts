import { Schema, model } from "mongoose";
import { IFCS } from "@interfaces/fcs.interface";

const FCSSchema = new Schema<IFCS>({
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
}


export default model<IFCS>('FCS', FCSSchema);
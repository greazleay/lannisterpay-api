import { Document } from "mongoose";
import { ICustomer } from "@interfaces/customers.interface";
import { IPaymentEntity } from "@interfaces/paymentEntity.interface";


export interface ITransaction extends Document {
    _doc?: any;
    Amount: number;
    Currency: string;
    CurrencyCountry: string;
    Customer: ICustomer
    PaymentEntity: IPaymentEntity
}
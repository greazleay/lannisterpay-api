"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_compute_transaction_fee = void 0;
const express_validator_1 = require("express-validator");
const FeeConfigSpec_1 = __importDefault(require("../models/FeeConfigSpec"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
exports.post_compute_transaction_fee = [
    (0, express_validator_1.body)('ID').isNumeric().withMessage('ID must be a numeric value'),
    (0, express_validator_1.body)('Amount').isInt({ min: 1 }).withMessage('Amount must be an integer'),
    (0, express_validator_1.body)('Currency').isString().withMessage('Currency must be a string'),
    (0, express_validator_1.body)('Customer').isObject().withMessage('Customer must be an object'),
    (0, express_validator_1.body)('Customer.ID').isNumeric().withMessage('Customer.ID must be a numeric value'),
    (0, express_validator_1.body)('Customer.EmailAddress').isEmail().withMessage('Customer.EmailAddress must be an email address').normalizeEmail(),
    (0, express_validator_1.body)('Customer.FullName').isString().withMessage('Customer.FullName must be a string').isLength({ min: 1, max: 100 }).withMessage('Customer.FullName must be a non-empty string of length 1-100').trim().escape(),
    (0, express_validator_1.body)('Customer.BearsFee').isBoolean().withMessage('Customer.BearsFee must be a boolean'),
    (0, express_validator_1.body)('PaymentEntity').isObject().withMessage('PaymentEntity must be an object'),
    (0, express_validator_1.body)('PaymentEntity.ID').isNumeric().withMessage('PaymentEntity.ID must be a numeric value'),
    (0, express_validator_1.body)('PaymentEntity.Issuer').isString().withMessage('PaymentEntity.Issuer must be a string').isLength({ min: 1, max: 100 }).withMessage('PaymentEntity.Issuer must be a non-empty string of length 1-100').trim().escape(),
    (0, express_validator_1.body)('PaymentEntity.Brand').isString().withMessage('PaymentEntity.Brand must be a string'),
    (0, express_validator_1.body)('PaymentEntity.Number').isString().withMessage('PaymentEntity.Number must be a string').isLength({ min: 16, max: 16 }).withMessage('PaymentEntity.Number must be a non-empty string of length 16'),
    (0, express_validator_1.body)('PaymentEntity.SixID').isInt({ min: 1 }).withMessage('PaymentEntity.SixID must be an integer'),
    (0, express_validator_1.body)('PaymentEntity.Type').isString().withMessage('PaymentEntity.Type must be a string').matches(/^(CREDIT-CARD|DEBIT-CARD|BANK-ACCOUNT|USSD|WALLET-ID)$/).withMessage('PaymentEntity.Type must be one of CREDIT-CARD, DEBIT-CARD, BANK-ACCOUNT, USSD, WALLET-ID'),
    (0, express_validator_1.body)('PaymentEntity.Country').isString().withMessage('PaymentEntity.Country must be a string').matches(/^(NG|US)$/).withMessage('PaymentEntity.Country must be one of NG, US'),
    async (req, res, next) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            const { ID, Amount, Currency, CurrencyCountry, Customer, PaymentEntity } = req.body;
            const feeConfigSpecs = await FeeConfigSpec_1.default.find({});
            const formatedFCS = feeConfigSpecs.map(fcs => {
                const { FEE_ID, FEE_TYPE, FEE_VALUE, ...rest } = fcs.generateFeeConfigSpec();
                const fcsObject = {
                    FEE_ID,
                    FEE_TYPE,
                    FEE_VALUE,
                    fcsToCompare: { ...rest }
                };
                return fcsObject;
            });
            const computedFCSFromPaymentEntity = {
                FEE_CURRENCY: Currency ? Currency : '*',
                FEE_LOCALE: !CurrencyCountry ? '*' : CurrencyCountry === PaymentEntity.Country ? 'LOCL' : 'INTL',
                FEE_ENTITY: PaymentEntity.Type ? PaymentEntity.Type : '*',
                ENTITY_PROPERTY: PaymentEntity.Brand ? PaymentEntity.Brand : '*',
            };
            console.log(computedFCSFromPaymentEntity);
            console.log("==========================================================");
            console.log(formatedFCS);
            const matchedFCS = formatedFCS.filter(fcs => JSON.stringify(fcs.fcsToCompare) === JSON.stringify(computedFCSFromPaymentEntity));
            if (!matchedFCS.length)
                return res.status(404).json({ errors: [{ msg: 'No matching fee configuration specification found' }] });
            const { FEE_ID } = matchedFCS[0];
            const fcsToApply = await FeeConfigSpec_1.default.findOne({ FEE_ID });
            const computedFee = fcsToApply.computeFee(Amount);
            const transaction = new Transaction_1.default({
                ID,
                Amount,
                Currency,
                CurrencyCountry,
                Customer,
                PaymentEntity,
            });
            await transaction.save();
            return res.status(200).json({
                AppliedFeeID: FEE_ID,
                AppliedFeeValue: computedFee,
                ChargeAmount: PaymentEntity.BearsFee ? Amount + computedFee : Amount,
                SettlementAmount: PaymentEntity.BearsFee ? Amount : Amount - computedFee,
            });
        }
        catch (error) {
            return next(error);
        }
    }
];
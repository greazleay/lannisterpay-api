import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import FeeConfigSpec from "@models/FeeConfigSpec";

export const post_compute_transaction_fee = [
    body('ID').isNumeric().withMessage('ID must be a numeric value'),
    body('Amount').isInt({ min: 1 }).withMessage('Amount must be an integer'),
    body('Currency').isString().withMessage('Currency must be a string'),
    body('Customer').isObject().withMessage('Customer must be an object'),
    body('Customer.ID').isNumeric().withMessage('Customer.ID must be a numeric value'),
    body('Customer.EmailAddress').isEmail().withMessage('Customer.EmailAddress must be an email address').normalizeEmail(),
    body('Customer.FullName').isString().withMessage('Customer.FullName must be a string').isLength({ min: 1, max: 100 }).withMessage('Customer.FullName must be a non-empty string of length 1-100').trim().escape(),
    body('Customer.BearsFee').isBoolean().withMessage('Customer.BearsFee must be a boolean'),
    body('PaymentEntity').isObject().withMessage('PaymentEntity must be an object'),
    body('PaymentEntity.ID').isNumeric().withMessage('PaymentEntity.ID must be a numeric value'),
    body('PaymentEntity.Issuer').isString().withMessage('PaymentEntity.Issuer must be a string').isLength({ min: 1, max: 100 }).withMessage('PaymentEntity.Issuer must be a non-empty string of length 1-100').trim().escape(),
    body('PaymentEntity.Brand').isString().withMessage('PaymentEntity.Brand must be a string'),
    body('PaymentEntity.Number').isString().withMessage('PaymentEntity.Number must be a string').isLength({ min: 16, max: 16 }).withMessage('PaymentEntity.Number must be a non-empty string of length 16'),
    body('PaymentEntity.SixID').isString().withMessage('PaymentEntity.SixID must be a string').isLength({ min: 6, max: 6 }).withMessage('PaymentEntity.SixID must be a non-empty string of length 6'),
    body('PaymentEntity.Type').isString().withMessage('PaymentEntity.Type must be a string').matches(/^(CREDIT-CARD|DEBIT-CARD|BANK-ACCOUNT|USSD|WALLET-ID)$/).withMessage('PaymentEntity.Type must be one of CREDIT-CARD, DEBIT-CARD, BANK-ACCOUNT, USSD, WALLET-ID'),
    body('PaymentEntity.Country').isString().withMessage('PaymentEntity.Country must be a string').matches(/^(NG|US)$/).withMessage('PaymentEntity.Country must be one of NG, US'),

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { ID, Amount, Currency, CurrencyCountry, Customer, PaymentEntity } = req.body;

            if (Currency === "USD") return res.status(422).json({ Error: "No fee configuration for USD transactions." });

            // Get All Fee Config Specs
            const feeConfigSpecs = await FeeConfigSpec.find({});

            // Compute probable fee config spec from transaction details
            const computedFCSFromPaymentEntity = {
                FEE_CURRENCY: Currency ? Currency : '*',
                FEE_LOCALE: !CurrencyCountry ? '*' : CurrencyCountry === PaymentEntity.Country ? 'LOCL' : 'INTL',
                FEE_ENTITY: PaymentEntity.Type ? PaymentEntity.Type : '*',
                ENTITY_PROPERTY: PaymentEntity.Brand ? PaymentEntity.Brand : '*',
            };

            // Compare the computedFCSFromPaymentEntity with the available FeeConfigSpecs
            const applicableFeeConfigSpecs = feeConfigSpecs.filter(fcs => {
                const { FEE_CURRENCY, FEE_LOCALE, FEE_ENTITY, ENTITY_PROPERTY } = fcs.generateFeeConfigSpec();
                return (
                    (FEE_CURRENCY === computedFCSFromPaymentEntity.FEE_CURRENCY || FEE_CURRENCY === '*') &&
                    (FEE_LOCALE === computedFCSFromPaymentEntity.FEE_LOCALE || FEE_LOCALE === '*') &&
                    (FEE_ENTITY === computedFCSFromPaymentEntity.FEE_ENTITY || FEE_ENTITY === '*') &&
                    (ENTITY_PROPERTY === computedFCSFromPaymentEntity.ENTITY_PROPERTY || ENTITY_PROPERTY === '*')
                );
            });

            // If no applicable FeeConfigSpecs, return error
            if (!applicableFeeConfigSpecs.length) return res.status(422).json({ Error: "No fee configuration for this transaction." });

            if (applicableFeeConfigSpecs.length === 1) {

                const computedFee = applicableFeeConfigSpecs[0].computeAppliedFee(Amount);
                return res.status(200).json({
                    AppliedFeeID: applicableFeeConfigSpecs[0].FEE_ID,
                    AppliedFeeValue: Math.round(computedFee),
                    ChargeAmount: Customer.BearsFee ? Amount + computedFee : Amount,
                    SettlementAmount: Customer.BearsFee ? Amount : Amount - computedFee,
                });

            } else {

                // Calculate best applicable FeeConfigSpec
                const getWildCardValues = (arr: string[]) => {
                    const wildCardValues = arr.filter(x => x === '*');
                    return wildCardValues.length;
                };

                const wildCardValuesArray: { i: number, value: number }[] = [];
                applicableFeeConfigSpecs.forEach((fcs, i) => {
                    wildCardValuesArray.push({ i, value: getWildCardValues(Object.values(fcs.generateFeeConfigSpec())) });
                });

                const min: { i: number, value: number } = wildCardValuesArray.reduce((prev, curr) => prev.value < curr.value ? prev : curr);
                const computedFee = applicableFeeConfigSpecs[min.i].computeAppliedFee(Amount);

                return res.status(200).json({
                    AppliedFeeID: applicableFeeConfigSpecs[min.i].FEE_ID,
                    AppliedFeeValue: Math.round(computedFee),
                    ChargeAmount: Customer.BearsFee ? Amount + computedFee : Amount,
                    SettlementAmount: Customer.BearsFee ? Amount : Amount - computedFee,
                });
            }

        } catch (error) {
            return next(error);
        }
    }

];
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_create_fcs = void 0;
const FCS_1 = __importDefault(require("../models/FCS"));
const express_validator_1 = require("express-validator");
exports.post_create_fcs = [
    (0, express_validator_1.body)('FeeConfigurationSpec').isArray().withMessage('FeeConfigurationSpec must be an array'),
    (0, express_validator_1.body)('FeeConfigurationSpec.*.FEE_ID').isString().withMessage('FEE_ID must be a string').isLength({ min: 8, max: 8 }).withMessage('FEE_ID must be a non-empty string of length 8'),
    (0, express_validator_1.body)('FeeConfigurationSpec.*.FEE_CURRENCY').isString().withMessage('FEE_CURRENCY must be a string').isLength({ min: 3, max: 3 }).withMessage('FEE_CURRENCY must be a non-empty string of length 3'),
    (0, express_validator_1.body)('FeeConfigurationSpec.*.FEE_LOCALE').isString().withMessage('FEE_LOCALE must be a string').isLength({ min: 4, max: 4 }).withMessage('FEE_LOCALE must be a non-empty string of length 3').matches(/^(LOCL|INTL)$/).withMessage('FEE_LOCALE must be one of "LOCL" or "INTL"'),
    (0, express_validator_1.body)('FeeConfigurationSpec.*.FEE_ENTITY').isString().withMessage('FEE_ENTITY must be a string').matches(/^(CREDIT-CARD|DEBIT-CARD|BANK-ACCOUNT|USSD|WALLET-ID)$/).withMessage('FEE_ENTITY must be one of CREDIT-CARD, DEBIT-CARD, BANK-ACCOUNT, USSD, WALLET-ID'),
    (0, express_validator_1.body)('FeeConfigurationSpec.*.ENTITY_PROPERTY').isString().withMessage('ENTITY_PROPERTY must be a string').isLength({ min: 1, max: 100 }).withMessage('ENTITY_PROPERTY must be a non-empty string of length 1-100'),
    (0, express_validator_1.body)('FeeConfigurationSpec.*.FEE_TYPE').isString().withMessage('FEE_TYPE must be a string').matches(/^(FLAT|PERC|FLAT_PERC)$/).withMessage('FEE_TYPE must be one of FLAT, PERC, FLAT_PERC'),
    (0, express_validator_1.body)('FeeConfigurationSpec.*.FEE_VALUE').isString().withMessage('FEE_VALUE must be a string').isLength({ min: 1, max: 100 }).withMessage('FEE_VALUE must be a non-empty string of length 1-100'),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            try {
                const { FeeConfigurationSpec } = req.body;
                // Check if the FCS already exists
                const found_fcs = await FCS_1.default.find({});
                FeeConfigurationSpec.forEach((spec) => {
                    const found_fc = found_fcs.find(fc => fc.FEE_ID === spec.FEE_ID);
                    if (found_fc) {
                        throw new Error('Fee Configuration Specification already exists');
                    }
                    ;
                });
                const fcs = await FCS_1.default.create(FeeConfigurationSpec);
                res.status(201).json(fcs);
            }
            catch (error) {
                return next(error);
            }
            ;
        }
    }
];

import FeeConfigSpec from "@src/models/FeeConfigSpec";
import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@utils/AppError";

export const post_create_fcs = [
    body('FeeConfigurationSpec').isArray().withMessage('FeeConfigurationSpec must be an array'),
    body('FeeConfigurationSpec.*.FEE_ID').isString().withMessage('FEE_ID must be a string').isLength({ min: 8, max: 8 }).withMessage('FEE_ID must be a non-empty string of length 8'),
    body('FeeConfigurationSpec.*.FEE_CURRENCY').isString().withMessage('FEE_CURRENCY must be a string').isLength({ min: 3, max: 3 }).withMessage('FEE_CURRENCY must be a non-empty string of length 3'),
    body('FeeConfigurationSpec.*.FEE_LOCALE').isString().withMessage('FEE_LOCALE must be a string').matches(/^(LOCL|INTL|\*)$/).withMessage('FEE_LOCALE must be one of "LOCL" or "INTL" or "*"'),
    body('FeeConfigurationSpec.*.FEE_ENTITY').isString().withMessage('FEE_ENTITY must be a string').matches(/^(CREDIT-CARD|DEBIT-CARD|BANK-ACCOUNT|USSD|WALLET-ID|\*)$/).withMessage('FEE_ENTITY must be one of CREDIT-CARD, DEBIT-CARD, BANK-ACCOUNT, USSD, WALLET-ID, or *'),
    body('FeeConfigurationSpec.*.ENTITY_PROPERTY').isString().withMessage('ENTITY_PROPERTY must be a string').isLength({ min: 1, max: 100 }).withMessage('ENTITY_PROPERTY must be a non-empty string of length 1-100'),
    body('FeeConfigurationSpec.*.FEE_TYPE').isString().withMessage('FEE_TYPE must be a string').matches(/^(FLAT|PERC|FLAT_PERC)$/).withMessage('FEE_TYPE must be one of FLAT, PERC, FLAT_PERC'),
    body('FeeConfigurationSpec.*.FEE_VALUE').isString().withMessage('FEE_VALUE must be a string').isLength({ min: 1, max: 100 }).withMessage('FEE_VALUE must be a non-empty string of length 1-100'),

    async (req: Request, res: Response, next: NextFunction) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {

            try {

                const { FeeConfigurationSpec } = req.body;

                // Check if the FCS already exists
                const found_fcs = await FeeConfigSpec.find({});
                let errorArray: string[] = [];
                FeeConfigurationSpec.forEach((spec: { FEE_ID: string; }) => {
                    const found_fc = found_fcs.find(fc => fc.FEE_ID === spec.FEE_ID);
                    if (found_fc) errorArray = [...errorArray, spec.FEE_ID];
                });
                if (errorArray.length) throw new AppError(`FeeConfigurationSpec with FEE_ID(s) ${errorArray.join(', ')} already exists`, 400);

                const fcs = await FeeConfigSpec.create(FeeConfigurationSpec);
                res.status(200).json({ status: 'ok' });
            } catch (error) {
                return next(error);
            };
        }
    }
]
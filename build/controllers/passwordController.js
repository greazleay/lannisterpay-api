"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.put_change_password = exports.put_reset_password = exports.post_verification_code = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const express_validator_1 = require("express-validator");
const sendMail_1 = require("../utils/sendMail");
const lib_1 = require("../utils/lib");
exports.post_verification_code = [
    (0, express_validator_1.body)('email').notEmpty().isEmail(),
    async (req, res, next) => {
        const { email } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        else {
            try {
                const customer = await Customer_1.default.findOne({ email: email }).exec();
                if (!customer)
                    throw new Error(`Customer with email ${email} not found`);
                const code = await customer.generateCode();
                const mailOptions = [
                    email,
                    'Verification code',
                    `Your verification code is ${code}`,
                    `<p>Please use this code: <strong style='color: red'>${code}</strong> to continue your password reset</p>`
                ];
                await (0, sendMail_1.sendMail)(...mailOptions);
                res.json({ msg: "Verification Code sent!!!" });
            }
            catch (err) {
                return next(err);
            }
        }
    }
];
exports.put_reset_password = [
    (0, express_validator_1.body)('email').notEmpty().isEmail(),
    (0, express_validator_1.body)('code').notEmpty().isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
    (0, express_validator_1.body)('new_password').notEmpty().isLength({ min: 6 }),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        else {
            try {
                const { email, new_password, code } = req.body;
                const customer = await Customer_1.default.findOne({ email: email }).exec();
                if (!customer)
                    throw new Error(`No customer with email: ${email} found`);
                const { validCode, codeNotExpired } = await customer.verifyCode(code);
                if (!validCode || !codeNotExpired)
                    return res.status(403).json({ msg: 'Verification code is invalid or it has expired.' });
                customer.password = new_password;
                await customer.save();
                const { password, resetPassword, refreshToken, ...data } = customer._doc;
                res.json({ msg: 'password reset successful', data });
            }
            catch (err) {
                return next(err);
            }
        }
    }
];
exports.put_change_password = [
    (0, express_validator_1.body)('old_password').notEmpty().isLength({ min: 6 }),
    (0, express_validator_1.body)('new_password').notEmpty().isLength({ min: 6 }),
    async (req, res, next) => {
        (0, lib_1.handleValidationErrors)(req, res);
        try {
            const { old_password, new_password } = req.body;
            const customer = await Customer_1.default.findById(req.customer._id).exec();
            if (!customer)
                throw new Error(`No customer with id: ${req.customer._id} found`);
            const validPassword = await customer.validatePassword(old_password);
            if (!validPassword)
                return res.status(403).json({ msg: 'Old password is invalid' });
            customer.password = new_password;
            await customer.save();
            const { password, resetPassword, refreshToken, tokenVersion, ...data } = customer._doc;
            res.json({ msg: 'password changed successful', data });
        }
        catch (error) {
            return next(error);
        }
    }
];

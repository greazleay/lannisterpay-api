"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_create_customer = exports.get_get_customer = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const express_validator_1 = require("express-validator");
const gravatar_1 = __importDefault(require("gravatar"));
const sendMail_1 = require("../utils/sendMail");
const lib_1 = require("../utils/lib");
const get_get_customer = async (req, res) => {
    const { password, resetPassword, refreshToken, ...data } = req.customer._doc;
    res.json(data);
};
exports.get_get_customer = get_get_customer;
exports.post_create_customer = [
    (0, express_validator_1.body)('name', 'What is your name???').trim().isLength({ min: 1 }).escape(),
    (0, express_validator_1.body)('email').notEmpty().isEmail(),
    (0, express_validator_1.body)('new_password').notEmpty().isLength({ min: 6 }),
    async (req, res, next) => {
        (0, lib_1.handleValidationErrors)(req, res);
        try {
            const { name, email, new_password, img } = req.body;
            const found_customer = await Customer_1.default.findOne({ email: email }).exec();
            if (found_customer)
                return res.status(409).json({ msg: `Customer with email: ${email} already exists` });
            const avatar = gravatar_1.default.url(email, { s: '100', r: 'pg', d: 'retro' }, true);
            const customer = new Customer_1.default({
                EmailAddress: email,
                FullName: name,
                password: new_password,
                avatar: avatar || img || ''
            });
            await customer.save();
            const mailOptions = [
                email,
                'Account Creation',
                `Welcome to Lannister Pay, ${name}`,
                `<p>Dear ${email.split('@')[0]}, Welcome to Lannister Pay, we are excited to have you onboard</p>`
            ];
            await (0, sendMail_1.sendMail)(...mailOptions);
            const { password, resetPassword, refreshToken, ...data } = customer._doc;
            res.json({ message: 'Customer Created Successfully', customer: data });
        }
        catch (error) {
            next(error);
        }
    }
];

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_refresh_token = exports.get_logout_customer = exports.post_login_customer = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const validateEnv_1 = require("../utils/validateEnv");
const lib_1 = require("../utils/lib");
const envalid_1 = require("envalid");
exports.post_login_customer = [
    (0, express_validator_1.body)('email').notEmpty().isEmail(),
    (0, express_validator_1.body)('password').notEmpty().isLength({ min: 6 }),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        else {
            try {
                const customer = await Customer_1.default.findOne({ email: req.body.email }).exec();
                if (!customer)
                    return res.status(404).json({ msg: `Customer with email: ${envalid_1.email} not found` });
                const validPassword = await customer.validatePassword(req.body.password);
                if (!validPassword)
                    return res.status(400).json({ msg: 'Invalid email/password combination' });
                // Generate new Tokens and send them to the client
                const { token, refresh_token } = await customer.generateTokens(customer);
                (0, lib_1.sendTokens)(res, refresh_token, 'Login Successful', token);
            }
            catch (err) {
                return next(err);
            }
        }
    }
];
const get_logout_customer = (req, res) => {
    return res
        .clearCookie("jit", lib_1.cookieOptions)
        .json({ message: "Logout successful" });
};
exports.get_logout_customer = get_logout_customer;
const post_refresh_token = async (req, res, next) => {
    const { jit } = req.signedCookies;
    if (!jit)
        return res.status(404).json({ msg: 'Refresh Token not found' });
    try {
        // Verify refresh token in request
        const REFRESH_TOKEN_PUBLIC_KEY = Buffer.from(validateEnv_1.ENV.REFRESH_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');
        const decoded = (0, jsonwebtoken_1.verify)(jit, REFRESH_TOKEN_PUBLIC_KEY);
        // Check if customer exists in DB
        const customer = await Customer_1.default.findOne({ id: decoded.sub });
        if (!customer)
            return res.status(404).json({ msg: 'Customer not found' });
        // Check if refresh token is valid
        const { validToken, refreshTokenNotExpired, tokenVersionValid } = await customer.validateRefreshToken(jit);
        if (!validToken)
            return res.status(403).json({ msg: 'Invalid Refresh token' });
        if (!refreshTokenNotExpired)
            return res.status(403).json({ msg: 'Refresh token has expired, please initiate a new sign in request.' });
        if (!tokenVersionValid)
            return res.status(403).json({ msg: 'Token Invalid' });
        // Generate new Tokens and send them to the client
        const { token, refresh_token } = await customer.generateTokens(customer);
        (0, lib_1.sendTokens)(res, refresh_token, 'Token Refresh Successful!!!', token);
    }
    catch (err) {
        return next(err);
    }
};
exports.post_refresh_token = post_refresh_token;

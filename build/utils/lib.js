"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.sendTokens = exports.cookieOptions = exports.tokenGenerator = exports.generateRandomCode = void 0;
const crypto_1 = require("crypto");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const validateEnv_1 = require("./validateEnv");
const generateRandomCode = async (length) => {
    try {
        const code = (0, crypto_1.randomBytes)(length).toString('hex').toUpperCase();
        return code;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.generateRandomCode = generateRandomCode;
const tokenGenerator = async (customer) => {
    const payload = {
        aud: "https://pollaroid.net",
        iss: "https://pollaroid.net",
        sub: customer._id,
        name: customer.FullName,
        email: customer.EmailAddress,
        avatar: customer.avatar,
        last_login: customer.lastLogin,
        token_version: customer.tokenVersion
    };
    // Process Access token
    const ACCESS_TOKEN_PRIVATE_KEY = Buffer.from(validateEnv_1.ENV.ACCESS_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const token = (0, jsonwebtoken_1.sign)(payload, { key: ACCESS_TOKEN_PRIVATE_KEY, passphrase: validateEnv_1.ENV.ACCESS_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '15m' });
    // Process Refresh token
    const REFRESH_TOKEN_PRIVATE_KEY = Buffer.from(validateEnv_1.ENV.REFRESH_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const refresh_token = (0, jsonwebtoken_1.sign)(payload, { key: REFRESH_TOKEN_PRIVATE_KEY, passphrase: validateEnv_1.ENV.REFRESH_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '7d' });
    return { token, refresh_token };
};
exports.tokenGenerator = tokenGenerator;
exports.cookieOptions = {
    path: '/api/auth/refresh_token',
    httpOnly: true,
    maxAge: 604800000,
    signed: true,
    sameSite: 'strict',
    secure: true,
};
const sendTokens = (res, refresh_token, msg_txt, token) => {
    return res
        .cookie('jit', refresh_token, exports.cookieOptions)
        .json({ message: msg_txt, authToken: token });
};
exports.sendTokens = sendTokens;
const handleValidationErrors = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    ;
};
exports.handleValidationErrors = handleValidationErrors;

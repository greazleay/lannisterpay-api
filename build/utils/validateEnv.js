"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = exports.validateEnv = void 0;
const envalid_1 = require("envalid");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const validateEnv = () => {
    (0, envalid_1.cleanEnv)(process.env, {
        DB_URL: (0, envalid_1.str)(),
        COOKIE_SECRET: (0, envalid_1.str)(),
        ACCESS_TOKEN_PRIVATE_KEY_BASE64: (0, envalid_1.str)(),
        ACCESS_TOKEN_PUBLIC_KEY_BASE64: (0, envalid_1.str)(),
        ACCESS_TOKEN_SECRET_BASE64: (0, envalid_1.str)(),
        REFRESH_TOKEN_PRIVATE_KEY_BASE64: (0, envalid_1.str)(),
        REFRESH_TOKEN_PUBLIC_KEY_BASE64: (0, envalid_1.str)(),
        REFRESH_TOKEN_SECRET: (0, envalid_1.str)(),
        SENDER_IDENTITY: (0, envalid_1.str)(),
        SENDGRID_API_KEY: (0, envalid_1.str)(),
    });
};
exports.validateEnv = validateEnv;
exports.ENV = (0, envalid_1.cleanEnv)(process.env, {
    DB_URL: (0, envalid_1.str)(),
    COOKIE_SECRET: (0, envalid_1.str)(),
    ACCESS_TOKEN_PRIVATE_KEY_BASE64: (0, envalid_1.str)(),
    ACCESS_TOKEN_PUBLIC_KEY_BASE64: (0, envalid_1.str)(),
    ACCESS_TOKEN_SECRET: (0, envalid_1.str)(),
    REFRESH_TOKEN_PRIVATE_KEY_BASE64: (0, envalid_1.str)(),
    REFRESH_TOKEN_PUBLIC_KEY_BASE64: (0, envalid_1.str)(),
    REFRESH_TOKEN_SECRET: (0, envalid_1.str)(),
    SENDER_IDENTITY: (0, envalid_1.str)(),
    SENDGRID_API_KEY: (0, envalid_1.str)(),
});

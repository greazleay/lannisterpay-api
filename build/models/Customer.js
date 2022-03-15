"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = require("jsonwebtoken");
const lib_1 = require("../utils/lib");
const CustomerSchema = new mongoose_1.Schema({
    EmailAddress: { type: String, required: true, immutable: true },
    FullName: { type: String, required: true },
    BearsFee: { type: Boolean, default: false },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    lastLogin: { type: Date, default: new Date(Date.now()) },
    resetPassword: {
        code: { type: String, default: '' },
        expiresBy: { type: Date, default: '' }
    },
    refreshToken: {
        token: { type: String, default: '' },
        expiresBy: { type: Date, default: '' }
    },
    tokenVersion: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
CustomerSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = await bcrypt_1.default.hash(this.password, 10);
    }
    next();
});
CustomerSchema.pre('findOne', async function (next) {
    await this.model.findOneAndUpdate(this.getFilter().email, { '$set': { 'lastLogin': Date.now() } }, { new: true });
    next();
});
CustomerSchema.methods.generateCode = async function () {
    const code = await (0, lib_1.generateRandomCode)(3);
    this.resetPassword.code = bcrypt_1.default.hashSync(code, 10);
    this.resetPassword.expiresBy = new Date(Date.now() + 300000);
    this.save();
    return code;
};
CustomerSchema.methods.verifyCode = async function (code) {
    const validCode = bcrypt_1.default.compare(code, this.resetPassword.code);
    const codeNotExpired = (Date.now() - new Date(this.resetPassword.expiresBy).getTime()) < 300000;
    return { validCode, codeNotExpired };
};
CustomerSchema.methods.generateTokens = async function (usr) {
    const { token, refresh_token } = await (0, lib_1.tokenGenerator)(usr);
    this.refreshToken.token = refresh_token;
    const decodedJwt = (0, jsonwebtoken_1.decode)(refresh_token);
    this.refreshToken.expiresBy = new Date(decodedJwt.exp * 1000);
    this.tokenVersion++;
    await this.save();
    return { token, refresh_token };
};
CustomerSchema.methods.validateRefreshToken = async function (token) {
    const validToken = this.refreshToken.token === token;
    const refreshTokenNotExpired = (new Date(this.resetPassword.expiresBy).getTime() - Date.now()) < 604800000;
    const tokenVersionValid = (this.tokenVersion - token.token_version) === 1;
    return { validToken, refreshTokenNotExpired, tokenVersionValid };
};
CustomerSchema.methods.validatePassword = async function (password) {
    return bcrypt_1.default.compare(password, this.password);
};
exports.default = (0, mongoose_1.model)('Customer', CustomerSchema);

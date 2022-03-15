"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const validateEnv_1 = require("./validateEnv");
const mail_1 = __importStar(require("@sendgrid/mail"));
const sendMail = async (email, subject, title, content) => {
    mail_1.default.setApiKey(validateEnv_1.ENV.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: validateEnv_1.ENV.SENDER_IDENTITY,
        subject: subject,
        text: title,
        html: content,
    };
    try {
        await mail_1.default.send(msg);
        console.log('Email sent successfully!!!');
    }
    catch (err) {
        if (err instanceof mail_1.ResponseError && err.response) {
            console.error(err.response.body);
        }
    }
};
exports.sendMail = sendMail;

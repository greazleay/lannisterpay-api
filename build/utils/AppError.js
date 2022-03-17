"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, status) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name || "Application Error";
        this.message = message || "Something went wrong";
        this.status = status || 500;
    }
}
exports.AppError = AppError;

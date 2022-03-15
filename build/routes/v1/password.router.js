"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const passwordController_1 = require("../../controllers/passwordController");
const passwordRouter = (0, express_1.Router)();
passwordRouter.post('/verification_code', passwordController_1.post_verification_code);
passwordRouter.put('/reset_password', passwordController_1.put_reset_password);
passwordRouter.put('/change_password', passport_1.default.authenticate('jwt', { session: false }), passwordController_1.put_change_password);
exports.default = passwordRouter;

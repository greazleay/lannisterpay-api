"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../controllers/authController");
const authRouter = (0, express_1.Router)();
authRouter.get('/logout', authController_1.get_logout_customer);
authRouter.post('/login', authController_1.post_login_customer);
authRouter.post('/refresh_token', authController_1.post_refresh_token);
exports.default = authRouter;

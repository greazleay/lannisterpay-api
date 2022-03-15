"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const customerController_1 = require("../../controllers/customerController");
const customerRouter = (0, express_1.Router)();
customerRouter.get('/customerinfo', passport_1.default.authenticate('jwt', { session: false }), customerController_1.get_get_customer);
customerRouter.post('/register', customerController_1.post_create_customer);
exports.default = customerRouter;

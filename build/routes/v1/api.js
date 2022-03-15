"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("../v1/auth.router"));
const customer_router_1 = __importDefault(require("../v1/customer.router"));
const fee_router_1 = __importDefault(require("../v1/fee.router"));
const password_router_1 = __importDefault(require("../v1/password.router"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => { res.json({ msg: 'HELLO VISITOR, THANKS FOR STOPPING BY AND WELCOME TO LANNISTER-PAY API' }); });
router.use('/auth', auth_router_1.default);
router.use('/password', password_router_1.default);
router.use('/customer', customer_router_1.default);
router.use('/fees', fee_router_1.default);
exports.default = router;

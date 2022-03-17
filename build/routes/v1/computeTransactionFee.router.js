"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const computeTransactionFeeController_1 = require("../../controllers/computeTransactionFeeController");
const computeTransactionFeeRouter = (0, express_1.Router)();
computeTransactionFeeRouter.post('/', computeTransactionFeeController_1.post_compute_transaction_fee);
exports.default = computeTransactionFeeRouter;

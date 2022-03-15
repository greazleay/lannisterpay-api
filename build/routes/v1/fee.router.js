"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feeController_1 = require("../../controllers/feeController");
const feeRouter = (0, express_1.Router)();
feeRouter.post('/', feeController_1.post_create_fcs);
exports.default = feeRouter;

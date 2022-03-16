"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const envalid_1 = require("envalid");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.ENV = (0, envalid_1.cleanEnv)(process.env, {
    DB_URL: (0, envalid_1.str)(),
});

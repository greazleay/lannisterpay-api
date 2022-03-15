"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateEnv_1 = require("../utils/validateEnv");
const passport_jwt_1 = require("passport-jwt");
const mongoose_1 = require("mongoose");
const Customer_1 = __importDefault(require("../models/Customer"));
// Convert base64 .pem public key
const PUBLIC_KEY = Buffer.from(validateEnv_1.ENV.ACCESS_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies['access_token'];
    }
    return token;
};
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUBLIC_KEY
};
exports.default = (passport) => {
    passport.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => {
        const id = new mongoose_1.Types.ObjectId(jwt_payload.sub);
        Customer_1.default.findById(id).exec((err, found_customer) => {
            if (err)
                return done(err, null);
            if (found_customer) {
                return done(null, found_customer);
            }
            else {
                return done(null, false);
                // or create a new customer
            }
            ;
        });
    }));
};

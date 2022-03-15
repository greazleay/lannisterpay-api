"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const database_1 = __importDefault(require("./configs/database"));
const passport_2 = __importDefault(require("./middlewares/passport"));
const api_1 = __importDefault(require("./routes/v1/api"));
const index_1 = __importDefault(require("./routes/index"));
(0, dotenv_1.config)();
// Initialize DB
(0, database_1.default)();
// Load Paasport configuration
(0, passport_2.default)(passport_1.default);
const app = (0, express_1.default)();
const whitelist = ['http://localhost:3000'];
const corsOptions = {
    credentials: true,
    methods: ['GET', 'DELETE', 'OPTIONS', 'POST', 'PUT'],
    origin: (requestOrigin, callback) => {
        if (whitelist.indexOf(requestOrigin) !== -1 || !requestOrigin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '16mb' }));
app.use(express_1.default.urlencoded({ limit: '16mb', extended: true }));
app.use(passport_1.default.initialize());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use('/', index_1.default);
app.use('/v1', api_1.default);
// Handle 404 errors
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, 'The requested resource was not found on this server!!!'));
});
// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || err.toString() });
});
exports.default = app;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validateEnv_1 = require("../utils/validateEnv");
const initDB = () => {
    const options = {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        ssl: true,
    };
    const mongoDB = validateEnv_1.ENV.DB_URL;
    (0, mongoose_1.connect)(mongoDB, options);
    mongoose_1.connection.on('connected', () => console.log('Mongoose connected to DB cluster'));
    mongoose_1.connection.on('error', () => console.error.bind(console, 'MongoDB connection error:'));
    mongoose_1.connection.on('disconnected', () => console.log('Mongoose disconnected'));
};
exports.default = initDB;

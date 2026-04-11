"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m", // Short-lived
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh"), {
        expiresIn: "7d", // Long-lived
    });
};
exports.generateRefreshToken = generateRefreshToken;
// Keeping default export for backward compatibility if needed, 
// though we should move to named exports
const generateToken = exports.generateAccessToken;
exports.default = generateToken;

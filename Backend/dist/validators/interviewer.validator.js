"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInterviewerSchema = exports.createInterviewerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createInterviewerSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().email().required(),
    department: joi_1.default.string().min(2).required(),
    isActive: joi_1.default.boolean().default(true)
});
exports.updateInterviewerSchema = joi_1.default.object({
    name: joi_1.default.string().min(3),
    email: joi_1.default.string().email(),
    department: joi_1.default.string().min(2),
    isActive: joi_1.default.boolean()
});

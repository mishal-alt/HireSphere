"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobSchema = exports.jobSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.jobSchema = joi_1.default.object({
    title: joi_1.default.string().min(2).max(100).required().messages({
        'string.min': 'Description should have at least {#limit} characters',
        'any.required': 'Title is a required field'
    }),
    department: joi_1.default.string().min(2).max(50).required().messages({
        'any.required': 'Department is a required field'
    }),
    description: joi_1.default.string().min(10).required().messages({
        'string.min': 'Description should have at least {#limit} characters',
        'any.required': 'Description is a required field'
    }),
    status: joi_1.default.string().valid('Active', 'Paused', 'Closed').default('Active')
});
exports.updateJobSchema = joi_1.default.object({
    title: joi_1.default.string().min(2).max(100),
    department: joi_1.default.string().min(2).max(50),
    description: joi_1.default.string().min(10),
    status: joi_1.default.string().valid('Active', 'Paused', 'Closed')
});

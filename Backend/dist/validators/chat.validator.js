"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.sendMessageSchema = joi_1.default.object({
    receiverId: joi_1.default.string().required().messages({
        'any.required': 'Receiver ID is required'
    }),
    content: joi_1.default.string().min(1).max(2000).required().messages({
        'string.empty': 'Message cannot be empty',
        'string.max': 'Message is too long (max 2000 characters)'
    }),
    conversationId: joi_1.default.string().optional()
});

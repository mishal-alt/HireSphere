"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInterviewSchema = exports.createInterviewSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createInterviewSchema = joi_1.default.object({
    candidateId: joi_1.default.string().required().messages({
        'any.required': 'Candidate ID is required'
    }),
    interviewerId: joi_1.default.string().required().messages({
        'any.required': 'Interviewer ID is required'
    }),
    scheduledAt: joi_1.default.date().iso().required().messages({
        'date.iso': 'Scheduled at must be a valid ISO date',
        'any.required': 'Schedule date is required'
    }),
    title: joi_1.default.string().allow('', null).default('Technical Interview')
});
exports.updateInterviewSchema = joi_1.default.object({
    candidateId: joi_1.default.string(),
    interviewerId: joi_1.default.string(),
    scheduledAt: joi_1.default.date().iso(),
    title: joi_1.default.string().allow('', null),
    status: joi_1.default.string().valid('Scheduled', 'Ongoing', 'Completed', 'Cancelled')
});

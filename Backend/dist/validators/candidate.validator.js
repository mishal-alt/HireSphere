"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCandidateSchema = exports.createCandidateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCandidateSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().allow('', null),
    experience: joi_1.default.string().allow('', null),
    education: joi_1.default.string().allow('', null),
    jobId: joi_1.default.string().allow('', null),
    resumeUrl: joi_1.default.string().uri().allow('', null),
    status: joi_1.default.string().valid('Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired').default('Applied')
});
exports.updateCandidateSchema = joi_1.default.object({
    name: joi_1.default.string().min(3),
    email: joi_1.default.string().email(),
    phone: joi_1.default.string().allow('', null),
    experience: joi_1.default.string().allow('', null),
    education: joi_1.default.string().allow('', null),
    jobId: joi_1.default.string().allow('', null),
    resumeUrl: joi_1.default.string().uri().allow('', null),
    status: joi_1.default.string().valid('Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired')
});

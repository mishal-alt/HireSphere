"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus["SCHEDULED"] = "Scheduled";
    InterviewStatus["ONGOING"] = "Ongoing";
    InterviewStatus["COMPLETED"] = "Completed";
    InterviewStatus["MISSED"] = "Missed";
    InterviewStatus["EVALUATED"] = "Evaluated";
})(InterviewStatus || (exports.InterviewStatus = InterviewStatus = {}));
const interviewSchema = new mongoose_1.Schema({
    companyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },
    candidateId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true,
    },
    interviewerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    scheduledAt: { type: Date, required: true },
    meetLink: { type: String },
    status: {
        type: String,
        enum: Object.values(InterviewStatus),
        default: InterviewStatus.SCHEDULED,
    },
    notes: { type: String, default: "" },
    ratings: {
        technical: { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 },
        culturalFit: { type: Number, default: 0 },
    },
    evaluationComments: { type: String, default: "" },
    score: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Interview", interviewSchema);

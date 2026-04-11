"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndIncrementEmailQuota = void 0;
const Company_1 = __importDefault(require("../models/Company"));
const PLAN_EMAIL_LIMITS = {
    free: 100,
    basic: 500, // Legacy
    premium: 2000,
    pro: 10000,
    enterprise: 50000
};
const checkAndIncrementEmailQuota = async (companyId) => {
    const company = await Company_1.default.findById(companyId);
    if (!company)
        return { allowed: false, remaining: 0, message: "Company not found" };
    // 1. Reset check (New Month?)
    const now = new Date();
    const lastReset = company.lastEmailReset || new Date();
    const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
    if (isNewMonth) {
        company.emailsSentThisMonth = 0;
        company.lastEmailReset = now;
    }
    // 2. Limit Check
    const plan = company.subscriptionPlan || "free";
    const limit = PLAN_EMAIL_LIMITS[plan] || 100;
    const currentSent = company.emailsSentThisMonth || 0;
    if (currentSent >= limit) {
        return {
            allowed: false,
            remaining: 0,
            message: `Email Quota Exceeded: You have reached your monthly limit of ${limit} emails on the ${plan.toUpperCase()} plan. Please upgrade to send more.`
        };
    }
    // 3. Increment and Save
    company.emailsSentThisMonth = currentSent + 1;
    await company.save();
    return { allowed: true, remaining: limit - company.emailsSentThisMonth };
};
exports.checkAndIncrementEmailQuota = checkAndIncrementEmailQuota;

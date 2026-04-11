"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPlan = void 0;
const Company_1 = __importDefault(require("../models/Company"));
const checkPlan = (requiredPlan) => {
    return async (req, res, next) => {
        try {
            const companyId = req.user.companyId;
            const company = await Company_1.default.findById(companyId);
            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }
            const plan = company.subscriptionPlan;
            // Logic: Pro can access everything. Premium can access premium but not pro-only.
            if (plan === 'pro' || plan === 'enterprise') {
                return next();
            }
            if (requiredPlan === 'premium' && plan === 'premium') {
                return next();
            }
            return res.status(403).json({
                message: `Plan Upgrade Required: This feature is only available on the ${requiredPlan.toUpperCase()} plan.`
            });
        }
        catch (error) {
            console.error("Plan Middleware Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
};
exports.checkPlan = checkPlan;

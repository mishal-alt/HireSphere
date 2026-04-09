import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import Company from "../models/Company";

export const checkPlan = (requiredPlan: 'premium' | 'pro') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user.companyId;
      const company = await Company.findById(companyId);

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
    } catch (error) {
      console.error("Plan Middleware Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

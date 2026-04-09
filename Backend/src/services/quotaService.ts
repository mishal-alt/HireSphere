import Company from "../models/Company";

const PLAN_EMAIL_LIMITS: Record<string, number> = {
  free: 100,
  basic: 500,    // Legacy
  premium: 2000,
  pro: 10000,
  enterprise: 50000
};

export const checkAndIncrementEmailQuota = async (companyId: string): Promise<{ allowed: boolean, remaining: number, message?: string }> => {
  const company = await Company.findById(companyId);
  if (!company) return { allowed: false, remaining: 0, message: "Company not found" };

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

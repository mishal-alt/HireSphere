import { Request, Response } from "express";
import crypto from "crypto";
import Company from "../models/Company";

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not defined in .env");
    return res.status(500).send("Internal Server Error");
  }

  const signature = req.headers["x-razorpay-signature"] as string;

  // Razorpay signature verification
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (expectedSignature !== signature) {
    console.warn("Invalid Razorpay Webhook Signature");
    return res.status(400).send("Invalid signature");
  }

  const { event, payload } = req.body;
  console.log(`[Razorpay Webhook] Received event: ${event}`);

  try {
    if (event === "subscription.activated" || event === "subscription.charged") {
      const subscription = payload.subscription.entity;
      const companyId = subscription.notes?.companyId;

      if (!companyId) {
        console.error("CompanyId missing in subscription notes");
        return res.status(200).send("Processed but NO ID"); // Send 200 so Razorpay stops retrying
      }

      await Company.findByIdAndUpdate(companyId, {
        subscriptionPlan: "pro", // Adjust this if you have multiple paid plans
        subscriptionStatus: "active",
        razorpaySubscriptionId: subscription.id,
        currentPeriodEnd: new Date(subscription.current_end * 1000),
      });
      
      console.log(`✅ Company ${companyId} subscription status UPDATED to active`);
    } else if (event === "subscription.cancelled" || event === "subscription.expired") {
      const subscription = payload.subscription.entity;
      const companyId = subscription.notes?.companyId;

      if (companyId) {
        await Company.findByIdAndUpdate(companyId, {
          subscriptionPlan: "free",
          subscriptionStatus: event === "subscription.cancelled" ? "cancelled" : "expired",
        });
        console.log(`❌ Company ${companyId} subscription status: ${event}`);
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Internal Error");
  }
};

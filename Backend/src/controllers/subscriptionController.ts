import { Request, Response } from "express";
import { razorpay } from "../config/razorpay";
import crypto from "crypto";
import Company from "../models/Company";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    console.log("Creating subscription for Plan ID:", planId);
    console.log("User Data:", (req as any).user);

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
      notes: {
        companyId: (req as any).user.companyId || (req as any).user._id,
      }
    });

    console.log("Subscription Created:", subscription.id);

    res.status(200).json({
      success: true,
      subscriptionId: subscription.id,
      paymentLink: subscription.short_url,
    });
  } catch (error: any) {
    console.error("RAZORPAY ERROR DETAIL:", error);
    res.status(500).json({ 
      success: false, 
      message: error.description || error.message || "Razorpay API Error" 
    });
  }
}

export const verifySubscription = async (req: Request, res: Response) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, planId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_payment_id + "|" + razorpay_subscription_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const companyId = (req as any).user.companyId || (req as any).user._id;

    // Determine plan type based on ID
    let planType = "basic";
    if (planId === "plan_SaxbAXzKZr0gyM") planType = "premium";
    if (planId === "plan_Sazs1DQjGzPSgp") planType = "pro"; // Update this label once you have the real ID

    await Company.findByIdAndUpdate(companyId, {
      subscriptionPlan: planType as any,
      subscriptionStatus: "active",
      razorpaySubscriptionId: razorpay_subscription_id,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      success: true,
      message: "Subscription activated successfully!",
    });
  } catch (error: any) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

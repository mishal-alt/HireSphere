"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySubscription = exports.createSubscription = void 0;
const razorpay_1 = require("../config/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const Company_1 = __importDefault(require("../models/Company"));
const createSubscription = async (req, res) => {
    try {
        const { planId } = req.body;
        console.log("Creating subscription for Plan ID:", planId);
        console.log("User Data:", req.user);
        const subscription = await razorpay_1.razorpay.subscriptions.create({
            plan_id: planId,
            total_count: 12,
            quantity: 1,
            customer_notify: 1,
            notes: {
                companyId: req.user.companyId || req.user._id,
            }
        });
        console.log("Subscription Created:", subscription.id);
        res.status(200).json({
            success: true,
            subscriptionId: subscription.id,
            paymentLink: subscription.short_url,
        });
    }
    catch (error) {
        console.error("RAZORPAY ERROR DETAIL:", error);
        res.status(500).json({
            success: false,
            message: error.description || error.message || "Razorpay API Error"
        });
    }
};
exports.createSubscription = createSubscription;
const verifySubscription = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, planId } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = razorpay_payment_id + "|" + razorpay_subscription_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
        const companyId = req.user.companyId || req.user._id;
        // Determine plan type based on ID
        let planType = "basic";
        if (planId === "plan_SaxbAXzKZr0gyM")
            planType = "premium";
        if (planId === "plan_Sazs1DQjGzPSgp")
            planType = "pro"; // Update this label once you have the real ID
        await Company_1.default.findByIdAndUpdate(companyId, {
            subscriptionPlan: planType,
            subscriptionStatus: "active",
            razorpaySubscriptionId: razorpay_subscription_id,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        res.status(200).json({
            success: true,
            message: "Subscription activated successfully!",
        });
    }
    catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.verifySubscription = verifySubscription;

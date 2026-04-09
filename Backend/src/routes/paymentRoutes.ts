import { Router } from "express";
import { createSubscription, verifySubscription } from "../controllers/subscriptionController";
import { handleRazorpayWebhook } from "../controllers/webhookController";
import { protect } from "../middleware/authMiddleware"; // Ensure only logged-in users pay

const router = Router();

router.post("/subscribe", protect, createSubscription);
router.post("/verify", protect, verifySubscription);
router.post("/webhook", handleRazorpayWebhook);

export default router;

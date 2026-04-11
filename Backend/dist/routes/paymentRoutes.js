"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controllers/subscriptionController");
const webhookController_1 = require("../controllers/webhookController");
const authMiddleware_1 = require("../middleware/authMiddleware"); // Ensure only logged-in users pay
const router = (0, express_1.Router)();
router.post("/subscribe", authMiddleware_1.protect, subscriptionController_1.createSubscription);
router.post("/verify", authMiddleware_1.protect, subscriptionController_1.verifySubscription);
router.post("/webhook", webhookController_1.handleRazorpayWebhook);
exports.default = router;

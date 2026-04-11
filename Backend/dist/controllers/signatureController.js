"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSignature = void 0;
const signatureService_1 = require("../services/signatureService");
const submitSignature = async (req, res) => {
    try {
        const { id } = req.params;
        const { signatureData } = req.body; // Base64 PNG from frontend
        if (!signatureData) {
            return res.status(400).json({ message: "Signature image is required" });
        }
        const forwarded = req.headers["x-forwarded-for"];
        const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : Array.isArray(forwarded) ? forwarded[0] : "") || req.socket.remoteAddress || "Unknown";
        const userAgent = req.headers["user-agent"] || "Unknown";
        const candidate = await (0, signatureService_1.applyInHouseSignature)(id, signatureData, {
            ip,
            userAgent,
        });
        res.status(200).json({
            message: "Offer signed successfully",
            candidate,
        });
    }
    catch (error) {
        console.error("Signature Controller Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
exports.submitSignature = submitSignature;

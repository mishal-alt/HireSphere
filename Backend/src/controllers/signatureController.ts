import { Request, Response } from "express";
import { applyInHouseSignature } from "../services/signatureService";

export const submitSignature = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { signatureData } = req.body; // Base64 PNG from frontend

    if (!signatureData) {
      return res.status(400).json({ message: "Signature image is required" });
    }

    const forwarded = req.headers["x-forwarded-for"];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : Array.isArray(forwarded) ? forwarded[0] : "") || req.socket.remoteAddress || "Unknown";
    const userAgent = (req.headers["user-agent"] as string) || "Unknown";

    const candidate = await applyInHouseSignature(id as string, signatureData, {
      ip,
      userAgent,
    });

    res.status(200).json({
      message: "Offer signed successfully",
      candidate,
    });
  } catch (error: any) {
    console.error("Signature Controller Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

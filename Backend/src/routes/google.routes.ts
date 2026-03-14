import express from "express";
import { googleCallback } from "../controllers/google.controller";
import oauth2Client from "../config/google";

const router = express.Router();

router.get("/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/calendar"],
    });

    res.redirect(url);
});

router.get("/google/callback", googleCallback);

export default router;

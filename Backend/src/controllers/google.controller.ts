import { Request, Response } from "express";
import oauth2Client from "../config/google";
import User, { UserRole } from "../models/User";
import Company from "../models/Company";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";

export const googleCallback = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).send("No code provided");
        }

        const { tokens } = await oauth2Client.getToken(code as string);

        console.log("------------------------------------------");
        console.log("FULL GOOGLE TOKENS RECEIVED:", JSON.stringify(tokens, null, 2));
        console.log("------------------------------------------");

        if (tokens.refresh_token) {
            console.log(">>> COPY THIS REFRESH TOKEN TO YOUR .ENV <<<");
            console.log(tokens.refresh_token);
            console.log("------------------------------------------");
        } else {
            console.log("WARNING: No Refresh Token received. Try revoking app access at https://myaccount.google.com/permissions and try again.");
        }

        res.send("<h1>Google Connected!</h1><p>Check your backend terminal for the Refresh Token.</p>");
    } catch (error: any) {
        console.error("Error getting tokens:", error.response?.data || error.message);
        res.status(500).json({
            message: "Error getting tokens",
            error: error.response?.data || error.message
        });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "Google ID Token is required" });
        }

        // Verify Google token
        const ticket = await oauth2Client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ message: "Invalid Google token" });
        }

        const { email, name, picture, sub: googleId } = payload;

        // 1. Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // 2. If user doesn't exist, create a new Company and User (as Admin)
            // For a new signup via Google, we use their name as the company name temporarily
            const company = await Company.create({
                name: `${name}'s Company`,
                email: email,
                password: Math.random().toString(36).slice(-10), // Random password for schema requirement
            });

            user = await User.create({
                name: name || "Google User",
                email: email,
                password: Math.random().toString(36).slice(-10),
                role: UserRole.ADMIN,
                companyId: company._id,
            });
        }

        // 3. Generate tokens
        const accessToken = generateAccessToken({
            id: user._id.toString(),
            role: user.role,
            companyId: user.companyId.toString(),
        });

        const refreshToken = generateRefreshToken({
            id: user._id.toString(),
            role: user.role,
            companyId: user.companyId.toString(),
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            token: accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                profileImage: user.profileImage || picture
            },

        });

    } catch (error: any) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Google Authentication failed", error: error.message });
    }
};

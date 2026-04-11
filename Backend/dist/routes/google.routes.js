"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_controller_1 = require("../controllers/google.controller");
const google_1 = __importDefault(require("../config/google"));
const router = express_1.default.Router();
router.get("/google", (req, res) => {
    const url = google_1.default.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/calendar"],
    });
    res.redirect(url);
});
router.get("/google/callback", google_controller_1.googleCallback);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// All routes are protected and scoped by companyId
router.use(authMiddleware_1.protect);
router.get('/conversations', chatController_1.getConversations);
router.get('/messages/:id', chatController_1.getMessages);
router.post('/conversation', chatController_1.findOrCreateConversation);
exports.default = router;

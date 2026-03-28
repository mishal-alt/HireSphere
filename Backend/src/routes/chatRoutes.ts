import express from 'express';
import { getConversations, getMessages, findOrCreateConversation } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { sendMessageSchema } from '../validators/chat.validator';

const router = express.Router();

// All routes are protected and scoped by companyId
router.use(protect);

router.get('/conversations', getConversations);
router.get('/messages/:id', getMessages);
router.post('/conversation', findOrCreateConversation);

export default router;

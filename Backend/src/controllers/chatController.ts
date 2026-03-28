import { Request, Response } from 'express';
import { Conversation, Message } from '../models/Chat';
import { asyncHandler } from '../middleware/asyncHandler';
import mongoose from 'mongoose';

// @desc    Get all conversations for the user's company
// @route   GET /api/chat/conversations
export const getConversations = asyncHandler(async (req: any, res: Response) => {
    const conversations = await Conversation.find({ 
        companyId: req.user.companyId,
        participants: req.user.id 
    })
    .populate('participants', 'name email role profileImage')

    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
});

// @desc    Get message history for a specific conversation
// @route   GET /api/chat/messages/:id
export const getMessages = asyncHandler(async (req: any, res: Response) => {
    const { id } = req.params;

    // Verify conversation belongs to company
    const conversation = await Conversation.findOne({ 
        _id: id,
        companyId: req.user.companyId,
        participants: req.user.id
    });

    if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const messages = await Message.find({ conversationId: id })
        .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
        { conversationId: id, senderId: { $ne: req.user.id }, isRead: false },
        { $set: { isRead: true } }
    );

    res.json({ success: true, messages });
});

// @desc    Find or create a conversation with another user
// @route   POST /api/chat/conversation
export const findOrCreateConversation = asyncHandler(async (req: any, res: Response) => {
    const { participantId } = req.body;

    console.log('--- Find or Create Conversation ---');
    console.log('User ID:', req.user.id);
    console.log('Company ID:', req.user.companyId);
    console.log('Participant ID:', participantId);

    if (!participantId) {
        return res.status(400).json({ success: false, message: 'Participant ID is required' });
    }

    let conversation = await Conversation.findOne({
        companyId: req.user.companyId,
        participants: { $all: [req.user.id, participantId] }
    }).populate('participants', 'name email role profileImage');


    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user.id, participantId],
            companyId: req.user.companyId
        });
        await conversation.populate('participants', 'name email role profileImage');

    }

    res.status(200).json({ success: true, conversation });
});

import Joi from 'joi';

export const sendMessageSchema = Joi.object({
    receiverId: Joi.string().required().messages({
        'any.required': 'Receiver ID is required'
    }),
    content: Joi.string().min(1).max(2000).required().messages({
        'string.empty': 'Message cannot be empty',
        'string.max': 'Message is too long (max 2000 characters)'
    }),
    conversationId: Joi.string().optional()
});

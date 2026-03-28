import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
}

const ConversationSchema: Schema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    isRead: boolean;
    companyId: mongoose.Types.ObjectId;
}

const MessageSchema: Schema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

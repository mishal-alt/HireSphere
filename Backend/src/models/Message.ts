import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", messageSchema);
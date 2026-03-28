import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: any;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "info" },
    isRead: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", notificationSchema);
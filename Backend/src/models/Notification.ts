import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
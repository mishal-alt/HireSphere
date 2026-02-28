import mongoose, { Document, Schema } from "mongoose";

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  action: string;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    action: { type: String, required: true },
    entityType: { type: String },
    entityId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export default mongoose.model<IActivityLog>(
  "ActivityLog",
  activityLogSchema
);
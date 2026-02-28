import mongoose, { Document, Schema } from "mongoose";

export enum SubscriptionPlan {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export interface ICompany extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  subscriptionPlan: SubscriptionPlan;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, index: true },

    password: { type: String, required: true },

    isActive: { type: Boolean, default: true },

    subscriptionPlan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>("Company", companySchema);
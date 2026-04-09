import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export enum SubscriptionPlan {
  FREE = "free",
  BASIC = "basic",
  PREMIUM = "premium",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export interface ICompany extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  subscriptionPlan: SubscriptionPlan;
  razorpaySubscriptionId?: string;
  subscriptionStatus?: "active" | "inactive" | "cancelled" | "expired";
  currentPeriodEnd?: Date;
  emailsSentThisMonth?: number;
  lastEmailReset?: Date;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, index: true },

    password: { type: String, required: true },

    isActive: { type: Boolean, default: true },

    logoUrl: { type: String },

    subscriptionPlan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE,
    },

    razorpaySubscriptionId: { type: String },
    subscriptionStatus: { type: String, default: "inactive" },
    currentPeriodEnd: { type: Date },
    emailsSentThisMonth: { type: Number, default: 0 },
    lastEmailReset: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


companySchema.pre<ICompany>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



export default mongoose.model<ICompany>("Company", companySchema);
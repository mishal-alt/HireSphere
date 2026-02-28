import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  INTERVIEWER = "interviewer",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, index: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
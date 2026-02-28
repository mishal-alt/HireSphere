import mongoose, { Document, Schema } from "mongoose";

export interface ICandidate extends Document {
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  companyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const candidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true },

    phone: { type: String },

    resumeUrl: { type: String },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICandidate>("Candidate", candidateSchema);
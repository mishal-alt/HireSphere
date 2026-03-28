import mongoose, { Document, Schema } from "mongoose";

export interface ICandidate extends Document {
  name: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  status: string;
  resumeUrl: string;
  jobId?: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const candidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true },

    phone: { type: String },
    
    experience: { type: String },
    
    education: { type: String },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      index: true,
    },

    status: {
      type: String,
      enum: ["New", "Scheduled", "Interviewed", "Hired", "Rejected"],
      default: "New",
    },

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
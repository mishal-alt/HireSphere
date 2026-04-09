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
  atsScore?: number;
  matchedSkills?: string[];
  resumeText?: string;
  
  // New Hiring Fields
  offeredSalary?: number;
  joiningDate?: Date;
  offerLetterUrl?: string;
  signatureId?: string; // For tracking
  signatureDate?: Date;
  signatureIp?: string;
  signatureUserAgent?: string;
  source?: string;


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
      enum: ["New", "Shortlisted", "Scheduled", "Interviewed", "Offered", "Hired", "Hired (Signed)", "Rejected"],
      default: "New",
    },

    resumeUrl: { type: String },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    atsScore: { type: Number, default: 0 },
    matchedSkills: { type: [String], default: [] },
    resumeText: { type: String },

    // New Hiring Metadata
    offeredSalary: { type: Number },
    joiningDate: { type: Date },
    offerLetterUrl: { type: String },
    signatureId: { type: String },
    signatureDate: { type: Date },
    signatureIp: { type: String },
    signatureUserAgent: { type: String },
    source: { type: String, default: "Direct" },
  },

  { timestamps: true }
);

export default mongoose.model<ICandidate>("Candidate", candidateSchema);
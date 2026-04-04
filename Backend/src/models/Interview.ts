import mongoose, { Document, Schema } from "mongoose";

export enum InterviewStatus {
  SCHEDULED = "Scheduled",
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
  MISSED = "Missed",
  EVALUATED = "Evaluated",
}

export interface IInterview extends Document {
  companyId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  interviewerId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  meetLink: string;
  status: InterviewStatus;
  notes?: string;
  ratings?: {
    technical?: number;
    communication?: number;
    problemSolving?: number;
    culturalFit?: number;
  };
  evaluationComments?: string;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    interviewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scheduledAt: { type: Date, required: true },

    meetLink: { type: String },

    status: {
      type: String,
      enum: Object.values(InterviewStatus),
      default: InterviewStatus.SCHEDULED,
    },

    notes: { type: String, default: "" },
    ratings: {
      technical: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      culturalFit: { type: Number, default: 0 },
    },
    evaluationComments: { type: String, default: "" },
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IInterview>("Interview", interviewSchema);
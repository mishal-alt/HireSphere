import mongoose, { Document, Schema } from "mongoose";

export interface IEvaluation extends Document {
  companyId: mongoose.Types.ObjectId;
  interviewId: mongoose.Types.ObjectId;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  totalScore: number;
  result: "PASS" | "FAIL";
  feedback: string;
  createdAt: Date;
}

const evaluationSchema = new Schema<IEvaluation>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },

    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    technicalScore: Number,
    communicationScore: Number,
    problemSolvingScore: Number,
    confidenceScore: Number,
    totalScore: Number,

    result: {
      type: String,
      enum: ["PASS", "FAIL"],
    },

    feedback: String,
  },
  { timestamps: true }
);

export default mongoose.model<IEvaluation>(
  "Evaluation",
  evaluationSchema
);
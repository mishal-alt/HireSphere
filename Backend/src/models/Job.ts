import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
    title: string;
    department: string;
    description: string;
    status: "Active" | "Paused" | "Closed";
    companyId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const JobSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        department: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ["Active", "Paused", "Closed"], default: "Active" },
        companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);

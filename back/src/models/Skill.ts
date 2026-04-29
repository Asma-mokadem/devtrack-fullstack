import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISkill extends Document {
  user: Types.ObjectId;
  name: string;
  level: number;    
  category: "Language" | "Framework" | "Tool" | "Other"
  createdAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    level: {
      type: Number,
      required: [true, "level is required"],
      min: [1, "Minimum 1"],
      max: [100, "Maximum 100"],
    },
    category: {
      type: String,
      enum: ["Language" , "Framework" , "Tool" , "Other"],
      default: "Other",
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model<ISkill>("Skill", SkillSchema);
export default Skill;
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProject extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  techStack: string[];
  githubUrl?: string;
  status: "pending" | "completed" | "in progress";
  progress: number;
  hoursSpent: number;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    techStack: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "in progress"],
      default: "pending",
    },

    progress: {
      type: Number,
      min: [0, "Minimum is 0%"],
      max: [100, "Maximum is 100%"],
      default: 0,
    },

    hoursSpent: {
      type: Number,
      min: [0, "Hours cannot be negative"],
      default: 0,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    estimatedDays: {
      type: Number,
      default: 1,
    },
    startDate: Date,
    endDate: Date
  },
  { _id: false } // nested schema, no separate collection
);

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalText: {
      type: String,
      required: [true, "Goal text is required"],
      trim: true,
    },
    tasks: [taskSchema],
    totalDurationDays: {
      type: Number,
      default: 0,
    },
    generatedByAI: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);

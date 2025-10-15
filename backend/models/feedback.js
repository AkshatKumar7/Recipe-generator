import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const feedbackSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    recipeId: { type: Types.ObjectId, ref: "Recipe", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

export default model("Feedback", feedbackSchema);

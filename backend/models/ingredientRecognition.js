import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ingredientRecognitionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: false },
    imageUrl: { type: String, required: true, trim: true },
    recognizedIngredients: { type: [String], default: [] },
    confidenceScores: {
      type: [Number],
      default: [],
      validate: {
        validator: function (arr) {
          // Ensure lengths match if both provided
          if (!Array.isArray(arr)) return false;
          if (!this.recognizedIngredients) return arr.length === 0;
          return arr.length === this.recognizedIngredients.length;
        },
        message: "confidenceScores must be an array with the same length as recognizedIngredients",
      },
    },
  },
  { timestamps: true }
);

export default model("IngredientRecognition", ingredientRecognitionSchema);

import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const IngredientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: false, trim: true },
    substitutes: { type: [String], default: [] },
  },
  { _id: false }
);

const RatingSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const NutritionSchema = new Schema(
  {
    calories: { type: Number, min: 0, default: 0 },
    protein: { type: Number, min: 0, default: 0 },
    carbs: { type: Number, min: 0, default: 0 },
    fat: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const recipeSchema = new Schema(
  {
    name: { type: String, required: [true, "Recipe name is required"], trim: true },
    cuisine: { type: String, trim: true },
    ingredients: { type: [IngredientSchema], default: [] },
    instructions: { type: [String], default: [] },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
    cookingTime: { type: Number, min: 0, default: 0 },
    servings: { type: Number, min: 1, default: 1 },
    dietaryTags: { type: [String], default: [] },
    nutritionalInfo: { type: NutritionSchema, default: () => ({}) },
    imageUrl: { type: String, trim: true },
    ratings: { type: [RatingSchema], default: [] },
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

// Recalculate average rating
recipeSchema.methods.recalculateAverageRating = function () {
  if (!this.ratings || this.ratings.length === 0) {
    this.averageRating = 0;
    return this.averageRating;
  }
  const sum = this.ratings.reduce((acc, r) => acc + (r.rating || 0), 0);
  this.averageRating = parseFloat((sum / this.ratings.length).toFixed(2));
  return this.averageRating;
};

// When a new rating is added via push and saved, keep average in sync
recipeSchema.pre("save", function (next) {
  this.recalculateAverageRating();
  next();
});

export default model("Recipe", recipeSchema);

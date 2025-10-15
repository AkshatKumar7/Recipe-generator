import Recipe from '../models/recipe.js';
import User from '../models/user.js';
import openaiClient from '../utils/openaiClient.js';

export const listRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    res.status(200).json({ message: 'Recipes fetched', data: recipes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list recipes', error: err.message });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).lean();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json({ message: 'Recipe fetched', data: recipe });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get recipe', error: err.message });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const payload = req.body;
    const recipe = await Recipe.create(payload);
    res.status(201).json({ message: 'Recipe created', data: recipe });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create recipe', error: err.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Recipe.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
  }
};

export const generateRecipe = async (req, res) => {
  try {
    const { ingredients = [], dietaryPreferences = [], servings = 2, saveToHistory = true } = req.body;

    if (!Array.isArray(ingredients)) return res.status(400).json({ message: 'ingredients must be an array' });

    // Check for missing/empty ingredients
    if (ingredients.length === 0) {
      return res.status(400).json({ message: 'No ingredients provided' });
    }

    // Check for missing userId (auth middleware)
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    let recipeObj;
    try {
      recipeObj = await openaiClient.generateRecipe({ ingredients, dietaryPreferences, servings });
    } catch (openaiErr) {
      console.error('OpenAI error:', openaiErr);
      return res.status(500).json({ message: 'OpenAI API error', error: openaiErr.message });
    }

    // Basic validation: require a name and instructions
    if (!recipeObj || !recipeObj.name || !recipeObj.instructions) {
      return res.status(500).json({ message: 'OpenAI returned invalid recipe', data: recipeObj });
    }

    let created;
    try {
      created = await Recipe.create(recipeObj);
    } catch (dbErr) {
      console.error('MongoDB error:', dbErr);
      return res.status(500).json({ message: 'Database error', error: dbErr.message });
    }

    // Optionally save to user's history
    if (req.userId && saveToHistory) {
      try {
        await User.findByIdAndUpdate(req.userId, { $push: { recipeHistory: created._id } });
      } catch (userErr) {
        console.error('User history error:', userErr);
        // Don't fail the request if history update fails
      }
    }

    res.status(201).json({ message: 'Recipe generated', data: created });
  } catch (err) {
    console.error('Recipe generation error:', err);
    res.status(500).json({ message: 'Failed to generate recipe', error: err.message });
  }
};

export default { listRecipes, getRecipeById, createRecipe, deleteRecipe, generateRecipe };

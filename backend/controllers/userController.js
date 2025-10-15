import User from '../models/user.js';
import Recipe from '../models/recipe.js';

export const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Preferences fetched', data: user.dietaryPreferences || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch preferences', error: err.message });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { dietaryPreferences } = req.body;
    if (!Array.isArray(dietaryPreferences)) return res.status(400).json({ message: 'dietaryPreferences must be an array' });
    const user = await User.findByIdAndUpdate(req.userId, { dietaryPreferences }, { new: true }).lean();
    res.status(200).json({ message: 'Preferences updated', data: user.dietaryPreferences });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update preferences', error: err.message });
  }
};

export const addFavourite = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ message: 'recipeId required' });
    await User.findByIdAndUpdate(req.userId, { $addToSet: { savedRecipes: recipeId } });
    res.status(200).json({ message: 'Recipe added to favourites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add favourite', error: err.message });
  }
};

export const removeFavourite = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ message: 'recipeId required' });
    await User.findByIdAndUpdate(req.userId, { $pull: { savedRecipes: recipeId } });
    res.status(200).json({ message: 'Recipe removed from favourites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favourite', error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('recipeHistory').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'History fetched', data: user.recipeHistory || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};

export default { getPreferences, updatePreferences, addFavourite, removeFavourite, getHistory };

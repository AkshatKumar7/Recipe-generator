import IngredientRecognition from '../models/ingredientRecognition.js';
import openaiClient from '../utils/openaiClient.js';
import { recognizeIngredientsFatSecret, getFatSecretAccessToken } from '../utils/fatsecretClient.js';

export const recognizeFromImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' });

    const result = await openaiClient.recognizeIngredients({ imageUrl });

    const doc = await IngredientRecognition.create({
      userId: req.userId || null,
      imageUrl,
      recognizedIngredients: result.recognizedIngredients || [],
      confidenceScores: result.confidenceScores || [],
    });

    res.status(201).json({ message: 'Ingredients recognized', data: doc });
  } catch (err) {
    res.status(500).json({ message: 'Failed to recognize ingredients', error: err.message });
  }
};

export const recognizeFromFatSecret = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' });

    // Get access token from env or fetch if missing
    let accessToken = process.env.FATSECRET_ACCESS_TOKEN;
    if (!accessToken) {
      try {
        accessToken = await getFatSecretAccessToken();
      } catch (tokenErr) {
        return res.status(500).json({ message: 'Failed to obtain FatSecret access token', error: tokenErr.message });
      }
    }

    let ingredients;
    try {
      ingredients = await recognizeIngredientsFatSecret({ imageUrl, accessToken });
    } catch (apiErr) {
      return res.status(500).json({ message: 'FatSecret API error', error: apiErr.message });
    }

    res.status(200).json({ message: 'Ingredients recognized via FatSecret', data: { imageUrl, ingredients } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to recognize ingredients via FatSecret', error: err.message });
  }
};

export default { recognizeFromImage, recognizeFromFatSecret };

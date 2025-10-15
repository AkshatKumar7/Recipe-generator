import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const FATSECRET_BASE_URL = 'https://platform.fatsecret.com/rest/server.api';
const FATSECRET_TOKEN_URL = 'https://platform.fatsecret.com/oauth2/token';

/**
 * Get FatSecret OAuth2 access token using client credentials.
 * @returns {Promise<string>} - Access token string
 */
export async function getFatSecretAccessToken() {
  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('FatSecret client credentials missing');

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'basic');

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(
      FATSECRET_TOKEN_URL,
      params,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    throw new Error(err.response?.data?.error_description || 'FatSecret token error');
  }
}

/**
 * Recognize ingredients from an image using FatSecret API.
 * @param {string} imageUrl - The URL of the image to analyze.
 * @param {string} accessToken - OAuth2 Bearer token for FatSecret API.
 * @returns {Promise<Array<string>>} - List of recognized ingredients.
 */
export async function recognizeIngredientsFatSecret({ imageUrl, accessToken }) {
  // FatSecret API expects a method parameter and image_url
  const params = new URLSearchParams();
  params.append('method', 'food.recognize.v1');
  params.append('image_url', imageUrl);
  params.append('format', 'json');

  try {
    const response = await axios.post(
      FATSECRET_BASE_URL,
      params,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    // Parse response for ingredients
    // The actual response format may differ; adjust as needed
    const ingredients = response.data?.ingredients || [];
    return ingredients;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'FatSecret API error');
  }
}

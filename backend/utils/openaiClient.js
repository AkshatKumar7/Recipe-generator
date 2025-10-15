import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. OpenAI features will fail until it is provided.');
}
console.log('Loaded OPENAI_API_KEY in openaiClient.js:', OPENAI_API_KEY ? 'Yes' : 'No');

const BASE_URL = 'https://api.openai.com/v1';

async function callOpenAI(path, body) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${text}`);
  }

  return res.json();
}

export async function generateRecipe({ ingredients = [], dietaryPreferences = [], servings = 2 }) {
  const systemPrompt = `You are a helpful chef assistant. Generate a single recipe JSON object containing: name, cuisine, ingredients (array of {name, quantity, substitutes}), instructions (array of steps), difficulty (Easy|Medium|Hard), cookingTime (minutes), servings, dietaryTags (array), nutritionalInfo (calories, protein, carbs, fat).`;

  const userPrompt = `Ingredients: ${ingredients.join(', ')}\nDietary preferences: ${dietaryPreferences.join(', ') || 'none'}\nTarget servings: ${servings}\nReturn only valid JSON.`;

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_tokens: 800,
    temperature: 0.8,
  };

  const json = await callOpenAI('/chat/completions', body);
  const text = json.choices?.[0]?.message?.content;
  try {
    // Try to parse the JSON; if the model returned extra text, extract the JSON block
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    const jsonText = firstBrace >= 0 && lastBrace >= 0 ? text.slice(firstBrace, lastBrace + 1) : text;
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error('Failed to parse OpenAI recipe response: ' + err.message + '\nResponse: ' + text);
  }
}

export async function recognizeIngredients({ imageUrl }) {
  // For vision-capable models, many deployments expose image inputs via the chat/completions endpoint with content-type json
  const systemPrompt = `You are an image understanding assistant that lists detected ingredients present in an image and returns a JSON object { recognizedIngredients: [string], confidenceScores: [number between 0 and 1] }.`;
  const userPrompt = `Image URL: ${imageUrl}. Return only valid JSON.`;

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_tokens: 400,
  };

  const json = await callOpenAI('/chat/completions', body);
  const text = json.choices?.[0]?.message?.content;
  try {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    const jsonText = firstBrace >= 0 && lastBrace >= 0 ? text.slice(firstBrace, lastBrace + 1) : text;
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error('Failed to parse OpenAI recognition response: ' + err.message + '\nResponse: ' + text);
  }
}

export default { generateRecipe, recognizeIngredients };

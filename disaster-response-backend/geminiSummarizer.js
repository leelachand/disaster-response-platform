// geminiSummarizer.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = 'gemini-1.5-flash';

const getGeminiSummary = async (rawText) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
You're an intelligent disaster alert summarizer.
Given an unstructured alert text, extract key details:

1. Disaster type (flood, fire, earthquake, etc.)
2. Location (try to summarize in a name or place)
3. Tags (array of relevant tags)
4. Short summary (1-2 lines max)

Respond strictly in JSON format like:
{
  "type": "Flood",
  "location": "Mumbai",
  "tags": ["flood", "rain", "emergency"],
  "summary": "Heavy flooding reported in Mumbai due to ongoing monsoon rains."
}

ALERT TEXT:
${rawText}
    `;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    const cleanJson = responseText.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(cleanJson);
  } catch (err) {
    console.error('Gemini summarization error:', err.message || err);
    return null;
  }
};

module.exports = { getGeminiSummary };


import fs from 'fs';
import mime from 'mime-types';
import { GoogleGenAI } from '@google/genai';
import { configDotenv } from 'dotenv';

configDotenv();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function askGemini(promptText) {
  const prompt = `Using bubble sort, sort these numbers in ascending order and return only the sorted list: ${promptText}`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: 'user', text: prompt }]
  });
  return result.text;
}

export { askGemini };


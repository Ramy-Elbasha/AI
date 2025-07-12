import fs from 'fs';
import mime from 'mime-types';
import { GoogleGenAI } from '@google/genai';
import { configDotenv } from 'dotenv';

configDotenv();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function fileToGenerativePart(filePath) {
  const mimeType = mime.getType(filePath);
  const data = await fs.promises.readFile(filePath);
  return {
    inlineData: {
      data: data.toString('base64'),
      mimeType,
    },
  };
}


async function askGemini(promptText){
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:[
      {
        role:'user',
        text: promptText
      }
    ]
  })

  return res.text;
}

async function askGeminiWithFile(promptText, filePath) {
  const filePart = await fileToGenerativePart(filePath);

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: [
      {
        role: 'user',
        parts: [
          { text: promptText },
          filePart,
        ],
      },
    ],
  });

  return result.text;
}

export { askGemini, askGeminiWithFile };
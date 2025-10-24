import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY in .env file");
}

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export default genAI;

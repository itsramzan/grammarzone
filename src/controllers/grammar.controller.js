import asyncHandler from "express-async-handler";
import fs from "fs";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import markdownit from "markdown-it";
import genAI from "../config/gemini.js";
import { renderWithLayout } from "../utils/renderWithLayout.js";

const md = markdownit({ breaks: true });

export const solveGrammar = asyncHandler(async (req, res) => {
  const { question: inputQuestion, category } = req.body;
  const image = req.file;

  let question = inputQuestion?.trim();

  if (!question && !image) {
    throw createError(StatusCodes.BAD_REQUEST, "Provide either text or image");
  }

  // 🧠 STEP 1: If user sent image, extract text using Gemini OCR
  if (image && !question) {
    try {
      const imageBuffer = fs.readFileSync(image.path);
      const base64Image = imageBuffer.toString("base64");
      const mimeType = image.mimetype || "image/png";

      const ocrResponse = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Extract all visible English text from this image clearly and return it as plain text only.",
              },
              {
                inlineData: { mimeType, data: base64Image },
              },
            ],
          },
        ],
      });

      question = ocrResponse.text?.trim() || "";
    } catch (err) {
      console.error("Image text extraction failed:", err);
      throw createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to extract text from image"
      );
    }
  }

  if (!question) {
    throw createError(
      StatusCodes.BAD_REQUEST,
      "No readable text found in image"
    );
  }

  // 🧩 STEP 2: Build grammar-solving prompt
  const prompt = `
You are an expert Bangladeshi English grammar teacher.
Solve this ${category || "general grammar"} question in HSC exam style.
First give the complete correct answer.
Then provide a Bangla explanation in simple, clear Bangla.
Do not add anything else.
Question: ${question}
`;

  try {
    // 🧩 STEP 3: Generate grammar solution
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const answer = md.render(response.text);

    // 🧩 STEP 4: Render recognized text + AI solution
    renderWithLayout(res, "solve", {
      title: `${category || "Grammar"} - Solution`,
      question: md.render(question),
      answer,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw createError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to generate AI response"
    );
  } finally {
    if (image) fs.unlinkSync(image.path); // cleanup
  }
});

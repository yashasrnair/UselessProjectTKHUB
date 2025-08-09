// backend/src/utils/geminiClient.js
const fetch = (...args) =>import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const path = require("path");

async function getGeminiResponse(prompt, imagePath = null) {
  try {
    let body;

    if (imagePath) {
      const imageData = fs.readFileSync(imagePath, { encoding: "base64" });
      const ext = path.extname(imagePath).toLowerCase().replace(".", "");
      const mime = ext === "png" ? "image/png" : "image/jpeg";

      body = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mime,
                  data: imageData,
                },
              },
            ],
          },
        ],
      };
    } else {
      body = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };
    }

    const response = await fetch(
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    return "Couldn't figure out a mood 😅";
  } catch (error) {
    console.error("Gemini error:", error);
    return "Error talking to Gemini API.";
  }
}

module.exports = { getGeminiResponse };

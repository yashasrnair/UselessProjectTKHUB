const fetch = (...args) =>import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const path = require("path");

async function getGeminiResponse(prompt, imagePath = null) {
  try {
    let body;

    if (imagePath) {
      // With image
      const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

      body = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: `image/${path.extname(imagePath).substring(1)}`,
                  data: imageData,
                },
              },
            ],
          },
        ],
      };
    } else {
      // Text only
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

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    return "Couldn't figure out a mood 😅";
  } catch (error) {
    console.error("Gemini error:", error);
    return "Error talking to Gemini API.";
  }
}

module.exports = { getGeminiResponse };

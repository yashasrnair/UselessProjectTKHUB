const fs = require("fs");
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getGeminiResponse(prompt, imagePath) {
  try {
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
    const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

    const body = {
      contents: [
        {
          parts: [
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
            {
              text: `${prompt}\nRespond in one funny, emotional sentence as if you are this object.`,
            },
          ],
        },
      ],
    };

    const res = await fetch(
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Couldn't figure out a mood 😅"
    );
  } catch (err) {
    console.error("Gemini error:", err);
    return "Error talking to Gemini API.";
  }
}

module.exports = { getGeminiResponse };

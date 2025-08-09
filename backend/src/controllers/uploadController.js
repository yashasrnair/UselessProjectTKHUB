const fs = require("fs");
const ObjectItem = require("../models/ObjectItem");
const { getGeminiResponse } = require("../utils/geminiClient");

exports.uploadImage = async (req, res) => {
  try {
    console.log("📤 Upload request received:", { type: req.body.type, filename: req.file?.filename });
    
    const { type } = req.body;
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const prompt = `You are a ${type}. Describe your mood in 1 funny, emotional sentence, 
with personality. Avoid generic replies. Avoid long scentences keep it short to 2 scentences`;

    const reply = await getGeminiResponse(prompt, req.file.path);
    console.log("🤖 Gemini response:", reply);

    const objectItem = new ObjectItem({
      type,
      mood: reply,
      personality: "random",
    });
    const saved = await objectItem.save();
    console.log("💾 Saved to database:", saved._id);

    const response = {
      _id: saved._id.toString(),
      type: saved.type,
      personality: saved.personality,
      mood: saved.mood,
    };
    
    console.log("📤 Sending response:", response);
    res.json(response);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

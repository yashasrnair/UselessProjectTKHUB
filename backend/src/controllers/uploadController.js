const fs = require("fs");
const ObjectItem = require("../models/ObjectModel");
const { getGeminiResponse } = require("../utils/geminiClient");

exports.uploadImage = async (req, res) => {
  try {
    const { type } = req.body;
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const prompt = `You are a ${type}. Describe your mood in 1 funny, emotional sentence, 
with personality. Avoid generic replies.`;

    const reply = await getGeminiResponse(prompt, req.file.path);

    const objectItem = new ObjectItem({
      type,
      mood: reply,
      personality: "random",
    });
    await objectItem.save();

    res.json({ mood: reply, saved: objectItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

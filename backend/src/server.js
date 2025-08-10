require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const uploadRoutes = require("./routes/uploadRoutes");
const objectRoutes = require("./routes/objectRoutes");

const app = express();

// Parse JSON
app.use(express.json());

// Allow CORS (frontend dev + production)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL || "*" // allow production URL
  ],
  credentials: true
}));

// API routes
app.use("/api/upload", uploadRoutes);
app.use("/api/objects", objectRoutes);

// Serve frontend build
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// If frontend is built into ../frontend/dist, serve it
const distPath = path.join(__dirname, "../../frontend/dist");
const fs = require("fs");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

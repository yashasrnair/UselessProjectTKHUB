// backend/src/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Store uploads in "uploads" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/", upload.single("photo"), uploadImage);

module.exports = router;

// backend/src/routes/cropDetection.route.js

import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { scrapeCropData } from "../helpers/scraper.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const upload = multer({ dest: uploadsDir });

// POST /api/detect-crop
router.post("/detect-crop", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imagePath = req.file.path;

  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    // ✅ Send to Flask model server (port 5001)
    const response = await axios.post("http://localhost:5001/predict", formData, {
      headers: formData.getHeaders(),
      timeout: 10000,
    });

    // ✅ Correct field names from Flask
    const { predicted_crop, confidence } = response.data;

    // ✅ Try scraping data directly
    let scrapedData = await scrapeCropData(predicted_crop);

    // 🔍 Wikipedia fallback search if no data found
    if (!scrapedData || (!scrapedData.description && !scrapedData.scientificName)) {
      console.warn(`No direct match for "${predicted_crop}". Trying Wikipedia search...`);
      try {
        const searchRes = await axios.get(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(predicted_crop)}&utf8=&format=json`
        );
        if (searchRes.data?.query?.search?.length > 0) {
          const firstResultTitle = searchRes.data.query.search[0].title;
          scrapedData = await scrapeCropData(firstResultTitle);
        }
      } catch (err) {
        console.error("Wikipedia search failed:", err.message);
      }
    }

    // ✅ Combine prediction + scraped data
    const finalResponse = {
      crop: predicted_crop,
      confidence: confidence,
      scientificName: scrapedData?.scientificName || "N/A",
      description: scrapedData?.description || "Description not available.",
      characteristics: scrapedData?.characteristics || [],
      imageUrls: scrapedData?.imageUrls || []  // ✅ match frontend
    };



    // Cleanup uploaded file
    await fs.promises.unlink(imagePath);

    res.json(finalResponse);
  } catch (error) {
    console.error("Prediction error:", error.message);

    if (fs.existsSync(imagePath)) {
      await fs.promises.unlink(imagePath);
    }

    res.status(500).json({
      error: "Crop prediction failed",
      details: error.message,
    });
  }
});

export default router;

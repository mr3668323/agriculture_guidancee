import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { scrapeDiseaseData } from "../helpers/diseaseScraper.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const upload = multer({ dest: uploadsDir });

// POST /api/detect-disease
router.post("/detect-disease", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });

  }

  const imagePath = req.file.path;

  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    // 1️⃣ Send to Flask disease model
    const response = await axios.post("http://localhost:5002/predict-disease", formData, {
      headers: formData.getHeaders(),
      timeout: 15000,
    });

    console.log("Flask Model Response:", response.data); // <--- ADD THIS LINE


    const { disease_name, affected_crop, confidence } = response.data;
    const predicted_disease = disease_name || "Unknown Disease";

    // 2️⃣ Scrape disease info
    let scrapedData = await scrapeDiseaseData(predicted_disease);

    // 3️⃣ Wikipedia fallback search if no data found
    if (
      !scrapedData ||
      (scrapedData.symptoms.length === 0 &&
       scrapedData.causes.length === 0 &&
       scrapedData.prevention.length === 0 &&
       scrapedData.treatment.length === 0)
    ) {
      console.warn(`No direct match for "${predicted_disease}". Trying Wikipedia search...`);
      try {
        const searchRes = await axios.get(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(predicted_disease)}&utf8=&format=json`
        );
        if (searchRes.data?.query?.search?.length > 0) {
          const firstResultTitle = searchRes.data.query.search[0].title;
          scrapedData = await scrapeDiseaseData(firstResultTitle);
        }
      } catch (err) {
        console.error("Wikipedia search failed:", err.message);
      }
    }

    // 4️⃣ Final response
    const finalResponse = {
      disease: predicted_disease,
      affectedCrop: affected_crop || "Unknown crop",
      confidence: confidence,
      symptoms: scrapedData?.symptoms || [],
      causes: scrapedData?.causes || [],
      prevention: scrapedData?.prevention || [],
      treatment: scrapedData?.treatment || [],
      imageUrl: scrapedData?.imageUrl || null
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
      error: "Disease prediction failed",
      details: error.response?.data || error.message,
    });
  }
});

export default router;

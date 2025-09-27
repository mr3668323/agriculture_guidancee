import express from "express";
import { scrapeDiseaseData } from "../helpers/diseaseScraper.js";

const router = express.Router();

// GET /api/disease-details?name=Wheat_Blast
router.get("/disease-details", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Disease name is required" });
  }

  try {
    const cleanName = name.replace(/_/g, " "); // from Flask model
    const data = await scrapeDiseaseData(cleanName);

    // Ensure consistent structure (never undefined)
    res.json({
      disease: cleanName,
      symptoms: data.symptoms || [],
      causes: data.causes || [],
      prevention: data.prevention || [],
      treatment: data.treatment || [],

    });
  } catch (err) {
    console.error("Error fetching disease details:", err.message);
    res.status(500).json({
      disease: name.replace(/_/g, " "),
      symptoms: [],
      causes: [],
      prevention: [],
      treatment: [],
      error: "Failed to fetch disease details"
    });
  }

});

export default router;

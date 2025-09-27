import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import cheerio from "cheerio";

const router = express.Router();

// Ensure uploads dir exists
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir });

// --- helper: scrape fruit info from Wikipedia ---
async function scrapeFruitData(fruitName) {
  try {
    console.log(`[Scraper] Fetching Wikipedia data for: ${fruitName}`);
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(fruitName)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const description = $("p").first().text().trim();
    let scientificName = $("table.infobox td:contains('Binomial name')")
      .next()
      .text()
      .trim();
    if (!scientificName) {
      scientificName = $("table.infobox i").first().text().trim() || "Unknown scientific name";
    }

    const images = [];
    $("table.infobox img").each((i, el) => {
      if (i < 3) {
        const src = $(el).attr("src");
        if (src) {
          images.push(src.startsWith("http") ? src : `https:${src}`);
        }
      }
    });

    return {
      name: fruitName,
      scientificName: scientificName || "Unknown",
      description: description || "No description found.",
      images,
    };
  } catch (err) {
    console.error("[Scraper Error]:", err.message);
    return {
      name: fruitName,
      scientificName: "Unknown",
      description: "No additional info available.",
      images: [],
    };
  }
}

// --- POST /api/fruits/detect-fruit-stage ---
router.post("/detect-fruit-stage", upload.single("image"), async (req, res) => {
  console.log("[API] /api/fruits/detect-fruit-stage called");

  if (!req.file) {
    console.error("[API Error] No image uploaded");
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imagePath = req.file.path;
  console.log(`[API] Image saved to: ${imagePath}`);

  try {
    // Prepare form-data for Flask
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    console.log("[API] Forwarding image to Flask: http://localhost:5003/predict-fruit-stage");

    const flaskResponse = await axios.post("http://localhost:5003/predict-fruit-stage", formData, {
      headers: formData.getHeaders(),
      timeout: 20000,
    });

    console.log("[Flask Response Data]:", flaskResponse.data);

    const { fruit_name, stage_name, confidence } = flaskResponse.data || {};

    if (!fruit_name || !stage_name) {
      console.warn("[API Warning] Flask returned incomplete data:", flaskResponse.data);
    } else {
      console.log(`[API] Flask Prediction -> Fruit: ${fruit_name}, Stage: ${stage_name}, Confidence: ${confidence}`);
    }

    // Scrape Wikipedia info about fruit
    const fruitInfo = await scrapeFruitData(fruit_name);

    // Cleanup uploaded file
    await fs.promises.unlink(imagePath);
    console.log("[API] Temp uploaded image deleted");

    const finalResponse = {
      fruit_name: fruit_name || "Unknown",
      stage_name: stage_name || "Unknown Stage",
      confidence: confidence || 0,
      fruit_info: fruitInfo,
    };

    console.log("[API] Final Response sent to frontend:", finalResponse);
    res.json(finalResponse);
  } catch (error) {
    console.error("[API Error]:", error.message);

    if (error.response) {
      console.error("[Flask Error Data]:", error.response.data);
      console.error("[Flask Status]:", error.response.status);
    } else {
      console.error("[API Error Stack]:", error.stack);
    }

    if (fs.existsSync(imagePath)) {
      await fs.promises.unlink(imagePath);
      console.log("[API] Cleaned up uploaded file after error");
    }

    res.status(500).json({
      error: "Fruit detection failed",
      details: error.response?.data ? String(error.response.data) : error.message,
    });
  }
});

export default router;

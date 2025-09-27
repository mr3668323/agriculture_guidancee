import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Scrape disease information from Wikipedia (with improved fallback logic).
 * @param {string} diseaseName
 * @returns {Promise<{ symptoms: string[], causes: string[], prevention: string[], treatment: string[] }>}
 */
export async function scrapeDiseaseData(diseaseName) {
  try {
    let pageTitle = `${diseaseName} plant disease`;
    let html;

    // 1. Search Wikipedia for a better match
    const searchRes = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(pageTitle)}&utf8=&format=json`
    );

    if (searchRes.data?.query?.search?.length > 0) {
      pageTitle = searchRes.data.query.search[0].title;
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;
      const { data } = await axios.get(pageUrl, { timeout: 15000 });
      html = data;
    } else {
      console.warn(`No Wikipedia results found for "${pageTitle}".`);
      return {
        symptoms: ["No specific symptoms found online."],
        causes: ["No specific causes found online."],
        prevention: ["No specific prevention methods found online."],
        treatment: ["No specific treatment methods found online."]
      };
    }

    // 2. Parse HTML with cheerio
    const $ = cheerio.load(html);
    const details = { symptoms: [], causes: [], prevention: [], treatment: [], imageUrl: null };

    // Helper: extract list items and paragraphs under specific headings
    const extractSection = (headingKeywords) => {
      const results = [];
      $("h2, h3").each((_, el) => {
        const heading = $(el).text().toLowerCase();
        if (headingKeywords.some(keyword => heading.includes(keyword))) {
          const section = $(el).nextUntil("h2, h3");

          // First: extract list items
          section.find("ul li").each((_, li) => {
            const text = $(li).text().trim()
              .replace(/\[\d+\]/g, "")
              .replace(/\(.*?\)/g, "")
              .trim();
            if (text.length > 5) results.push(text);
          });

          // If no list items, fallback to paragraphs
          if (results.length === 0) {
            section.find("p").each((_, p) => {
              const text = $(p).text().trim()
                .replace(/\[\d+\]/g, "")
                .replace(/\(.*?\)/g, "")
                .trim();
              if (text.length > 20) results.push(text);
            });
          }
        }
      });
      return results;
    };

    // 3. Try structured extraction first
    details.symptoms = extractSection(["symptom", "sign"]);
    details.causes = extractSection(["cause", "etiology", "pathogen", "fungus", "bacteria", "virus", "mite"]);
    details.prevention = extractSection(["prevention", "management", "control", "avoid"]);
    details.treatment = extractSection(["treatment", "therapy", "control", "management"]);

    // 4. Fallback → scan all paragraphs if sections are empty
    const paragraphs = [];
    $("p").each((_, p) => {
      const text = $(p).text().trim().replace(/\[\d+\]/g, "");
      if (text.length > 50) paragraphs.push(text);
    });

    if (details.symptoms.length === 0 && paragraphs.length) {
      details.symptoms = paragraphs.slice(0, 2);
    }
    if (details.causes.length === 0) {
      details.causes = paragraphs.filter(t =>
        /cause|pathogen|fungus|mite|bacteria|virus/i.test(t)
      ).slice(0, 2);
    }
    if (details.prevention.length === 0) {
      details.prevention = paragraphs.filter(t =>
        /prevent|avoid|management|control/i.test(t)
      ).slice(0, 3);
    }
    if (details.treatment.length === 0) {
      details.treatment = paragraphs.filter(t =>
        /treat|fungicide|spray|chemical|control|cure/i.test(t)
      ).slice(0, 3);
    }

    // 5. Final fallback to ensure no empty arrays
    if (details.symptoms.length === 0) details.symptoms = ["No specific symptoms found online."];
    if (details.causes.length === 0) details.causes = ["No specific causes found online."];
    if (details.prevention.length === 0) details.prevention = ["No specific prevention methods found online."];
    if (details.treatment.length === 0) details.treatment = ["No specific treatment methods found online."];

    // Debug logs
    console.log("===== Scraper Results for:", diseaseName, "=====");
    console.log("Symptoms found:", details.symptoms.length, details.symptoms.slice(0, 2));
    console.log("Causes found:", details.causes.length, details.causes.slice(0, 2));
    console.log("Prevention found:", details.prevention.length, details.prevention.slice(0, 2));
    console.log("Treatment found:", details.treatment.length, details.treatment.slice(0, 2));
    console.log("===========================================");

    return details;
  } catch (err) {
    console.error(`❌ Scraping failed for ${diseaseName}:`, err.message);
    return {
      symptoms: ["No data found"],
      causes: ["No data found"],
      prevention: ["No data found"],
      treatment: ["No data found"]
    };
  }
}

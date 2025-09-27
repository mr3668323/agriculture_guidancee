// backend/src/helpers/scraper.js
import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Scrape crop details from Wikipedia
 * @param {string} cropName
 * @returns {Promise<{scientificName: string, description: string, characteristics: string[], imageUrls: string[]}|null>}
 */
export async function scrapeCropData(cropName) {
  try {
    console.log(`[scraper] scraping for: "${cropName}"`);
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(cropName)}`;

    const { data: html } = await axios.get(url, {
      timeout: 15000,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; scraper/1.0)" }
    });

    const $ = cheerio.load(html);

    // Helper cleaners
    const cleanText = (s = "") =>
      s
        .replace(/\[\d+\]/g, "")       // remove citation markers [1]
        .replace(/¶/g, "")            // remove paragraph glyphs sometimes present
        .replace(/\s+/g, " ")
        .replace(/^\s+|\s+$/g, "")
        .replace(/(?:\d+\.)+/g, "")   // remove '3.1' style numbers
        .trim();

    // 1) Extract images from infobox (keep these before removing infobox)
    const imageUrls = [];
    $("table.infobox img").each((_, el) => {
      const src = $(el).attr("src");
      if (src && imageUrls.length < 3) {
        imageUrls.push(src.startsWith("http") ? src : `https:${src}`);
      }
    });

    // 2) Extract scientific name (prefer infobox row labels)
    let scientificName = "N/A";
    const sciFromTable = $("table.infobox tr")
      .filter((i, el) => {
        const header = $(el).find("th").text().toLowerCase();
        return (
          header.includes("scientific name") ||
          header.includes("binomial name") ||
          header.includes("species") ||
          header.includes("genus")
        );
      })
      .find("i")
      .first()
      .text()
      .trim();

    if (sciFromTable) {
      scientificName = cleanText(sciFromTable);
    } else {
      const italic = $("table.infobox i").first().text().trim();
      if (italic) scientificName = cleanText(italic);
    }

    // Remove irrelevant page fragments that commonly pollute lists/content
    $("#toc, .toc, .navbox, .vertical-navbox, .references, .hatnote, .metadata, .thumb, .reflist")
      .remove();

    // 3) Description: find first meaningful paragraph from article body
    let description = "Description not available.";
    $(".mw-parser-output > p").each((i, el) => {
      let txt = cleanText($(el).text());
      if (txt && !txt.toLowerCase().includes("may refer to") && txt.length > 60) {
        description = txt;
        return false; // break out
      }
    });

    // If description still default, try the REST summary endpoint (clean)
    if (!description || description === "Description not available.") {
      try {
        const sumRes = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cropName)}`,
          { timeout: 8000, headers: { "User-Agent": "Mozilla/5.0" } }
        );
        if (sumRes?.data?.extract) {
          description = cleanText(sumRes.data.extract);
        }
      } catch (e) {
        // ignore fallback failure
      }
    }

    // 4) Characteristics: look for relevant headers and extract ul/li or sentences from p
    const characteristics = [];
    const targetKeywords = [
      "description",
      "characteristics",
      "cultivation",
      "morphology",
      "botany",
      "biology",
      "uses",
      "production",
      "distribution",
      "habitat",
      "growth",
      "agronomy"
    ];

    // scan headers with mw-headline (more reliable)
    $("h2, h3, h4").each((i, hdr) => {
      // prefer the visible headline text if present
      const headline = $(hdr).find(".mw-headline").text().toLowerCase() || $(hdr).text().toLowerCase();
      const normalized = cleanText(headline);

      if (targetKeywords.some(k => normalized.includes(k))) {
        const section = $(hdr).nextUntil("h2, h3, h4");

        // First try to grab list items
        section.find("ul li").each((_, li) => {
          // skip lists in navboxes or other junk
          if ($(li).closest(".navbox, .toc, .reference, .navbox-inner, .mw-empty-elt").length > 0) return;
          const t = cleanText($(li).text());
          if (t.length > 30 && !characteristics.includes(t)) characteristics.push(t);
          if (characteristics.length >= 5) return false;
        });

        // If no list items, take sentences from paragraphs in this section
        if (characteristics.length < 1) {
          section.find("p").each((_, p) => {
            const paragraph = cleanText($(p).text());
            if (!paragraph || paragraph.length < 80) return;
            // split into sentences heuristically
            const sentences = paragraph.split(/(?<=[.?!])\s+/);
            for (const s of sentences) {
              const cs = cleanText(s);
              if (cs.length > 40 && !characteristics.includes(cs)) {
                characteristics.push(cs);
                if (characteristics.length >= 5) break;
              }
            }
            if (characteristics.length >= 5) return false;
          });
        }
      }
      if (characteristics.length >= 5) return false;
    });

    // 5) Fallback: if still empty, pick good-looking <ul> lists from the article body (skip navboxes)
    if (characteristics.length === 0) {
      $(".mw-parser-output ul").each((_, ul) => {
        if ($(ul).closest(".navbox, #toc, .reflist, .references, .toc").length > 0) return;
        $(ul).find("li").each((__, li) => {
          const t = cleanText($(li).text());
          if (t.length > 30 && !characteristics.includes(t)) {
            characteristics.push(t);
            if (characteristics.length >= 5) return false;
          }
        });
        if (characteristics.length >= 5) return false;
      });
    }

    // final cleaning & dedupe & limit
    const finalChars = [...new Set(characteristics)].slice(0, 5);

    // ensure we have at least one useful fallback text (short summary bullet)
    if (finalChars.length === 0 && description && description.length > 40) {
      // pick up to first 3 sensible sentence fragments from description
      const sents = description.split(/(?<=[.?!])\s+/).map(s => cleanText(s)).filter(Boolean);
      for (const s of sents) {
        if (s.length > 40) finalChars.push(s);
        if (finalChars.length >= 3) break;
      }
    }

    // ensure images not empty
    const finalImages = imageUrls.length ? [...new Set(imageUrls)] : ["https://via.placeholder.com/400x200?text=No+Image"];

    // debug logs
    console.log(`[scraper] scientificName: "${scientificName}"`);
    console.log(`[scraper] description length: ${description.length}`);
    console.log(`[scraper] extracted characteristics (${finalChars.length}):`, finalChars);

    return {
      scientificName,
      description,
      characteristics: finalChars,
      imageUrls: finalImages
    };
  } catch (err) {
    console.error(`❌ Scraping failed for "${cropName}":`, err.message || err);
    return null;
  }
}

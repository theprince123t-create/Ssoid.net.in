import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Overlay page serve karega
app.use(express.static("public"));

// Example endpoint jo CricHeroes ka data fetch karega
app.get("/score", async (req, res) => {
  try {
    const matchUrl = process.env.MATCH_URL; // .env file me apna CricHeroes URL daalo

    const response = await fetch(matchUrl);
    const body = await response.text();
    const $ = cheerio.load(body);

    // yahan par HTML scrape karke score nikalna hai (CricHeroes ka structure dekh kar customize karna padega)
    let score = $("div.score").text() || "Score not found";

    res.json({ score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// server.js
import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Static files (overlay.html, script.js, CSS, etc.)
app.use(express.static("public"));

// CricHeroes match link (changeable via .env or hardcode)
const MATCH_URL =
  process.env.MATCH_URL ||
  "https://cricheroes.com/scorecard/18741543/amateur-league-t10/mahatma-xi-vs-tunga-sports/live";

// Function to scrape CricHeroes
async function getScore() {
  try {
    const res = await fetch(MATCH_URL);
    const html = await res.text();
    const $ = cheerio.load(html);

    // NOTE: Yeh selectors CricHeroes ki site ke hisaab se adjust karne padenge
    const score = $("div.match-score").first().text().trim();
    const batsmen = [];
    $("div.batsman").each((i, el) => {
      batsmen.push($(el).text().trim());
    });
    const bowler = $("div.bowler").first().text().trim();
    const balls = [];
    $("div.recent-balls span").each((i, el) => {
      balls.push($(el).text().trim());
    });

    return {
      score: score || "0/0 (0.0)",
      batsman1: batsmen[0] || "Batter 1 0(0)",
      batsman2: batsmen[1] || "Batter 2 0(0)",
      bowler: bowler || "Bowler 0-0 (0)",
      balls: balls.length ? balls : [".", ".", ".", ".", ".", "."],
      rr: "—",
      crr: "—",
    };
  } catch (err) {
    console.error("Error scraping CricHeroes:", err.message);
    return {
      score: "N/A",
      batsman1: "Error",
      batsman2: "Error",
      bowler: "Error",
      balls: [],
      rr: "—",
      crr: "—",
    };
  }
}

// API endpoint
app.get("/api/score", async (req, res) => {
  const data = await getScore();
  res.json(data);
});

// Root
app.get("/", (req, res) => {
  res.send("Server running ✅. Visit /overlay.html for overlay.");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

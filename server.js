import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static("public"));

app.get("/api/score", async (req, res) => {
  try {
    const url = process.env.LIVE_URL;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Example selectors (CricHeroes DOM)
    const title = $("h1").first().text().trim();
    const score = $(".match-score").first().text().trim();
    const overs = $(".match-overs").first().text().trim();

    const batsman1 = $(".batsman-name").eq(0).text().trim() + " " + $(".batsman-score").eq(0).text().trim();
    const batsman2 = $(".batsman-name").eq(1).text().trim() + " " + $(".batsman-score").eq(1).text().trim();
    const bowler = $(".bowler-name").first().text().trim() + " " + $(".bowler-score").first().text().trim();

    const recentBalls = [];
    $(".recent-ball").each((i, el) => {
      if (i < 6) recentBalls.push($(el).text().trim());
    });

    res.json({
      title,
      score,
      overs,
      batsman1,
      batsman2,
      bowler,
      balls: recentBalls
    });
  } catch (err) {
    console.error(err);
    res.json({ error: "Failed to fetch live score" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

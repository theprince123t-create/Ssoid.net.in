import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const MATCH_ID = process.env.MATCH_ID || "18741543";

app.use(cors());
app.use(express.static(path.join(process.cwd(), "public")));

async function fetchHTML(id) {
  const url = `https://cricheroes.com/scorecard/${id}/live`;
  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 10000
  });
  return res.data;
}

function parseHTML(html) {
  const $ = cheerio.load(html);
  // Example path selectors may vary – adapt after inspecting HTML structure
  const score = $(".some-score-selector").text().trim();
  const batsManEls = $(".some-batsman-selector");
  const batsman1 = batsManEls.eq(0).text().trim() || "";
  const batsman2 = batsManEls.eq(1).text().trim() || "";
  const rr = $(".some-rr-selector").text().trim();
  const crr = $(".some-crr-selector").text().trim();
  const bowler = $(".some-bowler-selector").text().trim() || "";
  const ballsEl = $(".recent-balls-selector span"); // e.g. lot of spans
  const balls = ballsEl.map((i, el) => $(el).text().trim()).get().slice(-6);
  return { batsman1, batsman2, score, rr, crr, bowler, balls };
}

app.get("/api/score", async (_, res) => {
  try {
    const html = await fetchHTML(MATCH_ID);
    const data = parseHTML(html);
    res.json(data);
  } catch (err) {
    console.error("Fetch & parse error:", err.message);
    res.status(500).json({ error: "Unable to fetch score" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

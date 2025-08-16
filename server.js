import express from "express";
import fetch from "node-fetch"; // ensure yeh dependency install ho
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Static serve overlay.html
app.use(express.static(path.join(__dirname, "public")));

// API to fetch score
app.get("/api/score", async (req, res) => {
  try {
    // yahan tum apna match ka Cricheroes URL doge
    const matchUrl = "https://cricheroes.com/scorecard/18741543/amateur-league-t10/mahatma-xi-vs-tunga-sports/live";

    const response = await fetch(matchUrl);
    const html = await response.text();

    // simple regex scraping (demo ke liye)
    // NOTE: Yeh basic hai, aapko cheerio library use karna better hoga production me
    const scoreMatch = html.match(/"scoreStr":"([^"]+)"/);
    const batterMatch = html.match(/"striker":"([^"]+)"/);
    const bowlerMatch = html.match(/"bowler":"([^"]+)"/);

    res.json({
      score: scoreMatch ? scoreMatch[1] : "0-0 (0.0)",
      batter1: batterMatch ? batterMatch[1] : "Batter 1 0(0)",
      batter2: "Batter 2 0(0)", // demo ke liye
      bowler: bowlerMatch ? bowlerMatch[1] : "Bowler 0-0 (0)",
      rr: "7.00",
      crr: "7.00"
    });
  } catch (err) {
    console.error("Score fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

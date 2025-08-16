const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MATCH_ID = process.env.MATCH_ID || "18717888";

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// API route to fetch CricHeroes live score (dummy example)
app.get("/api/score", async (req, res) => {
  try {
    // यहां CricHeroes से data fetch करना होगा
    // अभी dummy data भेज रहा हूँ
    res.json({
      team1: "DSK Sedwa",
      team2: "Hajar Baba Club",
      score: "45/2",
      overs: "6.3",
      batsman: "Player A - 23(15)",
      bowler: "Player B - 1/10 (2)"
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching score" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

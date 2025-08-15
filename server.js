const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MATCH_ID = process.env.MATCH_ID || '18717888';

app.use(cors());
app.use(express.static('public'));

app.get('/api/score', async (req, res) => {
    try {
        // CricHeroes API URL (example - may require auth/cookie if protected)
        const apiUrl = `https://cricheroes.com/api/v1/match/${MATCH_ID}/scorecard`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        // Example parsed data (replace with actual mapping)
        const data = {
            batsman1: "Player A 15 (10)",
            batsman2: "Player B 8 (6)",
            score: "30-1 (4.2)",
            bowler: "Bowler X 1-12 (2)",
            balls: ["run", "dot", "wicket", "run", "dot", "run"]
        };

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch score" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

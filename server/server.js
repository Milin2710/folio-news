require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const fetchAndStoreRSS = require("./rssToDb");
const app = express();
const port = 4000;

app.use(cors());

const summarizer = require("./gemini");

app.use("/", summarizer);

app.get("/world", async (req, res) => {
  try {
    const articles = await fetchAndStoreRSS(
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "World",
    );
    console.log("Fetched world news articles:", articles[0]);
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch world news" });
  }
});

app.get("/asia", async (req, res) => {
  try {
    const articles = await fetchAndStoreRSS(
      "https://feeds.bbci.co.uk/news/world/asia/rss.xml",
      "Asia",
    );
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Asia RSS failed" });
  }
});

app.get("/health", async (req, res) => {
  try {
    const articles = await fetchAndStoreRSS(
      "https://feeds.bbci.co.uk/news/health/rss.xml",
      "Health",
    );
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Health RSS failed" });
  }
});

app.get("/business", async (req, res) => {
  try {
    const articles = await fetchAndStoreRSS(
      "https://feeds.bbci.co.uk/news/business/rss.xml",
      "Business",
    );
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Business RSS failed" });
  }
});

app.get("/science_and_environment", async (req, res) => {
  try {
    const articles = await fetchAndStoreRSS(
      "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
      "Science",
    );
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Science RSS failed" });
  }
});

app.get("/sport", async (req, res) => {
  try {
    const articles = await fetchAndStoreRSS(
      "https://feeds.bbci.co.uk/sport/rss.xml",
      "Sport",
    );
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sport RSS failed" });
  }
});

app.get("/entertainment", async (req, res) => {
  try {
    const articles = await fetchAndStoreRSS(
      "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
      "Entertainment",
    );
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Entertainment RSS failed" });
  }
});

app.post("/article/:id/like", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "UPDATE articles SET likes = likes + 1 WHERE id = $1 RETURNING likes",
    [id],
  );
  res.json(rows[0]);
});

app.post("/article/:id/unlike", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "UPDATE articles SET likes = GREATEST(likes - 1, 0) WHERE id = $1 RETURNING likes",
    [id],
  );
  res.json(rows[0]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

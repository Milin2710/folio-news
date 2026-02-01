require("dotenv").config();
const { parseStringPromise } = require("xml2js");
const pool = require("./db");

async function fetchAndStoreRSS(rssUrl, category) {
  const response = await fetch(rssUrl);
  const xml = await response.text();

  const result = await parseStringPromise(xml, {
    explicitArray: false,
    ignoreAttrs: false,
  });

  const items = Array.isArray(result.rss.channel.item)
    ? result.rss.channel.item
    : [result.rss.channel.item];

  const insertQuery = `
    INSERT INTO articles (title, description, link, pub_date, thumbnail, category)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (link)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      pub_date = EXCLUDED.pub_date,
      thumbnail = EXCLUDED.thumbnail,
      category = EXCLUDED.category
    RETURNING id, title, link, thumbnail, pub_date, likes, category;
  `;

  const client = await pool.connect();
  const savedArticles = [];

  try {
    // We iterate through items once, using one client connection
    for (const item of items) {
      try {
        const pubDate = item.pubDate ? new Date(item.pubDate) : null;

        const article = {
          title: item.title?._ || item.title || "No Title",
          description:
            item.description?._ || item.description || "No Description",
          link: item.link,
          pubDate: isNaN(pubDate) ? null : pubDate,
          thumbnail: item["media:thumbnail"]?.$?.url || null,
        };

        const { rows } = await client.query(insertQuery, [
          article.title,
          article.description,
          article.link,
          article.pubDate,
          article.thumbnail,
          category,
        ]);

        if (rows[0]) {
          savedArticles.push(rows[0]);
        }
      } catch (itemErr) {
        console.error("Skipping bad RSS item:", itemErr.message);
      }
    }
  } catch (err) {
    console.error("DATABASE CONNECTION ERROR:", err);
    throw err;
  } finally {
    // Release the client back to the pool
    client.release();
  }

  // Now this correctly returns all the articles processed in the loop
  return savedArticles;
}

module.exports = fetchAndStoreRSS;

import { parseStringPromise } from "xml2js";
import { FEEDS } from "../config/feeds.js";
import { upsertArticles } from "../models/article.model.js";

// xml2js gives either a string or an object like { _: "text", $: {...} }
const text = (value) => (typeof value === "object" && value !== null ? value._ : value);

async function fetchFeed({ url, category }) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Feed responded with ${response.status}`);

  const xml = await response.text();
  const parsed = await parseStringPromise(xml, { explicitArray: false });
  const rawItems = parsed.rss.channel.item || [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items
    .filter((item) => item.link)
    .map((item) => {
      const pubDate = item.pubDate ? new Date(item.pubDate) : null;
      return {
        title: text(item.title) || "Untitled",
        description: text(item.description) || "",
        link: item.link.split("?")[0],
        thumbnail: item["media:thumbnail"]?.$?.url || null,
        category,
        pubDate: pubDate && !isNaN(pubDate) ? pubDate : null,
      };
    });
}

// Fetch every feed and store the articles. One bad feed never stops the others.
export async function syncAllFeeds() {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  let saved = 0;

  for (const [index, result] of results.entries()) {
    const { category } = FEEDS[index];
    if (result.status === "fulfilled") {
      saved += await upsertArticles(result.value);
    } else {
      console.error(`[sync] ${category} feed failed:`, result.reason.message);
    }
  }
  return saved;
}

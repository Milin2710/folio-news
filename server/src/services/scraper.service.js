import { env } from "../config/env.js";

// Asks the Python scraper service for an article's text.
// Returns paragraphs separated by blank lines, or null if nothing useful was found.
export async function scrapeArticleText(url) {
  const endpoint = `${env.scraperUrl}/scrape?url=${encodeURIComponent(url)}`;

  const response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Scraper service responded with ${response.status}`);

  const { content } = await response.json();
  return content || null;
}

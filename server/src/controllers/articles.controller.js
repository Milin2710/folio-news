import { CATEGORIES } from "../config/feeds.js";
import * as Articles from "../models/article.model.js";
import { scrapeArticleText } from "../services/scraper.service.js";
import { summarize } from "../services/ai.service.js";
import { badRequest, notFound } from "../utils/httpError.js";

const clamp = (value, fallback, min, max) => {
  const number = Number.parseInt(value, 10);
  return Number.isNaN(number) ? fallback : Math.min(Math.max(number, min), max);
};

// Loads an article or throws a 404. Used by every route that has an :id.
export async function loadArticle(req) {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) throw badRequest("Invalid article id");

  const article = await Articles.getArticle(id, req.userId);
  if (!article) throw notFound("Article not found");
  return article;
}

export function listCategories(_req, res) {
  res.json({ categories: CATEGORIES });
}

export async function list(req, res) {
  const { category, q, sort } = req.query;
  const articles = await Articles.listArticles({
    userId: req.userId,
    category,
    search: q?.trim(),
    sort: sort === "trending" ? "trending" : "latest",
    limit: clamp(req.query.limit, 24, 1, 100),
    offset: clamp(req.query.offset, 0, 0, 10_000),
  });
  res.json({ articles });
}

export async function listBookmarks(req, res) {
  res.json({ articles: await Articles.listBookmarkedArticles(req.userId) });
}

// Returns one article. Full text is scraped the first time it's opened, then cached.
export async function get(req, res) {
  const article = await loadArticle(req);

  if (!article.content) {
    try {
      const content = await scrapeArticleText(article.link);
      if (content) {
        await Articles.saveContent(article.id, content);
        article.content = content;
      }
    } catch (err) {
      console.error(`[scraper] ${article.link}:`, err.message);
    }
  }

  res.json({ article });
}

export async function like(req, res) {
  const article = await loadArticle(req);
  res.json(await Articles.toggleLike(req.userId, article.id));
}

export async function bookmark(req, res) {
  const article = await loadArticle(req);
  res.json(await Articles.toggleBookmark(req.userId, article.id));
}

export async function summary(req, res) {
  const article = await loadArticle(req);
  if (article.summary) return res.json({ summary: article.summary });

  const source = article.content || article.description;
  if (!source) throw badRequest("This article has no text to summarize");

  const text = await summarize(source);
  await Articles.saveSummary(article.id, text);
  res.json({ summary: text });
}

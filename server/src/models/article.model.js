import { query } from "../config/db.js";

// Every article query returns the same shape, plus like/bookmark info for the
// current user ($1 is the user id, or null for visitors).
const baseSelect = (extraColumns = "") => `
  SELECT
    a.id, a.title, a.description, a.link, a.thumbnail, a.category,
    a.pub_date AS "pubDate"${extraColumns},
    (SELECT COUNT(*) FROM likes l WHERE l.article_id = a.id)::int AS "likesCount",
    EXISTS (SELECT 1 FROM likes l WHERE l.article_id = a.id AND l.user_id = $1::int) AS liked,
    EXISTS (SELECT 1 FROM bookmarks b WHERE b.article_id = a.id AND b.user_id = $1::int) AS bookmarked
  FROM articles a`;

export async function listArticles({
  userId = null,
  category,
  search,
  sort = "latest",
  limit = 24,
  offset = 0,
}) {
  const params = [userId];
  const where = [];

  if (category) {
    params.push(category);
    where.push(`LOWER(a.category) = LOWER($${params.length})`);
  }
  if (search) {
    params.push(`%${search}%`);
    where.push(`(a.title ILIKE $${params.length} OR a.description ILIKE $${params.length})`);
  }

  const orderBy =
    sort === "trending"
      ? `"likesCount" DESC, a.pub_date DESC NULLS LAST`
      : `a.pub_date DESC NULLS LAST`;

  params.push(limit, offset);
  const sql = `
    ${baseSelect()}
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${orderBy}
    LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const { rows } = await query(sql, params);
  return rows;
}

export async function listBookmarkedArticles(userId) {
  const sql = `
    ${baseSelect()}
    JOIN bookmarks bm ON bm.article_id = a.id AND bm.user_id = $1::int
    ORDER BY bm.created_at DESC`;
  const { rows } = await query(sql, [userId]);
  return rows;
}

export async function getArticle(id, userId = null) {
  const sql = `${baseSelect(", a.content, a.summary")} WHERE a.id = $2`;
  const { rows } = await query(sql, [userId, id]);
  return rows[0] || null;
}

export async function saveContent(id, content) {
  await query("UPDATE articles SET content = $2 WHERE id = $1", [id, content]);
}

export async function saveSummary(id, summary) {
  await query("UPDATE articles SET summary = $2 WHERE id = $1", [id, summary]);
}

// Insert new articles, refresh existing ones (matched by link).
export async function upsertArticles(articles) {
  for (const a of articles) {
    await query(
      `INSERT INTO articles (title, description, link, thumbnail, category, pub_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (link) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         thumbnail = EXCLUDED.thumbnail,
         category = EXCLUDED.category,
         pub_date = EXCLUDED.pub_date`,
      [a.title, a.description, a.link, a.thumbnail, a.category, a.pubDate],
    );
  }
  return articles.length;
}

export async function countArticles() {
  const { rows } = await query("SELECT COUNT(*)::int AS count FROM articles");
  return rows[0].count;
}

// ---- Likes & bookmarks: one toggle helper for both tables ----

async function toggleRow(table, userId, articleId) {
  const removed = await query(
    `DELETE FROM ${table} WHERE user_id = $1 AND article_id = $2`,
    [userId, articleId],
  );
  if (removed.rowCount > 0) return false;

  await query(
    `INSERT INTO ${table} (user_id, article_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, articleId],
  );
  return true;
}

export async function toggleLike(userId, articleId) {
  const liked = await toggleRow("likes", userId, articleId);
  const { rows } = await query(
    "SELECT COUNT(*)::int AS count FROM likes WHERE article_id = $1",
    [articleId],
  );
  return { liked, likesCount: rows[0].count };
}

export async function toggleBookmark(userId, articleId) {
  const bookmarked = await toggleRow("bookmarks", userId, articleId);
  return { bookmarked };
}

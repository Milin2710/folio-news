import { query } from "../config/db.js";

const FIELDS = `id, text, created_at AS "createdAt"`;

export async function listNotes(userId, articleId) {
  const { rows } = await query(
    `SELECT ${FIELDS} FROM notes
     WHERE user_id = $1 AND article_id = $2
     ORDER BY created_at DESC`,
    [userId, articleId],
  );
  return rows;
}

export async function createNote(userId, articleId, text) {
  const { rows } = await query(
    `INSERT INTO notes (user_id, article_id, text)
     VALUES ($1, $2, $3)
     RETURNING ${FIELDS}`,
    [userId, articleId, text],
  );
  return rows[0];
}

export async function deleteNote(userId, noteId) {
  const { rowCount } = await query(
    "DELETE FROM notes WHERE id = $1 AND user_id = $2",
    [noteId, userId],
  );
  return rowCount > 0;
}

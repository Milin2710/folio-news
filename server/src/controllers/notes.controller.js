import * as Notes from "../models/note.model.js";
import { badRequest, notFound } from "../utils/httpError.js";
import { loadArticle } from "./articles.controller.js";

export async function list(req, res) {
  const article = await loadArticle(req);
  res.json({ notes: await Notes.listNotes(req.userId, article.id) });
}

export async function create(req, res) {
  const article = await loadArticle(req);
  const text = String(req.body.text || "").trim();
  if (!text) throw badRequest("Note cannot be empty");
  if (text.length > 2000) throw badRequest("Note is too long (2000 characters max)");

  res.status(201).json({ note: await Notes.createNote(req.userId, article.id, text) });
}

export async function remove(req, res) {
  const noteId = Number.parseInt(req.params.noteId, 10);
  if (Number.isNaN(noteId)) throw badRequest("Invalid note id");

  const deleted = await Notes.deleteNote(req.userId, noteId);
  if (!deleted) throw notFound("Note not found");
  res.status(204).end();
}

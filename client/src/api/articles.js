import { request } from "./client.js";

export const getCategories = () => request("/articles/categories");

// params: { category, q, sort }
export const getArticles = (params) => request("/articles", { params });

export const getArticle = (id) => request(`/articles/${id}`);
export const getBookmarks = () => request("/articles/bookmarks");

export const toggleLike = (id) => request(`/articles/${id}/like`, { method: "POST" });
export const toggleBookmark = (id) => request(`/articles/${id}/bookmark`, { method: "POST" });
export const getSummary = (id) => request(`/articles/${id}/summary`, { method: "POST" });

export const getNotes = (id) => request(`/articles/${id}/notes`);
export const addNote = (id, text) =>
  request(`/articles/${id}/notes`, { method: "POST", body: { text } });
export const deleteNote = (id, noteId) =>
  request(`/articles/${id}/notes/${noteId}`, { method: "DELETE" });

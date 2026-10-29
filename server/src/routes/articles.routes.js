import { Router } from "express";
import * as articles from "../controllers/articles.controller.js";
import * as notes from "../controllers/notes.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

// Browsing works for everyone (logged-in users also get liked/bookmarked flags)
router.get("/categories", articles.listCategories);
router.get("/", optionalAuth, articles.list);
router.get("/bookmarks", requireAuth, articles.listBookmarks);
router.get("/:id", optionalAuth, articles.get);

// Actions that need an account
router.post("/:id/like", requireAuth, articles.like);
router.post("/:id/bookmark", requireAuth, articles.bookmark);
router.post("/:id/summary", requireAuth, articles.summary);

router.get("/:id/notes", requireAuth, notes.list);
router.post("/:id/notes", requireAuth, notes.create);
router.delete("/:id/notes/:noteId", requireAuth, notes.remove);

export default router;

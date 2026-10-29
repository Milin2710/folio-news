import { Router } from "express";
import articlesRoutes from "./articles.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.use("/auth", authRoutes);
router.use("/articles", articlesRoutes);

export default router;

import app from "./app.js";
import { env } from "./config/env.js";
import { migrate } from "./db/migrate.js";
import { syncAllFeeds } from "./services/rss.service.js";

async function sync() {
  try {
    const count = await syncAllFeeds();
    console.log(`[sync] ${count} articles up to date`);
  } catch (err) {
    console.error("[sync] failed:", err.message);
  }
}

async function start() {
  await migrate();

  app.listen(env.port, () => {
    console.log(`API running at http://localhost:${env.port}/api`);
  });

  // Fetch news now, then keep it fresh in the background.
  sync();
  setInterval(sync, env.syncIntervalMinutes * 60 * 1000);
}

start().catch((err) => {
  console.error("Could not start server:", err.message);
  process.exit(1);
});

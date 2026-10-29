// Manual one-off feed refresh: `npm run sync`
import { pool } from "../src/config/db.js";
import { migrate } from "../src/db/migrate.js";
import { syncAllFeeds } from "../src/services/rss.service.js";

try {
  await migrate();
  const count = await syncAllFeeds();
  console.log(`Synced ${count} articles.`);
} catch (err) {
  console.error("Sync failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

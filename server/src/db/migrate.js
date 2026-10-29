import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "../config/db.js";

export async function migrate() {
  const schemaPath = fileURLToPath(new URL("./schema.sql", import.meta.url));
  const sql = await readFile(schemaPath, "utf8");
  await pool.query(sql);
}

// Allow running directly: `npm run migrate`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate()
    .then(() => console.log("Database schema is up to date."))
    .catch((err) => {
      console.error("Migration failed:", err.message);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}

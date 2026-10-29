import "dotenv/config";

for (const key of ["DATABASE_URL", "JWT_SECRET"]) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key} (see server/.env.example)`);
    process.exit(1);
  }
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: process.env.DATABASE_SSL === "true",
  jwtSecret: process.env.JWT_SECRET,
  scraperUrl: process.env.SCRAPER_URL || "http://localhost:8000",
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
  syncIntervalMinutes: Number(process.env.SYNC_INTERVAL_MINUTES) || 30,
};

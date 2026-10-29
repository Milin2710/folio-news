import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Returns a short plain-text summary: one bullet per line, each starting with "- ".
// Plain text (not HTML) so the client can render it safely.
export async function summarize(text) {
  if (!env.groqApiKey) {
    throw new HttpError(503, "AI summaries are not configured on this server");
  }

  const prompt =
    "Summarize the following news article in 3 to 5 short bullet points. " +
    'Write plain text only. Start every bullet with "- " and put each on its own line.\n\n' +
    text.slice(0, 12_000);

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.groqApiKey}`,
    },
    body: JSON.stringify({
      model: env.groqModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    console.error("[ai] Groq error:", response.status, await response.text());
    throw new HttpError(502, "Could not generate a summary right now");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text in body" });
    }

    const prompt =
      `You are an assistant that reads markdown content and summarizes it in well-structured HTML for display in a web application.\n\n` +
      `- The summary should be concise and capture the main points.\n` +
      `- Use proper HTML tags like <h2>, <p>, <ul>, <li>, <strong>, etc.\n` +
      `- Avoid wrapping the whole output in a <div>.\n` +
      `- DO NOT use <pre> or <code> tags.\n` +
      `- DO NOT return markdown — only clean, valid HTML.\n\n` +
      `Summarize the following markdown content:\n\n${text}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await axios.post(
      process.env.GROQ_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      },
    );

    const summary = response.data.choices[0].message.content;

    res.json({ summary });
  } catch (error) {
    console.error("Summarization Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to summarize content" });
  }
});

module.exports = app;

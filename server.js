import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());

// Allow GitHub Pages to call this server
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.static("."));

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message || "").trim();

  if (!message) {
    return res.status(400).json({ error: "বার্তা লিখুন।" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY পাওয়া যাচ্ছে না।"
    });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: message
    });

    res.json({
      answer: response.output_text
    });

  } catch (error) {
    console.error("OpenAI error:", error);

    res.status(500).json({
      error: "AI-এর সাথে যোগাযোগ করা যাচ্ছে না।"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Alamin AI running on port ${PORT}`);
});

import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());
app.use(express.static("."));

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message || "").trim();

  if (!message) {
    return res.status(400).json({ error: "বার্তা লিখুন।" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      answer: "Alamin AI চালু আছে। API key যোগ করলে আসল AI উত্তর চালু হবে।"
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

    res.json({ answer: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI-এর সাথে যোগাযোগ করা যাচ্ছে না।"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Alamin AI running on port ${PORT}`);
});

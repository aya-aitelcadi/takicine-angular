import express from "express";
import cors from "cors";
import "dotenv/config";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.HF_API_KEY) {
  console.error("❌ HF_API_KEY manquante dans server/.env");
}

async function hfGenerate(prompt) {

  const r = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.7
    })
  });

  const data = await r.json();

  if (!r.ok) {
    throw new Error(data?.error?.message || "HF_ERROR");
  }

  return data.choices[0].message.content;
}

// 1) Endpoint IA texte
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "MISSING_PROMPT" });

    const text = await hfGenerate(prompt);
    res.json({ text });
  } catch (error) {
    console.error("❌ /api/ai error:", error);
    res.status(500).json({ error: error?.message || "AI_ERROR" });
  }
});

// 2) Endpoint recherche IA (ids)
app.post("/api/ai-search", async (req, res) => {
  try {
    const { query, catalog } = req.body;
    if (!query || !catalog) return res.status(400).json({ error: "MISSING_DATA" });

    const prompt = `
Tu aides à rechercher dans un catalogue de films.
Tu DOIS proposer uniquement des films du catalogue ci-dessous.
Répond STRICTEMENT en JSON, sans texte autour, format:
{"ids":[...]}
Règles:
- max 12 ids
- ids uniques
- triés du plus pertinent au moins pertinent

Requête utilisateur: "${query}"

Catalogue (films):
${JSON.stringify(catalog)}
`;

    const text = await hfGenerate(prompt);

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    const jsonStr = start !== -1 && end !== -1 ? text.slice(start, end + 1) : "{}";

    let parsed;
    try { parsed = JSON.parse(jsonStr); } catch { parsed = { ids: [] }; }

    res.json({ ids: parsed.ids || [] });
  } catch (error) {
    console.error("❌ /api/ai-search error:", error);
    res.status(500).json({ error: error?.message || "AI_ERROR" });
  }
});

app.listen(3000, () => {
  console.log("✅ AI server running on http://localhost:3000");
});
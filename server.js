import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイル配信 (public フォルダ)
app.use(express.static("public"));

// 🔍 検索API
app.get("/api/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "q required" });

  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&pbj=1`;
    const r = await fetch(url, {
      headers: {
        "x-youtube-client-name": "1",
        "x-youtube-client-version": "2.20230822.00.00"
      }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "search failed" });
  }
});

// 💬 コメントAPI (Invidious経由)
app.get("/api/comments/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const url = `https://inv.nadeko.net/api/v1/comments/${id}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "comments failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

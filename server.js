const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // ← サーバーから YouTube にアクセス
const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイル配信
app.use(express.static(path.join(__dirname, "public")));

// 🔍 YouTube 検索API (サーバープロキシ)
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "検索ワードが必要です" });

  try {
    const ytRes = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&pbj=1`,
      {
        headers: {
          "x-youtube-client-name": "1",
          "x-youtube-client-version": "2.20230822.00.00"
        }
      }
    );

    if (!ytRes.ok) throw new Error("YouTube 取得失敗");
    const data = await ytRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "検索失敗" });
  }
});

// ルート
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

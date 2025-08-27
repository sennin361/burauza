const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// 静的ファイル配信 (public 以下の HTML/JS/CSS)
// =======================
app.use(express.static(path.join(__dirname, "public")));

// =======================
// 🔍 YouTube 検索 API (非公式)
// =======================
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

    if (!ytRes.ok) throw new Error("YouTube検索失敗");
    const data = await ytRes.json();
    res.json(data);
  } catch (err) {
    console.error("検索エラー:", err);
    res.status(500).json({ error: "検索に失敗しました" });
  }
});

// =======================
// ▶️ 動画情報 (oEmbed API使用)
// =======================
app.get("/api/video/:id", async (req, res) => {
  const videoId = req.params.id;
  try {
    const ytRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!ytRes.ok) throw new Error("動画情報取得失敗");
    const data = await ytRes.json();
    res.json(data);
  } catch (err) {
    console.error("動画情報エラー:", err);
    res.status(500).json({ error: "動画情報取得失敗" });
  }
});

// =======================
// 💬 コメント (Invidious API使用)
// =======================
app.get("/api/comments/:id", async (req, res) => {
  const videoId = req.params.id;
  try {
    const invRes = await fetch(`https://inv.nadeko.net/api/v1/comments/${videoId}`);
    if (!invRes.ok) throw new Error("コメント取得失敗");
    const data = await invRes.json();
    res.json(data);
  } catch (err) {
    console.error("コメントエラー:", err);
    res.status(500).json({ error: "コメント取得失敗" });
  }
});

// =======================
// 📺 チャンネル情報 (Invidious API使用)
// =======================
app.get("/api/channel/:id", async (req, res) => {
  const channelId = req.params.id;
  try {
    const invRes = await fetch(`https://inv.nadeko.net/api/v1/channels/${channelId}`);
    if (!invRes.ok) throw new Error("チャンネル取得失敗");
    const data = await invRes.json();
    res.json(data);
  } catch (err) {
    console.error("チャンネルエラー:", err);
    res.status(500).json({ error: "チャンネル情報取得失敗" });
  }
});

// =======================
// ルート (index.htmlを返す)
// =======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =======================
// サーバー起動
// =======================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

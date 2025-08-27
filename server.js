const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// 静的ファイル配信(publicフォルダ)
app.use(express.static(path.join(__dirname, "public")));

// =======================
// 🔍 非公式API YouTube検索
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
// ▶️ 動画情報(oEmbed)
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
// 💬 コメント(Invidious)
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
// 📺 チャンネル情報(Invidious)
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
// ルート
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =======================
// サーバ起動
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

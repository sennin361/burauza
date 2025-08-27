const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// publicフォルダを静的公開
app.use(express.static(path.join(__dirname, "public")));

// ルートは index.html を返す
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

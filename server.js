const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/proxy', async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).send('URLパラメータが必要です');
    }
    if (!/^https?:\/\//i.test(targetUrl)) {
      return res.status(400).send('URLが不正です');
    }
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'SenninBrowserProxy/1.0' },
    });
    const contentType = response.headers['content-type'] || 'text/html';
    res.set('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    console.error('プロキシエラー:', error.message);
    res.status(500).send('プロキシエラー: ' + error.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

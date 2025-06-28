const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const searchBtn = document.getElementById('searchBtn');
const urlInput = document.getElementById('urlInput');
const engineSelect = document.getElementById('engineSelect');
const toggleSidebar = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const webview = document.getElementById('webview');

let historyArr = JSON.parse(localStorage.getItem('senninHistory') || '[]');
let historyIndex = parseInt(localStorage.getItem('senninHistoryIndex'), 10);
if (isNaN(historyIndex)) historyIndex = -1;

function saveHistory() {
  localStorage.setItem('senninHistory', JSON.stringify(historyArr));
  localStorage.setItem('senninHistoryIndex', historyIndex);
}

function updateHistoryList() {
  historyList.innerHTML = '';
  historyArr.forEach((url, idx) => {
    const li = document.createElement('li');
    li.textContent = url;
    li.classList.toggle('active', idx === historyIndex);
    li.onclick = () => loadURL(url, false, idx);
    historyList.appendChild(li);
  });
  saveHistory();
}

function proxyURL(url) {
  return '/proxy?url=' + encodeURIComponent(url);
}

function loadURL(url, push = true, jumpIndex = -1) {
  if (push) {
    // 進んでいた先があれば履歴を切る
    historyArr = historyArr.slice(0, historyIndex + 1);
    historyArr.push(url);
    historyIndex = historyArr.length - 1;
  } else if (jumpIndex >= 0) {
    historyIndex = jumpIndex;
  }
  updateHistoryList();
  webview.src = proxyURL(url);
  urlInput.value = url;
}

searchBtn.onclick = () => {
  let query = urlInput.value.trim();
  if (!query) return;
  const prefix = engineSelect.value;
  const url = query.startsWith('http') ? query : prefix + encodeURIComponent(query);
  loadURL(url);
};

backBtn.onclick = () => {
  if (historyIndex > 0) {
    historyIndex--;
    loadURL(historyArr[historyIndex], false);
  }
};

forwardBtn.onclick = () => {
  if (historyIndex < historyArr.length - 1) {
    historyIndex++;
    loadURL(historyArr[historyIndex], false);
  }
};

toggleSidebar.onclick = () => {
  sidebar.classList.toggle('hidden');
};

clearHistoryBtn.onclick = () => {
  historyArr = [];
  historyIndex = -1;
  updateHistoryList();
  webview.src = 'about:blank';
  urlInput.value = '';
};

// ページ読み込み時に最後の履歴を読み込む
window.addEventListener('DOMContentLoaded', () => {
  if (historyIndex >= 0 && historyArr.length > 0) {
    loadURL(historyArr[historyIndex], false);
  }
  updateHistoryList();
});

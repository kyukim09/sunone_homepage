const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  // CORS 허용 (로컬 개발용)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // POST 공통 바디 수집 함수
  function collectBody(req, cb) {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => cb(Buffer.concat(chunks).toString('utf8')));
    req.on('error', err => cb(null, err));
  }

  // POST /api/save-products — products.json 저장
  if (req.method === 'POST' && req.url === '/api/save-products') {
    collectBody(req, (body, err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: '요청 오류: ' + err.message }));
        return;
      }
      try {
        const data = JSON.parse(body);
        const filePath = path.join(ROOT, 'products.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        console.log('[저장]', new Date().toLocaleTimeString(), '→ products.json');
      } catch (e) {
        console.error('[오류] products 저장 실패:', e.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: e.message }));
      }
    });
    return;
  }

  // POST /api/save — company.json 저장
  if (req.method === 'POST' && req.url === '/api/save') {
    collectBody(req, (body, err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: '요청 오류: ' + err.message }));
        return;
      }
      try {
        const data = JSON.parse(body);
        const filePath = path.join(ROOT, 'company.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, message: 'company.json 저장 완료' }));
        console.log('[저장]', new Date().toLocaleTimeString(), '→ company.json');
      } catch (e) {
        console.error('[오류] company 저장 실패:', e.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: e.message }));
      }
    });
    return;
  }

  // GET — 정적 파일 서빙
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  SUNONE 로컬 서버 실행 중`);
  console.log(`  홈페이지  →  http://localhost:${PORT}`);
  console.log(`  관리자    →  http://localhost:${PORT}/admin.html`);
  console.log(`  상품관리  →  http://localhost:${PORT}/product_admin.html`);
  console.log(`\n  Ctrl+C 로 종료\n`);
});

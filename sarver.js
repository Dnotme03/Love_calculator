const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'tor.html' : req.url);
  const ext = path.extname(filePath);
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server });
let clients = [];

wss.on('connection', ws => {
  clients.push(ws);

  ws.on('message', message => {
    let data = {};
    try { data = JSON.parse(message); } catch {}

    if (data.type === "join") {
      broadcast(JSON.stringify({ type: "join", name: data.name, color: data.color }));
    } else if (data.type === "msg") {
      broadcast(JSON.stringify({ type: "msg", text: data.text, color: data.color }));
    }
  });

  ws.on('close', () => { clients = clients.filter(c => c !== ws); });
});

function broadcast(msg) {
  clients.forEach(c => { if (c.readyState === WebSocket.OPEN) c.send(msg); });
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

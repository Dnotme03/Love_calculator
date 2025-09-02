const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', ws => {
  clients.push(ws);

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'join') {
        // Broadcast join
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'join', name: data.name, color: data.color }));
          }
        });
      }

      if (data.type === 'msg') {
        // Broadcast message
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'msg', text: data.text, color: data.color }));
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

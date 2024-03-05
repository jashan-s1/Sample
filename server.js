const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // Serve your HTML files
    if (req.url === '/student.html') {
        fs.readFile('student.html', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else if (req.url === '/warden.html') {
        fs.readFile('warden.html', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
});

const wss = new WebSocket.Server({ server });

const requests = [];

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Parse the JSON message
        const requestInfo = JSON.parse(message);
        // Store the request
        requests.push(requestInfo);
        // Broadcast the updated list to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(requests));
            }
        });
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

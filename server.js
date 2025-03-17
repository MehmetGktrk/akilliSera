const WebSocket = require('ws');
const http = require('http');

// HTTP sunucu oluşturuluyor
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket sunucu çalışıyor');
});

// WebSocket server'ı HTTP sunucusuyla bağla
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
    console.log('Yeni cihaz bağlandı');
    
    clients.push(ws);

    ws.on('message', (message) => {
        const decodedMessage = message.toString('utf8');
        console.log('Mesaj alındı: ', decodedMessage);

        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(decodedMessage);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Cihaz bağlantıyı kapattı');
    });
});

// Sunucu Heroku'nun portunu dinleyecek
server.listen(process.env.PORT || 8080, () => {
    console.log(`WebSocket sunucu çalışıyor... Port: ${process.env.PORT || 8080}`);
});

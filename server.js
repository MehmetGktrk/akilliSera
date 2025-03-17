const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT, maxConnections: 50 });

let clients = [];

wss.on('connection', (ws) => {
    console.log('Yeni cihaz bağlandı');
    
    clients.push(ws);

    ws.on('message', (message) => {
        const decodedMessage = message.toString('utf8');
        console.log('Mesaj alındı: ', decodedMessage);

        // Tüm bağlı client'lara mesaj gönder
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(decodedMessage);
            }
        });
    });

    ws.on('close', () => {
        // Bağlantıyı kapatan client'ı listeden çıkar
        clients = clients.filter(client => client !== ws);
        console.log('Cihaz bağlantıyı kapattı');
    });
});

console.log(`WebSocket sunucu çalışıyor... Port: ${process.env.PORT}`);

const WebServer = require("ws")

const wss = new WebServer.Server({
    port: 5555
})

wss.on('connection', (ws) => {
    ws.on('message', (data, isBinary) => {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebServer.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    })
})


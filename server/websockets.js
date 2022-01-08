const ws = require('ws')

const wss = new ws.Server({
    port: 5000
    },
    () => console.log('WS Server started on 5000 port'))

wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'message':
                broadCastMessage(message)
                break
            case 'connection':
                broadCastMessage(message)
                break
        }
    })
})

function broadCastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}
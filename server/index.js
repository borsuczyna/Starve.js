const http = require('http'),
    ws = require('ws');

const { sendSocketPacket } = require('./utils');

const GameServer = require('./GameServer'),
    Player = require('./entities/player');

const { HandshakePacket, HandshakeResponsePacket } = require('./packets/json/handshake');

const server = http.createServer((_, res) => {
    res.writeHead(404);
    res.end();
});

server.listen(6969);

const wss = new ws.Server({ server });

wss.on("listening", () => {
    const gameServer = new GameServer();
    
    wss.on("connection", (socket, request) => {
        const isNodeJS = request.headers["user-agent"] === "" || request.headers["origin"] === "";

        if (isNodeJS) {
            socket.close();

            return;
        }

        let player = gameServer.findPlayerBySocket(socket);

        socket.on("message", message => {
            message = message.toString();
            
            switch (typeof message) {
                case "string": {
                    try {
                        const json = JSON.parse(message);

                        switch (typeof json[0]) {
                            case "string": {
                                if (!player) {
                                    const handshake = HandshakePacket.fromJSON(json);
                                    const id = gameServer.getFreeId();

                                    player = new Player(gameServer, handshake, socket);
                                    player.setId(id);

                                    gameServer.players.push(player);

                                    sendSocketPacket(player.socket, new HandshakeResponsePacket(player, gameServer.players));

                                    console.log(`Player ${player.nickname} connected (id: ${player.id})`);
                                }
                                break;
                            }
                            case "number": {
                                const [type, ...data] = json;
                                
                                switch (type) {
                                    case 0: {
                                        player.setPosition(json[1]);
                                        player.setAngle(json[2]);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    } catch (e) {
                        console.log("MESSAGE FAULT", e);
                    }
                    break;
                }
            }
        });

        socket.on("close", () => {
            if (player) {
                for (let index = 0; index < gameServer.players.length; index++) {
                    const p = gameServer.players[index];

                    if (p && p.id === player.id) {
                        gameServer.setFreeId(player.id);
                        gameServer.players.splice(index, 1);
                        break;
                    }
                }

                console.log(`Player ${player.nickname} disconnected (id: ${player.id})`);
            }
        });
    });

    console.log("Server started", server.address().port);
});
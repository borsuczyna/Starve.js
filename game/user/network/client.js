const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

class NetworkClient extends WebSocket {
    constructor() {
        const url = protocol + "//localhost:6969";
        super(url);

        this.binaryType = "arraybuffer";
        this.onopen = this.open.bind(this);
        this.onmessage = this.message.bind(this);
        this.onclose = this.close.bind(this);
    }

    open() {
        console.log("NETWORKING CONNECTION OPEN");

        this.send(JSON.stringify(["hello"]));
    }

    message(message) {
        message = message.data;

        switch (typeof message) {
            case "string": {
                try {
                    const json = JSON.parse(message);
                    const [packetId, ...packetData] = json;

                    switch (packetId) {
                        case 0: { /// handshake
                            const [pid, players] = packetData;

                            for (const player of players) {
                                const {n: nickname, i: id} = player;

                                const p = new Player();
                                console.log(p);

                                p.setId(id);
                                p.setNickname(nickname);

                                if (pid === id) {
                                    localPlayer = p;
                                    localPlayer.id = pid;
                                }

                                world.entities.push(p);
                            }
                            break;
                        }
                        case 1: {
                            
                            for (let data of packetData[0]) {
                                const player = world.entities.find(e => e.id === data.id);
                                if(!player) continue;
                                if(player === localPlayer) continue;

                                player.angleDifference =  shortAngleDist(player.angle, data.angle)/40;
                                player.positionDifference = {
                                    x: (data.position.x - player.position.x)/40,
                                    y: (data.position.y - player.position.y)/40
                                };
                            }
                            break;
                        }
                    }
                } catch (e) {
                    console.log("NETWORKING DECOMPRESS FAIL", e);
                }
                break;
            }
        }
    }

    close() {
        console.log("NETWORKING CONNECTION CLOSE");
    }
}
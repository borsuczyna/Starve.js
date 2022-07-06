const UpdatePacket = require("./packets/bin/update");

const { sendSocketPacket } = require("./utils");

class GameServer {
    constructor() {
        this.ticks = 32;
        this.delta = 1000 / 32;
        this.maxPlayers = 999;

        this.freeIds = new Array(this.maxPlayers);
        for (let index = 0; index < this.maxPlayers; index++) this.freeIds[index] = index + 1;

        this.players = [];
        this.entities = [];

        setInterval(() => this.render(),                    1000 / 16);
        setInterval(() => this.update(),                    this.delta);
    }

    getFreeId() {
        if (this.freeIds.length === 0) {
            return null;
        }
        else {
            const freeId = this.freeIds[0];
            this.freeIds.splice(0, 1);

            return freeId;
        }
    }

    setFreeId(id) {
        if (typeof id !== "number") return;
        if (id < 0) return;

        this.freeIds.splice(0, 0, id);
    }

    findPlayerBySocket(socket) {
        return this.players.find(player => player && player.socket === socket);
    }

    update() {
        if (this.players.length > 0) {
            for (const player of this.players) {
                player.update(this.delta);
            }
        }

        if (this.entities.length > 0) {
            for (const entity of this.entities) {
                entity.update(this.delta);
            }
        }
    }

    render() {
        for (const player of this.players) {
            sendSocketPacket(player.socket, new UpdatePacket(...this.players));
        }
    }
}

module.exports = GameServer;
const Packet = require("../../packet");

class HandshakePacket extends Packet {
    static fromJSON(json) {
        return new HandshakePacket(json[0]);
    }

    constructor(nickname) {
        super([nickname]);

        this.nickname = nickname;
    }

    build() {
        return [this.nickname];
    }
}

class HandshakeResponsePacket extends Packet {
    static fromJSON(json) {
        throw null;
    }

    constructor(player, players) {
        super([player, players]);

        this.player = player;
        this.players = players;
    }

    build() {
        const players = [];

        for (let index = 0; index < this.players.length; index++) {
            const player = this.players[index];

            if (player) {
                players.push(player.toJSON());
            }
        }

        return [
            0,
            this.player.id,
            players,
        ];
    }
}

module.exports = {
    HandshakePacket,
    HandshakeResponsePacket
};
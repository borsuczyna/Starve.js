const Entity = require('../entity');

const { ENTITIES } = require('../../shared/constants');

class Player extends Entity {
    constructor(gameServer, handshake, socket) {
        super(gameServer, ENTITIES.PLAYER);

        this.socket = socket;
        this.nickname = handshake.nickname;

        this.attacking = false;
        this.speed = 0.25;
    }

    setPosition(position) {
        this.position = position;
    }

    toJSON() {
        return {
            n: this.nickname,
            i: this.id
        };
    }
}

module.exports = Player;
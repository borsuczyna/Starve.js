const Packet = require("../../packet");

class UpdatePacket extends Packet {
    static fromJSON(json) {

    }

    constructor(...entities) {
        super(entities);

        this.entities = entities;
    }

    build() {
        const tmp = [];

        for (const entity of this.entities) {
            const { id, type, angle, position, speed } = entity;

            tmp.push({
                id,
                type,
                position,
                angle,
                speed
            });
        }

        return [1, tmp];
    }
}

module.exports = UpdatePacket;
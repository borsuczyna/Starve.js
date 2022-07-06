// Packet model
class Packet {
    constructor(data) {
        this.data = data;
    }

    build() {
        return this.data;
    }
}

module.exports = Packet;
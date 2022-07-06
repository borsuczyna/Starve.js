function sendSocketPacket(socket, packet) {
    if ("fromJSON" in packet.constructor) {
        // console.log("Sending packet: " + packet.constructor.name);
        socket.send(JSON.stringify(packet.build()));
    } else {
        // console.log("Sending binary packet: " + packet.constructor.name);
        socket.send(packet.build().buffer);
    }
}

module.exports = {
    sendSocketPacket,
}
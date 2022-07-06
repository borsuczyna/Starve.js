class Player extends Entity {
    constructor() {
        super();

        this.nickname = null;
    }

    setNickname(nickname) {
        this.nickname = nickname;
    }
    
    render() {
        let pos = getScreenFromWorldPosition(this.position.x, this.position.y);
        let size = getScreenFromWorldPosition(this.position.x + 50, this.position.y + 50);
        size = {x: size.x - pos.x, y: size.y - pos.y};

        drawImage(pos.x - size.x/2, pos.y - size.y/2, size.x, size.y, "game/assets/graphics/entities/player/head.png", {r: 255, g: 255, b: 255}, this.angle);
    }

    update() {
        this.angle += this.angleDifference;
        this.position.x += this.positionDifference.x;
        this.position.y += this.positionDifference.y;
    }
}

var localPlayer = null;

addEvent('onEntitiesDraw', ctx => {
    for (const entity of world.entities) {
        if (entity.type === 0) {
            entity.render();
        }
    }
});

setInterval(() => {
    for(const entity of world.entities) {
        if(entity.type === 0 && entity !== localPlayer) {
            entity.update();
        }
    }
}, 100/40);

addEvent('onGameUpdate', (delta) => {
    if(localPlayer) {
        if(mobile) {
            if(mobileControls.rightPad.holding) {
                let angle = Math.atan2(mobileControls.rightPad.y, mobileControls.rightPad.x);
                localPlayer.angle = angle + Math.PI/2;
            }
        } else {
            let world = getWorldFromScreenPosition(cursor.x, cursor.y);
            let pos = localPlayer.position;
            let angle = Math.atan2(world.y - pos.y, world.x - pos.x);
            localPlayer.angle = angle - Math.PI/2;
        }

        let movement = {x: 0, y: 0};
        if(isKeyDown("w")) movement.y -= delta * 0.1;
        if(isKeyDown("a")) movement.x -= delta * 0.1;
        if(isKeyDown("s")) movement.y += delta * 0.1;
        if(isKeyDown("d")) movement.x += delta * 0.1;

        movement.x += mobileControls.leftPad.x * delta * 0.1;
        movement.y -= mobileControls.leftPad.y * delta * 0.1;

        let dist = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
        if(dist > 1) {
            let normalized = normalizevector2d(movement.x, movement.y);
            localPlayer.position.x += normalized.x * delta * 0.1;
            localPlayer.position.y += normalized.y * delta * 0.1;
        } else {
            localPlayer.position.x += movement.x * delta * 0.1;
            localPlayer.position.y += movement.y * delta * 0.1;
        }
    }
})

setInterval(() => {
    networking.send(JSON.stringify([0, localPlayer.position, localPlayer.angle]));
}, 100);
const world = {
    camera: {
        x: 0,
        y: 0,
        zoom: 3
    },
    entities: [],
    x: 0,
    y: 0,
    w: 500,
    h: 400
};

function getScreenFromWorldPosition(x, y) {
    var x = player.width / 2 + ((x - world.x) - world.camera.x)*world.camera.zoom;
    var y = player.height / 2 + ((y - world.y) - world.camera.y)*world.camera.zoom;

    return {
        x: x,
        y: y
    };
}

function getWorldFromScreenPosition(x, y) {
    var x = world.x + (x - player.width / 2) / world.camera.zoom + world.camera.x;
    var y = world.y + (y - player.height / 2) / world.camera.zoom + world.camera.y;

    return {
        x: x,
        y: y
    };
}

addEvent('onGameUpdate', (delta) => {
    /*let movement = {x: 0, y: 0};
    if(isKeyDown("w")) movement.y -= delta * 0.1;
    if(isKeyDown("a")) movement.x -= delta * 0.1;
    if(isKeyDown("s")) movement.y += delta * 0.1;
    if(isKeyDown("d")) movement.x += delta * 0.1;

    movement.x += mobileControls.leftPad.x * delta * 0.1;
    movement.y -= mobileControls.leftPad.y * delta * 0.1;

    let dist = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
    if(dist > 1) {
        let normalized = normalizevector2d(movement.x, movement.y);
        world.camera.x += normalized.x * delta * 0.1;
        world.camera.y += normalized.y * delta * 0.1;
    } else {
        world.camera.x += movement.x * delta * 0.1;
        world.camera.y += movement.y * delta * 0.1;
    }*/

    var leftTop = getWorldFromScreenPosition(0, 0);
    var rightBottom = getWorldFromScreenPosition(player.width, player.height);

    if(!(leftTop.x < -world.w/2 && rightBottom.x > world.w/2)) {
        if(leftTop.x < -world.w/2) world.camera.x -= leftTop.x + world.w/2;
        if(rightBottom.x > world.w/2) world.camera.x -= rightBottom.x - world.w/2;
    } else world.camera.x = 0;

    if(!(leftTop.y < -world.h/2 && rightBottom.y > world.h/2)) {
        if(leftTop.y < -world.h/2) world.camera.y -= leftTop.y + world.h/2;
        if(rightBottom.y > world.h/2) world.camera.y -= rightBottom.y - world.h/2;
    } else world.camera.y = 0;
});

addEvent('onMouseWheel', (delta) => {
    world.camera.zoom += delta/10;
    if(world.camera.zoom < 0.1) world.camera.zoom = 0.1;
});

addEvent('onGameDraw', (ctx) => {
    drawRectangle(0, 0, player.width, player.height, {r: 21, g: 45, b: 36});

    var pos = getScreenFromWorldPosition(0, 0);
    drawRectangle(pos.x - 5, pos.y - 5, 10, 10, {r: 255, g: 0, b: 0});
    // draw borders of world world.w, world.h
    var pos = getScreenFromWorldPosition(world.w/2, 0);
    drawRectangle(pos.x - 2, pos.y - 5000, 10000, 10000, {r: 23, g: 51, b: 40});
    var pos = getScreenFromWorldPosition(-world.w/2, 0);
    drawRectangle(pos.x + 2, pos.y - 5000, -5000, 10000, {r: 23, g: 51, b: 40});
    var pos = getScreenFromWorldPosition(0, world.h/2);
    drawRectangle(pos.x - 5000, pos.y - 2, 10000, 5000, {r: 23, g: 51, b: 40});
    var pos = getScreenFromWorldPosition(0, -world.h/2);
    drawRectangle(pos.x - 5000, pos.y + 2, 10000, -5000, {r: 23, g: 51, b: 40});

    var pos = getScreenFromWorldPosition(0, 0);
    var size = getScreenFromWorldPosition(50, 50);
    size = {x: size.x - pos.x, y: size.y - pos.y};

    triggerEvent('onEntitiesDraw', ctx);
    draw3DImages();
}, 0);
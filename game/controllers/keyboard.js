const keyCodes = {
    left: 37,
    right: 39,
    up: 38,
    down: 40,
    w: 87,
    a: 65,
    s: 83,
    d: 68,
};

var keys = [];

function keyDown(e) {
    if (!keys[e.keyCode]) keys[e.keyCode] = true;
}

function keyUp(e) {
    if (keys[e.keyCode]) keys[e.keyCode] = false;
}

function isKeyDown(keyCode) {
    if(typeof keyCode == 'number') return keys[keyCode];
    
    return keys[keyCodes[keyCode]];
}

function keyMouseWheel(e) {
    triggerEvent('onMouseWheel', e.wheelDelta/120);
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('wheel', keyMouseWheel);
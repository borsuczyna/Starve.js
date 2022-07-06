var player = null;
var fps = 1000;
var fpsVisual = {current: 0, last: 60};
var cursor = {x: 0, y: 0};
var lastUpdate = getTickCount();
var touches = [
    false,
    false
];

var networking;

function resize() {
    if (player.width !== window.innerWidth) player.width = window.innerWidth;
    if (player.height !== window.innerHeight) player.height = window.innerHeight
}

let consoletext = "";

function gameUpdate() {
    let ctx = player.getContext("2d");
    ctx.clearRect(0, 0, player.width, player.height);

    let delta = getTickCount() - lastUpdate;
    lastUpdate = getTickCount();

    triggerEvent("onGameDraw", ctx);
    draw3DImages();
    triggerEvent("onGameUpdate", delta);
    draw3DImages();

    drawText("FPS: " + fpsVisual.last + "\n\nKonsola:\n" + consoletext, 10, 10, {r: 255, g: 255, b: 255, a: 255});
    
    setTimeout(gameUpdate, 1000 / fps);
    updateCache();
    fpsVisual.current++;
}

function resetFPS() {
    fpsVisual.last = fpsVisual.current;
    fpsVisual.current = 0;
}

window.onload = function() {
    player = document.getElementById('player');

    player.onmousemove = function(event) {
        cursor = {x: event.offsetX, y: event.offsetY};
    }

    player.ontouchmove = function(event) {
        /*var x = player.offsetLeft - player.offsetWidth / 2;
        var y = player.offsetTop - player.offsetHeight / 2;
        
        if(event.touches[0]) {
            var touch = event.touches[0];
            touches[0].x = touch.pageX - x;
            touches[0].y = touch.pageY - y;
        }

        if(event.touches[1]) {
            touch = event.touches[1];
            touches[1].x = touch.pageX - x;
            touches[1].y = touch.pageY - y;
        }*/

        touches[0] = {x: event.touches[0].pageX, y: event.touches[0].pageY};
        if(event.touches.length > 1) {
            touches[1] = {x: event.touches[1].pageX, y: event.touches[1].pageY};
        }
    }

    player.ontouchend = function(event) {
        // for (let index = 0; index < event.changedTouches.length; index++) {
        //     const touch = event.changedTouches[index];

        //     if (touch) {
        //         touches[index] = false;
        //     }
        // }

        if(!event.targetTouches[0]) {
            touches[0] = false;
            consoletext += "0\n";
        }
        if(!event.changedTouches[1]) {
            touches[1] = false;
            consoletext += "1\n";
        }
    }

    networking = new NetworkClient();

    resize();
    window.addEventListener('resize', resize);

    triggerEvent("onGameInit");
    
    setTimeout(gameUpdate, 1000 / fps);
    setInterval(resetFPS, 1000);
}
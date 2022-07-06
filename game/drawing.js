var player = null;
var ctx = null;
var images = [];
let queue3d = [];

function getTickCount() {
    return new Date().getTime();
}

function getImageFromCache(url) {
    for(let i = 0; i < images.length; i++) {
        if(images[i].url == url) {
            images[i].lastUsed = getTickCount();
            return images[i];
        }
    }

    let image = new Image();
    image.src = url;
    image.url = url;
    image.lastUsed = getTickCount();
    images.push(image);
    console.log(`Added image ${url} to cache`);
    return image;
}

function updateCache() {
    let removed = 0;

    for(let i = 0; i < images.length; i++) {
        if(getTickCount() - images[i].lastUsed > 1000) {
            images.splice(i, 1);
            removed++;
        }
    }
    
    if(removed > 0) {
        console.log(`Removed ${removed} images from cache`);
    }
}

addEvent("onGameInit", () => {
    player = document.getElementById('player');
    ctx = player.getContext("2d");
});

function drawRectangle(x, y, width, height, color) {
    ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    ctx.fillRect(x, y, width, height);
}

function drawImage(x, y, w, h, image, color = {r: 255, g: 255, b: 255, a: 255}, angle = 0) {
    color.a = color.a || 255;
    ctx.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
    ctx.globalAlpha = color.a/255;

    if(typeof image == 'string') {
        image = getImageFromCache(image);
    }

    let cx = x + w/2;
    let cy = y + h/2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.drawImage(image, -w/2, -h/2, w, h);
    ctx.restore();
 
    ctx.globalAlpha = 1;
}

function drawText(text, x, y, color = {r: 255, g: 255, b: 255, a: 255}, font, fontsize, xalign, yalign) {
    color.a = color.a || 255;
    ctx.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
    ctx.textAlign = xalign || "left";
    ctx.textBaseline = yalign || "top";
    ctx.font = fontsize + "px " + font;
    ctx.fillText(text, x, y);
}

function draw3DImage(x, y, w, h, z, image, color = {r: 255, g: 255, b: 255, a: 255},  angle = 0) {
    queue3d.push({type: "image", x: x, y: y, w: w, h: h, z: z, image: image, color: color, angle: angle});
}

function draw3DText(text, x, y, z, color = {r: 255, g: 255, b: 255, a: 255}, font, fontsize, xalign, yalign) {
    queue3d.push({type: "text", x: x, y: y, z: z, text: text, color: color, font: font, fontsize: fontsize, xalign: xalign, yalign: yalign});
}

function draw3DRectangle(x, y, w, h, z, color) {
    queue3d.push({type: "rectangle", x: x, y: y, w: w, h: h, z: z, color: color});
}

function draw3DImages() {
    queue3d.sort((a, b) => {
        return a.z - b.z;
    }).forEach(item => {
        switch(item.type) {
            case "image": {
                drawImage(item.x, item.y, item.w, item.h, item.image, item.color, item.angle);
                break;
            }
            case "text": {
                drawText(item.text, item.x, item.y, item.color, item.font, item.fontsize, item.xalign, item.yalign);
                break;
            }
            case "rectangle": {
                drawRectangle(item.x, item.y, item.w, item.h, item.color);
                break;
            }
        }
    });

    queue3d = [];
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function shortAngleDist(a0,a1) {
    var max = Math.PI*2;
    var da = (a1 - a0) % max;
    return 2*da % max - da;
}

function angleLerp(a0,a1,t) {
    return a0 + shortAngleDist(a0,a1)*t;
}
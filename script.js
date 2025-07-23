// TODO: collision detection
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var level = {
    1: {
        startX: 0,
        startY: 5,
        walls: [
            { x: 0, y: 0, width: 100, height: 5 },
            { x: -20, y: 10, width: 20, height: 5 }
        ]
    }
};
var levelNumber = 1;
var x;
var y;
var xVelocity = 0;
var yVelocity = 0;
var leftDown = false;
var rightDown = false;
var upDown = false;
var onGround = false;
var inAir;

x = level[levelNumber].startX;
y = level[levelNumber].startY;

resize();

addEventListener("resize", resize);

function resize() {
    if (window.innerWidth / 4 > window.innerHeight / 3) {
        width = window.innerHeight * 4 / 3;
        height = window.innerHeight;
        canvas.style.left = (window.innerWidth - window.innerHeight * 4 / 3) / 2 + "px";
        canvas.style.top = 0;
    } else {
        width = window.innerWidth;
        height = window.innerWidth / 4 * 3;
        canvas.style.top = (window.innerHeight - window.innerWidth / 4 * 3) / 2 + "px";
        canvas.style.left = 0;
    }
    canvas.width = width;
    canvas.height = height;
}

document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft") {
        leftDown = true;
    } else if (e.key == "ArrowRight") {
        rightDown = true;
    } else if (e.key == "ArrowUp") {
        upDown = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft") {
        leftDown = false;
    } else if (e.key == "ArrowRight") {
        rightDown = false;
    } else if (e.key == "ArrowUp") {
        upDown = false;
    }
});

function gameLoop() {
    startTime = performance.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (xVelocity < 1 && rightDown) {
        xVelocity += 0.2;
    }
    if (xVelocity > -1 && leftDown) {
        xVelocity -= 0.2;
    }
    if (Math.sign(xVelocity) == 1) {
        xVelocity -= 0.1;
    }
    if (Math.sign(xVelocity) == -1) {
        xVelocity += 0.1;
    }
    xVelocity = Math.round(xVelocity * 1000) / 1000
    for (wall of level[levelNumber].walls) {
        if (
            x < wall.x + wall.width &&
            x + 5 > wall.x &&
            y - 0.04 < wall.y + wall.height &&
            y - 0.04 + 5 > wall.y
        ) {
            onGround = true;
            yVelocity = 0;
            y = wall.y + wall.height;
            break;
        }
        onGround = false;
    }
    if (onGround && upDown) {
        yVelocity = 1;
        onGround = false;
    }
    if (!onGround) {
        yVelocity -= 0.04
    }
    if (yVelocity > 0) {
        for (wall of level[levelNumber].walls) {
            if (
                x < wall.x + wall.width &&
                x + 5 > wall.x &&
                y + yVelocity < wall.y + wall.height &&
                y + yVelocity + 5 > wall.y
            ) {
                yVelocity = 0;
                break;
            }
        }
    }
    y += yVelocity
    for (wall of level[levelNumber].walls) {
        if (
            x + xVelocity < wall.x + wall.width &&
            x + xVelocity + 5 > wall.x &&
            y < wall.y + wall.height &&
            y + 5 > wall.y
        ) {
            xVelocity = 0;
            break;
        }
    }
    x += xVelocity;

    ctx.fillStyle = "black";
    ctx.fillRect(width / 2 - height / 40, height * 0.475, height / 20, height / 20);
    for (wall of level[levelNumber].walls) {
        ctx.fillStyle = "orange";
        ctx.fillRect((wall.x - x) * (height / 100) + (width / 2 - height / 40), (y - wall.y) * (height / 100) + (height * 0.475), height / 100 * wall.width, height / 100 * wall.height);
    }

    timer = setTimeout(gameLoop, Math.max(100 / 6 - (performance.now() - startTime), 0));
}

gameLoop();
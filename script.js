// TODO: collision detection
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var level = {
    objects: [
        { x: 0, y: -5, type: "wall" },
        { x: -20, y: 5, type: "wall" }
    ]
};
var x;
var y;
var xVelocity = 0;
var yVelocity = 0;
var leftDown = false;
var rightDown = false;
var upDown = false;
var onGround = false;
var inAir;
var editMode;
var mouseX;
var mouseY;


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

document.getElementById("play").addEventListener("click", () => {
    editMode = false;
    startGame();
});

document.getElementById("newGame").addEventListener("click", () => {
    editMode = true;
    startGame();
});

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

canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

function startGame() {
    document.getElementById("mainMenu").style.display = "none";
    x = 0;
    y = 0;
    gameLoop();
}

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
    for (wall of level.objects) {
        if (wall.type = "wall") {
            if (
                x < wall.x + 5 &&
                x + 5 > wall.x &&
                y - 0.04 < wall.y + 5 &&
                y - 0.04 + 5 > wall.y
            ) {
                onGround = true;
                yVelocity = 0;
                y = wall.y + 5;
                break;
            }
            onGround = false;
        }

    }
    if (onGround && upDown) {
        yVelocity = 1;
        onGround = false;
    }
    if (!onGround) {
        yVelocity -= 0.04
    }
    if (yVelocity > 0) {
        for (wall of level.objects) {
            if (wall.type == "wall") {
                if (
                    x < wall.x + 5 &&
                    x + 5 > wall.x &&
                    y + yVelocity < wall.y + 5 &&
                    y + yVelocity + 5 > wall.y
                ) {
                    yVelocity = 0;
                    break;
                }
            }
        }
    }
    y += yVelocity
    for (wall of level.objects) {
        if (wall.type == "wall") {
            if (
                x + xVelocity < wall.x + 5 &&
                x + xVelocity + 5 > wall.x &&
                y < wall.y + 5 &&
                y + 5 > wall.y
            ) {
                xVelocity = 0;
                break;
            }
        }

    }
    x += xVelocity;

    ctx.fillStyle = "black";
    ctx.globalAlpha = 1;
    ctx.fillRect(width / 2 - height / 40, height * 0.475, height / 20, height / 20);
    for (wall of level.objects) {
        if (wall.type == "wall") {
            ctx.fillStyle = "orange";
            ctx.fillRect((wall.x - x) * (height / 100) + (width / 2 - height / 40), (y - wall.y) * (height / 100) + (height * 0.475), height / 20, height / 20);
        }
    }
    if (editMode) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "orange";
        ctx.fillRect(Math.floor(mouseX / width * 20) * width / 20, Math.floor(mouseY / height * 20) * height / 20, height / 20, height / 20);
    }



    timer = setTimeout(gameLoop, Math.max(100 / 6 - (performance.now() - startTime), 0));
}
// TODO: collision detection
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var level = {
    objects: [
        { x: 0, y: -5, type: "dirt" },
        { x: -20, y: 5, type: "dirt" }
    ]
};
var x;
var y;
var xVelocity = 0;
var yVelocity = 0;
var leftDown = false;
var rightDown = false;
var upDown = false;
var downDown = false;
var onGround = false;
var fly = false;
var inAir;
var editMode;
var mouseX;
var mouseY;
var currentTile = "dirt";


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
    document.getElementById("editorMenu").style.display = "";
    startGame();
    currentTile = "dirt";
});

document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft") {
        leftDown = true;
    } else if (e.key == "ArrowRight") {
        rightDown = true;
    } else if (e.key == "ArrowUp") {
        upDown = true;
    } else if (e.key == "ArrowDown") {
        downDown = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft") {
        leftDown = false;
    } else if (e.key == "ArrowRight") {
        rightDown = false;
    } else if (e.key == "ArrowUp") {
        upDown = false;
    } else if (e.key == "ArrowDown") {
        downDown = false;
    }
});

canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

for (option of document.querySelectorAll(".objectButton")) {
    option.addEventListener("click", (e) => {
        currentTile = e.target.id;
    });
}

document.getElementById("goToStart").addEventListener("click", () => {
    x = 0.5;
    y = 0;
});

document.getElementById("fly").addEventListener("input", (e) => {
    if (e.target.checked) {
        fly = true;
    } else {
        fly = false;
    }
});

document.getElementById("canvas").addEventListener("click", () => {
    if (editMode) {
        let i = 0;
        for (object of level.objects) {
            if (
                object.x == (Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) - 12 + Math.floor(x / 5)) * 5 &&
                object.y == (-Math.floor((mouseY / height - 0.025) * 20) + Math.floor(y / 5) + 9) * 5
            ) {
                if (!(object.x == 0 && object.y == -5 && currentTile == "eraser")) level.objects.splice(i, 1);
                break;
            }
            i++;
        }
        if (currentTile != "eraser") {
            level.objects.push({ x: (Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) - 12 + Math.floor(x / 5)) * 5, y: (-Math.floor((mouseY / height - 0.025) * 20) + Math.floor(y / 5) + 9) * 5, type: currentTile });
        }
    }
});

function startGame() {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("fly").checked = "";
    x = 0.5;
    y = 0;
    fly = false;
    gameLoop();
}

function gameLoop() {
    startTime = performance.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!fly) {
        if (xVelocity < 0.75 && rightDown) {
            xVelocity += 0.2;
        }
        if (xVelocity > -0.75 && leftDown) {
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
            if (wall.type == "dirt" || wall.type == "grass") {
                if (
                    x < wall.x + 5 &&
                    x + 4 > wall.x &&
                    y - 0.04 < wall.y + 5 &&
                    y - 0.04 + 4 > wall.y
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
        if (!onGround && yVelocity > -5) {
            yVelocity -= 0.04
        }
        if (yVelocity > 0) {
            for (wall of level.objects) {
                if (wall.type == "dirt" || wall.type == "grass") {
                    if (
                        x < wall.x + 5 &&
                        x + 4 > wall.x &&
                        y + yVelocity < wall.y + 5 &&
                        y + yVelocity + 4 > wall.y
                    ) {
                        yVelocity = 0;
                        break;
                    }
                }
            }
        }
        // Normalization? no
        y += yVelocity
        for (wall of level.objects) {
            if (wall.type == "dirt" || wall.type == "grass") {
                if (
                    x + xVelocity < wall.x + 5 &&
                    x + xVelocity + 4 > wall.x &&
                    y < wall.y + 5 &&
                    y + 4 > wall.y
                ) {
                    xVelocity = 0;
                    break;
                }
            }

        }
        x += xVelocity;
        for (wall of level.objects) {
            if (wall.type == "spring") {
                if (
                    x < wall.x + 5 &&
                    x + 4 > wall.x &&
                    y < wall.y + 3.125 &&
                    y + 4 > wall.y
                ) {
                    yVelocity = 2;
                    break;
                }
            }

        }
    } else {
        if (leftDown) {
            x -= 1;
        }
        if (rightDown) {
            x += 1;
        }
        if (upDown) {
            y += 1;
        }
        if (downDown) {
            y -= 1;
        }
    }

    ctx.fillStyle = "black";
    ctx.globalAlpha = 1;
    ctx.fillRect(width / 2 - height / 40, height * 0.485, height / 25, height / 25);
    for (wall of level.objects) {
        ctx.drawImage(document.getElementById(wall.type), (wall.x - x) * (height / 100) + (width / 2 - height / 40), (y - wall.y) * (height / 100) + (height * 0.475), height / 20, height / 20);

    }
    if (editMode) {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(document.getElementById(currentTile), Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) * height / 20 - ((x % 5 - (4.155)) * (height / 100)), Math.floor((mouseY / height -  ((2.5 + y % 5) / 100)) * 20) * height / 20 + ((y % 5 + 2.5) * (height / 100)), height / 20, height / 20);
    }



    timer = setTimeout(gameLoop, Math.max(100 / 6 - (performance.now() - startTime), 0));
}
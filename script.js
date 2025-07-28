const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var level;
var originalLevel = {
    objects: [
        { x: 0, y: -5, type: "dirt" },
        { x: -20, y: 5, type: "dirt" }
    ]
};
var x;
var y;
var checkpointX = 0.5;
var checkpointY = 0;
var xVelocity = 0;
var yVelocity = 0;
var leftDown = false;
var rightDown = false;
var upDown = false;
var downDown = false;
var onGround = false;
var fly = false;
var inAir;
var mode = -1;
var mouseX;
var mouseY;
var currentTile = "dirt";
var tileX;
var tileY;
var mousedown = false;
var moveOnTouch;
var touchScreen = false;
var timePassed = 0;
var coins;
var totalCoins;
var timePlayed;

/* Modes:
-1: not playing.
-2: temporary, go to testing mode.
-3: temporary, go back to editor.
-4: open win screen.
-5: open win screen for testing mode.
0: normal.
1: edit.
2: testing.
*/


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
    mode = 0;
    startGame();
});

document.getElementById("newGame").addEventListener("click", () => {
    mode = 1;
    document.getElementById("editorMenu").style.display = "";
    startGame();
    currentTile = "dirt";
    document.getElementById("dirt").style.boxShadow = "0 0 5px 5px #ccc";
});

document.getElementById("openCredits").addEventListener("click", () => {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("creditScreen").style.display = "";
});

document.getElementById("closeCredits").addEventListener("click", () => {
    document.getElementById("mainMenu").style.display = "";
    document.getElementById("creditScreen").style.display = "none";
});

document.getElementById("leaveEditor").addEventListener("click", () => {
    mode = -1;
    document.getElementById("editorMenu").style.display = "none";
    document.getElementById("mainMenu").style.display = "";
});

document.getElementById("edit").addEventListener("click", () => {
    mode = -3;
});

document.getElementById("quit").addEventListener("click", () => {
    mode = -1;
    document.getElementById("ingameMenu").style.display = "none";
    document.getElementById("mainMenu").style.display = "";
});

document.getElementById("leaveWinScreen").addEventListener("click", () => {
    mode = -1;
    document.getElementById("winScreen").style.display = "none";
    document.getElementById("mainMenu").style.display = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("leaveWinScreenToEditor").addEventListener("click", () => {
    mode = -3;
    document.getElementById("winScreen").style.display = "none";
    document.getElementById("editorMenu").style.display = "";
    level = JSON.parse(JSON.stringify(originalLevel));
    startGame();
});

document.getElementById("replay").addEventListener("click", () => {
    document.getElementById("winScreen").style.display = "none";
    document.getElementById("ingameMenu").style.display = "";
    level = JSON.parse(JSON.stringify(originalLevel));
    if (mode == -5) {
        mode = 2;
    } else {
        mode = 0;
    }
    startGame();
});

document.addEventListener("keydown", (e) => {
    document.getElementById("move").style.display = "none";
    touchScreen = false;
    moveOnTouch = false;
    document.getElementById("move").style.backgroundColor = "";
    document.getElementById("move").style.boxShadow = "";
    document.getElementById(currentTile).style.boxShadow = "0 0 5px 5px #ccc";
    if (document.getElementById("levelOptions").style.display == "none") {
        if (e.key == "ArrowLeft" || e.key == "a") {
            leftDown = true;
        } else if (e.key == "ArrowRight" || e.key == "d") {
            rightDown = true;
        } else if (e.key == "ArrowUp" || e.key == "w") {
            upDown = true;
        } else if (e.key == "ArrowDown" || e.key == "s") {
            downDown = true;
        } else if (e.key == "r") {
            x = 0.5;
            y = 0;
            level = JSON.parse(JSON.stringify(originalLevel));
        }
    }

});

document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft" || e.key == "a") {
        leftDown = false;
    } else if (e.key == "ArrowRight" || e.key == "d") {
        rightDown = false;
    } else if (e.key == "ArrowUp" || e.key == "w") {
        upDown = false;
    } else if (e.key == "ArrowDown" || e.key == "s") {
        downDown = false;
    }
});

for (option of document.querySelectorAll(".objectButton")) {
    option.addEventListener("click", (e) => {
        for (otherOption of document.querySelectorAll(".objectButton")) {
            otherOption.style.boxShadow = "";
            otherOption.style.backgroundColor = "";
        }
        document.getElementById("move").style.boxShadow = "";
        document.getElementById("move").style.backgroundColor = "";
        e.target.style.boxShadow = "0 0 5px 5px #ccc";
        e.target.style.backgroundColor = "#ccc";
        currentTile = e.target.id;
        moveOnTouch = false;
        document.getElementById("tileName").textContent = e.target.alt;
        document.getElementById("tileName").animate([{ opacity: 1 }, { opacity: 0 },], 1000,)
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

document.getElementById("testGame").addEventListener("click", () => {
    x = 0.5;
    y = 0;
    mode = -2;
});

document.getElementById("levelOptionsButton").addEventListener("click", () => {
    if (level.par) document.getElementById("parInput").value = level.par;
    document.getElementById("levelOptions").style.display = "";
    document.getElementById("levelOptionsOverlay").style.display = "";
});

document.getElementById("closeLevelOptions").addEventListener("click", () => {
    document.getElementById("levelOptions").style.display = "none";
    document.getElementById("levelOptionsOverlay").style.display = "none";
});

document.getElementById("parInput").addEventListener("input", (e) => {
    originalLevel.par = e.target.value;
});

document.getElementById("save").addEventListener("click", () => {
    let compressedData;
    let saveCode = "";
    compressString(JSON.stringify(originalLevel)).then((compressed) => {
        compressedData = compressed;
        for (character of compressedData) {
            saveCode += (character.toString(16).length == 1 ? "0" : "") + character.toString(16);
        }
        navigator.clipboard.writeText(saveCode);
        alert("Save code copied to clipboard. Paste it somewhere safe.");
    });
});

document.getElementById("loadToEditor").addEventListener("click", load);

document.getElementById("load").addEventListener("click", () => {
    mode = 0;
    load();
});

async function load() {
    try {
        let saveCodeCompressed = prompt("Paste your save code here.");
        let uint8arrayCompressed = new Uint8Array(saveCodeCompressed.length / 2);
        let i = 0;
        for (byte of [...saveCodeCompressed.matchAll(/../g)]) {
            uint8arrayCompressed.set([Number("0x" + byte[0])], i);
            i++;
        }
        let saveCode = await decompressString(uint8arrayCompressed);
        originalLevel = JSON.parse(saveCode);
        level = JSON.parse(JSON.stringify(originalLevel));
        if (mode != 1) {
            startGame();
        }
    } catch {
        alert("Invalid save code.");
    }
}

document.addEventListener("contextmenu", (e) => { e.preventDefault(); });

document.getElementById("move").addEventListener("click", (e) => {
    for (otherOption of document.querySelectorAll(".objectButton")) {
        otherOption.style.boxShadow = "";
        otherOption.style.backgroundColor = "";
    }
    e.target.style.boxShadow = "0 0 5px 5px #ccc";
    e.target.style.backgroundColor = "#ccc";
    moveOnTouch = true;
});

canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    if (e.button == 2) {
        let tempTile = currentTile;
        currentTile = "eraser";
        placeTile();
        currentTile = tempTile;
    } else {
        placeTile();
    }
});

canvas.addEventListener("mouseup", () => {
    mousedown = false;
});

canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    if (e.buttons == 2) {
        let tempTile = currentTile;
        currentTile = "eraser";
        placeTile();
        currentTile = tempTile;
    } else {
        placeTile();
    }
});

addEventListener("touchstart", (e) => {
    document.getElementById("move").style.display = "";
    touchScreen = true;
});

canvas.addEventListener("touchstart", (e) => {
    document.getElementById("move").style.display = "";
    mousedown = true;
    touchScreen = true;
    if (window.innerWidth / 4 > window.innerHeight / 3) {
        mouseX = e.targetTouches[0].clientX - (window.innerWidth - window.innerHeight * 4 / 3) / 2;
        mouseY = e.targetTouches[0].clientY;
    } else {
        mouseX = e.targetTouches[0].clientX;
        mouseY = e.targetTouches[0].clientY - (window.innerHeight - window.innerWidth / 4 * 3) / 2;
    }
    placeTile();
    e.preventDefault();
});

canvas.addEventListener("touchmove", (e) => {
    if (window.innerWidth / 4 > window.innerHeight / 3) {
        mouseX = e.targetTouches[0].clientX - (window.innerWidth - window.innerHeight * 4 / 3) / 2;
        mouseY = e.targetTouches[0].clientY;
    } else {
        mouseX = e.targetTouches[0].clientX;
        mouseY = e.targetTouches[0].clientY - (window.innerHeight - window.innerWidth / 4 * 3) / 2;
    }
    placeTile();
    e.preventDefault();
});

canvas.addEventListener("touchend", () => {
    mousedown = false;
});

function placeTile() {
    if (mode == 1 && mousedown && !moveOnTouch) {
        if (
            tileX != (Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) + Math.floor(x / 5) - 12 + (x < 0 ? 1 : 0)) * 5 ||
            tileY != (-Math.floor((mouseY / height - ((2.5 + y % 5) / 100)) * 20) + Math.floor(y / 5) + 9 + (y % 5 != 0 && y < 0 ? 1 : 0)) * 5
        ) {
            tileX = (Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) + Math.floor(x / 5) - 12 + (x < 0 ? 1 : 0)) * 5;
            tileY = (-Math.floor((mouseY / height - ((2.5 + y % 5) / 100)) * 20) + Math.floor(y / 5) + 9 + (y % 5 != 0 && y < 0 ? 1 : 0)) * 5;
            if (
                !(x < tileX + 5 &&
                    x + 4 > tileX &&
                    y < tileY + 5 &&
                    y + 4 > tileY
                ) &&
                !(tileX == 0 && tileY == 0) &&
                tileY >= -125
            ) {
                let i = 0;
                for (object of originalLevel.objects) {
                    if (
                        object.x == tileX &&
                        object.y == tileY
                    ) {
                        if (
                            !(object.x == 0 && object.y == -5 &&
                                (
                                    currentTile == "redflag" ||
                                    currentTile == "end" ||
                                    currentTile == "coin" ||
                                    currentTile == "eraser" ||
                                    currentTile == "spike" ||
                                    currentTile == "lava" ||
                                    currentTile == "enemy"
                                ))
                        ) {
                            originalLevel.objects.splice(i, 1);
                        }
                        break;
                    }
                    i++;
                }
                if (
                    currentTile != "eraser" &&
                    !(
                        tileX == 0 &&
                        tileY == -5 &&
                        (
                            currentTile == "redflag" ||
                            currentTile == "end" ||
                            currentTile == "coin" ||
                            currentTile == "spike" ||
                            currentTile == "lava" ||
                            currentTile == "enemy"
                        )
                    )
                ) {
                    originalLevel.objects.push({ x: tileX, y: tileY, type: currentTile });
                }
                level = JSON.parse(JSON.stringify(originalLevel));
            }
        }
    }
}

function startGame() {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("fly").checked = "";
    if (mode == 0) {
        document.getElementById("ingameMenu").style.display = "";
        document.getElementById("quit").style.display = "";
        document.getElementById("edit").style.display = "none";
    } else if (mode == 1) {
        document.getElementById("ingameMenu").style.display = "none";
        level = Object.assign({}, originalLevel);
    } else if (mode == 2) {
        document.getElementById("ingameMenu").style.display = "";
        document.getElementById("quit").style.display = "none";
        document.getElementById("edit").style.display = "";
    } else {
        document.getElementById("ingameMenu").style.display = "none";
    }
    moveOnTouch = false;
    level = JSON.parse(JSON.stringify(originalLevel));
    x = 0.5;
    y = 0;
    checkpointX = 0.5;
    checkpointY = 0;
    xVelocity = 0;
    yVelocity = 0;
    coins = 0;
    totalCoins = 0;
    for (let coin of level.objects) {
        if (coin.type == "coin") {
            totalCoins++;
        }
    }
    if (totalCoins > 0) {
        document.getElementById("coinDisplay").style.display = "";
        document.getElementById("coinCount").textContent = "0/" + totalCoins;
    } else {
        document.getElementById("coinDisplay").style.display = "none";
    }
    fly = false;
    timePlayed = performance.now();
    gameLoop();
}

function gameLoop() {
    startTime = performance.now();

    if (mousedown && ((touchScreen && mode != 1) || moveOnTouch)) {
        let angle = Math.atan(((mouseX - width / 2) / 5) / ((height / 2 - mouseY) / 5));
        if (((height / 2 - mouseY) / 5) > 0) {
            downDown = false;
            if (angle > -1.1 && angle < 1.1) {
                upDown = true;
            } else {
                upDown = false;
            }
            if ((angle < -0.6 && angle > -1.6)) {
                leftDown = true;
            } else {
                leftDown = false;
            }
            if ((angle < 1.6 && angle > 0.6)) {
                rightDown = true;
            } else {
                rightDown = false;
            }
        } else {
            upDown = false;
            if (angle > -1.1 && angle < 1.1) {
                downDown = true;
            } else {
                downDown = false;
            }
            if ((angle < 1.6 && angle > 0.6)) {
                leftDown = true;
            } else {
                leftDown = false;
            }
            if ((angle < -0.6 && angle > -1.6)) {
                rightDown = true;
            } else {
                rightDown = false;
            }
        }
    } else if (!mousedown && (touchScreen || moveOnTouch)) {
        leftDown = false;
        rightDown = false;
        upDown = false;
        downDown = false;
    }

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
        let i = 0;
        for (wall of level.objects) {
            if (wall.type == "springup") {
                if (
                    x < wall.x + 5 &&
                    x + 4 > wall.x &&
                    y < wall.y + 3.125 &&
                    y + 4 > wall.y
                ) {
                    yVelocity = 1.75;
                    break;
                }
            } else if (wall.type == "springdown") {
                if (
                    x < wall.x + 5 &&
                    x + 4 > wall.x &&
                    y < wall.y + 5 &&
                    y + 4 > wall.y + 1.875
                ) {
                    yVelocity = -1.75;
                    break;
                }
            } else if (wall.type == "spike") {
                const square = {
                    x: x, y: y, size: 4,
                    corners: [
                        { x: x, y: y },
                        { x: x + 4, y: y },
                        { x: x + 4, y: y + 4 },
                        { x: x, y: y + 4 }
                    ]
                };

                const triangle = {
                    vertices: [
                        { x: wall.x, y: wall.y },
                        { x: wall.x + 5, y: wall.y },
                        { x: wall.x + 2.5, y: wall.y + 5 }
                    ]
                };
                if (detectCollision(square, triangle)) {
                    gameOver();
                }
            } else if (wall.type == "lava") {
                if (
                    x < wall.x + 5 &&
                    x + 4 > wall.x &&
                    y < wall.y + 4.375 &&
                    y + 4 > wall.y
                ) {
                    gameOver();
                }
            } else if (wall.type == "enemy") {
                if (mode != 1) {
                    if (!wall.direction) {
                        wall.direction = 1;
                    }
                    let atLedge = true;
                    for (notGap of level.objects) {
                        if (
                            Math.round(notGap.x / 5) == (wall.direction == -1 ? Math.floor((wall.x + wall.direction / 10) / 5) : Math.ceil((wall.x + wall.direction / 5) / 5)) &&
                            notGap.y == wall.y - 5
                        ) {
                            atLedge = false;
                        }
                        if (
                            notGap.x / 5 == (wall.direction == -1 ? Math.floor((wall.x + wall.direction / 10) / 5) : Math.ceil((wall.x + wall.direction / 5) / 5)) &&
                            notGap.y == wall.y
                        ) {
                            atLedge = true;
                            break;
                        }
                    }
                    if (atLedge) wall.direction = -wall.direction;
                    wall.x += wall.direction / 5;
                }
                if (
                    x < wall.x + 5 &&
                    x + 4 > wall.x &&
                    y < wall.y + 5 &&
                    y + 4 > wall.y
                ) {
                    gameOver();
                }
            } else if (wall.type == "redflag" && mode != 1) {
                if (
                    x < wall.x + 5 &&
                    x + 4 > wall.x &&
                    y < wall.y + 5 &&
                    y + 4 > wall.y
                ) {
                    for (flag of level.objects) {
                        if (flag.type == "greenflag") {
                            flag.type = "redflag";
                            break;
                        }
                    }
                    wall.type = "greenflag";
                    checkpointX = wall.x + 0.5;
                    checkpointY = wall.y;
                }
            } else if (wall.type == "coin") {
                if (mode != 1) {
                    if (
                        x < wall.x + 5 &&
                        x + 4 > wall.x &&
                        y < wall.y + 5 &&
                        y + 4 > wall.y
                    ) {
                        coins++;
                        document.getElementById("coinCount").textContent = coins + "/" + totalCoins;
                        level.objects.splice(i, 1);
                    }
                }
            } else if (wall.type == "end") {
                if (mode != 1) {
                    if (
                        x < wall.x + 5 &&
                        x + 4 > wall.x &&
                        y < wall.y + 5 &&
                        y + 4 > wall.y
                    ) {
                        if (mode == 2) {
                            mode = -5;
                        } else {
                            mode = -4;
                        }
                    }
                }
            }
            i++;
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

    if (y < -125) {
        gameOver();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.globalAlpha = 1;
    ctx.fillRect(width / 2 - height / 40, height * 0.485, height / 25, height / 25);
    for (wall of level.objects) {
        if (wall.type == "lava") {
            let image = "lava";
            for (lava of level.objects) {
                if (lava.type == "lava" && lava.x == wall.x && lava.y == wall.y + 5) {
                    image = "lava-full";
                    break;
                }
            }
            ctx.drawImage(document.getElementById(image), Math.floor(timePassed) * 512, 0, 512, 512, (wall.x - x) * (height / 100) + (width / 2 - height / 40), (y - wall.y) * (height / 100) + (height * 0.475), height / 19.7, height / 19.7);
        } else {
            ctx.drawImage(document.getElementById(wall.type), (wall.x - x) * (height / 100) + (width / 2 - height / 40), (y - wall.y) * (height / 100) + (height * 0.475), height / 19.7, height / 19.7);
        }
    }
    if (mode == 1 && !moveOnTouch) {
        ctx.globalAlpha = 0.5;
        if (currentTile == "lava") {
            ctx.drawImage(document.getElementById(currentTile), Math.floor(timePassed) * 512, 0, 512, 512, Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) * height / 20 - ((x % 5 - (4.155)) * (height / 100)), Math.floor((mouseY / height - ((2.5 + y % 5) / 100)) * 20) * height / 20 + ((y % 5 + 2.5) * (height / 100)), height / 20, height / 20);
        } else {
            ctx.drawImage(document.getElementById(currentTile), Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) * height / 20 - ((x % 5 - (4.155)) * (height / 100)), Math.floor((mouseY / height - ((2.5 + y % 5) / 100)) * 20) * height / 20 + ((y % 5 + 2.5) * (height / 100)), height / 20, height / 20);
        }

    }


    timePassed = (timePassed + 0.25) % 8;
    if (mode >= 0) {
        setTimeout(gameLoop, Math.max(100 / 6 - (performance.now() - startTime), 0));
    } else if (mode == -2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        mode = 2;
        document.getElementById("editorMenu").style.display = "none";
        startGame();
    } else if (mode == -3) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        mode = 1;
        document.getElementById("editorMenu").style.display = "";
        startGame();
    } else if (mode == -4) {
        let finalTime = performance.now() - timePlayed;
        document.getElementById("time").textContent = "Time: " + Math.floor(finalTime / 60000) + ":" + (Math.floor((finalTime % 60000) / 1000).toString().length == 1 ? "0" : "") + Math.floor((finalTime % 60000) / 1000) + (level.par ? " Par: " + level.par : "");
        document.getElementById("leaveWinScreenToEditor").style.display = "none";
        document.getElementById("leaveWinScreen").style.display = "";
        if (totalCoins) {
            document.getElementById("finalCoins").textContent = "Coins: " + coins + "/" + totalCoins;
        } else {
            document.getElementById("finalCoins").textContent = "";
        }
        document.getElementById("ingameMenu").style.display = "none";
        document.getElementById("winScreen").style.display = "";
    } else if (mode == -5) {
        let finalTime = performance.now() - timePlayed;
        document.getElementById("time").textContent = "Time: " + Math.floor(finalTime / 60000) + ":" + (Math.floor((finalTime % 60000) / 1000).toString().length == 1 ? "0" : "") + Math.floor((finalTime % 60000) / 1000) + (level.par ? " Par: " + level.par : "");;
        document.getElementById("leaveWinScreenToEditor").style.display = "";
        document.getElementById("leaveWinScreen").style.display = "none";
        if (totalCoins) {
            document.getElementById("finalCoins").textContent = "Coins: " + coins + "/" + totalCoins;
        } else {
            document.getElementById("finalCoins").textContent = "";
        }
        document.getElementById("ingameMenu").style.display = "none";
        document.getElementById("winScreen").style.display = "";
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function gameOver() {
    if (checkpointX == 0.5 && checkpointY == 0) {
        level = Object.assign({}, originalLevel);
        coins = 0;
        document.getElementById("coinCount").textContent = "0/" + totalCoins;
        timePlayed = performance.now();
    }
    x = checkpointX;
    y = checkpointY;
}

// All of the following code is AI-generated.

async function compressString(input) {
    // Convert the string to a Uint8Array
    const encoder = new TextEncoder();
    const inputData = encoder.encode(input);

    // Create a CompressionStream for gzip
    const compressionStream = new CompressionStream('gzip');
    const writableStream = compressionStream.writable.getWriter();

    // Write the data to the stream
    writableStream.write(inputData);
    writableStream.close();

    // Read the compressed data
    const compressedStream = compressionStream.readable;
    const compressedChunks = [];
    const reader = compressedStream.getReader();

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        compressedChunks.push(value);
    }

    // Combine chunks into a single Uint8Array
    const compressedData = new Uint8Array(
        compressedChunks.reduce((acc, chunk) => acc + chunk.length, 0)
    );
    let offset = 0;
    for (const chunk of compressedChunks) {
        compressedData.set(chunk, offset);
        offset += chunk.length;
    }

    return compressedData;
}

async function decompressString(compressedData) {
    // Convert the compressed string (Base64 or similar) back to a Uint8Array
    //const compressedBytes = Uint8Array.from(atob(compressedData), c => c.charCodeAt(0));
    const compressedBytes = compressedData;
    // Create a DecompressionStream (e.g., for 'gzip')
    const decompressionStream = new DecompressionStream('gzip');

    // Create a stream from the compressed bytes
    const compressedStream = new Response(compressedBytes).body;

    // Pipe the compressed stream through the decompression stream
    const decompressedStream = compressedStream.pipeThrough(decompressionStream);

    // Convert the decompressed stream back to a string
    const decompressedText = await new Response(decompressedStream).text();

    return decompressedText;
}


// Helper function to check if a point is inside a triangle
function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
    const areaOrig = Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay));
    const area1 = Math.abs((ax - px) * (by - py) - (bx - px) * (ay - py));
    const area2 = Math.abs((bx - px) * (cy - py) - (cx - px) * (by - py));
    const area3 = Math.abs((cx - px) * (ay - py) - (ax - px) * (cy - py));
    return areaOrig === (area1 + area2 + area3);
}

// Function to detect collision
function detectCollision(square, triangle) {
    // Check if any of the square's corners are inside the triangle
    for (let corner of square.corners) {
        if (isPointInTriangle(corner.x, corner.y, ...triangle.vertices)) {
            return true;
        }
    }

    // Check if any of the triangle's vertices are inside the square
    for (let vertex of triangle.vertices) {
        if (
            vertex.x >= square.x &&
            vertex.x <= square.x + square.size &&
            vertex.y >= square.y &&
            vertex.y <= square.y + square.size
        ) {
            return true;
        }
    }

    return false;
}
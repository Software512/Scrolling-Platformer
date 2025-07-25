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
    } else if (e.key == "r") {
        x = 0.5;
        y = 0;
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

document.getElementById("save").addEventListener("click", () => {
    let compressedData;
    let saveCode = "";
    compressString(JSON.stringify(level)).then((compressed) => {
        compressedData = compressed;
        for (character of compressedData) {
            saveCode += (character.toString(16).length == 1 ? "0" : "") + character.toString(16);
        }
        prompt("This is the save code for this level. Copy it and keep it somewhere safe.", saveCode);
    });
});

document.getElementById("loadToEditor").addEventListener("click", load);

document.getElementById("load").addEventListener("click", () => {
    load();
});

async function load() {
    try {
        let saveCodeCompressed = prompt("Paste your save code here.");
        let array = [];
        for (byte of [...saveCodeCompressed.matchAll(/../g)]) {
            array.push(Number("0x" + byte[0]));
        }
        let uint8arrayCompressed = new Uint8Array(array);
        let saveCode = await decompressString(uint8arrayCompressed);
        level = JSON.parse(saveCode);
        if (!editMode) {
            startGame();
        }
    } catch {
        alert("Invalid save code.");
    }
}

document.getElementById("canvas").addEventListener("click", () => {
    if (editMode) {
        let tileX = (Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) + Math.floor(x / 5) - 12 + (x < 0 ? 1 : 0)) * 5;
        let tileY = (-Math.floor((mouseY / height - ((2.5 + y % 5) / 100)) * 20) + Math.floor(y / 5) + 9 + (y < 0 ? 1 : 0)) * 5;
        if (
            !(x < tileX + 5 &&
                x + 4 > tileX &&
                y < tileY + 5 &&
                y + 4 > tileY
            ) &&
            !(tileX == 0 && tileY == 0)
        ) {
            let i = 0;
            for (object of level.objects) {
                if (
                    object.x == tileX &&
                    object.y == tileY
                ) {
                    if (!(object.x == 0 && object.y == -5 && currentTile == "eraser")) level.objects.splice(i, 1);
                    break;
                }
                i++;
            }
            if (currentTile != "eraser") {
                level.objects.push({ x: tileX, y: tileY, type: currentTile });
            }
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
                    yVelocity = 1.75;
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
        ctx.drawImage(document.getElementById(currentTile), Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) * height / 20 - ((x % 5 - (4.155)) * (height / 100)), Math.floor((mouseY / height - ((2.5 + y % 5) / 100)) * 20) * height / 20 + ((y % 5 + 2.5) * (height / 100)), height / 20, height / 20);
    }



    timer = setTimeout(gameLoop, Math.max(100 / 6 - (performance.now() - startTime), 0));
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
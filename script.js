const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var level = { objects: [{ x: 0, y: -5, type: "grass" }] };;
var originalLevel = { objects: [{ x: 0, y: -5, type: "grass" }] };
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
var deaths;

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


if (typeof CompressionStream == "undefined") {
    window.location = "update.html";
}

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

document.getElementById("defaultLevel").addEventListener("click", () => {
    mode = 0;
    load("1f8b080000000000000a959dcb8e24370e45ff25d71540e8158f5afb2f0c2f6adc3976cfd8dd8deaf2d80dc3ff6ec095526688ba3c31eb4b5e491445510c29f3cfcbe77ffde7fae3dbd7cbf3f77f5efeb83ccf4f976f97e7a93c5ddebe7db95e9e2f1f3ebebe5dfe7afa079ce23b3c466faa61765157378e758b8b065f39f8dad1d78e7ebfa33fe8e89ab3f4e02f2fff7be94715045ccec1b30bfb4d43c7c6d4934b3df9fd9afc514d609409ac32815926df2e936f98892c73f386b1ab4cbeaf4ce0691338ea04cb608255349d5a45027d0745cf6e0dc73bfaf5cbebc74f3f7df8fcfba72341f496519a1dfd5bf7d42a2d1e7a1bb9687cb2dd1f995dc1f194f6c3d8ae9faebf7eeb8675477ffcfcb11f73f1c020d0e2a1d30d8ee37627d3e7a1b2187132f0fb6cfef6c58888e94aae2b3658b49fdfc9b30f17415ee1c7de7ffceff56e1a639ba3a7f9b629fec08b3ff0ec6b675fbb0c56e9e3c8f260de0e38e8dff8b5e566d7f037584d5bf1a76df1c9571f5e4e91abae55d8d74ebe3638946a7b837183b39bae1d167a306d1fe38031cb01bef9d3a262ccecc28bf1a6a376e96dfe089bbde211f4130c482fb64178e8b7aa2a94cf08156fd39bf69b91c4ecefc68623b8f8daca3976dfeb77dfeb77dfeb57df776ec65914ecef00ab1f84575f7bf1b5175f7bf3b5775f7b07ede21a35ccbed1c30cfa01f008fc11f413e827d0b7f1aa4bc508f7f963007d187fc355820fb962f473f086ab0342f493e486833a68cbe30d9e6fe880d304c800135970a22998680e2715d8ee02c4a002eb5d000e8ad20c64053202d9804c401638393eb56f359cf8c9c0b2016ca10aacc4b012c3460c1b31ec8aa11604b40031ccc4300343d88121ecc4b011c3460c2b31acc4b010c3420c85180a316462c8c490882111432406f2c9403e19c82703f964209f2497248f2487247f245f2177256f25672557244f2447243f2437242f2427c4b848819522338576d81b9a833e101ccfd50904162240811d04dadef1602453a66b42eb19a1e58c9039388f84ccc1792494ce087945c838f8d4e0749c654e889c69ca1d58adb9405241b9a9cc9cea5020a390f8eceb077b823d7e7fb1658323bef9fab19f8951e0f151757aa9b03a9b2e30b20d4666cb84477c85b3f30aed17c2a1fd0cfac954e48ee5df605df728b00f083af7bf79870abc37e720d8afdca85da1c2be36653572cf08fed06a5e25f108fa11f413e827d0cf27dbbf9beff01dacf9972428d04001fd05f417d05fc94026321e77e4682263574c07fdddd7afab47ecf7e7b455b57df74bf915f6b557a53df70beb38f0ea593299329ed57dc4201cf8b3af5f274e560a60e54758f911567684c8d0fa0745539d0dfbdf201a0efaba18647c6fb8f054fb0d87854bfc326509e03f01fc67f1f1e61f32533fa7af565fc355e009c6be631cf455ec682925e0ba7de87f84f623f43fc2f86de0b66939ec7e1136b7089b5784cd2b263386635a9c8c0d867891fad03fc81e2aae8f25fe57eedabe8c41c9f8c810277e79ac497e8c8a760f39663711b28b08d9457590870ebc5e3ffcfb97979fac08f810e26a8c0bc47948d02a2ee7d05e0818e234077a7ce023b08fc415f437d0df60fc1bd80f4e37110e47d1a661ddf996f48d8f1fcf6fad0125906c26d20b1083dd0b05831a24245b0992a9649381231e4d073b9cf4fd636484643852b24ac9c802fa2b6cd6ab9feb571f51c97e75118d83fecdfebb68bfce9fc64d323cd4471cfaa771d287f623f4bffa17f8afc403e82763ff21aeaa28c99ea20f8948b2c95887fb9b404a7e15a7e1a02fd72f244a09129904894c82442441229320114a90a82548d412d49f13d49713d49793ad9274386cd2b69231e4477d5943f6e363b287e92e3e9ec4557cddccf8c638f0cb246a8344dedeeb1b26510ff8f1a051f92109d3b8af1fe08657c3415fdef6af38e8cbaf0815077da8c548fadd7c861a567911872ab154777b1ffcaf37b5c42d4de76bdbcbf3ddf709fbfda7abf398b177055ed0b76f54861f85d5ab8b76b912da97b87d8932c4a3080dc17ec21ca69672e9c335f98acb4b6d7051bee152df8c6f183a340efa7029b98656b935ceb0b586735b2bf1abd429da4f04435cf3c3fcdb9bd1b68e662f950f2ec5477bbf7ed853797d723741dabe509afd409e20d0576b230eb3a5bcbdceb6e487abc435919338bdc1b25799bb8ad7ea87a336092a9c6c7eb86a13042745f5b625d99dfc88db57661d0e0684d758091e7325780bd670673925786ed670e584f0d82dd93b05435c85fc8683beccf66d55746823f924ad4e92ec203c16ac0d886748777ee544d9ffe8db70a56f6bb6837899ecceda9961015f5bc08f56d05f417f03fd8dda377e7c0c46099edd247877936db019eaab57be5386709fe15c91ec96d5e9033fbc3cc936791ce2f2512dd40532d41532d425aa7dd442cd76a18dc70fe353079f6c93fb210eeaa0ad5ed6349c9a972f6b9a001940be29c9f8acdaff3c93e1f34cc5895fed35d986e221ae2a3b8d1f70fdea1c3cac808715f0b0e27b58f13dac808715f2b0421e56c8c30a795815a02990ef969a135318d30cf5ee7b527b658d648e443ccba17e7ea1e2eaa89da15451a3e9a4f28e26a0128f1a4f354315900cf488ac99490a2462c8c450b00f7514b0af6981440c89183231646228c450886121860519ac478d0564805f683617bbae840031c810d404884186c1262019ecc23107b726e4bd84b80b9d61f25e15dc85ce307927cebbd01926ef35c45dc8635a69db5a693a3662d8886127867a4af51d021c4ac1abafbdfada9bafbdf9dafba9b627b90d56cb6901b07d99c1f655408ee09479c41657282d2f91fa9f8821114326868c36746d50fc2f4ec5ffea52fc7351359082fdef45c5ffda544d23615f7bb6763bfece1dfe8a1efd54dddd7bb10f30398e0031d0c9b136a1d640326bb8c34d1038e27e78abb0f2ddc5b08f71e9fcb49f17ca080ae514e5ccbe598a6519089d61a224a80c36fba34021063aa8b5988302d26899cc9e61e26a454ca79375ed488199186664b069dc5840ff401725e65540d6359a0031a83b4b79f09c792ca06e4ddd0588413f39af02c4f0cfe36b90a0f281b425fd6c481390b6a4b7e54d40da925eb7370169cb48b68ce76d2993debb04ce983c6cdd2524472189801c0139227244e448c89190a38ef6f0d2fe9030df530eac5f05f788d63a23a7ef2e21eb378526380dba3b2e8e3812c891ec9212153bbde80a2dba428baed0a22bb4e8aa848c1d839f9518db5b0a6462c8c450ce32e871660c3f998c5990a2a0631574ac42c618fc4cc7b85a8402d23317f24cfab598bb0097b4b02a264db560b45830e22c184f160ca10b86e1821c05393272e4ffa31f326ce54128bf7efa6003c2c3d40e3f244cea3dc44354c2b8a5f781c162ec3e26581f3d0a2c83d5dafdd8ec2023197fb108411b7430967147d4038b366d5a80185a1372a883f5386e43ce7b46c7c036124ec9e027868e02f3c0b99484ea46207bb7639eec267dc9aa02abce1f4e1f2df42a09b48ecaa0b6defd26b23d347702c860ab41e326a4c0a0b62f0468145a80186ecb58e3fee7d3626fb90f6b5e12879be0b5ea191ea3f6e36da15ab59304f695c0119f417f36fac3aa3915c5a82646fad4beac0ec1e5dc02b7adaafd340efa709baa4eb0c4e11f0caa03eaea18e8db9ff21f16f0340efa7055bff9079c431e226eff9a7db59b60b746de291e3e6bf614d96e3fbd48fbf552d94c18b074179df1ff41fcc516ed623de0c1de2decf0d9c7ed45ea0e07fd15f4ed45ef23be803ebceb683f5c2671d0cfa09f7dfdf6a3e2303efdb0c8de5eed04763fdc56028d83fe0afa2be84338af33a8ffb708f4e16a5c9d218d037f321e307ef924f0f6eb28bd07fcf074f9faf3e7dfbfbbbebcfdfcf5f2fcf6fadbf5e9f2e5e5f5f27cc9cff37cf9eb6fbfa9fcf59c6d0000");
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
    level = { objects: [{ x: 0, y: -5, type: "grass" }] };;
    originalLevel = { objects: [{ x: 0, y: -5, type: "grass" }] };
});

document.getElementById("showDeaths").addEventListener("input", (e) => {
    if (e.target.checked) {
        originalLevel.showDeaths = true;
    } else {
        originalLevel.showDeaths = false;
    }
});

document.getElementById("leaveWinScreen").addEventListener("click", () => {
    mode = -1;
    document.getElementById("winScreen").style.display = "none";
    document.getElementById("mainMenu").style.display = "";
    level = { objects: [{ x: 0, y: -5, type: "dirt" }] };;
    originalLevel = { objects: [{ x: 0, y: -5, type: "dirt" }] };
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
        if (e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
            leftDown = true;
        } else if (e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
            rightDown = true;
        } else if (e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
            upDown = true;
        } else if (e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
            downDown = true;
        }
    }

});

document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        leftDown = false;
    } else if (e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        rightDown = false;
    } else if (e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
        upDown = false;
    } else if (e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
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
    xVelocity = 0;
    yVelocity = 0;
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
    if (level.showDeaths) document.getElementById("showDeaths").checked = level.showDeaths == true ? level.showDeaths : "";
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
        try {
            navigator.clipboard.writeText(saveCode);
            alert("Save code copied to clipboard. Paste it somewhere safe.");
        } catch {
            alert("Could not copy to clipboard. Check if the URL begins with https:// and that this page has permissions to the clipboard. Press F12 and open the browser console if you want to get your save code.");
            console.log("Copy this code to save your level.");
            console.log(saveCode);
        }
    });
});

document.getElementById("loadToEditor").addEventListener("click", () => { load() });

document.getElementById("load").addEventListener("click", () => {
    mode = 0;
    load();
});

document.getElementById("resetLevel").addEventListener("click", () => {
    if (confirm("This will reset any unsaved progress. Do you want to continue?")) {
        originalLevel = { objects: [{ x: 0, y: -5, type: "grass" }] };
        level = { objects: [{ x: 0, y: -5, type: "grass" }] };
        x = 0.5;
        y = 0;
        document.getElementById("parInput").value = "";
        document.getElementById("showDeaths").checked = "";
    }
});

async function load(code) {
    try {
        let saveCodeCompressed;
        if (JSON.stringify(level) != '{"objects":[{"x":0,"y":-5,"type":"grass"}]}') {
            if (confirm("This will reset any unsaved progress. Do you want to continue?")) {
                if (!code) {
                    saveCodeCompressed = prompt("Paste your save code here.");
                    if (!saveCodeCompressed) {
                        return;
                    }
                }
            } else {
                return;
            }
        }
        if (code) {
            saveCodeCompressed = code;
        } else if (!saveCodeCompressed) {
            saveCodeCompressed = prompt("Paste your save code here.");
            if (!saveCodeCompressed) {
                return;
            }
        }
        let uint8arrayCompressed = new Uint8Array(saveCodeCompressed.length / 2);
        let i = 0;
        for (byte of [...saveCodeCompressed.matchAll(/../g)]) {
            uint8arrayCompressed.set([Number("0x" + byte[0])], i);
            i++;
        }
        let saveCode = await decompressString(uint8arrayCompressed);
        originalLevel = JSON.parse(saveCode);
        level = JSON.parse(JSON.stringify(originalLevel));
        x = 0.5;
        y = 0;
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
        tileX = (Math.floor((mouseX / height - ((4.155 - x % 5) / 100)) * 20) + Math.floor(x / 5) - 12 + (x < 0 && x % 5 != 0 ? 1 : 0)) * 5;
        tileY = (-Math.floor((mouseY / height - ((2.5 + y % 5) / 100)) * 20) + Math.floor(y / 5) + 9 + (y % 5 != 0 && y < 0 ? 1 : 0)) * 5;
        if (
            (!(x < tileX + 5 &&
                x + 4 > tileX &&
                y < tileY + 5 &&
                y + 4 > tileY
            ) || (currentTile == "coin" || currentTile == "eraser")) &&
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

function startGame() {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("fly").checked = "";
    if (mode == 0) {
        document.getElementById("ingameMenu").style.display = "";
        document.getElementById("quit").style.display = "";
        document.getElementById("edit").style.display = "none";
    } else if (mode == 1) {
        document.getElementById("ingameMenu").style.display = "none";
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
    deaths = 0;
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
        if (onGround && upDown) {
            yVelocity = 1;
            onGround = false;
        }
        if (!onGround && yVelocity > -2) {
            yVelocity -= 0.04;
        }
        if (yVelocity > 0) {
            for (wall of level.objects) {
                if (wall.type == "dirt" || wall.type == "grass" || wall.type == "stone") {
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
        y += yVelocity;
        for (wall of level.objects) {
            if (wall.type == "dirt" || wall.type == "grass" || wall.type == "stone") {
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
        for (wall of level.objects) {
            if (wall.type != "enemy" && Math.abs(x - wall.x) > 10 && Math.abs(y - wall.y) > 10) {
                continue;
            }
            if (wall.type == "dirt" || wall.type == "grass" || wall.type == "stone") {
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
                    y + 4 > wall.y &&
                    !onGround
                ) {
                    yVelocity = 1.75;
                }
            } else if (wall.type == "springdown") {
                if (
                    x < wall.x + 5 &&
                    x + 4 > wall.x &&
                    y < wall.y + 5 &&
                    y + 4 > wall.y + 1.875
                ) {
                    yVelocity = -1.75;
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
            } else if (wall.type == "ceiling-spike") {
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
                        { x: wall.x, y: wall.y + 5 },
                        { x: wall.x + 5, y: wall.y + 5 },
                        { x: wall.x + 2.5, y: wall.y }
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
                            (Math.round(notGap.x / 5) == (wall.direction == -1 ? Math.floor((wall.x + wall.direction / 10) / 5) : Math.ceil((wall.x + wall.direction / 5) / 5)) &&
                                notGap.y == wall.y - 5) &&
                            notGap.type != "coin" &&
                            notGap.type != "springup" &&
                            notGap.type != "springdown" &&
                            notGap.type != "redflag" &&
                            notGap.type != "greenflag" &&
                            notGap.type != "end"
                        ) {
                            atLedge = false;
                        }
                        if (
                            notGap.x / 5 == (wall.direction == -1 ? Math.floor((wall.x + wall.direction / 10) / 5) : Math.ceil((wall.x + wall.direction / 5) / 5)) &&
                            notGap.y == wall.y &&
                            notGap.type != "coin" &&
                            notGap.type != "springup" &&
                            notGap.type != "springdown" &&
                            notGap.type != "end"
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
        if (Math.abs(x - wall.x) > 40 && Math.abs(y - wall.y) > 60) {
            continue;
        }
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
        if (level.showDeaths) {
            document.getElementById("deathCount").style.display = "";
            document.getElementById("deathCount").textContent = "Deaths: " + deaths;
        } else {
            document.getElementById("deathCount").style.display = "none";
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
        if (level.showDeaths) {
            document.getElementById("deathCount").style.display = "";
            document.getElementById("deathCount").textContent = "Deaths: " + deaths;
        } else {
            document.getElementById("deathCount").style.display = "none";
        }
        document.getElementById("ingameMenu").style.display = "none";
        document.getElementById("winScreen").style.display = "";
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function gameOver() {
    if (checkpointX == 0.5 && checkpointY == 0) {
        level = JSON.parse(JSON.stringify(originalLevel));
        coins = 0;
        document.getElementById("coinCount").textContent = "0/" + totalCoins;
    }
    deaths++;
    x = checkpointX;
    y = checkpointY;
    xVelocity = 0;
    yVelocity = 0;
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
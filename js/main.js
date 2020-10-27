var sound = new Howl({
    src: ['/imgtec-fullstack-challenge/sounds/background.mp3']
});

sound.play();

// main counter
var count = 0;

// maintaining sprites
var spritesA = [],
    spritesB = [],
    logs = [];

// scores data structure
let b = new Bump(PIXI);

let loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

let app = new PIXI.Application({
    width: 1024,
    height: 704,
    antialias: true,
    transparent: true,
    resolution: 1,
    forceCanvas: true,
});

$(document).ready(function(){
    // making window
    document.getElementById("playground").appendChild(app.view);
});

loader.add("vectors/sprites/bees.json").load(setup);

// getting shaders
let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    fill: "white",
    stroke: "#ff3300",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
});

let message = new PIXI.Text("Fight to survive, begin !", style);
message.position.set(200, 500);
app.stage.addChild(message);
app.renderer.autoDensity = true;
app.renderer.view.style.position = "relative";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

var queenA, queenB, id;
var blobAWo, blobBWo, blobA, blobB;
let state = play;

// setup of drawings
function setup() {
    id = loader.resources["vectors/sprites/bees.json"].textures;
    queenA = new Sprite(
        loader.resources["vectors/sprites/bees.json"].textures[
            "Queen_bee_A.png"
        ]
    );

    queenB = new Sprite(
        loader.resources["vectors/sprites/bees.json"].textures[
            "Queen_bee_B.png"
        ]
    );
    // random direction movement
    queenA.vx = randomInt(-1, 1);
    // attacks B
    queenB.vx = randomInt(-1, 1);
    // attacks A
    queenA.vy = randomInt(-1, 1);
    // attacks B
    queenB.vy = randomInt(-1, 1);
    // attacks A
    queenA.y = 212;
    queenA.x = 10;

    queenB.x = 900;
    queenB.y = 212;
    // add sprites to board
    app.stage.addChild(queenB);
    app.stage.addChild(queenA);
    spritesA.push(queenA);
    spritesB.push(queenB);
    let numberOfBlobs = 15,
        spacing = 48,
        xOffset = 150;
    for (let i = 0; i < numberOfBlobs; i++) {
        blobA = new Sprite(id["Warrior_bee_A.png"]);
        blobB = new Sprite(id["Warrior_bee_B.png"]);

        blobA.vx = randomInt(-1, 1);
        blobB.vx = randomInt(-1, 1);
        blobA.vy = randomInt(-1, 1);
        blobB.vy = randomInt(-1, 1);
        let xA = spacing * i + xOffset;
        let yA = randomInt(0, app.stage.height - blobA.height);

        let xB = spacing * i + xOffset;
        let yB = randomInt(0, app.stage.height - blobB.height);
        blobA.x = xA;
        blobA.y = yA;
        blobB.x = xB;
        blobB.y = yB;
        app.stage.addChild(blobA);
        app.stage.addChild(blobB);
        spritesA.push(blobA);
        spritesB.push(blobB);
    }
    app.ticker.add((delta) => gameLoop(delta));
    let numberOfBlobsWo = 20,
        spacingWo = 48,
        xOffsetWo = 150;
    for (let i = 0; i < numberOfBlobsWo; i++) {
        blobAWo = new Sprite(id["Worker_bee_A.png"]);
        blobBWo = new Sprite(id["Worker_bee_B.png"]);

        blobAWo.vx = randomInt(-1, 1);
        blobBWo.vx = randomInt(-1, 1);
        blobAWo.vy = randomInt(-1, 1);
        blobBWo.vy = randomInt(-1, 1);

        //`xOffset` determines the point from the left of the screen
        let xA = spacingWo * i + xOffsetWo;
        
        //(`randomInt` is a custom function - see below)
        let yA = randomInt(0, app.stage.height - blobAWo.height);

        let xB = spacingWo * i + xOffsetWo;
        
        //(`randomInt` is a custom function - see below)
        let yB = randomInt(0, app.stage.height - blobBWo.height);
        
        blobAWo.x = xA;
        blobAWo.y = yA;
        
        blobBWo.x = xB;
        blobBWo.y = yB;
        
        app.stage.addChild(blobAWo);
        app.stage.addChild(blobBWo);
        
        spritesA.push(blobAWo);
        spritesB.push(blobBWo);
    }

    // looping the logic in game
    app.ticker.add((delta) => gameLoop(delta));
    setTimeout(function() {
        if (scoreA[1][1] <= 0) {
            sound.pause();
            alert(" 👑 Queen A dead 😕, Swarm B wins! 🏆");
            window.location.reload();
            return false;
        }
        if (scoreB[1][1] <= 0) {
            sound.pause();
            alert(" 👑 Queen B dead 😕, Swarm A wins! 🏆");
            window.location.reload();
            return false;
        }
    }, 10000);
}

function gameLoop(delta) {
    state(delta);
}
let hit = false;

function play(delta) {
    for (i = 0; i < spritesB.length; i++) {
        
        // rotation to get bee effect
        if (spritesB[i].x >= window.innerWidth || spritesB[i].x <= 0) {
            spritesB[i].vx *= -1;
            spritesB[i].rotation += 1;
        }
        if (spritesB[i].y <= 0 || spritesB[i].y >= window.innerHeight) {
            spritesB[i].vy *= -1;
            spritesB[i].rotation += 1;
        }
        spritesB[i].x += (spritesB[i].vx * 3);
        spritesB[i].y += (spritesB[i].vy * 3);
    }
    for (j = 0; j < spritesA.length; j++) {
        
        // rotation to get bee effect
        if (spritesA[j].x >= 1024 || spritesA[j].x <= 0) {
            spritesA[j].vx *= -1;
            spritesA[j].rotation += 1;
        }
        if (spritesA[j].y <= 0 || spritesA[j].y >= 704) {
            spritesA[j].vy *= -1;
            spritesA[j].rotation += 1;
        }

        spritesA[j].x -= (spritesA[j].vx * 3);
        spritesA[j].y -= (spritesA[j].vy * 3);
    }

    for (let i = 0; i < spritesA.length; i++) {
        var c1 = spritesA[i];
        for (let j = i; j < spritesB.length; j++) {
            let c2 = spritesB[j];
            if (b.hit(c1, c2, true, true)) {
                
                // getting metadata of the 2 bees fighting     
                let character1 = (c1._texture.textureCacheIds[0]).split('_')[0];
                let swarm1 = ((c1._texture.textureCacheIds[0]).split('_')[2]).split('.')[0];
                let character2 = (c2._texture.textureCacheIds[0]).split('_')[0];
                let swarm2 = ((c2._texture.textureCacheIds[0]).split('_')[2]).split('.')[0];
                let damageA = 0,
                    damageB = 0;

                if (swarm2 != swarm1) {
                    switch (character1) {
                        case 'Warrior':
                            damageA = randomInt(4, 7);
                            damageB = randomInt(4, 7);
                            c2.alpha -= 1 / 50;
                            break;
                        case 'Worker':
                            damageA = randomInt(2, 4);
                            damageB = randomInt(2, 4);
                            c2.alpha -= 1 / 5;
                            break;
                        case 'Queen':
                            damageA = 1;
                            damageB = 1;
                            c2.alpha -= 1 / 10;
                            break;
                    }
                    switch (character2) {
                        case 'Warrior':
                            damageA = randomInt(4, 7);
                            damageB = randomInt(4, 7);
                            c1.alpha -= 1 / 50;
                            break;
                        case 'Worker':
                            damageA = randomInt(2, 4);
                            damageB = randomInt(2, 4);
                            c1.alpha -= 1 / 5;
                            break;
                        case 'Queen':
                            damageA = 1;
                            damageB = 1;
                            c1.alpha -= 1 / 10;
                            break;
                    }
                    let msg = ('⚠ ' + character1 + ' ' + swarm1 + ' ' + damageA + ' 🗡 to ' + character2 + ' ' + swarm2 + '      ' + character2 + ' ' + swarm2 + ' ' + damageB + ' 🗡 to ' + character1 + ' ' + swarm1);
                    message.text = msg;
                    let arr = [];
                    arr.push(msg);
                    logs.push(arr);
                    if (scoreA[parseInt(getKeyByValue(spritesA, c1)) + 1][1] >= 0) {
                        scoreA[parseInt(getKeyByValue(spritesA, c1)) + 1][1] -= damageB;
                        scoreA[parseInt(getKeyByValue(spritesA, c1)) + 1][2] += 1;
                    }

                    if (scoreB[parseInt(getKeyByValue(spritesB, c2)) + 1][1] >= 0) {
                        scoreB[parseInt(getKeyByValue(spritesB, c2)) + 1][1] -= damageA;
                        scoreB[parseInt(getKeyByValue(spritesB, c2)) + 1][2] += 1;
                    }

                    update();
                }
            }
        }
    }
}


function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function update() {
    // update scores
    updateTable(scoreA, "score1");
    updateTable(scoreB, "score2");
}

// random number genarator
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// scoreboard
var scoreA = [
    ["Role", "Health", "Hits"],
    ["Queen", 50, 0],
    ["Warrior1", 10, 0],
    ["Warrior2", 10, 0],
    ["Warrior3", 10, 0],
    ["Warrior4", 10, 0],
    ["Warrior5", 10, 0],
    ["Warrior6", 10, 0],
    ["Warrior7", 10, 0],
    ["Warrior8", 10, 0],
    ["Warrior9", 10, 0],
    ["Warrior10", 10, 0],
    ["Warrior11", 10, 0],
    ["Warrior12", 10, 0],
    ["Warrior13", 10, 0],
    ["Warrior14", 10, 0],
    ["Warrior15", 10, 0],
    ["Worker1", 5, 0],
    ["Worker2", 5, 0],
    ["Worker3", 5, 0],
    ["Worker4", 5, 0],
    ["Worker5", 5, 0],
    ["Worker6", 5, 0],
    ["Worker7", 5, 0],
    ["Worker8", 5, 0],
    ["Worker9", 5, 0],
    ["Worker10", 5, 0],
    ["Worker11", 5, 0],
    ["Worker12", 5, 0],
    ["Worker13", 5, 0],
    ["Worker14", 5, 0],
    ["Worker15", 5, 0],
    ["Worker10", 5, 0],
    ["Worker11", 5, 0],
    ["Worker12", 5, 0],
    ["Worker13", 5, 0],
    ["Worker14", 5, 0],
    ["Worker15", 5, 0],
    ["Worker16", 5, 0],
    ["Worker17", 5, 0],
    ["Worker18", 5, 0],
    ["Worker19", 5, 0],
    ["Worker20", 5, 0],
];

var scoreB = [
    ["Role", "Health", "Hits"],
    ["Queen", 50, 0],
    ["Warrior1", 10, 0],
    ["Warrior2", 10, 0],
    ["Warrior3", 10, 0],
    ["Warrior4", 10, 0],
    ["Warrior5", 10, 0],
    ["Warrior6", 10, 0],
    ["Warrior7", 10, 0],
    ["Warrior8", 10, 0],
    ["Warrior9", 10, 0],
    ["Warrior10", 10, 0],
    ["Warrior11", 10, 0],
    ["Warrior12", 10, 0],
    ["Warrior13", 10, 0],
    ["Warrior14", 10, 0],
    ["Warrior15", 10, 0],
    ["Worker1", 5, 0],
    ["Worker2", 5, 0],
    ["Worker3", 5, 0],
    ["Worker4", 5, 0],
    ["Worker5", 5, 0],
    ["Worker6", 5, 0],
    ["Worker7", 5, 0],
    ["Worker8", 5, 0],
    ["Worker9", 5, 0],
    ["Worker10", 5, 0],
    ["Worker11", 5, 0],
    ["Worker12", 5, 0],
    ["Worker13", 5, 0],
    ["Worker14", 5, 0],
    ["Worker15", 5, 0],
    ["Worker10", 5, 0],
    ["Worker11", 5, 0],
    ["Worker12", 5, 0],
    ["Worker13", 5, 0],
    ["Worker14", 5, 0],
    ["Worker15", 5, 0],
    ["Worker16", 5, 0],
    ["Worker17", 5, 0],
    ["Worker18", 5, 0],
    ["Worker19", 5, 0],
    ["Worker20", 5, 0],
];

// reupdate the table 
function updateTable(tableData, id) {
    document.getElementById(id).innerHTML = "";
    var table = document.createElement("table");
    if (id == 'score2') {
        table.setAttribute('style', 'float:right;');
    }
    var header = table.createTHead();
    var rowH = header.insertRow(0);
    var cellH = rowH.insertCell(0);

    cellH.setAttribute("colspan", "3");
    cellH.setAttribute("class", "tg-baqh");
    cellH.innerHTML = id == "logs" ? "<font style='color:blue;'><b>Logs</b></font>" : (id == "score1" ? "<font style='color:lime;'><b>🦟 Swarm A</b></font>" : "<font style='color:red;'><b>🦟 Swarm B</b></font>");
    
    table.setAttribute("class", "tg");
    table.setAttribute("id", id + "H");
    
    var tableBody = document.createElement("tbody");
    tableData.forEach(function(rowData) {
        var row = document.createElement("tr");
        rowData.forEach(function(cellData) {
            var cell = document.createElement("td");
            
            cell.setAttribute("class", "tg-0lax");
            cell.appendChild(document.createTextNode(cellData));
            
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.getElementById(id).appendChild(table);
}

updateTable(scoreA, "score1");
updateTable(scoreB, "score2");

const seconds = document.querySelector("#counter");

// counter
const renderTimer = () => {
    count += 1;
    seconds.innerHTML = "⏳ War-time: " + (count % 60).toString().padStart(2, "0") + " seconds up";
}

const timer = setInterval(renderTimer, 1000);

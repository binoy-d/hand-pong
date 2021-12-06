const video = document.getElementById("myvideo");
const video_canvas = document.getElementById("video-canvas");
const context = video_canvas.getContext("2d");
let trackButton;
let updateNote = document.getElementById("updatenote");
let data;
let isVideo = false;
let model = null;
let loadingmessages;
const trackingButtonHTML = '<button onclick = "toggleVideo()" class="btn btn-primary mt-1" id="trackbutton">Enable Video</button>'

const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking";
            isVideo = true;
            runDetection();
            if (trackButton) trackButton.remove();
        } else {
            updateNote.innerText = "Please enable video";
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video";
        startVideo();
    } else {
        updateNote.innerText = "Stopping video";
        handTrack.stopVideo(video);
        isVideo = false;
        updateNote.innerText = "Video stopped";
    }
}

function runDetection() {
    model.detect(video).then((predictions) => {
        //console.log("Predictions: ", predictions);
        data = predictions;
        model.renderPredictions(predictions, video_canvas, context, video);

        if (isVideo) requestAnimationFrame(runDetection);
    });
}
loadingmessages = setInterval(()=>{
    if(trackButton) return;
    if(FUNNIES) document.getElementById("funnies").innerText = FUNNIES[Math.floor(Math.random()*FUNNIES.length)]
}, 80);

window.onload = function () {
    // Load the model.
    handTrack.load(modelParams).then((lmodel) => {
        // detect objects in the image.
        model = lmodel;
        updateNote.innerText = "Loaded Model!";
        var div = document.createElement('div');
        div.innerHTML = trackingButtonHTML;
        while (div.children.length > 0) {
            document.getElementById("header-top").appendChild(div.children[0]);
        }
        document.getElementById("updatenote").remove();
        trackButton = document.getElementById("trackbutton");
        setup();
        trackButton.disabled = false;
        clearInterval(loadingmessages);
    });
};




const CAM_H = 480;
const CAM_W = 640;
const PADDLE_OFFSET = 50;
const PLAYER_SPEED = 0;
const PLAYER_ACCEL = 5;
const TOLERANCE = 4;
const PLAYER_MAX_SPEED = 8;
const BALL_MAX_SPEED = 8;
const BALL_MIN_SPEED = 4;
const SCORE_OFFSET = 10;
const TEXT_SIZE = 20;
const HEIGHT_OFFSET = 20;
const WIDTH_OFFSET = 50;
const MAX_CANVAS_WIDTH = 1300;
const MAX_CANVAS_HEIGHT = 1000;
var canv;
var canvw = 1300, canvh = 720;
var pw = 0, ph = 0;
var bx, by, bw, bh;
var p1, p2, ball;
var difficulty = 1;
var players;
var gamestate = 0;
var borderAlpha = 0;
var paused = true;

let face1, face2;

//TODO: capture face, two closed hands to start
//TODO: two closed hands in game to pause
//t
/**
 * 
 * HELPERS 
 * 
 */
const toGlobalXCoords = (x) => (canvw) * (x / CAM_W);
const toGlobalYCoords = (y) => (canvh + 150) * (y / CAM_H);

const toBoxObj = (bbox) => {
    return {
        x: toGlobalXCoords(bbox[0]),
        y: toGlobalYCoords(bbox[1]),
        w: toGlobalXCoords(bbox[2]), //semantically weird but it works lol
        h: toGlobalYCoords(bbox[3])
    }
}

//b = boxObj with x,y,w,h
const getBoxCenter = (b) => {
    return {
        x: b.x + b.w / 2,
        y: b.y + b.h / 2
    }
}

function initVars() {
    canvw = document.getElementById("canvas-wrapper").clientWidth;
    canvh = document.getElementById("canvas-wrapper").clientHeight;
    canvw = min(canvw, MAX_CANVAS_WIDTH);
    canvh = min(canvh, MAX_CANVAS_HEIGHT);
    ball = {
        x: canvw / 2,
        y: canvh / 2,
        vx: 0,
        vy: 0,
        w: max(10, canvw / 100),
        h: max(10, canvw / 100),
        prevPositions: []
    }

    p1 = {
        x: PADDLE_OFFSET + WIDTH_OFFSET,
        y: 0,
        vy: 0,
        targetY: canvh / 2,
        score: 0,
        active: false
    }

    p2 = {
        x: canvw - PADDLE_OFFSET - WIDTH_OFFSET,
        y: canvh,
        vy: 0,
        targetY: canvh / 2,
        score: 0,
        active: false
    }
    players = [p1, p2]


    pw = max(canvw / 60, 10);
    ph = max(canvh / 5, 100);

    ball.vx = random() < 0.5 ? random(-BALL_MAX_SPEED, -BALL_MIN_SPEED) : random(BALL_MIN_SPEED, BALL_MAX_SPEED);
    ball.vy = random() < 0.5 ? random(-BALL_MAX_SPEED, -BALL_MIN_SPEED) : random(BALL_MIN_SPEED, BALL_MAX_SPEED);

    borderAlpha = 0;
}

function setup() {
    imageMode(CENTER);
    initVars();
    //setup
    canv = createCanvas(canvw, 720);
    canv.parent('canvas-wrapper');
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
}

function draw() {
    if (!data) {
        var upd = document.getElementById("updatenote");
        if (upd) upd.innerHTML += "."
        return;
    }

    renderBorder();
    if (gamestate === 0) {
        startScreen();
    } else if (gamestate === 1) {
        mainGame();
    } else if (gamestate === 2) {
        winScreen();
    }
    renderBorder();

}


function winScreen() {
    const restartGame = () => {
        gamestate = 0;
        initVars();
    }
    background(0, 100);
    tickPaddles();
    renderPaddles();
    const winner = p1.score > p2.score ? "Player 1" : "Player 2";
    const winner_face = p1.score > p2.score ? face1 : face2;
    if(winner_face){
        image(winner_face, canvw/2, canvh/4);
    }
    textStyle(BOLD);
    fill(255, borderAlpha);
    noStroke();
    textSize(canvh / 9);
    let progress = borderAlpha / 255;
    text(winner + " wins!".slice(0, Math.ceil(progress * 16)), canvw / 2, 14 * canvh / 30);
    textSize(canvh / 40);
    text("✊    close two hands to play again    ✊", canvw / 2, 17 * canvh / 30);

    if (countGestureOfType(2) >= 2) {
        restartGame();
    }
}


function startScreen() {
    background(0);
    textStyle(BOLD);
    fill(255, borderAlpha);
    noStroke();
    textSize(canvh / 6)
    let progress = borderAlpha / 255;
    text("P.O.N.G.", canvw / 2, 14 * canvh / 30);
    fill(255, borderAlpha / 2);
    textSize(canvh / 40);
    text("Palm Optimized Nerdy Game".slice(0, Math.ceil(progress * 26)), canvw / 2, 17 * canvh / 30);
    const startGame = () => {
        face1 = null;
        face2 = null;
        gamestate = 1;
    }
    text("✊    close two hands to begin    ✊", canvw / 2, 21 * canvh / 30);

    if (countGestureOfType(2) >= 2) {
        startGame();
    }


    tickPaddles();
    renderPaddles();
}

function tickFaces() {
    if (!data) return;
    if (!context) return;
    data.forEach(obj => {
        if (obj.class == 5) { //face
            b = toBoxObj(obj.bbox);
            pos = getBoxCenter(b);
            pix = context.getImageData(obj.bbox[0]+2, obj.bbox[1]+40, obj.bbox[2]-4, obj.bbox[3]-42);
            if(pos.x<canvw/2){
                face1 = createImage(pix.width, pix.height);
                face1.loadPixels();
                for(var i = 0; i< face1.pixels.length; i++){
                    face1.pixels[i] = pix.data[i];
                }
                face1.updatePixels();
            }else{
                face2 = createImage(pix.width, pix.height);
                face2.loadPixels();
                for(var i = 0; i< face2.pixels.length; i++){
                    face2.pixels[i] = pix.data[i];
                }
                face2.updatePixels();
            }
        }
    });
}
function mainGame() {
    background(0);
    render();
    if (!paused) {
        tick();
    } else {
        drawPauseMenu();
    }
}

function togglePause() {
    paused = !paused;
    borderAlpha = 0;
}

function drawPauseMenu() {
    fill(0, borderAlpha);
    noStroke();
    rect(canvw / 2, canvh / 2, canvw / 3, canvh / 4);
    fill(255);
    textSize(canvh / 8);
    text("Game Paused", canvw / 2, canvh / 2);
    textStyle(NORMAL);
    textSize(canvh / 40);
    text("✋    open your hands to play    🤚", canvw / 2, 3 * canvh / 5);
    if (borderAlpha < 255) borderAlpha += 2;

    if (countGestureOfType(1) >= 2) {
        togglePause();
    }
}



//TODO: decide which player based on relative position instead of harsh boundary
function tick() {
    if (!data) return;

    tickPaddles();
    tickBall();
    tickScore();
    tickFaces();
    if (countGestureOfType(2) >= 2) {
        paused = true;
        borderAlpha = 0;
    }
}



function windowResized() {
    canvw = document.getElementById("canvas-wrapper").clientWidth;
    canvh = document.getElementById("canvas-wrapper").clientHeight;
    //clamp it
    canvw = min(canvw, MAX_CANVAS_WIDTH);
    canvh = min(canvh, MAX_CANVAS_HEIGHT);
    players[0].x = WIDTH_OFFSET+PADDLE_OFFSET;
    players[1].x = canvw - WIDTH_OFFSET- PADDLE_OFFSET;
    resizeCanvas(canvw, canvh);
}

function render() {
    renderPaddles();
    renderBall();
    renderScore();
    renderFaces();
    updatePixels();
    //text("width: " + canvw + ", height: " + canvh, canvw / 2, canvh / 2);

    //drawMovingRect();
}

function renderBorder() {
    noFill();
    stroke(255, borderAlpha);
    if (borderAlpha < 255) borderAlpha += 2;
    strokeWeight(10);
    rect(canvw / 2, canvh / 2, canvw - WIDTH_OFFSET * 2, canvh - HEIGHT_OFFSET * 2);
}
function renderPaddles() {

    noStroke();
    players.forEach(p => {
        if (p.active)
            fill(255);
        else
            fill(160);
        rect(p.x, p.y, pw, ph);
    })
}

function updatePlayerTargetY(playerNum, y) {
    if (playerNum > players.length) return;
    players[playerNum - 1].targetY = y;
}

function tickPaddles() {
    data.forEach((obj) => {
        let coords = getBoxCenter(toBoxObj(obj.bbox));
        if (obj.class == 1) {
            updatePlayerTargetY(coords.x < canvw / 2 ? 1 : 2, coords.y);
            players[coords.x < canvw / 2 ? 0 : 1].active = true;
        } else if (obj.class == 2) {
            players[coords.x < canvw / 2 ? 0 : 1].active = false;
        }
    });

    players.forEach(p => {
        var dif = min(1, 0.5 + Math.abs(p.targetY - p.y) / canvh);

        if (p.y < p.targetY - TOLERANCE) {
            p.vy += PLAYER_ACCEL;
        } else if (p.y > p.targetY + TOLERANCE) {
            p.vy -= PLAYER_ACCEL;
        }
        p.vy *= dif;
        p.y += p.vy;

        if (p.y - ph / 2 < HEIGHT_OFFSET) p.y = HEIGHT_OFFSET + ph / 2;
        if (p.y + ph / 2 > canvh - HEIGHT_OFFSET) p.y = canvh - HEIGHT_OFFSET - ph / 2;
    })
}

function drawMovingRect() {
    if (!data) return;
    noFill();
    strokeWeight(2);
    data.forEach((obj) => {
        box = toBoxObj(obj.bbox);
        stroke(obj.score);
        rect(box.x, box.y, box.w, box.h);
    });
}


function tickBall() {
    if (!ball) return;
    if (ball.prevPositions.length > 10) ball.prevPositions.pop();
    ball.prevPositions.unshift({ x: ball.x, y: ball.y });
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.y - ball.h <= HEIGHT_OFFSET || ball.y + ball.h >= canvh - HEIGHT_OFFSET) ball.vy *= -1;
    //left right wall collision not necessary
    //if (ball.x - ball.w / 2 <= 0 || ball.x + ball.w / 2 >= canvw) ball.vx *= -1;

    //handle collision with both paddles
    players.forEach(p => {
        if (ball.y > p.y - ph / 2 && ball.y < p.y + ph / 2) {
            if (ball.x > p.x - pw / 2 && ball.x < p.x + pw / 2) {
                ball.vx = -ball.vx;
                ball.x+=ball.vx;
            }
        }
    });

}

function renderBall() {
    fill(255, borderAlpha);
    rect(ball.x, ball.y, ball.w, ball.h);

    var alpha = 100;
    ball.prevPositions.forEach(pos => {
        fill(255, alpha);
        rect(pos.x, pos.y, ball.w, ball.h);
        alpha -= 10;
    })
}

function tickScore() {
    if (ball.x < WIDTH_OFFSET) {
        p2.score++;
        reset();
    }
    if (ball.x > canvw - WIDTH_OFFSET) {
        p1.score++;
        reset();
    }
}

function reset() {
    if (p1.score >= 5 || p2.score >= 5) {
        gamestate = 2;
        borderAlpha = 0;
    } else {
        p1s = p1.score;
        p2s = p2.score;
        initVars();
        p1.score = p1s;
        p2.score = p2s;
    }
}


function renderScore() {
    fill(255);
    textSize(TEXT_SIZE);
    textStyle(BOLD);
    text(p1.score, WIDTH_OFFSET / 2 + canvw * SCORE_OFFSET / 100, HEIGHT_OFFSET + canvh * SCORE_OFFSET / 100);
    text(p2.score, -WIDTH_OFFSET / 2 + canvw - (canvw * SCORE_OFFSET / 100), HEIGHT_OFFSET + canvh * SCORE_OFFSET / 100);

}

function renderFaces() {
    if (!face1) return;
    var scaleFactor = (canvh/6)/image.height;
    image(face1, canvw/2-WIDTH_OFFSET*3, HEIGHT_OFFSET + canvh * SCORE_OFFSET / 100, image.width*scaleFactor,canvh/6);
    if (!face2) return;
    image(face2, canvw/2+WIDTH_OFFSET*3, HEIGHT_OFFSET + canvh * SCORE_OFFSET / 100, image.width*scaleFactor, canvh/6);
}



function countGestureOfType(typeNum) {
    if (!data) return;
    let numClosed = 0;
    data.forEach(obj => {
        if (obj.class === typeNum) numClosed++;
    });
    return numClosed;
}
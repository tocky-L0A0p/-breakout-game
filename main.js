var canvas = document.getElementById("myCanvas");
//2D描画コンテキスト
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
// 円周
var ballRadius = 5;
// ゲームオーバ用
var interval
// パドル用
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
// 操作用
var rightPressed = false;
var leftPressed = false;
// ブロック用
var brickRowCount = 5;
var brickColumnCount = 7;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
// スコア用
var score = 0;
// ライフ処理
var lives = 3;

// ブロック用
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function main(isgame) {
    console.log(isgame);
    if ( isgame == 'start' ) {
        console.log("start");
        // キーボードが押されているかどうか
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        interval = setInterval(draw, 10);
    } else if( isgame == 'stop' ) {
        console.log("stop");
        clearInterval(interval);
    } else if( isgame == 'restart' ) {
        console.log("restart");
        document.location.reload();
    }
}

//パドルの操作（キーボードを押したとき）
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

//パドルの操作（キーボードを離したとき）
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function paddleandler() {
    // キーボードを押したとき左右に動く処理
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

// 衝突検出
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            // すでにボールが当たっていたら衝突させない
            if(b.status == 1) {
                // ボールのx座標がブロックのx座標より大きい
                // ボールのx座標がブロックのx座標とその幅の和より小さい
                // ボールのx座標がブロックのx座標とその幅の和より小さい
                // ボールのy座標がブロックのy座標とその高さの和より小さい
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    // ブロクを壊すごとにスコアを上げる
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBall() {
    // 描画コード
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
    
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            if(bricks[c][r].status == 1) {
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ブロック描画
    drawBricks();
    // ボール描画
    drawBall();
    //パドル描画
    drawPaddle();
    // スコア処理
    drawScore();
    // ライフ
    drawLives();
    // 衝突検出
    collisionDetection();

    // バウンド処理
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        // 底を打ったときゲームオーバ
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
        } else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
                clearInterval(interval);
            }
        }
    }
    x += dx;
    y += dy;
    
    //  パドル操作
    paddleandler()
}
/* ==========================================================
   Page2 main.js
   ページ2制御
========================================================== */

/* ----------------------------------------------------------
   定数
---------------------------------------------------------- */

// 制限時間（5分）
const TOTAL_SECONDS = 5 * 60;

// 正解コード
const SUCCESS_WIRE = "blue";

// 切断後画像
const CUT_IMAGES = {
    red: "images/cut_red.webp",
    orange: "images/cut_orange.webp",
    yellow: "images/cut_yellow.webp",
    green: "images/cut_green.webp",
    cyan: "images/cut_cyan.webp",
    blue: "images/cut_blue.webp",
    purple: "images/cut_purple.webp"
};

// 表示名
const WIRE_NAME = {
    red: "赤",
    orange: "橙",
    yellow: "黄",
    green: "緑",
    cyan: "水色",
    blue: "青",
    purple: "紫"
};


/* ----------------------------------------------------------
   状態
---------------------------------------------------------- */

let remainingSeconds = TOTAL_SECONDS;
let timerRunning = true;
let timerInterval = null;
let selectedWire = null;
let actionLocked = false;


/* ----------------------------------------------------------
   DOM
---------------------------------------------------------- */

const timerDisplay = document.getElementById("timerDisplay");

const redOverlay = document.getElementById("redOverlay");

const message = document.getElementById("message");

const confirmOverlay = document.getElementById("confirmOverlay");
const confirmText = document.getElementById("confirmText");

const cancelBtn = document.getElementById("cancelBtn");
const cutBtn = document.getElementById("cutBtn");

const cutImageOverlay = document.getElementById("cutImageOverlay");
const cutImage = document.getElementById("cutImage");

const successScreen = document.getElementById("successScreen");

const gameOverScreen = document.getElementById("gameOverScreen");

const wireButtons = document.querySelectorAll(".wireBtn");


/* ==========================================================
   初期化
========================================================== */

window.addEventListener("load", () => {

    updateTimer();

    startTimer();

});


/* ==========================================================
   タイマー
========================================================== */

function startTimer(){

    timerInterval = setInterval(() => {

        if(!timerRunning) return;

        remainingSeconds--;

        if(remainingSeconds <= 60){

            redOverlay.classList.add("warningFlash");

        }

        if(remainingSeconds <= 0){

            remainingSeconds = 0;

            updateTimer();

            timerRunning = false;

            clearInterval(timerInterval);

            gameOver();

            return;

        }

        updateTimer();

    },1000);

}

function updateTimer(){

    const min = Math.floor(remainingSeconds / 60);
    const sec = remainingSeconds % 60;

    timerDisplay.textContent =
        String(min).padStart(2,"0") +
        ":" +
        String(sec).padStart(2,"0");

}


/* ==========================================================
   コード選択
========================================================== */

wireButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        if(actionLocked) return;

        selectedWire = button.dataset.wire;

        confirmText.textContent =
            WIRE_NAME[selectedWire] + "色のコードを切りますか？";

        confirmOverlay.classList.remove("hidden");

    });

});


/* ==========================================================
   キャンセル
========================================================== */

cancelBtn.addEventListener("click",()=>{

    confirmOverlay.classList.add("hidden");

    selectedWire = null;

});


/* ==========================================================
   切断
========================================================== */

cutBtn.addEventListener("click",()=>{

    if(!selectedWire) return;

    actionLocked = true;

    confirmOverlay.classList.add("hidden");

    cutImage.src = CUT_IMAGES[selectedWire];

    cutImageOverlay.classList.remove("hidden");

    setTimeout(()=>{

        cutImageOverlay.classList.add("hidden");

        executeResult(selectedWire);

    },3000);

});


/* ==========================================================
   結果
========================================================== */

function executeResult(color){

    if(color === SUCCESS_WIRE){

        success();

    }else{

        failure();

    }

}


/* ==========================================================
   成功
========================================================== */

function success(){

    timerRunning = false;

    clearInterval(timerInterval);

    redOverlay.classList.remove("warningFlash");

    timerDisplay.textContent = "--:--";

    showMessage("Buone vacanze！");

    setTimeout(()=>{

        successScreen.classList.remove("hidden");

    },1000);

}


/* ==========================================================
   失敗
========================================================== */

function failure(){

    gameOver();

}


/* ==========================================================
   ゲームオーバー
========================================================== */

function gameOver(){

    timerRunning = false;

    clearInterval(timerInterval);

    redOverlay.classList.remove("warningFlash");

    redOverlay.style.opacity = "1";

    gameOverScreen.classList.remove("hidden");

}


/* ==========================================================
   メッセージ
========================================================== */

function showMessage(text){

    message.textContent = text;

    message.classList.add("show");

    setTimeout(()=>{

        message.classList.remove("show");

    },3000);

}


/* ==========================================================
   キーボード無効
========================================================== */

document.addEventListener("keydown",(event)=>{

    event.preventDefault();

});
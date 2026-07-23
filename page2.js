/* ==========================================================
   Page2 main.js
   ページ2制御
========================================================== */

/* ----------------------------------------------------------
   定数
---------------------------------------------------------- */

// 制限時間（5分）
const TOTAL_SECONDS = 5 * 60;

const RESET_TIME = new Date(2026, 6, 24, 15, 50, 0).getTime();

// 正解コード
const SUCCESS_WIRE = "yellow";

// 切断後画像
const CUT_IMAGES = {
    red: "images/cut_red.png",
    orange: "images/cut_orange.png",
    yellow: "images/cut_yellow.png",
    green: "images/cut_green.png",
    cyan: "images/cut_cyan.png",
    blue: "images/cut_blue.png",
    purple: "images/cut_purple.png"
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

let deadline;

// 保存済みの終了時刻を取得
const savedDeadline = localStorage.getItem("page2Deadline");

if(savedDeadline){

    deadline = Number(savedDeadline);

}else{

    deadline = Date.now() + TOTAL_SECONDS * 1000;

    localStorage.setItem("page2Deadline", deadline);

}


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
   
    // 15:50を過ぎたら記録を削除
    if(Date.now() >= RESET_TIME){

        localStorage.removeItem("page2Deadline");
        localStorage.removeItem("page2GameOver");

    }

    // ゲームオーバー記録があるなら即終了
    if(localStorage.getItem("page2GameOver")){

        gameOver();

        return;

    }

    const remainingSeconds =
        Math.max(
            0,
            Math.floor((deadline - Date.now()) / 1000)
        );

    updateTimer(remainingSeconds);

    startTimer();

});


/* ==========================================================
   タイマー
========================================================== */

function startTimer(){

    timerInterval = setInterval(() => {

        if(!timerRunning) return;

        const remainingSeconds =
            Math.max(
                0,
                Math.floor((deadline - Date.now()) / 1000)
            );

        if(remainingSeconds <= 60){

            redOverlay.classList.add("warningFlash");

        }

        updateTimer(remainingSeconds);

        if(remainingSeconds <= 0){

            timerRunning = false;

            clearInterval(timerInterval);

            gameOver();

        }

    },1000);

}

function updateTimer(remainingSeconds){

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
            WIRE_NAME[selectedWire] + "のコードを切りますか？";

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
   
    localStorage.removeItem("page2Deadline");

    localStorage.removeItem("page2GameOver");

    timerRunning = false;

    clearInterval(timerInterval);

    redOverlay.classList.remove("warningFlash");

    timerDisplay.textContent = "(*˃ᴗ˂⁎)";

    showMessage("爆弾の無力化に成功しました");

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

    localStorage.setItem("page2GameOver","true");

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

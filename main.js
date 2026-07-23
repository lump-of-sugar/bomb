/* ==========================================================
   Page1 main.js
   ページ1制御
========================================================== */

/* ----------------------------------------------------------
   定数
---------------------------------------------------------- */

// 正解パスワード
const PASSWORD = "ESTATE";

// カウントダウン開始日時
const START_TIME = new Date(2026, 6, 23, 22, 30, 0);

// 終了日時（2026年7月24日15:50）
const DEADLINE = new Date(2026, 6, 24, 15, 50, 0);

// タイマー状態
let timerRunning = true;

// タイマーID
let timerInterval = null;


/* ----------------------------------------------------------
   DOM取得
---------------------------------------------------------- */

const timerDisplay = document.getElementById("timerDisplay");
const passwordInput = document.getElementById("passwordInput");

const keypadOverlay = document.getElementById("keypadOverlay");
const keysContainer = document.getElementById("keys");

const message = document.getElementById("message");

const redOverlay = document.getElementById("redOverlay");

const gameOverScreen = document.getElementById("gameOverScreen");

const closeKeypad = document.getElementById("closeKeypad");
const backspaceBtn = document.getElementById("backspaceBtn");
const clearBtn = document.getElementById("clearBtn");
const enterBtn = document.getElementById("enterBtn");


/* ==========================================================
   初期化
========================================================== */

window.addEventListener("load", () => {

    createKeyboard();

    const now = new Date();

    const now = new Date();

    let remainingSeconds;

    if (now < START_TIME) {

        remainingSeconds = 50 * 60;

    } else {

        remainingSeconds =
            Math.max(0, Math.floor((DEADLINE - now) / 1000));

    }

    updateTimerDisplay(remainingSeconds);

    startTimer();

});


/* ==========================================================
   タイマー
========================================================== */

function startTimer() {

    timerInterval = setInterval(() => {

        if (!timerRunning) return;

        const now = new Date();

        let remainingSeconds;

        if (now < START_TIME) {

            remainingSeconds = 50 * 60;

        } else {

            remainingSeconds =
                Math.floor((DEADLINE - now) / 1000);

        }

        if (remainingSeconds <= 0) {

            remainingSeconds = 0;

            updateTimerDisplay(remainingSeconds);

            timerRunning = false;

            clearInterval(timerInterval);

            gameOver();

            return;
        }

        updateTimerDisplay(remainingSeconds);

    }, 1000);

}

function updateTimerDisplay(remainingSeconds) {

    const min = Math.floor(remainingSeconds / 60);
    const sec = remainingSeconds % 60;

    timerDisplay.textContent =
        String(min).padStart(2, "0") +
        ":" +
        String(sec).padStart(2, "0");

}


/* ==========================================================
   キーパッド生成
========================================================== */

function createKeyboard() {

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let letter of alphabet) {

        const button = document.createElement("button");

        button.className = "keyButton";

        button.textContent = letter;

        button.addEventListener("click", () => {

            if (passwordInput.value.length >= 6) return;

            passwordInput.value += letter;

        });

        keysContainer.appendChild(button);

    }

}


/* ==========================================================
   キーパッド表示
========================================================== */

passwordInput.addEventListener("click", () => {

    keypadOverlay.classList.remove("hidden");

});

closeKeypad.addEventListener("click", () => {

    keypadOverlay.classList.add("hidden");

});


/* ==========================================================
   キーパッド操作
========================================================== */

backspaceBtn.addEventListener("click", () => {

    passwordInput.value =
        passwordInput.value.slice(0, -1);

});

clearBtn.addEventListener("click", () => {

    passwordInput.value = "";

});

enterBtn.addEventListener("click", checkPassword);


/* ==========================================================
   パスワード判定
========================================================== */

function checkPassword() {

    const input = passwordInput.value.toUpperCase();

    if (input === PASSWORD) {

        success();

    } else {

        failure();

    }

}


/* ==========================================================
   正解
========================================================== */

function success() {

    timerRunning = false;

    clearInterval(timerInterval);

    keypadOverlay.classList.add("hidden");

    showMessage("時限装置が解除されました");

    setTimeout(() => {

        window.location.href = "page2.html";

    }, 3000);

}


/* ==========================================================
   不正解
========================================================== */

function failure() {

    showMessage("パスワードが違います");

    passwordInput.value = "";

    redOverlay.classList.remove("flashError");

    void redOverlay.offsetWidth;

    redOverlay.classList.add("flashError");

}


/* ==========================================================
   メッセージ表示
========================================================== */

function showMessage(text) {

    message.textContent = text;

    message.classList.add("show");

    setTimeout(() => {

        message.classList.remove("show");

    }, 3000);

}


/* ==========================================================
   ゲームオーバー
========================================================== */

function gameOver() {

    redOverlay.classList.remove("warningFlash");

    redOverlay.style.opacity = "1";

    gameOverScreen.classList.remove("hidden");

}


/* ==========================================================
   キーボード操作禁止
========================================================== */

document.addEventListener("keydown", (event) => {

    event.preventDefault();

});


/* ==========================================================
   コピー・貼り付け禁止
========================================================== */

passwordInput.addEventListener("paste", (e) => {

    e.preventDefault();

});

passwordInput.addEventListener("copy", (e) => {

    e.preventDefault();

});

passwordInput.addEventListener("cut", (e) => {

    e.preventDefault();

});

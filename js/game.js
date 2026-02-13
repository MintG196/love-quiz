let currentQuestion = 0;
let isMusicPlaying = true;
let correctCount = 0;
let musicStarted = false;

// ================= SOUND EFFECTS =================
const correctSound = new Audio("assets/music/correct.wav");
const incorrectSound = new Audio("assets/music/incorrect.wav");
correctSound.volume = 0.6;
incorrectSound.volume = 0.6;

// ================= INTRO & MUSIC =================
const introScreen = document.getElementById("intro-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("music-toggle");

bgMusic.volume = 0.5;
musicToggle.innerText = "🔊";

function startMusicOnUserInteraction() {
  if (!musicStarted) {
    bgMusic.play().catch(() => {});
    musicStarted = true;
    document.removeEventListener("click", startMusicOnUserInteraction);
    document.removeEventListener("touchstart", startMusicOnUserInteraction);
  }
}

document.addEventListener("click", startMusicOnUserInteraction);
document.addEventListener("touchstart", startMusicOnUserInteraction);

startBtn.addEventListener("click", () => {
  introScreen.classList.remove("active");
  messageScreen.classList.add("active");

  chatContainer.innerHTML = "";
  chatIndex = 0;

  addChatBubble(chats[chatIndex]);
  chatIndex++;

  bgMusic.play().catch(() => {});
});

musicToggle.addEventListener("click", () => {
  if (isMusicPlaying) {
    bgMusic.pause();
    musicToggle.innerText = "🔇";
  } else {
    bgMusic.play();
    musicToggle.innerText = "🔊";
  }
  isMusicPlaying = !isMusicPlaying;
});

// ================= ELEMENTS =================
const questionEl = document.getElementById("question");
const answersEl = document.querySelector(".answers");
const avatar = document.getElementById("avatar");
const progressEl = document.getElementById("progress");

const resultScreen = document.getElementById("result-screen");
const resultImg = document.getElementById("resultImg");
const resultText = document.getElementById("resultText");

const messageScreen = document.getElementById("message-screen");
const chatContainer = document.getElementById("chat-container");
const chatNextBtn = document.getElementById("chat-next-btn");

const chats = [
  "Chào em 💖",
  "Anh làm trò chơi nhỏ này cho em nè.",
  "Không phải để thử thách đâu 😅",
  "Chỉ mong em mỉm cười khi chơi thôi 😊",
  "Giờ mình bắt đầu nhé? 💕",
];

let chatIndex = 0;

// ================= START GAME =================
function startGame() {
  if (
    typeof questions === "undefined" ||
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    questionEl.innerHTML =
      "Lỗi: Không có câu hỏi. Kiểm tra file js/questions.js";
    return;
  }

  currentQuestion = 0;
correctCount = 0;

// Reset Love Meter về 0%
progressEl.innerHTML = `
  <div style="margin-bottom:5px;">❤️ Love Meter: 0%</div>
  <div style="
    width:160px;
    height:12px;
    background:#ffd6e0;
    border-radius:10px;
    overflow:hidden;
    margin:0 auto;
  ">
    <div style="
      width:0%;
      height:100%;
      background:linear-gradient(90deg,#ff4d6d,#ff8fae);
    "></div>
  </div>
`;

loadQuestion();

}

// ================= TYPE EFFECT =================
function typeText(element, text, speed = 35, callback) {
  element.innerHTML = "";
  let i = 0;

  const interval = setInterval(() => {
    element.appendChild(document.createTextNode(text.charAt(i)));
    i++;

    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

// ================= LOAD QUESTION =================
function loadQuestion() {
  const q = questions[currentQuestion];

  avatar.src = "assets/images/avatar/thinking.png";

  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  answersEl.style.pointerEvents = "none";
  answersEl.style.opacity = "0";

  // Nếu câu hỏi có HTML (ví dụ có ảnh)
  if (q.question.includes("<")) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = q.question;

    const img = tempDiv.querySelector("img");
    const text = tempDiv.textContent.trim();

    if (img) {
      questionEl.appendChild(img);
    }

    const textContainer = document.createElement("div");
    questionEl.appendChild(textContainer);

    typeText(textContainer, text, 40, showAnswers);
  } else {
    typeText(questionEl, q.question, 40, showAnswers);
  }
}

// ================= SHOW ANSWERS =================
function showAnswers() {
  const q = questions[currentQuestion];

  answersEl.innerHTML = "";
  answersEl.style.pointerEvents = "none";
  answersEl.style.opacity = "1";

  if (q.answers.length === 2) {
    answersEl.className = "answers two";
  } else {
    answersEl.className = "answers four";
  }

  let index = 0;

  function showNextAnswer() {
    if (index >= q.answers.length) {
      answersEl.style.pointerEvents = "auto";
      return;
    }

    const btn = document.createElement("button");
    btn.innerHTML = q.answers[index];

    btn.style.opacity = "0";
    btn.style.transform = "translateY(10px)";
    btn.style.transition = "all 0.3s ease";

    const answerIndex = index; // 👈 FIX

    btn.addEventListener("click", () => {
      handleAnswer(answerIndex);
    });

    answersEl.appendChild(btn);

    setTimeout(() => {
      btn.style.opacity = "1";
      btn.style.transform = "translateY(0)";
    }, 50);

    index++;
    setTimeout(showNextAnswer, 180);
  }

  showNextAnswer();
}

// ================= HANDLE ANSWER =================
function handleAnswer(selectedIndex) {
  const q = questions[currentQuestion];
  const isCorrect = selectedIndex === q.correct;

  // Love meter tăng mỗi câu, không phụ thuộc đúng sai
  updateProgress();

  showResult(isCorrect);
}


// ================= RESULT =================
function showResult(isCorrect) {
  resultScreen.classList.remove("hidden");

  if (isCorrect) {
    correctSound.currentTime = 0;
    correctSound.play().catch(() => {});
    resultImg.src = "assets/images/avatar/happy.png";
    resultText.innerText = "Đúng ùi, toá giỏi lunnnn 💖";
  } else {
    incorrectSound.currentTime = 0;
    incorrectSound.play().catch(() => {});
    resultImg.src = "assets/images/avatar/sad.png";
    resultText.innerText = "Ui tiếc quớ, sai mất ùi 🥺";
  }

  setTimeout(() => {
    resultScreen.classList.add("hidden");
    nextQuestion();
  }, 1500);
}

// ================= NEXT =================
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    endGame();
  }
}

function updateProgress() {
  const percent = Math.round(((currentQuestion + 1) / questions.length) * 100);

  progressEl.innerHTML = `
    <div style="margin-bottom:5px;">❤️ Love Meter: ${percent}%</div>
    <div style="
      width:160px;
      height:12px;
      background:#ffd6e0;
      border-radius:10px;
      overflow:hidden;
      margin:0 auto;
    ">
      <div style="
        width:${percent}%;
        height:100%;
        background:linear-gradient(90deg,#ff4d6d,#ff8fae);
        transition:width 0.4s ease;
      "></div>
    </div>
  `;

  // Khi đầy 100%
  if (percent === 100) {
    setTimeout(() => {
      progressEl.innerHTML += `
        <div style="margin-top:6px;font-size:14px;">
          💖 Full yêu rồi nèeee 💕
        </div>
      `;
    }, 300);
  }
}

// ================= CHAT =================
function addChatBubble(text) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble me";
  bubble.textContent = text;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

chatNextBtn.addEventListener("click", () => {
  if (chatIndex < chats.length) {
    addChatBubble(chats[chatIndex]);
    chatIndex++;
  } else {
    messageScreen.classList.remove("active");
    gameScreen.classList.add("active");
    startGame();
  }
});

// ================= END =================
function endGame() {
  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  avatar.src = "assets/images/avatar/happy.png";

  showLoveQuestion(); // Hiện câu đặc biệt trước
}


function showLoveQuestion() {
  questionEl.innerHTML = "Em có yêu anh không? 💌";
  answersEl.innerHTML = "";
  answersEl.className = "answers";
  answersEl.style.position = "relative";
  answersEl.style.height = "150px";

  // Tạo nút Có
  const yesBtn = document.createElement("button");
  yesBtn.innerText = "Có 💖";
  yesBtn.style.position = "absolute";
  yesBtn.style.left = "20%";
  yesBtn.style.top = "50%";
  yesBtn.style.transform = "translate(-50%, -50%)";
  yesBtn.style.transition = "all 0.3s ease";

  // Tạo nút Không
  const noBtn = document.createElement("button");
  noBtn.innerText = "Không 😝";
  noBtn.style.position = "absolute";
  noBtn.style.left = "70%";
  noBtn.style.top = "50%";
  noBtn.style.transform = "translate(-50%, -50%)";
  noBtn.style.transition = "all 0.2s ease";

  answersEl.appendChild(yesBtn);
  answersEl.appendChild(noBtn);

  let yesScale = 1;

  // Khi bấm Không
  noBtn.addEventListener("click", () => {
  const containerRect = answersEl.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  const maxX = containerRect.width - btnWidth;
  const maxY = containerRect.height - btnHeight;

  let newX, newY;
  let safeDistance = 120; // khoảng cách tối thiểu tránh nút Có

  do {
    newX = Math.random() * maxX;
    newY = Math.random() * maxY;

    // Tính vị trí giả lập của nút Không
    const fakeNoRect = {
      left: containerRect.left + newX,
      top: containerRect.top + newY,
      right: containerRect.left + newX + btnWidth,
      bottom: containerRect.top + newY + btnHeight,
    };

    var overlap =
      !(fakeNoRect.right < yesRect.left ||
        fakeNoRect.left > yesRect.right ||
        fakeNoRect.bottom < yesRect.top ||
        fakeNoRect.top > yesRect.bottom);

  } while (overlap);

  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";

  // Nút Có to dần
  yesScale += 0.2;
  yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
});


  // Khi bấm Có
 yesBtn.addEventListener("click", () => {
  questionEl.innerHTML = "";
  answersEl.innerHTML = "";

  typeText(questionEl, "Anh biết mà 😚", 40, () => {
    setTimeout(() => {
      // Hiện endingMessage, sau đó hiện nút Tiếp
      typeText(questionEl, endingMessage, 35, () => {
        // Thêm nút Tiếp
        const nextBtn = document.createElement("button");
        nextBtn.innerText = "Tiếp ➡️";
        nextBtn.style.marginTop = "30px";
        nextBtn.style.fontSize = "1.1rem";
        nextBtn.style.padding = "10px 32px";
        nextBtn.style.background = "#ffb6c1";
        nextBtn.style.border = "none";
        nextBtn.style.borderRadius = "12px";
        nextBtn.style.color = "#fff";
        nextBtn.style.cursor = "pointer";
        nextBtn.style.boxShadow = "0 2px 8px #ffb6c1a0";
        nextBtn.style.transition = "background 0.2s";
        nextBtn.onmouseover = () => nextBtn.style.background = "#ff4f81";
        nextBtn.onmouseout = () => nextBtn.style.background = "#ffb6c1";
        nextBtn.onclick = () => {
          if (typeof showEndingScene === 'function') showEndingScene();
        };
        questionEl.appendChild(document.createElement("br"));
        questionEl.appendChild(nextBtn);
      });
    }, 800);
  });
});

}


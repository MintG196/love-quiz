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
  answersEl.style.height = "300px"; // Tăng chiều cao vùng chứa để nút Không có chỗ chạy

  // --- HÀM TẠO STYLE RIÊNG CHO NÚT (ĐỂ NÓ NHỎ LẠI) ---
  function makeButtonSmall(btn) {
    btn.style.width = "auto"; // Không chiếm hết chiều ngang
    btn.style.minWidth = "100px"; // Đủ nhỏ
    btn.style.padding = "8px 15px"; // Padding nhỏ lại
    btn.style.fontSize = "1.2rem"; // Chữ vừa phải
    btn.style.position = "absolute";
    btn.style.transition = "all 0.2s ease"; // Chuyển động mượt
  }

  // Tạo nút Có
  const yesBtn = document.createElement("button");
  yesBtn.innerText = "Có 💖";
  makeButtonSmall(yesBtn); // Áp dụng style nhỏ
  
  // Vị trí ban đầu của nút Có (Cố định 1 chỗ)
  yesBtn.style.left = "40%"; 
  yesBtn.style.top = "50%";
  yesBtn.style.transform = "translate(-50%, -50%)";
  yesBtn.style.zIndex = "100"; // Luôn nổi lên trên

  // Tạo nút Không
  const noBtn = document.createElement("button");
  noBtn.innerText = "Không 😝";
  makeButtonSmall(noBtn); // Áp dụng style nhỏ
  
  // Vị trí ban đầu của nút Không
  noBtn.style.left = "70%";
  noBtn.style.top = "50%";
  noBtn.style.transform = "translate(-50%, -50%)";
  noBtn.style.zIndex = "50";

  answersEl.appendChild(yesBtn);
  answersEl.appendChild(noBtn);

  let yesScale = 1;
  let noClickCount = 0;

  // Xử lý khi bấm nút Không
  noBtn.addEventListener("click", () => {
    noClickCount++;

    // 1. Nút Có to ra (nhưng to chậm thôi để đỡ che màn hình)
    yesScale += 0.2; 
    yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;

    // 2. Xử lý nút Không biến mất sau 3 lần
    if (noClickCount >= 3) {
      noBtn.style.display = "none";
    } else {
      // Bé dần đi
      const currentNoScale = 1 - (noClickCount * 0.2);
      noBtn.style.transform = `translate(0, 0) scale(${currentNoScale})`; // Reset translate để tính toán vị trí cho dễ

      // --- LOGIC DI CHUYỂN KHÔNG BỊ TRÙNG (QUAN TRỌNG) ---
      const containerRect = answersEl.getBoundingClientRect();
      const yesRect = yesBtn.getBoundingClientRect(); // Lấy kích thước hiện tại của nút Có (đã bao gồm scale)
      const btnWidth = noBtn.offsetWidth;
      const btnHeight = noBtn.offsetHeight;

      let newLeft, newTop;
      let isOverlapping = true;
      let attempts = 0;

      // Vòng lặp tìm vị trí mới (Thử 50 lần, nếu không tìm được thì thôi chấp nhận đè để đỡ lag)
      while (isOverlapping && attempts < 50) {
        attempts++;

        // Random vị trí trong khung
        newLeft = Math.random() * (containerRect.width - btnWidth);
        newTop = Math.random() * (containerRect.height - btnHeight);

        // Tính toán vị trí của nút Không "giả định" trên màn hình
        const noRect = {
          left: containerRect.left + newLeft,
          right: containerRect.left + newLeft + btnWidth,
          top: containerRect.top + newTop,
          bottom: containerRect.top + newTop + btnHeight
        };

        // Kiểm tra xem hình chữ nhật của nút Không có đè lên nút Có không?
        // (Cộng thêm 20px khoảng cách an toàn - margin)
        const safetyMargin = 20;
        const overlap = !(
            noRect.right < yesRect.left - safetyMargin || 
            noRect.left > yesRect.right + safetyMargin || 
            noRect.bottom < yesRect.top - safetyMargin || 
            noRect.top > yesRect.bottom + safetyMargin
        );

        if (!overlap) {
          isOverlapping = false; // Tìm được chỗ trống rồi!
        }
      }

      // Gán vị trí mới
      noBtn.style.left = newLeft + "px";
      noBtn.style.top = newTop + "px";
    }
  });

  // Xử lý khi bấm nút Có (Giữ nguyên logic cũ nhưng style lại nút Tiếp cho đẹp)
  yesBtn.addEventListener("click", () => {
    questionEl.innerHTML = "";
    answersEl.innerHTML = "";

    typeText(questionEl, "Anh biết mà 😚", 50, () => {
      setTimeout(() => {
        typeText(questionEl, endingMessage, 35, () => {
          // Thêm nút Tiếp
          const nextBtn = document.createElement("button");
          nextBtn.innerText = "Tiếp ➡️";
          nextBtn.style.marginTop = "30px";
          nextBtn.style.fontSize = "1.1rem";
          nextBtn.style.padding = "10px 32px";
          
          // Style 3D giống các nút khác
          nextBtn.style.background = "#ffb6c1";
          nextBtn.style.border = "4px solid #fff";
          nextBtn.style.borderRadius = "12px";
          nextBtn.style.color = "#fff";
          nextBtn.style.cursor = "pointer";
          nextBtn.style.boxShadow = "0 6px 0 #c22f55"; 
          nextBtn.style.transition = "transform 0.1s";
          
          nextBtn.onmouseover = () => nextBtn.style.background = "#ff4f81";
          nextBtn.onmouseout = () => nextBtn.style.background = "#ffb6c1";
          nextBtn.onmousedown = () => {
             nextBtn.style.transform = "translateY(4px)";
             nextBtn.style.boxShadow = "0 2px 0 #c22f55";
          };
          
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
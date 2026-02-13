let currentQuestion = 0;
let isMusicPlaying = true;
let correctCount = 0;
let musicStarted = false;

// ================= SOUND EFFECTS =================
const correctSound = new Audio("assets/music/correct.wav");
const incorrectSound = new Audio("assets/music/incorrect.wav");
correctSound.volume = 0.6;
incorrectSound.volume = 0.6;

// ================= ELEMENTS & MUSIC =================
const introScreen = document.getElementById("intro-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("music-toggle");

const messageScreen = document.getElementById("message-screen");
const chatContainer = document.getElementById("chat-container");
const chatNextBtn = document.getElementById("chat-next-btn");
const introAvatar = document.getElementById("intro-avatar");

const questionEl = document.getElementById("question");
const answersEl = document.querySelector(".answers");
const avatar = document.getElementById("avatar");
const progressEl = document.getElementById("progress");

const resultScreen = document.getElementById("result-screen");
const resultImg = document.getElementById("resultImg");
const resultText = document.getElementById("resultText");

bgMusic.volume = 0.5;
musicToggle.innerText = "🔊";

// --- CHUẨN HÓA VĂN BẢN (Dùng cho loại Input) ---
function cleanText(text) {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,\s]/g, "")
        .replace(/đ/g, "d")
        .trim();
}

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

// ================= CHAT INTRO LOGIC =================
const chats = [
  { text: "Chào em 💖", img: "thinking" },
  { text: "Anh làm trò chơi nhỏ này cho em nè.", img: "khoanhtay" },
  { text: "Không phải để thử thách đâu 😅", img: "happy1" },
  { text: "Chỉ mong em mỉm cười khi chơi thôi 😊", img: "happy1" },
  { text: "Giờ mình bắt đầu nhé? 💕", img: "heart" }
];

let chatIndex = 0;

function addChatBubble(text) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble me";
  bubble.textContent = text;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function updateIntroAvatar(imgName) {
  if (introAvatar) {
    introAvatar.src = `assets/images/avatar/${imgName}.png`;
  }
}

startBtn.addEventListener("click", () => {
  introScreen.classList.remove("active");
  messageScreen.classList.add("active");
  chatContainer.innerHTML = "";
  chatIndex = 0;
  if (chats.length > 0) {
    const first = chats[0];
    addChatBubble(first.text);
    updateIntroAvatar(first.img);
    chatIndex = 1;
  }
  bgMusic.play().catch(() => {});
});

chatNextBtn.addEventListener("click", () => {
  if (chatIndex < chats.length) {
    const current = chats[chatIndex];
    addChatBubble(current.text);
    updateIntroAvatar(current.img);
    chatIndex++;
  } else {
    messageScreen.classList.remove("active");
    gameScreen.classList.add("active");
    startGame();
  }
});

// ================= GAME LOGIC =================
function startGame() {
  if (typeof questions === "undefined" || !Array.isArray(questions) || questions.length === 0) {
    questionEl.innerHTML = "Lỗi: Kiểm tra questions.js";
    return;
  }
  progressEl.style.display = "block"; 
  currentQuestion = 0;
  loadQuestion();
}

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

function loadQuestion() {
  const q = questions[currentQuestion];
  avatar.src = "assets/images/avatar/thinking.png";
  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  answersEl.style.opacity = "0";

  updateProgress();

  if (q.question.includes("<")) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = q.question;
    
    // --- [SỬA LỖI HIỂN THỊ NHIỀU ẢNH] ---
    const imgs = tempDiv.querySelectorAll("img");
    const imgContainer = document.createElement("div");
    imgContainer.style.display = "flex";
    imgContainer.style.justifyContent = "center";
    imgContainer.style.gap = "10px";
    imgContainer.style.flexWrap = "wrap";
    
    imgs.forEach(img => imgContainer.appendChild(img));
    questionEl.appendChild(imgContainer);

    const text = tempDiv.textContent.trim();
    const textContainer = document.createElement("div");
    textContainer.style.marginTop = "10px";
    questionEl.appendChild(textContainer);
    typeText(textContainer, text, 40, showAnswers);
  } else {
    typeText(questionEl, q.question, 40, showAnswers);
  }
}

function showAnswers() {
  const q = questions[currentQuestion];
  answersEl.innerHTML = "";
  answersEl.style.opacity = "1";
  answersEl.style.pointerEvents = "auto";

  if (q.type === "input") {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Nhập câu trả lời...";
    input.className = "pink-btn"; // Dùng tạm style nút hồng cho đồng bộ
    input.style.background = "white";
    input.style.color = "#333";
    input.style.width = "80%";
    input.style.cursor = "text";

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const userValue = input.value.trim();
        const correctAnswers = Array.isArray(q.correct) ? q.correct : [q.correct];
        const isMatch = correctAnswers.some(ans => cleanText(userValue) === cleanText(ans));
        handleAnswer(isMatch);
      }
    });
    answersEl.appendChild(input);
    input.focus();
  } else {
    if (q.answers.length === 2) answersEl.className = "answers two";
    else answersEl.className = "answers four";

    q.answers.forEach((ans, index) => {
      const btn = document.createElement("button");
      btn.innerHTML = ans;
      btn.className = "pixel-box";
      btn.onclick = () => handleAnswer(index);
      answersEl.appendChild(btn);
    });
  }
}

function handleAnswer(result) {
  const q = questions[currentQuestion];
  let isCorrect = (q.type === "input") ? result : (result === q.correct);
  showResult(isCorrect);
}

function showResult(isCorrect) {
  resultScreen.classList.remove("hidden");
  if (isCorrect) {
    correctSound.play().catch(() => {});
    resultImg.src = "assets/images/avatar/happy.png";
    resultText.innerText = "Đúng ùi, giỏi quá nà! 💖";
  } else {
    incorrectSound.play().catch(() => {});
    resultImg.src = "assets/images/avatar/sad.png";
    resultText.innerText = "Sai mất ùi, thử lại nhé... 🥺";
  }
  setTimeout(() => {
    resultScreen.classList.add("hidden");
    if (isCorrect) nextQuestion();
  }, 1500);
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) loadQuestion();
  else endGame();
}

function updateProgress() {
  const percent = Math.round((currentQuestion / questions.length) * 100);
  progressEl.innerHTML = `
    <div style="margin-bottom:5px;">❤️ Love Meter: ${percent}%</div>
    <div style="width:160px; height:12px; background:#ffd6e0; border-radius:10px; overflow:hidden; margin:0 auto;">
      <div style="width:${percent}%; height:100%; background:linear-gradient(90deg,#ff4d6d,#ff8fae); transition:width 0.4s ease;"></div>
    </div>
  `;
}

function endGame() {
  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  avatar.src = "assets/images/avatar/happy.png";
  showLoveQuestion();
}

function showLoveQuestion() {
    questionEl.innerHTML = "Em có yêu anh không? 💌";
    const yesBtn = document.createElement("button");
    yesBtn.innerText = "Có 💖";
    yesBtn.className = "pink-btn";
    
    yesBtn.onclick = () => {
        const meter = document.getElementById("progress");
        meter.classList.add("meter-to-center");
        setTimeout(() => {
            meter.classList.add("meter-morph");
            setTimeout(() => {
                meter.innerHTML = "💖";
                meter.classList.add("super-heart-beat");
                meter.onclick = () => {
                    meter.remove();
                    const soulHeart = document.createElement("div");
                    soulHeart.className = "flying-heart";
                    soulHeart.style.left = "50%"; soulHeart.style.top = "50%";
                    soulHeart.style.marginLeft = "-16px"; soulHeart.style.marginTop = "-16px";
                    document.body.appendChild(soulHeart);
                    setTimeout(() => showFinalMessage(), 1000);
                };
            }, 800);
        }, 800);
    };
    answersEl.appendChild(yesBtn);
}

function showFinalMessage() {
    const overlay = document.createElement("div");
    overlay.className = "message-overlay show";
    const paper = document.createElement("div");
    paper.className = "message-paper";
    paper.innerHTML = `<h2 style="color:#ff4f81;">Gửi em yêu 💌</h2><p>${endingMessage}</p>`;
    
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Tiếp theo ➡️";
    nextBtn.className = "pink-btn";
    nextBtn.onclick = () => {
        overlay.remove();
        showEndingScene();
    };
    paper.appendChild(nextBtn);
    overlay.appendChild(paper);
    document.body.appendChild(overlay);
}

function restartGame() {
    currentQuestion = 0;
    gameScreen.classList.remove("active");
    document.querySelectorAll(".message-overlay").forEach(el => el.remove());
    if (window._heartInterval) { clearInterval(window._heartInterval); window._heartInterval = null; }
    const heartsContainer = document.getElementById("hearts-container");
    if (heartsContainer) heartsContainer.remove();
    introScreen.classList.add("active");
}
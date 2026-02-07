let currentQuestion = 0;
let isMusicPlaying = false;
let correctCount = 0;
// ================= INTRO & MUSIC =================
const introScreen = document.getElementById("intro-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("music-toggle");

// Xử lý nút Start
startBtn.addEventListener("click", () => {
  introScreen.classList.remove("active");
  messageScreen.classList.add("active");

  chatContainer.innerHTML = "";
  chatIndex = 0;

  // Hiển thị ngay lời nhắn đầu tiên để không để trống phần chat
  addChatBubble(chats[chatIndex]);
  chatIndex++;

  // Phát nhạc khi người dùng tương tác
  bgMusic.volume = 0.5; // Âm lượng 50%
  bgMusic.play().catch(error => {
    console.log("Trình duyệt chặn autoplay, cần tương tác thêm để phát nhạc");
  });
  isMusicPlaying = true;
  musicToggle.innerText = "🔊";
});

// Xử lý nút Bật/Tắt nhạc
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
  "Giờ mình bắt đầu nhé? 💕"
];

let chatIndex = 0;


// ================= START GAME =================
function startGame() {
  // Validate questions data before starting (support const/let globals)
  if (typeof questions === 'undefined' || !Array.isArray(questions) || questions.length === 0) {
    questionEl.innerHTML = "Lỗi: Không có câu hỏi. Vui lòng kiểm tra file js/questions.js";
    console.error('questions is not defined or not an array / empty', typeof questions === 'undefined' ? undefined : questions);
    return;
  }

  currentQuestion = 0;
  correctCount = 0;

  updateProgress();
  loadQuestion();
}

// Hàm chạy chữ (Fix lỗi font pixel dính nhau + lỗi tràn khung)
function typeText(element, text, speed = 35, callback) {
  element.innerHTML = "";
  let i = 0;

  const interval = setInterval(() => {
    let char = text.charAt(i);
    
    // Nếu là dấu cách, thay bằng khoảng trắng HTML an toàn
    if (char === " ") {
      element.innerHTML += "&nbsp;"; 
    } else {
      element.innerHTML += char;
    }
    
    i++;

    // Cuộn xuống nếu text quá dài
    // element.scrollIntoView({ behavior: "smooth", block: "end" });

    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

// Hàm tự động shrink font size nếu text bị tràn (backup)
function autoShrinkText(element) {
  // Detect mobile vs desktop
  const isMobile = window.innerWidth <= 768;
  let fontSize = isMobile ? 14 : 24; // Mobile 14px, Desktop 24px
  const minFontSize = 12; // font size tối thiểu
  const container = element.parentElement; // khung chứa
  const maxHeight = container.clientHeight;

  element.style.fontSize = fontSize + "px";

  // Lặp giảm font size nếu text quá cao
  while (element.scrollHeight > maxHeight && fontSize > minFontSize) {
    fontSize--;
    element.style.fontSize = fontSize + "px";
  }
}

function loadQuestion() {
  let q;
  try {
    q = questions[currentQuestion];
    if (!q || !q.question || !Array.isArray(q.answers)) {
      throw new Error('Invalid question format at index ' + currentQuestion);
    }
  } catch (err) {
    console.error('Failed to load question:', err);
    questionEl.innerHTML = 'Lỗi khi tải câu hỏi. Mở console để xem chi tiết.';
    answersEl.innerHTML = '';
    return;
  }

  // reset avatar
  avatar.src = "assets/images/avatar/thinking.png";

  // clear question & answers
  questionEl.innerHTML = ""; // Dùng innerHTML cho sạch
  answersEl.innerHTML = "";

  // tạm khóa click
  answersEl.style.pointerEvents = "none";
  answersEl.style.opacity = "0";

  // chạy chữ câu hỏi
  typeText(questionEl, q.question, 40, () => {
    // Sau khi text chạy xong, tự động shrink font nếu text quá dài
    autoShrinkText(questionEl);
    
    // sau khi chữ chạy xong mới hiện đáp án
    q.answers.forEach((text, index) => {
      const btn = document.createElement("button");
      btn.innerText = text;

      btn.addEventListener("click", () => {
        handleAnswer(index);
      });

      answersEl.appendChild(btn);
    });

    // layout 2 hoặc 4 đáp án
    if (q.answers.length === 2) {
      answersEl.className = "answers two";
    } else {
      answersEl.className = "answers four";
    }

    // mở click + fade in
    answersEl.style.pointerEvents = "auto";
    answersEl.style.opacity = "1";
    answersEl.classList.add("fade");
  });
}

// ================= HANDLE ANSWER =================
function handleAnswer(selectedIndex) {
  const q = questions[currentQuestion];
  const isCorrect = selectedIndex === q.correct;

  if (isCorrect) {
    correctCount++;
    updateProgress();
  }

  showResult(isCorrect);
}


// ================= RESULT =================
function showResult(isCorrect) {
  resultScreen.classList.remove("hidden");

  if (isCorrect) {
    resultImg.src = "assets/images/avatar/happy.png";
    resultText.innerText = "Đúng rồi 💖";
  } else {
    resultImg.src = "assets/images/avatar/sad.png";
    resultText.innerText = "Sai mất rồi 🥺";
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
  const total = questions.length;
  progressEl.innerText = `💖 Đúng: ${correctCount} / ${total}`;
}

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
    startGame(); // hàm game của bạn
  }
});

// ================= END =================
function endGame() {
  questionEl.innerHTML = "Hết câu hỏi rồi 💕"; // Dùng innerHTML
  answersEl.innerHTML = "";
  avatar.src = "assets/images/avatar/happy.png";
}
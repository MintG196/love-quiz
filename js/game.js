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

// Phần Chat Intro
const messageScreen = document.getElementById("message-screen");
const chatContainer = document.getElementById("chat-container");
const chatNextBtn = document.getElementById("chat-next-btn");
const introAvatar = document.getElementById("intro-avatar"); // Ảnh nhân vật intro

// Phần Game
const questionEl = document.getElementById("question");
const answersEl = document.querySelector(".answers");
const avatar = document.getElementById("avatar");
const progressEl = document.getElementById("progress");

// Phần Kết quả
const resultScreen = document.getElementById("result-screen");
const resultImg = document.getElementById("resultImg");
const resultText = document.getElementById("resultText");

// Cấu hình nhạc nền
bgMusic.volume = 0.5;
musicToggle.innerText = "🔊";

// --- XỬ LÝ NHẠC ---
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

// ================= CHAT INTRO LOGIC (MỚI) =================
// Danh sách chat + Tên ảnh tương ứng
const chats = [
  { text: "Chào em 💖", img: "thinking" },           // Ảnh 1: Suy nghĩ
  { text: "Anh làm trò chơi nhỏ này cho em nè.", img: "khoanhtay" }, // Ảnh 2: Khoanh tay
  { text: "Không phải để thử thách đâu 😅", img: "happy1" },      // Ảnh 3: Cười
  { text: "Chỉ mong em mỉm cười khi chơi thôi 😊", img: "happy1" }, // Ảnh 4: Vẫn cười
  { text: "Giờ mình bắt đầu nhé? 💕", img: "heart" }             // Ảnh 5: Tim
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
    // Đảm bảo bạn có file ảnh đúng tên trong assets/images/avatar/
    introAvatar.src = `assets/images/avatar/${imgName}.png`;
  }
}

// Khi bấm nút START ở màn hình chào
startBtn.addEventListener("click", () => {
  introScreen.classList.remove("active");
  messageScreen.classList.add("active");

  chatContainer.innerHTML = "";
  chatIndex = 0;

  // Hiện câu đầu tiên + Ảnh đầu tiên
  if (chats.length > 0) {
    const first = chats[0];
    addChatBubble(first.text);
    updateIntroAvatar(first.img);
    chatIndex = 1;
  }

  bgMusic.play().catch(() => {});
});

// Khi bấm nút TIẾP ở màn hình chat
chatNextBtn.addEventListener("click", () => {
  if (chatIndex < chats.length) {
    const current = chats[chatIndex];
    addChatBubble(current.text);
    updateIntroAvatar(current.img);
    chatIndex++;
  } else {
    // Hết chat -> Vào game chính
    messageScreen.classList.remove("active");
    gameScreen.classList.add("active");
    startGame();
  }
});


// ================= START GAME =================
function startGame() {
  if (typeof questions === "undefined" || !Array.isArray(questions) || questions.length === 0) {
    questionEl.innerHTML = "Lỗi: Không có câu hỏi. Kiểm tra file js/questions.js";
    return;
  }

  currentQuestion = 0;
  correctCount = 0;

  // Reset Love Meter về 0%
  progressEl.innerHTML = `
    <div style="margin-bottom:5px;">❤️ Love Meter: 0%</div>
    <div style="width:160px; height:12px; background:#ffd6e0; border-radius:10px; overflow:hidden; margin:0 auto;">
      <div style="width:0%; height:100%; background:linear-gradient(90deg,#ff4d6d,#ff8fae);"></div>
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

  // Mặc định khi suy nghĩ
  avatar.src = "assets/images/avatar/thinking.png";

  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  answersEl.style.pointerEvents = "none";
  answersEl.style.opacity = "0";

  if (q.question.includes("<")) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = q.question;
    const img = tempDiv.querySelector("img");
    const text = tempDiv.textContent.trim();

    if (img) questionEl.appendChild(img);
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

    const answerIndex = index;
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
  updateProgress();
  showResult(isCorrect);
}

// ================= RESULT (ĐÃ SỬA ĐỒNG BỘ AVATAR) =================
function showResult(isCorrect) {
  resultScreen.classList.remove("hidden");
  
  // Lấy thẻ avatar chính bên trái
  const mainAvatar = document.getElementById("avatar");

  if (isCorrect) {
    correctSound.currentTime = 0;
    correctSound.play().catch(() => {});
    
    // Popup vui -> Avatar trái cũng vui
    resultImg.src = "assets/images/avatar/happy.png";
    if(mainAvatar) mainAvatar.src = "assets/images/avatar/happy.png";
    
    resultText.innerText = "Đúng ùi, toá giỏi lunnnn 💖";
  } else {
    incorrectSound.currentTime = 0;
    incorrectSound.play().catch(() => {});
    
    // Popup buồn -> Avatar trái cũng buồn
    resultImg.src = "assets/images/avatar/sad.png";
    if(mainAvatar) mainAvatar.src = "assets/images/avatar/sad.png";
    
    resultText.innerText = "Ui tiếc quớ, sai mất ùi 🥺";
  }

  setTimeout(() => {
    resultScreen.classList.add("hidden");
    nextQuestion(); 
  }, 1500);
}

// ================= NEXT & PROGRESS =================
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
    <div style="width:160px; height:12px; background:#ffd6e0; border-radius:10px; overflow:hidden; margin:0 auto;">
      <div style="width:${percent}%; height:100%; background:linear-gradient(90deg,#ff4d6d,#ff8fae); transition:width 0.4s ease;"></div>
    </div>
  `;
  if (percent === 100) {
    setTimeout(() => {
      progressEl.innerHTML += `<div style="margin-top:6px;font-size:14px;">💖 Full yêu rồi nèeee 💕</div>`;
    }, 300);
  }
}

// ================= END GAME =================
function endGame() {
  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  avatar.src = "assets/images/avatar/happy.png";
  showLoveQuestion();
}

// ================= LOVE QUESTION (LOGIC MỚI: NÚT NHỎ + NÉ TRÁNH) =================
function showLoveQuestion() {
  questionEl.innerHTML = "Em có yêu anh không? 💌";
  answersEl.innerHTML = "";
  answersEl.className = "answers";
  answersEl.style.position = "relative";
  answersEl.style.height = "300px";

  // Hàm style nút nhỏ gọn
  function makeButtonSmall(btn) {
    btn.style.width = "auto"; 
    btn.style.minWidth = "100px";
    btn.style.padding = "8px 15px";
    btn.style.fontSize = "1.2rem";
    btn.style.position = "absolute";
    btn.style.transition = "all 0.2s ease";
  }

  // Nút CÓ
  const yesBtn = document.createElement("button");
  yesBtn.innerText = "Có 💖";
  makeButtonSmall(yesBtn);
  yesBtn.style.left = "40%"; 
  yesBtn.style.top = "50%";
  yesBtn.style.transform = "translate(-50%, -50%)";
  yesBtn.style.zIndex = "100";

  // Nút KHÔNG
  const noBtn = document.createElement("button");
  noBtn.innerText = "Không 😝";
  makeButtonSmall(noBtn);
  noBtn.style.left = "70%";
  noBtn.style.top = "50%";
  noBtn.style.transform = "translate(-50%, -50%)";
  noBtn.style.zIndex = "50";

  answersEl.appendChild(yesBtn);
  answersEl.appendChild(noBtn);

  let yesScale = 1;
  let noClickCount = 0;

  // Xử lý nút KHÔNG (Né tránh + Biến mất)
  noBtn.addEventListener("click", () => {
    noClickCount++;
    
    // Nút CÓ to ra
    yesScale += 0.2; 
    yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;

    // Sau 3 lần thì biến mất
    if (noClickCount >= 3) {
      noBtn.style.display = "none";
    } else {
      // Bé dần đi
      const currentNoScale = 1 - (noClickCount * 0.2);
      noBtn.style.transform = `translate(0, 0) scale(${currentNoScale})`;

      // --- Logic tìm vị trí mới không bị đè ---
      const containerRect = answersEl.getBoundingClientRect();
      const yesRect = yesBtn.getBoundingClientRect();
      const btnWidth = noBtn.offsetWidth;
      const btnHeight = noBtn.offsetHeight;

      let newLeft, newTop, isOverlapping = true, attempts = 0;

      while (isOverlapping && attempts < 50) {
        attempts++;
        newLeft = Math.random() * (containerRect.width - btnWidth);
        newTop = Math.random() * (containerRect.height - btnHeight);

        const noRect = {
          left: containerRect.left + newLeft,
          right: containerRect.left + newLeft + btnWidth,
          top: containerRect.top + newTop,
          bottom: containerRect.top + newTop + btnHeight
        };

        const safetyMargin = 20;
        const overlap = !(
            noRect.right < yesRect.left - safetyMargin || 
            noRect.left > yesRect.right + safetyMargin || 
            noRect.bottom < yesRect.top - safetyMargin || 
            noRect.top > yesRect.bottom + safetyMargin
        );

        if (!overlap) isOverlapping = false;
      }
      noBtn.style.left = newLeft + "px";
      noBtn.style.top = newTop + "px";
    }
  });

  // Xử lý nút CÓ (Chiến thắng)
  yesBtn.addEventListener("click", () => {
    questionEl.innerHTML = "";
    answersEl.innerHTML = "";

    typeText(questionEl, "Anh biết mà 😚", 50, () => {
      setTimeout(() => {
        typeText(questionEl, endingMessage, 35, () => {
          const nextBtn = document.createElement("button");
          nextBtn.innerText = "Tiếp ➡️";
          nextBtn.style.marginTop = "30px";
          nextBtn.style.fontSize = "1.1rem";
          nextBtn.style.padding = "10px 32px";
          
          // Style 3D
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
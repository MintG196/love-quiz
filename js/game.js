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
  { text: "Há nhô bbi 💖", img: "thinking" },
  { text: "Anh coá làm cái trò chơi nhỏ này cho thúi nè.", img: "khoanhtay" },
  { text: "Không phải để thử thách đâu, chỉ mong bé iu mỉm cười khi chơi thui 😅", img: "happy1" },
  { text: "Dù trả lời có sai cũng hong sao hết á 😊", img: "happy1" },
  { text: "Anh làm coá gì thiếu sót thì mong em vẫn tận hưởng cái game này nhó💕", img: "thinking" },
  {text: "Giờ thì bắt đầu thui nào! 🥳", img: "heart" },
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

// ================= KẾT THÚC CÂU HỎI TRẮC NGHIỆM =================
function endGame() {
  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  avatar.src = "assets/images/avatar/happy.png";
  showLoveQuestion(); // Chuyển sang màn hình tỏ tình gốc
}

// ================= MÀN HÌNH "EM CÓ YÊU ANH KHÔNG" (KHÔI PHỤC BẢN GỐC) =================
function showLoveQuestion() {
    questionEl.innerHTML = "";
    answersEl.innerHTML = "";
    
    // Reset lại style cho khung answers để nút chạy nhảy được
    answersEl.className = "answers";
    answersEl.style.display = "flex"; 
    answersEl.style.justifyContent = "center";
    answersEl.style.position = "relative";
    answersEl.style.height = "300px"; 
    answersEl.style.marginTop = "20px"; 

    typeText(questionEl, "Câu hỏi cuối cùng náaa: Em có yêu anh nhìu nhìu hông? 💌", 50, () => {
        
        function makeButtonSmall(btn) {
            btn.style.width = "auto"; btn.style.minWidth = "100px";
            btn.style.padding = "10px 20px"; btn.style.fontSize = "1.2rem";
            btn.style.position = "absolute"; btn.style.transition = "all 0.2s ease";
            btn.style.boxShadow = "0 4px 0 #c22f55"; btn.style.border = "2px solid #fff";
            btn.className = "pink-btn"; // Dùng style nút hồng
        }

        const yesBtn = document.createElement("button");
        yesBtn.innerText = "Có 💖";
        makeButtonSmall(yesBtn);
        yesBtn.style.left = "35%"; yesBtn.style.top = "40%"; 
        yesBtn.style.transform = "translate(-50%, -50%)"; yesBtn.style.zIndex = "100";

        const noBtn = document.createElement("button");
        noBtn.innerText = "Không 😝";
        makeButtonSmall(noBtn);
        noBtn.style.left = "65%"; noBtn.style.top = "40%";
        noBtn.style.transform = "translate(-50%, -50%)"; noBtn.style.zIndex = "50";

        answersEl.appendChild(yesBtn);
        answersEl.appendChild(noBtn);

        // Hiệu ứng nút Không chạy trốn
        let yesScale = 1;
        let noClickCount = 0;
        noBtn.addEventListener("click", () => {
            noClickCount++;
            yesScale += 0.2; 
            yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
            
            if (noClickCount >= 5) {
                noBtn.style.display = "none";
            } else {
                const currentNoScale = 1 - (noClickCount * 0.15);
                noBtn.style.transform = `translate(0, 0) scale(${currentNoScale})`;
                const containerRect = answersEl.getBoundingClientRect();
                const btnWidth = noBtn.offsetWidth * currentNoScale; 
                const btnHeight = noBtn.offsetHeight * currentNoScale;
                const newLeft = Math.random() * (containerRect.width - btnWidth - 40) + 20; 
                const newTop = Math.random() * (containerRect.height - btnHeight - 40) + 20;
                noBtn.style.left = newLeft + "px"; noBtn.style.top = newTop + "px";
            }
        });

        // Xử lý khi ấn CÓ
        yesBtn.addEventListener("click", () => {
            noBtn.style.display = "none"; 
            yesBtn.style.display = "none";
            questionEl.innerHTML = "";

            // --- THÊM ĐOẠN NÀY: Đẩy Love Meter lên 100% ngay lập tức ---
            const meter = document.getElementById("progress");
            if (meter) {
                meter.innerHTML = `
                    <div style="margin-bottom:5px;">❤️ Love Meter: 100%</div>
                    <div style="width:160px; height:12px; background:#ffd6e0; border-radius:10px; overflow:hidden; margin:0 auto;">
                        <div style="width:100%; height:100%; background:linear-gradient(90deg,#ff4d6d,#ff8fae); transition:width 0.4s ease;"></div>
                    </div>
                `;
            }
            
            const replyDiv = document.createElement("div");
            replyDiv.style.fontSize = "24px";
            replyDiv.style.color = "#fff";
            replyDiv.style.fontWeight = "bold";
            questionEl.appendChild(replyDiv);

            typeText(replyDiv, "Ỏoooo, yêu thiệc nhóooo ❤️ Vậy thìiii...", 50, () => {
                setTimeout(() => {
                    const meter = document.getElementById("progress");
                    if (!meter) return;

                    meter.classList.add("meter-to-center");
                    meter.innerHTML = "⏳"; 

                    setTimeout(() => {
                        meter.classList.add("meter-morph");
                        setTimeout(() => {
                            meter.innerHTML = "💖";
                            meter.className = "super-heart-beat"; 
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
                }, 500);
            });
        });
    });
}

function showFinalMessage() {
    const overlay = document.createElement("div");
    overlay.className = "message-overlay show";
    const paper = document.createElement("div");
    paper.className = "message-paper";
    
    const content = document.createElement("div");
    content.style.fontSize = "1.2rem";
    content.style.lineHeight = "1.6";
    content.style.color = "#333";
    content.style.marginBottom = "20px";
    content.innerHTML = `<h2 style="color:#ff4f81; margin-top:0">Gửi bbi thúi của anhhh 💌</h2><div id="type-writer-content"></div>`;

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Cuối cùng làaaa... 🥰";
    nextBtn.className = "pink-btn"; 
    nextBtn.style.opacity = "0"; 
    nextBtn.style.transition = "opacity 0.5s";
    
    nextBtn.onclick = () => {
        overlay.classList.remove("show");
        setTimeout(() => {
            overlay.remove();
            if (typeof showEndingScene === 'function') showEndingScene();
        }, 500);
    };

    paper.appendChild(content); paper.appendChild(nextBtn);
    overlay.appendChild(paper); document.body.appendChild(overlay);

    const typeContainer = paper.querySelector("#type-writer-content");
    typeText(typeContainer, endingMessage, 40, () => {
        nextBtn.style.opacity = "1";
    });
}

function restartGame() {
    currentQuestion = 0;
    chatIndex = 0;
    gameScreen.classList.remove("active");
    document.querySelectorAll(".message-overlay").forEach(el => el.remove());
    if (window._heartInterval) { clearInterval(window._heartInterval); window._heartInterval = null; }
    const heartsContainer = document.getElementById("hearts-container");
    if (heartsContainer) heartsContainer.remove();
    
    chatContainer.innerHTML = "";
    if (avatar) {
        avatar.style.display = "block"; 
        avatar.src = "assets/images/avatar/thinking.png";
    }
    introScreen.classList.add("active");
}
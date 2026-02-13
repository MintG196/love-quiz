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
const introAvatar = document.getElementById("intro-avatar");

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

// START BUTTON
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

// CHAT NEXT BUTTON
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

// ================= START GAME =================
function startGame() {
  if (typeof questions === "undefined" || !Array.isArray(questions) || questions.length === 0) {
    questionEl.innerHTML = "Lỗi: Không có câu hỏi. Kiểm tra file js/questions.js";
    return;
  }
  progressEl.style.display = "block"; 
  currentQuestion = 0;
  correctCount = 0;
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
// Hàm loại bỏ dấu tiếng Việt, khoảng cách và ký tự đặc biệt
function cleanText(text) {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")             // Tách dấu ra khỏi chữ cái
        .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu vừa tách
        .replace(/[.,\s]/g, "")        // Xóa dấu phẩy, dấu chấm và khoảng trắng
        .replace(/đ/g, "d")            // Chuyển đ thành d
        .trim();
}
function showAnswers() {
  const q = questions[currentQuestion];
  answersEl.innerHTML = "";
  answersEl.style.opacity = "1";
  answersEl.style.pointerEvents = "auto";

  // NẾU LÀ LOẠI NHẬP VĂN BẢN
  if (q.type === "input") {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Nhập câu trả lời ở đây...";
    input.className = "pixel-box"; // Dùng lại class khung của bạn
    input.style.width = "80%";
    input.style.padding = "15px";
    input.style.fontSize = "18px";
    input.style.textAlign = "center";
    input.style.outline = "none";
    input.style.border = "3px solid #ff7a9e";
    input.style.borderRadius = "15px";

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const userValue = input.value.trim();
        const q = questions[currentQuestion];
        
        // Chuyển đáp án đúng thành mảng nếu nó đang là chuỗi đơn
        const correctAnswers = Array.isArray(q.correct) ? q.correct : [q.correct];
        
        // Kiểm tra xem input của cô ấy có khớp với bất kỳ đáp án nào không
        const isMatch = correctAnswers.some(ans => cleanText(userValue) === cleanText(ans));

        if (isMatch) {
            handleAnswer(true); // Gửi tín hiệu đúng
        } else {
            handleAnswer(false); // Gửi tín hiệu sai
        }
      }
    });
    answersEl.appendChild(input);
    input.focus(); // Tự động chọn ô nhập để gõ luôn
  } 
  // NẾU LÀ LOẠI TRẮC NGHIỆM CŨ
  else {
    if (q.answers.length === 2) answersEl.className = "answers two";
    else answersEl.className = "answers four";

    q.answers.forEach((ans, index) => {
      const btn = document.createElement("button");
      btn.innerHTML = ans;
      btn.onclick = () => handleAnswer(index);
      answersEl.appendChild(btn);
    });
  }
}

// ================= HANDLE ANSWER =================
function handleAnswer(result) {
  const q = questions[currentQuestion];
  let isCorrect = false;

  if (q.type === "input") {
    isCorrect = result; // Lấy kết quả trực tiếp từ phép so sánh cleanText
  } else {
    isCorrect = result === q.correct; // Logic trắc nghiệm cũ
  }

  updateProgress();
  showResult(isCorrect);
}

// ================= RESULT =================
function showResult(isCorrect) {
  resultScreen.classList.remove("hidden");
  const mainAvatar = document.getElementById("avatar");
  if (isCorrect) {
    correctSound.currentTime = 0; correctSound.play().catch(() => {});
    resultImg.src = "assets/images/avatar/happy.png";
    if(mainAvatar) mainAvatar.src = "assets/images/avatar/happy.png";
    resultText.innerText = "Đúng ùi, toá giỏi lunnnn 💖";
  } else {
    incorrectSound.currentTime = 0; incorrectSound.play().catch(() => {});
    resultImg.src = "assets/images/avatar/sad.png";
    if(mainAvatar) mainAvatar.src = "assets/images/avatar/sad.png";
    resultText.innerText = "Ui tiếc quớ, sai mất ùi 🥺";
  }
  setTimeout(() => {
    resultScreen.classList.add("hidden"); nextQuestion(); 
  }, 1500);
}

// ================= NEXT & PROGRESS =================
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) loadQuestion();
  else endGame();
}

function updateProgress() {
  const percent = Math.round(((currentQuestion + 1) / questions.length) * 100);
  progressEl.innerHTML = `
    <div style="margin-bottom:5px;">❤️ Love Meter: ${percent}%</div>
    <div style="width:160px; height:12px; background:#ffd6e0; border-radius:10px; overflow:hidden; margin:0 auto;">
      <div style="width:${Math.min(percent, 100)}%; height:100%; background:linear-gradient(90deg,#ff4d6d,#ff8fae); transition:width 0.4s ease;"></div>
    </div>
  `;
}

function endGame() {
  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  avatar.src = "assets/images/avatar/happy.png";
  showLoveQuestion();
}

// ================= SHOW LOVE QUESTION (FINAL) =================
function showLoveQuestion() {
    questionEl.innerHTML = "";
    answersEl.innerHTML = "";
    
    answersEl.className = "answers";
    answersEl.style.display = "flex"; 
    answersEl.style.justifyContent = "center";
    answersEl.style.position = "relative";
    answersEl.style.height = "300px"; 
    answersEl.style.marginTop = "20px"; 

    typeText(questionEl, "Em có yêu anh không? 💌", 50, () => {
        
        function makeButtonSmall(btn) {
            btn.style.width = "auto"; btn.style.minWidth = "100px";
            btn.style.padding = "10px 20px"; btn.style.fontSize = "1.2rem";
            btn.style.position = "absolute"; btn.style.transition = "all 0.2s ease";
            btn.style.boxShadow = "0 4px 0 #c22f55"; btn.style.border = "2px solid #fff";
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

        yesBtn.style.opacity = "0"; noBtn.style.opacity = "0";
        setTimeout(() => { yesBtn.style.opacity = "1"; noBtn.style.opacity = "1"; }, 100);

        // Logic nút KHÔNG
        let yesScale = 1;
        let noClickCount = 0;
        noBtn.addEventListener("click", () => {
            noClickCount++;
            yesScale += 0.15; 
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

        // --- LOGIC NÚT CÓ ---
        yesBtn.addEventListener("click", () => {
            noBtn.style.display = "none"; 
            yesBtn.style.display = "none";
            questionEl.innerHTML = "";
            answersEl.innerHTML = "";
            
            const replyDiv = document.createElement("div");
            replyDiv.style.fontSize = "24px";
            replyDiv.style.color = "#fff";
            replyDiv.style.fontWeight = "bold";
            questionEl.appendChild(replyDiv);

            typeText(replyDiv, "Yêu thế cơ á? ❤️ Để anh xem nào...", 50, () => {
                
                // 1. Bay vào giữa
                setTimeout(() => {
                    const meter = document.getElementById("progress");
                    if (!meter) return;

                    meter.classList.add("meter-to-center");
                    meter.innerHTML = "⏳"; 

                    // 2. Biến hình tròn
                    setTimeout(() => {
                        meter.classList.add("meter-morph");
                        
                        // 3. THAY THẾ BẰNG TRÁI TIM MỚI (Ve Sầu Thoát Xác)
                        setTimeout(() => {
                            // Xóa thanh cũ đi
                            meter.remove(); 

                            // Tạo nút tim mới
                            const realHeart = document.createElement("button");
                            realHeart.className = "super-heart-beat"; 
                            realHeart.innerHTML = "💖";
                            document.body.appendChild(realHeart);

                            realHeart.onclick = () => {
                                // 1. Xóa nút tim to đi
                                realHeart.remove(); 

                                // 2. Tạo MỘT trái tim bay lên từ chính giữa
                                const soulHeart = document.createElement("div");
                                soulHeart.className = "flying-heart"; 
                                soulHeart.style.left = "50%";
                                soulHeart.style.top = "50%";
                                soulHeart.style.marginLeft = "-16px"; // Căn giữa chuẩn tim (kích thước 32px)
                                soulHeart.style.marginTop = "-16px";
                                
                                document.body.appendChild(soulHeart);

                                // 3. Đợi tim bay lên rồi hiện thư (1s)
                                setTimeout(() => {
                                    showFinalMessage(); 
                                }, 1000);
                            };
                        }, 800);
                    }, 800);
                }, 500);
            });
        });
    }); 
}

// ================= SHOW FINAL MESSAGE =================
function showFinalMessage() {
    const overlay = document.createElement("div");
    overlay.className = "message-overlay";
    const paper = document.createElement("div");
    paper.className = "message-paper";
    
    const content = document.createElement("div");
    content.style.fontSize = "1.2rem";
    content.style.lineHeight = "1.6";
    content.style.color = "#333";
    content.style.marginBottom = "20px";
    content.innerHTML = `<h2 style="color:#ff4f81; margin-top:0">Gửi em yêu 💌</h2><div id="type-writer-content"></div>`;

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Tiếp theo ➡️";
    nextBtn.className = "pink-btn"; 
    
    nextBtn.style.marginTop = "20px";
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
    setTimeout(() => overlay.classList.add("show"), 50);

    const messageText = endingMessage; 
    const typeContainer = paper.querySelector("#type-writer-content");
    typeText(typeContainer, messageText, 40, () => {
        nextBtn.style.opacity = "1";
    });
}

// ================= CHỨC NĂNG CHƠI LẠI (RESET GAME) =================
function restartGame() {
    // 1. Reset biến game
    currentQuestion = 0;
    chatIndex = 0;

    // 2. Ẩn màn hình game
    gameScreen.classList.remove("active");
    
    // 3. Xóa các lớp phủ (Lời nhắn, Tim bay...)
    document.querySelectorAll(".message-overlay").forEach(el => el.remove());
    const heartsContainer = document.getElementById("hearts-container");
    if (heartsContainer) heartsContainer.remove();

    // 4. Dừng hiệu ứng tim bay ở Ending (Quan trọng!)
    if (window._heartInterval) {
        clearInterval(window._heartInterval);
        window._heartInterval = null;
    }

    // 5. Reset giao diện
    chatContainer.innerHTML = "";
    if (introAvatar) introAvatar.src = "assets/images/avatar/thinking.png";

    // Reset Avatar game (vì ở Ending nó bị ẩn đi)
    if (avatar) {
        avatar.style.display = "block"; 
        avatar.src = "assets/images/avatar/thinking.png";
    }
    const gameDiv = document.getElementById("game");
    if (gameDiv) gameDiv.style.paddingLeft = ""; 

    // 6. Quay về màn hình Intro
    introScreen.classList.add("active");
}
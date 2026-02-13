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
  // --- THÊM DÒNG NÀY ĐỂ HIỆN LẠI LOVE METER ---
  progressEl.style.display = "block"; 
  // --------------------------------------------

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

// ================= PROGRESS (LOGIC MỚI: CHÌA KHÓA TRÁI TIM) =================
function updateProgress() {
  const percent = Math.round(((currentQuestion + 1) / questions.length) * 100);
  
  // Chỉ đơn giản là hiện thanh loading thôi, không biến hình gì ở đây cả
  // Vì "biến hình" sẽ dành cho màn chốt hạ ở giữa màn hình
  progressEl.innerHTML = `
    <div style="margin-bottom:5px;">❤️ Love Meter: ${percent}%</div>
    <div style="width:160px; height:12px; background:#ffd6e0; border-radius:10px; overflow:hidden; margin:0 auto;">
      <div style="width:${Math.min(percent, 100)}%; height:100%; background:linear-gradient(90deg,#ff4d6d,#ff8fae); transition:width 0.4s ease;"></div>
    </div>
  `;
}
// ================= END GAME =================
function endGame() {
  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  avatar.src = "assets/images/avatar/happy.png";
  showLoveQuestion();
}

// ================= LOVE QUESTION (LOGIC MỚI: NÚT NHỎ + NÉ TRÁNH) =================
// ================= LOVE QUESTION (LOGIC MỚI: CHỮ CHẠY + 5 LẦN ẤN) =================
// ================= LOVE QUESTION & FINAL FLOW =================

function showLoveQuestion() {
  questionEl.innerHTML = "";
  answersEl.innerHTML = "";
  
  // Style lại khung
  answersEl.className = "answers";
  answersEl.style.display = "flex"; 
  answersEl.style.justifyContent = "center";
  answersEl.style.position = "relative";
  answersEl.style.height = "300px"; 
  answersEl.style.marginTop = "20px"; 

  // Chữ chạy câu hỏi
  typeText(questionEl, "Em có yêu anh không? 💌", 50, () => {
    
    // Tạo nút Có/Không (Code cũ giữ nguyên logic)
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

    // Fade in nút
    yesBtn.style.opacity = "0"; noBtn.style.opacity = "0";
    setTimeout(() => { yesBtn.style.opacity = "1"; noBtn.style.opacity = "1"; }, 100);

    // Logic nút KHÔNG (Né tránh - Giữ nguyên)
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
        // ... (Logic random vị trí giữ nguyên như cũ) ...
        const containerRect = answersEl.getBoundingClientRect();
        const btnWidth = noBtn.offsetWidth * currentNoScale; 
        const btnHeight = noBtn.offsetHeight * currentNoScale;
        const newLeft = Math.random() * (containerRect.width - btnWidth - 40) + 20; 
        const newTop = Math.random() * (containerRect.height - btnHeight - 40) + 20;
        noBtn.style.left = newLeft + "px"; noBtn.style.top = newTop + "px";
      }
    });

    // --- LOGIC NÚT CÓ (QUAN TRỌNG: GỌI TRÁI TIM GIỮA MÀN HÌNH) ---
    yesBtn.addEventListener("click", () => {
      // 1. Ẩn hết nút và câu hỏi
      noBtn.style.display = "none"; 
      yesBtn.style.display = "none";
      questionEl.innerHTML = "";
      answersEl.innerHTML = "";
      
      // 2. Chữ "Anh biết mà" hiện ra
      const replyDiv = document.createElement("div");
      replyDiv.style.fontSize = "24px";
      replyDiv.style.color = "#fff";
      replyDiv.style.fontWeight = "bold";
      questionEl.appendChild(replyDiv);

      typeText(replyDiv, "Anh biết mà 😚... Chờ xíu nha...", 50, () => {
        // 3. Sau khi chữ chạy xong -> Hiện trái tim to đùng giữa màn hình
        setTimeout(() => {
            spawnCenterHeart(); 
        }, 500);
      });
    });
  }); 
}

// --- HÀM TẠO TRÁI TIM GIỮA MÀN HÌNH ---
function spawnCenterHeart() {
    // Xóa câu hỏi cũ đi cho sạch
    const gameBox = document.querySelector(".question-box");
    if(gameBox) gameBox.style.opacity = "0"; // Làm mờ khung câu hỏi đi để tập trung vào tim

    const heartBtn = document.createElement("button");
    heartBtn.className = "center-heart-btn";
    heartBtn.innerHTML = "💖";
    
    // Thêm dòng chữ nhắc nhở dưới trái tim
    const hintText = document.createElement("div");
    hintText.innerText = "Bấm vào tim anh đi 🥺";
    hintText.style.position = "fixed";
    hintText.style.top = "60%";
    hintText.style.left = "50%";
    hintText.style.transform = "translate(-50%, -50%)";
    hintText.style.color = "white";
    hintText.style.fontSize = "20px";
    hintText.style.fontWeight = "bold";
    hintText.style.textShadow = "0 2px 4px rgba(0,0,0,0.5)";
    hintText.style.opacity = "0";
    hintText.style.transition = "opacity 0.5s";
    hintText.style.zIndex = "2999";

    document.body.appendChild(heartBtn);
    document.body.appendChild(hintText);

    // Animation xuất hiện
    setTimeout(() => {
        heartBtn.classList.add("show");
        hintText.style.opacity = "1";
    }, 100);

    // Sự kiện bấm vào tim
    heartBtn.onclick = () => {
        // Ẩn tim và chữ gợi ý
        heartBtn.style.transform = "translate(-50%, -50%) scale(1.5)";
        heartBtn.style.opacity = "0";
        hintText.style.opacity = "0";
        
        // Hiện hiệu ứng tim bay tung toé
        for (let i = 0; i < 15; i++) {
             const mini = document.createElement("div");
             mini.className = "flying-heart"; // Tận dụng class có sẵn
             mini.style.left = "50%";
             mini.style.top = "50%";
             document.body.appendChild(mini);
             setTimeout(()=> mini.remove(), 1500);
        }

        // CHUYỂN SANG HIỆN LỜI NHẮN (MESSAGE)
        setTimeout(() => {
            heartBtn.remove();
            hintText.remove();
            showFinalMessage(); 
        }, 500);
    };
}

// --- HÀM HIỆN KHUNG LỜI NHẮN ---
function showFinalMessage() {
    const overlay = document.createElement("div");
    overlay.className = "message-overlay";
    
    const paper = document.createElement("div");
    paper.className = "message-paper";
    
    // Nội dung lời nhắn
    const content = document.createElement("div");
    content.style.fontSize = "1.2rem";
    content.style.lineHeight = "1.6";
    content.style.color = "#333";
    content.style.marginBottom = "20px";
    // Chỗ này bạn sửa nội dung tùy ý nhé
    content.innerHTML = `
        <h2 style="color:#ff4f81; margin-top:0">Gửi em yêu 💌</h2>
        <div id="type-writer-content"></div> 
    `;

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Tiếp theo ➡️";
    nextBtn.className = "pixel-box"; // Tận dụng class nút cũ
    nextBtn.style.padding = "10px 30px";
    nextBtn.style.fontSize = "16px";
    nextBtn.style.marginTop = "10px";
    nextBtn.style.opacity = "0"; // Ẩn nút đi đợi chữ chạy xong
    nextBtn.style.transition = "opacity 0.5s";
    
    nextBtn.onclick = () => {
        overlay.classList.remove("show");
        setTimeout(() => {
            overlay.remove();
            if (typeof showEndingScene === 'function') showEndingScene();
        }, 500);
    };

    paper.appendChild(content);
    paper.appendChild(nextBtn);
    overlay.appendChild(paper);
    document.body.appendChild(overlay);

    // Hiện popup
    setTimeout(() => overlay.classList.add("show"), 50);

    // Chạy chữ nội dung thư
    const messageText = endingMessage; // Lấy từ biến endingMessage ở đầu file, hoặc viết cứng vào đây
    const typeContainer = paper.querySelector("#type-writer-content");
    
    typeText(typeContainer, messageText, 40, () => {
        // Chữ chạy xong thì hiện nút Tiếp
        nextBtn.style.opacity = "1";
    });
}
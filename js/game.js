let currentQuestion = 0;

// ================= INTRO =================
const introScreen = document.getElementById("intro-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", () => {
  introScreen.classList.remove("active");
  gameScreen.classList.add("active");
  startGame();
});

// ================= ELEMENTS =================
const questionEl = document.getElementById("question");
const answersEl = document.querySelector(".answers");
const avatar = document.getElementById("avatar");

const resultScreen = document.getElementById("result-screen");
const resultImg = document.getElementById("resultImg");
const resultText = document.getElementById("resultText");

// ================= START GAME =================
function startGame() {
  currentQuestion = 0;
  loadQuestion();
}

function typeText(element, text, speed = 40, callback) {
  element.innerHTML = "";
  let i = 0;

  const interval = setInterval(() => {
    let char = text.charAt(i);
    
    if (char === " ") {
        // MẸO: Dùng thẻ span có margin để tạo khoảng cách, nhưng vẫn giữ dấu cách để xuống dòng
        element.innerHTML += '<span style="margin-right: 10px;"> </span>';
    } else {
        element.innerHTML += char;
    }
    
    i++;

    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

function typeQuestion(text, element, speed = 40) {
  element.innerText = ""; // reset trước
  let index = 0;

  const typing = setInterval(() => {
    element.innerText += text[index];
    index++;

    if (index >= text.length) {
      clearInterval(typing);
    }
  }, speed);
}


function loadQuestion() {
  const q = questions[currentQuestion];

  // reset avatar
  avatar.src = "assets/images/avatar/thinking.png";

  // clear question & answers
  questionEl.innerText = "";
  answersEl.innerHTML = "";

  // tạm khóa click
  answersEl.style.pointerEvents = "none";
  answersEl.style.opacity = "0";

  // chạy chữ câu hỏi
  typeText(questionEl, q.question, 35, () => {
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

// ================= END =================
function endGame() {
  questionEl.innerText = "Hết câu hỏi rồi 💕";
  answersEl.innerHTML = "";
  avatar.src = "assets/images/avatar/happy.png";
}

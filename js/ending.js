// Hàm hiện màn hình "Lời gửi riêng" với nút Tiếp
function showLoveLetterScene() {
    // Ẩn love meter nếu còn sót
    const progressEl = document.getElementById("progress");
    if (progressEl) progressEl.style.display = "none";
    
	const questionEl = document.getElementById("question");
	const answersEl = document.querySelector(".answers");
	if (questionEl) questionEl.innerHTML = "";
	if (answersEl) answersEl.innerHTML = "";

	// Nội dung lời gửi riêng
	const loveLetter = `
		<div style="font-size:1.2rem;color:#ff4f81;font-weight:bold;margin-bottom:10px;">Lời gửi riêng cho em 💌</div>
		<div style="font-size:1.1rem;color:#333;max-width:400px;margin:0 auto;">
			Em yêu à, cảm ơn em đã luôn bên cạnh anh, cùng anh vượt qua mọi vui buồn. Anh mong mình sẽ mãi bên nhau, cùng nhau đi hết con đường phía trước nhé!<br><br>Hãy đọc xong rồi nhấn nút bên dưới để đến bất ngờ cuối cùng nha 💖
		</div>
	`;
	const letterDiv = document.createElement("div");
	letterDiv.innerHTML = loveLetter;
	letterDiv.style.textAlign = "center";
	letterDiv.style.margin = "40px auto 20px auto";

	// Nút Tiếp
	const nextBtn = document.createElement("button");
	nextBtn.innerText = "Tiếp theo náaa";
	nextBtn.className = "pink-btn"; // Dùng class nút hồng
	nextBtn.style.marginTop = "30px";
	nextBtn.onclick = showEndingScene;

	questionEl.appendChild(letterDiv);
	questionEl.appendChild(nextBtn);
}

// Hàm hiện ending scene sinh động
function showEndingScene() {
    // Xóa sổ love meter (chốt chặn cuối cùng)
    const progressEl = document.getElementById("progress");
    if (progressEl) progressEl.remove(); 

    // 1. Lấy các element khác
    const questionEl = document.getElementById("question");
    const answersEl = document.querySelector(".answers");
    const avatarEl = document.getElementById("avatar");
    const gameEl = document.getElementById("game");

    // Ẩn nhân vật & Reset căn lề
    if (avatarEl) avatarEl.style.display = "none"; 
    if (gameEl) gameEl.style.paddingLeft = "20px"; 

    // Xóa khung hồng của câu hỏi cũ
    if (questionEl && questionEl.parentElement) {
        const box = questionEl.parentElement;
        box.style.background = "transparent"; 
        box.style.boxShadow = "none";
        box.style.border = "none"; 
        box.style.padding = "0";
    }

    // Xóa nội dung cũ
    if (questionEl) questionEl.innerHTML = "";
    if (answersEl) answersEl.innerHTML = "";

    // Tạo khung scene
    const endingDiv = document.createElement("div");
    endingDiv.id = "ending-scene";
    endingDiv.style.display = "flex";
    endingDiv.style.flexDirection = "column";
    endingDiv.style.alignItems = "center";
    endingDiv.style.justifyContent = "center";
    endingDiv.style.marginTop = "20px"; 

    // Ảnh cặp đôi
    const img = document.createElement("img");
    img.src = "assets/images/couple/couple.jpg";
    img.alt = "Couple";
    img.style.width = "220px";
    img.style.borderRadius = "20px";
    img.style.boxShadow = "0 4px 24px #ffb6c1";
    img.style.opacity = "0";
    img.style.transition = "opacity 1.2s";

    // Hiệu ứng trái tim bay (Background)
    let heartsContainer = document.getElementById("hearts-container");
    if (!heartsContainer) {
        heartsContainer = document.createElement("div");
        heartsContainer.id = "hearts-container";
        heartsContainer.style.position = "fixed";
        heartsContainer.style.left = 0;
        heartsContainer.style.top = 0;
        heartsContainer.style.width = "100vw";
        heartsContainer.style.height = "100vh";
        heartsContainer.style.pointerEvents = "none";
        heartsContainer.style.zIndex = 9999;
        document.body.appendChild(heartsContainer);
    }

    function spawnHeart() {
        const heart = document.createElement("div");
        heart.className = "flying-heart";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDelay = Math.random() * 1.5 + "s";
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 4600);
    }

    if (!window._heartInterval) {
        window._heartInterval = setInterval(() => {
            spawnHeart();
        }, 150);
    }

    // Lời nhắn kết thúc
    const msg = document.createElement("div");
    msg.innerHTML =
        '<div style="font-size: 1.5rem; color: #ff4f81; margin: 20px 0 10px 0; font-weight: bold; text-shadow: 2px 2px 0px #fff;">Happy Valentine My Baby!💕</div>' +
        '<div style="font-size: 1.1rem; color: white; text-shadow: 0 0 4px #ff4f81, 0 0 8px #ff4f81;">Cảm ơn em đã là một phần quan trọng trong cuộc đời anh, mong rằng mình sẽ mãi đồng hành với nhau thật lâu ná!</div>';
    msg.style.textAlign = "center";
    msg.style.marginBottom = "20px";

    // --- THÊM NÚT CHƠI LẠI ---
    const replayBtn = document.createElement("button");
    replayBtn.innerText = "Bbi ấn vô đây để chơi lại nàa";
    replayBtn.className = "pink-btn"; // Dùng class nút hồng
    
   // SỬA ĐOẠN NÀY:
    replayBtn.onclick = () => {
        location.reload(); // Load lại trang ngay lập tức
    };
    // -------------------------

    endingDiv.appendChild(img);
    endingDiv.appendChild(msg);
    endingDiv.appendChild(replayBtn); // Thêm nút vào màn hình

    if (questionEl) questionEl.appendChild(endingDiv);

    setTimeout(() => {
        img.style.opacity = "1";
    }, 400);
}

// Nội dung lời nhắn (dùng chung)
const endingMessage = `
Shin thúiiii 💖
Cảm ơn Shin đã chơi hết trò chơi nhỏ này của anh.
Đây là cái game anh đã ấp ủ từ lâu để dành tặng riêng cho em, nên anh đã cố gắng 
làm nó thật đặc biệt và ý nghĩa nhất có thể, nên nếu có gì thiếu sót thì mong em vẫn vui vẻ đón nhận và tận hưởng cái game này nhóooo.
Và nếu sau này mình có cãi nhau,
hãy nhớ hôm nay em đã mỉm cười khi chơi game này ná.
Anh thương em nhiều lắm, ngoan xinh iu của anhhh 💕
`;
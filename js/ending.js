// Hàm hiện màn hình "Lời gửi riêng" với nút Tiếp
function showLoveLetterScene() {
	const questionEl = document.getElementById("question");
	const answersEl = document.querySelector(".answers");
	if (questionEl) questionEl.innerHTML = "";
	if (answersEl) answersEl.innerHTML = "";

	// Nội dung lời gửi riêng, bạn có thể sửa lại đoạn này
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
	nextBtn.onclick = showEndingScene;

	questionEl.appendChild(letterDiv);
	questionEl.appendChild(nextBtn);
}

// Hàm hiện ending scene sinh động
function showEndingScene() {
	// 1. Lấy các element
	const questionEl = document.getElementById("question");
	const answersEl = document.querySelector(".answers");

	// --- ĐOẠN CODE MỚI THÊM VÀO ĐỂ BỎ KHUNG HỒNG ---
	// Lấy thẻ cha của questionEl (chính là thẻ div.question-box có màu hồng)
	if (questionEl && questionEl.parentElement) {
		const box = questionEl.parentElement;
		
		// Xóa màu nền, xóa bóng, xóa padding để ảnh hiển thị tự nhiên
		box.style.background = "transparent"; 
		box.style.boxShadow = "none";
        box.style.border = "none";
		box.style.padding = "0";
		// Nếu muốn ảnh to ra, có thể set width 100% (tuỳ chọn)
		// box.style.width = "100%"; 
		// box.style.maxWidth = "100%";
	}
	// -------------------------------------------------

	// Xóa nội dung cũ bên trong
	if (questionEl) questionEl.innerHTML = "";
	if (answersEl) answersEl.innerHTML = "";

	// Tạo khung scene
	const endingDiv = document.createElement("div");
	endingDiv.id = "ending-scene";
	endingDiv.style.display = "flex";
	endingDiv.style.flexDirection = "column";
	endingDiv.style.alignItems = "center";
	endingDiv.style.justifyContent = "center";
	
	// Điều chỉnh lại margin top một chút vì đã bỏ padding của box cha
	endingDiv.style.marginTop = "20px"; 

	// Ảnh cặp đôi mới
	const img = document.createElement("img");
	img.src = "assets/images/couple/couple.jpg";
	img.alt = "Couple";
	img.style.width = "220px"; // Bạn có thể tăng lên nếu muốn to hơn, ví dụ 280px
	img.style.borderRadius = "20px";
	img.style.boxShadow = "0 4px 24px #ffb6c1";
	img.style.opacity = "0";
	img.style.transition = "opacity 1.2s";

	// Hiệu ứng trái tim bay (Giữ nguyên)
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
		'<div style="font-size: 1.5rem; color: #ff4f81; margin: 20px 0 10px 0; font-weight: bold; text-shadow: 2px 2px 0px #fff;">Mãi bên nhau em nhé 💑</div>' +
		'<div style="font-size: 1.1rem; color: white; text-shadow: 0 0 4px #ff4f81, 0 0 8px #ff4f81;">Cảm ơn em đã là một phần quan trọng trong cuộc đời anh!</div>';
	// Lưu ý: Vì bỏ nền hồng nên chữ màu trắng có thể khó đọc trên nền web. 
	// Mình đã thêm text-shadow (viền chữ) ở trên để chữ nổi bật hơn.
	
	msg.style.textAlign = "center";
	msg.style.marginBottom = "20px";

	endingDiv.appendChild(img);
	endingDiv.appendChild(msg);
	if (questionEl) questionEl.appendChild(endingDiv);

	setTimeout(() => {
		img.style.opacity = "1";
	}, 400);
}
const endingMessage = `
Em à 💖

Cảm ơn em đã chơi hết trò chơi nhỏ này.
Anh không giỏi nói lời hoa mỹ,
nhưng từng câu hỏi ở trên đều là thật lòng.

Dù em chọn đáp án nào,
điều anh chọn vẫn luôn là em.

Nếu sau này mình có cãi nhau,
hãy nhớ hôm nay em đã mỉm cười khi chơi game này nhé.

Anh thương em nhiều lắm 💕

– Người làm game này cho em
`;

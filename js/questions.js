const questions = [
  {
    question:
      "Câu 1: Hai đứa mình lần đầu tiên biết đến nhau vào tháng mấy nhò?",
    answers: [
      "Tháng 5 năm 2025",
      "Tháng 6 năm 2025",
      "Tháng 7 năm 2025",
      "Tháng 8 năm 2025",
    ],
    correct: 0,
  },
  {
    question: "Câu 2: Mình quen nhau qua game gì ó?",
    answers: ["Phi Phai", "LiQi Mobin", "Va lô dan", "Pắp Gi"],
    correct: 2,
  },

  {
    question: "Câu 3: Anh đã làm gì để được chơi game cùng em?",
    answers: [
      "Doạ dẫm bắt em chơi cùng",
      "Spam tin nhắn",
      "Đổi tên và camp em mỗi ngày",
      "Hack nick em để tự vào tổ đội",
    ],
    correct: 2,
  },

  {
    question: "Câu 4: Mạng xã hội đầu tiên anh được add em là gì?",
    answers: ["Tít Tót", "Phây Búc", "Diu Túp", "Da Lô"],
    correct: 0,
  },

  {
    question: "Câu 5: Cách xưng hô đầu tiên của hai đứa mình là cái gì ta?",
    answers: ["Tao - Mày", "Cậu - Tớ", "Anh - Em", "Vợ - Chồng"],
    correct: 1,
  },

  {
    question:
      "Câu 6: Em từng nói với anh ấn tượng đầu tiên của em về anh là gì?",
    answers: [
      "Hài, Giỏi, biết Tiếng Anh",
      "Bắn ngu, toxic",
      "Ranh con láo toét",
      "Tất cả những điều trên",
    ],
    correct: 0,
  },

  {
    question: "Câu 7: Lần đầu tiên em dỗi anh là khi nào?",
    answers: [
      "Lúc em đi Đà Nẵng",
      "Lúc anh đi Cát Bà",
      "Lúc anh đi Huế",
      "Lúc em ra Hà Nội",
    ],
    correct: 1,
  },

  {
    question: "Câu 8: Và lí do chính làaaaaa?",
    answers: [
      "Anh quên rep tin nhắn em",
      "Anh không chúc em ngủ ngon",
      "Anh làm đau bản thân anh",
      "Em tưởng anh không muốn nhắn tin với em và nói đi ngủ",
    ],
    correct: 3,
  },

  {
    question: "Câu 9: Hai đứa mình gặp nhau lần đầu tiên vào ngày mấy?",
    answers: ["02/09/2025", "19/06/2025", "30/08/2025", "10/09/2025"],
    correct: 2,
  },

  {
    question:
      "Câu 10: Tại sao lúc đón anh đến lâu rồi mà phải lúc sau anh mới xuất hiện trước mặt em :>?",
    answers: [
      "Anh đi vệ sinh",
      "Anh đi mua quà cho em",
      "Anh bị sững lại vì vẻ đẹp của em và ngắm em từ xa",
      "Anh sợ em không nhận ra anh",
    ],
    correct: 2,
  },
  {
    question: "Câu 11: Anh đã tỏ tình với em lần thứ mấy thì thành công hế?",
    answers: ["1 phát ăn luôn", "2 lần", "36 lần", "Lần thứ 4"],
    correct: 3,
  },
  {
    question:
      "Câu 12: Món ăn mà hai đứa mình ăn trong hình đó làaaa? <img src='assets/images/questpics/bunrieu.jpg' class='question-img'>",
    answers: ["Bún đậu mắm tôm", "Phở bò", "Bún riêu tóp mỡ giò", "Bún bò Huế"],
    correct: 2,
  },

  {
    question:
      "Câu 13: Món ăn mà mình ăn nhiều nhất trong lần đầu gặp nhau là zì zạ?",
    answers: ["Bánh Đa Trộn", "Cơm Rang Dưa Bò", "Phở Gà", "Mì Cay"],
    correct: 3,
  },

  {
    question:
      "Câu 14: Bức ảnh này được chụp ở đâu nhờ? <img src='assets/images/questpics/hamguixe.jpg' class='question-img'>",
    answers: [
      "Hầm gửi xe quán net",
      "Nhà trọ anh",
      "Nhà trọ em",
      "Hầm gửi xe bến xe  ",
    ],
    correct: 0,
  },

  {
    type: "input",
    question:
      "Câu 14: Món quà đầu tiên anh tặng cho em là gì nhỉ? (Nhập xong ấn Enter ná)",
    correct: ["Nước Hoa"],
  },

  {
    question:
      "Câu 15: Anh từng bảo anh thích em yêu em là vì cái gì nhờ (Lí do thực sự í)?",
    answers: [
      "Vì em xinh",
      "Vì em ngon",
      "Vì bản thân, con người của em",
      "Vì anh thích bừa",
    ],
    correct: 2,
  },

  {
    type: "input",
    question:
      "Câu 16: Ảnh nào là ngôi nhà đầu tiên của chúng ta trong Minecraft? (Em điền 1 hoặc 2 nhó) <br><img src='assets/images/questpics/anhA.jpg' class='question-img'><br><img src='assets/images/questpics/anhB.jpg' class='question-img'>",
    correct: ["2", "anhB", "ảnh B", "Ảnh B", "B.jpg", "anhB.jpg"],
  },

  {
    question:
      "Câu 17: Baby hãy chọn thứ tự đúng ứng với tên game có trong ảnh ná? <br>" +
      "<div style='display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 10px 0;'>" +
      "<img src='assets/images/questpics/backrooms.jpg' style='width: 30%; max-width: 120px; border-radius: 10px; border: 2px solid white;'>" +
      "<img src='assets/images/questpics/minecraft.jpg' style='width: 30%; max-width: 120px; border-radius: 10px; border: 2px solid white;'>" +
      "<img src='assets/images/questpics/pokemon.jpg' style='width: 30%; max-width: 120px; border-radius: 10px; border: 2px solid white;'>" +
      "<img src='assets/images/questpics/sieuthi.jpg' style='width: 30%; max-width: 120px; border-radius: 10px; border: 2px solid white;'>" +
      "<img src='assets/images/questpics/grounded1.jpg' style='width: 30%; max-width: 120px; border-radius: 10px; border: 2px solid white;'>" +
      "</div>",
    answers: [
      "Backrooms, Minecraft, Pokemon, Siêu thị, Grounded",
      "Minecraft, Backrooms, Grounded, Siêu thị, Pokemon",
      "Siêu thị, Grounded, Backrooms, Minecraft, Pokemon",
      "Grounded, Backrooms, Minecraft, Pokemon, Siêu thị",
    ],
    correct: 0, // Thay số này bằng vị trí đáp án đúng (0 là câu đầu tiên)
  },

  {
    question: "Câu 18: Điều gì đã khiến anh suýt không thể vào Huế thăm em?",
    answers: [
      "Do anh bị ốm",
      "Do Lũ lụt",
      "Do mình cãi nhau",
      "Do không đặt được vé",
    ],
    correct: 2,
  },

  {
    question: "Câu 19: Mình gặp nhau ở Huế vào ngày bao nhiu, bbi nhớ hong?",
    answers: ["21/11/2025", "24/12/2025", "20/11/2025", "1/1/2026"],
    correct: 0,
  },

  {
    question: "Câu 20: Món ăn đầu tiên anh ăn ở Huế là gì?",
    answers: ["Bánh bèo", "Cơm hến", "Bún bò Huế", "Nem lụi"],
    correct: 2,
  },

  {
    type: "input",
    question:
      "Câu 21: Tô trong ảnh có giá là bao nhiu? (Em nhập 10, 20, 30 hoặc 40, 50(k) nha) <br><img src='assets/images/questpics/bunbo.jpg' class='question-img'>",
    correct: ["20", "20k", "20.000", "20.000đ", "20kđ"],
  },

  {
    question:
      "Câu 22: Công nghệ lấy nước trong hình là của quán ăn nào =)) ? <br><img src='assets/images/questpics/nuoc.jpg' class='question-img'>",
    answers: ["Cơm Vị Nhà", "Mì Cay Seoul", "Tacos Juicy", "Bánh Ép Gia Di"],
    correct: 3,
  },
];

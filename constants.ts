
import { Theme } from './types';

export const THEMES: Theme[] = [
  {
    name: "Toán Học Trí Tuệ",
    questions: [
      { id: 1, content: "Tính: $ \\frac{1}{2} + \\frac{1}{4} $", options: ["$ \\frac{3}{4} $", "$ \\frac{2}{6} $", "$ \\frac{1}{3} $", "$ \\frac{2}{4} $"], correctIndex: 0 },
      { id: 2, content: "Tìm x biết: $ x : 5 = 12 $", options: ["x = 60", "x = 17", "x = 7", "x = 2.4"], correctIndex: 0 },
      { id: 3, content: "Diện tích hình vuông cạnh $ a = 5cm $ là bao nhiêu?", options: ["$ 20cm^2 $", "$ 25cm^2 $", "$ 10cm^2 $", "$ 15cm^2 $"], correctIndex: 1 },
      { id: 4, content: "Số nào là số nguyên tố nhỏ nhất?", options: ["0", "1", "2", "3"], correctIndex: 2 },
      { id: 5, content: "Tính: $ 2^3 + 3^2 $", options: ["12", "15", "17", "18"], correctIndex: 2 },
      { id: 6, content: "Phân số nào lớn nhất?", options: ["$ \\frac{1}{2} $", "$ \\frac{2}{3} $", "$ \\frac{3}{4} $", "$ \\frac{4}{5} $"], correctIndex: 3 },
      { id: 7, content: "Giá trị của $ \\pi $ xấp xỉ bao nhiêu?", options: ["3.12", "3.14", "3.16", "3.18"], correctIndex: 1 },
      { id: 8, content: "Căn bậc hai của 144 là?", options: ["10", "11", "12", "14"], correctIndex: 2 },
      { id: 9, content: "Một tam giác có mấy đường cao?", options: ["1", "2", "3", "4"], correctIndex: 2 },
      { id: 10, content: "Giải phương trình: $ 2x - 4 = 0 $", options: ["x = 1", "x = 2", "x = 4", "x = -2"], correctIndex: 1 },
      { id: 11, content: "Tỉ lệ thức $ a:b = c:d $ tương đương với?", options: ["$ ad = bc $", "$ ab = cd $", "$ ac = bd $", "$ a+d = b+c $"], correctIndex: 0 },
      { id: 12, content: "Số nghịch đảo của $ \\frac{3}{5} $ là?", options: ["$ -\\frac{3}{5} $", "$ \\frac{5}{3} $", "$ 1 $", "$ 0 $"], correctIndex: 1 }
    ]
  },
  {
    name: "Khoa Học & Tự Nhiên",
    questions: [
      { id: 101, content: "Hành tinh nào gần Mặt Trời nhất?", options: ["Kim tinh", "Thủy tinh", "Hỏa tinh", "Trái Đất"], correctIndex: 1 },
      { id: 102, content: "Nhiệt độ sôi của nước tinh khiết là?", options: ["90°C", "100°C", "110°C", "120°C"], correctIndex: 1 },
      { id: 103, content: "Khí nào chiếm tỉ lệ cao nhất trong không khí?", options: ["Oxy", "Nitơ", "Cacbonic", "Argon"], correctIndex: 1 },
      { id: 104, content: "Ai là người tìm ra Định luật Vạn vật hấp dẫn?", options: ["Einstein", "Newton", "Galileo", "Edison"], correctIndex: 1 },
      { id: 105, content: "Cơ quan nào trong cơ thể lọc máu?", options: ["Tim", "Phổi", "Gan", "Thận"], correctIndex: 3 },
      { id: 106, content: "Vật chất tồn tại ở mấy trạng thái cơ bản?", options: ["2", "3", "4", "5"], correctIndex: 1 },
      { id: 107, content: "Ánh sáng đi từ Mặt Trời đến Trái Đất mất bao lâu?", options: ["8 giây", "8 phút", "8 giờ", "8 ngày"], correctIndex: 1 },
      { id: 108, content: "Công thức hóa học của muối ăn là?", options: ["NaCl", "H2O", "HCl", "NaOH"], correctIndex: 0 },
      { id: 109, content: "Đơn vị đo cường độ dòng điện là?", options: ["Vôn", "Oát", "Ampe", "Ôm"], correctIndex: 2 },
      { id: 110, content: "Năng lượng hóa thạch gồm loại nào?", options: ["Gió", "Mặt trời", "Than đá", "Sóng biển"], correctIndex: 2 },
      { id: 111, content: "Máu người có màu đỏ do chứa chất gì?", options: ["Sắt", "Đồng", "Kẽm", "Hemoglobin"], correctIndex: 3 },
      { id: 112, content: "Lực đẩy Archimedes xuất hiện trong môi trường nào?", options: ["Chất lỏng", "Chất rắn", "Chân không", "Mọi nơi"], correctIndex: 0 }
    ]
  }
];

export interface ReviewerRole {
  id: string;
  displayName: string;
  fullTitle: string;
  position: string;
  role: string;
  perspectives: string[];
}

export const REVIEWER_ROLES: ReviewerRole[] = [
  {
    id: "nguyen-thi-kim-ngoc",
    displayName: "Bà Nguyễn Thị Kim Ngọc – Trưởng ban",
    fullTitle: "Bà Nguyễn Thị Kim Ngọc – Quyền Hiệu trưởng – Trưởng ban",
    position: "Quyền Hiệu trưởng",
    role: "Trưởng ban",
    perspectives: [
      "Tính chiến lược của sản phẩm",
      "Khả năng phục vụ mục tiêu chuyển đổi số toàn trường",
      "Tác động đến chất lượng đào tạo, quản trị và hình ảnh MITC",
      "Khả năng nhân rộng toàn trường",
      "Tính phù hợp với định hướng phát triển chung",
      "Tính chính danh, tính khả thi và khả năng triển khai chính thức",
    ],
  },
  {
    id: "le-kim-anh",
    displayName: "Ông Lê Kim Anh – Phó Trưởng ban",
    fullTitle: "Ông Lê Kim Anh – Phó Hiệu trưởng – Phó Trưởng ban",
    position: "Phó Hiệu trưởng",
    role: "Phó Trưởng ban",
    perspectives: [
      "Hiệu quả trong điều hành chuyên môn",
      "Tác động đến đổi mới giảng dạy, học tập, quản lý đào tạo",
      "Khả năng phối hợp liên đơn vị",
      "Khả năng triển khai trong học kỳ tới",
      "Tính phù hợp với thực tiễn tổ chức đào tạo tại MITC",
      "Tác động đến chất lượng hoạt động chuyên môn",
    ],
  },
  {
    id: "nguyen-trung-hoa",
    displayName: "Ông Nguyễn Trung Hoà – Thành viên",
    fullTitle: "Ông Nguyễn Trung Hoà – Giám đốc Trung tâm Đào tạo và Hợp tác Quốc tế – Thành viên",
    position: "Giám đốc Trung tâm Đào tạo và Hợp tác Quốc tế",
    role: "Thành viên",
    perspectives: [
      "Mức độ đóng góp cho chuyển đổi số MITC",
      "Khả năng tổ chức đào tạo, tập huấn, tư vấn kỹ thuật, chuyển giao cho viên chức và người lao động",
      "Tiềm năng chuẩn hóa thành mô hình triển khai nội bộ",
      "Khả năng truyền thông, quảng bá, hợp tác, nhân rộng",
      "Khả năng phát triển thành công cụ dùng thực tế trong nhà trường",
      "Tính phù hợp với hệ sinh thái AI/chuyển đổi số của MITC",
    ],
  },
  {
    id: "huynh-manh-nhan",
    displayName: "Ông Huỳnh Mạnh Nhân – Thành viên",
    fullTitle: "Ông Huỳnh Mạnh Nhân – Giám đốc Trung tâm Tuyển sinh và Quan hệ doanh nghiệp, Th.S Công nghệ thông tin – Thành viên",
    position: "Giám đốc Trung tâm Tuyển sinh và Quan hệ doanh nghiệp, Th.S Công nghệ thông tin",
    role: "Thành viên",
    perspectives: [
      "Kiến trúc kỹ thuật của sản phẩm",
      "Mức độ làm chủ công nghệ",
      "Cách tích hợp GenAI: System Prompt, RAG, nhúng dữ liệu riêng, API, workflow tự động",
      "Chất lượng UX/UI",
      "Tính ổn định của link/tài khoản test",
      "Khả năng mở rộng, bảo trì, vận hành lâu dài",
      "Bảo mật dữ liệu",
      "Rủi ro phụ thuộc nền tảng bên thứ ba",
      "Chi phí kỹ thuật nếu nhân rộng",
      "Kiểm soát hallucination",
      "Tính thực tế khi triển khai thành sản phẩm công nghệ dùng thường xuyên",
    ],
  },
  {
    id: "vo-anh-khue",
    displayName: "Ông Võ Anh Khuê – Thư ký",
    fullTitle: "Ông Võ Anh Khuê – Phó Trưởng phòng Quản lý chất lượng và Nghiên cứu khoa học – Thư ký",
    position: "Phó Trưởng phòng Quản lý chất lượng và Nghiên cứu khoa học",
    role: "Thư ký",
    perspectives: [
      "Tính đầy đủ của hồ sơ",
      "Tính logic, mạch lạc của bản thuyết minh",
      "Chất lượng minh chứng",
      "Có đủ mô tả tính năng, phạm vi ứng dụng, hiệu quả, minh chứng, link sử dụng hay chưa",
      "Có thuận lợi cho tổng hợp điểm, lập biên bản, báo cáo kết quả hay không",
      "Có đủ căn cứ để Hội đồng đối chiếu tiêu chí hay chưa",
      "Hình thức trình bày, tính chuẩn hóa, tính kiểm chứng của hồ sơ",
    ],
  },
];

export function getRoleById(id: string): ReviewerRole | undefined {
  return REVIEWER_ROLES.find((r) => r.id === id);
}

export function getRoleDescription(role: ReviewerRole): string {
  return `${role.fullTitle}\nChức danh: ${role.position}\nVai trò trong Hội đồng: ${role.role}\n\nGóc nhìn đánh giá bổ sung:\n${role.perspectives.map((p) => `- ${p}`).join("\n")}`;
}

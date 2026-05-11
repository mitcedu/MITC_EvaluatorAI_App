export interface Criterion {
  id: number;
  name: string;
  maxScore: number;
  group: string;
  groupId: number;
  description: string;
  scoringGuide: string;
}

export const CRITERIA: Criterion[] = [
  {
    id: 1, name: "Mức độ cấp thiết và giải quyết vấn đề", maxScore: 10, group: "Tính thực tiễn và hiệu quả ứng dụng", groupId: 1,
    description: "Sản phẩm bám sát thực trạng; giải quyết đúng nỗi đau trong công tác giảng dạy, quản lý chuyên môn, tuyển sinh hoặc hoạt động chuyên môn tại MITC.",
    scoringGuide: "0–3: Không nêu rõ vấn đề hoặc vấn đề mơ hồ. 4–6: Có vấn đề nhưng chưa chứng minh rõ tính cấp thiết. 7–8: Vấn đề rõ, phù hợp thực tiễn đơn vị. 9–10: Vấn đề rất cấp thiết, bám sát pain-point cụ thể tại MITC."
  },
  {
    id: 2, name: "Hiệu quả thực tế có minh chứng", maxScore: 15, group: "Tính thực tiễn và hiệu quả ứng dụng", groupId: 1,
    description: "Sản phẩm giúp tối ưu thời gian, giảm tải thủ công, nâng cao chất lượng; có số liệu, phản hồi, video, hình ảnh, link minh chứng.",
    scoringGuide: "0–3: Không nêu hiệu quả. 4–7: Chỉ nêu hiệu quả dự kiến, chưa có minh chứng. 8–11: Có mô tả hiệu quả nhưng minh chứng còn hạn chế. 12–15: Có số liệu, phản hồi, video/link minh chứng rõ ràng."
  },
  {
    id: 3, name: "Tiềm năng nhân rộng và phát triển", maxScore: 15, group: "Tính thực tiễn và hiệu quả ứng dụng", groupId: 1,
    description: "Có thể chuyển giao, áp dụng cho nhiều khoa/bộ môn/phòng/trung tâm; có khả năng triển khai toàn trường.",
    scoringGuide: "0–3: Chỉ dùng cục bộ, khó nhân rộng. 4–7: Có thể mở rộng nhưng chưa rõ điều kiện. 8–11: Có định hướng nhân rộng tương đối rõ. 12–15: Tiềm năng nhân rộng cao, có điều kiện triển khai rõ."
  },
  {
    id: 4, name: "Kỹ năng làm chủ và tích hợp GenAI", maxScore: 15, group: "Chất lượng công nghệ và trải nghiệm", groupId: 2,
    description: "Không chỉ hỏi đáp cơ bản; có sử dụng dữ liệu riêng, System Prompt, RAG, API, workflow; có thiết kế quy trình AI phục vụ thực tế.",
    scoringGuide: "0–3: Dùng AI đơn giản, chưa có thiết kế rõ. 4–7: Có dùng GenAI nhưng chủ yếu thủ công. 8–11: Có prompt/system prompt/quy trình tương đối tốt. 12–15: Có tích hợp sâu, dữ liệu riêng, workflow, API hoặc kiến trúc kỹ thuật rõ."
  },
  {
    id: 5, name: "Giao diện và trải nghiệm người dùng", maxScore: 10, group: "Chất lượng công nghệ và trải nghiệm", groupId: 2,
    description: "Đường dẫn/tài khoản hoạt động; giao diện dễ dùng; phù hợp với sinh viên, giảng viên, viên chức; có hướng dẫn thao tác.",
    scoringGuide: "0–2: Không có link hoặc không truy cập được. 3–5: Có giao diện nhưng khó dùng. 6–8: Dễ sử dụng, thao tác rõ. 9–10: UX tốt, thân thiện, có hướng dẫn rõ ràng."
  },
  {
    id: 6, name: "Độ chính xác của chuyên môn", maxScore: 5, group: "Chất lượng công nghệ và trải nghiệm", groupId: 2,
    description: "Nội dung AI tạo ra đúng chuyên môn, sư phạm, khoa học, nghiệp vụ; có kiểm duyệt bởi nhóm tác giả.",
    scoringGuide: "0–1: Không đề cập kiểm duyệt chuyên môn. 2–3: Có đề cập nhưng chưa chứng minh rõ. 4–5: Có quy trình kiểm duyệt/chứng minh độ chính xác rõ."
  },
  {
    id: 7, name: "Tính đầy đủ, logic của báo cáo", maxScore: 10, group: "Chất lượng hồ sơ báo cáo", groupId: 3,
    description: "Có đủ mô tả tính năng, phạm vi ứng dụng, hiệu quả, minh chứng, link sử dụng nếu có; bố cục chuyên nghiệp, trình bày mạch lạc.",
    scoringGuide: "0–2: Thiếu nhiều mục quan trọng. 3–5: Có nội dung nhưng rời rạc. 6–8: Tương đối đầy đủ, logic. 9–10: Đầy đủ, chuyên nghiệp, dễ chấm."
  },
  {
    id: 8, name: "Tính khả thi của kế hoạch triển khai", maxScore: 5, group: "Chất lượng hồ sơ báo cáo", groupId: 3,
    description: "Lộ trình triển khai hợp lý; có khả năng thực thi trong học kỳ tới; có điều kiện triển khai rõ.",
    scoringGuide: "0–1: Không có kế hoạch. 2–3: Có kế hoạch nhưng chung chung. 4–5: Kế hoạch rõ, khả thi, có mốc/điều kiện triển khai."
  },
  {
    id: 9, name: "Bảo vệ dữ liệu, quy chế, nguyên tắc sư phạm", maxScore: 10, group: "Tuân thủ, bảo mật và đạo đức", groupId: 4,
    description: "Không làm lộ dữ liệu nội bộ; không làm lộ thông tin cá nhân; tuân thủ bản quyền; có nguyên tắc sư phạm rõ.",
    scoringGuide: "0–2: Không đề cập bảo mật/quy chế. 3–5: Có đề cập nhưng chưa cụ thể. 6–8: Có biện pháp tương đối rõ. 9–10: Có nguyên tắc, biện pháp, cảnh báo và cơ chế bảo vệ dữ liệu rõ."
  },
  {
    id: 10, name: "Kiểm soát rủi ro AI/hallucination", maxScore: 5, group: "Tuân thủ, bảo mật và đạo đức", groupId: 4,
    description: "Có guardrails; có quy tắc ràng buộc AI; ngăn AI bịa đặt, trả lời sai lệch; có cách xử lý khi AI không chắc chắn.",
    scoringGuide: "0–1: Không đề cập. 2–3: Có đề cập nhưng chưa rõ guardrails. 4–5: Có quy tắc ràng buộc, phạm vi trả lời, cảnh báo và xử lý khi không chắc chắn."
  },
];

export const CRITERIA_GROUPS = [
  { id: 1, name: "Tính thực tiễn và hiệu quả ứng dụng", maxScore: 40 },
  { id: 2, name: "Chất lượng công nghệ và trải nghiệm", maxScore: 30 },
  { id: 3, name: "Chất lượng hồ sơ báo cáo", maxScore: 15 },
  { id: 4, name: "Tuân thủ, bảo mật và đạo đức", maxScore: 15 },
];

export function getScoreLevel(score: number): string {
  if (score >= 90) return "Xuất sắc";
  if (score >= 80) return "Tốt";
  if (score >= 65) return "Khá/Đạt";
  if (score >= 50) return "Cần bổ sung";
  return "Chưa đủ căn cứ đánh giá tốt";
}

export function getScoreLevelColor(score: number): string {
  if (score >= 90) return "text-emerald-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 65) return "text-yellow-600";
  if (score >= 50) return "text-orange-600";
  return "text-red-600";
}

import { EvaluationResult } from "@/types/evaluation";
import { BRANDING } from "./branding";

export function generateMarkdownReport(result: EvaluationResult): string {
  const m = result.metadata;
  const o = result.overall;

  let md = `# BÁO CÁO ĐÁNH GIÁ THAM KHẢO SẢN PHẨM DỰ THI AI\n\n`;
  md += `**${BRANDING.governingBody}**\n`;
  md += `**${BRANDING.organizationName}**\n`;
  md += `**${BRANDING.appNameShort}**\n\n`;
  md += `---\n\n`;
  md += `- **Thời gian đánh giá:** ${new Date(m.evaluationDate).toLocaleString("vi-VN")}\n`;
  md += `- **Vai trò người đánh giá:** ${m.reviewerRoleDisplay}\n\n`;

  md += `## I. THÔNG TIN SẢN PHẨM (AI TỰ NHẬN DIỆN)\n\n`;
  md += `| Thông tin | Nội dung |\n|---|---|\n`;
  md += `| Tên sản phẩm | ${m.productName || "Không tìm thấy"} |\n`;
  md += `| Đơn vị | ${m.unitName || "Không tìm thấy"} |\n`;
  md += `| Tác giả chính | ${m.mainAuthor || "Không tìm thấy"} |\n`;
  md += `| Thành viên | ${m.members || "Không tìm thấy"} |\n`;
  md += `| Loại hình SP | ${m.productType || "Không tìm thấy"} |\n`;
  md += `| Công cụ GenAI | ${m.aiToolsUsed || "Không tìm thấy"} |\n`;
  md += `| Lĩnh vực | ${m.applicationArea || "Không tìm thấy"} |\n`;
  md += `| Đối tượng | ${m.targetUsers || "Không tìm thấy"} |\n`;
  md += `| Link SP | ${m.productLink || "Không có"} |\n`;
  md += `| Tài khoản test | ${m.testAccount || "Không có"} |\n`;
  md += `| Trạng thái nhận diện | ${m.detectedInfoStatus} |\n\n`;

  md += `## II. TÓM TẮT ĐIỀU HÀNH\n\n`;
  md += `- **Tổng điểm đề xuất:** ${o.totalScore}/${o.maxScore}\n`;
  md += `- **Mức đánh giá:** ${o.level}\n`;
  md += `- **Tiềm năng giải thưởng:** ${o.awardPotential}\n\n`;
  md += `${o.executiveSummary}\n\n`;

  md += `## III. BẢNG ĐIỂM TỔNG HỢP\n\n`;
  md += `| Nhóm | Điểm | Tối đa |\n|---|---|---|\n`;
  result.groupScores.forEach((g) => { md += `| ${g.groupName} | ${g.score} | ${g.maxScore} |\n`; });
  md += `| **TỔNG** | **${o.totalScore}** | **100** |\n\n`;

  md += `## IV. CHI TIẾT 10 TIÊU CHÍ\n\n`;
  result.criteriaScores.forEach((c) => {
    md += `### ${c.id}. ${c.criterion} (${c.score}/${c.maxScore}) — Mức tự tin: ${c.confidence}\n\n`;
    md += `${c.comment}\n\n`;
    if (c.evidence) md += `**Bằng chứng:** ${c.evidence}\n\n`;
    if (c.missingInfo) md += `**Thiếu sót:** ${c.missingInfo}\n\n`;
    if (c.recommendation) md += `**Khuyến nghị:** ${c.recommendation}\n\n`;
  });

  md += `## V. ĐIỂM MẠNH\n\n`;
  result.strengths.forEach((s, i) => { md += `${i + 1}. ${s}\n`; });

  md += `\n## VI. ĐIỂM HẠN CHẾ\n\n`;
  result.weaknesses.forEach((w, i) => { md += `${i + 1}. ${w}\n`; });

  md += `\n## VII. GÓC NHÌN THEO VAI TRÒ\n\n`;
  md += `**${result.roleBasedPerspective.reviewerRoleFull}**\n\n`;
  result.roleBasedPerspective.comments.forEach((c) => { md += `- ${c}\n`; });

  md += `\n## VIII. CÂU HỎI GỢI Ý CHO HỘI ĐỒNG\n\n`;
  md += `**Hiệu quả:** ${result.councilQuestions.effectivenessQuestions.map((q,i) => `\n${i+1}. ${q}`).join("")}\n\n`;
  md += `**Công nghệ:** ${result.councilQuestions.technologyQuestions.map((q,i) => `\n${i+1}. ${q}`).join("")}\n\n`;
  md += `**Bảo mật:** ${result.councilQuestions.securityQuestions.map((q,i) => `\n${i+1}. ${q}`).join("")}\n\n`;
  md += `**Nhân rộng:** ${result.councilQuestions.scalabilityQuestions.map((q,i) => `\n${i+1}. ${q}`).join("")}\n\n`;

  md += `## IX. KHUYẾN NGHỊ HOÀN THIỆN\n\n`;
  md += `**Bổ sung ngay:**\n${result.improvementPlan.immediateAdditions.map((i) => `- ${i}`).join("\n")}\n\n`;
  md += `**Ngắn hạn (1-2 tuần):**\n${result.improvementPlan.shortTerm.map((i) => `- ${i}`).join("\n")}\n\n`;
  md += `**Trung hạn:**\n${result.improvementPlan.mediumTerm.map((i) => `- ${i}`).join("\n")}\n\n`;
  md += `**Dài hạn:**\n${result.improvementPlan.longTerm.map((i) => `- ${i}`).join("\n")}\n\n`;

  md += `## X. KẾT LUẬN\n\n`;
  md += `${result.finalRecommendation.summary}\n\n`;
  md += `---\n\n`;
  md += `> ${BRANDING.reportFooter}\n`;

  return md;
}

export function downloadJSON(result: EvaluationResult, filename: string): void {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyMarkdown(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

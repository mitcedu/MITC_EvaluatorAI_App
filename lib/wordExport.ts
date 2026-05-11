"use client";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  Header, Footer, PageNumber, NumberFormat,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { EvaluationResult } from "@/types/evaluation";
import { BRANDING } from "./branding";

const BLUE = "1e40af";
const TEAL = "0d9488";
const GRAY = "64748b";
const LIGHT_BG = "f1f5f9";
const WHITE = "ffffff";

function heading(text: string, level: typeof HeadingLevel.HEADING_1 = HeadingLevel.HEADING_1): Paragraph {
  return new Paragraph({ heading: level, spacing: { before: 300, after: 150 }, children: [new TextRun({ text, bold: true, color: BLUE })] });
}

function subheading(text: string): Paragraph {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 250, after: 100 }, children: [new TextRun({ text, bold: true, color: TEAL, size: 24 })] });
}

function para(text: string, opts?: { bold?: boolean; italic?: boolean; color?: string; size?: number }): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, bold: opts?.bold, italics: opts?.italic, color: opts?.color || "333333", size: opts?.size || 22 })],
  });
}

function bullet(text: string, opts?: { bold?: boolean; color?: string }): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, bold: opts?.bold, color: opts?.color || "333333", size: 22 })],
  });
}

function labelValue(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, color: GRAY, size: 22 }),
      new TextRun({ text: value || "Không tìm thấy trong báo cáo", size: 22 }),
    ],
  });
}

function cellP(text: string, opts?: { bold?: boolean; color?: string; alignment?: typeof AlignmentType.CENTER }): Paragraph {
  return new Paragraph({
    alignment: opts?.alignment,
    children: [new TextRun({ text, bold: opts?.bold, color: opts?.color || "333333", size: 20 })],
  });
}

function headerCell(text: string): TableCell {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: BLUE },
    children: [cellP(text, { bold: true, color: WHITE, alignment: AlignmentType.CENTER })],
    verticalAlign: "center",
  });
}

function dataCell(text: string, opts?: { shading?: string; alignment?: typeof AlignmentType.CENTER }): TableCell {
  return new TableCell({
    shading: opts?.shading ? { type: ShadingType.SOLID, color: opts.shading } : undefined,
    children: [cellP(text, { alignment: opts?.alignment })],
    verticalAlign: "center",
  });
}

function divider(): Paragraph {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" } },
    children: [new TextRun({ text: "" })],
  });
}

export async function exportToWord(result: EvaluationResult): Promise<void> {
  const m = result.metadata;
  const o = result.overall;
  const now = new Date(m.evaluationDate).toLocaleString("vi-VN");

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Times New Roman", size: 26 } },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1) },
          pageNumbers: { start: 1 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: BRANDING.appNameShort, italics: true, color: GRAY, size: 16 })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: BRANDING.reportFooter, italics: true, color: GRAY, size: 16 }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Trang ", size: 16, color: GRAY }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY }),
                new TextRun({ text: " / ", size: 16, color: GRAY }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: GRAY }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ========== TITLE PAGE ==========
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: BRANDING.governingBody, bold: true, size: 26 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [new TextRun({ text: BRANDING.organizationName, bold: true, size: 26 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [new TextRun({ text: "───────  ✦  ───────", color: BLUE, size: 22 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "BÁO CÁO KẾT QUẢ ĐÁNH GIÁ", bold: true, color: BLUE, size: 36 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 60 },
          children: [new TextRun({ text: "SẢN PHẨM DỰ THI HỘI THI ỨNG DỤNG TRÍ TUỆ NHÂN TẠO (AI)", bold: true, color: BLUE, size: 28 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 60 },
          children: [new TextRun({ text: "TRONG GIẢNG DẠY VÀ QUẢN LÝ", bold: true, color: BLUE, size: 28 })],
        }),
        new Paragraph({ spacing: { after: 100 }, children: [] }),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [new TextRun({ text: `Sản phẩm: ${m.productName || "Chưa xác định"}`, bold: true, size: 28, color: TEAL })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [new TextRun({ text: `Đơn vị: ${m.unitName || "Chưa xác định"}`, size: 24 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [new TextRun({ text: `Người đánh giá: ${m.reviewerRoleDisplay}`, size: 24 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: `Ngày đánh giá: ${now}`, size: 22, italics: true, color: GRAY })],
        }),

        // Disclaimer box
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 300 },
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" }, left: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" }, right: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" } },
          shading: { type: ShadingType.SOLID, color: "fffbeb" },
          children: [new TextRun({ text: `⚠ ${BRANDING.disclaimer}`, italics: true, color: "92400e", size: 20 })],
        }),

        divider(),

        // ========== I. THÔNG TIN SẢN PHẨM ==========
        heading("I. THÔNG TIN SẢN PHẨM DỰ THI"),
        para("(Thông tin do AI tự nhận diện từ nội dung bản thuyết minh)", { italic: true, color: GRAY, size: 20 }),
        labelValue("Tên sản phẩm", m.productName),
        labelValue("Đơn vị", m.unitName),
        labelValue("Tác giả chính", m.mainAuthor),
        labelValue("Thành viên nhóm", m.members),
        labelValue("Công cụ GenAI sử dụng", m.aiToolsUsed),
        labelValue("Loại hình sản phẩm", m.productType),
        labelValue("Lĩnh vực ứng dụng", m.applicationArea),
        labelValue("Đối tượng sử dụng", m.targetUsers),
        labelValue("Link sản phẩm", m.productLink),
        labelValue("Tài khoản test", m.testAccount),
        labelValue("Trạng thái nhận diện thông tin", m.detectedInfoStatus),
        ...(m.missingMetadata?.length ? [
          para("Thông tin chưa tìm thấy trong báo cáo:", { bold: true, color: "dc2626", size: 20 }),
          ...m.missingMetadata.map((mm) => bullet(mm, { color: "dc2626" })),
        ] : []),

        divider(),

        // ========== II. TÓM TẮT ĐIỀU HÀNH ==========
        heading("II. TÓM TẮT KẾT QUẢ ĐÁNH GIÁ"),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 100, after: 60 },
          children: [
            new TextRun({ text: "TỔNG ĐIỂM ĐỀ XUẤT: ", bold: true, size: 32 }),
            new TextRun({ text: `${o.totalScore}`, bold: true, size: 48, color: o.totalScore >= 80 ? "059669" : o.totalScore >= 65 ? TEAL : o.totalScore >= 50 ? "f59e0b" : "dc2626" }),
            new TextRun({ text: ` / ${o.maxScore}`, size: 32, color: GRAY }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [
            new TextRun({ text: `Mức đánh giá: ${o.level}`, bold: true, size: 26, color: TEAL }),
            new TextRun({ text: `   |   Tiềm năng giải thưởng: ${o.awardPotential}`, size: 24, color: GRAY }),
          ],
        }),
        new Paragraph({
          spacing: { before: 120, after: 120 },
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" }, left: { style: BorderStyle.SINGLE, size: 2, color: "ea580c" }, right: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" } },
          shading: { type: ShadingType.SOLID, color: "fff7ed" },
          children: [
            new TextRun({ text: "⚠ LƯU Ý QUAN TRỌNG: ", bold: true, color: "c2410c", size: 22 }),
            new TextRun({ text: "Kết quả đánh giá này mới chỉ dựa trên nội dung bản thuyết minh/báo cáo của sản phẩm dự thi. ", bold: true, color: "9a3412", size: 22 }),
            new TextRun({ text: "Thành viên Hội đồng cần trực tiếp trải nghiệm ứng dụng/giải pháp để kết hợp đưa ra sự đánh giá công tâm và sát thực tế hơn.", bold: true, color: "9a3412", size: 22 }),
          ],
        }),
        para(o.executiveSummary),

        divider(),

        // ========== III. BẢNG ĐIỂM TỔNG HỢP ==========
        heading("III. BẢNG ĐIỂM TỔNG HỢP THEO NHÓM TIÊU CHÍ"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [headerCell("STT"), headerCell("Nhóm tiêu chí"), headerCell("Điểm"), headerCell("Tối đa"), headerCell("Nhận xét")] }),
            ...result.groupScores.map((g, i) => new TableRow({
              children: [
                dataCell(`${i + 1}`, { alignment: AlignmentType.CENTER }),
                dataCell(g.groupName),
                dataCell(`${g.score}`, { alignment: AlignmentType.CENTER, shading: g.score / g.maxScore >= 0.8 ? "dcfce7" : g.score / g.maxScore >= 0.6 ? "fef9c3" : "fee2e2" }),
                dataCell(`${g.maxScore}`, { alignment: AlignmentType.CENTER }),
                dataCell(g.comment),
              ],
            })),
            new TableRow({
              children: [
                dataCell("", { shading: LIGHT_BG }),
                new TableCell({ shading: { type: ShadingType.SOLID, color: LIGHT_BG }, children: [cellP("TỔNG CỘNG", { bold: true })] }),
                new TableCell({ shading: { type: ShadingType.SOLID, color: LIGHT_BG }, children: [cellP(`${o.totalScore}`, { bold: true, alignment: AlignmentType.CENTER })] }),
                new TableCell({ shading: { type: ShadingType.SOLID, color: LIGHT_BG }, children: [cellP("100", { bold: true, alignment: AlignmentType.CENTER })] }),
                dataCell("", { shading: LIGHT_BG }),
              ],
            }),
          ],
        }),

        divider(),

        // ========== IV. CHI TIẾT 10 TIÊU CHÍ ==========
        heading("IV. CHI TIẾT ĐÁNH GIÁ THEO 10 TIÊU CHÍ"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [headerCell("TC"), headerCell("Tiêu chí"), headerCell("Điểm"), headerCell("Max"), headerCell("Mức tự tin"), headerCell("Nhận xét")] }),
            ...result.criteriaScores.map((c) => new TableRow({
              children: [
                dataCell(`${c.id}`, { alignment: AlignmentType.CENTER }),
                dataCell(c.criterion),
                dataCell(`${c.score}`, { alignment: AlignmentType.CENTER, shading: c.score / c.maxScore >= 0.8 ? "dcfce7" : c.score / c.maxScore >= 0.6 ? "fef9c3" : "fee2e2" }),
                dataCell(`${c.maxScore}`, { alignment: AlignmentType.CENTER }),
                dataCell(c.confidence, { alignment: AlignmentType.CENTER }),
                dataCell(c.comment),
              ],
            })),
          ],
        }),

        // Detail per criterion
        ...result.criteriaScores.flatMap((c) => [
          subheading(`${c.id}. ${c.criterion} — ${c.score}/${c.maxScore} điểm`),
          para(c.comment),
          ...(c.evidence ? [para(`Bằng chứng từ báo cáo: ${c.evidence}`, { italic: true, color: TEAL })] : []),
          ...(c.missingInfo ? [para(`Thiếu sót: ${c.missingInfo}`, { color: "dc2626" })] : []),
          ...(c.recommendation ? [para(`Khuyến nghị: ${c.recommendation}`, { color: "0369a1" })] : []),
        ]),

        divider(),

        // ========== V. ĐIỂM MẠNH ==========
        heading("V. ĐIỂM MẠNH CỦA SẢN PHẨM"),
        ...result.strengths.map((s) => bullet(s, { color: "059669" })),

        divider(),

        // ========== VI. ĐIỂM HẠN CHẾ ==========
        heading("VI. ĐIỂM HẠN CHẾ CẦN CẢI THIỆN"),
        ...result.weaknesses.map((w) => bullet(w, { color: "dc2626" })),

        divider(),

        // ========== VII. MA TRẬN BẰNG CHỨNG ==========
        heading("VII. MA TRẬN BẰNG CHỨNG ĐÁNH GIÁ"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [headerCell("TC"), headerCell("Tiêu chí"), headerCell("Bằng chứng từ báo cáo"), headerCell("Mức độ"), headerCell("Tác động đến điểm")] }),
            ...(result.evidenceMatrix || []).map((e) => new TableRow({
              children: [
                dataCell(`${e.criterionId}`, { alignment: AlignmentType.CENTER }),
                dataCell(e.criterion),
                dataCell(e.evidenceFromReport),
                dataCell(e.evidenceLevel, { alignment: AlignmentType.CENTER }),
                dataCell(e.impactOnScore),
              ],
            })),
          ],
        }),

        divider(),

        // ========== VIII. MỨC ĐỘ ĐẦY ĐỦ HỒ SƠ ==========
        heading("VIII. ĐÁNH GIÁ MỨC ĐỘ ĐẦY ĐỦ HỒ SƠ"),
        ...Object.entries(result.reportCompleteness)
          .filter(([k]) => k !== "comments")
          .map(([key, val]) => {
            const labels: Record<string, string> = {
              generalInfo: "Thông tin chung", featureDescription: "Mô tả tính năng", applicationScope: "Phạm vi ứng dụng",
              effectivenessEvidence: "Minh chứng hiệu quả", beforeAfterData: "Dữ liệu trước/sau", userFeedback: "Phản hồi người dùng",
              videoOrImageEvidence: "Video/hình ảnh minh chứng", productLinkOrTestAccount: "Link sản phẩm/tài khoản test",
              implementationPlan: "Kế hoạch triển khai", dataProtection: "Bảo vệ dữ liệu", aiGuardrails: "Guardrails AI",
              professionalAccuracy: "Chính xác chuyên môn", scalabilityPotential: "Tiềm năng nhân rộng",
            };
            return para(`${val ? "✅" : "❌"} ${labels[key] || key}`, { color: val ? "059669" : "dc2626" });
          }),
        ...(result.reportCompleteness.comments?.length ? [
          para("Ghi chú:", { bold: true }),
          ...result.reportCompleteness.comments.map((c) => bullet(c)),
        ] : []),

        divider(),

        // ========== IX. GÓC NHÌN THEO VAI TRÒ ==========
        heading("IX. NHẬN XÉT THEO VAI TRÒ NGƯỜI ĐÁNH GIÁ"),
        para(result.roleBasedPerspective.reviewerRoleFull, { bold: true, color: BLUE }),
        para(result.roleBasedPerspective.focus),
        ...(result.roleBasedPerspective.comments || []).map((c) => bullet(c)),
        ...(result.roleBasedPerspective.specificConcerns?.length ? [
          para("Mối quan tâm đặc biệt:", { bold: true, color: "dc2626" }),
          ...result.roleBasedPerspective.specificConcerns.map((c) => bullet(c, { color: "dc2626" })),
        ] : []),

        divider(),

        // ========== X. CÂU HỎI PHẢN BIỆN ==========
        heading("X. CÂU HỎI PHẢN BIỆN GỢI Ý CHO HỘI ĐỒNG"),
        subheading("A. Câu hỏi về hiệu quả ứng dụng"),
        ...(result.councilQuestions.effectivenessQuestions || []).map((q, i) => bullet(`${i + 1}. ${q}`)),
        subheading("B. Câu hỏi về công nghệ"),
        ...(result.councilQuestions.technologyQuestions || []).map((q, i) => bullet(`${i + 1}. ${q}`)),
        subheading("C. Câu hỏi về bảo mật và đạo đức"),
        ...(result.councilQuestions.securityQuestions || []).map((q, i) => bullet(`${i + 1}. ${q}`)),
        subheading("D. Câu hỏi về khả năng nhân rộng"),
        ...(result.councilQuestions.scalabilityQuestions || []).map((q, i) => bullet(`${i + 1}. ${q}`)),
        ...(result.councilQuestions.roleSpecificQuestions?.length ? [
          subheading("E. Câu hỏi theo vai trò"),
          ...result.councilQuestions.roleSpecificQuestions.map((q, i) => bullet(`${i + 1}. ${q}`)),
        ] : []),

        divider(),

        // ========== XI. ĐỀ NGHỊ ĐỐI VỚI TÁC GIẢ ==========
        heading("XI. ĐỀ NGHỊ ĐỐI VỚI TÁC GIẢ / NHÓM TÁC GIẢ"),
        subheading("A. Cần bổ sung ngay (trước khi trình Hội đồng)"),
        ...(result.improvementPlan.immediateAdditions || []).map((i) => bullet(i, { color: "dc2626" })),
        subheading("B. Cải thiện trong ngắn hạn (1-2 tuần)"),
        ...(result.improvementPlan.shortTerm || []).map((i) => bullet(i)),
        subheading("C. Phát triển trung hạn"),
        ...(result.improvementPlan.mediumTerm || []).map((i) => bullet(i)),
        subheading("D. Định hướng dài hạn"),
        ...(result.improvementPlan.longTerm || []).map((i) => bullet(i)),

        divider(),

        // ========== XII. KẾT LUẬN ==========
        heading("XII. KẾT LUẬN VÀ NHẬN ĐỊNH"),
        para(result.finalRecommendation.summary),
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({ text: "Tiềm năng giải thưởng: ", bold: true, size: 24 }),
            new TextRun({ text: result.finalRecommendation.awardPotential, bold: true, size: 24, color: TEAL }),
          ],
        }),
        ...(result.finalRecommendation.requiredAdditions?.length ? [
          para("Yêu cầu bổ sung trước khi xét giải:", { bold: true }),
          ...result.finalRecommendation.requiredAdditions.map((a) => bullet(a, { color: "dc2626" })),
        ] : []),

        new Paragraph({ spacing: { before: 200 }, children: [] }),

        // Final disclaimer
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" }, left: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" }, right: { style: BorderStyle.SINGLE, size: 1, color: "f59e0b" } },
          shading: { type: ShadingType.SOLID, color: "fffbeb" },
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: `⚠ ${result.finalRecommendation.finalNote}`, italics: true, color: "92400e", size: 20 })],
        }),

        // Signature area
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "NGƯỜI ĐÁNH GIÁ", bold: true, size: 22 })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký, ghi rõ họ tên)", italics: true, size: 18, color: GRAY })] }),
                    new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: m.reviewerRoleDisplay.split(" – ")[0]?.replace(/^(Bà|Ông)\s+/, "") || "", size: 22 })] }),
                  ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "XÁC NHẬN CỦA HỘI ĐỒNG", bold: true, size: 22 })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký, đóng dấu)", italics: true, size: 18, color: GRAY })] }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `BaoCao_DanhGia_${(m.productName || "SanPham").replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/g, "_")}_${new Date().toISOString().slice(0, 10)}.docx`;
  saveAs(blob, filename);
}

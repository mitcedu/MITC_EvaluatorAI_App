import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { getRoleById } from "@/lib/roles";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { parseAIResponse } from "@/lib/jsonRepair";
import { callGeminiWithRotation, getKeyStats } from "@/lib/apiKeyManager";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 phút cho retry nhiều key

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (name.endsWith(".pdf")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (name.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  throw new Error("Định dạng file không được hỗ trợ. Vui lòng dùng .docx, .pdf hoặc .txt");
}

async function callOpenAIAPI(system: string, user: string): Promise<string> {
  const apiKey = process.env.AI_API_KEY_1 || process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || "gpt-4o";

  if (!apiKey) throw new Error("Chưa cấu hình API Key cho OpenAI. Vui lòng liên hệ quản trị viên.");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
      max_tokens: 16384,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Lỗi từ OpenAI (mã ${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;
    const roleId = formData.get("reviewerRole") as string;

    if (!roleId) {
      return NextResponse.json(
        { error: "Vui lòng chọn vai trò người đánh giá trước khi phân tích." },
        { status: 400 }
      );
    }

    const role = getRoleById(roleId);
    if (!role) {
      return NextResponse.json(
        { error: "Vai trò không hợp lệ. Vui lòng chọn lại từ danh sách." },
        { status: 400 }
      );
    }

    let reportText = "";

    if (file && file.size > 0) {
      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File quá lớn (vượt 4MB). Vui lòng nén file hoặc sao chép nội dung và dán trực tiếp vào ô văn bản." },
          { status: 400 }
        );
      }
      try {
        reportText = await extractText(file);
      } catch (e) {
        return NextResponse.json({
          error: `Không thể đọc nội dung file. Vui lòng thử:\n• Chuyển sang định dạng .docx hoặc .txt\n• Hoặc sao chép nội dung và dán trực tiếp vào ô văn bản\n\nChi tiết: ${(e as Error).message}`,
        }, { status: 400 });
      }
    } else if (text && text.trim()) {
      reportText = text.trim();
    } else {
      return NextResponse.json(
        { error: "Vui lòng tải file bản thuyết minh hoặc dán nội dung văn bản để hệ thống phân tích." },
        { status: 400 }
      );
    }

    if (reportText.length < 100) {
      return NextResponse.json(
        { error: "Nội dung quá ngắn (dưới 100 ký tự). Vui lòng cung cấp bản thuyết minh đầy đủ hơn để AI có thể đánh giá chính xác." },
        { status: 400 }
      );
    }

    // Giới hạn nội dung quá dài
    if (reportText.length > 50000) {
      reportText = reportText.substring(0, 50000) + "\n\n[Nội dung đã được cắt ngắn do giới hạn xử lý]";
    }

    const { system, user: userPrompt } = buildSystemPrompt(role, reportText);

    const provider = process.env.AI_PROVIDER || "gemini";
    let responseText: string;

    if (provider === "openai") {
      responseText = await callOpenAIAPI(system, userPrompt);
    } else {
      // Sử dụng hệ thống xoay vòng 6 key
      const stats = getKeyStats();
      console.log(`[Analyze] Bắt đầu phân tích. Keys: ${stats.available}/${stats.total} khả dụng`);

      const geminiResult = await callGeminiWithRotation(system, userPrompt);
      responseText = geminiResult.text;

      console.log(`[Analyze] ✅ Hoàn tất. Key #${geminiResult.keyUsed}, model: ${geminiResult.modelUsed}, ${geminiResult.attempts} lần thử`);
    }

    if (!responseText) {
      return NextResponse.json(
        { error: "Hệ thống AI không trả về kết quả phân tích. Có thể nội dung báo cáo bị bộ lọc an toàn chặn. Vui lòng thử lại hoặc điều chỉnh nội dung." },
        { status: 500 }
      );
    }

    const result = parseAIResponse(responseText);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("[Analyze] Lỗi:", error);

    // Trả về thông báo lỗi tiếng Việt thân thiện
    const errorMsg = (error as Error).message;
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}

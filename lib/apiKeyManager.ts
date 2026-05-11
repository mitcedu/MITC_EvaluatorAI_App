/**
 * Smart API Key Manager — Xoay vòng 6 Key + Cooldown + Auto-Retry
 * Đảm bảo hệ thống luôn sẵn sàng khi 1 key bị quá tải hoặc hết quota.
 */

interface KeyState {
  key: string;
  index: number;
  failCount: number;
  cooldownUntil: number; // timestamp khi key sẵn sàng lại
}

// Trạng thái toàn cục (persist trong process lifecycle)
let keyStates: KeyState[] = [];
let currentIndex = 0;
let initialized = false;

/** Khởi tạo danh sách key từ env */
function initKeys(): void {
  if (initialized && keyStates.length > 0) return;

  keyStates = [];
  for (let i = 1; i <= 10; i++) {
    const key = process.env[`AI_API_KEY_${i}`];
    if (key && key.trim()) {
      keyStates.push({
        key: key.trim(),
        index: i,
        failCount: 0,
        cooldownUntil: 0,
      });
    }
  }

  // Fallback: dùng AI_API_KEY đơn lẻ nếu không có key đánh số
  if (keyStates.length === 0 && process.env.AI_API_KEY) {
    keyStates.push({
      key: process.env.AI_API_KEY.trim(),
      index: 1,
      failCount: 0,
      cooldownUntil: 0,
    });
  }

  // Khởi đầu random để phân tải đều
  if (keyStates.length > 0) {
    currentIndex = Math.floor(Math.random() * keyStates.length);
  }

  initialized = true;
  console.log(`[KeyManager] Đã khởi tạo ${keyStates.length} API key(s)`);
}

/** Lấy key khả dụng tiếp theo (Round-Robin + skip cooldown) */
function getNextAvailableKey(): KeyState | null {
  initKeys();
  const now = Date.now();
  const total = keyStates.length;

  for (let attempt = 0; attempt < total; attempt++) {
    currentIndex = (currentIndex + 1) % total;
    const ks = keyStates[currentIndex];
    if (now >= ks.cooldownUntil) {
      return ks;
    }
  }

  // Tất cả key đang cooldown → tìm key hết cooldown sớm nhất
  const earliest = keyStates.reduce((min, ks) =>
    ks.cooldownUntil < min.cooldownUntil ? ks : min
  );
  return earliest;
}

/** Đánh dấu key thất bại → cooldown */
function markKeyFailed(ks: KeyState, errorCode: number): void {
  ks.failCount += 1;

  // Cooldown tăng dần theo số lần fail liên tiếp
  let cooldownMs: number;
  if (errorCode === 429) {
    // Rate limit → cooldown dài hơn
    cooldownMs = Math.min(60000 * ks.failCount, 300000); // 1-5 phút
  } else if (errorCode === 503) {
    // Server overload → cooldown ngắn hơn
    cooldownMs = Math.min(30000 * ks.failCount, 120000); // 30s-2 phút
  } else {
    cooldownMs = 60000; // Mặc định 1 phút
  }

  ks.cooldownUntil = Date.now() + cooldownMs;
  console.log(`[KeyManager] Key #${ks.index} bị lỗi ${errorCode}, cooldown ${cooldownMs / 1000}s (fail count: ${ks.failCount})`);
}

/** Reset fail count khi key thành công */
function markKeySuccess(ks: KeyState): void {
  ks.failCount = 0;
  ks.cooldownUntil = 0;
}

/** Thống kê trạng thái keys */
function getKeyStats(): { total: number; available: number; cooldown: number } {
  initKeys();
  const now = Date.now();
  const available = keyStates.filter(ks => now >= ks.cooldownUntil).length;
  return {
    total: keyStates.length,
    available,
    cooldown: keyStates.length - available,
  };
}

// ============================================================
// Bảng thông báo lỗi tiếng Việt cho thành viên Hội đồng
// ============================================================

const ERROR_MESSAGES_VI: Record<number, string> = {
  400: "Nội dung báo cáo có vấn đề (quá dài, chứa ký tự đặc biệt hoặc định dạng không hỗ trợ). Vui lòng kiểm tra lại nội dung và thử lại.",
  401: "Khóa truy cập AI không hợp lệ hoặc đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên hệ thống.",
  403: "Tài khoản AI không có quyền truy cập model này. Vui lòng liên hệ quản trị viên.",
  404: "Model AI được chọn không tồn tại hoặc chưa được kích hoạt. Vui lòng liên hệ quản trị viên.",
  429: "Hệ thống AI đã vượt giới hạn số lần gọi. Vui lòng thử lại sau 1-2 phút.",
  500: "Lỗi nội bộ từ phía hệ thống AI. Vui lòng thử lại sau ít phút.",
  503: "Hệ thống AI đang quá tải do nhiều người dùng cùng lúc. Vui lòng thử lại sau 1-2 phút.",
};

function getVietnameseError(statusCode: number, rawMessage?: string): string {
  // Thông báo thân thiện cho Hội đồng
  const friendlyMsg = ERROR_MESSAGES_VI[statusCode];
  if (friendlyMsg) return friendlyMsg;

  // Fallback cho các mã lỗi khác
  if (statusCode >= 500) {
    return "Hệ thống AI gặp sự cố tạm thời. Vui lòng thử lại sau ít phút.";
  }
  if (statusCode >= 400) {
    return `Yêu cầu không hợp lệ (mã ${statusCode}). Vui lòng kiểm tra lại nội dung và thử lại.`;
  }
  return rawMessage || "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
}

// ============================================================
// Hàm gọi Gemini API với xoay vòng key + auto-retry
// ============================================================

interface GeminiCallResult {
  text: string;
  keyUsed: number;
  modelUsed: string;
  attempts: number;
}

export async function callGeminiWithRotation(
  system: string,
  userPrompt: string,
): Promise<GeminiCallResult> {
  initKeys();

  const primaryModel = process.env.AI_MODEL || "gemini-3.1-pro-preview";
  const fallbackModel = process.env.AI_MODEL_FALLBACK || "gemini-2.5-flash";

  // Thử tất cả key với model chính, rồi thử lại với model dự phòng
  const modelsToTry = [primaryModel, fallbackModel];
  let lastError = "";
  let totalAttempts = 0;

  for (const model of modelsToTry) {
    const maxRetries = keyStates.length;

    for (let retry = 0; retry < maxRetries; retry++) {
      const ks = getNextAvailableKey();
      if (!ks) break;

      totalAttempts++;

      // Nếu key đang cooldown, chờ một chút
      const now = Date.now();
      if (now < ks.cooldownUntil) {
        const waitTime = Math.min(ks.cooldownUntil - now, 5000);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      console.log(`[KeyManager] Thử Key #${ks.index} với model ${model} (lần thử ${totalAttempts})`);

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${ks.key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: userPrompt }] }],
              systemInstruction: { parts: [{ text: system }] },
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 16384,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

          if (text) {
            markKeySuccess(ks);
            console.log(`[KeyManager] ✅ Thành công với Key #${ks.index}, model ${model}`);
            return { text, keyUsed: ks.index, modelUsed: model, attempts: totalAttempts };
          }

          // Response OK nhưng không có text → thử key khác
          lastError = "AI không trả về nội dung. Có thể nội dung báo cáo bị chặn bởi bộ lọc an toàn.";
          markKeyFailed(ks, 500);
          continue;
        }

        // Xử lý lỗi
        const errorCode = response.status;
        const errorBody = await response.text().catch(() => "");

        markKeyFailed(ks, errorCode);

        if (errorCode === 429 || errorCode === 503) {
          // Có thể retry với key khác
          const stats = getKeyStats();
          console.log(`[KeyManager] Key #${ks.index} lỗi ${errorCode}. Keys khả dụng: ${stats.available}/${stats.total}`);
          lastError = getVietnameseError(errorCode);
          continue;
        }

        if (errorCode === 400) {
          // Lỗi nội dung → không retry
          lastError = getVietnameseError(400, errorBody);
          throw new Error(lastError);
        }

        if (errorCode === 401 || errorCode === 403) {
          // Key không hợp lệ → skip key, thử key khác
          ks.cooldownUntil = Date.now() + 3600000; // Disable 1 giờ
          lastError = getVietnameseError(errorCode);
          continue;
        }

        // Lỗi khác
        lastError = getVietnameseError(errorCode, errorBody);
        continue;

      } catch (err) {
        if ((err as Error).message === lastError) throw err; // Re-throw 400 errors
        
        // Network error
        markKeyFailed(ks, 500);
        lastError = `Lỗi kết nối đến hệ thống AI. Vui lòng kiểm tra kết nối mạng và thử lại.`;
        continue;
      }
    }

    // Hết key cho model này → log và thử model tiếp
    if (model === primaryModel) {
      console.log(`[KeyManager] ⚠️ Tất cả key đều thất bại với ${primaryModel}, chuyển sang ${fallbackModel}...`);
      // Reset cooldown cho round tiếp theo với model khác
      keyStates.forEach(ks => {
        if (ks.cooldownUntil > 0) {
          ks.cooldownUntil = Math.min(ks.cooldownUntil, Date.now() + 5000);
        }
      });
    }
  }

  // Tất cả đều thất bại
  const stats = getKeyStats();
  throw new Error(
    `Tất cả ${stats.total} kênh AI đều đang bận hoặc gặp sự cố. ` +
    `Vui lòng thử lại sau 1-2 phút.\n\n` +
    `Chi tiết kỹ thuật: ${lastError}`
  );
}

export { getKeyStats, getVietnameseError };

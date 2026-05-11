export function repairJSON(text: string): string {
  // Try to extract JSON from potential markdown code blocks
  let json = text;

  // Remove markdown code block markers
  const codeBlockMatch = json.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    json = codeBlockMatch[1].trim();
  }

  // Try to find JSON object boundaries
  const firstBrace = json.indexOf("{");
  const lastBrace = json.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    json = json.substring(firstBrace, lastBrace + 1);
  }

  // Fix common JSON issues
  // Remove trailing commas before } or ]
  json = json.replace(/,\s*([}\]])/g, "$1");

  // Fix single quotes to double quotes (careful with apostrophes in Vietnamese)
  // Only fix property names and simple values
  json = json.replace(/(['"])?(\w+)(['"])?\s*:/g, '"$2":');

  // Remove any control characters except newlines and tabs
  json = json.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

  return json;
}

export function parseAIResponse(responseText: string): unknown {
  // First attempt: direct parse
  try {
    return JSON.parse(responseText);
  } catch {
    // Second attempt: repair and parse
    try {
      const repaired = repairJSON(responseText);
      return JSON.parse(repaired);
    } catch {
      throw new Error("Không thể phân tích kết quả từ AI. Vui lòng thử lại.");
    }
  }
}

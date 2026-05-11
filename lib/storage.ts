import { HistoryRecord } from "@/types/evaluation";

const STORAGE_KEY = "mitc_ai_history";
const MAX_RECORDS = 50;

export function getHistory(): HistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(record: HistoryRecord): void {
  const history = getHistory();
  history.unshift(record);
  if (history.length > MAX_RECORDS) {
    history.splice(MAX_RECORDS);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function deleteFromHistory(id: string): void {
  const history = getHistory().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistoryById(id: string): HistoryRecord | undefined {
  return getHistory().find((r) => r.id === id);
}

export function searchHistory(query: string): HistoryRecord[] {
  const q = query.toLowerCase();
  return getHistory().filter(
    (r) =>
      r.productName.toLowerCase().includes(q) ||
      r.unitName.toLowerCase().includes(q) ||
      r.reviewerRole.toLowerCase().includes(q)
  );
}

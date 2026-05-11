"use client";
import { useState, useEffect } from "react";
import BrandHeader from "@/components/BrandHeader";
import BrandFooter from "@/components/BrandFooter";
import { HistoryRecord } from "@/types/evaluation";
import { getHistory, deleteFromHistory, searchHistory } from "@/lib/storage";
import { getScoreLevel, getScoreLevelColor } from "@/lib/criteria";
import { downloadJSON } from "@/lib/reportExport";
import ResultDashboard from "@/components/ResultDashboard";
import { Search, Trash2, Eye, Download, History } from "lucide-react";

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [query, setQuery] = useState("");
  const [viewResult, setViewResult] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  useEffect(() => {
    setRecords(query ? searchHistory(query) : getHistory());
  }, [query]);

  const handleDelete = (id: string) => {
    if (confirm("Xóa bản ghi này?")) {
      deleteFromHistory(id);
      setRecords(getHistory());
    }
  };

  if (viewResult) {
    return (
      <div className="min-h-screen flex flex-col">
        <BrandHeader />
        <main className="flex-1">
          <ResultDashboard result={viewResult.fullResult} onBack={() => setViewResult(null)} />
        </main>
        <BrandFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BrandHeader />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <History className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-slate-800">Lịch sử đánh giá</h1>
        </div>

        <div className="relative mb-6">
          <Search size={20} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, đơn vị..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {records.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <History size={48} className="mx-auto mb-3 opacity-50" />
            <p>Chưa có bản đánh giá nào được lưu.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="bg-white rounded-xl card-shadow p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-semibold text-slate-800">{r.productName}</h3>
                  <p className="text-sm text-slate-500">{r.unitName} • {r.reviewerRole}</p>
                  <p className="text-xs text-slate-400">{new Date(r.timestamp).toLocaleString("vi-VN")}</p>
                </div>
                <div className="text-center">
                  <span className={`text-2xl font-bold ${getScoreLevelColor(r.totalScore)}`}>{r.totalScore}</span>
                  <span className="text-sm text-slate-400">/100</span>
                  <p className={`text-xs font-medium ${getScoreLevelColor(r.totalScore)}`}>{getScoreLevel(r.totalScore)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewResult(r)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Xem">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => downloadJSON(r.fullResult, `MITC_${r.productName}.json`)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg" title="Tải JSON">
                    <Download size={18} />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Xóa">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BrandFooter />
    </div>
  );
}

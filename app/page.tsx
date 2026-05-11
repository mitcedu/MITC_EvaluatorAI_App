"use client";
import { useState, useCallback } from "react";
import BrandHeader from "@/components/BrandHeader";
import BrandFooter from "@/components/BrandFooter";
import { BRANDING } from "@/lib/branding";
import { REVIEWER_ROLES } from "@/lib/roles";
import { EvaluationResult } from "@/types/evaluation";
import ResultDashboard from "@/components/ResultDashboard";
import Image from "next/image";
import { Upload, FileText, AlertTriangle, Sparkles, ClipboardPaste } from "lucide-react";

const PROGRESS_STEPS = [
  { pct: 10, label: "Đang đọc nội dung báo cáo..." },
  { pct: 25, label: "Đang nhận diện thông tin sản phẩm và cấu trúc bản thuyết minh..." },
  { pct: 40, label: "Đang đối chiếu với bộ tiêu chí 100 điểm..." },
  { pct: 60, label: "Đang phân tích theo vai trò người đánh giá..." },
  { pct: 80, label: "Đang tạo nhận xét, câu hỏi phản biện và khuyến nghị..." },
  { pct: 100, label: "Hoàn tất báo cáo đánh giá!" },
];

export default function HomePage() {
  const [roleId, setRoleId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [analyzing, setAnalyzing] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleAnalyze = async () => {
    setError("");
    if (!roleId) { setError("Vui lòng chọn vai trò người đánh giá"); return; }
    if (inputMode === "file" && !file) { setError("Vui lòng tải file báo cáo lên"); return; }
    if (inputMode === "text" && !pasteText.trim()) { setError("Vui lòng dán nội dung báo cáo"); return; }

    setAnalyzing(true);
    setProgressIdx(0);
    setResult(null);

    // Simulate progress
    const timer = setInterval(() => {
      setProgressIdx((prev) => Math.min(prev + 1, PROGRESS_STEPS.length - 2));
    }, 3000);

    try {
      const formData = new FormData();
      formData.append("reviewerRole", roleId);
      if (inputMode === "file" && file) {
        formData.append("file", file);
      } else {
        formData.append("text", pasteText);
      }

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      clearInterval(timer);

      if (!res.ok) {
        setError(data.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
        setAnalyzing(false);
        return;
      }

      setProgressIdx(PROGRESS_STEPS.length - 1);
      setTimeout(() => {
        setResult(data.result);
        setAnalyzing(false);
      }, 1000);
    } catch (err) {
      clearInterval(timer);
      setError(`Lỗi kết nối: ${(err as Error).message}`);
      setAnalyzing(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen flex flex-col">
        <BrandHeader />
        <main className="flex-1">
          <ResultDashboard result={result} onBack={() => setResult(null)} />
        </main>
        <BrandFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BrandHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="mitc-gradient-light py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative w-20 h-20">
                <Image src={BRANDING.logoPath} alt="MITC" fill className="object-contain" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">{BRANDING.heroTitle}</h1>
            <p className="text-slate-600 max-w-2xl mx-auto mb-4">{BRANDING.heroDescription}</p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm">
              <AlertTriangle size={16} />
              <span>{BRANDING.disclaimer}</span>
            </div>
          </div>
        </section>

        {/* Upload Form */}
        <section className="py-8 px-4">
          <div className="max-w-2xl mx-auto">
            {analyzing ? (
              /* Progress */
              <div className="bg-white rounded-xl card-shadow-lg p-8">
                <div className="text-center mb-6">
                  <Sparkles className="mx-auto text-blue-600 mb-3 animate-pulse" size={40} />
                  <h2 className="text-xl font-bold text-slate-800">Đang phân tích báo cáo...</h2>
                </div>
                <div className="space-y-4">
                  {PROGRESS_STEPS.map((step, i) => (
                    <div key={i} className={`flex items-center gap-3 ${i <= progressIdx ? "text-blue-700" : "text-slate-400"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i < progressIdx ? "bg-blue-600 text-white" : i === progressIdx ? "bg-blue-100 text-blue-700 animate-pulse" : "bg-slate-100"
                      }`}>
                        {step.pct}%
                      </div>
                      <span className="text-sm">{step.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${PROGRESS_STEPS[progressIdx].pct}%` }}
                  />
                </div>
              </div>
            ) : (
              /* Form */
              <div className="bg-white rounded-xl card-shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} />
                  Phân tích sản phẩm dự thi
                </h2>

                {/* Role Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Chọn vai trò người đánh giá <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {REVIEWER_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>{r.displayName}</option>
                    ))}
                  </select>
                </div>

                {/* Input Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setInputMode("file")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      inputMode === "file" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Upload size={16} className="inline mr-1" /> Tải file
                  </button>
                  <button
                    onClick={() => setInputMode("text")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      inputMode === "text" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <ClipboardPaste size={16} className="inline mr-1" /> Dán văn bản
                  </button>
                </div>

                {inputMode === "file" ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById("file-input")?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors mb-6"
                  >
                    <Upload className="mx-auto text-slate-400 mb-3" size={40} />
                    {file ? (
                      <p className="text-blue-600 font-medium">{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>
                    ) : (
                      <>
                        <p className="text-slate-600 font-medium">Kéo thả file hoặc nhấp để chọn</p>
                        <p className="text-slate-400 text-sm mt-1">Hỗ trợ: .docx, .pdf, .txt (tối đa 20MB)</p>
                      </>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      accept=".docx,.pdf,.txt"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </div>
                ) : (
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Dán nội dung bản thuyết minh sản phẩm vào đây..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm h-48 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
                  />
                )}

                {/* Security Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                  <p className="text-xs text-amber-700">
                    <AlertTriangle size={14} className="inline mr-1" />
                    {BRANDING.securityWarning}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  className="w-full mitc-gradient text-white font-bold py-4 rounded-xl text-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  PHÂN TÍCH & GỢI Ý ĐIỂM
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <BrandFooter />
    </div>
  );
}

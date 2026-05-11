import BrandHeader from "@/components/BrandHeader";
import BrandFooter from "@/components/BrandFooter";
import { BRANDING } from "@/lib/branding";
import { CRITERIA, CRITERIA_GROUPS } from "@/lib/criteria";
import { REVIEWER_ROLES } from "@/lib/roles";
import { BookOpen, Target, Users, AlertTriangle, FileCheck, Lightbulb } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrandHeader />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-slate-800">Hướng dẫn sử dụng</h1>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-xl card-shadow-lg p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Giới thiệu</h2>
          <p className="text-sm text-slate-600 mb-3">{BRANDING.subtitle}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">{BRANDING.disclaimer}</p>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl card-shadow-lg p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileCheck className="text-teal-600" size={20} />
            Quy trình sử dụng
          </h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Chọn vai trò", desc: "Chọn vai trò thành viên Hội đồng đánh giá để AI điều chỉnh góc nhìn nhận xét phù hợp." },
              { step: 2, title: "Tải file hoặc dán văn bản", desc: "Upload bản thuyết minh (.docx, .pdf, .txt) hoặc dán trực tiếp nội dung. Tối đa 10MB." },
              { step: 3, title: "AI phân tích", desc: "Hệ thống tự nhận diện thông tin sản phẩm, đối chiếu 10 tiêu chí (100 điểm), gợi ý điểm số, nhận xét, câu hỏi phản biện." },
              { step: 4, title: "Xem kết quả", desc: "Dashboard hiển thị đầy đủ: metadata, tổng điểm, chi tiết tiêu chí, biểu đồ, điểm mạnh/yếu, ma trận bằng chứng, khuyến nghị." },
              { step: 5, title: "Lưu & Xuất", desc: "Lưu vào lịch sử, tải JSON, copy Markdown. So sánh nhiều sản phẩm với nhau." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">{s.step}</div>
                <div>
                  <h4 className="font-semibold text-slate-700">{s.title}</h4>
                  <p className="text-sm text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Criteria */}
        <div className="bg-white rounded-xl card-shadow-lg p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="text-blue-600" size={20} />
            Bộ tiêu chí 100 điểm
          </h2>
          {CRITERIA_GROUPS.map((g) => (
            <div key={g.id} className="mb-6">
              <h3 className="font-semibold text-slate-700 mb-2">Nhóm {g.id}: {g.name} ({g.maxScore} điểm)</h3>
              <div className="space-y-3 ml-4">
                {CRITERIA.filter((c) => c.groupId === g.id).map((c) => (
                  <div key={c.id} className="border-l-4 border-blue-200 pl-4">
                    <p className="font-medium text-sm text-slate-700">{c.id}. {c.name} — {c.maxScore} điểm</p>
                    <p className="text-xs text-slate-500">{c.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{c.scoringGuide}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Roles */}
        <div className="bg-white rounded-xl card-shadow-lg p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="text-purple-600" size={20} />
            Thành viên Hội đồng đánh giá
          </h2>
          <div className="space-y-4">
            {REVIEWER_ROLES.map((r) => (
              <div key={r.id} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-700">{r.fullTitle}</h4>
                <p className="text-xs text-slate-500 mb-2">{r.position}</p>
                <div className="flex flex-wrap gap-1">
                  {r.perspectives.map((p, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl card-shadow-lg p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={20} />
            Lưu ý quan trọng
          </h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Hệ thống KHÔNG kiểm tra đạo văn và KHÔNG tạo AI detector</li>
            <li>• AI tự nhận diện thông tin — không yêu cầu nhập thủ công</li>
            <li>• Kết quả chỉ mang tính tham khảo, quyết định cuối cùng thuộc Hội đồng</li>
            <li>• Không tải lên dữ liệu mật hoặc tài liệu nội bộ chưa được phép sử dụng</li>
            <li>• Hỗ trợ .docx, .pdf, .txt — file tối đa 10MB</li>
            <li>• Dữ liệu lịch sử lưu trên trình duyệt (localStorage), xóa khi xóa dữ liệu trình duyệt</li>
          </ul>
        </div>
      </main>
      <BrandFooter />
    </div>
  );
}

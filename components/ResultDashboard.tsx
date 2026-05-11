"use client";
import { useState } from "react";
import { EvaluationResult } from "@/types/evaluation";
import { exportToWord } from "@/lib/wordExport";
import { BRANDING } from "@/lib/branding";
import { getScoreLevel, getScoreLevelColor } from "@/lib/criteria";
import { saveToHistory } from "@/lib/storage";
import { generateMarkdownReport, downloadJSON, copyMarkdown } from "@/lib/reportExport";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowLeft, Download, Copy, Check, AlertTriangle, Award, Star,
  BarChart3, FileSearch, Shield, MessageCircleQuestion, Lightbulb,
  Target, ClipboardCheck, Users, BookOpen, ChevronDown, ChevronUp,
  FileText, Loader2,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from "recharts";

const COLORS = ["#1e40af", "#0d9488", "#f59e0b", "#ef4444"];

interface Props {
  result: EvaluationResult;
  onBack: () => void;
}

function Section({ title, icon, children, defaultOpen = true }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl card-shadow-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        {open ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

export default function ResultDashboard({ result, onBack }: Props) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const m = result.metadata;
  const o = result.overall;

  const handleSave = () => {
    saveToHistory({
      id: uuidv4(),
      productName: m.productName || "Không rõ",
      unitName: m.unitName || "Không rõ",
      reviewerRole: m.reviewerRoleDisplay,
      totalScore: o.totalScore,
      groupScores: result.groupScores.map((g) => g.score),
      timestamp: new Date().toISOString(),
      completenessStatus: m.detectedInfoStatus,
      fullResult: result,
    });
  };

  const handleCopy = async () => {
    const md = generateMarkdownReport(result);
    await copyMarkdown(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const radarData = result.criteriaScores.map((c) => ({
    criterion: `TC${c.id}`,
    score: c.score,
    max: c.maxScore,
    pct: Math.round((c.score / c.maxScore) * 100),
  }));

  const groupBarData = result.groupScores.map((g, i) => ({
    name: g.groupName.length > 20 ? g.groupName.substring(0, 20) + "..." : g.groupName,
    score: g.score,
    max: g.maxScore,
    fill: COLORS[i],
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          <ArrowLeft size={20} /> Đánh giá sản phẩm khác
        </button>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
            <ClipboardCheck size={16} /> Lưu
          </button>
          <button
            onClick={async () => {
              setExporting(true);
              try { await exportToWord(result); } catch (e) { console.error(e); alert("Lỗi xuất file Word: " + (e as Error).message); }
              setExporting(false);
            }}
            disabled={exporting}
            className="px-4 py-2 bg-gradient-to-r from-blue-700 to-teal-600 text-white rounded-lg text-sm font-bold hover:from-blue-800 hover:to-teal-700 flex items-center gap-1.5 shadow-lg disabled:opacity-50"
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {exporting ? "Đang xuất..." : "Xuất Word"}
          </button>
          <button onClick={() => downloadJSON(result, `MITC_${m.productName || "result"}.json`)} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-1">
            <Download size={16} /> JSON
          </button>
          <button onClick={handleCopy} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center gap-1">
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Đã sao" : "Copy MD"}
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">{BRANDING.resultDisclaimer}</p>
      </div>

      {/* Block 1: Metadata */}
      <Section title="Thông tin sản phẩm (AI tự nhận diện)" icon={<FileSearch className="text-blue-600" size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            ["Tên sản phẩm", m.productName],
            ["Đơn vị", m.unitName],
            ["Tác giả chính", m.mainAuthor],
            ["Thành viên", m.members],
            ["Công cụ GenAI", m.aiToolsUsed],
            ["Loại hình sản phẩm", m.productType],
            ["Lĩnh vực ứng dụng", m.applicationArea],
            ["Đối tượng sử dụng", m.targetUsers],
            ["Link sản phẩm", m.productLink],
            ["Tài khoản test", m.testAccount],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <span className="font-medium text-slate-500 min-w-[120px]">{label}:</span>
              <span className="text-slate-800">{value || "Không tìm thấy trong báo cáo"}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">Trạng thái: {m.detectedInfoStatus}</span>
        </div>
        {m.missingMetadata && m.missingMetadata.length > 0 && (
          <div className="mt-3 bg-amber-50 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-700 mb-1">Thông tin chưa tìm thấy:</p>
            <ul className="text-xs text-amber-600 list-disc list-inside">{m.missingMetadata.map((mm, i) => <li key={i}>{mm}</li>)}</ul>
          </div>
        )}
      </Section>

      {/* Block 2: Score Overview + Charts */}
      <Section title="Tổng quan điểm số" icon={<Award className="text-amber-500" size={20} />}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-6xl font-extrabold ${getScoreLevelColor(o.totalScore)}`}>{o.totalScore}</div>
            <div className="text-slate-400 text-lg">/ {o.maxScore}</div>
            <div className={`text-lg font-bold mt-2 ${getScoreLevelColor(o.totalScore)}`}>{o.level || getScoreLevel(o.totalScore)}</div>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-slate-600 mb-3">{o.executiveSummary}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                Giải thưởng: {o.awardPotential}
              </span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-2 text-center">Radar 10 tiêu chí (%)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="criterion" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Điểm (%)" dataKey="pct" stroke="#1e40af" fill="#1e40af" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-2 text-center">Điểm theo nhóm tiêu chí</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupBarData} layout="vertical">
                <XAxis type="number" domain={[0, "dataMax"]} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Điểm" radius={[0, 6, 6, 0]}>
                  {groupBarData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
                <Bar dataKey="max" name="Tối đa" fill="#e2e8f0" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* Block 3: Group Scores */}
      <Section title="Điểm theo nhóm tiêu chí" icon={<BarChart3 className="text-teal-600" size={20} />} defaultOpen={false}>
        <div className="space-y-4">
          {result.groupScores.map((g, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-700">{g.groupName}</span>
                <span className="font-bold" style={{ color: COLORS[i] }}>{g.score}/{g.maxScore}</span>
              </div>
              <div className="bg-slate-100 rounded-full h-2 mb-2">
                <div className="h-2 rounded-full transition-all" style={{ width: `${(g.score / g.maxScore) * 100}%`, backgroundColor: COLORS[i] }} />
              </div>
              <p className="text-sm text-slate-600">{g.comment}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Block 4: Criteria Detail */}
      <Section title="Chi tiết 10 tiêu chí" icon={<Target className="text-blue-600" size={20} />} defaultOpen={false}>
        <div className="space-y-4">
          {result.criteriaScores.map((c) => (
            <div key={c.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-700">{c.id}. {c.criterion}</h4>
                <div className="text-right shrink-0 ml-4">
                  <span className={`text-lg font-bold ${getScoreLevelColor((c.score / c.maxScore) * 100)}`}>{c.score}</span>
                  <span className="text-slate-400">/{c.maxScore}</span>
                </div>
              </div>
              <div className="bg-slate-100 rounded-full h-1.5 mb-3">
                <div className={`h-1.5 rounded-full`} style={{ width: `${(c.score / c.maxScore) * 100}%`, backgroundColor: getScoreColor((c.score / c.maxScore) * 100) }} />
              </div>
              <p className="text-sm text-slate-600 mb-2">{c.comment}</p>
              {c.evidence && <div className="bg-blue-50 rounded p-2 mb-2"><p className="text-xs text-blue-700"><strong>Bằng chứng:</strong> {c.evidence}</p></div>}
              {c.missingInfo && <div className="bg-amber-50 rounded p-2 mb-2"><p className="text-xs text-amber-700"><strong>Thiếu:</strong> {c.missingInfo}</p></div>}
              {c.recommendation && <div className="bg-teal-50 rounded p-2"><p className="text-xs text-teal-700"><strong>Khuyến nghị:</strong> {c.recommendation}</p></div>}
            </div>
          ))}
        </div>
      </Section>

      {/* Block 5: Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Điểm mạnh" icon={<Star className="text-emerald-500" size={20} />} defaultOpen={false}>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Điểm hạn chế" icon={<AlertTriangle className="text-orange-500" size={20} />} defaultOpen={false}>
          <ul className="space-y-2">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-orange-500 mt-0.5">⚠</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Block 6: Evidence Matrix */}
      <Section title="Ma trận bằng chứng" icon={<BookOpen className="text-indigo-600" size={20} />} defaultOpen={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 px-3 py-2 text-left">TC</th>
                <th className="border border-slate-200 px-3 py-2 text-left">Tiêu chí</th>
                <th className="border border-slate-200 px-3 py-2 text-left">Bằng chứng</th>
                <th className="border border-slate-200 px-3 py-2 text-left">Mức</th>
                <th className="border border-slate-200 px-3 py-2 text-left">Tác động</th>
              </tr>
            </thead>
            <tbody>
              {result.evidenceMatrix.map((e) => (
                <tr key={e.criterionId} className="hover:bg-slate-50">
                  <td className="border border-slate-200 px-3 py-2">{e.criterionId}</td>
                  <td className="border border-slate-200 px-3 py-2">{e.criterion}</td>
                  <td className="border border-slate-200 px-3 py-2 text-xs">{e.evidenceFromReport}</td>
                  <td className="border border-slate-200 px-3 py-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      e.evidenceLevel === "Mạnh" ? "bg-green-100 text-green-700" :
                      e.evidenceLevel === "Trung bình" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{e.evidenceLevel}</span>
                  </td>
                  <td className="border border-slate-200 px-3 py-2 text-xs">{e.impactOnScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Block 7: Report Completeness */}
      <Section title="Mức độ đầy đủ hồ sơ" icon={<ClipboardCheck className="text-purple-600" size={20} />} defaultOpen={false}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(result.reportCompleteness)
            .filter(([k]) => k !== "comments")
            .map(([key, value]) => {
              const labels: Record<string, string> = {
                generalInfo: "Thông tin chung",
                featureDescription: "Mô tả tính năng",
                applicationScope: "Phạm vi ứng dụng",
                effectivenessEvidence: "Minh chứng hiệu quả",
                beforeAfterData: "Dữ liệu trước/sau",
                userFeedback: "Phản hồi người dùng",
                videoOrImageEvidence: "Video/hình ảnh",
                productLinkOrTestAccount: "Link/tài khoản test",
                implementationPlan: "Kế hoạch triển khai",
                dataProtection: "Bảo vệ dữ liệu",
                aiGuardrails: "Guardrails AI",
                professionalAccuracy: "Chính xác chuyên môn",
                scalabilityPotential: "Tiềm năng nhân rộng",
              };
              return (
                <div key={key} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${value ? "bg-green-50" : "bg-red-50"}`}>
                  <span>{value ? "✅" : "❌"}</span>
                  <span className={value ? "text-green-700" : "text-red-700"}>{labels[key] || key}</span>
                </div>
              );
            })}
        </div>
        {result.reportCompleteness.comments?.length > 0 && (
          <div className="mt-3 space-y-1">
            {result.reportCompleteness.comments.map((c, i) => <p key={i} className="text-xs text-slate-600">• {c}</p>)}
          </div>
        )}
      </Section>

      {/* Block 8: Role Perspective */}
      <Section title="Nhận xét theo vai trò" icon={<Users className="text-blue-600" size={20} />} defaultOpen={false}>
        <div className="mb-3">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            {result.roleBasedPerspective.reviewerRoleFull}
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-3">{result.roleBasedPerspective.focus}</p>
        <div className="space-y-2">
          {result.roleBasedPerspective.comments?.map((c, i) => <p key={i} className="text-sm text-slate-700">• {c}</p>)}
        </div>
        {result.roleBasedPerspective.specificConcerns?.length > 0 && (
          <div className="mt-3 bg-amber-50 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-700 mb-1">Mối quan tâm:</p>
            {result.roleBasedPerspective.specificConcerns.map((c, i) => <p key={i} className="text-xs text-amber-600">• {c}</p>)}
          </div>
        )}
      </Section>

      {/* Block 9: Council Questions */}
      <Section title="Câu hỏi gợi ý cho Hội đồng" icon={<MessageCircleQuestion className="text-purple-600" size={20} />} defaultOpen={false}>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "Hiệu quả", questions: result.councilQuestions.effectivenessQuestions, color: "blue" },
            { title: "Công nghệ", questions: result.councilQuestions.technologyQuestions, color: "teal" },
            { title: "Bảo mật", questions: result.councilQuestions.securityQuestions, color: "red" },
            { title: "Nhân rộng", questions: result.councilQuestions.scalabilityQuestions, color: "amber" },
          ].map((cat) => (
            <div key={cat.title} className={`border border-slate-200 rounded-lg p-3`}>
              <h5 className="text-sm font-semibold text-slate-700 mb-2">{cat.title}</h5>
              <ul className="space-y-1">
                {cat.questions?.map((q, i) => <li key={i} className="text-xs text-slate-600">• {q}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Block 10: Improvement Plan */}
      <Section title="Khuyến nghị hoàn thiện" icon={<Lightbulb className="text-amber-500" size={20} />} defaultOpen={false}>
        <div className="space-y-4">
          {[
            { title: "🔴 Bổ sung ngay", items: result.improvementPlan.immediateAdditions },
            { title: "🟡 Ngắn hạn (1-2 tuần)", items: result.improvementPlan.shortTerm },
            { title: "🔵 Trung hạn", items: result.improvementPlan.mediumTerm },
            { title: "⚪ Dài hạn", items: result.improvementPlan.longTerm },
          ].map((phase) => (
            <div key={phase.title}>
              <h5 className="text-sm font-semibold text-slate-700 mb-1">{phase.title}</h5>
              <ul className="space-y-1 ml-4">
                {phase.items?.map((item, i) => <li key={i} className="text-sm text-slate-600 list-disc">{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Block 11: Final Recommendation */}
      <Section title="Kết luận & Nhận định" icon={<Shield className="text-emerald-600" size={20} />} defaultOpen={true}>
        <div className="space-y-3">
          <p className="text-sm text-slate-700">{result.finalRecommendation.summary}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-700">
              Tiềm năng giải thưởng: {result.finalRecommendation.awardPotential}
            </span>
          </div>
          {result.finalRecommendation.requiredAdditions?.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-700 mb-1">Cần bổ sung:</p>
              <ul className="text-xs text-amber-600 list-disc list-inside">
                {result.finalRecommendation.requiredAdditions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
          <p className="text-xs text-slate-500 italic">{result.finalRecommendation.finalNote}</p>
        </div>
      </Section>

      {/* Bottom disclaimer */}
      <div className="bg-slate-100 rounded-lg p-4 text-center">
        <p className="text-xs text-slate-500">{BRANDING.reportFooter}</p>
      </div>
    </div>
  );
}

function getScoreColor(pct: number): string {
  if (pct >= 80) return "#059669";
  if (pct >= 60) return "#0d9488";
  if (pct >= 40) return "#f59e0b";
  return "#ef4444";
}

"use client";
import { useState, useEffect } from "react";
import BrandHeader from "@/components/BrandHeader";
import BrandFooter from "@/components/BrandFooter";
import { HistoryRecord } from "@/types/evaluation";
import { getHistory } from "@/lib/storage";
import { getScoreLevel, getScoreLevelColor, CRITERIA_GROUPS } from "@/lib/criteria";
import { BRANDING } from "@/lib/branding";
import { GitCompare, AlertTriangle } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from "recharts";

const COLORS_A = "#1e40af";
const COLORS_B = "#0d9488";

export default function ComparePage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [idA, setIdA] = useState("");
  const [idB, setIdB] = useState("");

  useEffect(() => { setRecords(getHistory()); }, []);

  const a = records.find((r) => r.id === idA);
  const b = records.find((r) => r.id === idB);

  const radarData = a && b
    ? a.fullResult.criteriaScores.map((c, i) => ({
        criterion: `TC${c.id}`,
        A: Math.round((c.score / c.maxScore) * 100),
        B: Math.round((b.fullResult.criteriaScores[i].score / b.fullResult.criteriaScores[i].maxScore) * 100),
      }))
    : [];

  const groupData = a && b
    ? CRITERIA_GROUPS.map((g, i) => ({
        name: g.name.substring(0, 15) + "...",
        A: a.fullResult.groupScores[i]?.score || 0,
        B: b.fullResult.groupScores[i]?.score || 0,
      }))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <BrandHeader />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <GitCompare className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-slate-800">So sánh sản phẩm</h1>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{BRANDING.compareDisclaimer}</p>
        </div>

        {records.length < 2 ? (
          <div className="text-center py-16 text-slate-400">
            <p>Cần ít nhất 2 bản đánh giá đã lưu để so sánh.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sản phẩm A</label>
                <select value={idA} onChange={(e) => setIdA(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm">
                  <option value="">-- Chọn --</option>
                  {records.map((r) => <option key={r.id} value={r.id}>{r.productName} ({r.totalScore}đ)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sản phẩm B</label>
                <select value={idB} onChange={(e) => setIdB(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm">
                  <option value="">-- Chọn --</option>
                  {records.filter((r) => r.id !== idA).map((r) => <option key={r.id} value={r.id}>{r.productName} ({r.totalScore}đ)</option>)}
                </select>
              </div>
            </div>

            {a && b && (
              <div className="space-y-6">
                {/* Score comparison */}
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: "A", rec: a, color: COLORS_A },
                    { label: "B", rec: b, color: COLORS_B },
                  ].map(({ label, rec, color }) => (
                    <div key={label} className="bg-white rounded-xl card-shadow-lg p-6 text-center" style={{ borderTop: `4px solid ${color}` }}>
                      <p className="text-sm font-semibold text-slate-500 mb-1">Sản phẩm {label}</p>
                      <h3 className="font-bold text-lg text-slate-800 mb-2">{rec.productName}</h3>
                      <div className={`text-5xl font-extrabold ${getScoreLevelColor(rec.totalScore)}`}>{rec.totalScore}</div>
                      <p className={`font-medium ${getScoreLevelColor(rec.totalScore)}`}>{getScoreLevel(rec.totalScore)}</p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl card-shadow-lg p-6">
                    <h4 className="font-semibold text-slate-700 mb-4 text-center">Radar so sánh (%)</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="criterion" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar name={a.productName} dataKey="A" stroke={COLORS_A} fill={COLORS_A} fillOpacity={0.2} />
                        <Radar name={b.productName} dataKey="B" stroke={COLORS_B} fill={COLORS_B} fillOpacity={0.2} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-xl card-shadow-lg p-6">
                    <h4 className="font-semibold text-slate-700 mb-4 text-center">So sánh nhóm tiêu chí</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={groupData}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="A" name={a.productName} fill={COLORS_A} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="B" name={b.productName} fill={COLORS_B} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detail table */}
                <div className="bg-white rounded-xl card-shadow-lg p-6 overflow-x-auto">
                  <h4 className="font-semibold text-slate-700 mb-4">Chi tiết 10 tiêu chí</h4>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="border border-slate-200 px-3 py-2">TC</th>
                        <th className="border border-slate-200 px-3 py-2">Tiêu chí</th>
                        <th className="border border-slate-200 px-3 py-2" style={{ color: COLORS_A }}>SP A</th>
                        <th className="border border-slate-200 px-3 py-2" style={{ color: COLORS_B }}>SP B</th>
                        <th className="border border-slate-200 px-3 py-2">Max</th>
                        <th className="border border-slate-200 px-3 py-2">Chênh lệch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.fullResult.criteriaScores.map((c, i) => {
                        const diff = c.score - b.fullResult.criteriaScores[i].score;
                        return (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="border border-slate-200 px-3 py-2 text-center">{c.id}</td>
                            <td className="border border-slate-200 px-3 py-2">{c.criterion}</td>
                            <td className="border border-slate-200 px-3 py-2 text-center font-bold" style={{ color: COLORS_A }}>{c.score}</td>
                            <td className="border border-slate-200 px-3 py-2 text-center font-bold" style={{ color: COLORS_B }}>{b.fullResult.criteriaScores[i].score}</td>
                            <td className="border border-slate-200 px-3 py-2 text-center text-slate-400">{c.maxScore}</td>
                            <td className={`border border-slate-200 px-3 py-2 text-center font-bold ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-slate-400"}`}>
                              {diff > 0 ? `+${diff}` : diff}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <BrandFooter />
    </div>
  );
}

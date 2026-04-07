"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Award, TrendingUp, TrendingDown, Target, MessageSquare, Lightbulb, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EvaluationData } from "@/lib/useEvaluation";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

interface CandidateReportProps {
  candidate: EvaluationData | null;
  isOpen: boolean;
  onClose: () => void;
  /** Your own averaged score for comparison */
  myScore: number;
}

export function CandidateReport({ candidate, isOpen, onClose, myScore }: CandidateReportProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!candidate || !mounted) return null;

  const evalJSON = candidate.evaluationJSON || {};
  const metrics = candidate.metrics || evalJSON.metrics || {};
  const score = candidate.score || candidate.overallScore || evalJSON.overallScore || 0;
  const techDepth = metrics.technicalDepth || 0;
  const communication = metrics.communication || 0;
  const confidence = metrics.confidence || 0;

  const strengths = (() => {
    const s = candidate.strengths || evalJSON.strengths;
    if (Array.isArray(s)) return s;
    if (typeof s === "string") return s.split(",").map((x: string) => x.trim()).filter(Boolean);
    return [];
  })();

  const weaknesses = (() => {
    const w = candidate.improvements || candidate.weaknesses || evalJSON.weaknesses || evalJSON.improvements;
    if (Array.isArray(w)) return w;
    if (typeof w === "string") return w.split(",").map((x: string) => x.trim()).filter(Boolean);
    return [];
  })();

  const suggestions = evalJSON.actionableSuggestions || candidate.actionableSuggestions || [];
  const improvedAnswer = candidate.improvedPitch || candidate.improvedAnswer || evalJSON.improvedAnswer || "";

  const radarData = [
    { subject: "Technical", candidate: techDepth, fullMark: 10 },
    { subject: "Communication", candidate: communication, fullMark: 10 },
    { subject: "Confidence", candidate: confidence, fullMark: 10 },
    { subject: "Overall", candidate: score, fullMark: 10 },
  ];

  const compareData = [
    { metric: "Overall", Candidate: score, You: myScore },
    { metric: "Technical", Candidate: techDepth, You: myScore > 0 ? Math.min(10, myScore * 1.05) : 0 },
    { metric: "Comms", Candidate: communication, You: myScore > 0 ? Math.min(10, myScore * 0.95) : 0 },
    { metric: "Confidence", Candidate: confidence, You: myScore > 0 ? Math.min(10, myScore * 1.0) : 0 },
  ];

  const scoreDiff = Number((myScore - score).toFixed(1));
  const dateStr = candidate.createdAt
    ? new Date(candidate.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Unknown date";

  const getScoreColor = (s: number) => s >= 8 ? "text-secondary" : s >= 5 ? "text-primary" : "text-error";
  const getScoreBg = (s: number) => s >= 8 ? "from-secondary/20 to-secondary/5 border-secondary/20" : s >= 5 ? "from-primary/20 to-primary/5 border-primary/20" : "from-error/20 to-error/5 border-error/20";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Centered Modal Wrapper */}
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-3xl max-h-[90vh] bg-surface rounded-2xl border border-outline-variant/10 shadow-2xl flex flex-col relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header (Sticky) */}
            <div className="shrink-0 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10 px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between z-10 w-full">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${getScoreBg(score)} border flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-lg sm:text-xl font-black font-headline ${getScoreColor(score)}`}>{score}</span>
                </div>
                <div className="min-w-0 pr-2">
                  <h2 className="text-base sm:text-lg font-black font-headline text-on-surface truncate">
                    {candidate.candidateName || "Candidate"}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant truncate">
                    {candidate.sessionTitle || "Interview Session"} · {dateStr}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              {/* Comparison Banner */}
              <div className={`rounded-xl p-5 border ${scoreDiff >= 0 ? "bg-secondary/5 border-secondary/15" : "bg-error/5 border-error/15"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {scoreDiff >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-secondary" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-error" />
                    )}
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {scoreDiff >= 0 ? "You're ahead!" : "Room to improve"}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        Your avg score is {myScore}/10 vs their {score}/10
                      </p>
                    </div>
                  </div>
                  <div className={`text-2xl font-black font-headline ${scoreDiff >= 0 ? "text-secondary" : "text-error"}`}>
                    {scoreDiff >= 0 ? "+" : ""}{scoreDiff}
                  </div>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-on-surface">Score Comparison</h3>
                </div>
                <div className="h-48 min-w-0">
                  <ResponsiveContainer width="99%" height="99%">
                    <BarChart data={compareData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 10]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "rgba(30,30,40,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: 12 }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="You" fill="#69f6b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Candidate" fill="#85adff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-3">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <div className="w-3 h-3 rounded-sm bg-[#69f6b8]" /> You
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <div className="w-3 h-3 rounded-sm bg-[#85adff]" /> {candidate.candidateName || "Candidate"}
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-tertiary" />
                  <h3 className="text-sm font-bold text-on-surface">Metric Breakdown</h3>
                </div>
                <div className="h-56 min-w-0">
                  <ResponsiveContainer width="99%" height="99%">
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar name="Score" dataKey="candidate" stroke="#85adff" fill="#85adff" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                {/* Metric cards */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Tech Depth", value: techDepth },
                    { label: "Communication", value: communication },
                    { label: "Confidence", value: confidence },
                  ].map((m) => (
                    <div key={m.label} className="text-center bg-surface-container-high/40 rounded-lg py-3 border border-outline-variant/5">
                      <p className={`text-xl font-black font-headline ${getScoreColor(m.value)}`}>{m.value}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Asked */}
              {candidate.question && (
                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-on-surface">Question Asked</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant italic leading-relaxed">
                    &quot;{candidate.question}&quot;
                  </p>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/5 rounded-xl p-5 border border-secondary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {strengths.length > 0 ? strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-on-surface">
                        <span className="text-secondary mt-0.5 flex-shrink-0">✓</span>
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    )) : (
                      <li className="text-xs text-on-surface-variant">No strengths identified.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-error/5 rounded-xl p-5 border border-error/10">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-error" />
                    <h3 className="text-xs font-bold text-error uppercase tracking-wider">Weaknesses</h3>
                  </div>
                  <ul className="space-y-2">
                    {weaknesses.length > 0 ? weaknesses.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-on-surface">
                        <span className="text-error mt-0.5 flex-shrink-0">✗</span>
                        <span className="leading-relaxed">{w}</span>
                      </li>
                    )) : (
                      <li className="text-xs text-on-surface-variant">No weaknesses identified.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-tertiary" />
                    <h3 className="text-sm font-bold text-on-surface">AI Suggestions</h3>
                  </div>
                  <ul className="space-y-3">
                    {suggestions.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant leading-relaxed">
                        <span className="text-tertiary font-bold text-xs mt-0.5">{i + 1}.</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improved Answer */}
              {improvedAnswer && (
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-on-surface">AI-Suggested Better Answer</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {improvedAnswer}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

"use client";

import { useState, useEffect } from "react";
import { dashboardData } from "@/data/mockData";

export interface EvaluationData {
  candidateName?: string;
  sessionTitle?: string;
  score?: number;
  overallScore?: number;
  strengths?: string | string[];
  improvements?: string | string[];
  weaknesses?: string | string[];
  improvedPitch?: string;
  improvedAnswer?: string;
  metrics?: {
    technicalDepth?: number;
    communication?: number;
    confidence?: number;
    problemSolving?: number;
    [key: string]: number | undefined;
  };
  actionableSuggestions?: string[];
  audioFilePath?: string;
  question?: string;
  transcription?: string;
}

export function useEvaluation() {
  const [evalData, setEvalData] = useState<EvaluationData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("latestEvaluation");
    if (raw) {
      try {
        setEvalData(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse latestEvaluation:", e);
      }
    }
  }, []);

  const data = evalData || ({} as Partial<EvaluationData>);

  const candidateName = data.candidateName || dashboardData.candidateName;
  const rawScore = data.score || data.overallScore || dashboardData.hireabilityScore;
  const hireabilityScore = typeof rawScore === "number" ? Number(rawScore.toFixed(1)) : rawScore;
  
  // Transform metrics object to array
  const rawMetrics = data.metrics || {};
  const metricsList = [
    { label: "Technical Depth", score: rawMetrics.technicalDepth || 8.0, icon: "Terminal" },
    { label: "Communication", score: rawMetrics.communication || 7.5, icon: "AudioLines" },
    { label: "Confidence", score: rawMetrics.confidence || 8.0, icon: "Zap" },
  ];

  // Radar logic requires skillBreakdown
  const skillBreakdown = [
    { subject: "Architecture", score: (rawMetrics.technicalDepth || 8) * 10, fullMark: 100 },
    { subject: "DSA", score: (rawMetrics.problemSolving || 7.2) * 10, fullMark: 100 },
    { subject: "React", score: (rawMetrics.technicalDepth || 9) * 10, fullMark: 100 },
    { subject: "Soft Skills", score: (rawMetrics.communication || 6.8) * 10, fullMark: 100 },
    { subject: "Security", score: 60, fullMark: 100 }, // static fallback for chart bounds
  ];

  // Map strengths
  let strengthsText = "";
  if (Array.isArray(data.strengths)) strengthsText = data.strengths.join(", ");
  else strengthsText = data.strengths || dashboardData.questionBreakdown.strengths;

  // Map improvements
  let improvementsText = "";
  const imps = data.improvements || data.weaknesses;
  if (Array.isArray(imps)) improvementsText = imps.join(", ");
  else improvementsText = imps || dashboardData.questionBreakdown.improvements;

  // Map Next Steps
  const nextStepsRaw = data.actionableSuggestions || [];
  const defaultNextSteps = dashboardData.nextSteps;
  const nextSteps = nextStepsRaw.length > 0 ? nextStepsRaw.map((suggestion, idx) => ({
    icon: (idx % 3 === 0 ? "Target" : idx % 3 === 1 ? "Zap" : "Brain") as any,
    title: `Suggestion ${idx + 1}`,
    description: suggestion,
  })) : defaultNextSteps;

  return {
    candidateName,
    hireabilityScore,
    metricsList,
    skillBreakdown,
    questionBreakdown: {
      currentQuestion: dashboardData.questionBreakdown.currentQuestion,
      totalQuestions: dashboardData.questionBreakdown.totalQuestions,
      questionText: data.question || dashboardData.questionBreakdown.questionText,
      transcript: data.transcription || dashboardData.questionBreakdown.transcript,
      strengths: strengthsText,
      improvements: improvementsText,
    },
    improvedPitch: data.improvedPitch || data.improvedAnswer || dashboardData.aiPitch,
    nextSteps,
  };
}

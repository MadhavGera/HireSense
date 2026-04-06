"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export interface EvaluationData {
  _id?: string;
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
  createdAt?: string;
  evaluationJSON?: any;
}

export function useEvaluation() {
  const { user, isLoaded } = useUser();
  const [evalHistory, setEvalHistory] = useState<EvaluationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!isLoaded) return;
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/history/${user.id}`);
        const result = await res.json();
        if (result.success && result.data) {
          setEvalHistory(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch evaluation history:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [user, isLoaded]);

  // Use the most recent evaluation as the primary one, or fallback logic
  const latestData = evalHistory.length > 0 ? evalHistory[0] : ({} as Partial<EvaluationData>);
  const evalJSON = latestData.evaluationJSON || {};

  const candidateName = user ? user.firstName || user.fullName : "Candidate";
  
  // Averages across history
  const validScores = evalHistory.map(e => e.score || 0).filter(s => s > 0);
  const avgScore = validScores.length > 0 
    ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
    : 0;

  const hireabilityScore = Number(avgScore.toFixed(1));
  
  const rawMetrics = latestData.metrics || evalJSON.metrics || {};
  const metricsList = [
    { label: "Technical Depth", score: rawMetrics.technicalDepth || 0, icon: "Terminal" as const, barHeights: [2, 4, 3, 6, 7], barOpacities: [20, 40, 60, 80, 100] },
    { label: "Communication", score: rawMetrics.communication || 0, icon: "AudioLines" as const, barHeights: [4, 5, 2, 3, 4], barOpacities: [20, 40, 60, 80, 40] },
    { label: "Confidence", score: rawMetrics.confidence || 0, icon: "Zap" as const, barHeights: [2, 3, 6, 5, 8], barOpacities: [20, 40, 60, 80, 100] },
  ];

  const skillBreakdown = [
    { subject: "Architecture", score: (rawMetrics.technicalDepth || 0) * 10, fullMark: 100 },
    { subject: "DSA", score: (rawMetrics.problemSolving || 0) * 10, fullMark: 100 },
    { subject: "React", score: (rawMetrics.technicalDepth || 0) * 10, fullMark: 100 },
    { subject: "Soft Skills", score: (rawMetrics.communication || 0) * 10, fullMark: 100 },
    { subject: "Security", score: 60, fullMark: 100 },
  ];

  // Map strengths
  let strengthsText = "";
  if (Array.isArray(latestData.strengths)) strengthsText = latestData.strengths.join(", ");
  else strengthsText = latestData.strengths || "";

  // Map improvements
  let improvementsText = "";
  const imps = latestData.improvements || latestData.weaknesses || evalJSON.improvements || evalJSON.weaknesses;
  if (Array.isArray(imps)) improvementsText = imps.join(", ");
  else improvementsText = imps || "";

  // Map Next Steps
  const nextStepsRaw = latestData.actionableSuggestions || evalJSON.actionableSuggestions || [];
  const nextSteps = nextStepsRaw.map((suggestion: string, idx: number) => ({
    icon: (idx % 3 === 0 ? "Target" : idx % 3 === 1 ? "Zap" : "Brain") as any,
    title: `Suggestion ${idx + 1}`,
    description: suggestion,
  }));

  return {
    isLoading,
    evalHistory,
    candidateName,
    hireabilityScore,
    metricsList,
    skillBreakdown,
    questionBreakdown: {
      currentQuestion: evalHistory.length,
      totalQuestions: evalHistory.length,
      questionText: latestData.question || "",
      transcript: latestData.transcription || "",
      strengths: strengthsText,
      improvements: improvementsText,
    },
    improvedPitch: latestData.improvedPitch || latestData.improvedAnswer || evalJSON.improvedPitch || evalJSON.improvedAnswer || "",
    nextSteps,
  };
}

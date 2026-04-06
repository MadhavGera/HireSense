"use client";

import { BadgeCheck, ThumbsUp, ThumbsDown, Trophy, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { verdictData, dashboardData } from "@/data/mockData";
import {
  StaggerContainer,
  FadeInUp,
} from "@/components/motion/MotionPrimitives";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const recommendationColors = {
  "Strong Hire": "text-secondary bg-secondary/10 border-secondary/30",
  "Hire": "text-primary bg-primary/10 border-primary/30",
  "Lean Hire": "text-tertiary bg-tertiary/10 border-tertiary/30",
  "No Hire": "text-error bg-error/10 border-error/30",
};

export default function VerdictPage() {
  const router = useRouter();

  const radarData = verdictData.categoryScores.map(c => ({
    subject: c.category,
    score: c.score,
    fullMark: 10
  }));

  return (
    <StaggerContainer delayStart={0.05} staggerInterval={0.08}>
      {/* Header */}
      <FadeInUp>
        <div className="mb-10">
          <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">
            Final Verdict
          </h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            AI-generated hiring recommendation for{" "}
            <span className="text-primary font-semibold">{dashboardData.fullName}</span>.
          </p>
        </div>
      </FadeInUp>

      {/* Verdict Card */}
      <FadeInUp>
        <div className="bg-gradient-to-br from-surface-container-high to-surface-container-low rounded-2xl p-8 mb-8 border border-outline-variant/10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Big verdict badge */}
            <div className="flex flex-col items-center gap-3">
              <div className={`px-6 py-3 rounded-2xl border-2 font-black text-2xl font-headline ${
                recommendationColors[verdictData.recommendation as keyof typeof recommendationColors]
              }`}>
                {verdictData.recommendation}
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <BadgeCheck className="w-4 h-4 text-primary" />
                <span>{verdictData.confidence}% AI Confidence</span>
              </div>
            </div>

            {/* Summary */}
            <div className="flex-1">
              <p className="text-on-surface leading-relaxed text-sm">
                {verdictData.summary}
              </p>
            </div>
          </div>

          {/* Pool comparison */}
          <div className="mt-8 flex items-center gap-6 bg-surface-container-highest/50 rounded-xl p-4 border border-outline-variant/10">
            <Trophy className="w-6 h-6 text-secondary flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-on-surface mb-0.5">
                Ranked #{verdictData.compareToPool.rank} of {verdictData.compareToPool.totalCandidates} candidates
              </p>
              <p className="text-xs text-on-surface-variant">
                Top {100 - verdictData.compareToPool.percentile}% of the candidate pool for this role
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-secondary font-bold text-lg">
              <TrendingUp className="w-5 h-5" />
              {verdictData.compareToPool.percentile}th
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Middle Section: Breakdown & Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left: Radar Chart */}
        <FadeInUp className="h-full">
          <div className="bg-surface-container-low rounded-2xl p-6 h-full border border-outline-variant/10 flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-bold font-headline text-on-surface mb-1">
                Weighted Score Breakdown
              </h2>
              <p className="text-xs text-on-surface-variant">
                Interactive view of your performance across key dimensions.
              </p>
            </div>
            <div className="flex-1 min-h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Candidate" dataKey="score" stroke="#85adff" fill="#85adff" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeInUp>

        {/* Right: Detailed Analysis */}
        <FadeInUp className="h-full">
          <div className="bg-surface-container-low rounded-2xl p-6 h-full border border-outline-variant/10 flex flex-col">
            <h2 className="text-lg font-bold font-headline text-on-surface mb-6">
              Detailed AI Analysis
            </h2>
            
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {/* Key Differentiator */}
              <div className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-primary">Key Differentiator</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  The candidate&apos;s deep understanding of React internals places them in the top 4% of applicants. Their technical depth significantly outperforms the average pool.
                </p>
              </div>

              {/* Recommendation & Action Plan */}
              <div className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-tertiary" /> 
                  <h3 className="text-sm font-bold text-tertiary">Recommendation & Action Plan</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We recommend proceeding with a follow-up interview focusing on System Design edge-cases. The candidate should prioritize succinctness when answering behavioral questions, perhaps using the STAR method.
                </p>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* Pros & Cons */}
      <FadeInUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp className="w-5 h-5 text-secondary" />
              <h3 className="font-bold font-headline text-secondary">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {verdictData.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                  <span className="text-secondary mt-0.5">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-error/5 border border-error/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsDown className="w-5 h-5 text-error" />
              <h3 className="font-bold font-headline text-error">Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {verdictData.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                  <span className="text-error mt-0.5">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeInUp>

      {/* Actions */}
      <FadeInUp>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/interview")}>
            Schedule Follow-up Interview
          </Button>
          <Button variant="secondary" onClick={() => router.push("/candidates")}>
            Compare with Other Candidates
          </Button>
        </div>
      </FadeInUp>
    </StaggerContainer>
  );
}

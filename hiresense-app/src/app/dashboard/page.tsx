"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic, BarChart3, Brain, Users, BadgeCheck,
  ArrowRight, TrendingUp, Clock, Target,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEvaluation } from "@/lib/useEvaluation";
import {
  StaggerContainer,
  FadeInUp,
  ScaleIn,
} from "@/components/motion/MotionPrimitives";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const quickLinks = [
  {
    label: "Performance",
    description: "Detailed score breakdown & question analysis",
    href: "/dashboard/performance",
    icon: BarChart3,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Skill Gap",
    description: "Skills vs. role requirements analysis",
    href: "/dashboard/skill-gap",
    icon: Brain,
    color: "text-tertiary",
    bg: "bg-tertiary/10",
  },
  {
    label: "Culture Fit",
    description: "Behavioral & cultural alignment scores",
    href: "/dashboard/culture-fit",
    icon: Users,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    label: "Final Verdict",
    description: "AI hiring recommendation & summary",
    href: "/dashboard/verdict",
    icon: BadgeCheck,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export default function OverviewPage() {
  const router = useRouter();
  const evaluation = useEvaluation();

  // Radar chart data from evaluation metrics
  const radarData = evaluation.metricsList.map(m => ({
    subject: m.label,
    score: m.score,
  }));

  // Area chart data from reports (reversed for chronological order)
  const trendData = [...evaluation.evalHistory].reverse().map((r: any) => ({
    date: new Date(r.createdAt || Date.now()).toLocaleDateString(),
    score: r.score || 0,
  }));

  const totalInterviews = evaluation.evalHistory.length;
  const recentConf = evaluation.metricsList.find(m => m.label === "Confidence")?.score || 0;
  
  let improvementRate = "0%";
  if (totalInterviews >= 2) {
    const diff = (evaluation.evalHistory[0].score || 0) - (evaluation.evalHistory[1].score || 0);
    improvementRate = diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
  }

  return (
    <StaggerContainer delayStart={0.05} staggerInterval={0.1}>
      {/* Welcome Header */}
      <FadeInUp>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">
              Welcome back, {evaluation.candidateName}
            </h1>
            <p className="text-on-surface-variant mt-2 text-lg">
              Here&apos;s a quick snapshot of your interview journey.
            </p>
          </div>
          <Button
            onClick={() => router.push("/interview")}
            size="lg"
            className="flex items-center gap-2 shadow-lg hover:shadow-primary/20"
          >
            <Mic className="w-5 h-5" />
            Start New Interview
          </Button>
        </div>
      </FadeInUp>

      {/* Stats Overview */}
      <FadeInUp>
        <StaggerContainer
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          delayStart={0}
          staggerInterval={0.06}
        >
          {[
            {
              label: "Hireability Score",
              value: `${evaluation.hireabilityScore}/10`,
              sub: "Overall average",
              icon: Target,
              accent: "text-primary",
            },
            {
              label: "Interviews Taken",
              value: totalInterviews,
              sub: `Avg ${evaluation.hireabilityScore}/10`,
              icon: Clock,
              accent: "text-tertiary",
            },
            {
              label: "Improvement Rate",
              value: improvementRate,
              sub: "vs. previous session",
              icon: TrendingUp,
              accent: "text-secondary",
            },
            {
              label: "Recent Confidence",
              value: `${recentConf}/10`,
              sub: "Latest metric score",
              icon: BarChart3,
              accent: "text-primary",
            },
          ].map((stat) => (
            <ScaleIn key={stat.label}>
              <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 hover-lift">
                <stat.icon className={`w-5 h-5 ${stat.accent} mb-3`} />
                <p className="text-2xl font-black font-headline text-on-surface">
                  {stat.value}
                </p>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">
                  {stat.label}
                </p>
                <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
                  {stat.sub}
                </p>
              </div>
            </ScaleIn>
          ))}
        </StaggerContainer>
      </FadeInUp>

      {/* Interactive Charts — Skill Profile + Score Trend */}
      <FadeInUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart — Skill Profile */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            <h2 className="text-lg font-bold font-headline text-on-surface mb-4 flex items-center justify-between">
              Skill Profile
              <Link href="/dashboard/performance" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">Details <ArrowRight className="w-3 h-3" /></Link>
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Candidate" dataKey="score" stroke="#69f6b8" fill="#69f6b8" fillOpacity={0.3} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#192540', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#dee5ff' }} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="text-center text-xs text-on-surface-variant font-medium mt-1">Interactive multi-axis analysis</div>
            </div>
          </div>

          {/* Area Chart — Score Trend */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 relative group">
            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            <h2 className="text-lg font-bold font-headline text-on-surface mb-4 flex items-center justify-between">
              Score Trend
              <Link href="/reports" className="text-xs text-secondary font-semibold hover:underline flex items-center gap-1">History <ArrowRight className="w-3 h-3" /></Link>
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#85adff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#85adff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#192540', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#dee5ff' }} />
                  <Area type="monotone" dataKey="score" stroke="#85adff" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="text-center text-xs text-on-surface-variant font-medium mt-1">Historical performance overview</div>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Quick Nav Cards */}
      <FadeInUp>
        <h2 className="text-lg font-bold font-headline text-on-surface mb-4">
          Explore Your Analysis
        </h2>
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          delayStart={0}
          staggerInterval={0.08}
        >
          {quickLinks.map((link) => (
            <ScaleIn key={link.label}>
              <div
                onClick={() => router.push(link.href)}
                className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 hover-lift cursor-pointer group flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl ${link.bg} flex items-center justify-center flex-shrink-0`}>
                  <link.icon className={`w-6 h-6 ${link.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </ScaleIn>
          ))}
        </StaggerContainer>
      </FadeInUp>

      {/* Recent Activity */}
      <FadeInUp>
        <div className="mt-8 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold font-headline text-on-surface">
              Recent Activity
            </h2>
            <Link
              href="/reports"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              All Reports <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {evaluation.evalHistory.slice(0, 3).map((report: any, idx: number) => {
              const dateStr = new Date(report.createdAt || Date.now()).toLocaleDateString();
              const strList = Array.isArray(report.strengths) 
                ? report.strengths 
                : typeof report.strengths === 'string' ? report.strengths.split(',') : [];
              return (
                <div
                  key={report._id || idx}
                  onClick={() => router.push("/dashboard/performance")}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-bright/50 cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-black text-primary">{report.score || 0}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                      {report.sessionTitle || "Interview Session"}
                    </p>
                    <p className="text-xs text-on-surface-variant">{dateStr}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {strList.slice(0, 2).map((s: string, idx: number) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant truncate max-w-[80px]">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            {evaluation.evalHistory.length === 0 && (
              <p className="text-sm text-on-surface-variant text-center py-4">No recent activity found. Start a new interview!</p>
            )}
          </div>
        </div>
      </FadeInUp>
    </StaggerContainer>
  );
}

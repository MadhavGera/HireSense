"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  FileText, Calendar, Code, Award, Mic,
  TrendingUp, BarChart3, Sparkles, ChevronRight,
} from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { PageTransition } from "@/components/motion/PageTransition";
import {
  StaggerContainer,
  FadeInUp,
  ScaleIn,
} from "@/components/motion/MotionPrimitives";
import { Button } from "@/components/ui/Button";


export default function ReportsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/history/${user.id}`);
        const data = await response.json();
        if (data.success) {
          setHistory(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user, isLoaded]);

  const totalInterviews = history.length;
  const averageScore = history.length > 0
    ? (history.reduce((acc, curr) => acc + (curr.score || 0), 0) / history.length).toFixed(1)
    : "0";
  const bestScore = history.length > 0
    ? Math.max(...history.map((h) => h.score || 0))
    : 0;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-secondary";
    if (score >= 5) return "text-primary";
    return "text-error";
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 8) return "from-secondary/20 to-secondary/5 border-secondary/30";
    if (score >= 5) return "from-primary/20 to-primary/5 border-primary/30";
    return "from-error/20 to-error/5 border-error/30";
  };

  return (
    <PageTransition>
      <TopNavBar variant="dashboard" />
      <main className="max-w-7xl mx-auto pt-24 px-6 md:px-8 pb-16">
        <StaggerContainer delayStart={0.05} staggerInterval={0.08}>
          {/* Header */}
          <FadeInUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-black font-headline text-on-surface tracking-tight">
                  Interview History
                </h1>
                <p className="text-on-surface-variant mt-2 text-lg">
                  Track your progress across every mock session.
                </p>
              </div>
              <Button
                onClick={() => router.push("/interview")}
                size="lg"
                className="flex items-center gap-2 shadow-lg hover:shadow-primary/20 self-start md:self-auto"
              >
                <Mic className="w-5 h-5" />
                New Interview
              </Button>
            </div>
          </FadeInUp>

          {/* Stats Row */}
          <FadeInUp>
            <StaggerContainer
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
              delayStart={0}
              staggerInterval={0.06}
            >
              {[
                { label: "Total Sessions", value: totalInterviews, icon: FileText, accent: "text-primary" },
                { label: "Average Score", value: `${averageScore}/10`, icon: Award, accent: "text-tertiary" },
                { label: "Best Score", value: `${bestScore}/10`, icon: TrendingUp, accent: "text-secondary" },
                { label: "Active Streak", value: `${Math.min(totalInterviews, 7)}d`, icon: Sparkles, accent: "text-primary" },
              ].map((stat) => (
                <ScaleIn key={stat.label}>
                  <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 hover-lift">
                    <stat.icon className={`w-5 h-5 ${stat.accent} mb-3`} />
                    <p className="text-2xl font-black font-headline text-on-surface">
                      {stat.value}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">{stat.label}</p>
                  </div>
                </ScaleIn>
              ))}
            </StaggerContainer>
          </FadeInUp>

          {/* Reports Grid */}
          <FadeInUp>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-on-surface-variant text-sm font-medium">Loading your history...</p>
              </div>
            ) : history.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-24 gap-6 border border-dashed border-outline-variant/20 rounded-2xl bg-surface-container-low/30">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Mic className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center max-w-md">
                  <h3 className="text-xl font-bold font-headline text-on-surface mb-2">
                    No interviews found
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Start your first mock interview today and track your improvement over time.
                    Each session generates a detailed AI analysis.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/interview")}
                  size="lg"
                  className="flex items-center gap-2 mt-2"
                >
                  <Mic className="w-5 h-5" />
                  Start First Interview
                </Button>
              </div>
            ) : (
              /* Grid of Cards */
              <StaggerContainer
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                delayStart={0}
                staggerInterval={0.06}
              >
                {history.map((report) => {
                  const strengthArray = typeof report.strengths === "string"
                    ? report.strengths.split(",").map((s: string) => s.trim()).filter(Boolean).slice(0, 2)
                    : [];
                  const score = report.score || 0;

                  return (
                    <ScaleIn key={report._id}>
                      <div
                        onClick={() => router.push("/dashboard")}
                        className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 hover-lift cursor-pointer group transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
                      >
                        {/* Subtle glow on hover */}
                        <div className="absolute inset-0 bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                        {/* Top Row: Score Circle + Title */}
                        <div className="flex items-start gap-4 relative z-10">
                          {/* Circular Score Indicator */}
                          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getScoreRingColor(score)} border flex items-center justify-center flex-shrink-0`}>
                            <span className={`text-xl font-black font-headline ${getScoreColor(score)}`}>
                              {score}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                              {report.sessionTitle || "Mock Interview"}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-on-surface-variant">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(report.createdAt)}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1 flex-shrink-0 mt-1" />
                        </div>

                        {/* Question/Topic */}
                        <div className="relative z-10">
                          <div className="flex items-start gap-2 text-xs text-on-surface-variant">
                            <Code className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary/60" />
                            <p className="line-clamp-2 leading-relaxed">
                              {report.question || "General interview question"}
                            </p>
                          </div>
                        </div>

                        {/* Strength Tags */}
                        {strengthArray.length > 0 && (
                          <div className="flex gap-2 flex-wrap relative z-10">
                            {strengthArray.map((s: string, i: number) => (
                              <span
                                key={i}
                                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary truncate max-w-[140px]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bottom: Status Badge */}
                        <div className="flex items-center justify-between relative z-10 pt-2 border-t border-outline-variant/[0.07]">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary uppercase tracking-wider">
                            Completed
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            Score: {score}/10
                          </span>
                        </div>
                      </div>
                    </ScaleIn>
                  );
                })}
              </StaggerContainer>
            )}
          </FadeInUp>
        </StaggerContainer>
      </main>

    </PageTransition>
  );
}

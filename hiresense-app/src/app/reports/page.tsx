"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  FileText, Calendar, Clock, ChevronRight,
  TrendingUp, Award, BarChart3,
} from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { PageTransition } from "@/components/motion/PageTransition";
import {
  StaggerContainer,
  FadeInUp,
  ScaleIn,
} from "@/components/motion/MotionPrimitives";
import { reportsData } from "@/data/mockData";
import { FloatingChatButton } from "@/components/dashboard/FloatingChatButton";

const statusStyles = {
  completed: "bg-secondary/10 text-secondary",
};

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
    ? (history.reduce((acc, curr) => acc + curr.score, 0) / history.length).toFixed(1) 
    : "0";


  return (
    <PageTransition>
      <TopNavBar variant="dashboard" />
      <main className="max-w-6xl mx-auto pt-24 px-8 pb-12">
        <StaggerContainer delayStart={0.05} staggerInterval={0.08}>
          {/* Header */}
          <FadeInUp>
            <div className="mb-10">
              <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">
                Interview Reports
              </h1>
              <p className="text-on-surface-variant mt-2 text-lg">
                Review past interviews, track your progress, and identify trends.
              </p>
            </div>
          </FadeInUp>

          {/* Stats Row */}
          <FadeInUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Total Interviews", value: totalInterviews, icon: FileText },
                { label: "Average Score", value: `${averageScore}/10`, icon: Award },
                { label: "Best Category", value: "Technical", icon: BarChart3 },
                { label: "Improvement", value: "+12%", icon: TrendingUp },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10"
                >
                  <stat.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-black font-headline text-on-surface">
                    {stat.value}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeInUp>

          {/* Reports List */}
          <FadeInUp>
            {isLoading ? (
              <div className="text-center py-20 text-on-surface-variant">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-20 text-on-surface-variant border border-dashed border-outline-variant/30 rounded-xl">
                No past interviews found.
              </div>
            ) : (
              <StaggerContainer className="space-y-4" delayStart={0} staggerInterval={0.06}>
                {history.map((report) => {
                  const strengthArray = typeof report.strengths === "string" 
                    ? report.strengths.split(",").map((s: string) => s.trim()).slice(0, 3) 
                    : [];
                  
                  return (
                  <ScaleIn key={report._id}>
                    <div
                      onClick={() => router.push("/dashboard")}
                      className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover-lift cursor-pointer group flex items-center gap-6"
                    >
                      {/* Score */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <span className="text-2xl font-black font-headline text-primary">
                            {report.score}
                          </span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">/10</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                          {report.sessionTitle || "Interview"}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 truncate max-w-[200px]">
                            <Clock className="w-3 h-3" />
                            {report.question || "Topic question"}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2.5 flex-wrap">
                          {strengthArray.map((s: string, i: number) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary truncate max-w-[150px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Status + Arrow */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize bg-secondary/10 text-secondary`}>
                          Completed
                        </span>
                        <ChevronRight className="w-5 h-5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </ScaleIn>
                )})}
              </StaggerContainer>
            )}
          </FadeInUp>
        </StaggerContainer>
      </main>
      <FloatingChatButton />
    </PageTransition>
  );
}

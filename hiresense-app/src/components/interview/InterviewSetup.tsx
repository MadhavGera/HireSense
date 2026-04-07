"use client";

import { useState } from "react";
import {
  Briefcase, Brain, Sparkles, ChevronRight, Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeInUp, StaggerContainer } from "@/components/motion/MotionPrimitives";

const ROLE_TOPICS: Record<string, string[]> = {
  "Frontend Engineer": ["React / Next.js", "CSS / UI Architecture", "Web Performance", "JavaScript Core", "Behavioral"],
  "Backend Engineer": ["System Design", "Databases / SQL", "APIs & Microservices", "Data Structures & Algorithms", "Behavioral"],
  "Full Stack": ["System Design", "React / Next.js", "Backend Fundamentals", "Data Structures & Algorithms", "Behavioral"],
  "Data Scientist": ["Machine Learning", "Python / Pandas", "Statistics", "Data Structures & Algorithms", "Behavioral"],
};

const ROLES = Object.keys(ROLE_TOPICS);

const DIFFICULTIES = [
  "Junior",
  "Mid-Level",
  "Senior",
] as const;

interface InterviewSetupProps {
  onStart: (question: string, topic: string) => void;
}

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [role, setRole] = useState<string>(ROLES[0]);
  const [topic, setTopic] = useState<string>(ROLE_TOPICS[ROLES[0]][0]);
  const [difficulty, setDifficulty] = useState<string>(DIFFICULTIES[1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, topic, difficulty }),
      });
      const data = await response.json();
      if (data.success && data.data?.question) {
        onStart(data.data.question, topic);
      } else {
        setError(data.message || "Failed to generate question. Please try again.");
        setIsGenerating(false);
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server. Is the backend running?");
      setIsGenerating(false);
    }
  };

  const selectClasses =
    "w-full appearance-none bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium cursor-pointer pr-10";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <StaggerContainer className="w-full max-w-lg relative z-10" delayStart={0.1} staggerInterval={0.12}>
        {/* Header */}
        <FadeInUp>
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/10">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline text-on-surface tracking-tight mb-3">
              Interview Setup
            </h1>
            <p className="text-on-surface-variant text-base max-w-sm mx-auto leading-relaxed">
              Configure your AI interviewer for a targeted mock session.
            </p>
          </div>
        </FadeInUp>

        {/* Form Card */}
        <FadeInUp>
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-7 md:p-8 shadow-xl">
            <div className="space-y-6">

              {/* Target Role */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-widest">
                  <Briefcase className="w-3.5 h-3.5 text-primary" /> Target Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setRole(newRole);
                      setTopic(ROLE_TOPICS[newRole][0]);
                    }}
                    className={selectClasses}
                    disabled={isGenerating}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Focus Topic */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-widest">
                  <Brain className="w-3.5 h-3.5 text-primary" /> Focus Topic
                </label>
                <div className="relative">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className={selectClasses}
                    disabled={isGenerating}
                  >
                    {ROLE_TOPICS[role].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-2 pb-2">
                <label className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Difficulty
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {DIFFICULTIES.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDifficulty(lvl)}
                      disabled={isGenerating}
                      className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${difficulty === lvl
                          ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]"
                          : "bg-surface-container border border-outline-variant/20 hover:border-primary/30 text-on-surface-variant hover:text-on-surface"
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-xs text-error bg-error/10 rounded-lg px-4 py-3 font-medium">
                  {error}
                </div>
              )}

              {/* Start Button */}
              <div className="pt-4 border-t border-outline-variant/10">
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-black group relative overflow-hidden"
                  onClick={handleStart}
                  disabled={isGenerating}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Question...
                      </>
                    ) : (
                      <>
                        Generate Question & Start
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  {isGenerating && (
                    <div className="absolute inset-0 bg-primary-container/20 animate-pulse rounded-xl" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </FadeInUp>
      </StaggerContainer>
    </div>
  );
}
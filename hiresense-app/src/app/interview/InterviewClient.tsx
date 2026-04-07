"use client";

import { useState } from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { InterviewSidebar } from "@/components/layout/InterviewSidebar";
import { QuestionDisplay } from "@/components/interview/QuestionDisplay";
import { AIVisualizer } from "@/components/interview/AIVisualizer";
import { RecordingControls } from "@/components/interview/RecordingControls";
import { AIStatusIndicator } from "@/components/interview/AIStatusIndicator";
import { AICoachTip } from "@/components/interview/AICoachTip";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface InterviewClientProps {
  dynamicQuestion?: string | null;
  dynamicTopic?: string | null;
  customContext?: string;
}

export function InterviewClient({ dynamicQuestion, dynamicTopic, customContext }: InterviewClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const currentQuestion = {
    id: "dynamic-1",
    topic: dynamicTopic || "AI Generated Topic",
    question: dynamicQuestion || "Loading question...",
    highlightedWords: [] as string[],
  };

  const handleSkip = () => {
    toast("Question skipped.", "info");
    router.push("/dashboard");
  };

  const handleSubmit = () => {
    toast("Answer submitted successfully!", "success");
    router.push("/dashboard");
  };

  const handleExit = () => {
    toast("Interview ended early. Progress saved.", "info");
    router.push("/dashboard");
  };

  const handleSupport = () => {
    toast("Connecting to support team...", "info");
  };

  const progressPercent = 100;

  return (
    <>
      <TopNavBar variant="interview" onExit={handleExit} onSupport={handleSupport} />

      <div className="flex h-screen pt-20">
        <InterviewSidebar onExit={handleExit} onSupport={handleSupport} progressPercent={progressPercent} />

        {/* Main Content Area */}
        <main className="lg:ml-64 flex-1 flex flex-col overflow-hidden relative w-full pt-16 lg:pt-0 pb-28 lg:pb-0">
          {/* Mobile Horizontal Progress Bar (Hidden on lg) */}
          <div className="lg:hidden absolute top-0 left-0 w-full px-6 py-4 bg-surface-container-low border-b border-outline-variant/10 z-10 flex items-center shadow-lg">
            <div className="flex-1 mr-4">
              <div className="flex justify-between text-xs mb-1.5 font-bold tracking-wider">
                <span className="text-on-surface">Interview Progress</span>
                <span className="text-primary">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="flex flex-col items-center">
              <QuestionDisplay
                question={currentQuestion.question}
                highlightedWords={currentQuestion.highlightedWords}
                topic={currentQuestion.topic}
              />
              <AIVisualizer />
            </div>
          </div>

          {/* Bottom Control Panel */}
          <RecordingControls onSkip={handleSkip} onSubmit={handleSubmit} question={currentQuestion.question} sessionTitle={currentQuestion.topic} customContext={customContext} />
        </main>

        {/* Right Side Panel (AI Indicators) */}
        <aside className="hidden lg:flex w-80 bg-surface-container-low border-l border-outline-variant/[0.15] p-6 space-y-8 flex-col z-20">
          <AIStatusIndicator />
          <AICoachTip />
        </aside>
      </div>
    </>
  );
}

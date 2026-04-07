"use client";

import { useState } from "react";
import { InterviewSetup } from "@/components/interview/InterviewSetup";
import { InterviewClient } from "./InterviewClient";

export default function InterviewPage() {
  const [started, setStarted] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<string | null>(null);
  const [generatedTopic, setGeneratedTopic] = useState<string | null>(null);
  const [customContext, setCustomContext] = useState<string | undefined>(undefined);

  const handleStart = (question: string, topic: string, context?: string) => {
    setGeneratedQuestion(question);
    setGeneratedTopic(topic);
    setCustomContext(context);
    setStarted(true);
  };

  if (!started) {
    return <InterviewSetup onStart={handleStart} />;
  }

  return (
    <InterviewClient
      dynamicQuestion={generatedQuestion}
      dynamicTopic={generatedTopic}
      customContext={customContext}
    />
  );
}

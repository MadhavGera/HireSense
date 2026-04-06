"use client";

import { useEffect, useCallback, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { interviewData } from "@/data/mockData";

interface QuestionDisplayProps {
  question?: string;
  highlightedWords?: string[];
  topic?: string;
}

/** Speak a string using the Web Speech API */
function speakText(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel(); // clear any queued speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

export function QuestionDisplay(props: QuestionDisplayProps) {
  const fallback = interviewData.questions?.[0] ?? { question: "", highlightedWords: [], topic: "" };
  const question = props.question ?? fallback.question;
  const highlightedWords = props.highlightedWords ?? fallback.highlightedWords;
  const currentTopic = props.topic ?? fallback.topic;
  const [isSpeaking, setIsSpeaking] = useState(false);

  /* ── Auto-speak when the question changes ────────────────────────────── */
  useEffect(() => {
    if (!question) return;

    speakText(question);
    setIsSpeaking(true);

    // Poll speechSynthesis.speaking to update the UI indicator
    const poll = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(poll);
      }
    }, 250);

    // Cleanup: stop speaking if the component unmounts or the question changes
    return () => {
      clearInterval(poll);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [question]);

  /* ── Replay handler ──────────────────────────────────────────────────── */
  const handleReplay = useCallback(() => {
    if (!question) return;
    speakText(question);
    setIsSpeaking(true);

    const poll = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(poll);
      }
    }, 250);

    return () => clearInterval(poll);
  }, [question]);

  /* ── Stop handler ────────────────────────────────────────────────────── */
  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Highlight specific words in the question
  const renderQuestion = () => {
    let result = question;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    highlightedWords.forEach((word: string) => {
      const idx = result.indexOf(word, lastIndex);
      if (idx !== -1) {
        if (idx > lastIndex) {
          elements.push(result.slice(lastIndex, idx));
        }
        elements.push(
          <span key={word} className="text-primary">
            {word}
          </span>
        );
        lastIndex = idx + word.length;
      }
    });

    if (lastIndex < result.length) {
      elements.push(result.slice(lastIndex));
    }

    return elements;
  };

  return (
    <div className="max-w-3xl w-full px-4 lg:px-0">
      <div className="mb-8 lg:mb-12 text-center">
        <span className="text-[10px] lg:text-xs font-bold tracking-[0.2em] text-primary/60 uppercase mb-3 lg:mb-4 block">
          Current Topic: {currentTopic}
        </span>
        <h1 className="text-2xl lg:text-4xl font-extrabold text-on-surface font-headline leading-tight tracking-tight">
          {renderQuestion()}
        </h1>

        {/* Replay / Stop TTS button */}
        <button
          onClick={isSpeaking ? handleStop : handleReplay}
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200
            bg-surface-container-high/60 text-on-surface-variant hover:text-primary hover:bg-surface-bright/80 active:scale-95"
          title={isSpeaking ? "Stop audio" : "Replay question audio"}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              Stop
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              Replay
            </>
          )}
        </button>
      </div>
    </div>
  );
}

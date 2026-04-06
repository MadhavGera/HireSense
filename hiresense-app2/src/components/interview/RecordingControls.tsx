"use client";

import { useState, useRef } from "react";
import { Mic, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function RecordingControls() {
  const [inputMode, setInputMode] = useState<"voice" | "type">("voice");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    console.log("Clicked toggleRecording");
    if (isRecording) {
      // Stop Recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start Recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const options = MediaRecorder.isTypeSupported('audio/webm') ? { mimeType: 'audio/webm' } : {};
        const mediaRecorder = new MediaRecorder(stream, options);
        
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blobMimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp3';
          const blob = new Blob(audioChunksRef.current, { type: blobMimeType });
          setAudioBlob(blob);
          
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setAudioBlob(null);
      } catch (err) {
        console.error("Microphone Access Error:", err);
        alert("Microphone access denied or unavailable. Please check your browser permissions.");
      }
    }
  };

  const handleSubmit = async () => {
    console.log("Clicked handleSubmit");
    if (inputMode === "voice" && !audioBlob) {
      alert("Please record an audio answer first before submitting.");
      return;
    }
    if (inputMode === "type" && !typedAnswer.trim()) {
      alert("Please type your answer first before submitting.");
      return;
    }

    setIsEvaluating(true);

    try {
      const formData = new FormData();
      if (inputMode === "voice" && audioBlob) {
        formData.append("audio", audioBlob, "recording.webm");
      }
      if (inputMode === "type" && typedAnswer) {
        formData.append("textAnswer", typedAnswer);
      }
      formData.append("candidateName", "Alex Rivera"); // Extra context

      const response = await fetch("http://localhost:5000/api/evaluate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonObj = await response.json();
      console.log("✅ Extracted Evaluation Payload:", jsonObj);
    } catch (error) {
      console.error("❌ API Submission failed:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 lg:relative lg:z-50 lg:w-full p-4 md:p-6 lg:p-8 bg-surface lg:bg-transparent lg:glass-panel border-t border-outline-variant/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] lg:shadow-none transition-transform duration-300">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 lg:gap-8">
        
        {/* Top: Voice / Type Toggle */}
        <div className="flex items-center bg-surface-container-lowest/40 p-1 rounded-full border border-outline-variant/20 shadow-sm">
          <button
            onClick={() => {
              console.log("Switched to Voice Mode");
              setInputMode("voice");
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all",
              inputMode === "voice"
                ? "bg-primary text-on-primary shadow-lg"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Mic className="w-4 h-4" />
            <span>Voice</span>
          </button>
          <button
            onClick={() => {
              console.log("Switched to Type Mode");
              setInputMode("type");
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all",
              inputMode === "type"
                ? "bg-primary text-on-primary shadow-lg"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Keyboard className="w-4 h-4" />
            <span>Type</span>
          </button>
        </div>

        {/* Middle: Main Action Area */}
        <div className="w-full flex justify-center relative z-10 min-h-[140px] items-center">
          {inputMode === "voice" ? (
            <button
              onClick={toggleRecording}
              className="group relative flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300"
            >
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-xl",
                  isRecording
                    ? "bg-gradient-to-br from-error to-error-dim mic-glow-active"
                    : "bg-gradient-to-br from-primary to-primary-container mic-glow"
                )}
              >
                <Mic
                  className={cn(
                    "w-8 h-8",
                    isRecording ? "text-white" : "text-on-primary"
                  )}
                  fill="currentColor"
                />
              </div>
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-widest whitespace-nowrap",
                  isRecording ? "text-error animate-pulse" : "text-primary hover:opacity-80 transition-opacity",
                  audioBlob && !isRecording && "text-secondary"
                )}
              >
                {isRecording ? "Recording Audio..." : (audioBlob ? "Audio Captured! Click to Re-Record" : "Start Recording")}
              </span>
            </button>
          ) : (
            <div className="w-full animate-in fade-in zoom-in duration-300">
              <textarea
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Type your detailed answer here..."
                className="w-full h-32 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y shadow-inner"
              />
            </div>
          )}
        </div>

        {/* Bottom: Submission Actions */}
        <div className="flex items-center gap-4 w-full sm:w-auto mt-2">
          <Button variant="secondary" size="lg" className="px-8 flex-1 sm:flex-none">
            Skip
          </Button>
          <Button 
            size="lg" 
            className="font-black px-10 flex-1 sm:flex-none shadow-lg"
            onClick={handleSubmit}
            disabled={isEvaluating || isRecording}
          >
            {isEvaluating ? "Analyzing..." : "Submit Answer"}
          </Button>
        </div>
        
      </div>
    </div>
  );
}

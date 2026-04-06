"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string;
}

const STORAGE_KEY = "hiresense_chat_messages";
const OPEN_KEY = "hiresense_chat_open";

const aiResponses: Record<string, string> = {
  default:
    "That's a great question! Based on your interview data, I'd recommend focusing on reducing filler words and strengthening your system design explanations. Want me to elaborate on either topic?",
  score:
    "Your hireability score puts you among the top candidates for this role. Check the Performance tab on your dashboard for a complete breakdown of Technical Depth, Communication, and Confidence metrics.",
  tips: "Here are my top 3 tips: 1) Replace 'um' with short pauses—it sounds more confident. 2) Structure answers using the STAR method. 3) Practice explaining complex concepts without jargon first.",
  practice:
    "I'd suggest practicing with these focus areas: system architecture, data structures, and behavioral scenarios. Head to the Interview page to generate a fresh AI-powered question tailored to your level!",
  help: "I can help with: reviewing your scores, suggesting improvement tips, recommending practice topics, and answering questions about your analytics. Just ask!",
};

function getAiResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("score") || lower.includes("rating") || lower.includes("performance"))
    return aiResponses.score;
  if (lower.includes("tip") || lower.includes("help") || lower.includes("improve"))
    return aiResponses.tips;
  if (lower.includes("practice") || lower.includes("prepare") || lower.includes("question"))
    return aiResponses.practice;
  if (lower.includes("what") && lower.includes("can"))
    return aiResponses.help;
  return aiResponses.default;
}

export function FloatingChatButton() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      const savedOpen = localStorage.getItem(OPEN_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
      if (savedOpen === "true") {
        setIsOpen(true);
      }
    } catch (e) {}
    setHydrated(true);
  }, []);

  // Inject a welcome message if no messages exist yet (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    if (messages.length === 0) {
      const firstName = user?.firstName || "there";
      const welcomeMsg: ChatMessage = {
        id: "welcome-1",
        role: "ai",
        text: `Hi ${firstName}! 👋 I'm your AI Interview Coach. I can help you review your performance, suggest improvements, or answer questions about your analytics. How can I help?`,
        timestamp: "Just now",
      };
      setMessages([welcomeMsg]);
    }
  }, [hydrated, user?.firstName]);

  // Persist messages whenever they change
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, hydrated]);

  // Persist open/closed state
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(OPEN_KEY, String(isOpen));
  }, [isOpen, hydrated]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        text: getAiResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }, [inputValue]);

  const handleClearChat = () => {
    const firstName = user?.firstName || "there";
    setMessages([{
      id: "welcome-1",
      role: "ai",
      text: `Hi ${firstName}! 👋 Chat cleared. How can I help you today?`,
      timestamp: "Just now",
    }]);
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-28 right-8 w-96 h-[520px] bg-surface-container border border-outline-variant/15 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10 bg-surface-container-high/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface font-headline">AI Coach</h3>
                  <p className="text-xs text-secondary">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-bright rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-bright rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "ai" ? "bg-secondary/15" : "bg-primary/15"
                  }`}>
                    {msg.role === "ai" ? (
                      <Bot className="w-3.5 h-3.5 text-secondary" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "ai"
                        ? "bg-surface-container-high text-on-surface rounded-tl-md"
                        : "bg-primary text-on-primary rounded-tr-md"
                    }`}
                  >
                    {msg.text}
                    <div className={`text-[10px] mt-1.5 ${
                      msg.role === "ai" ? "text-on-surface-variant" : "text-on-primary/60"
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-secondary" />
                  </div>
                  <div className="bg-surface-container-high px-4 py-3 rounded-2xl rounded-tl-md">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-outline-variant/10 bg-surface-container-high/30">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask your AI coach..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-surface-container-highest/60 text-on-surface placeholder:text-on-surface-variant/50 text-sm rounded-xl px-4 py-2.5 border border-outline-variant/10 focus:outline-none focus:border-primary/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-all active:scale-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 animate-float"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5" fill="currentColor" />
        )}
      </button>
    </>
  );
}

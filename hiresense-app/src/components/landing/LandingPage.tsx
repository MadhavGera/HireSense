"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Brain, Mic, Target, ArrowRight, Sparkles, Zap, Shield, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/* ─── Shared Animation Helpers ───────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.3 + i * 0.1, ease },
  }),
};

/* ─── Features Data ──────────────────────────────────────────────────────── */
const features = [
  {
    icon: Brain,
    title: "Dynamic AI Questions",
    description:
      "Never take the same interview twice. Questions are generated on the fly based on your target role and difficulty.",
    accent: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderGlow: "group-hover:shadow-primary/10",
  },
  {
    icon: Mic,
    title: "Real Voice Analysis",
    description:
      "Using OpenAI Whisper, we analyze your actual spoken words, capturing every 'um' and 'uh' to improve your delivery.",
    accent: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
    borderGlow: "group-hover:shadow-secondary/10",
  },
  {
    icon: Target,
    title: "Actionable Feedback",
    description:
      "Get graded on a 10-point scale with detailed breakdowns of your strengths, weaknesses, and a rewritten ideal pitch.",
    accent: "from-tertiary/20 to-tertiary/5",
    iconColor: "text-tertiary",
    borderGlow: "group-hover:shadow-tertiary/10",
  },
];

/* ─── Stats Data ─────────────────────────────────────────────────────────── */
const stats = [
  { value: "10,000+", label: "Interviews Simulated" },
  { value: "95%", label: "Confidence Boost" },
  { value: "4.9★", label: "User Rating" },
  { value: "50+", label: "Tech Roles Covered" },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-surface overflow-hidden">
      {/* ─── Background Decorations ────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large gradient orb — top right */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-primary/[0.07] blur-[120px]" />
        {/* Small accent orb — bottom left */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-secondary/[0.05] blur-[100px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(133,173,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(133,173,255,0.3) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ─── Navigation ────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 h-20"
      >
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter text-on-surface font-headline flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-on-primary" />
          </div>
          HireSense
        </Link>

        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors duration-200 cursor-pointer">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:bg-primary-dim transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 cursor-pointer">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </motion.header>

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 md:pt-24 pb-20">
        {/* Tag */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/60 border border-outline-variant/20 text-xs font-bold text-on-surface-variant backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-secondary" />
            AI-Powered Interview Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-black font-headline text-on-surface tracking-tight leading-[1.08]"
        >
          Nail Your Next{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-primary via-primary-dim to-secondary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
              Technical Interview
            </span>
          </span>{" "}
          with AI.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mt-6 text-base md:text-lg text-on-surface-variant/80 leading-relaxed"
        >
          Practice dynamic, role-specific questions with real-time voice analysis.
          Get instant feedback on your technical depth, communication, and confidence.
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <SignUpButton mode="modal">
            <button className="group relative px-8 py-4 rounded-2xl bg-primary text-on-primary text-base font-bold hover:bg-primary-dim transition-all duration-300 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2">
              Start Practicing for Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              {/* Glow ring */}
              <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </button>
          </SignUpButton>
          <span className="text-xs text-on-surface-variant/60 font-medium">
            No credit card required
          </span>
        </motion.div>

        {/* Hero visual — glowing mock card */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 w-full max-w-3xl"
        >
          <div className="relative rounded-2xl border border-outline-variant/15 bg-surface-container-low/60 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-primary/5 animate-shimmer-glow">
            {/* Fake UI preview */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-error/60" />
              <div className="w-3 h-3 rounded-full bg-secondary/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
              <div className="flex-1" />
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                Live Interview Session
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface mb-1">AI Interviewer</p>
                  <div className="rounded-xl bg-surface-container/80 p-4 border border-outline-variant/10">
                    <p className="text-sm text-on-surface-variant leading-relaxed text-center mx-auto">
                      &quot;Can you explain the difference between a stack and a queue? Give me an example of when you&apos;d use each in a production system.&quot;
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mic className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface mb-1">Your Response</p>
                  <div className="rounded-xl bg-surface-container/80 p-4 border border-outline-variant/10 flex items-center gap-3">
                    {/* Fake waveform bars */}
                    <div className="flex items-end gap-[3px] h-6">
                      {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 1, 0.55, 0.75, 0.45, 0.85, 0.65, 0.95, 0.5].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="w-[3px] rounded-full bg-secondary/60 audio-bar"
                            style={{
                              height: `${h * 100}%`,
                              animationDelay: `${i * 0.08}s`,
                            }}
                          />
                        )
                      )}
                    </div>
                    <span className="text-xs text-on-surface-variant/60 font-medium">
                      Recording...
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Score pill */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface-container-high border border-outline-variant/20 rounded-full px-5 py-2 shadow-lg">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-on-surface">Score: 8.4/10</span>
              <span className="text-[10px] text-secondary font-semibold">+1.2 ↑</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Stats Bar ─────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-12 border-y border-outline-variant/10"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-black font-headline text-on-surface tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-on-surface-variant/70 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── Features Grid ─────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high/50 border border-outline-variant/15 text-xs font-bold text-on-surface-variant mb-4">
              <Shield className="w-3 h-3 text-primary" />
              Key Features
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-headline text-on-surface tracking-tight">
              Everything you need to{" "}
              <span className="text-primary">ace the interview</span>
            </h2>
            <p className="text-on-surface-variant/70 mt-3 max-w-xl mx-auto">
              Our AI-driven platform simulates real interview conditions so you
              walk in prepared and confident.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className={`group relative rounded-2xl border border-outline-variant/10 bg-surface-container-low/50 backdrop-blur-md p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${feature.borderGlow}`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high/60 flex items-center justify-center mb-5 border border-outline-variant/10 group-hover:border-outline-variant/20 transition-colors">
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold font-headline text-on-surface mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant/75 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface-container to-secondary/10" />
          <div className="absolute inset-0 border border-outline-variant/15 rounded-3xl" />

          <div className="relative z-10 py-16 px-8 md:px-16 text-center">
            <h2 className="text-3xl md:text-4xl font-black font-headline text-on-surface tracking-tight mb-4">
              Ready to transform your interview game?
            </h2>
            <p className="text-on-surface-variant/70 mb-8 max-w-lg mx-auto">
              Join thousands who&apos;ve leveled up their technical interview skills with
              AI-powered practice sessions.
            </p>
            <SignUpButton mode="modal">
              <button className="group px-8 py-4 rounded-2xl bg-primary text-on-primary text-base font-bold hover:bg-primary-dim transition-all duration-300 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2">
                Start Practicing Now
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </SignUpButton>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-outline-variant/10 py-10 px-6 md:px-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-on-primary" />
            </div>
            <span className="font-headline font-bold text-on-surface-variant text-sm">
              HireSense
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-on-surface-variant/60">
            <a href="#" className="hover:text-on-surface transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-on-surface transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-on-surface transition-colors">
              Contact
            </a>
          </nav>
          <p className="text-xs text-on-surface-variant/40">
            © {new Date().getFullYear()} HireSense. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

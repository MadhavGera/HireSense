"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Brain,
  Mic,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  ChevronRight,
  Stars,
  Orbit,
  Eye,
  Settings,
} from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  StaggerContainer,
  FadeInUp,
  ScaleIn,
  MaskedLineReveal,
  ParallaxLayer,
} from "@/components/motion/MotionPrimitives";

/* ─── Shared Animation Constants ────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;


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

/* ─── Sub-Component: AI Sentinel Entity ──────────────────────────────────── */
function AiSentinel({ mouseX, mouseY }: { mouseX: any, mouseY: any }) {
  const [isHovered, setIsHovered] = useState(false);

  // Eye Tracking Logic (Max Reactivity)
  const pupilX = useTransform(mouseX, [-800, 800], [-22, 22]);
  const pupilY = useTransform(mouseY, [-500, 500], [-18, 18]);

  // Body Lean Logic
  const rotateX = useTransform(mouseY, [-500, 500], [15, -15]);
  const rotateY = useTransform(mouseX, [-800, 800], [-15, 15]);
  const translateY = useTransform(mouseY, [-500, 500], [-10, 10]);

  return (
    <motion.div
      style={{ y: translateY }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative w-64 h-64 md:w-80 md:h-80 perspective-1000 hidden lg:flex items-center justify-center group z-20"
    >
      {/* Outer Glow Halo */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: isHovered ? [0.4, 0.6, 0.4] : [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-primary/20 rounded-full blur-[100px]"
      />

      {/* Sentinel Outer Shell */}
      <motion.div
        className="relative w-48 h-48 md:w-56 md:h-56 rounded-[60px] border border-outline-variant/20 bg-surface-container-low/40 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,#85adff_1px,transparent_1px)] bg-[size:10px_10px]" />

        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface-container-high/60 border border-outline-variant/10 flex items-center justify-center shadow-inner">
          <motion.div
            animate={{
              opacity: [0.7, 1, 0.7],
              boxShadow: isHovered
                ? [
                  "0 0 40px rgba(133,173,255, 0.6)",
                  "0 0 80px rgba(133,173,255, 0.9)",
                  "0 0 40px rgba(133,173,255, 0.6)"
                ]
                : [
                  "0 0 20px rgba(133,173,255, 0.3)",
                  "0 0 40px rgba(133,173,255, 0.5)",
                  "0 0 20px rgba(133,173,255, 0.3)"
                ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 md:w-22 md:h-22 rounded-full bg-gradient-to-br from-primary via-primary-dim to-secondary flex items-center justify-center relative overflow-visible shadow-[0_0_30px_rgba(133,173,255,0.4)]"
          >
            <div className="absolute inset-0 rounded-full bg-primary/60 blur-xl animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-white/20 blur-md" />

            <motion.div
              style={{ x: pupilX, y: pupilY }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface-container-high shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center relative z-10 border border-white/10"
            >
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(133,173,255,1)] animate-ping absolute opacity-50" />
              <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-primary shadow-[0_0_10px_rgba(133,173,255,1)] relative z-10" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-[40px] border border-primary/10 border-dashed"
        />

        <div className="absolute top-4 left-4 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
        </div>
      </motion.div>



      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-8 -left-5 p-3 rounded-2xl bg-surface-container-high/80 border border-outline-variant/20 shadow-xl backdrop-blur-md"
      >
        <Settings className="w-5 h-5 text-primary/50 animate-spin-slow" />
      </motion.div>

      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute top-[110%] left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md whitespace-nowrap"
      >
        <span className="text-[10px] font-black tracking-widest text-primary uppercase">
          AI Monitoring Active
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function LandingPage() {
  const [year, setYear] = useState(2026);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Cursor Tracking Hub ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High-Response Snappy Springs (Back to Real-Time Feel)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    setYear(new Date().getFullYear());

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = clientX - window.innerWidth / 2;
      const moveY = clientY - window.innerHeight / 2;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // --- Tilt Logic for Mock Card ---
  const rotateX = useTransform(springY, [-500, 500], [8, -8]);
  const rotateY = useTransform(springX, [-500, 500], [-8, 8]);


  return (
    <div ref={containerRef} className="relative min-h-screen bg-surface overflow-hidden cursor-default selection:bg-primary/30 text-on-surface font-sans">
      {/* ─── Background Decorations ────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            left: "50%",
            top: "50%",
          }}
          className="absolute w-[1200px] h-[1200px] bg-primary/[0.03] rounded-full blur-[160px] z-0"
        />

        <StaggerContainer delayStart={0.5} staggerInterval={0.2} className="absolute inset-0">
          <ParallaxLayer speed={0.5} className="absolute top-[20%] left-[10%] opacity-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Brain className="w-12 h-12 text-primary" />
            </motion.div>
          </ParallaxLayer>
          <ParallaxLayer speed={0.8} invert className="absolute bottom-[15%] right-[15%] opacity-15">
            <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }}>
              <Zap className="w-16 h-16 text-secondary" />
            </motion.div>
          </ParallaxLayer>
          <ParallaxLayer speed={0.3} className="absolute top-[60%] left-[5%] opacity-10">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }}>
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
          </ParallaxLayer>
          <ParallaxLayer speed={1.2} className="absolute top-[10%] right-[20%] opacity-15">
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
              <Orbit className="w-20 h-20 text-tertiary" />
            </motion.div>
          </ParallaxLayer>
        </StaggerContainer>

        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
      <section className="relative z-10 px-6 pt-16 md:pt-24 pb-20 overflow-visible">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <StaggerContainer delayStart={0.2} staggerInterval={0.15} className="text-center lg:text-left">
            <FadeInUp className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/60 border border-outline-variant/20 text-xs font-black text-primary uppercase tracking-widest backdrop-blur-sm shadow-xl shadow-black/5 group cursor-default">
                <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                AI Logic Interface
              </span>
            </FadeInUp>

            <div className="space-y-4">
              <MaskedLineReveal className="text-6xl md:text-7xl lg:text-8xl font-black font-headline text-on-surface tracking-tighter leading-[0.95]">
                Nail Your Next
              </MaskedLineReveal>
              <MaskedLineReveal className="text-6xl md:text-7xl lg:text-8xl font-black font-headline text-on-surface tracking-tighter leading-[0.95]">
                <span className="bg-gradient-to-r from-primary via-primary-dim to-secondary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
                  Technical Interview
                </span>{" "}
                with AI.
              </MaskedLineReveal>
            </div>

            <FadeInUp className="max-w-2xl mt-12 lg:mx-0 mx-auto">
              <p className="text-lg md:text-xl text-on-surface-variant/80 font-medium leading-relaxed">
                Adaptive role-specific questions that react to your
                voice, logic, and speed in real-time.
              </p>
            </FadeInUp>

            <FadeInUp className="mt-14 flex flex-col sm:flex-row items-center gap-6 lg:justify-start justify-center">
              <SignUpButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-10 py-5 rounded-3xl bg-primary text-on-primary text-lg font-black transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-primary/40 cursor-pointer flex items-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <Stars className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Start My Prep
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </motion.button>
              </SignUpButton>
              <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant/40">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Targeting 50+ Tech Roles
              </div>
            </FadeInUp>
          </StaggerContainer>

          <div className="flex items-center justify-center relative">
            <AiSentinel mouseX={springX} mouseY={springY} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <FadeInUp className="mt-12 w-full [perspective:2000px]">
            <motion.div
              className="group relative rounded-[40px] border border-outline-variant/15 bg-surface-container-low/60 backdrop-blur-3xl p-6 md:p-12 shadow-[0_48px_80px_-16px_rgba(0,0,0,0.3)] hover:shadow-primary/10 transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
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
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-on-surface mb-1">AI Interviewer</p>
                    <div className="rounded-xl bg-surface-container/80 p-4 border border-outline-variant/10">
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {"\"Can you explain the difference between a stack and a queue? Give me an example of when you'd use each in a production system.\""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mic className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-on-surface mb-1">Your Response</p>
                    <div className="rounded-xl bg-surface-container/80 p-4 border border-outline-variant/10 flex items-center gap-3">
                      {/* Robust Waveform Animation Loop */}
                      <div className="flex items-end gap-[4px] h-8 relative">
                        {[0.4, 0.7, 0.9, 0.6, 0.8, 0.5, 0.7, 1.0, 0.6, 0.9, 0.5, 0.8, 0.4, 0.7, 0.5].map(
                          (h, i) => (
                            <motion.div
                              key={i}
                              animate={{
                                height: ["35%", "65%", "42%"],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.1,
                              }}
                              className="w-[4px] bg-primary/80 rounded-full shadow-[0_0_12px_rgba(133,173,255,0.5)]"
                            />
                          )
                        )}
                      </div>
                      <span className="text-xs text-on-surface-variant/60 font-medium ml-2">
                        Recording...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface-container-high border border-outline-variant/20 rounded-full px-5 py-2 shadow-lg">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-on-surface">Score: 8.4/10</span>
                <span className="text-[10px] text-secondary font-semibold">+1.2 ↑</span>
              </div>
            </motion.div>
          </FadeInUp>
        </div>
      </section>

      {/* ─── Stats Bar ─────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 border-b border-outline-variant/10 bg-surface-container-low/30 backdrop-blur-xl">
        <StaggerContainer className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <FadeInUp key={stat.label} className="text-center group">
              <motion.div
                whileHover={{ y: -5 }}
                className="relative inline-block"
              >
                <p className="text-5xl md:text-6xl font-black font-headline text-on-surface tracking-tighter group-hover:text-primary transition-colors">
                  {stat.value}
                </p>
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-primary/40 group-hover:w-full transition-all duration-500 rounded-full" />
              </motion.div>
              <p className="text-xs text-on-surface-variant/60 mt-4 font-black uppercase tracking-widest">
                {stat.label}
              </p>
            </FadeInUp>
          ))}
        </StaggerContainer>
      </section>

      {/* ─── Features Grid ─────────────────────────────────────────────── */}
      <section className="relative z-10 py-36 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <FadeInUp>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-[11px] font-black uppercase tracking-wider text-secondary mb-6">
                <Orbit className="w-4 h-4" />
                Engineering Excellence
              </span>
            </FadeInUp>
            <MaskedLineReveal className="text-5xl md:text-6xl font-black font-headline text-on-surface tracking-tighter leading-tight">
              Ready to <span className="text-primary italic">Aura-Up</span> Your Prep?
            </MaskedLineReveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <ScaleIn key={feature.title} from={0.95} className="group h-full">
                <div className="relative h-full rounded-[40px] border border-outline-variant/10 bg-surface-container-low/40 backdrop-blur-3xl p-10 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden">
                  <div className={`absolute inset-0 rounded-[40px] bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none`} />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{
                        rotate: [0, -15, 15, 0],
                        scale: 1.15
                      }}
                      className="w-16 h-16 rounded-2xl bg-surface-container-high/90 flex items-center justify-center mb-8 border border-outline-variant/10 group-hover:border-primary/40 transition-all shadow-2xl shadow-black/20"
                    >
                      <feature.icon className={`w-8 h-8 ${feature.iconColor} group-hover:scale-110 transition-transform`} />
                    </motion.div>
                    <h3 className="text-2xl font-black font-headline text-on-surface mb-4 tracking-tighter">
                      {feature.title}
                    </h3>
                    <p className="text-base text-on-surface-variant/80 font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/30 transition-colors duration-700" />
                </div>
              </ScaleIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden"
        >
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

      <footer className="relative z-10 border-t border-outline-variant/10 py-10 px-6 md:px-20 text-on-surface-variant">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-on-primary" />
            </div>
            <span className="font-headline font-bold text-sm">
              HireSense
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
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
          <p className="text-xs opacity-40">
            © {year} HireSense. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
import { dashboardData } from "@/data/mockData";

export function HeroScore() {
  return (
    <div className="mb-12 flex flex-col md:flex-row items-center gap-12">
      {/* Score Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full score-gauge opacity-20" />
        <div className="absolute inset-2 rounded-full bg-surface" />
        <div className="relative text-center">
          <div className="text-5xl font-black font-headline text-on-surface">
            {dashboardData.hireabilityScore}
          </div>
          <div className="text-on-surface-variant font-label uppercase tracking-widest text-[10px]">
            Hireability Score
          </div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(133,173,255,0.15)] pointer-events-none" />
      </div>

      {/* Hero Text */}
      <div className="flex-1 space-y-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface">
          Congratulations, {dashboardData.candidateName}!
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Your interview performance ranks in the{" "}
          <span className="text-secondary font-bold">
            {dashboardData.percentile}
          </span>{" "}
          of applicants for the Senior Architect role. The AI has identified
          significant strengths in technical depth and leadership readiness.
        </p>
      </div>
    </div>
  );
}

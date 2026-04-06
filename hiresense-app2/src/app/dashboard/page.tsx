import { TopNavBar } from "@/components/layout/TopNavBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeroScore } from "@/components/dashboard/HeroScore";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuestionBreakdown } from "@/components/dashboard/QuestionBreakdown";
import { AIRecommendedPitch } from "@/components/dashboard/AIRecommendedPitch";
import { RadarChartWidget } from "@/components/dashboard/RadarChartWidget";
import { NextSteps } from "@/components/dashboard/NextSteps";
import { FloatingChatButton } from "@/components/dashboard/FloatingChatButton";
import { dashboardData } from "@/data/mockData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Dashboard | HireSense",
  description:
    "Review your AI-powered interview analytics, skill breakdown, and personalized improvement recommendations.",
};

export default function DashboardPage() {
  return (
    <>
      <TopNavBar variant="dashboard" />
      <Sidebar />

      <main className="ml-64 pt-24 px-8 pb-12">
        {/* Hero Analytics Section */}
        <HeroScore />

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {dashboardData.metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              score={metric.score}
              icon={metric.icon}
              barHeights={metric.barHeights}
              barOpacities={metric.barOpacities}
            />
          ))}
        </div>

        {/* Detailed Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <QuestionBreakdown />
            <AIRecommendedPitch />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            <RadarChartWidget />
            <NextSteps />
          </div>
        </div>
      </main>

      <FloatingChatButton />
    </>
  );
}

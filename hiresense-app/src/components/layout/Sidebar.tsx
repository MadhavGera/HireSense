"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  Users,
  BadgeCheck,
  Download,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { dashboardData } from "@/data/mockData"; // Keeping minimal mock data for static array, or re-define static array
import { useEvaluation } from "@/lib/useEvaluation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const iconMap = {
  LayoutDashboard,
  BarChart3,
  Brain,
  Users,
  BadgeCheck,
};

const sidebarNavItems = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Performance", href: "/dashboard/performance", icon: "BarChart3" },
  { label: "Skill Gap", href: "/dashboard/skill-gap", icon: "Brain" },
  { label: "Culture Fit", href: "/dashboard/culture-fit", icon: "Users" },
  { label: "Verdict", href: "/dashboard/verdict", icon: "BadgeCheck" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const evaluation = useEvaluation();

  const handleExport = () => {
    const report = {
      candidate: user ? user.fullName || user.firstName : "Candidate",
      hireabilityScore: evaluation.hireabilityScore,
      metrics: evaluation.metricsList.map((m) => ({
        label: m.label,
        score: m.score,
      })),
      skillBreakdown: evaluation.skillBreakdown,
      aiPitch: evaluation.improvedPitch,
      history: evaluation.evalHistory,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hiresense-report-${(user?.firstName || "user").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast("Report exported successfully!", "success");
  };

  const getIsActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-container-low flex flex-col p-4 z-40">
      <div className="mb-6 px-2">
        <div className="flex items-center gap-3 mb-2">
          {user?.imageUrl ? (
            <img
              alt="User Avatar"
              className="w-10 h-10 rounded-lg object-cover"
              src={user.imageUrl}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <div className="text-on-surface font-bold font-headline text-sm leading-tight">
              Software Engineer
            </div>
            <div className="text-on-surface-variant text-xs">
              {user ? user.fullName || user.firstName : "Loading..."}
            </div>
          </div>
        </div>
      </div>

      {/* Start Interview CTA */}
      <Button
        onClick={() => router.push("/interview")}
        className="w-full mb-6 py-2.5 flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
      >
        <Mic className="w-4 h-4" />
        New Interview
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {sidebarNavItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = getIsActive(item.href);
          return (
            <div
              key={item.label}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cursor-pointer transition-all active:translate-x-1 rounded-lg",
                isActive
                  ? "text-primary font-bold bg-surface-container-high"
                  : "text-on-surface-variant hover:bg-surface-bright hover:text-on-surface"
              )}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="font-label text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </nav>

      {/* Export Button */}
      <Button
        variant="secondary"
        size="sm"
        className="mt-auto w-full py-2 flex items-center justify-center gap-2"
        onClick={handleExport}
      >
        <Download className="w-4 h-4" />
        Export Report
      </Button>
    </aside>
  );
}

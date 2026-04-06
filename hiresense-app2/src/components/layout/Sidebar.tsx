"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  Users,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardData, profileImages } from "@/data/mockData";
import { Button } from "@/components/ui/Button";

const iconMap = {
  LayoutDashboard,
  BarChart3,
  Brain,
  Users,
  BadgeCheck,
};

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("Performance");

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-container-low flex flex-col p-4 z-40">
      {/* Session Info */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-2">
          <img
            alt="Interview Session"
            className="w-10 h-10 rounded-lg object-cover"
            src={profileImages.session}
          />
          <div>
            <div className="text-on-surface font-bold font-headline text-sm leading-tight">
              {dashboardData.role}
            </div>
            <div className="text-on-surface-variant text-xs">
              {dashboardData.fullName}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {dashboardData.sidebarNavItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = item.label === activeItem;
          const href = item.label === "Performance" ? "/interview" : (item.label === "Overview" ? "/dashboard" : "#");
          return (
            <Link
              key={item.label}
              href={href}
              onClick={() => setActiveItem(item.label)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cursor-pointer transition-all active:translate-x-1",
                isActive
                  ? "text-primary font-bold bg-surface-container-high rounded-lg"
                  : "text-on-surface-variant hover:bg-surface-bright hover:text-on-surface"
              )}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="font-label text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Export Button */}
      <Button 
        variant="secondary" 
        size="sm" 
        className="mt-auto w-full py-2 block"
        onClick={() => alert("Exporting your performance report as a PDF...")}
      >
        Export Report
      </Button>
    </aside>
  );
}

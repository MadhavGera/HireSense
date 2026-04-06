"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Settings, Clock, Menu, X,
  CheckCircle, CircleDot, Circle, Headset, LogOut,
  Volume2, Moon, Globe, Shield, ChevronRight,
} from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

interface TopNavBarProps {
  variant: "dashboard" | "interview";
  onExit?: () => void;
  onSupport?: () => void;
}

const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Reports", href: "/reports" },
  { label: "Candidates", href: "/candidates" },
  { label: "Settings", href: "/settings" },
];

const statusConfig = {
  completed: {
    Icon: CheckCircle,
    fill: true,
    classes: "text-on-surface-variant opacity-60",
    iconClass: "text-secondary",
  },
  active: {
    Icon: CircleDot,
    fill: true,
    classes: "bg-surface-container-high text-primary rounded-lg",
    iconClass: "text-primary",
  },
  pending: {
    Icon: Circle,
    fill: false,
    classes: "text-on-surface-variant hover:bg-surface-bright rounded-lg",
    iconClass: "text-on-surface-variant",
  },
};

/* ─── Settings data ──────────────────────────────────────────────────────── */

const settingsItems = [
  { icon: Volume2, label: "Audio Settings", description: "Microphone & speaker" },
  { icon: Moon, label: "Appearance", description: "Dark mode enabled" },
  { icon: Globe, label: "Language", description: "English (US)" },
  { icon: Shield, label: "Privacy", description: "Data & permissions" },
];

/* ─── Dropdown animation ─────────────────────────────────────────────────── */

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0, y: -8, scale: 0.95,
    transition: { duration: 0.15 },
  },
};

export function TopNavBar({ variant, onExit, onSupport }: TopNavBarProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { user } = useUser();

  // Nav links all have real routes now, no need for handleNavClick

  if (variant === "interview") {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface flex justify-between items-center w-full px-4 lg:px-8 py-4 border-b border-open lg:border-none border-outline-variant/10">
          <div className="flex items-center gap-3 lg:gap-8">
            <button
              className="lg:hidden p-2 -ml-2 text-on-surface hover:bg-surface-bright rounded-lg"
              onClick={() => setIsMobileDrawerOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link
              href="/dashboard"
              className="text-lg lg:text-xl font-black text-primary tracking-tighter font-headline"
            >
              HireSense
            </Link>
            <div className="h-4 w-px bg-outline-variant/30 hidden md:block" />
            <span className="hidden md:inline font-headline font-bold tracking-tight text-on-surface">
              Interview Session
            </span>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="flex items-center gap-1.5 lg:gap-2 bg-surface-variant/40 px-3 lg:px-4 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary" />
              <span className="font-headline font-bold text-xs lg:text-base tracking-tight text-on-surface">
                Live
              </span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={() => router.push("/settings")}
                className="hidden sm:flex text-on-surface-variant hover:text-on-surface transition-colors duration-200 p-2 hover:bg-surface-bright rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full overflow-hidden border border-outline-variant/30 ml-2">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {user?.firstName?.[0] || "?"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Slide-out Drawer */}
        <div
          className={cn(
            "fixed inset-0 bg-black/60 z-[60] lg:hidden transition-opacity duration-300",
            isMobileDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            className={cn(
              "absolute top-0 left-0 w-72 h-full bg-surface-container-low border-r border-outline-variant/[0.15] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out pb-safe",
              isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-6 flex items-center justify-between border-b border-outline-variant/10 cursor-default pt-safetop">
              <div>
                <h2 className="text-lg font-bold text-on-surface font-headline mb-1">
                  Interview Progress
                </h2>
                <p className="font-body text-sm font-medium text-on-surface-variant">
                  In Progress
                </p>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 bg-surface-container text-on-surface hover:bg-surface-variant rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Nodes */}
            <nav className="flex-1 overflow-y-auto space-y-1 py-4">
              {[]}
            </nav>

            {/* Bottom Actions */}
            <div className="p-6 space-y-4">
              <Button
                variant="secondary"
                size="sm"
                className="w-full uppercase tracking-wider"
                onClick={() => toast("Interview guidelines loaded", "info")}
              >
                View Guidelines
              </Button>
              <div className="border-t border-outline-variant/10 pt-4 space-y-1">
                <div
                  onClick={() => onSupport ? onSupport() : toast("Opening support chat...", "info")}
                  className="flex items-center gap-3 text-on-surface-variant p-2 hover:bg-surface-bright rounded-lg cursor-pointer transition-colors"
                >
                  <Headset className="w-5 h-5" />
                  <span className="text-sm">Support</span>
                </div>
                <div
                  onClick={() => onExit ? onExit() : router.push("/dashboard")}
                  className="flex items-center gap-3 text-on-surface-variant p-2 hover:bg-surface-bright rounded-lg cursor-pointer transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Exit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-surface shadow-[0_0_40px_rgba(25,37,64,0.08)]">
      <Link
        href="/dashboard"
        className="text-2xl font-black tracking-tighter text-on-surface font-headline flex-shrink-0"
      >
        HireSense
      </Link>
      <nav className="hidden md:flex space-x-8 h-full items-center absolute left-1/2 -translate-x-1/2">
        {dashboardLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "font-headline font-bold tracking-tight transition-colors duration-300 active:scale-95",
                isActive
                  ? "text-on-surface border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-on-surface nav-link-glow"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          {/* Notifications removed as per task request */}

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => router.push("/settings")}
              className="text-primary cursor-pointer hover:text-on-surface transition-colors p-1"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <div className="flex gap-2">
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-lg bg-surface-container-highest/50 text-on-surface hover:bg-surface-container-highest transition-colors text-xs font-bold border border-outline-variant/10">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors text-xs font-bold">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
          </Show>
        </div>
      </div>
    </header>
  );
}

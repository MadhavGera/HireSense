"use client";

import { FloatingChatButton } from "./FloatingChatButton";
import { usePathname } from "next/navigation";

/**
 * Client wrapper for FloatingChatButton that lives in the root layout.
 * This ensures the chat persists across all page navigations.
 * Hidden on the interview page to avoid UI clutter.
 */
export function PersistentChat() {
  const pathname = usePathname();

  // Hide chat during active interviews (the interview room has its own UI)
  if (pathname?.startsWith("/interview")) return null;

  return <FloatingChatButton />;
}

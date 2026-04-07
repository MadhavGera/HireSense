import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { PageTransitionProvider } from "@/components/motion/PageTransitionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { PersistentChat } from "@/components/dashboard/PersistentChat";

export const metadata: Metadata = {
  title: "HireSense | AI-Powered Interview Intelligence",
  description:
    "HireSense is an AI-powered interview simulation and analytics platform that helps candidates ace their interviews with real-time feedback and detailed performance analytics.",
};

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    /* ── Brand Colors ─────────────────────────────── */
    colorPrimary: "#85adff",
    colorTextOnPrimaryBackground: "#002c66",
    colorText: "#dee5ff",
    colorTextSecondary: "#a3aac4",
    colorBackground: "#0f1930",
    colorInputBackground: "#141f38",
    colorInputText: "#dee5ff",
    colorDanger: "#ff716c",
    colorSuccess: "#69f6b8",

    /* ── Typography ───────────────────────────────── */
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    fontFamilyButtons: '"Manrope", ui-sans-serif, system-ui, sans-serif',
    fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },

    /* ── Shape ────────────────────────────────────── */
    borderRadius: "1rem",

    /* ── Shadows ──────────────────────────────────── */
    shadowShimmer: "0 0 24px 0 rgba(133, 173, 255, 0.06)",
  },
  elements: {
    /* ── Card / Modal Shell ────────────────────────── */
    card: {
      backgroundColor: "#091328",
      borderColor: "rgba(64, 72, 93, 0.3)",
      borderWidth: "1px",
      borderStyle: "solid",
      boxShadow:
        "0 32px 64px -16px rgba(0,0,0,0.5), 0 0 80px rgba(133,173,255,0.04)",
      backdropFilter: "blur(24px)",
    },
    rootBox: {
      width: "100%",
    },

    /* ── Header ───────────────────────────────────── */
    headerTitle: {
      color: "#dee5ff",
      fontFamily: '"Manrope", sans-serif',
      fontWeight: "800",
      letterSpacing: "-0.02em",
    },
    headerSubtitle: {
      color: "#a3aac4",
    },

    /* ── Form fields ──────────────────────────────── */
    formFieldLabel: {
      color: "#a3aac4",
      fontWeight: "600",
      fontSize: "0.8rem",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
    },
    formFieldInput: {
      backgroundColor: "#141f38",
      borderColor: "rgba(64, 72, 93, 0.4)",
      color: "#dee5ff",
      borderRadius: "0.75rem",
      "&:focus": {
        borderColor: "#85adff",
        boxShadow: "0 0 0 3px rgba(133, 173, 255, 0.15)",
      },
    },

    /* ── Primary Button ───────────────────────────── */
    formButtonPrimary: {
      background: "linear-gradient(135deg, #85adff 0%, #699cff 100%)",
      color: "#002c66",
      fontFamily: '"Manrope", sans-serif',
      fontWeight: "800",
      borderRadius: "0.75rem",
      boxShadow: "0 8px 24px -4px rgba(133, 173, 255, 0.3)",
      transition: "all 0.2s ease",
      "&:hover": {
        background: "linear-gradient(135deg, #699cff 0%, #5391ff 100%)",
        boxShadow: "0 12px 32px -4px rgba(133, 173, 255, 0.4)",
        transform: "translateY(-1px)",
      },
    },

    /* ── Social / OAuth Buttons ────────────────────── */
    socialButtonsBlockButton: {
      backgroundColor: "#141f38",
      borderColor: "rgba(64, 72, 93, 0.3)",
      color: "#dee5ff",
      borderRadius: "0.75rem",
      fontWeight: "600",
      "&:hover": {
        backgroundColor: "#192540",
        borderColor: "rgba(133, 173, 255, 0.2)",
      },
    },
    socialButtonsBlockButtonText: {
      color: "#dee5ff",
      fontWeight: "600",
    },

    /* ── Divider ──────────────────────────────────── */
    dividerLine: {
      borderColor: "rgba(64, 72, 93, 0.3)",
    },
    dividerText: {
      color: "#6d758c",
    },

    /* ── Footer / Links ───────────────────────────── */
    footerActionLink: {
      color: "#85adff",
      fontWeight: "600",
      "&:hover": {
        color: "#699cff",
      },
    },
    footerActionText: {
      color: "#a3aac4",
    },

    /* ── User Button (nav avatar) ─────────────────── */
    userButtonAvatarBox: {
      width: "2rem",
      height: "2rem",
    },
    userButtonPopoverCard: {
      backgroundColor: "#091328",
      borderColor: "rgba(64, 72, 93, 0.3)",
      borderWidth: "1px",
      borderStyle: "solid",
      boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5)",
    },
    userButtonPopoverMain: {
      color: "#dee5ff",
    },
    userButtonPopoverActionButton: {
      color: "#dee5ff",
      "&:hover": {
        backgroundColor: "#141f38",
        color: "#fff",
      },
    },
    userButtonPopoverActionButtonIcon: {
      color: "#a3aac4",
    },
    userButtonPopoverActionButtonText: {
      color: "#dee5ff",
    },
    userButtonPopoverFooter: {
      borderColor: "rgba(64, 72, 93, 0.3)",
    },
    userPreview: {
      color: "#dee5ff",
    },
    userPreviewMainIdentifier: {
      color: "#dee5ff",
      fontWeight: "700",
    },
    userPreviewSecondaryIdentifier: {
      color: "#a3aac4",
    },

    /* ── Internal links ───────────────────────────── */
    identityPreviewEditButton: {
      color: "#85adff",
    },

    /* ── Alert / verification ─────────────────────── */
    alert: {
      backgroundColor: "rgba(133, 173, 255, 0.08)",
      borderColor: "rgba(133, 173, 255, 0.15)",
      color: "#dee5ff",
      borderRadius: "0.75rem",
    },

    /* ── OTP Input ────────────────────────────────── */
    otpCodeFieldInput: {
      backgroundColor: "#141f38",
      borderColor: "rgba(64, 72, 93, 0.4)",
      color: "#dee5ff",
      borderRadius: "0.75rem",
    },

    /* ── Badges ───────────────────────────────────── */
    badge: {
      backgroundColor: "rgba(133, 173, 255, 0.1)",
      color: "#85adff",
      borderRadius: "9999px",
    },

    /* ── Modal Backdrop ───────────────────────────── */
    modalBackdrop: {
      backgroundColor: "rgba(6, 14, 32, 0.8)",
      backdropFilter: "blur(8px)",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary-container">
        <ClerkProvider appearance={clerkAppearance}>
          <ToastProvider>
            <PageTransitionProvider>{children}</PageTransitionProvider>
            <PersistentChat />
          </ToastProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}


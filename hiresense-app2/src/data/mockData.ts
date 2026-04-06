// ─── Dashboard Mock Data ────────────────────────────────────────────────────

export const dashboardData = {
  candidateName: "Alex",
  fullName: "Alex Rivera",
  role: "Sr. Architect Role",
  hireabilityScore: 8.5,
  percentile: "top 4%",

  metrics: [
    {
      label: "Technical Depth",
      score: 9.0,
      icon: "Terminal" as const,
      barHeights: [2, 4, 3, 6, 7],
      barOpacities: [20, 40, 60, 80, 100],
    },
    {
      label: "Communication",
      score: 7.2,
      icon: "AudioLines" as const,
      barHeights: [4, 5, 2, 3, 4],
      barOpacities: [20, 40, 60, 80, 40],
    },
    {
      label: "Confidence",
      score: 8.4,
      icon: "Zap" as const,
      barHeights: [2, 3, 6, 5, 8],
      barOpacities: [20, 40, 60, 80, 100],
    },
  ],

  skillBreakdown: [
    { subject: "Architecture", score: 85, fullMark: 100 },
    { subject: "DSA", score: 72, fullMark: 100 },
    { subject: "React", score: 90, fullMark: 100 },
    { subject: "Soft Skills", score: 68, fullMark: 100 },
    { subject: "Security", score: 60, fullMark: 100 },
  ],

  questionBreakdown: {
    currentQuestion: 3,
    totalQuestions: 12,
    questionText: "Explain the Virtual DOM and why React uses it.",
    transcript:
      '"So, <filler>um</filler>, the Virtual DOM is like a copy of the actual DOM. React uses it to, <filler>uh</filler>, optimize rendering. It basically looks for differences between the old and new version, and <filler>um</filler>, only updates what\'s necessary."',
    strengths:
      "Accurately identified the reconciliation process and performance optimization as key benefits.",
    improvements:
      "Could expand on the 'diffing algorithm' and mention the Fibers architecture for extra depth.",
  },

  aiPitch:
    '"The Virtual DOM is an in-memory representation of the Real DOM. React uses it to perform efficient UI updates through a process called Reconciliation. By minimizing direct manipulation of the browser DOM—which is computationally expensive—React ensures 60fps performance even in complex, data-heavy applications using its efficient diffing algorithm."',

  nextSteps: [
    {
      icon: "GraduationCap" as const,
      title: "Refresh System Design Patterns",
      description:
        "Review Micro-frontends and Event-driven architecture for the next round.",
    },
    {
      icon: "Mic" as const,
      title: "Reduce Filler Words",
      description:
        'You used "um" 14 times. Try pausing for 2 seconds when thinking.',
    },
    {
      icon: "Users" as const,
      title: "Prepare Leadership Stories",
      description:
        "Focus on conflict resolution examples for the upcoming culture fit panel.",
    },
  ],

  sidebarNavItems: [
    { label: "Overview", icon: "LayoutDashboard" as const, active: false },
    { label: "Performance", icon: "BarChart3" as const, active: true },
    { label: "Skill Gap", icon: "Brain" as const, active: false },
    { label: "Culture Fit", icon: "Users" as const, active: false },
    { label: "Final Verdict", icon: "BadgeCheck" as const, active: false },
  ],
};

// ─── Interview Mock Data ────────────────────────────────────────────────────

export const interviewData = {
  sessionTitle: "Frontend Engineering - Medium",
  timer: "00:15:00",
  completionPercent: 20,

  progress: [
    { label: "Introduction", status: "completed" as const },
    { label: "Technical Core", status: "active" as const },
    { label: "Problem Solving", status: "pending" as const },
    { label: "System Design", status: "pending" as const },
    { label: "Closing", status: "pending" as const },
  ],

  currentTopic: "React Fundamentals",
  question:
    "How would you explain the difference between a virtual DOM and the real DOM in React?",
  highlightedWords: ["virtual DOM", "real DOM"],

  aiAnalysis: {
    listening: {
      status: "Listening...",
      description:
        "Detecting vocal patterns. Please speak clearly for the most accurate transcription.",
    },
    speechPace: {
      label: "Speech Pace",
      status: "Optimal",
      progress: 70,
      description:
        "Your pace is steady. Maintain this rhythm for better clarity.",
    },
    contentRelevance: {
      label: "Content Relevance",
      tags: ["React", "DOM"],
    },
  },

  aiCoachTip:
    '"Take a deep breath. Focus on explaining the \'Reconciliation\' process if you get stuck."',

  profileImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBELPz57PETebue0LgQG8goE1damEGH5czCBdy7yYgdj7wiry-H0_nnBdSY3rqXspMiaCTCMywE2o0wvCjlikNTnZ6bCU0zswuvdm-eLfUfCbab9BIZJZkmpx3xUQCEeFbQi5bccy8lbVcB_pfE0kGVEZ8oG3o6CUT7tujveWn6MHbbeouv5rE3tTFb02NJ8H51JEfjr06sBFTdn4jK0uuu1qpYvi4IWulXHHYQwv54TwZY_0L69NyChDkY6ScpZcUb09zpDasZg1E",
};

// ─── Shared ────────────────────────────────────────────────────────────────

export const profileImages = {
  recruiter:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAIE_tSuwCPhCCFmDB9DooawrsZFg1rNzlVfyzU8fXTQm6dmA8zuOY-hKyB91giyHdoALR0xelV0ucxZsHaI9VaX0RA_-VecAEBRf_DXx3DXpSMuRFuATu3Jxu70XNBN_oqtXxCjsqSr-iRlkOEB13OyZ3699cGuGf75hQF89cH4WrEvaybkA4wEdTFRydfYaCupP1TvfB9M3D1N4B2fHhQUudJZLyzWFI60FhDXXEZM0VoUyroJUAUZsk9hMfRr9otWuXtCDRvwGc",
  session:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDPjy0FbmqvLkYwjumaf0SoxvHeJ3OtIyXlYo3CBlImMYfC5mtMKsfmdUl9n1TgiCRTbMYSLGwEfUMkDH3IEQNjevvbtLZaeVpORE0N6IYQafbgO1Y8tNwFns9gT3J74LZt5hWfxl6hUyEAlc4bM8nHLrhBuCU3CEw1PGTlFuQ67IWHM3_gH755Nt8umBxVcesO_9-dzuQa90-6n4iAk2MRDE3vmJkPnofpSjajSCfeQW7ZEzi4TVVxtxQkcrmX1XCAnE3wko6a6rE",
};

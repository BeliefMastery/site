/** Home page hero and bridge copy — plain, approachable tone. */

export const homeHero = {
  thesis: "Freedom is achievable.",
  subtitleWorks: "Belief Mastery, Sovereign of Mind, and Peer-Counseling",
  subtitlePivot: "all point toward the same thing:",
  subtitlePromise: "Seeing the patterns behind your life so you can choose what comes next.",
};

/** One slide = situation copy + single primary CTA (home engagement carousel). */
export const homeBridge = {
  engageSlides: [
    {
      id: "old-habits",
      headline: "Old habits",
      body: "Notice what keeps them in place—without piling on shame.",
      cta: { label: "Start a free life review", to: "/engines/coaching", variant: "primary" },
    },
    {
      id: "pressure",
      headline: "Pressure from others",
      body: "Stay grounded when narratives, urgency, or influence run high.",
      cta: { label: "Try the meaning map", to: "/engines/paradigm", variant: "outline" },
    },
    {
      id: "scattered",
      headline: "Feeling scattered",
      body: "Find steadier ground and fewer leaks in your attention.",
      cta: { label: "Spot symptom patterns", to: "/engines/diagnosis", variant: "soft" },
    },
    {
      id: "honest-work",
      headline: "Ready for honest work",
      body: "Books, tools, or sessions—pick the door that fits you today.",
      cta: { label: "Trace dependency loops", to: "/engines/needs-dependency", variant: "ghost" },
    },
    {
      id: "browse-tools",
      headline: "Want a clear path through the tools?",
      body: "Every online engine is listed in one place—jump in where your attention lands.",
      cta: { label: "Browse all tools", to: "/tools", variant: "outline" },
    },
    {
      id: "explore-books",
      headline: "Prefer to read on your own time?",
      body: "The books and frameworks sit alongside the tools—not instead of them.",
      cta: { label: "Explore books", to: "/books", variant: "soft" },
    },
  ],
};

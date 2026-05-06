/** Mirrors tools.html grouping and copy; images live under /site/images/ */

export const SITE_IMAGES = "/site/images";

export const toolMeta = {
  diagnosis: {
    thumb: "DSM5-cover.jpg",
    description: "A structured checklist based on DSM-5—helps you see your recent symptoms in one place.",
    cta: "Begin",
  },
  coaching: {
    thumb: "coaching-agent-cover.jpg",
    description: "Walk through life areas and obstacles—like a calm audit of where you are right now.",
    cta: "Review",
  },
  "needs-dependency": {
    thumb: "dependency-loop-cover.jpg",
    description: "Trace needs and loops—see where relief might actually start.",
    cta: "Trace",
  },
  "sovereignty-spectrum": {
    thumb: "sovereignty-spectrum-cover.jpg",
    description: "See which way of holding sovereignty fits you best.",
    cta: "Clarify",
  },
  paradigm: {
    thumb: "paradigm-clarification-cover.jpg",
    description: "How you hold meaning and proof across life—mapped in one place.",
    cta: "Map",
  },
  manipulation: {
    thumb: "manipulation-analysis-cover.jpg",
    description: "Notice influence patterns and how they land on you.",
    cta: "Decode",
  },
  sovereignty: {
    thumb: "vulnerability-vector-cover.jpg",
    description: "Check habits around attention, attachment, and mental hygiene.",
    cta: "Assess",
  },
  channels: {
    thumb: "channel-analysis-cover.jpg",
    description: "A gentle map of inner “channels” and where flow feels tight.",
    cta: "Scan",
  },
  "character-sheet": {
    thumb: "astrology-cover.jpg",
    description: "Build a structured temperament sheet from your chart inputs.",
    cta: "Generate",
  },
  entities: {
    thumb: "entities-cover.jpg",
    description: "Structured prompts for persistent inner tension or “will” edges.",
    cta: "Explore",
  },
  "outlier-aptitude": {
    thumb: "aptitude-cover.jpg",
    description: "Orientation from aptitude signals—not hiring or licensing advice.",
    cta: "Map",
  },
};

export const toolCategories = [
  {
    id: "psychological",
    eyebrow: "Category",
    title: "Psychological",
    lede: "Patterns, life areas, and needs—where inner life meets daily choices.",
    toolIds: ["diagnosis", "coaching", "needs-dependency"],
  },
  {
    id: "philosophical",
    eyebrow: "Category",
    title: "Philosophical",
    lede: "How you see truth, meaning, and your own sovereignty.",
    toolIds: ["sovereignty-spectrum", "paradigm"],
  },
  {
    id: "defensive",
    eyebrow: "Category",
    title: "Defensive",
    lede: "Influence and steadiness—see pressure without losing yourself.",
    toolIds: ["manipulation", "sovereignty"],
  },
  {
    id: "esoteric",
    eyebrow: "Category",
    title: "Esoteric / integrative",
    lede: "Deeper maps—channels, chart-based reflection, and will-focused inquiry.",
    toolIds: ["channels", "character-sheet", "entities"],
  },
  {
    id: "tech",
    eyebrow: "Category",
    title: "Applied orientation",
    lede: "Side tools for direction and fit—alongside the core psychological set.",
    toolIds: ["outlier-aptitude"],
  },
];

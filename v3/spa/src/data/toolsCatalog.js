/** Mirrors tools.html grouping and copy; images live under /site/images/ */

export const SITE_IMAGES = "/site/images";

export const toolMeta = {
  diagnosis: {
    thumb: "DSM5-cover.jpg",
    description: "Structured DSM-5 checklist that scores recent symptoms and clarifies your current state.",
    cta: "Begin",
  },
  coaching: {
    thumb: "coaching-agent-cover.jpg",
    description: "Domain-by-domain review that highlights friction points and high-leverage areas for action.",
    cta: "Review",
  },
  "needs-dependency": {
    thumb: "dependency-loop-cover.jpg",
    description: "Maps behavioral loops to underlying needs and shows where relief begins.",
    cta: "Trace",
  },
  "sovereignty-spectrum": {
    thumb: "sovereignty-spectrum-cover.jpg",
    description: "See which worldview best matches your values and decisions.",
    cta: "Clarify",
  },
  paradigm: {
    thumb: "paradigm-clarification-cover.jpg",
    description: "Clarifies how you structure meaning, evidence, and commitment across domains.",
    cta: "Map",
  },
  manipulation: {
    thumb: "manipulation-analysis-cover.jpg",
    description: "Surfaces recurring influence patterns and how they land in your choices.",
    cta: "Decode",
  },
  sovereignty: {
    thumb: "vulnerability-vector-cover.jpg",
    description: "Evaluates resistance patterns in attention, attachment, and cognitive hygiene.",
    cta: "Assess",
  },
  channels: {
    thumb: "channel-analysis-cover.jpg",
    description: "Maps internal channel flow and where dialogue between centers may be strained.",
    cta: "Scan",
  },
  "character-sheet": {
    thumb: "astrology-cover.jpg",
    description: "Generates a structured temperament sheet from your chart inputs.",
    cta: "Generate",
  },
  entities: {
    thumb: "entities-cover.jpg",
    description: "Structured inquiry into persistent will anomalies and integration edges.",
    cta: "Explore",
  },
  "outlier-aptitude": {
    thumb: "aptitude-cover.jpg",
    description: "Career-orientation mapping from aptitude signals (not licensing or hiring advice).",
    cta: "Map",
  },
};

export const toolCategories = [
  {
    id: "psychological",
    eyebrow: "Category",
    title: "Psychological",
    lede: "Patterns, domains, and dependency—where inner rules meet outer behavior.",
    toolIds: ["diagnosis", "coaching", "needs-dependency"],
  },
  {
    id: "philosophical",
    eyebrow: "Category",
    title: "Philosophical",
    lede: "Paradigm and meaning structure—how you organize truth and sovereignty.",
    toolIds: ["sovereignty-spectrum", "paradigm"],
  },
  {
    id: "defensive",
    eyebrow: "Category",
    title: "Defensive",
    lede: "Resistance and influence—seeing vectors clearly without surrendering agency.",
    toolIds: ["manipulation", "sovereignty"],
  },
  {
    id: "esoteric",
    eyebrow: "Category",
    title: "Esoteric / integrative",
    lede: "Channels, character architecture, and will-focused inquiry.",
    toolIds: ["channels", "character-sheet", "entities"],
  },
  {
    id: "tech",
    eyebrow: "Category",
    title: "Applied orientation",
    lede: "Orientation tools that sit adjacent to the core psychological engines.",
    toolIds: ["outlier-aptitude"],
  },
];

/** Copy and grouping mirror v3/tools.html; images under /site/images/ */

export const SITE_IMAGES = "/site/images";

/** Stable ids for in-page anchors (matches tools.html list item ids) */
export const toolkitListItemIds = {
  diagnosis: "tool-pathology",
  coaching: "tool-life-domain",
  "needs-dependency": "tool-dependency-loop",
  "sovereignty-spectrum": "tool-sovereignty-paradigm",
  paradigm: "tool-logos",
  manipulation: "tool-manipulation",
  sovereignty: "tool-resistance-capacity",
  channels: "tool-channels",
  "character-sheet": "tool-character-sheet",
  entities: "tool-entities",
  "outlier-aptitude": "tool-aptitude",
  "unlocked-gpt": "tool-unlocked-gpt",
};

export const toolMeta = {
  diagnosis: {
    thumb: "DSM5-cover.jpg",
    description: "Structured DSM-5 checklist that scores recent symptoms and clarifies your current state.",
    cta: "Begin",
    suiteGate: null,
  },
  coaching: {
    thumb: "coaching-agent-cover.jpg",
    description: "Domain-by-domain review that highlights friction points and high-leverage areas for action.",
    cta: "Review",
    suiteGate: null,
  },
  "needs-dependency": {
    thumb: "dependency-loop-cover.jpg",
    description: "Maps behavioral loops to underlying needs and shows where relief begins.",
    cta: "Trace",
    suiteGate: null,
  },
  "sovereignty-spectrum": {
    thumb: "sovereignty-spectrum-cover.jpg",
    description: "See which worldview best matches your values and decisions.",
    cta: "Clarify",
    suiteGate: null,
  },
  paradigm: {
    thumb: "paradigm-clarification-cover.jpg",
    description: "Truth-dimension scoring that reveals the structure of your thinking.",
    cta: "Map",
    suiteGate: null,
  },
  manipulation: {
    thumb: "manipulation-analysis-cover.jpg",
    description: "Spot manipulation tactics and see how they affect you.",
    cta: "Decode",
    suiteGate: null,
  },
  sovereignty: {
    thumb: "vulnerability-vector-cover.jpg",
    description: "Measure your reliance on AI and strengthen independence.",
    cta: "Assess",
    suiteGate: null,
  },
  channels: {
    thumb: "channel-analysis-cover.jpg",
    description: "Scan your energy system to locate blocks and restore flow.",
    cta: "Diagnose",
    suiteGate: null,
  },
  "character-sheet": {
    thumb: "astrology-cover.jpg",
    description: "Multi-calendar astrology profile that turns your chart into a game-style sheet.",
    cta: "Create",
    suiteGate: null,
  },
  entities: {
    thumb: "entities-cover.jpg",
    description: "Combine prior results to pinpoint inner conflicts and restore coherence.",
    cta: "Map",
    suiteGate: 2,
  },
  "outlier-aptitude": {
    thumb: "aptitude-cover.jpg",
    description: "Capability scan that highlights high-leverage talents for work and income.",
    cta: "Map",
    suiteGate: 3,
  },
  "unlocked-gpt": {
    thumb: "simulacra.jpg",
    description: "Sovereignty-aligned GPT—direct access for straight answers and course correction.",
    cta: "Open",
    suiteGate: null,
    externalHref: "https://chatgpt.com/g/g-684212ba47e081918d000ec3f9cf8f69-simulacrum-exorcist-edition",
  },
};

export const toolCategories = [
  {
    id: "psych",
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
    title: "Defensive / protective",
    lede: "Pressure, capture, and resistance—staying the author of your cognition.",
    toolIds: ["manipulation", "sovereignty"],
  },
  {
    id: "esoteric",
    eyebrow: "Category",
    title: "Esoteric",
    lede: "Channels, symbols, and will anomalies—structured inquiry beyond the literal only.",
    toolIds: ["channels", "character-sheet", "entities"],
  },
  {
    id: "tech",
    eyebrow: "Category",
    title: "Technological / AI",
    lede: "Capability and external agents—leverage without surrendering judgment.",
    toolIds: ["outlier-aptitude", "unlocked-gpt"],
  },
];

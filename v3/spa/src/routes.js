export const navItems = [
  { label: "Home", to: "/" },
  { label: "Tools", to: "/tools" },
  { label: "Books", to: "/books" },
  { label: "About", to: "/about" },
];

/** Published static engines under the parallel /site/v3/ tree */
const legacyV3 = (file) => `/site/v3/${file}`;

export const engineRoutes = [
  {
    id: "diagnosis",
    path: "/engines/diagnosis",
    label: "Pathology Assessment",
    legacyPage: legacyV3("diagnosis.html"),
  },
  {
    id: "coaching",
    path: "/engines/coaching",
    label: "Life Domain Review",
    legacyPage: legacyV3("coaching.html"),
  },
  {
    id: "needs-dependency",
    path: "/engines/needs-dependency",
    label: "Dependency Loop Tracer",
    legacyPage: legacyV3("needs-dependency.html"),
  },
  {
    id: "sovereignty-spectrum",
    path: "/engines/sovereignty-spectrum",
    label: "Your Sovereignty Paradigm",
    legacyPage: legacyV3("sovereignty-spectrum.html"),
  },
  {
    id: "paradigm",
    path: "/engines/paradigm",
    label: "Logos Structure",
    legacyPage: legacyV3("paradigm.html"),
  },
  {
    id: "manipulation",
    path: "/engines/manipulation",
    label: "Manipulation Defense Decoder",
    legacyPage: legacyV3("manipulation.html"),
  },
  {
    id: "sovereignty",
    path: "/engines/sovereignty",
    label: "Cognitive Resistance Capacity",
    legacyPage: legacyV3("sovereignty.html"),
  },
  {
    id: "channels",
    path: "/engines/channels",
    label: "Channel Flow Diagnostics",
    legacyPage: legacyV3("channels.html"),
  },
  {
    id: "character-sheet",
    path: "/engines/character-sheet",
    label: "Character Sheet Generator",
    legacyPage: legacyV3("character-sheet.html"),
  },
  {
    id: "entities",
    path: "/engines/entities",
    label: "Will Anomaly Mapping",
    legacyPage: legacyV3("entities.html"),
  },
  {
    id: "outlier-aptitude",
    path: "/engines/outlier-aptitude",
    label: "Aptitude Mapping",
    legacyPage: legacyV3("outlier-aptitude.html"),
  },
];

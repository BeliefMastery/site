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
    label: "Symptom checklist",
    legacyPage: legacyV3("diagnosis.html"),
  },
  {
    id: "coaching",
    path: "/engines/coaching",
    label: "Life areas review",
    legacyPage: legacyV3("coaching.html"),
  },
  {
    id: "needs-dependency",
    path: "/engines/needs-dependency",
    label: "Dependency loops",
    legacyPage: legacyV3("needs-dependency.html"),
  },
  {
    id: "sovereignty-spectrum",
    path: "/engines/sovereignty-spectrum",
    label: "Your sovereignty lens",
    legacyPage: legacyV3("sovereignty-spectrum.html"),
  },
  {
    id: "paradigm",
    path: "/engines/paradigm",
    label: "Meaning map",
    legacyPage: legacyV3("paradigm.html"),
  },
  {
    id: "manipulation",
    path: "/engines/manipulation",
    label: "Influence patterns",
    legacyPage: legacyV3("manipulation.html"),
  },
  {
    id: "sovereignty",
    path: "/engines/sovereignty",
    label: "Mental steadiness",
    legacyPage: legacyV3("sovereignty.html"),
  },
  {
    id: "channels",
    path: "/engines/channels",
    label: "Inner channel flow",
    legacyPage: legacyV3("channels.html"),
  },
  {
    id: "character-sheet",
    path: "/engines/character-sheet",
    label: "Character sheet",
    legacyPage: legacyV3("character-sheet.html"),
  },
  {
    id: "entities",
    path: "/engines/entities",
    label: "Will and edges",
    legacyPage: legacyV3("entities.html"),
  },
  {
    id: "outlier-aptitude",
    path: "/engines/outlier-aptitude",
    label: "Aptitude map",
    legacyPage: legacyV3("outlier-aptitude.html"),
  },
];

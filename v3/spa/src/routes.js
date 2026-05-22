export const navItems = [
  { label: "Home", to: "/" },
  { label: "Tools", to: "/tools" },
  { label: "Books", to: "/books" },
  { label: "About", to: "/about" },
];

/** Published static engines (archived HTML; iframe embed). */
const legacyV3 = (file) => `/site/archive/v3-engines/${file}`;

import DiagnosisEngineView from "@/engines/diagnosis/DiagnosisEngineView";
import CoachingEngineView from "@/engines/coaching/CoachingEngineView";
import NeedsDependencyEngineView from "@/engines/needs-dependency/NeedsDependencyEngineView";
import SovereigntySpectrumEngineView from "@/engines/sovereignty-spectrum/SovereigntySpectrumEngineView";
import ParadigmEngineView from "@/engines/paradigm/ParadigmEngineView";
import ManipulationEngineView from "@/engines/manipulation/ManipulationEngineView";
import SovereigntyEngineView from "@/engines/sovereignty/SovereigntyEngineView";
import ChannelsEngineView from "@/engines/channels/ChannelsEngineView";
import CharacterSheetEngineView from "@/engines/character-sheet/CharacterSheetEngineView";
import EntitiesEngineView from "@/engines/entities/EntitiesEngineView";
import OutlierAptitudeEngineView from "@/engines/outlier-aptitude/OutlierAptitudeEngineView";

/** Native React assessment hosts (no iframe). */
export const nativeEngineViews = {
  diagnosis: DiagnosisEngineView,
  coaching: CoachingEngineView,
  "needs-dependency": NeedsDependencyEngineView,
  "sovereignty-spectrum": SovereigntySpectrumEngineView,
  paradigm: ParadigmEngineView,
  manipulation: ManipulationEngineView,
  sovereignty: SovereigntyEngineView,
  channels: ChannelsEngineView,
  "character-sheet": CharacterSheetEngineView,
  entities: EntitiesEngineView,
  "outlier-aptitude": OutlierAptitudeEngineView,
};

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
    label: "Astrological Character Sheet",
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

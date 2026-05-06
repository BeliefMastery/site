import { engineRoutes } from "@/routes";
import { toolMeta } from "@/data/toolsCatalog";

/** Production origin for absolute meta URLs (GitHub Pages). */
export const SITE_ORIGIN = "https://beliefmastery.github.io";

/** Vite `base` for the SPA; hash routes follow `#/…`. */
export const V3_APP_BASE = `${SITE_ORIGIN}/site/v3/app`;

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/site/images/BM-cover.jpg`;

const SITE_NAME = "Belief Mastery";

const DEFAULT_META = {
  title: `${SITE_NAME} — V3`,
  description:
    "Cognitive sovereignty as learnable structure: books, reflection tools, and a free cognitive audit entry—capacity, coherence, and structural clarity in one suite.",
};

const STATIC_ROUTE_META = {
  "/": {
    title: `${SITE_NAME} — V3`,
    description:
      "Cognitive sovereignty is learnable structure. Explore internal capacity framing, a free cognitive audit, books, and online sovereignty tools in Belief Mastery V3.",
  },
  "/tools": {
    title: `Online tools | ${SITE_NAME} — V3`,
    description:
      "Run the Belief Mastery diagnostic and reflection tools in the V3 suite—pattern tracing, resistance mapping, and structured self-inquiry.",
  },
  "/books": {
    title: `Books | ${SITE_NAME} — V3`,
    description:
      "Belief Mastery, Sovereign of Mind, the Sovereignty-Distortion Codex, and companion works—frameworks for rewriting hidden rules and defending authorship.",
  },
  "/about": {
    title: `About the author | ${SITE_NAME} — V3`,
    description:
      "Warwick Marshall—systems architect and author—structural diagnostics, internal capacity, and coherence across technical, behavioral, and organizational domains.",
  },
};

/**
 * @param {string} pathname - React Router pathname (HashRouter: `/`, `/tools`, …)
 * @returns {{ title: string, description: string, canonical: string, ogImage: string }}
 */
export function resolvePageMeta(pathname) {
  const path = pathname && pathname.startsWith("/") ? pathname : "/";

  if (path.startsWith("/engines/")) {
    const engineId = path.replace(/^\/engines\//, "").split("/")[0] || "";
    const route = engineRoutes.find((r) => r.id === engineId);
    const tm = toolMeta[engineId];
    const label = route?.label || "Tool";
    const ogImage = tm?.thumb ? `${SITE_ORIGIN}/site/images/${tm.thumb}` : DEFAULT_OG_IMAGE;
    return {
      title: `${label} | ${SITE_NAME} — V3`,
      description: `Run ${label} in the Belief Mastery V3 suite—structured self-inquiry with the same persistence model as the standalone tool where applicable.`,
      canonical: `${V3_APP_BASE}/#${path}`,
      ogImage,
    };
  }

  const staticEntry = STATIC_ROUTE_META[path];
  if (staticEntry) {
    return {
      title: staticEntry.title,
      description: staticEntry.description,
      canonical: `${V3_APP_BASE}/#${path === "/" ? "/" : path}`,
      ogImage: DEFAULT_OG_IMAGE,
    };
  }

  return {
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    canonical: `${V3_APP_BASE}/#${path === "/" ? "/" : path}`,
    ogImage: DEFAULT_OG_IMAGE,
  };
}

export { SITE_NAME };

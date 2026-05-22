import { engineRoutes } from "@/routes";
import { toolMeta } from "@/data/toolsCatalog";

/** Production origin for absolute meta URLs (GitHub Pages). */
export const SITE_ORIGIN = "https://beliefmastery.github.io";

/** Vite `base` for the SPA; hash routes follow `#/…`. */
export const V3_APP_BASE = `${SITE_ORIGIN}/site`;

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/site/images/BM-cover.jpg`;

const SITE_NAME = "Belief Mastery";

const DEFAULT_META = {
  title: SITE_NAME,
  description:
    "Freedom is achievable. Books, online tools, and gentle structure for Belief Mastery, Sovereign of Mind, and peer counseling—in one place.",
};

const STATIC_ROUTE_META = {
  "/": {
    title: SITE_NAME,
    description:
      "Freedom is achievable. Explore books, free tools, and a simple life review to get oriented—Belief Mastery.",
  },
  "/tools": {
    title: `Online tools | ${SITE_NAME}`,
    description:
      "Comprehensive sovereignty tools: cognitive resistance capacity assessment, manipulation vector identification, channel flow diagnostics, logos structure, pathology assessment, life domain review, dependency loop tracing, and more. Diagnostic clarity for the cognitively vigilant. Warwick Marshall, Golden Bay, New Zealand.",
  },
  "/books": {
    title: `Books | ${SITE_NAME}`,
    description:
      "Belief Mastery, Sovereign of Mind, the Codex, and more—practical language for real change.",
  },
  "/about": {
    title: `About the author | ${SITE_NAME}`,
    description:
      "Warwick Marshall—author and practitioner—books, tools, and sessions for people ready to look honestly at their patterns.",
  },
  "/testimonials": {
    title: `Testimonials | ${SITE_NAME}`,
    description:
      "Client reflections on Belief Mastery, coaching, and men's group work—in their own words.",
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
      title: `${label} | ${SITE_NAME}`,
      description: `Run ${label} here—your progress is saved the same way as on the full tool page.`,
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

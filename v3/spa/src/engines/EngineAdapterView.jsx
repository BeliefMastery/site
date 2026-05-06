import { useEffect, useMemo, useState } from "react";
import { loadTheme, toLegacySiteTheme } from "@/lib/themeStore";

function embedUrl(legacyPage, v3Theme) {
  const legacyTheme = toLegacySiteTheme(v3Theme);
  try {
    const u = new URL(legacyPage, window.location.origin);
    u.searchParams.set("bm_embed", "1");
    u.searchParams.set("theme", legacyTheme);
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    const sep = legacyPage.includes("?") ? "&" : "?";
    return `${legacyPage}${sep}bm_embed=1&theme=${encodeURIComponent(legacyTheme)}`;
  }
}

export default function EngineAdapterView({ label, legacyPage }) {
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    function onThemeChange(e) {
      setTheme(e?.detail?.theme || loadTheme());
    }
    window.addEventListener("bm-v3-theme-change", onThemeChange);
    return () => window.removeEventListener("bm-v3-theme-change", onThemeChange);
  }, []);

  const iframeSrc = useMemo(() => embedUrl(legacyPage, theme), [legacyPage, theme]);

  const standaloneHref = useMemo(() => {
    try {
      const u = new URL(legacyPage, window.location.origin);
      u.search = "";
      return `${u.pathname}${u.hash}`;
    } catch {
      return legacyPage.split("?")[0];
    }
  }, [legacyPage]);

  return (
    <section className="stack v3-engine-route">
      <article className="surface v3-engine-route__intro">
        <p className="kicker">Assessment</p>
        <h1 className="v3-hero-title">{label}</h1>
        <p className="v3-muted">
          The full engine runs below inside the V3 shell. Progress, scoring, exports, and storage are unchanged (same browser storage keys as the standalone tool page).
        </p>
        <p>
          <a className="v3-btn v3-btn--ghost" href={standaloneHref} target="_blank" rel="noreferrer">
            Open standalone page
          </a>
        </p>
      </article>
      <div className="v3-engine-shell">
        <iframe className="v3-engine-frame" title={label} src={iframeSrc} loading="lazy" key={`${label}-${theme}`} />
      </div>
    </section>
  );
}

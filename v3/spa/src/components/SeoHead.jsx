import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_OG_IMAGE, resolvePageMeta, SITE_NAME } from "@/data/siteMeta";

function upsertMetaByName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLinkRel(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Updates document title and common meta tags on client navigation.
 * Static defaults remain in index.html for non-JS crawlers.
 */
export default function SeoHead() {
  const location = useLocation();

  useEffect(() => {
    const { title, description, canonical, ogImage } = resolvePageMeta(location.pathname);

    document.title = title;

    upsertMetaByName("description", description);

    upsertLinkRel("canonical", canonical);

    upsertMetaByProperty("og:type", "website");
    upsertMetaByProperty("og:site_name", SITE_NAME);
    upsertMetaByProperty("og:title", title);
    upsertMetaByProperty("og:description", description);
    upsertMetaByProperty("og:url", canonical);
    upsertMetaByProperty("og:image", ogImage || DEFAULT_OG_IMAGE);

    upsertMetaByName("twitter:card", "summary_large_image");
    upsertMetaByName("twitter:title", title);
    upsertMetaByName("twitter:description", description);
    upsertMetaByName("twitter:image", ogImage || DEFAULT_OG_IMAGE);
  }, [location.pathname]);

  return null;
}

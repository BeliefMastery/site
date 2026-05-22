/**
 * Extract testimonials from Word-exported HTML in testimonials/.
 * Run: node scripts/extract-testimonials.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(repoRoot, "v3/spa/src/data/testimonials.js");

const EXCERPT_OVERRIDES = {
  "titus-willke-2025":
    "Belief Mastery changed how I operate on a daily basis—it changed my life.",
  "nathan-douglas-2025":
    "He's not stuck in a box like most professionals—he's got range, and he's not scared to go deep.",
  "titus-willke-mens-group-2025":
    "The culture of willingness to grow set it apart from any other group work I had done.",
  "minnie-bobyk-2022":
    "Belief Mastery has been the innermost profound life's work I have ever experienced to date.",
  "kristin-nelson-2022":
    "Our whole family unit feels more bonded and harmonious.",
  "aurora-august-2022":
    "What felt like a lifetime of searching turned out to be four phone conversations that radically transformed my life.",
  "shannon-moulds-2022":
    "You've empowered me by giving me the tools to navigate my own inner workings.",
  "greta-french-kennedy-2022":
    "It is truly life changing work. You will never be the same!",
  "jess-stephenson-2022":
    "Clearing my beliefs has been one of the best decisions I've ever made.",
};

/** @param {string} file */
function readHtml(file) {
  return fs.readFileSync(file, "latin1");
}

/** @param {string} text */
function normalizeText(text) {
  return text
    .replace(/\u0092|\u2019/g, "'")
    .replace(/\u0093|\u201c/g, "\u201c")
    .replace(/\u0094|\u201d/g, "\u201d")
    .replace(/\u0096|\u2013/g, "–")
    .replace(/\u0097|\u2014/g, "—")
    .replace(/\u2026/g, "...")
    .replace(/\u00a0/g, " ")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** @param {string} html */
function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
}

/** @param {string} html */
function stripParagraphHtml(html) {
  const raw = decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "")
      .replace(/<[^>]+>/g, ""),
  );
  return normalizeText(raw);
}

/** @param {string} html */
function extractParagraphs(html) {
  const paras = [];
  const re = /<p\s+class=Mso(?:Normal|BodyText)[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = stripParagraphHtml(m[1]);
    if (text) paras.push(text);
  }
  return paras;
}

/** @param {string} name */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** @param {string} name */
function toByShort(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name;
  if (parts.length === 1) return `${parts[0][0]}.`;
  return `${parts[0][0]}. ${parts[parts.length - 1][0]}.`;
}

/** @param {string[]} paragraphs */
function bodyText(paragraphs) {
  return paragraphs.join(" ").replace(/\s+/g, " ").trim();
}

/** @param {string} text */
function normalizeForHash(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** @param {string} text @param {number} max */
function firstSentenceExcerpt(text, max = 155) {
  const flat = text.replace(/\s+/g, " ").trim();
  const match = flat.match(/^[^.!?]+[.!?]?/);
  let sentence = (match ? match[0] : flat).trim();
  if (sentence.length > max) {
    const cut = sentence.slice(0, max);
    const sp = cut.lastIndexOf(" ");
    sentence = `${(sp > 60 ? cut.slice(0, sp) : cut).trim()}…`;
  }
  return sentence;
}

const NOT_SURNAMES = new Set([
  "Mastery",
  "Clearing",
  "Every",
  "Working",
  "The",
  "I've",
  "My",
  "Woow",
  "Thanks",
  "Since",
  "Approximately",
  "If",
  "In",
  "It",
  "Warwick",
  "Your",
  "There",
  "Amazing",
  "Done",
  "Got",
]);

/** @param {string} name */
function isLikelyPersonName(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2 || parts.length > 3) return false;
  const last = parts[parts.length - 1].replace(/[^a-z'-]/gi, "");
  if (NOT_SURNAMES.has(last)) return false;
  return parts.every((p) => /^[A-Z][a-z'-]+$/.test(p));
}

/** @param {string} line */
function parseNameOnly(line) {
  const m = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z'-]+){1,2})$/);
  if (!m) return null;
  const name = m[1].trim();
  return isLikelyPersonName(name) ? name : null;
}

/** @param {string} line */
function parseNameLead(line) {
  const m3 = line.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+-[A-Z][a-z]+)\s+(.+)$/);
  if (m3) {
    const name = `${m3[1]} ${m3[2]}`;
    if (isLikelyPersonName(name)) return { name, rest: normalizeText(m3[3]) };
  }
  const m2 = line.match(/^([A-Z][a-z]+)\s+([A-Z][a-z'-]+)\s+(.+)$/);
  if (m2) {
    const name = `${m2[1]} ${m2[2]}`;
    if (isLikelyPersonName(name)) return { name, rest: normalizeText(m2[3]) };
  }
  return null;
}

/**
 * @param {string} name
 * @param {number} year
 * @param {string[]} paragraphs
 * @param {{ id?: string, role?: string, byShort?: string }} [opts]
 */
function buildRecord(name, year, paragraphs, opts = {}) {
  const clean = paragraphs.map((p) => normalizeText(p)).filter(Boolean);
  const id = opts.id ?? `${slugify(name)}-${year}`;
  const body = bodyText(clean);
  const excerpt = EXCERPT_OVERRIDES[id] ?? firstSentenceExcerpt(clean[0] ?? body);
  return {
    id,
    sourceYear: year,
    by: name,
    byShort: opts.byShort ?? toByShort(name),
    ...(opts.role ? { role: opts.role } : {}),
    ...(body.length < 80 ? { short: true } : {}),
    excerpt,
    paragraphs: clean,
  };
}

/** @param {string} html */
function parse2025(html) {
  const paras = extractParagraphs(html);
  const records = [];
  const attribRe = /^-?\s*([A-Za-z][A-Za-z\s.'-]+?)\s*\.?\s*2025\s*$/i;
  const breaks = [];
  paras.forEach((p, i) => {
    const m = p.match(attribRe);
    if (m) breaks.push({ i, name: m[1].trim() });
  });

  const titusParas = paras.slice(0, breaks[0]?.i ?? paras.length);
  const mensIdx = titusParas.findIndex((p) => /I also attended Warwick/i.test(p));
  if (mensIdx >= 0) {
    const main = titusParas.slice(0, mensIdx).map((p) => p.replace(/^["']+|["']+$/g, "").trim());
    const mens = [titusParas[mensIdx].replace(/^["']+|["']+$/g, "").trim()];
    if (main.length) records.push(buildRecord("Titus Willke", 2025, main));
    records.push(
      buildRecord("Titus Willke", 2025, mens, {
        id: "titus-willke-mens-group-2025",
        role: "Men's group, 2025",
      }),
    );
  } else if (titusParas.length) {
    records.push(
      buildRecord(
        "Titus Willke",
        2025,
        titusParas.map((p) => p.replace(/^["']+|["']+$/g, "").trim()),
      ),
    );
  }

  if (breaks.length >= 1) {
    const start = breaks[0].i + 1;
    const end = breaks[1]?.i ?? paras.length;
    const nathanParas = paras
      .slice(start, end)
      .map((p) => p.replace(/^["']+|["']+$/g, "").trim())
      .filter(Boolean);
    if (nathanParas.length) {
      records.push(buildRecord("Nathan Douglas", 2025, nathanParas, { byShort: "N. D." }));
    }
  }

  return records;
}

/** @param {string} html */
function parse2022(html) {
  const paras = extractParagraphs(html);
  const records = [];
  let currentName = null;
  /** @type {string[]} */
  let currentParas = [];

  function flush() {
    if (!currentName || currentParas.length === 0) {
      currentName = null;
      currentParas = [];
      return;
    }
    if (!isLikelyPersonName(currentName)) {
      currentName = null;
      currentParas = [];
      return;
    }
    const last = currentParas[currentParas.length - 1];
    const embedded = last.match(/^(.+?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z'-]+){1,2})\s+(.+)$/);
    if (embedded && parseNameOnly(embedded[2])) {
      currentParas[currentParas.length - 1] = embedded[1].trim();
      records.push(buildRecord(currentName, 2022, currentParas));
      currentName = embedded[2];
      currentParas = [embedded[3].trim()];
      return;
    }
    records.push(buildRecord(currentName, 2022, currentParas));
    currentName = null;
    currentParas = [];
  }

  for (const p of paras) {
    const solo = parseNameOnly(p);
    if (solo) {
      flush();
      currentName = solo;
      continue;
    }

    const lead = parseNameLead(p);
    if (lead) {
      flush();
      currentName = lead.name;
      if (lead.rest) currentParas = [lead.rest];
      continue;
    }

    if (!currentName) continue;
    currentParas.push(p);
  }
  flush();
  return records;
}

/** @param {{ id: string, paragraphs: string[] }[]} items */
function dedupe(items) {
  const seen = new Set();
  return items.filter((t) => {
    const key = normalizeForHash(bodyText(t.paragraphs));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** @param {ReturnType<buildRecord>[]} items */
function postProcess(items) {
  const out = [];
  for (const t of items) {
    if (t.by === "Jaymi Humphreys" && t.paragraphs[0]?.startsWith("Wow, what a visionary")) {
      out.push({
        ...t,
        id: "aurora-august-2022",
        by: "Aurora August",
        byShort: "A. A.",
        excerpt: EXCERPT_OVERRIDES["aurora-august-2022"] ?? t.excerpt,
      });
      continue;
    }

    if (t.by === "Sheree Claire") {
      const gretaIdx = t.paragraphs.findIndex((p) => p === "Greta French-Kennedy");
      if (gretaIdx >= 0) {
        const gretaBody = t.paragraphs.slice(gretaIdx + 1);
        out.push({ ...t, paragraphs: t.paragraphs.slice(0, gretaIdx) });
        if (gretaBody.length) out.push(buildRecord("Greta French-Kennedy", 2022, gretaBody));
        continue;
      }
      const last = t.paragraphs[t.paragraphs.length - 1] ?? "";
      const split = last.match(/^(.+?)\s+(Greta French-Kennedy)\s+(.+)$/);
      if (split) {
        const mainParas = [...t.paragraphs.slice(0, -1), split[1].trim()].filter(Boolean);
        out.push({ ...t, paragraphs: mainParas });
        out.push(buildRecord("Greta French-Kennedy", 2022, [split[3].trim()]));
        continue;
      }
    }

    if (t.by === "Titus Willke" && t.id === "titus-willke-2025") {
      const mensIdx = t.paragraphs.findIndex((p) => /I also attended Warwick/i.test(p));
      if (mensIdx >= 0) {
        out.push({
          ...t,
          paragraphs: t.paragraphs.slice(0, mensIdx),
        });
        out.push(
          buildRecord("Titus Willke", 2025, [t.paragraphs[mensIdx]], {
            id: "titus-willke-mens-group-2025",
            role: "Men's group, 2025",
          }),
        );
        continue;
      }
    }

    out.push(t);
  }
  return dedupe(out);
}

function emitModule(testimonials) {
  const sorted = [...testimonials].sort((a, b) => {
    if (b.sourceYear !== a.sourceYear) return b.sourceYear - a.sourceYear;
    return a.by.localeCompare(b.by);
  });

  const header = `/**
 * Client testimonials — generated by scripts/extract-testimonials.mjs
 * Source: testimonials/2022 Testimonials.htm, testimonials/2025 Testimonials.htm
 * Re-run: node scripts/extract-testimonials.mjs
 */
`;

  const footer = `
/** Testimonials suitable for the home ticker (has excerpt, not marked short). */
export function getTickerTestimonials() {
  return testimonials.filter((t) => t.excerpt && !t.short);
}
`;

  fs.writeFileSync(
    outPath,
    `${header}export const testimonials = ${JSON.stringify(sorted, null, 2)};\n${footer}`,
    "utf8",
  );
  return sorted;
}

function main() {
  const y2025 = readHtml(path.join(repoRoot, "testimonials/2025 Testimonials.htm"));
  const y2022 = readHtml(path.join(repoRoot, "testimonials/2022 Testimonials.htm"));

  const all = postProcess([...parse2025(y2025), ...parse2022(y2022)]);
  const written = emitModule(all);

  console.log(`Wrote ${written.length} testimonials → ${outPath}`);
  for (const t of written) {
    console.log(
      `  ${t.sourceYear}  ${t.by.padEnd(24)}  ${t.short ? "(short)" : ""}  ${t.excerpt.slice(0, 52)}…`,
    );
  }
}

main();

#!/usr/bin/env node
/**
 * Heuristic readability triage (Layer B).
 *
 * Default: HTML only
 * - Flags <p> blocks over MAX_P_WORDS (default 150)
 * - Flags sentences over MAX_S_WORDS (default 30)
 * - Duplicate sentences across scanned HTML (normalized)
 *
 * Optional: --engines
 * - Large template literals in root *-engine.js (MIN_TEMPLATE_CHARS, default 350)
 * - Long sentences after stripping ${...} (heuristic; not a JS parser)
 *
 * Usage (from repo root):
 *   node scripts/readability-scan.mjs
 *   node scripts/readability-scan.mjs --engines
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const MAX_P_WORDS = parseInt(process.env.MAX_P_WORDS || '150', 10);
const MAX_S_WORDS = parseInt(process.env.MAX_S_WORDS || '30', 10);
const MIN_TEMPLATE_CHARS = parseInt(process.env.MIN_TEMPLATE_CHARS || '350', 10);
const RUN_ENGINES = process.argv.includes('--engines');

const HTML_FILES = [
  'index.html',
  'books.html',
  'tools.html',
  'about-the-author.html',
  'framework-atlas.html',
  'diagnosis.html',
  'coaching.html',
  'needs-dependency.html',
  'sovereignty-spectrum.html',
  'paradigm.html',
  'manipulation.html',
  'sovereignty.html',
  'channels.html',
  'character-sheet.html',
  'entities.html',
  'outlier-aptitude.html',
];

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function wordCount(s) {
  return s.split(/\s+/).filter(Boolean).length;
}

function extractParagraphs(html) {
  const out = [];
  const re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const inner = m[1];
    const text = stripTags(inner);
    if (text.length < 2) continue;
    out.push(text);
  }
  return out;
}

function normalizeSentence(s) {
  return s
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove ${ ... } with brace balancing (handles shallow nesting). */
function stripTemplateInterpolations(s) {
  let out = '';
  let i = 0;
  while (i < s.length) {
    if (s[i] === '$' && s[i + 1] === '{') {
      let depth = 1;
      i += 2;
      while (i < s.length && depth > 0) {
        if (s[i] === '{') depth++;
        else if (s[i] === '}') depth--;
        i++;
      }
      out += ' ';
      continue;
    }
    out += s[i];
    i++;
  }
  return out;
}

/** Extract top-level `...` template bodies (unescaped closing backtick). */
function extractBacktickTemplates(src) {
  const blocks = [];
  let i = 0;
  while (i < src.length) {
    const bt = src.indexOf('`', i);
    if (bt === -1) break;
    let j = bt + 1;
    while (j < src.length) {
      const c = src[j];
      if (c === '\\') {
        j += 2;
        continue;
      }
      if (c === '`') break;
      j++;
    }
    if (j >= src.length) break;
    const raw = src.slice(bt + 1, j);
    if (raw.length >= MIN_TEMPLATE_CHARS) {
      blocks.push(raw);
    }
    i = j + 1;
  }
  return blocks;
}

function runHtmlScan() {
  const longParagraphs = [];
  const longSentences = [];
  const sentenceToFiles = new Map();

  for (const rel of HTML_FILES) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
      console.warn(`Skip (missing): ${rel}`);
      continue;
    }
    const html = fs.readFileSync(full, 'utf8');
    const paragraphs = extractParagraphs(html);
    paragraphs.forEach((p, i) => {
      const wc = wordCount(p);
      if (wc > MAX_P_WORDS) {
        longParagraphs.push({
          file: rel,
          index: i,
          words: wc,
          preview: p.slice(0, 120) + (p.length > 120 ? '…' : ''),
        });
      }
      splitSentences(p).forEach((sent) => {
        const w = wordCount(sent);
        if (w > MAX_S_WORDS) {
          longSentences.push({
            file: rel,
            words: w,
            text: sent.slice(0, 140) + (sent.length > 140 ? '…' : ''),
          });
        }
        const norm = normalizeSentence(sent);
        if (norm.length < 25) return;
        if (!sentenceToFiles.has(norm)) sentenceToFiles.set(norm, new Set());
        sentenceToFiles.get(norm).add(rel);
      });
    });
  }

  const duplicates = [...sentenceToFiles.entries()]
    .filter(([, files]) => files.size > 1)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 40);

  console.log('=== Readability scan (HTML <p> only) ===\n');
  console.log(`Long paragraphs (>${MAX_P_WORDS} words): ${longParagraphs.length}`);
  longParagraphs.slice(0, 25).forEach((r) => {
    console.log(`  ${r.file}  [~${r.words} words]  ${r.preview}`);
  });
  if (longParagraphs.length > 25) console.log(`  … ${longParagraphs.length - 25} more`);

  console.log(`\nLong sentences (>${MAX_S_WORDS} words): ${longSentences.length}`);
  longSentences.slice(0, 25).forEach((r) => {
    console.log(`  ${r.file}  [${r.words} words]  ${r.text}`);
  });
  if (longSentences.length > 25) console.log(`  … ${longSentences.length - 25} more`);

  console.log(`\nDuplicate sentences across files (normalized, top ${duplicates.length}):`);
  duplicates.forEach(([sent, files]) => {
    console.log(`  [${files.size} files] ${sent.slice(0, 100)}${sent.length > 100 ? '…' : ''}`);
    console.log(`    → ${[...files].join(', ')}`);
  });

  if (!RUN_ENGINES) {
    console.log(
      '\nTip: add `--engines` for a heuristic pass on root *-engine.js template literals.'
    );
  }
}

function runEngineScan() {
  const engineFiles = fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith('-engine.js') && fs.statSync(path.join(ROOT, f)).isFile());

  console.log('\n=== Readability scan (*-engine.js templates, heuristic) ===\n');
  console.log(
    `Flagging template literals >= ${MIN_TEMPLATE_CHARS} chars; sentences > ${MAX_S_WORDS} words after stripping \${...}.\n`
  );

  let totalBlocks = 0;
  for (const file of engineFiles.sort()) {
    const full = path.join(ROOT, file);
    const src = fs.readFileSync(full, 'utf8');
    const blocks = extractBacktickTemplates(src);
    if (blocks.length === 0) continue;

    const hits = [];
    blocks.forEach((block, idx) => {
      const pseudo = stripTemplateInterpolations(block);
      const strippedHtml = stripTags(pseudo);
      splitSentences(strippedHtml).forEach((sent) => {
        const w = wordCount(sent);
        if (w > MAX_S_WORDS) {
          hits.push({
            blockIndex: idx,
            words: w,
            text: sent.slice(0, 120) + (sent.length > 120 ? '…' : ''),
          });
        }
      });
    });

    if (hits.length > 0) {
      totalBlocks += blocks.length;
      console.log(`${file}  (${blocks.length} large template(s), ${hits.length} long sentence(s))`);
      hits.slice(0, 12).forEach((h) => {
        console.log(`  block~${h.blockIndex}  [${h.words} words]  ${h.text}`);
      });
      if (hits.length > 12) console.log(`  … ${hits.length - 12} more long sentences`);
      console.log('');
    }
  }

  if (totalBlocks === 0) {
    console.log('No large template literals found, or no long sentences in those blocks.');
  }
  console.log(
    'Heuristic limits: nested templates inside ${} may be mis-scanned; use Layer D manual review.'
  );
}

function main() {
  runHtmlScan();
  if (RUN_ENGINES) {
    runEngineScan();
  }
}

main();

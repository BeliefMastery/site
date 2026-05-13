import fs from "node:fs";
import path from "node:path";

const dir = "archive/v3-engines";
const base = "https://beliefmastery.github.io/site/archive/v3-engines/";

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const fp = path.join(dir, f);
  let s = fs.readFileSync(fp, "utf8");
  s = s.replace(
    /href="\.\.\/\.\.\/index\.html#tool-disclaimers"/g,
    'href="/site/#/"',
  );
  const og = `${base}${f}`;
  s = s.replace(
    /<meta property="og:url" content="https:\/\/beliefmastery\.github\.io\/site\/[^"]+"/,
    `<meta property="og:url" content="${og}"`,
  );
  s = s.replace(
    /<meta name="twitter:url" content="https:\/\/beliefmastery\.github\.io\/site\/[^"]+"/,
    `<meta name="twitter:url" content="${og}"`,
  );
  fs.writeFileSync(fp, s);
}

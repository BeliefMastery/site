import fs from "node:fs";

const engineMap = [
  ["diagnosis.html", "diagnosis"],
  ["coaching.html", "coaching"],
  ["needs-dependency.html", "needs-dependency"],
  ["sovereignty-spectrum.html", "sovereignty-spectrum"],
  ["paradigm.html", "paradigm"],
  ["manipulation.html", "manipulation"],
  ["sovereignty.html", "sovereignty"],
  ["channels.html", "channels"],
  ["character-sheet.html", "character-sheet"],
  ["entities.html", "entities"],
  ["outlier-aptitude.html", "outlier-aptitude"],
];

function patchFile(fp) {
  let s = fs.readFileSync(fp, "utf8");
  s = s.replace(/href="index\.html"/g, 'href="/site/#/"');
  s = s.replace(/href="books\.html([^"]*)"/g, 'href="/site/#/books$1"');
  s = s.replace(/href="tools\.html([^"]*)"/g, 'href="/site/#/tools$1"');
  s = s.replace(/href="about-the-author\.html"/g, 'href="/site/v3/about-the-author.html"');
  for (const [file, id] of engineMap) {
    const re = new RegExp(`href="${file.replace(".", "\\.")}"`, "g");
    s = s.replace(re, `href="/site/#/engines/${id}"`);
  }
  fs.writeFileSync(fp, s);
}

for (const rel of ["v3/tools.html", "v3/books.html"]) {
  if (fs.existsSync(rel)) patchFile(rel);
}

import fs from "node:fs";

const engines = [
  ["diagnosis.html", "diagnosis", "Pathology Assessment"],
  ["coaching.html", "coaching", "Life Domain Review"],
  ["needs-dependency.html", "needs-dependency", "Dependency Loop Tracer"],
  ["sovereignty-spectrum.html", "sovereignty-spectrum", "Your Sovereignty Paradigm"],
  ["paradigm.html", "paradigm", "Logos Structure"],
  ["manipulation.html", "manipulation", "Manipulation Defense Decoder"],
  ["sovereignty.html", "sovereignty", "Cognitive Resistance Capacity"],
  ["channels.html", "channels", "Channel Flow Diagnostics"],
  ["character-sheet.html", "character-sheet", "Astrological Character Sheet"],
  ["entities.html", "entities", "Will Anomaly Mapping"],
  ["outlier-aptitude.html", "outlier-aptitude", "Aptitude Mapping"],
];

for (const [file, id, title] of engines) {
  const legacy = file;
  const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title} — redirect</title>
  <meta http-equiv="refresh" content="0; url=/site/v3/app/#/engines/${id}" />
  <link rel="canonical" href="https://beliefmastery.github.io/site/v3/app/#/engines/${id}" />
  <script>window.location.replace("/site/v3/app/#/engines/${id}");</script>
</head>
<body>
  <p>Redirecting to <strong>${title}</strong>… <a href="/site/v3/app/#/engines/${id}">continue</a></p>
  <p><small>Legacy HTML preserved at <a href="archive/legacy-root-html/${legacy}">archive/legacy-root-html/${legacy}</a></small></p>
</body>
</html>
`;
  fs.writeFileSync(file, body);
}

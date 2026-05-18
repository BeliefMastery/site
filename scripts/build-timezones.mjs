/**
 * Regenerate shared/timezones.js from IANA zone1970.tab plus common Etc/* zones.
 * Usage: node scripts/build-timezones.mjs
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ZONE1970_URL = 'https://data.iana.org/time-zones/data/zone1970.tab';
const OUTPUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'shared', 'timezones.js');

const ETC_ZONES = [
  { name: 'Etc/UTC', countries: [] },
  { name: 'Etc/GMT', countries: [] },
  { name: 'Etc/GMT+0', countries: [] },
  { name: 'Etc/GMT-0', countries: [] },
];

function parseZone1970(text) {
  const zones = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('\t');
    // zone1970.tab: countries, coordinates (ISO 6709), TZ name, optional comment
    if (parts.length < 3) continue;
    const name = parts[2].trim();
    if (!name || !name.includes('/')) continue;
    const countries = parts[0]
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    zones.push({ name, countries });
  }
  zones.sort((a, b) => a.name.localeCompare(b.name));
  return zones;
}

function mergeEtcZones(zones) {
  const names = new Set(zones.map((z) => z.name));
  const merged = [...zones];
  for (const etc of ETC_ZONES) {
    if (!names.has(etc.name)) {
      merged.push(etc);
      names.add(etc.name);
    }
  }
  merged.sort((a, b) => a.name.localeCompare(b.name));
  return merged;
}

function emitModule(zones) {
  const body = JSON.stringify(zones, null, 4)
    .replace(/"([^"]+)":/g, '"$1":')
    .replace(/\n/g, '\n');
  return `// Time zone list derived from IANA zone1970.tab (country codes) + common Etc/* zones
// Regenerate: npm run build:timezones
export const TIMEZONES = ${body};
`;
}

async function main() {
  const response = await fetch(ZONE1970_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch zone1970.tab: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  const canonical = parseZone1970(text);
  const zones = mergeEtcZones(canonical);
  writeFileSync(OUTPUT, emitModule(zones), 'utf8');
  console.log(`Wrote ${zones.length} time zones to ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  // eslint-disable-next-line no-undef -- Node CLI script
  process.exit(1);
});

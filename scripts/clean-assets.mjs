/**
 * Remove hashed Vite build artifacts before each production build.
 * outDir is the repo root (emptyOutDir: false), so old chunks accumulate without this step.
 */
import { rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(repoRoot, 'assets');

if (existsSync(assetsDir)) {
  rmSync(assetsDir, { recursive: true, force: true });
  console.log('clean-assets: removed assets/');
}

#!/usr/bin/env node
/* d2-fit — render every .d2 in a folder to SVG and refuse any diagram whose text would be too small
 * to read in a recorded video.
 *
 *   node d2-fit.mjs <diagrams-dir> [--box 1640x620] [--min 18]
 *
 * A diagram is placed in a slide box (default 1640x620, the deck template's content area) and scaled
 * to fit. Its smallest font-size, times that scale, is the text size a viewer actually sees. Below
 * --min px it is refused, with the move: a left-to-right flow of six nodes came out 3000px wide and
 * its labels at 13px (measured 2026-09-23); a grid (grid-rows/grid-columns) or fewer nodes fixed it,
 * while a bigger font-size did not, because the boxes grow with the text.
 *
 * theme.d2 in the folder is imported by the others and is not rendered on its own.
 * exit 0 all readable · 1 a diagram failed to render or is too small · 3 UNEVALUABLE (no d2) */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const dir = argv.find((a) => !a.startsWith('--'));
const flag = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
if (!dir) { console.log('usage: d2-fit.mjs <diagrams-dir> [--box 1640x620] [--min 18]'); process.exit(2); }
const [bw, bh] = flag('--box', '1640x620').split('x').map(Number);
const min = +flag('--min', 18);

try { execFileSync('d2', ['--version'], { stdio: 'pipe' }); } catch {
  console.log('UNEVALUABLE  d2 is not on PATH — brew install d2'); process.exit(3);
}

const theme = fs.existsSync(path.join(dir, 'theme.d2')) ? fs.readFileSync(path.join(dir, 'theme.d2'), 'utf8') : '';
let bad = 0;
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.d2') && n !== 'theme.d2').sort()) {
  const src = path.join(dir, f), svg = src.replace(/\.d2$/, '.svg');
  try { execFileSync('d2', ['--layout', 'elk', src, svg], { stdio: 'pipe' }); } catch (e) {
    console.log(`  FAILED    ${f}  ${String(e.stderr || e.message).split('\n')[0]}`); bad++; continue;
  }
  const vb = fs.readFileSync(svg, 'utf8').match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
  const [w, h] = [+vb[1], +vb[2]];
  const own = fs.readFileSync(src, 'utf8');
  const sizes = [...(own + theme).matchAll(/font-size:\s*(\d+)/g)].map((m) => +m[1]);
  const smallest = sizes.length ? Math.min(...sizes) : 16;
  const k = Math.min(bw / w, bh / h);
  const px = smallest * k;
  const ok = px >= min;
  if (!ok) bad++;
  console.log(`  ${ok ? 'ok      ' : 'TOO SMALL'} ${f.padEnd(18)} ${Math.round(w)}x${Math.round(h)} → scale ${k.toFixed(2)} · smallest text ${px.toFixed(0)}px${ok ? '' : `  (need ${min}px: use a grid layout or fewer nodes; a larger font will not help)`}`);
}
process.exit(bad ? 1 : 0);

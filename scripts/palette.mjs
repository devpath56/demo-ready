#!/usr/bin/env node
/* palette — read an organizer's colours and font from their own page, never from memory.
 *
 *   node palette.mjs <url> [--scheme dark|light] [--out palette.json]
 *
 * Loads the page under an explicit colour scheme (default dark: the deck is a dark recording
 * surface) and reads the RESOLVED values of its custom properties from the root element, plus the
 * computed body background, text colour and font. Reading stylesheet text instead picked the light
 * theme's tokens on a site that defines both (measured 2026-09-23: text came back #0E0E0F on
 * #0E0E0F), so the scheme is set and the values are asked of the page, not parsed from its CSS.
 *
 * Prints the :root block the deck template expects, with the source URL in a comment.
 * exit 0 read · 1 no accent found (pass it yourself) · 2 usage · 3 UNEVALUABLE */
import fs from 'node:fs';
import { launch, UA } from './lib/browser.mjs';

const argv = process.argv.slice(2);
const url = argv.find((a) => /^https?:/.test(a));
const flag = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
if (!url) { console.log('usage: palette.mjs <url> [--scheme dark|light] [--out palette.json]'); process.exit(2); }
const scheme = flag('--scheme', 'dark');

const browser = await launch();
const page = await (await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 }, colorScheme: scheme })).newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
const read = await page.evaluate(() => {
  const names = new Set();
  for (const s of document.styleSheets) {
    let rules; try { rules = s.cssRules; } catch { continue; }
    for (const r of rules) if (r.style) for (const p of r.style) if (p.startsWith('--')) names.add(p);
  }
  const root = getComputedStyle(document.documentElement);
  const vars = {};
  for (const n of names) if (/accent|primary|brand|highlight|text-primary|^--bg$|background$/.test(n)) {
    const v = root.getPropertyValue(n).trim();
    if (v) vars[n] = v;
  }
  const body = getComputedStyle(document.body);
  let bg = body.backgroundColor;
  if (/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) bg = root.backgroundColor;
  return { vars, bg, text: body.color, font: body.fontFamily };
});
await browser.close();

const hex = (c) => {
  const m = c && c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? '#' + m.slice(1, 4).map((n) => (+n).toString(16).padStart(2, '0')).join('').toUpperCase() : c;
};
const v = (re) => Object.entries(read.vars).find(([k]) => re.test(k))?.[1];
const accent = v(/^--(accent|primary|brand)$/) ?? v(/^--(accent|primary|brand)/);
const palette = {
  source: url,
  scheme,
  read_at: new Date().toISOString().slice(0, 10),
  bg: hex(read.bg),
  text: v(/^--text-primary$/) ?? hex(read.text),
  accent,
  accentHi: v(/^--(accent|primary)-hover$/) ?? accent,
  accentSoft: v(/^--(accent|primary)-soft$/) ?? null,
  accentGlow: v(/^--(accent|primary)-glow$/) ?? null,
  font: read.font.split(',')[0].replace(/["']/g, '').trim(),
  vars: read.vars,
};
console.log(JSON.stringify(palette, null, 2));
console.log(`\n/* Palette read from ${url} (${scheme} scheme) on ${palette.read_at}. */
  --bg: ${palette.bg};
  --text: ${palette.text};
  --accent: ${palette.accent};
  --accent-hi: ${palette.accentHi};
  --accent-soft: ${palette.accentSoft ?? 'color-mix(in srgb, var(--accent) 12%, transparent)'};
  --accent-glow: ${palette.accentGlow ?? 'color-mix(in srgb, var(--accent) 35%, transparent)'};
  font: ${palette.font}`);
if (palette.bg === palette.text) console.log('\n  WARNING  text equals background — the page may not honour this scheme; try --scheme light');
const out = flag('--out');
if (out) fs.writeFileSync(out, JSON.stringify(palette, null, 2));
process.exit(accent ? 0 : 1);

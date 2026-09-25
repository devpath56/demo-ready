#!/usr/bin/env node
/* test-deck — render and test an HTML deck built from templates/deck.html. Serve it over http first:
 * the presenter sync (BroadcastChannel) does not work from file://.
 *
 *   node test-deck.mjs <http://…/deck.html> <outdir>
 *
 * Writes <outdir>/slide-N.png for every slide at its final step (1920x1080), for a person to read,
 * and refuses on what a person should never have to find by eye:
 *
 *   errors      a console error or page exception, or a failed request (the favicon included)
 *   image       an <img> that did not load
 *   overflow    an element on a slide extending past the 1920x1080 stage
 *   small       at 1280x720 the stage is not centred and wholly inside the window (measured: a grid
 *               centred the unscaled 1920px stage first, shifting every slide right and clipping it)
 *   template    a {{PLACEHOLDER}} from templates/deck.html left unfilled
 *   notes       a slide with no <script type="text/notes">
 *   presenter   ?presenter does not show the slide's script, or does not follow the main window
 *
 * exit 0 all pass · 1 a finding · 3 UNEVALUABLE */
import fs from 'node:fs';
import path from 'node:path';
import { launch } from './lib/browser.mjs';

const [url, out] = process.argv.slice(2);
if (!url || !out) { console.log('usage: test-deck.mjs <http://…/deck.html> <outdir>'); process.exit(2); }
if (url.startsWith('file:')) { console.log('UNEVALUABLE  serve the deck over http — presenter sync cannot work from file://'); process.exit(3); }
fs.mkdirSync(out, { recursive: true });
const base = url.split('#')[0].split('?')[0];

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const findings = [];
const watch = (p, where) => {
  p.on('pageerror', (e) => findings.push(['errors', where, e.message]));
  p.on('console', (m) => { if (m.type() === 'error') findings.push(['errors', where, m.text()]); });
  p.on('requestfailed', (r) => findings.push(['errors', where, `request failed ${r.url()}`]));
  p.on('response', (r) => { if (r.status() >= 400) findings.push(['errors', where, `${r.status()} ${r.url()}`]); });
};

const p = await ctx.newPage();
watch(p, 'deck');
await p.goto(base, { waitUntil: 'networkidle' });
const meta = await p.evaluate(() => [...document.querySelectorAll('.slide')].map((s) => ({
  beat: s.dataset.beat, steps: Math.max(0, ...[...s.querySelectorAll('[data-step]')].map((n) => +n.dataset.step)),
  notes: (s.querySelector('script[type="text/notes"]')?.textContent || '').trim().length,
})));
const left = await p.evaluate(() => [...new Set((document.documentElement.outerHTML.match(/\{\{[A-Z0-9_]+\}\}/g) || []))]);
if (left.length) findings.push(['template', 'deck', `unfilled placeholders: ${left.slice(0, 8).join(' ')}${left.length > 8 ? ` (+${left.length - 8})` : ''}`]);
for (const [i, m] of meta.entries()) {
  if (!m.notes) findings.push(['notes', `slide ${i}`, `"${m.beat}" has no speaker notes`]);
  await p.goto(`${base}#${i + 1}.${m.steps}`);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  await p.screenshot({ path: path.join(out, `slide-${i}.png`) });
  const r = await p.evaluate(() => {
    const slide = document.querySelector('.slide.active');
    const st = document.getElementById('stage').getBoundingClientRect();
    const k = st.width / 1920;
    // What is VISIBLE: a cropped screenshot's <img> extends past its frame on purpose, and the frame
    // (overflow: hidden) clips it. Intersect with every clipping ancestor below the stage first.
    const visible = (n) => {
      let b = n.getBoundingClientRect(), r = { l: b.left, t: b.top, r: b.right, b: b.bottom };
      for (let a = n.parentElement; a && a.id !== 'stage'; a = a.parentElement) {
        if (getComputedStyle(a).overflow === 'visible') continue;
        const c = a.getBoundingClientRect();
        r = { l: Math.max(r.l, c.left), t: Math.max(r.t, c.top), r: Math.min(r.r, c.right), b: Math.min(r.b, c.bottom) };
      }
      return r;
    };
    // Text is measured by its glyphs, not its box: a heading pushed right keeps a zero-width box
    // while its words run off the stage (a planted fault the box test missed).
    const textRect = (n) => {
      const t = [...n.childNodes].filter((c) => c.nodeType === 3 && c.textContent.trim());
      if (!t.length) return null;
      const r = document.createRange(); r.selectNodeContents(n); return r.getBoundingClientRect();
    };
    const outside = (v) => v.r > st.right + 2 * k || v.b > st.bottom + 2 * k || v.l < st.left - 2 * k;
    const over = [...slide.querySelectorAll('*')].filter((n) => {
      if (getComputedStyle(n).opacity === '0') return false;
      const tr = textRect(n);
      if (tr && tr.width && outside({ l: tr.left, t: tr.top, r: tr.right, b: tr.bottom })) return true;
      if (!n.getBoundingClientRect().width) return false;
      const v = visible(n);
      if (v.r <= v.l || v.b <= v.t) return false;
      return outside(v);
    }).slice(0, 3).map((n) => `${n.tagName.toLowerCase()}${n.className ? '.' + n.className : ''} "${(n.textContent || n.getAttribute('src') || '').trim().slice(0, 30)}"`);
    const broken = [...slide.querySelectorAll('img')].filter((im) => !im.complete || !im.naturalWidth).map((im) => im.getAttribute('src'));
    return { over, broken };
  });
  for (const o of r.over) findings.push(['overflow', `slide ${i}`, `${o} extends past the stage`]);
  for (const b of r.broken) findings.push(['image', `slide ${i}`, `${b} did not load`]);
}

// A smaller window: the stage must be centred and fully visible.
const small = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const sp = await small.newPage();
await sp.goto(`${base}#1.0`, { waitUntil: 'networkidle' });
const fit = await sp.evaluate(() => { const b = document.getElementById('stage').getBoundingClientRect(); return { l: b.left, t: b.top, r: innerWidth - b.right, b: innerHeight - b.bottom }; });
if (Math.min(fit.l, fit.t, fit.r, fit.b) < -1 || Math.abs(fit.l - fit.r) > 2) findings.push(['small', '1280x720', `stage not centred inside the window (left ${fit.l.toFixed(0)}, right ${fit.r.toFixed(0)}, top ${fit.t.toFixed(0)}, bottom ${fit.b.toFixed(0)})`]);

// Presenter: shows the script, and follows the main window.
const pres = await ctx.newPage();
watch(pres, 'presenter');
await pres.goto(`${base}?presenter#1.0`, { waitUntil: 'networkidle' });
const script0 = await pres.textContent('#p-script');
if (!script0 || !script0.trim()) findings.push(['presenter', 'slide 0', 'presenter shows no script']);
await p.goto(`${base}#1.0`); await p.reload({ waitUntil: 'networkidle' });
await p.bringToFront();
await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
await pres.waitForTimeout(600);
const pos = await pres.textContent('#p-pos');
const mainPos = await p.evaluate(() => location.hash);
if (!/step [12]|Slide 2/.test(pos)) findings.push(['presenter', 'sync', `main moved to ${mainPos} but presenter reads "${pos}"`]);

await browser.close();
// One line per distinct finding: every reload re-reports the same failed request.
const seen = new Set();
for (let i = findings.length - 1; i >= 0; i--) {
  const key = findings[i][0] === 'errors' ? `errors|${findings[i][2]}` : findings[i].join('|');
  if (seen.has(key)) findings.splice(i, 1); else seen.add(key);
}
console.log(`  test-deck · ${meta.length} slides · screenshots in ${out}`);
for (const [rule, where, why] of findings) console.log(`    ${rule.padEnd(9)} ${where.padEnd(10)} ${why}`);
console.log(findings.length ? `  ${findings.length} finding(s)` : '  all pass — now READ every screenshot; a check cannot tell you a slide says the wrong thing');
process.exit(findings.length ? 1 : 0);

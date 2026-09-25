#!/usr/bin/env node
/* capture — screenshot a source ONLY after its quoted text is found verbatim on the live page.
 *
 *   node capture.mjs <sources.json> <outdir> [--only <id>]
 *
 * sources.json: [{ "id": "1-ap", "url": "...", "find": "exact words", "mode": "headline|para|full",
 *                  "label": "AP News", "date": "Dec 10, 2021", "note": "who actually said it" }]
 *
 *   headline  crop to the page's h1 and its standfirst
 *   para      scroll to the <p> holding `find`, highlight it in the accent, take the viewport
 *   full      the viewport as loaded
 *
 * Every source gets a FRESH browser context: a second load of the same site in one context came back
 * without the article (measured on AP, 2026-09-23). Cookie banners are declined, never accepted;
 * interstitial ads are closed by their own close control. Writes <outdir>/<id>.png and
 * <outdir>/SOURCES.md with each URL, date and the verbatim text found.
 *
 * exit 0 every source verified · 1 at least one NOT-FOUND or ERROR (nothing is written for it) */
import fs from 'node:fs';
import path from 'node:path';
import { launch, UA } from './lib/browser.mjs';

const [cfgPath, out] = process.argv.slice(2);
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
if (!cfgPath || !out) { console.log('usage: capture.mjs <sources.json> <outdir> [--only <id>]'); process.exit(2); }
const sources = JSON.parse(fs.readFileSync(cfgPath, 'utf8')).filter((s) => !only || s.id === only);
fs.mkdirSync(out, { recursive: true });
const accent = process.env.ACCENT_RGBA ?? 'rgba(255,176,40,.28)';

const browser = await launch();
const report = [];
for (const s of sources) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'en-US', userAgent: UA, colorScheme: 'light' });
  const page = await ctx.newPage();
  try {
    await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);
    for (const label of ['Reject All', 'Reject all', 'Decline', 'Necessary only', 'Only necessary', 'Decline all']) {
      const b = page.getByRole('button', { name: label });
      if (await b.count().catch(() => 0)) { await b.first().click({ timeout: 2000 }).catch(() => {}); break; }
    }
    for (const t of ['CLOSE AD', 'Close ad', 'Continue to site', 'No thanks']) {
      const l = page.getByText(t, { exact: false });
      if (await l.count().catch(() => 0)) { await l.first().click({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(800); }
    }
    await page.addStyleTag({ content: '#onetrust-consent-sdk,.fc-consent-root,[id^="sp_message"],.tp-modal,.tp-backdrop{display:none!important} body{overflow:auto!important}' });
    const norm = (t) => t.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
    const text = await page.evaluate(() => document.body.innerText);
    const idx = norm(text).indexOf(norm(s.find));
    if (idx < 0) { report.push({ ...s, state: 'NOT-FOUND' }); await ctx.close(); continue; }
    const found = text.slice(Math.max(0, idx - 160), idx + s.find.length + 200).replace(/\s+/g, ' ');
    const file = path.join(out, `${s.id}.png`);
    if (s.mode === 'para') {
      const re = new RegExp(norm(s.find).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "['\u2019]").replace(/"/g, '["\u201C\u201D]'));
      const el = page.locator('p, blockquote, li', { hasText: re }).first();
      await el.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -220));
      await el.evaluate((n, a) => { n.style.background = a; n.style.boxShadow = `0 0 0 8px ${a}`; }, accent);
      await page.waitForTimeout(500);
      await page.screenshot({ path: file });
    } else if (s.mode === 'headline') {
      const h = page.locator('h1').first();
      await h.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -160));
      await page.waitForTimeout(600);
      const bb = await h.boundingBox();
      const x = Math.max(0, bb.x - 60), y = Math.max(0, bb.y - 60);
      await page.screenshot({ path: file, clip: { x, y, width: Math.min(1440 - x, 1320), height: Math.min(900 - y, bb.height + 300) } });
    } else {
      await page.screenshot({ path: file });
    }
    report.push({ ...s, state: 'captured', found });
  } catch (e) {
    report.push({ ...s, state: 'ERROR', why: e.message.split('\n')[0] });
  }
  await ctx.close();
}
await browser.close();

for (const r of report) console.log(`${r.state.padEnd(10)} ${r.id}  ${r.why ?? ''}${r.found ? `\n           …${r.found}…` : ''}`);
const ok = report.filter((r) => r.state === 'captured');
if (!only) {
  const rows = ok.map((r) => `| \`${r.id}.png\` | ${r.label ?? ''} — ${r.url} | ${r.date ?? ''} | "${r.find}"${r.note ? ` · ${r.note}` : ''} |`);
  fs.writeFileSync(path.join(out, 'SOURCES.md'), `# Sources\n\nCaptured ${new Date().toISOString().slice(0, 10)}. Each screenshot was taken only after its quoted text was found verbatim on the live page. Highlights are ours.\n\n| File | Source | Date | Verbatim text |\n|---|---|---|---|\n${rows.join('\n')}\n`);
}
process.exit(ok.length === report.length ? 0 : 1);

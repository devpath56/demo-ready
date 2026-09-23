// One place that finds a headless browser, so every script launches the same way.
// Order: $PLAYWRIGHT_MODULE, the target repo's node_modules, any ~/dev/*/node_modules. The Chromium
// is whichever the module ships with; if that revision is not installed, the newest cached
// ms-playwright Chromium is used instead of failing (measured: a repo's playwright wanted 1243 while
// only 1194 was cached, and the collision check reported UNEVALUABLE for a browser that existed).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// A real desktop UA: AP served an empty article to the headless default (measured 2026-09-23).
export const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

function candidates() {
  const out = [];
  if (process.env.PLAYWRIGHT_MODULE) out.push(process.env.PLAYWRIGHT_MODULE);
  out.push(path.join(process.cwd(), 'node_modules/playwright/index.mjs'));
  const dev = path.join(os.homedir(), 'dev');
  try { for (const d of fs.readdirSync(dev)) out.push(path.join(dev, d, 'node_modules/playwright/index.mjs')); } catch {}
  return out.filter((p) => fs.existsSync(p));
}

function cachedChromium() {
  const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  let dirs = [];
  try { dirs = fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]); } catch {}
  for (const d of dirs) {
    for (const rel of ['chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-linux/chrome']) {
      const p = path.join(cache, d, rel);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

/** Launch Chromium, or exit 3 with the reason — never a stack trace a reader has to decode. */
export async function launch() {
  const mods = candidates();
  if (!mods.length) {
    console.log('UNEVALUABLE  no playwright module found — npm i -D playwright in the repo, or set PLAYWRIGHT_MODULE');
    process.exit(3);
  }
  const { chromium } = await import(pathToFileURL(mods[0]).href);
  try { return await chromium.launch(); } catch (e) {
    const exe = cachedChromium();
    if (!exe) { console.log(`UNEVALUABLE  no Chromium for ${mods[0]}: npx playwright install chromium`); process.exit(3); }
    return chromium.launch({ executablePath: exe });
  }
}

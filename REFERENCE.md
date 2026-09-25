# demo-ready — reference

Every rule in SKILL.md exists because something went wrong once. First run: ShipGate, SF Enterprise
Hackathon 2.0, 2026-09-23 (github.com/devpath56/ShipGate — `demo/`, `architecture/`).

## Pitfalls, measured

| What happened | Rule it produced |
|---|---|
| The architecture was transcribed from a generated design doc; the code, pushed later, had one engine where the doc had five services, an AI layer the doc lacked, and a different host | Model from the code. Every component names its files; `drift.mjs` refuses a mismatch in CI |
| A drift check exited 0 printing nothing: `/tmp` is a symlink, so its "am I main?" test compared two spellings of one path and skipped everything | Compare `realpath`s. Any check that prints nothing on success is suspect: run its `--negative` |
| A tester reported green on its first run | Plant a fault in a copy and watch it fail before trusting the green (done for drift, capture, d2-fit, test-deck) |
| Headless Chromium got an empty AP article | `lib/browser.mjs` sends a desktop user agent |
| The second load of a site in one browser context lost the article | `capture.mjs` uses a fresh context per source |
| An interstitial ad covered a headline | `capture.mjs` clicks the ad's own close control; cookie banners are declined, never accepted |
| "The internet's on fire" read as AP's words; it was a CrowdStrike VP quoted by AP. "Biggest in the history of modern computing" was AP's paraphrase of Tenable's CEO | Every flash's notes say who said it. A paraphrase is not a quote |
| The palette script read the light theme's tokens (text = background) | `palette.mjs` sets the colour scheme and reads resolved values, not stylesheet text |
| The deck shifted right and clipped in any window under 1920 wide: a grid centred the unscaled stage before the scale applied | Stage is absolutely centred with `translate(-50%,-50%) scale(k)`; `test-deck` checks it at 1280×720 |
| Screenshot cards sized from their height came out tiny | Crops are width-driven: `data-w` on a flash, the column on a doc |
| A six-node left-to-right D2 flow was 3000px wide, labels 13px on the slide. A bigger font did not help: boxes grow with text | `d2-fit` computes on-slide text px; use `grid-rows`/`grid-columns` or fewer nodes |
| The deck said 30 changes and 10:00; the app's legacy screen said 31 and 9:00 | Every number on a slide is grepped from the app. The spoken script is changed to match, or the app is |
| Box overflow was missed when a heading was pushed off-stage (zero-width box, visible text) | `test-deck` measures text by its glyphs, and clips images by their `overflow:hidden` frame |
| A favicon 404 showed as a console error | The template carries `<link rel="icon" href="data:,">` |
| The draft post said the product "makes releases safe" on the platform — documentary evidence of a missing mechanism written as empirical unsafety, an app-level gate written as a platform change | Copy must not upgrade the spec's claims; the honest-notes paragraph carries the calibration into the post |
| The PRD named every screen, but the three video-critical states (mode banner, refusal panel, BLOCKED → RESOLVED → SHIPPED in one frame) were specified nowhere | The spec stage's build acceptance criteria name the load-bearing visual states; Gate 0 verifies each is demoable in the build before polish begins |

## Slide types in templates/deck.html

Title (pre-roll hold) · Legacy mock (invite + email thread + stamp) · Flashes (verified screenshots,
escalating, stakes meter, earlier cards recede) · Statement (one line per step) · Question + D2 ·
Doc quote (full-width verified screenshot) · Hand-off (lifecycle D2, app-click cues) · Bridge
(approve-branch D2, "not the human, the gate") · Close (tagline + evidence D2) · Final card.

Crop maths: `data-crop="x,y,w,h"` are fractions of the image; `data-img="WxH"` its pixels
(`sips -g pixelWidth -g pixelHeight f.png`); the frame's height follows from the width.

## Recording

- Serve over http; presenter sync (BroadcastChannel) does not work from `file://`.
- Record only the main window. `r` hides the progress bar. The cursor hides after 1.5s idle.
- The deck covers the story; the app covers the proof. Cut to the app at the hand-off slide and
  back at the bridge or close. Reset the app's state between takes.

## Approval checkpoints (the operator decides)

Creating or publicising a repo · which beats the deck covers · pushing third-party screenshots to a
public repo · publishing the deck to Pages · publishing the post · any change to the app's own text to match the script.

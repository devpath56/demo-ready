---
name: demo-ready
description: Makes a repo demo-presentation ready in three gates — 0, the spec stage's inputs are locked and the build meets its acceptance criteria; A, the repo is available (public, architecture model drawn from the code, a drift check in CI, rendered to GitHub Pages); and B, the visual artifacts are ready, tested and approved (an HTML deck in the organizer's colours with synced presenter notes, D2 workflow diagrams read from the code, news or docs screenshots captured only after their quotes are verified on the live page, and the submission post). Use when the operator says "demo-ready", "make this demo ready", "prep the demo", "make slides for the demo", "hackathon submission", "deck for the recording", or hands over a demo script and a repo.
---

# demo-ready

Three gates, in order. A gate is passed when its checks exit 0 AND the operator has approved what
they show. Scripts live in `~/.claude/skills/demo-ready/scripts/`; templates in `templates/`.
Pitfalls behind every rule: [REFERENCE.md](REFERENCE.md).

## Gate 0 — spec inputs locked, build verified

1. **Collect the upstream.** The spec stage hands over: the locked spec, the frozen pre-registration
   block (seam, stakes claim, demo shape, claim calibration, product scope, strongest objection +
   answer, incident analogue with boundary), and the build acceptance criteria (the load-bearing
   states the build must leave demoable). The builder hands over: the working product, in this repo.
2. **Verify the build against the acceptance criteria first.** Every load-bearing visual state must
   actually be demoable in the app (mode banners, refusal panels, state transitions visible in one
   frame — whatever the criteria list). A criterion that is not demoable is a build issue: send it
   back to the builder. Never work around a build gap in polish.
3. **Scope guard.** This skill changes presentation artifacts only — deck, diagrams, screenshots,
   post, presenter notes. It never changes product behavior, never writes build specs, and never
   re-litigates the locked spec.

## Gate A — repo available

1. **Repo.** Confirm the GitHub repo exists and its visibility. Creating one, or making it public,
   is the operator's call — ask. Pull the latest before touching anything; teammates push code.
2. **Model from the code, never from a doc.** Read every source file. Write
   `architecture/<model>/workspace.dsl` (Structurizr DSL, Drawing Office shape): one component per
   source module, each with `properties { "code" "path/a.ts,path/b.ts" }`, one line per value
   import, one `dynamic` view per demo flow (a dynamic view cannot branch: advisory and enforced are
   two traces). Decisions go in `adrs/` with a Nygard status and an `## In the code` line.
3. **Drift check.** Copy `templates/drift.mjs` to `architecture/drift.mjs`, set MODEL, SOURCES,
   SHARED at its top. `node architecture/drift.mjs --negative && node architecture/drift.mjs`
   must both exit 0. Delete one real line from a copy of the model and confirm it is flagged.
4. **Build and check.** From Drawing Office: `node tools/build.mjs <model> --root <repo>`, then
   every `checks/*.mjs --root <repo>` in its `package.json` `check` script. Fix the INPUT, never
   Drawing Office; a repo's `architecture/theme.json` is the repo's own.
5. **CI + Pages.** Copy `templates/architecture.yml` to `.github/workflows/`, set its `paths:` and
   `DRAWING_OFFICE_REF`, enable Pages (`gh api -X POST repos/<o>/<r>/pages -f build_type=workflow`).
   Land, then read the run's log: drift `in sync`, `checks failing: 0 of N`, the Pages URL 200.

## Gate B — visual artifacts ready, tested, approved

1. **Ask first** (AskUserQuestion, one call): which beats the deck covers (usually the non-app
   beats; the app is screen-recorded), where quotes come from (verify live — never from memory),
   format (HTML for recording), speaker notes on, final product name. Also collect: the locked
   spec's claim calibration and honest product scope (Gate 0), and the organizer's post
   requirements (hashtag, handle, submission link).
2. **Beats table.** Shape the demo script into a table — Beat | Script | On screen | Expected
   audience engagement — following the arc: recognition → open-loop stakes → curiosity →
   discomfort → structural aha → take-home question. End on a lingering question. The deck covers
   the story; this table is the story's structure. Every later step serves it.
3. **Palette.** `node scripts/palette.mjs <organizer-url>` → paste its block into the deck's
   `:root`, keeping the source comment. Colours and font only; never the organizer's logo.
4. **Sources.** Write `demo/sources/sources.json`, run
   `node scripts/capture.mjs demo/sources/sources.json demo/sources`. Exit 1 means a quote was not
   found verbatim: fix the quote or drop the source, never the check. Record in the notes who
   actually said each quote (a headline quotes someone; a paraphrase is not a quote).
5. **Diagrams.** Copy `templates/theme.d2` to `demo/diagrams/`, write one `.d2` per workflow,
   each read from the code it draws (name the file in a comment). `node scripts/d2-fit.mjs
   demo/diagrams` must exit 0 (smallest text ≥ 18px on the slide).
6. **Deck.** Copy `templates/deck.html` to `demo/deck.html`. Fill every `{{PLACEHOLDER}}`; delete
   unused slide types. Speaker notes: the spoken line first, quoted; then cues. The hand-off slide's
   notes list the app clicks in the APP'S OWN LABELS (grep the UI source) and the reset control.
   Every number on a slide must match the app (grep the app's screens for it). Copy on slides and
   in the post must not upgrade the spec's claims: documentary evidence stays documentary, an
   app-level gate stays app-level. Polish never inflates calibration.
7. **Test.** Serve over http (`python3 -m http.server` from `demo/`), then
   `node scripts/test-deck.mjs http://localhost:<port>/deck.html <outdir>` must exit 0. Then READ
   every `slide-N.png` yourself: a check cannot tell you a slide says the wrong thing.
8. **Post.** Draft the submission post from this outline: hook → the legacy problem → the seam
   with the docs quote (credit the platform's own guarantees first) → the transplanted solution →
   the demo beats → an honest-notes paragraph carrying the spec's claim calibration (simulated
   feeds labeled in-app; the gate is this product's logic, not native platform behavior).
   Pre-publish checklist, every item verified: demo video link, organizer hashtag and handle,
   every mock replaced with a real build screenshot or explicitly labeled as a mockup, every
   citation URL opened live and confirmed.
9. **Approve.** Show the operator the slide screenshots, the switch points (deck → app → deck
   with times), and the post draft. Pushing third-party screenshots to a PUBLIC repo is their
   call — ask. Land only after a yes.

## Deliverables every time

- `demo/deck.html` — `→` steps, `p` presenter window (script, cues, next beat, clock; synced both
  ways), `n` notes, `r` recording mode, `f` full screen; stage centred at any window size
- `demo/beats.md` — the beats table the deck and recording follow
- `demo/post.md` — the submission post draft, passing the pre-publish checklist
- `demo/diagrams/*.d2` + `.svg`, `demo/sources/*.png` + `SOURCES.md` with every URL
- `architecture/` model, `drift.mjs`, ADRs; CI workflow; live Pages URL

## Report

A table of what exists and where, the recording timeline (which minute is deck, which is app),
the checks' exit codes as run, and every open decision for the operator.

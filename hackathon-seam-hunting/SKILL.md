---
name: "hackathon-seam-hunting"
description: "Scope a project idea for a sponsor hackathon where dev docs are available: map the platform's trust primitives, mine customer case studies for headline $$ metrics and trust concerns, hunt the seam between platform guarantees and application needs, and shape the demo as villain→resolution. Use when picking what to build for a hackathon, or when evaluating a hackathon idea before or after the event."
---

# Hackathon Seam Hunting

## Purpose
Pick what to build for a sponsor hackathon so the idea wins on stakes, legibility, and evidence — not on novelty of mechanism. The method: find a high-stakes **seam** between what the platform guarantees and what real applications need, close it with a solution **transplanted** from a mature domain, and demo it as a failure followed by its prevention.

Scope boundary: this skill ends at a **locked spec + frozen pre-registration**, handed to the builder with build acceptance criteria. Packaging that handoff into sequenced builder prompts is the `build-prompt` skill's job; the build itself and the demo-presentation polish are separate stages — this skill covers neither. Judge and audience research is also separate: the `people-research` skill owns it, and this skill consumes its output at idea selection (step 4) and demo shaping.

## Workflow

### 0. Gather inputs (input contract)
Collect before running the method. Do not run it on vibes alone.
- Sponsor dev docs URL — you need the trust primitives: approval/human-in-the-loop, sandboxing, audit logs, auth, rate limits. Whatever the platform's safety story is.
- Sponsor's latest customer case studies — what end customers pay for (headline $$ metrics: revenue protected, cost saved, risk avoided) and what they fear (trust concerns that had to be satisfied before deploying). These set the stakes ranking.
- Published judging criteria, if any (including weights).
- Time budget in hours (hard constraint).

### 1. Map the trust primitives
From the docs, list each trust primitive and write down, in one line each, exactly what it guarantees. Quote the docs. Note what it explicitly does NOT guarantee — the docs usually say this plainly (e.g. "pauses the agent before such a call" = per call, not per operation).

### 2. Mine the case studies
For each case study extract: (a) the headline metric ($$), (b) the trust concern that had to be true for the customer to deploy. Rank by how viscerally a judge would feel the failure of each.

### 3. Hunt the seam
For each trust primitive, ask: what does a real application need that this primitive does not provide? That boundary — platform guarantee vs application need — is a seam. You are NOT hunting bugs or holes in the platform. Write each seam as: "Platform guarantees X; applications need Y." Example: "Approval gates individual tool calls; applications need exactly-once operations."

### 4. Rank seams by stakes
Order the seams by the one-sentence scary test: can you state the failure so a non-technical judge feels it in one sentence? Rough priority: money > secrets > correctness > convenience. Cross-check against the case-study metrics from step 2 — the seam should threaten something a real customer pays to protect. If it needs a paragraph to feel scary, drop it.
Sponsor-lane note: the decider rewards the story they can retell internally over novelty for its own sake. An unhinged demo that cannot be retold in the sponsor's own words loses to a legible one.

### 4.5. Screen seams against published judging criteria
If the sponsor published judging criteria with weights, retire any generic rubric and score each ranked seam against each weighted column. The picked seam must plausibly score on the **top-two weighted columns** — a seam that cannot carry the heaviest criteria is dropped no matter how scary it is. Record the screen as a small table (seam × criterion → plausible score or gap). This is what kills good seams that are wrong for this event.

### 4.6. Column-coverage audit
Before freezing the spec, check every judged column has an owning part of the spec. A column with no owner is a gap you will discover at the worst time (e.g. an AI-Native Design column with zero AI features in the spec). Fill each gap or explicitly scope it out now — never discover it at PRD review.

### 4.7. Calibrate against the decider's cool-list
From people-research, write down the 2–4 things the prize decider finds "cool" (their thesis, their public bets, what they themselves demo). Score the top seam against each. Then hunt negligible-scope-creep enhancements — changes that cost almost nothing but raise the cool score (a visible tool call in the first 60 seconds, a one-line framing). If an enhancement needs real scope, it goes through the time-budget filter (step 6), not around it.

### 5. Transplant the solution
Do not invent a mechanism. Pull the solution shape from a mature domain: idempotency keys (payments), taint tracking (security), write-ahead logs (databases), allowlists (ops), required status checks (CI/CD release gating). Transplanted solutions arrive pre-trusted by technical judges.
Validity check before pre-registering: verify the transplant against the platform's existing primitives and the spec's out-of-scope list. On collision, reframe rather than force — e.g. if every category already has a severity policy, propose a stricter threshold for the repeated category, not a new category; if the spec excludes an action, scope the acceptance as an explicit, labeled exception (non-enforcing where required).

### 6. Apply the time-budget filter
Cut the scope to what is demoable in the time budget. Cut rule: if a piece is not the villain→resolution scene or the evidence backing it, it does not get built.
Corollary: never regenerate an approved stage. On a spec-first platform, additive deltas go into the earliest stage the build actually consumes — never by reopening an approved PRD, since regeneration costs time and risks losing fixes. Keep a post-build verify-only pass that checks the build against the spec without changing it.

Credential-seam rule: if the only blocker is a key, credential, or signup, build everything behind an interface first (mock adapter for fixtures, real adapter as a thin plug-in). The key becomes a one-run verification step, never a schedule risk.

Claim-vs-built audit (pre-build checklist): every claim in the pitch and spec must name the phase or prompt that builds it. A claim with no builder gets reworded to what is actually built, or cut. Re-run this audit after every spec edit — scope edits silently orphan claims.

### 7. Pre-register (before building)
Write down: the seam (X vs Y), the stakes claim in one sentence, the demo shape (villain scene → resolution scene), and the evidence you will show. Then add six lines:
- **Metrics, declared first:** the north star (the single rate or count the product's job is measured by) plus a counter metric that punishes the degenerate strategy for maximizing the north star. The two must be in direct tension — together they pin exactly one behavior. Demo readouts are the count versions of both.
- **Red proofs:** pre-register the adversarial proofs that gate each build phase — each must pass before the build advances. A proof never mutates the artifact under test (temp-copy discipline: copy, tamper the copy, verify, delete). A demo that cannot be re-run deterministically is not evidence.
- **Claim calibration:** label each stakes claim as documentary (a docs quote — evidence of a missing mechanism) or empirical (a real incident — evidence something actually broke). Never present documentary evidence as empirical unsafety.
- **Product scope, honestly:** state what the product does not change. (An app-level gate does not change the platform.)
- **Strongest objection, pre-answered:** write the best "why not just use existing X?" objection and its one-paragraph answer. The answer is usually a layer difference (e.g. spec-generation time vs merge time).
- **Incident analogue (optional):** one real incident as the stakes story, with a written claim boundary — what it proves and what it does not. The incident must be in the judges' living memory — post-2015, ideally AI-native; an older incident costs the demo its stakes. Prefer contemporaneous sources; verify citation URLs before publishing.
This is what makes the method testable — see Evaluation.

## Demo shape
Villain → resolution. Open with the failure happening (the double charge, the leaked secret). Close with it made impossible. Before/after. Never open with architecture.
The mechanism stays serious; the demo is theatrical. Name the beats in the pre-registration: the villain reveal (the contradiction on screen), the refusal moment (the full-screen refusal), the one-liner (the opening sentence), and the receipt (the auditable artifact the judge inspects).
Presentation polish — beats tables, launch post, verified news/incident visuals, mock labeling — belongs to the demo-ready stage, not this skill. This skill specifies what the demo must show; the later stage decides how to show it.

## Evidence bar (what "done" looks like)
- Deterministic tests with exact pass counts, runnable via one script.
- Red proofs: pre-registered adversarial proofs, all must pass before the build advances; each runnable via one script, and no proof mutates the artifact under test.
- Exact setup/repro commands — no "it worked on my machine."
- An auditable trail (ledger, log, replay) the judge could inspect.
- An explicit limitations section — name your own failure modes. This is a credibility multiplier, not a weakness.

## Output Contract
A ranked shortlist of ≤3 seams, each with:
- Seam statement ("platform guarantees X; applications need Y") + docs quote
- Stakes in one sentence + the case-study metric it threatens
- Published-criteria screen (step 4.5 table) + column-coverage audit (step 4.6)
- Transplanted solution (named mature-domain source) + validity check (step 5)
- Demo shape (villain scene → resolution scene)
- Evidence plan (what you will measure/show)
- Pre-registration block (seam, stakes claim, demo shape, claim calibration, product scope, strongest objection + answer, incident analogue with boundary — frozen before building)
- **Build acceptance criteria:** the load-bearing states the build must leave demoable (e.g. mode banner, refusal panel, BLOCKED → RESOLVED → SHIPPED visible in one frame). This is the handoff to the builder — the spec says what must be demoable; the builder makes it so.

## Operating Rules
1. Hunt seams, not holes. The platform's features are infrastructure to build on, not targets. If you find yourself writing "the platform is broken because," stop — reframe as "the platform guarantees X; applications need Y."
2. One-sentence stakes or drop it.
3. Transplant, don't invent.
4. The demo opens with the failure, never with architecture.
5. Evidence is part of the build, not polish at the end.
6. Pre-register before building; evaluate after (below).
7. The seam is the thesis, not a feature. If you can delete the seam from the product and the demo still works, the seam is a feature — re-cut until the product IS the seam's resolution. The villain→resolution must be unproduceable without the seam.

## Evaluation (post-hackathon — testing the method)
- Did the idea pass the one-sentence stakes test with real judges? Ask; don't assume.
- Score the built project against the judging criteria (or the 15-column rubric in `references/rubric.md`); diff the pre-registered hypothesis vs the outcome.
- Post-mortem, one line per workflow step: which step picked correctly, which step failed to discriminate. Feed the misses back into this skill.

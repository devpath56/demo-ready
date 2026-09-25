# 15-Column Hackathon Rubric (evaluation instrument)

> Superseded by published judging criteria when the sponsor publishes them — see SKILL.md step 4.5. Use this rubric only when no weighted criteria exist.

Scale per column: **0** = absent, **1** = partial, **2** = demonstrated. Total /30.

| # | Column | What earns a 2 |
|---|---|---|
| 1a | Runs on the platform | The sponsor's platform is the demonstrated execution runtime |
| 1b | About the platform | The thesis is a property of the platform itself, not just deployed on it |
| 2 | Feature breadth | Multiple distinct platform features used, non-trivially |
| 3 | Non-replaceability | The mechanism depends on this platform; not portable to a generic runtime |
| 4 | Human gating and safety | Human-in-the-loop / approval where consequences warrant it |
| 5 | Determinism split | Deterministic checks separated from model judgment; "no model in the decision" where it counts |
| 6 | Evidence discipline | Claims independently sourced; limitations disclosed; no overclaiming |
| 7 | Evals and measurement | Measured results with exact counts (tests passed, false-positive rates, latency) |
| 8 | Observability | The system's behavior is inspectable (logs, traces, ledger) |
| 9 | Reproducibility | Exact setup/verify commands; a stranger can re-run the evidence |
| 10 | Working live demo | The thing runs live (existence; quality scored separately if recordings watched) |
| 11 | Useful, legible work | A judge grasps what it does and why it matters within minutes |
| 12 | Product completeness | Feels like a product, not a prototype |
| 13 | Sponsor legibility | The sponsor instantly sees why this matters to them |
| 14 | Novel insight | Non-obvious truth about the platform or problem class; 2 requires sponsor engagement or first-of-kind evidence |

## Working hypotheses (from the TrueFoundry/TrueForge hackathon, n=6, confidence ~70%)
- **Necessary conditions:** columns 5, 6, 10, 11, 13 at 2 across all winners. A project missing any of these has not been observed to place. Necessary, not sufficient — non-winners have held all five.
- **First-place differentiator:** 1b=2 and 14=2 together isolated 1st place cleanly in the sample.
- **Noise band:** gaps of ±2 near the cut line are within judging variance. Only large gaps are signal.
- **Known weaknesses:** column 10 scores demo existence, not demo quality, unless recordings are watched and scored. Repository-only scoring cannot see presentation/Q&A.

---
name: "build-prompt"
description: "Turn a locked spec into sequenced paste-ready prompt blocks for the builder AI: slice into phases with go-word checkpoints, declare token budgets, preserve approved stages, verify each land before advancing. Use when handing a spec to Claude Code or another builder and routing the build one prompt at a time."
---

# Build Prompt

## Purpose
Package a locked spec into the builder's next prompt — one complete, self-contained, paste-ready block at a time. You are the router between the spec and the builder (Claude Code, Isha, another AI): the builder builds; you sequence, verify, and advance. The build itself is never your work.

Scope boundary: this skill starts at a locked spec + frozen pre-registration (from `hackathon-seam-hunting` or equivalent) and ends at verified landed phases. It does not pick the idea, research the audience (`people-research`), or polish the submission (`demo-ready`).

## Workflow

### 0. Gather inputs
- Locked spec, frozen pre-registration, build acceptance criteria.
- Builder identity and channel (Claude Code paste, Isha handoff) — prompt shape follows the channel.
- Standing constraints (e.g. work from pasted content only, OAuth-only integrations, no silent decisions).
- Current build state: which phases already landed and verified. Never re-prompt a landed phase.

### 1. Slice into phases
Cut the spec into phases where each phase ends in a verifiable state plus a go-word checkpoint. A phase is the right size when it fits one prompt block, one budget envelope (~15k tokens default — raised only explicitly), and one acceptance check. Order phases so later phases never rewrite earlier ones.

### 2. Draft the prompt block — one at a time
Each block is complete and self-contained in the message; the builder never checks another file for instructions. Skeleton in `assets/prompt-block-template.md`. Every block carries:
- Phase goal in one line.
- Exact scope: files/areas to touch, plus an explicit preserve list (data model, seed data, approved stories, prior phases' behavior — the no-regeneration list).
- Build acceptance criteria: the verifiable end state, with exact commands and expected output.
- Token budget declared; stop conditions (when stuck: stop and report, don't improvise).
- Go-word checkpoint: what the builder reports back before the next prompt.

### 3. Deliver one, then wait
Send exactly one prompt block. Draft the next only after the builder's report arrives and the land is verified. Never queue prompts ahead — build reports change what comes next.

### 4. Verify the land before advancing
Check the report against the acceptance criteria: did the verifiable end state actually hold? Run the specified verification or confirm the builder's evidence. Only a verified land unlocks the next prompt.

### 5. Correct additively, never regenerate
On a failed or partial land, write the correction as an additive delta into the earliest builder-consumed stage that owns the problem. Never reopen or regenerate an approved phase or spec — regeneration burns the budget and risks losing landed fixes.

## Output Contract
Per prompt block: phase goal, scope in/out, preserve list, acceptance criteria with verification commands, token budget, stop conditions, go-word checkpoint defining the expected report-back.

## Operating Rules
1. One prompt at a time; the builder's report shapes the next block.
2. Self-contained in-message — if it matters to the paste, it's in the paste.
3. Never make silent decisions; surface choices as questions and let the user route.
4. Declare the token budget in every block; default ~15k unless explicitly raised.
5. Approved stages are never regenerated — additive corrections only.
6. No phase advances without verification against its acceptance criteria.
7. The build is the builder's work; sequencing, verifying, and routing are yours.

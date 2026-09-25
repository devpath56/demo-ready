# Worked Example: Regenerate (1st place, TrueFoundry agent-harness hackathon)

Application-layer idempotent payment ledger for AI agents. Scored 29/30 on the rubric.

- **Trust primitive (docs):** Tool approval — "pauses the agent before such a call, shows the tool name and arguments, and resumes only after the user chooses Allow or Deny." Guarantees: human vets each sensitive call. Does NOT guarantee: anything across calls.
- **Seam:** Platform guarantees vetted *calls*; applications need exactly-once *operations*. Agents re-derive plans across loop iterations, so the same payment intent can surface as multiple individually-approved calls.
- **Stakes (one sentence):** "Your agent can charge a customer twice, with every charge duly approved."
- **Transplant:** Idempotency keys from payments (Stripe-style): server-minted operation ID bound to the exact payload via SHA-256. Identical retries replay one receipt; changed payloads refused.
- **Demo shape:** Villain — the double charge happening. Resolution — the double charge made impossible.
- **Evidence:** Immutable SQLite ledger, deterministic test scenarios, real MCP/HTTP end-to-end tests, exact setup commands, explicit limitations section.
- **Why it won:** visceral stakes, villain→resolution narrative, borrowed-and-trusted solution shape, the sponsor's own approval feature as load-bearing infrastructure, ledger-grade evidence. Note: it did NOT find a hole in the platform — the approval feature works exactly as documented. The win came from the seam, not a gap.

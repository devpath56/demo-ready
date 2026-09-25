# Seed: Long Horizon Agents Hack judges — Sept 25, 2026, SF

Researched Sept 24–25, 2026. Theme: agents reliable over long tasks (mutable state, memory, persistence, deliberate discarding). Three project ideas in play: (1) Pinned Evidence Vault — content-hash-pinned web facts with drift revalidation (Nimble seam); (2) Action Ledger — write-ahead intent log + idempotency gate over agent tool calls (Tinybird/RawTree seam); (3) Generational Memory — GC-style working memory with addressable history (theme-native).

## Power map
- Best use of Nimble ($1,500 + credits; 2nd $500): **Yaniv Markovski** decides alone.
- Best use of Tinybird ($2k / $1k / $500 Amazon cards): **Enzo Kajiya + Brian Neville-O'Neill**.
- Liquid AI "1st place" (Edge AI Kit + $250): **Viviana Márquez + Tianshu Yu** (labeled "1st place," reads as best-use-of-Liquid).
- Overall placement: no published grand prize or criteria found — general panel decides.
- AWS, Black Forest Labs: no prizes listed (BFL has a judge, no prize).

## Priority order for networking
1. Yaniv Markovski — sole decider, $1.5k.
2. Enzo Kajiya + Brian Neville-O'Neill — $2k, two votes to win.
3. Viviana Márquez + Tianshu Yu — Liquid prize.
4. Mogana Kumaran S., Pedro S. Lopez, Saptarshi Banerjee — best 1-on-1 feedback (substance judges).
5. Tulika Manek, David Li, Frederic Boesel — strong but narrower lanes.
6. Amit Panda — no public material; play it straight.

## Dossiers + talk tracks

### 1. Yaniv Markovski — Head of Ecosystem Engineering @ Nimble
- Background: ex-OpenAI (Head of AI Specialist — scaled CX org through the DALL-E 2 / ChatGPT launch surge); ex-Head of DevRel at AI21 Labs. SF-based.
- Public: Sendbird fireside chat "Building an autonomous customer experience function with ChatGPT" (scaling support with generative AI).
- Builder footprint: none found (Keybase "yanivm" exists, no GitHub proof). His surface is ecosystem: Nimble ships MCP server + Agent Skills + TS SDK.
- Company line he represents: "many production AI shortcomings stem from data failures rather than model capability" — decision-grade external web data (banking/KYC, real estate).
- Trigger (inference): votes for Nimble data made load-bearing inside an agent loop — Idea 1 is his lane.
- Opener: "You scaled through the ChatGPT launch — when did you land on data failures, not model failures, as the production bottleneck?"
- Demo beat: the Nimble MCP/Agent Skills integration actually running in the first 60 seconds — not described, shown.
- Don'ts: don't describe the integration; don't make token-efficiency claims you can't measure (his company's benchmark is their claim, not yours).
- Follow-up: "What does 'best use' mean to you this year — depth of integration or breadth?"

### 2. Enzo Kajiya — Enterprise Account Executive @ Tinybird
- Background: Enterprise AE (NYC), ex-ForgeRock (named in 2021 SEC S-8). No public writing/talks; not a developer (no GitHub expected).
- Lens from role: enterprise buyer — "would my customers deploy this?" Tinybird's enterprise story is real-time analytics at scale (Canva 5× speed / 10× cost).
- Trigger (inference): the project an enterprise data team would actually buy — operational control and auditability (Idea 2).
- Opener: "What separates the Tinybird customers who deploy from the ones who stall in pilot?"
- Demo beat: lead with the deploy story — "here's how this runs in prod," real Tinybird queries visible.
- Don'ts: architecture talk without a working demo; vapor of any kind.
- Follow-up: "Which customer profile would you show this to first?"

### 3. Brian Neville-O'Neill — Head of Marketing @ Tinybird
- Background: Head of Marketing @ Tinybird; ex-Senior Director of Marketing, Product Management at LogRocket (frontend observability). Sour & SaaS podcast (2021). Writes dev.to/bnevilleoneill on CI/CD, merge queues, DORA metrics — dev-productivity lens. No GitHub found.
- Trigger (inference): the most legible, best-told demo — villain→resolution told crisply wins his vote almost regardless of idea.
- Opener: "You marketed LogRocket's 'frontend observability' — how do you position 'built for coding agents' without it sounding like hype?"
- Demo beat: the story, not the mechanism — "the agent's own report contradicted itself" (Idea 1's failure is the most narratable).
- Don'ts: burying the story in mechanism; jargon.
- Follow-up: "What's the one-liner you'd use to describe this?"

### 4. Viviana Márquez — Developer Relations @ Liquid AI
- Background: DevRel @ Liquid AI (Berkeley); previously built DevRel from scratch at Prolific — internal award for "blueprinting developer relations… every new AI meetup, hackathon, and demo." Math graduate, USF coursework in ML/RL/NLP.
- No individual talks/posts surfaced — but she runs and judges hackathons constantly.
- Company context: efficient LFMs + "Liquid Context" memory layer + Liquid Agent on Snapdragon (announced this week): "preserving relevant understanding and task state… so different agents can pick up where the user left off" — memory/context is their product thesis.
- Trigger (inference): the project a developer would love to build on — Idea 3 speaks her company's language; she rewards hackathon craft (working code, clean repo, sharp demo).
- Opener: "You see more hackathon demos than anyone — what's the best one you've seen this year, and what made it land?"
- Demo beat: working code first; if Idea 3, show it running on a small/efficient model (efficiency is Liquid's thesis).
- Don'ts: bloat; slideware.
- Follow-up: "If a developer wanted to build on Liquid's efficient models after this, where should they start?"

### 5. Tianshu Yu — Member of Technical Staff, ML Engineer @ Liquid AI
- Background: ML engineer at Liquid AI (efficient edge models, LFM2 350M–1.6B). Also listed as event speaker. No public writing/talks found. (Caution: arXiv "Liquid" multimodal paper 2412.04332 is FoundationVision, a different "Liquid" — do not conflate.)
- GitHub: ambiguous — three ML candidates, none verifiable; left unattributed.
- Trigger (inference): hard efficiency numbers — measured token/compute savings, before/after curves; unmeasured "AI magic" loses him.
- Opener: "What's the smallest model that still surprises you on agentic tasks?"
- Demo beat: the numbers up front — exact token counts, baseline vs managed, latency per step.
- Don'ts: any claim without a measurement behind it.
- Follow-up: "What would you measure that we didn't?"

### 6. Saptarshi Banerjee — Applied AI Specialist Architect @ OpenAI
- Background: ex-AWS Senior Partner Solutions Architect (GenAI/ML, serverless); now OpenAI Applied AI (turns models into production customer deployments). IEEE Senior Member (2025). Veteran hackathon judge/mentor (DeepMind- and YC-backed events; organized a $50K+ Bay Area AI hackathon himself).
- Public thesis: agentic AI needs "clear context, guardrails, and accountability" to become "a trusted part of enterprise systems today, not just a promising demo." Co-authored AWS ML Blog posts on governing generative AI in the enterprise.
- GitHub: ambiguous — three+ accounts, none verifiably him; left unattributed.
- Trigger (inference): the project with the clearest context discipline + guardrails + measured evidence — deterministic checks over vibes. Ideas 1 and 2 speak his language; Idea 3 needs airtight token-cost numbers.
- Opener: "Where do your enterprise customers actually get stuck going from agent demo to agent in production?"
- Demo beat: the guardrail firing — show the deterministic check blocking the failure, with the evidence trail.
- Don'ts: vibes-based claims; "trust us, it works."
- Follow-up: "What's the accountability gap you see most teams hand-wave?"

### 7. Pedro S. Lopez — Software Engineering @ Airbyte
- Background: github.com/pedroslopez — 58 public repos, ~2.3K followers, 306 merged PRs across 18 repos; JS/Python/TS/Kotlin. Maintains whatsapp-web.js (22.6k★); built Grouparoo (open-source customer data sync, 779★). Contributes to airbytehq/airbyte-agent-sdk — "drop-in tools that give AI agents reliable, permission-aware access to external systems"; Airbyte Agents is the "context layer for AI agents" with a Context Store that "preserves history and state."
- Repeat hackathon judge (also judged the Autonomous Agents Hackathon) — discounts hand-waving.
- Trigger (inference): the most working tool — inspectable state, history that survives, real developer experience. Idea 2 (write-ahead log + idempotency) is his home turf; he'd respect Idea 1's pinning as a data-versioning move.
- Opener: "The agent SDK's Context Store — what broke in practice that made you build history-preservation in?"
- Demo beat: working code in the first 60 seconds — the ledger blocking a duplicate, receipt shown.
- Don'ts: architecture-talk without code; slides. Vapor dies on him.
- Follow-up: "What would you steal from this for the agent SDK?"

### 8. Mogana Kumaran S. — Senior Staff Data Engineer @ Gap Inc
- Background: data-platform reliability specialist; judges other agent hackathons (e.g. Self-Evolving Agents Hack).
- Public writing (Medium @moganakumaran): "AI-Native Data Engineering: From ETL Pipelines to Agentic Pipelines" (May 2026) — agentic pipelines plus "new failure modes practitioners must plan for." Papers: "The Incident Memory Layer: An Architectural Component for Lakehouse Reliability" (2024) — persistent, queryable store of structured incident records, "the knowledge substrate for future agentic systems that operate over incident histories"; "The Reliability Gap in Modern Lakehouse Architectures: Why Your Data Platform Keeps Forgetting Its Mistakes."
- Strong opinions: canonical representations, persistent queryable memory over raw logs, measured evidence over tuning folklore, name your failure modes.
- GitHub: not found — Medium is his technical home.
- Trigger (inference): Idea 2 is his thesis in product form. Show a persistent, queryable decision store with canonical schema, measured results, and an explicit limitations section.
- Opener: "You wrote that platforms keep forgetting their mistakes — we built the memory. Where does the incident-memory-layer idea break in practice?"
- Demo beat: the canonical schema + a query over the ledger; then the limitations section, stated out loud.
- Don'ts: raw event dumps without structure; hiding failure modes.
- Follow-up: "What would you add to the schema?"

### 9. Tulika Manek — Tech Lead @ Razorpay
- Background: Razorpay (India's payments leader) tech lead. GitHub github.com/tulika66 (bio: "passionate about Distributed Systems and Database Internals") — pinned repos are student-era but show measurement discipline (plagiarism checker with TP/FP/TN/FN tracking). Razorpay engineering culture is resilience-obsessed; going AI-first with agents expected to "autonomously discover, negotiate, and complete transactions."
- No public writing/talks under her name found.
- Trigger (inference): exactly-once semantics — the double-charge is the primal fear. Idea 2 framed in payments terms (no double-send, every action receipted) is her language; she respects correctness instrumentation.
- Opener: "Razorpay's resilience culture — what's the failure mode your team fears most as agents start completing transactions?"
- Demo beat: the idempotency gate blocking a duplicate send, framed as a payment: "this is the double-charge that didn't happen."
- Don'ts: fuzzy correctness claims; unmeasured reliability talk.
- Follow-up: "What would a payments-grade version of this need?"

### 10. Amit Panda — Staff Software Engineer @ LinkedIn
- Background: Staff SWE @ LinkedIn. No verifiable public material — search conflates several Amit Pandas (Twitter PM, AWS PM, embedded hobbyist); none attributable, no public writing/talks/posts.
- Trigger (inference only): production realism — scale, reliability, cost awareness, a demo that works live.
- Approach: play it straight — legibility and working software over novelty claims. No tailored opener available; don't fake familiarity.
- Don'ts: don't pretend to know his work.

### 11. Frederic Boesel — Founding Member @ Black Forest Labs
- Background: co-founder of Black Forest Labs (FLUX image models; the latent-diffusion/Stable Diffusion team); Forbes 30 Under 30 Europe 2025; $31M+ seed led by a16z; FLUX ships in Mistral's Le Chat. No personal GitHub; footprint is research authorship (FLUX.1 Kontext paper). No public writing on agents/memory/evals.
- BFL sponsors under "frontier AI for visual intelligence." No prize attached to BFL.
- Trigger (inference): the most technically ambitious, non-obvious mechanism — novelty of insight over polish. Idea 3's GC transplant is the most "frontier-thinking" of the three.
- Opener: "FLUX made open-weight visual models frontier-class — what's the equivalent unlock you're watching for in agents?"
- Demo beat: a genuinely visual surface — the evidence graph, the ledger timeline, or memory generations rendered live. Give him something to latch onto.
- Don'ts: incremental-feature framing.
- Follow-up: "What would make this feel frontier rather than incremental to you?"

### 12. David Li — Co-founder @ Induction Labs
- Background: co-founder of Induction Labs ("imagination models" — Photon-1 learned to use a computer from 18 years of screen recordings with zero action labels; FSQ frame compression ~100× over OCR; ~30k H200 GPU-hours; beats Gemini 3.1 Flash-Lite at ~27× less pretraining compute; ex-Cohere, YC). No public personal bio/posts/talks. (Not the biotech CEO David Li of Meliora Therapeutics — do not conflate.)
- GitHub: ambiguous — many David Lis; left unattributed.
- Trigger (inference): founder lens — ambition and mechanism novelty over polish. Idea 3's GC transplant (novel mechanism + efficiency story); anything treating agent behavior traces as first-class data.
- Opener: "Photon-1 learning computer use from raw screen recordings with zero action labels — what did that teach you about what agents actually need to remember?"
- Demo beat: the novel mechanism + the efficiency curve; behavior traces as first-class data.
- Don'ts: enterprise framing; incremental features.
- Follow-up: "If you were starting from our mechanism, where would you push it?"

## Feedback tactics (any judge, 1-on-1)
Two questions extract real signal: "What's the weakest claim in this?" and "What would make this a yes for you?" Ask both, write down the answers verbatim — they're tomorrow's pitch fixes and, collected across judges, the post-hackathon evaluation input for the seam-hunting skill.

## Calibration notes
- All trigger lines are inference from role + public material, not quotes — except where quotation marks mark actual public wording.
- "Not found" entries (Amit Panda's public footprint; several GitHub profiles) are reported as-is, not filled by guessing.
- No LinkedIn logins were attempted; LinkedIn data comes from search snippets only.

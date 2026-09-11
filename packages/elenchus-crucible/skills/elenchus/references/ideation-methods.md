# Ideation Methods — Full Procedures (elenchus)

Canonical method reference. Workers execute these; the SKILL.md orchestrates.

## 1. SCAMPER (default divergence engine)

Fastest to learn solo; superior for quick individual ideation (engineering ideation trials). Copy-paste delegation pack (6 sections):

TASK: Diverge on the given pain; produce 3+ variants per SCAMPER operator (21+ seeds), each variant concrete to the pain, using the worked tech example per operator below as the seed pattern.
EXPECTED OUTCOME: `WORKER-scamper.md` with 21+ numbered seeds grouped under the 7 operator headings; CLAIM on `MESSAGES.md`; ≤1500-token return to orchestrator as a Markdown list (JSON array accepted); orchestrator distills into the EVIDENCE.md idea pool (grouped, deduplicated, source-tagged), then deletes the scratchpad (distill-then-delete).
REQUIRED TOOLS: Read (BLACKBOARD/pain statement only), Write (own WORKER-scamper.md only). No web search, no librarian, no explore tools during divergence.
MUST DO: Apply all 7 operators in order, 3+ variants each; keep the worked tech example per operator as anchor then branch outward; zero evaluation until all seven are exhausted; cap return at ≤1500 tokens.
MUST NOT DO: No scoring, ranking, or filtering during generation; MUST NOT require web corroboration during divergence (research exemption — evaluation belongs strictly to Phase 4); no touching other WORKER-*.md files; no identity drift into other workers' operators (one worker, one lens per Creative-MAD finding).
CONTEXT: BLACKBOARD path + verbatim pain statement; worker file `WORKER-scamper.md`; MESSAGES.md CLAIM slot; distill-then-delete contract.

Operator table (3+ variants each; worked tech example first):

- **Substitute:** materials, users, channels, pricing. *e.g. attendance via face-recognition → via timetable-app ping?*
- **Combine:** two pains one flow; two tools one surface. *e.g. notes + past-paper search in one query box.*
- **Adapt:** steal from another domain. *e.g. ambulance dispatch logic for hostel complaints?*
- **Modify (magnify/minimize):** 10x bigger, 10x smaller, slower, real-time. *e.g. 1-line daily digest instead of dashboard.*
- **Put to other use:** who else has this pain? *e.g. lab booking for societies too?*
- **Eliminate:** remove the app, the login, the admin. *e.g. zero-signup via existing IDs?*
- **Reverse:** invert the flow. *e.g. teachers pull doubts instead of students pushing?*

Rule: no evaluation until all seven are exhausted.

## 2. TRIZ for contradictions (technical problems)

**1. TASK:** triz-worker resolves the problem's core technical contradiction into solution variants. Spawn with this pack verbatim; atomic objective, exactly one deliverable (`WORKER-TRIZ.md`).

**2. EXPECTED OUTCOME:** `WORKER-TRIZ.md` holding 2-3 contradictions, each mapped to inventive principles with exactly one variant per principle; return contract <= 1,500 tokens; distilled into `EVIDENCE.md` (grouped, deduplicated, source-tagged), scratchpad deleted immediately after.

**3. REQUIRED TOOLS:** Worker uses no web tools. Escalation only: the full 40 inventive principles come via librarian using searxng_academic_search; arxiv-dl with pymupdf extraction to markdown only if Tier-1 proof is demanded (worker scratch only, PDFs purged after distillation).

**4. MUST DO:** (a) Extract 2-3 contradictions in "X must be A and not-A" form (e.g. verification must be thorough yet instant; cache must be fresh and never refetched; onboarding must be guided and self-serve). (b) Map each contradiction to the inventive principles below (10, one-line gloss each) and generate exactly one variant per principle. (c) Worked software example, same form: contradiction "verification must be thorough yet instant" yields Prior action variant "precompute proofs on save, serve verdicts instantly on demand" and Segmentation variant "shard checks per file, run in parallel, fail fast on first red". (d) Never assign TRIZ bare: every worker prompt carries principles + worked example in-prompt, since trials show TRIZ+SCAMPER beat brainstorming on useful ideas only when examples ride along. (e) TRIZ+LLM note: frontier models correctly report contradictions/principles in pilot studies, usable as a sparring partner, not an oracle.

**5. MUST NOT DO:** Do NOT import the full 40 principles inline (pointer to librarian instead); no evaluation during generation (that belongs strictly to Phase 4); no peer-chat; no raw dumps to the main thread.

**6. CONTEXT:** Memory root per `memory-architecture.md`; filename `WORKER-TRIZ.md`; paste in the problem statement + solved-shape metrics; blackboard invariants (`NEVER write code`, `NEVER auto-pick winner`).

Inventive principles carried in-prompt (gloss + software flavor, one line each): Segmentation, split into independent parts (shard checks per file, parallelize); Asymmetry, break symmetry (fast path for clean files, deep path for flagged ones); Merging, combine operations in time/space (verify at write-time in-editor, not at CI); Universality, one object does double duty (type-checker doubles as test oracle); Nesting, place inside another (sandbox the risky check inside the fast pipeline); Counterweight, compensate the cost (cache prior verdicts to offset deep-check cost); Prior action, do it beforehand (precompute on save, serve instantly); Dynamism, make it adaptive (escalate depth only when risk signals fire); Partial or excessive action, overshoot then trim (over-verify nightly, serve cached verdicts by day); The other way round, invert the flow (code proves itself via contracts, verifier only audits the proof).

## 3. Design heuristics + morphological (elaboration)

Design heuristics outperform solo brainstorming on elaborated/practical ideas. Procedure: pick 8–12 heuristic cards (e.g. "use packaging as functional component", "allow user to reorient", translated to software: "expose the intermediate state", "make the default reversible"), force-apply each to the problem, keep the surprises. Morphological: decompose into 3–5 sub-functions × 3+ options each, then sample combinations (cap the matrix — sample, don't exhaust).

## 4. 6-3-5 / C-Sketch (silent divergence, team or simulated)

6 participants × 3 ideas × 5-minute rounds, passing sheets each round (build on others' lines). Solo simulation: 3 hats × 3 ideas × 5 min, then cross-pollinate. C-Sketch for flow/UI-heavy problems: sketch-first, annotate after. Output target: 15+ raw seeds before any filter.

## 5. Personas, hats, extremes (anti-homogenization kit)

- **Cognitive Lens (persistent, how-not-what):** each worker holds one lens for all rounds, reinforced every round: analytical (decompose mechanisms), emotional (felt stakes), critical (failure modes), analogical (cross-domain theft), practical (workaround economics). Lenses are structural divergence devices, not evidence claims; no web research for persona generation.
- **Six Hats passes:** facts → feelings → caution → optimism → creativity → process, one pass each, separate outputs.
- **Extreme users:** lead users (workaround hackers), laggards (refuse tech), troublemaker/hostile critic (wants it to fail), regulator (wants it banned). Each generates 3+ from their stance. Never run a peacemaker-only pool.
- **subset-share (adapted subset-exchange, no 6-participant assumption):** each worker sees only a 2-worker slice of sibling outputs, never the full pool; zero peer-chat DAG (no free-form inter-worker chat).
- **Round cap:** 2 rounds max with diminishing-returns stop (stop early if round 2 adds no distinct stance).
- **Disposable-extremes rule:** label everything disposable; infeasible welcome; today's absurdity is tomorrow's wedge. If pool rhymes, add a forbidden-solution constraint ("no app, no AI, no login") and re-run.

## 6. Brainwriting + LLM eval (group or simulated)

Divergence in writing (not shouting), then score each seed on relevance / innovation / insightfulness (LLM pre-score + human re-score; novices gain most). Keep top diverse quartile, not top similar decile — diversity is the metric being protected (cf. homogenization RCTs).

## 7. Luminate-style dimensions (design-space thinking)

Enumerate response *dimensions* (users × contexts × mechanisms × business models), let the human explore/evaluate/synthesize per dimension instead of linear chat. Concretely: present the matrix, ask which cell to expand, expand only that cell. Structure beats free chat — always.

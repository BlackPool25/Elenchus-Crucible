# Tool & Orchestration Contracts (crucible)

Authoritative tool-use and multi-agent orchestration reference for technical research.

---

## 1. Delegation Prompt — 6 Sections, Every Time

Every subagent invocation must contain all six sections:
```markdown
1. TASK: Atomic objective, exactly one deliverable.
2. EXPECTED OUTCOME: Concrete success criteria (files written, schemas validated, what "done" looks like).
3. REQUIRED TOOLS: Explicit tool whitelist (read-only roles receive zero edit/write tools).
4. MUST DO: Exhaustive requirements — methodology to follow, mandatory inversion queries, token limit (<= 1,500 back).
5. MUST NOT DO: Forbidden actions — no peer conversational chatting, no main-thread raw dumps, no uncorroborated marketing claims.
6. CONTEXT: Memory root, WORKER-*.md filename, exact file paths to inspect, relevant blackboard invariants.
```
*Prompt Quality Rule:* Any delegation prompt under 6 lines is too vague; reject and rewrite before spawning.

---

## 2. Subagent Roles & Responsibilities

| Role | Operational Scope | Cost & Modality |
| :--- | :--- | :--- |
| **`explore`** | Codebase sweeps: existing helpers, patterns, prior art in repo, dependency trees. | Free-ish contextual grep; run in background. |
| **`librarian`** | External literature sweeps: official docs, standards (RFCs), academic papers, benchmark data. | Targeted search; uses `searxng` + `context7`. |
| **`prosecutor`** | Adversarial investigator: attempts to falsify proposals, hunts CVEs, memory leaks, postmortems. | Essential for standard/irreversible risk tiers. |
| **`defense`** | Architectural proposer: constructs the candidate design, utility tree, and justification. | Evaluated against prosecutor's attacks. |
| **`oracle`** | Architectural trade-off verdicts; evaluation of competing designs; post-2-failures recovery. | Read-only; expensive reasoning; never for file operations. |
| **`deep`** | Execution of hardened stress-spike harnesses and empirical microbenchmarks. | Runs in isolated sandbox with timeout bounds. |

---

## 3. Asymmetric Adversarial Pairs (Solving Multi-Agent Sycophancy)

Empirical research (KDD 2026) proves that unguided multi-agent debate causes a **modal sycophancy rate of up to 85.5%**, where agents abandon mathematically correct deductions to conform to peer errors.

### The Adversarial Protocol:
```
               ┌───────────────────────┐
               │      Orchestrator     │
               └──────────┬────────────┘
                          │ Dispatches Orthogonal Tasks
            ┌─────────────┴─────────────┐
            ▼                           ▼
 ┌───────────────────────┐   ┌───────────────────────┐
 │     Defense Agent     │   │   Prosecutor Agent    │
 │ (Builds Architecture, │   │ (Hunts Failure Modes, │
 │  Justifies Trade-offs)│   │  CVEs, Inverted Query)│
 └──────────┬────────────┘   └──────────┬────────────┘
            │                           │
            │ Returns L2 JSON (<=1.5k)  │ Returns L2 JSON (<=1.5k)
            ▼                           ▼
 ┌───────────────────────────────────────────────────┐
 │         Neutral Orchestrator / Adjudicator        │
 │ (Decides strictly on empirical traces & contracts)│
 └───────────────────────────────────────────────────┘
```

1. **Zero Peer-to-Peer Chat:** The Defense agent and Prosecutor agent never converse directly.
2. **Asymmetric Scoring:**
   - Defense is scored on architectural fitness, low complexity, and satisfying ATAM scenarios.
   - Prosecutor is scored exclusively on uncovering reproducible breaking conditions, CVEs, write stalls, race conditions, and memory leaks.
3. **Impartial Adjudication:** The Orchestrator (or Oracle) evaluates both reports against the 5-Tier Systems Evidence Hierarchy and empirical stress spikes.

---

## 4. Search Tools Execution Strategy

- **Academic Grounding:** Use `searxng_academic_search` (arXiv, Crossref, OpenAlex) for algorithmic foundations, consensus theorems, and formal verification papers.
- **Production Truth & Postmortems:** Use `searxng_web_search` and `searxng_tech_search` for incident postmortems, GitHub issues, and engineering retrospectives (always enforcing the Search Inversion Matrix).
- **Official Library & API Truth:** Use `context7_resolve-library-id` followed by `context7_query-docs`. **Library documentation via Context7 beats general web search for API contracts every time.**

---

## 5. Human Decision Gates (`question` Tool)

Engage the human via `question` only at critical forks:
1. **Type 1 Irreversible Decisions:** Architectural forks with $>2\times$ implementation effort difference or significant lock-in.
2. **Kill / Pivot Verdicts:** When a load-bearing killer assumption is refuted by a stress spike.
3. **Plan Approval Gate:** Presenting the final `PLAN.md` with PR/FAQ, RFC, and ADRs.
Batch questions in sets of 2–4 with clear recommendations and trade-off rationales.

---

## 6. Harness Translation (Codex / Antigravity Adaptation)

- `task(subagent_type=...)` $\to$ Native subagent invocation (`invoke_subagent` with `TypeName='self'`).
- `background_output` $\to$ Reactive message handling upon notification (no polling).
- `team_*` $\to$ Directed Acyclic Graph (DAG) with Asymmetric Adversarial Pairs and bounded JSON returns.
- Always enforce `fork_context: false` and self-contained 6-section prompts to prevent context inheritance bloat.

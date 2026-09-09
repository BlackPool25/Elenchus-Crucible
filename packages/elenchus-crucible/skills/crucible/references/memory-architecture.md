# Shared Memory Architecture — Canonical Contract for Prebuild Skills

**Authority rule:** This file is the single source of truth for cross-agent memory across `elenchus` and `crucible` (and their aliases). Nothing is duplicated. If this file and any SKILL.md disagree, this file wins.
**Canonical Path:** `~/.config/opencode/skills/elenchus/references/memory-architecture.md`

---

## 1. Memory Root Selection

Pick once at session start and record in the first blackboard line:

| Situation | Memory Root |
| :--- | :--- |
| Inside a git repo / project directory | `<repo>/.opencode/blackboard/<slug>/` (team-shared, committable) |
| No repo (global ideation / greenfield) | `~/.config/opencode/blackboard/<slug>/` |

`<slug>` = kebab-case topic under 50 chars (e.g. `distributed-kv-cache`).

---

## 2. Fixed File Set (Created at Init, Never Renamed)

```
<root>/
  PROTOCOL.md          ← Exact copy of §§4–9 of this file at init time (workers read this, not the skill)
  BLACKBOARD.md        ← L0 Executive State Ledger (<=75 lines): Phase, Pinned Invariants, Claims, Next Action
  MESSAGES.md          ← Append-only agent message bus (everyone appends, nobody edits/deletes)
  EVIDENCE.md          ← L1 Curated Evidence Ledger: Corroborated facts, GRADE levels, source links, falsifications
  DECISIONS.md         ← L1 ADR Ledger: Context / Options Considered / Decision / Consequences / Reversibility
  WORKER-<role>-<n>.md ← L2 Ephemeral Worker Scratchpad (owned by child worker; parent distills then DELETES)
```

---

## 3. The 3-Tier Storage Hierarchy (Solving Context Bloat & Governance Decay)

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │  TIER 0: EXECUTIVE MICRO-CONTEXT (L0)  [<= 75 lines, pinned in context]│
 │  - Root Goal & Current Phase                                           │
 │  - PINNED NEGATIVE INVARIANTS (Never do X) <-- Immune to Compaction    │
 │  - Active Epistemic Claims (Settled vs. Open)                          │
 │  - Single Next Action + Active Blockers                                │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ Distills / Updates
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │  TIER 1: DOMAIN EVIDENCE LEDGER (L1)  [EVIDENCE.md + DECISIONS.md]     │
 │  - Corroborated facts with GRADE tiers (L1–L5) and URL provenance      │
 │  - Two-Domain Independent Corroboration tokens                         │
 │  - Falsification proofs & killer assumptions ledger                    │
 │  - ADRs with Olaf Zimmermann Y-Statements                              │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ Distills <=1,500 tokens & PURGES
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │  TIER 2: EPHEMERAL WORKER SCRATCHPADS (L2)  [WORKER-*.md]              │
 │  - Raw shell traces, 50k-token web crawls, full AST grep dumps         │
 │  - Asymmetric Adversarial Pairs (Prosecutor vs. Defense)               │
 │  - STRICT RULE: Destroyed immediately after distilling to L1           │
 └────────────────────────────────────────────────────────────────────────┘
```

### Anti-Governance Decay Rule:
Standard LLM summarization suffers from **Security-Recall Divergence (SRD)**: omission instructions (*"Do NOT do X"*) decay from 73% to 33% compliance by turn 16 while active task instructions dominate.
To prevent this, `BLACKBOARD.md` contains an explicit **`## Pinned Invariants (Immune to Compaction)`** block at lines 3–15. When the orchestrator rewrites the blackboard during stage transitions, **this block must be preserved verbatim**.

---

## 4. Roles and Write Permissions

| Role | Writes | Never Writes |
| :--- | :--- | :--- |
| **Orchestrator (Main Thread)** | `BLACKBOARD.md`, `DECISIONS.md`, promoted `EVIDENCE.md`, final `PLAN.md` | Worker scratch files (`WORKER-*.md`) |
| **Worker (Explore/Librarian/Prosecutor/Defense)** | Own `WORKER-*.md` file + appends to `MESSAGES.md` | `BLACKBOARD.md`, `DECISIONS.md`, `EVIDENCE.md` directly |
| **User** | Answers, picks, approvals (relayed by orchestrator into `DECISIONS.md`) | System blackboard directly |

---

## 5. Message Bus Protocol (`MESSAGES.md`, Append-Only)

Format per block:
```markdown
## <UTC-timestamp> <sender>→<recipient|ALL> [<type>]
<body, max 15 lines>
```

Valid Types:
- `CLAIM`: Worker completed a task; contains brief summary, confidence score, and file reference in `WORKER-*.md`.
- `QUESTION`: Worker is blocked and requires orchestrator clarification.
- `CHALLENGE`: Worker (or Prosecutor) identified evidence contradicting an active claim or design choice.
- `HANDOFF`: Phase transition complete; next owner activated.

**Bus Rules:**
- Never edit or delete existing message blocks.
- Readers scan starting from their own last-read timestamp.

---

## 6. Claim-Before-Write (Race Prevention Rule)

When two workers touch the same domain territory or question:
1. Each appends `INTENT: <question-id|domain>` to `MESSAGES.md` before initiating search or crawl.
2. The earliest timestamp owns the primary sweep.
3. The second worker must pivot to an orthogonal angle (e.g., adversarial search inversion) or await results.
4. The orchestrator resolves conflicting intents in `BLACKBOARD.md`.

---

## 7. Distill-Not-Dump (Context Hygiene Rule)

1. **Strict Worker Ceiling:** A worker returns at most **1,500 tokens** to the main thread: a verdict, 3–7 bullet points with exact source URLs, evidence level, and file references.
2. **Ephemeral Purge Rule:** Raw web crawls, long terminal traces, and compiler dumps stay strictly inside `WORKER-*.md`. Once the orchestrator distills verified facts into `EVIDENCE.md`, **the worker scratch file is deleted**.
3. **Two-Domain Independent Corroboration:** Factual claims require corroboration from $\ge 2$ independent Tier-1/2 domains or sandbox execution before promotion to `EVIDENCE.md`.
4. **Stage-Boundary Compaction:** At every phase gate, the orchestrator rewrites `BLACKBOARD.md` to current truth ($\le 75$ lines) while preserving the Pinned Invariants block.

---

## 8. Epistemic Claim State Machine

Every technical claim tracked on the blackboard follows this deterministic finite state machine:

```
           ┌──────────────┐
           │ Hypothesized │
           └──────┬───────┘
                  │ Assigned to Worker / Sweep
                  ▼
        ┌───────────────────┐
        │Under_Investigation│
        └───┬─────────────┬─┘
            │             │
   Survived │             │ Falsification Criteria Met
Falsification             ▼
            │       ┌───────────┐
            │       │ Falsified │ (Retained as Negative Invariant)
            ▼       └───────────┘
     ┌──────────────┐
     │ Corroborated │ (Promoted to EVIDENCE.md with GRADE Level)
     └──────────────┘
            │
            ├─ Contradicting Evidence Found ──► ┌───────────┐
            │                                   │ Contested │ (Requires Disentanglement Spike)
            └─ Budget Exhausted ──────────────► └───────────┘
                                                │Unresolved │ (Documented in gap-map.md)
                                                └───────────┘
```

---

## 9. Executive State Ledger (`BLACKBOARD.md` Shape)

```markdown
# <slug> — Phase: <DISCOVER|FRAME|RESEARCH|ATAM|SPIKE|DECIDE|PLAN|DONE>

## Pinned Invariants (Immune to Compaction)
- NEVER: <Negative constraint 1, e.g., Never write code before plan approval>
- NEVER: <Negative constraint 2, e.g., Never accept vendor marketing as proof>
- MUST: <Core architectural invariant, e.g., Support 50k write QPS with sub-100ms p99>

## Goal (1 Line)
<Specific, measurable objective>

## Active Epistemic Claims
- [x] <Claim A> — Corroborated [Tier 1, 2 sources]
- [ ] <Claim B> — Under_Investigation (Owner: librarian-prosecutor)
- [!] <Claim C> — Falsified (Failed under 100 concurrent connections; see EVIDENCE.md)

## Blockers
- <Blocker description> — Waiting on: <Worker/User>

## Single Next Action
- <Immediate next step + assigned owner>
```

---

## 10. Verification & Recovery Protocols

- **Claim Verification:** The orchestrator verifies every worker `CLAIM`: confirms token limits were respected, checks $\ge 1$ cited source URL or execution output, and verifies that the adversarial search inversion was executed.
- **Failed Checks:** If a worker returns low-quality or confirmatory-biased text, the orchestrator issues a `RETRY:<instruction>` message on the same conversation thread.
- **Escalation Stop Rule:** After 2 failed attempts on a single research question, the orchestrator stops delegation, escalates the issue directly to the user with an explicit fork choice, or logs it in `gap-map.md`. Blind third retries are prohibited.

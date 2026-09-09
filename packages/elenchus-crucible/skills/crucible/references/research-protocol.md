# Research Protocol — Full Epistemic Method (crucible)

Lightweight Systematic Literature Review (Kitchenham) + Design Science Research (Peffers/Wieringa) adapted for engineering research.

---

## 1. The Wieringa Epistemic Gate (Disentangling Facts from Design)

Before formulating search queries or evaluating architectures, researchers must disentangle the problem into two distinct categories:

```markdown
| Design Problems ("What should we build?") | Nested Knowledge Questions ("What is true?") |
| :--- | :--- |
| Normative / Prescriptive (Goals, trade-offs) | Descriptive / Explanatory (Empirical facts, physical laws) |
| Evaluated on Utility (Better / Worse) | Evaluated on Truth (Corroborated / Refuted) |
| Governed by Engineering Design Cycle | Governed by Empirical Research Cycle |
```

**The Non-Negotiable Rule:** Zero unverified assumptions in the Knowledge Questions column can be used to justify decisions in the Design Problems column. Never vote on or debate empirical truths by committee.

---

## 2. Kitchenham-Light Systematic Search & Wohlin Snowballing

1. **PICOC Pre-Registration:**
   - **Population:** Target platform / runtime (e.g., *Distributed event broker on Kubernetes*).
   - **Intervention:** Candidate architecture/protocol (e.g., *Kafka with KRaft consensus vs. Redpanda with Raft*).
   - **Comparison:** Baseline or alternative pattern.
   - **Outcomes:** Measurable metrics (p99 latency under 20% packet drops, write amplification, memory footprint).
   - **Context:** Operational limits (e.g., *Cross-region WAN, non-Byzantine*).
2. **Conduct:** Minimum 5 academic queries + 4 tech queries. Log every query dialect and hit count in `WORKER-*.md`.
3. **Wohlin Snowballing:**
   - Seed Start Set ($S_0$) with 6–10 seminal papers/RFCs.
   - *Backward Snowballing:* Review reference lists to uncover historical design assumptions.
   - *Forward Snowballing:* Search citing literature to find modern refutations and postmortems.
   - Terminate when an iteration yields zero new qualifying sources ($\Delta S = \emptyset$).

---

## 3. Mandatory Search Inversion Matrix (Anti-SEO & Anti-Marketing Trap)

Standard search queries naturally retrieve vendor marketing pages and promotional tutorials that hide production failure modes.
**Rule:** For EVERY positive research query exploring a tool, library, or architecture, you MUST execute an adversarial inversion query pairing the subject with failure indicators:

```markdown
| Target Subject | Positive Query | Mandatory Adversarial Inversion Query |
| :--- | :--- | :--- |
| Storage Engine | `RocksDB LSM write performance` | `RocksDB (outage OR "write stall" OR "compaction debt" OR "tombstone" OR CVE)` |
| Message Broker | `Kafka throughput cluster architecture` | `Kafka ("split brain" OR "poison pill" OR "rebalance storm" OR postmortem)` |
| Consensus Tool | `Redis Redlock distributed locking` | `"Martin Kleppmann" Redlock analysis OR "Redis lock safety failure"` |
| Framework | `FastAPI high throughput production` | `FastAPI (bottleneck OR "threadpool starvation" OR "memory leak" OR postmortem)` |
```

---

## 4. The 5-Tier Systems Evidence Hierarchy (GRADE for Engineering)

Level every source from Tier 1 to Tier 5. Load-bearing architectural decisions require **Tier 1–3**:

| Tier | Source Type | Evidentiary Weight |
| :--- | :--- | :--- |
| **Tier 1** | Meta-analyses, Systematic Reviews (PRISMA/SEGRESS), standardized benchmarks (SPEC, TPC-C, MLPerf), formally verified proofs (TLA+, Coq). | **Foundational Proof.** Self-sufficient justification. |
| **Tier 2** | Peer-reviewed empirical papers with open replication artifacts, audited standards (IETF RFCs, ISO), automated SMT verification (Z3). | **High Confidence.** Requires operational context matching. |
| **Tier 3** | Longitudinal engineering retrospectives (Google, AWS, Meta), high-reliability incident postmortems (Cloudflare, Stripe). | **Context-Dependent.** High validity; check for organizational scale differences. |
| **Tier 4** | Vendor synthetic microbenchmarks, author-led proof-of-concept demos, unverified whitepapers. | **Low Confidence.** Must be treated as marketing; requires independent replication. |
| **Tier 5** | Developer Medium/Substack blogs, Reddit/HN comment consensus, uncorroborated LLM assertions. | **Banned as Proof.** Permissible only as hypothesis seeds, never as justification. |

### The Two-Domain Independent Corroboration Rule:
No technical claim can be promoted to `EVIDENCE.md` or used to justify an architectural decision without corroboration from **$\ge 2$ independent Tier-1/Tier-2 domains** or direct empirical sandbox execution.

---

## 5. Source Budgets by Risk Tier

| Risk Tier | Investigation Scope | Additional Mandate |
| :--- | :--- | :--- |
| **Low** (Reversible, localized, Type 2 door) | 1 sweep (explore + tech search), 1 inversion query. | Documented ADR. |
| **Standard** (Module boundary, new dependency) | 2 sweeps + 2 inversion queries + contradictions map. | Hardened stress spike. |
| **Irreversible** (Data loss risk, protocol change, security, Type 1 door) | Full SLR + Asymmetric Prosecutor/Defense team + ATAM review. | Pre-registered killer assumptions + FMEA scoring. |

---

## 6. Stop Conditions (Convergence, Not Exhaustion)

Close a Research Question (RQ) when:
1. Two consecutive search rounds yield zero new corroborated facts.
2. Both positive corroboration and survived adversarial search inversion are recorded.
3. The load-bearing killer assumption is formally corroborated or refuted by a hardened stress spike.
4. Source budget is spent (record as an explicit gap in `gap-map.md`, not a silent pass).

Close the research phase only when every RQ is marked settled or gapped, and `BLACKBOARD.md` compacts to $\le 75$ lines.

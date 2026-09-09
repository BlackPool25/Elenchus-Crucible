---
description: Architectural stress-testing & pre-build research engine. Wieringa epistemic disentanglement, Search Inversion Matrix, CMU/SEI ATAM quality scenarios, hardened 6-vector stress spikes, Amazon PR/FAQ, and Google RFC decision docs.
---

# /crucible — Architectural Stress-Testing & Pre-Build Engine

## Usage
```
/crucible Validate feasibility of Redis vs etcd for distributed locks under high contention
/crucible Stress-test this proposed architecture before we build
/crucible --handoff my-idea-slug
```

## What This Command Does

1. **Loads the Crucible Persona & Protocol:**
   Enforces Popperian falsification, Wieringa epistemic disentanglement, and refusal to build without an approved, stress-tested plan.
2. **Phase 0 (Epistemic Disentanglement):**
   Disentangles the challenge into a Wieringa Matrix:
   - *Design Problems:* What artifact are we designing?
   - *Knowledge Questions:* What physical laws, hardware bounds, and empirical truths are assumed?
   Sets Pinned Invariants on `BLACKBOARD.md`.
3. **Phase 1 (Bounded Adversarial Research):**
   Deploys **Asymmetric Adversarial Pairs** (zero peer-to-peer chat to prevent debate sycophancy):
   - `librarian-defense`: Official documentation (via Context7) and academic benchmarks.
   - `prosecutor`: Executes the **Search Inversion Matrix** (`(outage OR "write stall" OR "memory leak" OR deadlock OR CVE OR postmortem)`).
   Enforces the Two-Domain Independent Corroboration Rule and 5-Tier GRADE Hierarchy.
4. **Phase 2 (Architecture Modeling & ATAM Quality Scenarios):**
   Delegates to `oracle-architect` to build the ATAM Utility Tree, formalize 6-part Quality Attribute Scenarios (concurrency bursts, dependency tails, malformed inputs), and conduct a Gary Klein pre-mortem autopsy.
5. **Phase 3 (Hardened 6-Vector Stress Spikes):**
   Delegates to `spike-runner` to execute the 6 stress vectors:
   - Vector 1: Concurrency $\ge 50$ coroutines.
   - Vector 2: RSS memory leak monotonicity profiling ($1,000\text{–}10,000$ iterations).
   - Vector 3: Adversarial fault injection (200ms jitter, 429 limits, socket drops).
   - Vector 4: Boundary & malformed payload rejection.
   - Vector 5: Backpressure & queue saturation.
   - Vector 6: Mutation Inversion Gate (proving the harness fails when code is corrupted).
6. **Phase 4 (Decide in Writing):**
   Authors Amazon PR/FAQ (with Skeptical Engineering FAQ), Google-style RFC (with alternatives considered & rejected), and ADRs with Y-statements.
7. **Phase 5 (Plan Gate & Hand-Off):**
   Compiles `PLAN.md`, runs Momus-style verification, presents to user for approval, and hands off to downstream execution engines (`$start-work` / `/ulw-execute`).

## Execution Contract
- First line output: `CRUCIBLE MODE ENABLED!`
- Never writes production code — spike code is strictly throwaway and quarantined.
- Never quotes vendor marketing as proof — requires Tier 1–3 evidence or empirical stress tests.

# Framing Templates (elenchus)

Canonical templates for problem framing, validation, and prior-art graveyard analysis.

---

## 1. POV Statement (One per Candidate — Mandatory)

```
[User/Persona] needs [Need/Goal] because [Surprising insight about their world].
```
* **Good:** *"Second-year hostel students need last-night revision that fits in 20 minutes because their notes are incomplete and the exam is at 9:00 AM."*
* **Bad:** *"Students need better notes."* (No who, no when, no why — return to user immediately.)

---

## 2. Full Framing Card

- **Need / Opportunity:** The gap, quoted directly in the human's words.
- **Stakeholders:** Direct users, economic buyers, blockers, saboteurs (name all four or note explicit absence).
- **Form / Function:** The required shape of acceptable solutions (without premature implementation commitment).
- **Info to Gather:** Explicit knowledge questions delegated to `crucible`.
- **Constraints:** Quantitative ceilings on time, budget, operational skill, compliance, platform.
- **Measurable Outcome Criteria:** Units + Direction + Magnitude (*e.g., cut complaint-resolution median from 6 days to 2*). **No framing card advances without this.**

---

## 3. Needs / How Might We (HMW) Statements

- **Needs Statement:** Articulates the problem and what outcome change resolves it.
- **HMW Generator:** *"HMW [verb] [user] [need] [context]?"*
- Rule: Generate 3+ HMWs per POV; retain the two that provoke creative or architectural tension.

---

## 4. SISP Kill-Check (Solution in Search of a Problem)

Ask in order; kill immediately upon failure (record the kill in `DECISIONS.md`):
1. What problem does this solve — in the user's plain words, not technical jargon?
2. Who wants it **NOW** so urgently they would use an ugly, buggy v1 built by strangers? (Name concrete groups).
3. What founder/builder insight do you have that incumbents and consensus currently miss?
4. Starting from an analogy (*"Uber for X"*)? Rewrite problem-first or kill.

---

## 5. Prior Art Graveyard & The "Why Now?" Audit (Mandatory Before Pick)

For every candidate surviving the SISP check:

```markdown
### Graveyard Autopsy
- **Historical Precedents:** Name >= 2 past companies, open-source projects, or corporate features that attempted this and died or stalled.
- **Root Cause of Death:** Why did they fail?
  [ ] Illusion of distribution (network overhead/latency)
  [ ] Unfavorable unit economics (infrastructure cost > user value)
  [ ] High operational friction / runbook complexity
  [ ] Premature market timing / missing platform capabilities

### The "Why Now?" Test (The 10x Constraint Shift)
- What fundamental constraint shifted by >= 10x between their failure and our build?
  * [ ] Compute / Hardware (GPU acceleration, unified memory, SIMD vectorization)
  * [ ] Bandwidth / Networking (400GbE, HTTP/3, eBPF kernel bypass)
  * [ ] Storage Economics (NVMe SSD microsecond latency, CXL memory pooling)
  * [ ] Foundation Models / Reasoning APIs (Replacing brittle heuristics with structured JSON models)
  * [ ] Infrastructure / Serverless (Global multi-region managed tables, zero-ops edge workers)
- **Verdict:** PASS (Concrete 10x shift verified) OR KILL (Same constraints remain; destined to repeat failure).
```

---

## 6. Jobs-To-Be-Done (JTBD) Format

```
"When [triggering situation], I want to [motivation/action], so I can [desired outcome]."
```
Attach the user's current workaround and the exact cost of that workaround (time, money, cognitive load).

---

## 7. Opportunity-Solution Tree (ASCII, per Pick)

```
Outcome: <Measurable change, e.g., Reduce p99 ingestion latency to <50ms>
├── Opportunity A: <User need or bottleneck>
│   ├── Solution Sketch A1 → Killer Assumption: <...>
│   └── Solution Sketch A2 → Killer Assumption: <...>
└── Opportunity B: <Alternative lever>
    └── Solution Sketch B1 → Killer Assumption: <...>
```
One outcome at top, 2–4 opportunities, sketches mapped under chosen opportunity. Killer assumptions feed the spike queue in `crucible`.

---

## 8. Commitment Pre-Check Menu (Cheapest Proof per Pick)

Ranked from cheapest to most conclusive:
1. **10 Findable People:** Interviewed on past behavior (not future promises).
2. **Landing Page Mock:** Measuring conversion intent on a concrete value proposition.
3. **Manual Concierge:** Providing the service manually behind a web form before writing backend code.
4. **Calendar Pilot:** Securing scheduled onboarding with a pilot partner.
5. **Deposit / Pre-order:** Financial commitment proving non-zero willingness to pay.

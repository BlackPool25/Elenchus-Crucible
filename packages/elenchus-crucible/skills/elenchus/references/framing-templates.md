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
- **Taken-for-granted:** The belief the human treats as too obvious to state (the unknown known). Name one per card; probe it before framing.
- **System-in-action context:** Where and how the work actually happens (observed practice, not the documented process). Cite at least one observation.
- **Do-not-digitalize:** The part of the practice that must stay human/manual. Name it explicitly or write "none — all steps digitizable".
- **Stakeholder x technique coverage:** Check every cell that applies, note explicit gaps: stakeholders [users | economic buyers | blockers | saboteurs] x techniques [interview | observation | workshop | workaround-costing]. Uncovered cells are delegated to `crucible` or marked out of scope.
- **Solved-shape metrics (all four, thresholds enforced):**
  1. tacit-probe yield >= 2/interview
  2. observation-grounding >= 1/opportunity
  3. Ulwick opportunity score per opportunity (I/S 1-10, ship threshold 10)
  4. assumption coverage 100% top-3

---

## 3. Needs / How Might We (HMW) Statements

- **Needs Statement:** Articulates the problem and what outcome change resolves it.
- **HMW Generator:** *"HMW [verb] [user] [need] [context]?"*
- Rule: Generate 3+ HMWs per POV; retain the two that provoke creative or architectural tension.
- **HMW scope check:** Kill or split HMWs that fail either bound: too big for 5min (no falsifying test exists that fits a 5-minute probe) or too small for 5yr (winning it changes nothing worth keeping for 5 years).

---

## 4. SISP Kill-Check (Solution in Search of a Problem)

Ask in order; kill immediately upon failure (record the kill in `DECISIONS.md`):
1. What problem does this solve — in the user's plain words, not technical jargon?
2. Who wants it **NOW** so urgently they would use an ugly, buggy v1 built by strangers? (Name concrete groups).
3. What founder/builder insight do you have that incumbents and consensus currently miss?
4. Starting from an analogy (*"Uber for X"*)? Rewrite problem-first or kill.

**Hard kill gate:** All four questions are blocking. Any NO is a KILL, not a "revisit later". Record the kill in `DECISIONS.md` before any divergence work starts.

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

**CN-lint checklist (per need statement):** [ ] Solution-free (no implementation words) [ ] Right altitude (benefit, not attribute) [ ] Separated from opinion/target (need, not praise or goal). Fails any check: rewrite before scoring.

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

**Per-solution assumption rows (one row per sketch):** `depends-on assumptions → cheapest falsifying test → pivot/persevere bar`. Name the dependency, the single cheapest test that could kill it, and the numeric bar that decides pivot vs persevere.

---

## 8. Commitment Pre-Check Menu (Cheapest Proof per Pick)

Ranked from cheapest to most conclusive:
1. **10 Findable People:** Interviewed on past behavior (not future promises).
2. **Landing Page Mock:** Measuring conversion intent on a concrete value proposition.
3. **Manual Concierge:** Providing the service manually behind a web form before writing backend code.
4. **Calendar Pilot:** Securing scheduled onboarding with a pilot partner.
5. **Deposit / Pre-order:** Financial commitment proving non-zero willingness to pay.

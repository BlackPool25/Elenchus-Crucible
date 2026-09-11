# Carry-Through Template (T10) — ADR verbatim + RFC + PR/FAQ

Source: Crucible P4 outputs via intake-contract §3; MADR 4.0.0 (fallback: kanon-standards §ADR-RFC); Working Backwards PR/FAQ (fallback: kanon-standards §PR-FAQ). Scope ends at release narrative; no build/plan content beyond carry.

## 1. ADR verbatim block

RULE: `ADR-###` IDs preserved verbatim from Crucible. Copy bytes exactly; never rewrite.

```markdown
# ADR-001: <title>
Status: proposed | accepted | superseded by ADR-002
Date: <YYYY-MM-DD> | Deciders: <names>
Context: <verbatim>
Options: <verbatim list>
Outcome: <verbatim>
Consequences: <verbatim>
```

Status machine: `proposed` → `accepted` → `superseded by ADR-###`. Supersede-never-edit: old ADR bytes frozen; new ADR records the change.

## 2. RFC carry (alternatives preserved)

Summary: <1 para> | Motivation: <goals> | Proposal: <design>
Alternatives considered: <verbatim list from Crucible, each with pros/cons>
Risks/Open questions: <list> | Rollout: <compat steps>

## 3. PR (≤1 page)

Heading: <product — one sentence> | Subheading: <customer + benefit>
Summary: <dateline, launch date, benefits> | Problem: <customer POV>
Solution: <fix + differentiation> | Quotes: <leader + customer>
Getting started: <call to action>

## 4. FAQ (hardest questions first)

External: Q: <hardest customer/press Q> A: <answer> (repeat ≤5)
Internal: Q: <hardest stakeholder Q — economics/dependency/failure> A: <answer> (repeat)

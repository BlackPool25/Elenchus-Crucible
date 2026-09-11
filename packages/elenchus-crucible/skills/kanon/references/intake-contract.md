# Kanon Intake Contract (T6) — canonical V1 + Crucible outputs

Single-writer rule: T6 feeds intake mapping only, never T7–T10 template text. T7–T10 consume this mapping as context source only.

## 1. Pinned V1 tag bytes (verbatim)

Envelope open: `<!-- ELENCHUS_HANDOFF_PAYLOAD_V1 -->`
Envelope close: `<!-- END_ELENCHUS_HANDOFF -->`

Section headers, byte-exact as they appear in the tune plan and the live brief (`ELENCHUS_DISCOVERY.md`):

1. `## 1. Validated Problem Statement & Target Persona`
2. `## 2. Solved-Shape Metrics & Non-Functional Constraints`
3. `## 3. Killer Assumptions (To Be Spiked by Crucible)`
4. `## 4. Graveyard Autopsy (Past Failures & 10x Shift Proof)`
5. `## 5. Non-Negotiable Falsification / Kill Criteria`

Do NOT rename elenchus/crucible phases/files or the V1 tag. Live briefs vary: 3-POV variance (primary/spare/COND-PASS shapes) is flagged in mapping notes, never silently dropped.

## 2. Deterministic mapping table

| V1 section | Copy/transform rule (deterministic) | Target doc + field |
|---|---|---|
| §1 Validated Problem Statement & Target Persona | COPY persona+problem verbatim | SRS §1–2 + stakeholder register (one STK-### per named persona, numbered in order of appearance) |
| §2 Solved-Shape Metrics & Non-Functional Constraints | COPY each metric verbatim | SRS quality attributes + sprint-pack traceability (one traces-to per metric) |
| §3 Killer Assumptions (To Be Spiked by Crucible) | COPY spiked claims as verified; REWRITE unspiked as `ASSUMED: <claim>` (claim bytes preserved after prefix) | SRS Assumptions + spike backlog (one RQ + spike target per assumption) |
| §4 Graveyard Autopsy (Past Failures & 10x Shift Proof) | COPY each failure verbatim | risk register (one RSK-### per failure, cause = death mechanism: distribution/economics/friction/timing) |
| §5 Non-Negotiable Falsification / Kill Criteria | COPY each criterion verbatim | test-plan exclusions + scope boundary, labeled derived-appendix (never V1-native; label literal `derived-appendix: from V1-§5`) |

## 3. Crucible outputs mapping

- PR/FAQ → charter seeds (customer narrative + skeptical-FAQ objections seed charter scope; charter owns wording).
- RFC → SDD seeds (detailed design + Alternatives Considered seed SDD viewpoints/rationale; SDD owns wording).
- ADRs → carried verbatim with ADR-### preserved. Immutability: supersede never edit (a new ADR supersedes; old ADR bytes stay frozen).

## 4. ONE plan-approval question-gate

Single `question` call, batch of ≤3, recommended-first options, skip-to-default (no answer = proceed on all recommended defaults):

- Q1 tier: (Recommended) Full IEEE pack (SRS+SDD+charter+risk-register+test-plan) / Charter+SRS only / Plan only, no writes.
- Q2 POV subset: (Recommended) All 3 POVs, B-primary / B (log explainer) only / D (IDS triage) only / A (UPI guard) only.
- Q3 write target: (Recommended) docs/ in workspace / evidence/ staging only / no writes (plan only).

Type-1 justification (per crucible `references/tool-orchestration.md` §5): this batch IS the Plan Approval Gate (item 3); tier/subset/target are reversible defaults, not separate Type-1 irreversible or Type-2 kill/pivot gates — one batch only, never re-asked, never expanded.

Fresh-chat bypass: On V1 ingest in a fresh chat, intake bypasses re-elicitation; the approval gate is plan-approval, not re-interview. (Mirrors crucible ingestion bypass, `SKILL.md:33-44`: zero problem re-ask on `<!-- ELENCHUS_HANDOFF_PAYLOAD_V1 -->` ingest.)

## 5. UNMAPPED rule

Any input line matching no rule emits exactly:

`UNMAPPED: <input-line-id> -> <reason>`

Line IDs are `L001…` = 1-based `ELENCHUS_DISCOVERY.md` line numbers, zero-padded to 3. Closed reason vocabulary: `blank line, no semantic content` / `fence delimiter, structural not semantic` / `appendix, not part of payload` / `appendix cite, out of V1 payload scope` / `envelope verified` never UNMAPPED (envelope lines always MAPPED). Every input line is MAPPED or UNMAPPED — no silent drops.

## 6. Dry-run evidence

`evidence/kanon-dryrun-intake.log`: one line per input line of the live `ELENCHUS_DISCOVERY.md`. Reconciliation: `mapped + unmapped == input_lines` and canonical `grep -c '^MAPPED: V1-§[1-5]' == 5` (only the five section-header lines use the anchored `MAPPED: V1-§N` form; all other mapped lines use `MAPPED: Lxxx (V1-§N)` so the canonical count stays exact).

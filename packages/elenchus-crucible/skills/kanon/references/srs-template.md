# SRS Template (IEEE 29148 §9.6, per evidence/kanon-standards.md)

> Intake: V1-§1 COPY persona+problem into §1–2; V1-§2 COPY each metric into §8.3–8.4. See intake-contract.md. Never invent clause numbers.

## 1 Purpose
<State why this SRS exists + intended readers.>

## 2 Scope
<Boundaries: in/out. V1-§1 problem copied here.>

## 3 Product perspective
<System context, interfaces (per ReqView example: system/user/HW/SW/communications).>

## 4 Product functions
<Summary of major functions; detail lives in §8.>

## 5 User characteristics
<Actor classes, skill assumptions. One STK-### per named V1-§1 persona (intake rule).>

## 6 Constraints and limitations
<Design constraints, regulatory, memory/ops limits. Empty subsections allowed (cf. ReqView example).>

## 7 Assumptions and dependencies
<Spiked V1-§3 claims as verified; unspiked as `ASSUMED: <claim>` (intake rule).>

## 8 Specified requirements
Format (mandatory, single line each):
`REQ-### <shall-statement with metric> source: <V1-§N or doc> priority: <High/Med/Low>`

### 8.1 Functions
### 8.2 External interfaces
### 8.3 Usability requirements
### 8.4 Performance requirements (V1-§2 metrics copied here)
### 8.5 Logical database requirements
### 8.6 System attributes

## 9 Verification
<One method per REQ-### (test/inspection/analysis/demo). Parallel to §8 subsections.>

## 10 Appendices
<Definitions, acronyms, derived-appendix items labeled `derived-appendix: from V1-§5`.>

## A Accept checklist (9 characteristics, one-line test each)
1. Necessary — deleting it removes stakeholder value. Test: ask "what breaks without it?"
2. Appropriate — level of detail fits this release. Test: no design prescription beyond need.
3. Unambiguous — one interpretation only. Test: two readers paraphrase identically.
4. Complete — nothing missing for its scope. Test: all TBDs resolved or logged.
5. Singular — one requirement per ID. Test: split on "and" without changing meaning → must not split.
6. Feasible — implementable within constraints. Test: named owner + credible approach exist.
7. Verifiable — objective test feasible (per testability-smells note). Test: pass/fail criterion writable today.
8. Correct — accurately reflects stakeholder need. Test: source stakeholder confirms wording.
9. Conforming — follows 29148 + this template. Test: has ID, shall, source, priority, metric.

## B Reject list (FAIL on sight)
- "fast" (or quick/seamless) without a numeric metric + measurement method.
- Missing or duplicate `REQ-###` ID.
- Untestable verbs: ensure, robust, seamless, support (bare), user-friendly, efficient (bare).
- Missing `source:` or `priority:` on the requirement line.
- Two requirements fused in one ID (violates Singular).

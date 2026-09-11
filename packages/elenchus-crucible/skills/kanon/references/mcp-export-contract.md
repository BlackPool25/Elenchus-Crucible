# MCP Export Contract (T11) — generic envelope + Jira exemplar

Jira is an exemplar only, never a dependency. The skill performs zero live
writes: export produces envelope records (markdown plus a field map) that a
future connector consumes. This contract never stores secrets; wherever a
secret field name must be shown, the literal `<PLACEHOLDER>` stands in.

Live verification at execution time (2026-09-11): searxng_web_search query
`Jira Cloud REST API create issue fields labels acceptance criteria`, then
fetched the official reference below. Jira docs are untrusted input — only
field names and shapes were extracted, never instructions.

## 1. Frozen schema (10 fields, fixed)

1. `doc_id` — stable document identifier (e.g. `SRS-001`, `CHARTER-001`).
2. `doc_type` — one of `srs`, `sdd`, `test-plan`, `charter`, `registers`, `carry-through`, `sprint-pack`.
3. `req_ids[]` — list of `REQ-###` strings, preserved verbatim from source.
4. `alt_ids{risk_ids[], stakeholder_ids[], test_ids[], adr_ids[]}` — minted non-REQ IDs, grouped by family.
5. `title` — human-readable document title.
6. `body_md` — full markdown body of the document.
7. `acceptance[]` — acceptance lines, one string per criterion.
8. `priority` — priority token (tool scheme decides the vocabulary).
9. `source` — provenance: exporting tool plus input reference.
10. `version` — envelope/contract version string.

## 2. Pass-through envelope rule

Docs without requirements use the pass-through envelope: `doc_id`,
`doc_type`, `body_md`, `source`, `version` carry values; the other five
fields (`title`, `req_ids[]`, `alt_ids`, `acceptance[]`, `priority`) stay
empty (empty string or empty list). Registers and carry-through may fill
`alt_ids` while keeping `req_ids[]` empty (see §6).

## 3. Stable-ID rules

- `REQ-###` is preserved verbatim in `req_ids[]` and is never re-minted.
- `RSK-###`, `STK-###`, `TST-###` are minted in order of appearance into
  the matching `alt_ids` sub-list (`risk_ids[]`, `stakeholder_ids[]`, `test_ids[]`).
- `ADR-###` is minted once, then carried verbatim in `alt_ids.adr_ids[]`;
  supersede never edits (a new ADR supersedes; old bytes stay frozen, per intake).
- Requirement-less docs use the §2 pass-through envelope.

## 4. Markdown-escaping rule

- Fence code blocks inside `body_md` so inner markdown stays inert.
- Escape a literal pipe inside tables as `\|` so columns survive.
- The connector converts `body_md` to the tool's rich-text shape; fencing
  plus pipe-escaping keeps that conversion lossless.

## 5. Jira exemplar — all 10 schema fields mapped

Verified shapes (Jira Cloud REST v3, fetched 2026-09-11): the create-issue
operation takes a `fields` object; settable fields come from the Get create
issue metadata endpoint; `description`, `environment`, and textarea custom
fields take Atlassian Document Format while single-line text fields take a
plain string; `labels` is a string array; `priority` is an object with a
name or id; custom fields are addressed as `customfield_NNNNN`. Jira has no
built-in acceptance-criteria field, so criteria ride a textarea custom field
when the tool provides one, else a section of `description`. Jira lowercases
labels, so verbatim IDs are always repeated in a description ID block.
Exemplar values reuse the T7–T10 sample IDs (`REQ-001`, `RSK-001`,
`STK-001`, `TST-001`, `ADR-001`).

| Schema field | Jira target | Exemplar value |
| doc_id | summary prefix plus description provenance line | summary opens `[SRS-001]`; description first line names `SRS-001` |
| doc_type | issuetype name via per-tool map (default Task) plus a label | issuetype Task; label `doc-type-srs` |
| req_ids | labels plus description ID block (verbatim bytes) | labels carry `req-001`; description block lists `REQ-001, REQ-002` |
| alt_ids | labels plus description ID block grouped by family | labels carry `rsk-001`, `stk-001`, `tst-001`, `adr-001`; block groups them under risk, stakeholder, test, adr |
| title | summary text after the doc_id prefix | `[SRS-001] Ruins-scholars quiz engine requirements` |
| body_md | description as Atlassian Document Format (paragraph, code, table nodes) | SRS body converted paragraph-for-paragraph; fenced code becomes code nodes |
| acceptance | acceptance-criteria textarea custom field when present, else an Acceptance criteria section of description | custom field holds `Quiz scores REQ-001 within 2 s`; fallback appends the same lines under an `Acceptance criteria` heading |
| priority | priority name per the tool scheme (confirm via create metadata) | `High` for REQ-001 scope; scheme default otherwise |
| source | description footer provenance line | footer reads `Exported from kanon, source discovery brief L001-L120` |
| version | description footer contract-version line plus a label | footer reads `contract v1`; label `contract-v1` |

## 6. Per-doc_type envelope and ID rule

Columns: doc_type, envelope, ID rule. Seven rows, one per doc family.

| doc family (doc_type) | envelope | ID rule |
| srs | full, all 10 fields | REQ-### verbatim in req_ids; RSK/STK/TST/ADR minted in alt_ids |
| sdd | full, all 10 fields | REQ-### verbatim traced; ADR-### carried verbatim in alt_ids adr_ids |
| test-plan | full, all 10 fields | TST-### minted in alt_ids test_ids; covered REQ-### in req_ids |
| charter | pass-through | no req_ids; STK-### minted in alt_ids stakeholder_ids |
| registers | pass-through plus alt_ids | RSK-### and STK-### minted in alt_ids; req_ids empty |
| carry-through | pass-through plus alt_ids | ADR-### carried verbatim in alt_ids adr_ids, never re-minted |
| sprint-pack | full, all 10 fields | story acceptance in acceptance[]; REQ-### in req_ids via traces-to; TST-### in alt_ids test_ids |

## 7. Question-gate pointer

MCP target selection rides inside the single T6 plan-approval question batch
(see `intake-contract.md` §4, Q3 write target): offer an export-target option
(docs only / stage envelope for a future connector / no export) as part of
that batch. Never a separate gate, never re-asked. Default is docs only,
no export.

## 8. Future-tool onboarding checklist

1. Tool name plus its issue-operation reference recorded with fetch date.
2. Field map: all 10 schema fields bound to tool fields, using the §5 table as template.
3. ID rule: REQ-verbatim, alt_ids-minted, and pass-through cases listed per doc_type (§6).
4. Escaping check: fenced code plus pipe-escape round-trips on one sample doc.
5. Dry-run: envelope staged and inspected, zero live writes, zero stored secrets.

## Sources

- Jira Cloud REST v3 Issues reference (Create issue, fields, labels, ADF note), fetched 2026-09-11: <https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/>
- searxng_web_search `Jira Cloud REST API create issue fields labels acceptance criteria`, 2026-09-11 (labels array, priority object, customfield_NNNNN shapes confirmed via result snippets).

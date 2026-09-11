KANON MODE ENABLED!
# /kanon — Pre-Project + Sprint Documentation Standard

## Usage
```
/kanon ELENCHUS_DISCOVERY.md
/kanon Generate SRS + SDD + test plan from the V1 brief and Crucible RFC
/kanon Build the sprint pack with traceability to solved-shape metrics
```

## What This Command Does

1. **Loads the Kanon Persona & Protocol:**
   Enforces strict-IEEE layouts (SRS 29148, SDD 1016, test plan 829), PMBOK charter/registers, verbatim ADR carry-through, and a generic future-MCP export. Never live-writes to any MCP.
2. **Instant Ingestion of Elenchus + Crucible Results (Decoupled New Chat Mode):**
   If passed `ELENCHUS_DISCOVERY.md` or a pasted V1 brief plus Crucible PR/FAQ+RFC+ADRs:
   - Parses the 5 V1 sections + Crucible outputs byte-exact per `references/intake-contract.md`.
   - **Bypasses problem elicitation entirely** — no redundant questions; the single gate is plan-approval, not re-interview.
   - Flags any unmatched input line as `UNMAPPED: <input-line-id> -> <reason>` — never silently dropped.
3. **Generates the doc set** via bounded workers (each ≤1500 tokens): SRS, SDD, test plan, charter, registers, carry-through, sprint pack — each against its template's accept/reject bar.
4. **Exports dry-run envelopes** through the frozen 10-field MCP contract (Jira exemplar); no live writes, no credentials stored.

## Argument Contract
- First positional arg SHOULD be the intake brief path (default `ELENCHUS_DISCOVERY.md` at workspace root); raw specs without V1 get the standard intake mapping with UNMAPPED flags.
- Remaining text selects the subset (default: full 7-doc set + export envelopes).

## Execution Contract
- First line output: `KANON MODE ENABLED!`
- Strict layouts: missing mandated sections reject the doc; every REQ-### carries source + priority; every risk row carries owner + trigger.
- Runtime blacklist: no arxiv-dl/pymupdf at runtime; SearXNG fallback-only with PROVISIONAL flags.
- Never writes production code, never touches memory-architecture.md or elenchus/crucible files.

Full protocol: `~/.config/opencode/skills/kanon/SKILL.md`.

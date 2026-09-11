# Changelog

All notable changes to the **Elenchus & Crucible** suite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-09-11

### Added
- **Kanon Pre-Project + Sprint Documentation Standard (`/kanon`)**:
  - Third skill shipping alongside elenchus + crucible: turns a tightened Elenchus V1 brief plus Crucible PR/FAQ+RFC+ADRs into strict-IEEE SRS (29148), SDD (1016), test plan (829), charter + stakeholder/risk registers (PMBOK), PR/FAQ+RFC+ADR carry-through, a sprint-planning pack, and a generic future-MCP export.
  - Ships `skills/kanon/` (SKILL.md + 9 references templates) and `commands/kanon.md`, byte-identical to the reviewed kanon source; installer (`COMMANDS`/`SKILLS` lists, help, workspace modules) and test suite cover all three skills.
  - Usage: `/kanon ELENCHUS_DISCOVERY.md` in a fresh chat. Never live-writes to any MCP/Jira.

---

## [1.0.4] - 2026-09-11

### Fixed
- **`download-paper --help` no longer requires runtime deps**: `arxiv`/`pymupdf` are now lazy-loaded via `ensure_deps()` only before actual download/search work, so `--help` (and bare invocation) work offline on a fresh machine. Previously the module-level import guard exited 1 before argparse ever ran, failing the `download_paper.py --help` installer test wherever `arxiv` was not yet installed.
- **Installer header comment**: corrected stale "remote documentation lookup" wording to the local-stdio truth (`@upstash/context7-mcp`).

### Changed
- **Test suite matches installer reality**: sandbox mock `opencode.json` now seeds Context7 in the local-stdio shape the installer actually writes (`type: local`, `command: npx -y @upstash/context7-mcp`); the JSONC `//`-in-string fixture keeps its arbitrary URL with a comment documenting it asserts parser behavior, not installer shape.

---

## [1.0.3] - 2026-09-11

### Fixed
- **oh-my-openagent beta-aware ask-first install**:
  - Installer now detects an existing oh-my-openagent/omo install of ANY channel before doing anything — config plugin entries in any form (`oh-my-openagent`, `oh-my-opencode`, `oh-my-ohmy`, bare `omo`, `@beta` tags) plus the `omo` binary (`omo --version`).
  - When an install is found, the installer reports the version/channel and asks: keep existing (recommended) / reinstall stable (`oh-my-openagent@latest`) / install beta (`oh-my-openagent@beta`) / skip. Never force-installs stable over a beta.
  - Under `--yes`, an existing install is kept untouched (logged with reason); only fresh installs default to the stable channel.
- **Context7 MCP current format**: installer now writes the documented 2026 OpenCode shape — local stdio via `npx -y @upstash/context7-mcp` — instead of the stale remote `type/url` block. API key remains optional (`CONTEXT7_API_KEY` for higher limits). `--yes` mode no longer hangs on the Context7 prompt on fresh machines.

### Changed
- Synced packaged `skills/elenchus`, `skills/crucible`, and `commands/` to the reviewed 2026-09-11 live content (elenchus §§5-9 + graveyard/V1 handoff, framing-templates, ideation-methods, crucible §§4-8, stress-spike-protocol, both command mirrors).
- Package README now documents the full install flow (`--yes`/`--check`, what gets installed, omo beta handling, Context7/SearXNG/Python prereqs, `download-paper` usage).

---

## [1.0.2] - 2026-09-09

### Added
- **Decoupled Cross-Session Workflow**:
  - Standalone `ELENCHUS_DISCOVERY.md` export allowing users to complete problem discovery, close the chat, and open a brand-new chat session anytime.
  - Automatic Elenchus brief recognition in `/crucible`: immediately extracts validated problem statements, killer assumptions, and graveyard lessons.
  - Complete bypass of redundant problem-interview questions when an Elenchus brief is provided to Crucible.
- **Interactive Multiple-Choice Tooling (`ask_question`)**:
  - Embedded interactive decision modals for candidate idea selection in Elenchus.
  - Interactive architectural tradeoff forks (Option A vs Option B vs Option C) in Crucible with explicit `(Recommended)` markers.
  - Interactive plan approval gate at Phase 5 before handing off to execution.

### Changed
- Removed all legacy and short aliases (`discovering-before-building`, `planning-before-building`, `prebuild-discovery`, etc.) in favor of clean, authoritative `elenchus` and `crucible` branding.
- Added automatic purge of any stale legacy aliases in `install.js`.

---

## [1.0.0] - 2026-09-09

### Added
- **Elenchus Problem Discovery Engine (`/elenchus`)**:
  - Socratic cross-examination loop to challenge project premises and eliminate confirmation bias.
  - Inverted problem framing (5-Whys root cause, Wieringa's Knowledge Questions vs Design Problems).
  - Systematic Prior-Art & Graveyard mapping (Kitchenham-light SLR protocols, autopsy of defunct startups and libraries).
  - The "Why Now?" constraint shift test (identifying hardware, bandwidth, or algorithmic inflection points).
  - Falsification contract generator establishing non-negotiable kill criteria.
- **Crucible Architectural Stress Engine (`/crucible`)**:
  - Pre-build technical feasibility matrix scoring constraints across FATAL, HIGH, MEDIUM, and LOW risk tiers.
  - Asymmetric Adversarial Pairs (Prosecutor vs Defense subagents) breaking the 85.5% LLM sycophancy bias.
  - CMU/SEI Architecture Tradeoff Analysis Method (ATAM) quality attribute scenario formulation.
  - 6-Vector automated stress spike protocols (Boundary, Concurrency, Latency/Tail, Failure Injection, Dependency, Economic).
  - Gary Klein Pre-Mortem simulator for distributed systems and AI agent architectures.
  - Irreversible Architecture Decision Records (ADRs) with Michael Nygard Y-Statements.
- **Academic Paper Research Tooling**:
  - `download_paper.py` Python utility utilizing `arxiv` and `pymupdf` (fitz) for local paper downloading and full-text Markdown extraction.
  - Global CLI binary `download-paper` allowing instant retrieval and ingestion of arXiv preprints.
- **Multi-Agent Orchestration & Cognitive Anti-Bloat**:
  - Integration with Oh My OpenAgent (`oh-my-openagent` / oMo) for parallel subagent worker swarms.
  - 3-tier memory model (Tier 0 Executive State, Tier 1 Evidence Ledger, Tier 2 Ephemeral Worker Scratchpads).
  - File-based claim ledger with provenance tags (`[CONFIRMED]`, `[FALSIFIED]`, `[CONTESTED]`).
- **Production-Grade Installer (`bin/install.js`)**:
  - Interactive and automated (`--yes`) setup powered by `@clack/prompts`, `picocolors`, and `boxen`.
  - JSONC parser with full state-machine comment stripping (handling apostrophes, block comments, and URLs).
  - Remote script supply-chain safety confirmation modals.
  - Automatic OpenCode command installation (`/elenchus`, `/crucible`).
  - Automatic skill installation and directory symlinking (`discovering-before-building`, `planning-before-building`, `prebuild-discovery`, `prebuild-planning`).
  - Context7 MCP (remote documentation) and SearXNG MCP configuration.
  - Python toolchain auto-detection and installation (`uv pip install --system arxiv pymupdf`).
  - Comprehensive `--check` health check verifying all eight runtime components.
- **Testing & Quality Gates**:
  - Fully sandboxed integration test suite in `test/test-install.mjs` verifying CLI flags, file existence, JSONC parser robustness, syntax, and sandbox installation.

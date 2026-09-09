# Changelog

All notable changes to the **Elenchus & Crucible** suite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

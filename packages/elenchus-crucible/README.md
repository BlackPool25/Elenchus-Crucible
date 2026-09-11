# elenchus-crucible

> Pre-build discovery and architectural stress-testing engine for OpenCode and Oh My OpenAgent.

[![npm version](https://img.shields.io/npm/v/elenchus-crucible.svg)](https://www.npmjs.com/package/elenchus-crucible)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
npx elenchus-crucible
```

Or run an automated non-interactive install:

```bash
npx elenchus-crucible --yes
```

Run a health check anytime (read-only, safe):

```bash
npx elenchus-crucible --check
```

Other flags: `--help` (full install-flow overview), `--version`.

## What the Installer Does

1. Verifies OpenCode is installed (prompts to install if missing).
2. Configures **Context7 MCP** in local mode (`npx -y @upstash/context7-mcp`) for live library documentation lookups. Export `CONTEXT7_API_KEY` for higher rate limits.
3. Configures **SearXNG MCP** for academic and deep technical searches (defaults to `http://localhost:8080`; you can enter your own URL when prompted).
4. Ensures **oh-my-openagent** is registered for Sisyphus multi-agent orchestration — **ask-first**: if any existing install is detected (stable or beta plugin entry, or the `omo` binary), the installer reports the version/channel found and asks whether to keep it, reinstall stable (`oh-my-openagent@latest`), install beta (`oh-my-openagent@beta`), or skip. It never overwrites a beta install with stable. Under `--yes`, an existing install is kept untouched; only fresh installs default to stable.
5. Verifies Python 3 research tools (`arxiv`, `pymupdf` for paper extraction).
6. Copies commands to `~/.config/opencode/command/` (`/elenchus`, `/crucible`).
7. Installs skills and references to `~/.config/opencode/skills/`.
8. Configures your default research workspace directory.

## Commands Added to OpenCode

- `/elenchus <idea>` — Socratic problem space discovery, idea refutation, and graveyard analysis.
- `/crucible <spec>` — Architectural stress testing, ATAM quality scenarios, and 6-vector stress spikes.


## Decoupled Cross-Session Workflow

You can run `/elenchus` in one chat session, export `ELENCHUS_DISCOVERY.md`, and open a **fresh chat session** with:

```text
/crucible ELENCHUS_DISCOVERY.md
```

Crucible automatically ingests the validated problem, killer assumptions, and graveyard lessons, skipping redundant questions.

## Prerequisites

- **Node.js >= 18**
- **OpenCode** — auto-installed by the installer if missing
- **oh-my-openagent** (stable or beta) — auto-installed if missing; existing installs are respected, never overwritten
- **Python 3 with arXiv & PyMuPDF** — verified during setup (`uv pip install arxiv pymupdf`)

## Academic Paper Downloader

```bash
# Download and convert an arXiv paper to Markdown
download-paper 2307.03172

# Search arXiv directly
download-paper --search "systematic literature review software"
```

Requires Python 3 with the `arxiv` and `pymupdf` packages (see Prerequisites).

## Documentation

Full documentation, architecture guides, and methodology are available at:
[https://github.com/BlackPool25/Elenchus-Crucible](https://github.com/BlackPool25/Elenchus-Crucible)

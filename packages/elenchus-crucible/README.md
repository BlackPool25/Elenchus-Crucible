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

Run a health check anytime:

```bash
npx elenchus-crucible --check
```

## Commands Added to OpenCode

- `/elenchus <idea>` — Socratic problem space discovery, idea refutation, and graveyard analysis.
- `/crucible <spec>` — Architectural stress testing, ATAM quality scenarios, and 6-vector stress spikes.

## Academic Paper Downloader

```bash
# Download and convert an arXiv paper to Markdown
download-paper 2307.03172

# Search arXiv directly
download-paper --search "systematic literature review software"
```

## Documentation

Full documentation, architecture guides, and methodology are available at:
[https://github.com/BlackPool25/Elenchus-Crucible](https://github.com/BlackPool25/Elenchus-Crucible)

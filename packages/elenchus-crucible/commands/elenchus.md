---
description: Socratic discovery & idea refutation engine. Elicits lived pain, runs parallel ideation divergence (SCAMPER/TRIZ/personas), frames measurable outcomes, and conducts prior-art graveyard analysis before code is written.
---

# /elenchus — Socratic Problem & Idea Refutation

## Usage
```
/elenchus I have an idea for an offline-first sync engine
/elenchus What should I build for backend engineers debugging distributed systems?
/elenchus --resume my-idea-slug
```

## What This Command Does

1. **Loads the Elenchus Persona & Protocol:**
   Enforces Socratic problem elicitation, SISP kill-checks (Solution in Search of a Problem), and refusal to write code or jump into specs prematurely.
2. **Initializes Shared Memory Architecture:**
   Creates the 3-tier memory root at `<repo>/.opencode/blackboard/<slug>/` (or `~/.config/opencode/blackboard/<slug>/`), setting `BLACKBOARD.md` with Pinned Invariants immune to compaction.
3. **Phase 1 (Ask):**
   Interviews the human across five critical territories: Lived Pain, Who Else, Workarounds, Now-ness, and Solved-Shape (measurable outcome metrics).
4. **Phase 2 (Diverge Swarm):**
   Spawns parallel background subagents:
   - `scamper-worker` (all 7 operators)
   - `triz-worker` (contradiction resolution)
   - `persona-worker` (anti-homogenization & hostile critic)
   - `substitutes-worker` (JTBD & workaround costs)
   Distills $\le 1,500$ tokens per worker into `EVIDENCE.md` and purges raw scratchpads.
5. **Phase 3 (Frame):**
   Generates POV statements, full framing cards, and opportunity-solution trees.
6. **Phase 3.5 (Graveyard Autopsy & "Why Now?" Test):**
   Delegates to `graveyard-worker` to research $\ge 2$ dead startups or abandoned OSS repos in the space, demanding proof of a $10\times$ shift in underlying constraints before approving an idea.
7. **Phase 4 (Converge):**
   Presents a ranked shortlist of 2–3 vetted ideas with commitment pre-checks and hands off to `/crucible`.

## Execution Contract
- First line output: `ELENCHUS MODE ENABLED!`
- Never selects the winner by fiat — the human owns the pick.
- Never writes specs, RFCs, or code — execution hands off to `/crucible`.

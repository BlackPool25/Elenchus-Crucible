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
   Interviews the human across five critical territories: Lived Pain, Who Else, Workarounds, Now-ness, and Solved-Shape (measurable outcome metrics). Gates (see SKILL.md §5, pointer only): coverage checklist (all five before framing), POV gate (who + when + why, bad input returned with missing slots), solved-shape enforcer with 4 metrics (tacit-probe yield >= 2/interview, observation-grounding >= 1/opportunity, Ulwick opportunity score ship threshold 10, assumption coverage 100% top-3), ground-truth exemption (lived-pain testimony exempt from inversion/Tier/2-domain rules).
4. **Phase 2 (Diverge Swarm):**
   Spawns parallel background subagents:
   - `scamper-worker` (all 7 operators)
   - `triz-worker` (contradiction resolution)
   - `persona-worker` (Cognitive Lens + troublemaker/hostile-critic + regulator + lead/laggard extremes, subset-share 2-worker slice, zero peer-chat DAG, 2-round cap; see SKILL.md §6 item 3, pointer only)
   - `substitutes-worker` (JTBD pack + workaround costs + CN-lint + I/S 1-10 + opportunity score; 6-section pack in SKILL.md §3 Substitutes pointer, pointer only)
   Distills $\le 1,500$ tokens per worker into `EVIDENCE.md` and purges raw scratchpads. All divergence workers run from copy-paste 6-section packs (TASK / EXPECTED OUTCOME / REQUIRED TOOLS / MUST DO / MUST NOT DO / CONTEXT; see SKILL.md §§3,6 and `references/ideation-methods.md`, pointer only, never duplicated here).
5. **Phase 3 (Frame):**
   Generates POV statements, full framing cards, and opportunity-solution trees. Gates (see `references/framing-templates.md`, pointer only): taken-for-granted slot, SISP kill gate, CN-lint checklist, per-solution cheapest falsifying test rows.
6. **Phase 3.5 (Graveyard Autopsy & "Why Now?" Test):**
   Delegates to `graveyard-worker` to research $\ge 2$ dead startups or abandoned OSS repos in the space, demanding proof of a $10\times$ shift in underlying constraints before approving an idea. Gates (see SKILL.md §8 + §3 Graveyard pointer, pointer only): PICOC-light pre-reg, mandatory Search Inversion query per candidate, Tier 1-5 tags (Tier 5 banned as proof), Two-Domain corroboration, 10x curve + threshold numbers; same-constraints-remain = KILLED.
7. **Phase 4 (Converge & Interactive Handoff via `ask_question`):**
   - Presents surviving candidates with trade-offs using the interactive multiple-choice tool (`ask_question`).
   - Exports the complete, self-contained `ELENCHUS_DISCOVERY.md` dossier containing the validated problem, killer assumptions, and graveyard lessons. Handoff fields (see SKILL.md §9 step 5 `ELENCHUS_HANDOFF_PAYLOAD_V1`, pointer only): 5 sections (POV + persona + taken-for-granted; 4 solved-shape metric values + thresholds; assumption map + Riskiest Assumption Test + To Be Spiked rows; graveyard autopsy + 10x proof + Tier cites; kill criteria + RQ/spike-target rows + reuse + skipped); budgets (brief <= 250 lines, cells <= 25 words).

## Decoupled Cross-Session Transition to Crucible
You do NOT need to continue in the same chat session. When Elenchus finishes:
1. It saves `<workspace>/ELENCHUS_DISCOVERY.md`.
2. You can open a **brand new chat** anytime and run:
   ```
   /crucible ELENCHUS_DISCOVERY.md
   ```
   Crucible will immediately parse the brief, skip redundant questions, and jump straight into architectural stress testing.

## Execution Contract
- First line output: `ELENCHUS MODE ENABLED!`
- Never selects the winner by fiat — the human owns the pick via `ask_question`.
- Never writes specs, RFCs, or code — execution hands off to `/crucible`.
- Gate pointers (full text lives in SKILL.md / refs, never duplicated here): Phase 1 solved-shape 4 metrics + POV gate + coverage checklist (§5); divergence 6-section packs + CLA/troublemaker/subset-share + CN-lint (§§3,6); graveyard inversion + Tier + 2-domain + 10x proof (§§3,8); V1 handoff fields + budgets (§9).

## Joint Elenchus-Crucible Ingestion Contract (appendix)
V1 `ELENCHUS_HANDOFF_PAYLOAD_V1` section to Crucible state (see crucible SKILL.md §4 table, pointer only):

| V1 section | Crucible state | Zero-redundancy rule |
| :--- | :--- | :--- |
| 1. Validated Problem + Persona | Pinned Invariants | Pin verbatim, never re-elicit |
| 2. Solved-Shape Metrics | Invariant thresholds | Never re-negotiated |
| 3. Killer Assumptions | RQs + spike targets (one RQ each) | Never re-derived |
| 4. Graveyard Autopsy + 10x proof | Prosecutor inversion targets | Never re-asked |
| 5. Kill Criteria | RQ close bars + spike kill bars | Reused as-is |

Zero-redundancy checklist: V1 present → Crucible skips elicitation, cites mapped RQs; V1 absent (raw spec) → one Ask batch, no skip.
`ask_question` fork rules: Type 1 irreversible forks only (lock-in or >2x effort); kill/pivot verdicts only on refuted load-bearing assumption; plan approval only at gate. Batch 2-4 questions with a recommendation each.

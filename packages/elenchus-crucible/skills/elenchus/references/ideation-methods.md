# Ideation Methods — Full Procedures (elenchus)

Canonical method reference. Workers execute these; the SKILL.md orchestrates.

## 1. SCAMPER (default divergence engine)

Fastest to learn solo; superior for quick individual ideation (engineering ideation trials). Apply each operator, 3+ variants, worked tech example in every worker prompt:

- **Substitute:** materials, users, channels, pricing. *e.g. attendance via face-recognition → via timetable-app ping?*
- **Combine:** two pains one flow; two tools one surface. *e.g. notes + past-paper search in one query box.*
- **Adapt:** steal from another domain. *e.g. ambulance dispatch logic for hostel complaints?*
- **Modify (magnify/minimize):** 10x bigger, 10x smaller, slower, real-time. *e.g. 1-line daily digest instead of dashboard.*
- **Put to other use:** who else has this pain? *e.g. lab booking for societies too?*
- **Eliminate:** remove the app, the login, the admin. *e.g. zero-signup via existing IDs?*
- **Reverse:** invert the flow. *e.g. teachers pull doubts instead of students pushing?*

Rule: no evaluation until all seven are exhausted.

## 2. TRIZ for contradictions (technical problems)

1. Extract 2–3 contradictions in "X must be A and not-A" form (*e.g. verification must be thorough yet instant*).
2. Map each to inventive principles (segmentation, asymmetry, merging, universality, nesting, counterweight, prior action, etc. — worker prompt carries 10–12 with one-line glosses; full 40 via librarian if needed).
3. Generate one variant per principle. Trials: TRIZ+SCAMPER produce more *useful* ideas than brainstorming; brainstorming+TRIZ more *novel*. TRIZ needs examples in-prompt — never assign it bare.
4. TRIZ+LLM note: frontier models correctly report contradictions/principles in pilot studies — usable as a sparring partner, not an oracle.

## 3. Design heuristics + morphological (elaboration)

Design heuristics outperform solo brainstorming on elaborated/practical ideas. Procedure: pick 8–12 heuristic cards (e.g. "use packaging as functional component", "allow user to reorient", translated to software: "expose the intermediate state", "make the default reversible"), force-apply each to the problem, keep the surprises. Morphological: decompose into 3–5 sub-functions × 3+ options each, then sample combinations (cap the matrix — sample, don't exhaust).

## 4. 6-3-5 / C-Sketch (silent divergence, team or simulated)

6 participants × 3 ideas × 5-minute rounds, passing sheets each round (build on others' lines). Solo simulation: 3 hats × 3 ideas × 5 min, then cross-pollinate. C-Sketch for flow/UI-heavy problems: sketch-first, annotate after. Output target: 15+ raw seeds before any filter.

## 5. Personas, hats, extremes (anti-homogenization kit)

- **Six Hats passes:** facts → feelings → caution → optimism → creativity → process, one pass each, separate outputs.
- **Extreme users:** lead users (workaround hackers), laggards (refuse tech), hostile critic (wants it to fail), regulator (wants it banned). Each generates 3+ from their stance.
- **Disposable-extremes rule:** label everything disposable; infeasible welcome; today's absurdity is tomorrow's wedge. If pool rhymes, add a forbidden-solution constraint ("no app, no AI, no login") and re-run.

## 6. Brainwriting + LLM eval (group or simulated)

Divergence in writing (not shouting), then score each seed on relevance / innovation / insightfulness (LLM pre-score + human re-score; novices gain most). Keep top diverse quartile, not top similar decile — diversity is the metric being protected (cf. homogenization RCTs).

## 7. Luminate-style dimensions (design-space thinking)

Enumerate response *dimensions* (users × contexts × mechanisms × business models), let the human explore/evaluate/synthesize per dimension instead of linear chat. Concretely: present the matrix, ask which cell to expand, expand only that cell. Structure beats free chat — always.

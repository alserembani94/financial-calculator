# Statutory deductions research: status

Research for the year-keyed Malaysian take-home-salary calculator. It covers EPF, SOCSO, EIS, PCB/MTD and Zakat (Wilayah Persekutuan) for 2025 and 2026, plus a 2027 template, and cross-checks the old app (github.com/alserembani94/financial-view-app).

Last updated: 2026-11-06. **Research only: the owner has asked not to start building yet.** Nothing here is committed.

## Start here

1. **[v1-baseline.md](v1-baseline.md):** the first iteration: inputs, assumptions, calculation, worked figures, accuracy, and a roadmap from each later feature to its research.
2. **[owner-questions.md](owner-questions.md):** decisions made so far, the v1 decisions (none left open), and the rest grouped for later iterations.
3. **[cross-check.md](cross-check.md):** how the schemes fit together, conflicts between reports, and worked examples from gross salary to take-home pay.
4. **[formulas.md](formulas.md):** each line of the breakdown as a formula, which numbers change by year, and how each kind of policy change is handled.
5. **[config-schema.md](config-schema.md):** the proposed year-keyed config, with effective-date periods and a blank 2027 template.

## Next research (requested 2026-11-06)

**Budget 2027:** deep research on the PM's announced changes to income tax rates and to the personal (self) relief, and what they'd mean for YA2027. **Research only.** Don't change any calculation, because the budget isn't gazetted yet: v1 keeps 2027 = 2026 values (D6). Build on what's already recorded: [data/tax-ya2027-proposed.json](data/tax-ya2027-proposed.json), [data/pcb-spec-2027-template.json](data/pcb-spec-2027-template.json) and [pcb.md](pcb.md). Status: **done 2026-11-06.** Report: [reports/Malaysia Budget 2027 tax changes.md](reports/Malaysia%20Budget%202027%20tax%20changes.md), notes in `research_notes/`. Nothing is law yet: recheck for the Finance Act (likely gazetted around 31 Dec 2026) and LHDN's 2027 PCB specification (likely around 1 Jan 2027).

## Reports

| Scheme | Report | Facts confirmed | Facts disproved | Data in `data/` |
|---|---|---|---|---|
| PCB / MTD + income tax | [pcb.md](pcb.md) | 5 | 13 | `tax-ya*.json`, `pcb-*.json` |
| EPF (KWSP) | [epf.md](epf.md) | 8 | 4 | `epf-*.json`, `verify-epf.py` |
| SOCSO (Act 4 + SKBBK) | [socso.md](socso.md) | 6 | 6 | `socso-*.json` |
| EIS (Act 800) | [eis.md](eis.md) | 9 | 3 | `eis-2025.json` (also used for 2026 and the 2027 template) |
| Zakat WP (PPZ-MAIWP) | [zakat.md](zakat.md) | 10 | 2 | `zakat-wp.json` |

Each fact had three independent checks: primary source, whether it's current for each year, and recalculation. "Disproved" means at least two checks refuted it, and each report's reviser then weighed the evidence. Many are narrow corrections. Each report's "Verification log" gives every verdict and action, and its "Research status" says what remains. Each report's discrepancies section lists the bugs in the old app.

## Test results (re-run 2026-11-05)

- `bun run test` (from the repo root): the vitest suite in [tests/](../../tests/README.md) locks each part of the breakdown to this research. 168 tests passed on 2026-11-06, including 6,759 golden cases from `data/v1-baseline.py`.

- `python3 -I docs/research/data/verify-epf.py`: 30 passed, 0 failed, 0 skipped.
- PCB model `.research-cache/scripts/pcb_ref_official.py`: 17 of 17 official LHDN results to the sen, plus 60 of 60 and 50 of 50 saved results from LHDN's calculator.
- Worked examples, single, RM5,000, age 30, zakat through payroll: May 2026 RM4,305.35 and July 2026 RM4,268.20 with Kaedah 2; RM4,290.35 and RM4,253.20 with Kaedah 1.

## Known limits

- **Official calculators not run for 2025 or 2026.** LHDN's calculator only runs for 2024, so the PCB rounding order for later years is by proxy. The KWSP, PERKESO and e-PCB Plus calculators weren't run.
- **No live web search for 45 of the 180 checks** (19 EPF, 22 SOCSO, 4 PCB), because a session cap of 200 searches ran out. They used saved sources and direct page fetches, and the verification logs mark them. The 28 "still current?" checks affected were re-run with live search.
- **Facts left out of the deep pass.** Each report lists its `droppedClaims` as "not independently verified".
- **Non-resident PCB** isn't in the reference model.
- **2027 is a template.** Tax figures are Budget proposals with no Finance Bill yet, and PPZ hasn't published the 2027 nisab.

<a id="agc-listings-owner-decision-needed-d1"></a>
## AGC listings: not relied on (D1, decided 2026-11-06)

A few findings rested on saved copies of the Federal Legislation portal's (lom.agc.gov.my) P.U.(A) and P.U.(B) listings that weren't obtained through a normal page view. No contribution amount depends on them.

**The owner decided not to rely on them, and the copies were deleted on 2026-11-06.** The findings stay in `eis.md` and `socso.md`, labelled as unconfirmed until someone checks the portal by hand (manual action M7).

## Local files (not committed)

`.research-cache/` is excluded through `.git/info/exclude`, so it exists only on this machine. It holds downloaded sources by scheme, the old app clone, the PCB model and scripts, and the deep-pass working files in `deep-pass/`: briefs, per-scheme results in `slices/`, new results in `extra/`, and the partial results export `deep-pass-results-partial.json`.

## First-pass questions (superseded)

Replaced by [owner-questions.md](owner-questions.md). They stay here only because its traceability table refers to these numbers. Answer the new list, not this one.

### Cross-cutting (several agents asked)

1. **Who to support.** Assume a Malaysian citizen in the private sector, or also model PRs, foreign workers, domestic workers, government contract staff and the self-employed? This affects EPF, SOCSO and EIS. *(Asked by EIS and SOCSO.)*
2. **Age precision.** Is age in whole years enough, or should we ask for birth month? Several cut-offs (55, 57, 60) switch on a specific month, and some rules depend on the birthday month vs the month after. *(EIS, SOCSO.)*
3. **Multiple employers.** Should we support someone with more than one employer? This affects EIS, SOCSO and SKBBK (which is paid through one chosen employer only). *(EIS, SOCSO.)*

### EIS

4. Should the app ask about residency, or assume Malaysian citizen? (See Q1.)
5. Month-level birthday precision for the 57/60 cut-offs? (See Q2.)
6. Support for multiple employers? (See Q3.)

### SOCSO

7. Model foreign, domestic and government-contract workers now, or only Malaysian private-sector employees at first? (See Q1.)
8. For **June 2026**, show the amount legally due (with SKBBK), or what many payslips actually showed (SKBBK collected later as arrears)?
9. Include a **self-employed** option with the four LINDUNG Kendiri plans and the 2026 government matching (70% / 50%)?
10. Show the **future SKBBK phases** (1.00% from Jun 2028, 1.25% from Jun 2031) as a preview?

### Zakat (WP)

11. Which method should be the **default** for new users: no deductions (2.5% of gross) or with deductions?
12. **Female payers:** offer a spouse deduction, or none (PPZ's official calculator only offers a deduction for wives)?
13. **2027 before PPZ publishes nisab:** block 2027, or show the 2026 nisab marked "provisional"?
14. For take-home pay, assume zakat is paid **through payroll** (offset against PCB) or **directly to PPZ**?

### EPF

15. **Foreign-worker rounding** (2% + 2%): round each share separately (the agent's recommendation) or the combined total?
16. **Bonus vs regular wage:** can the app collect bonus separately from the regular monthly wage? Someone whose regular wage is RM5,000 or less **keeps the 13% employer rate** even when a bonus pushes that month above RM5,000, so the calculation needs the two kept apart.
17. **Age precision** for the 60 and 75 switches: whole years, or birth month? (See Q2.)
18. **Government sector:** treat pensionable staff as no EPF and contract staff as Part A, or leave government out of v1? (See Q1.)
19. **Foreign workers, Jan–Sep 2025** (before mandatory EPF): show "no EPF unless they opted in"?
20. **Basic Savings (Simpanan Asas):** two sources disagree on the phase-in figures. Show them in projections or not, until this is resolved?

### PCB / MTD

21. **SOCSO + EIS relief (RM350):** by default, assume the user has declared it on TP1 (lower monthly PCB, as some payroll software does) or not (strictly per the spec)? Agent suggests **off** for monthly PCB and **on** for the annual tax estimate.
22. **TP1 reliefs default:** "declared to employer" (lower monthly PCB) or "claimed at annual filing" (refund later)?
23. Show only the steady-state January PCB, or **simulate all 12 months** whenever a bonus or claim month is entered?
24. **Scope:** support mid-year joiners (TP3) and the special 15% tax regimes, or leave them out?
25. **YA2027:** show the Budget 2027 proposed figures by default with a warning, or fall back to YA2026 until the Finance Act passes?

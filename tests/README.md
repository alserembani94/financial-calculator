# Calculator tests

These tests lock each part of the take-home breakdown to the research in [docs/research](../docs/research), so a formula can't change without a test failing. They follow the v1 spec in [v1-baseline.md](../docs/research/v1-baseline.md) and the formulas in [formulas.md](../docs/research/formulas.md).

```
bun run test          # run once
bun run test:watch    # rerun on change
```

## What runs

There's no app calculator yet, so the tests run against a **reference implementation** in [reference/](reference/). It's a TypeScript port of the research script `docs/research/data/v1-baseline.py`, reading the same data files in `docs/research/data/`.

When the app's calculator exists, change the one export in [calculator.ts](calculator.ts) to point at it. Every test then runs against the app instead. The app's calculator must match the `Calculator` type there.

Money is whole sen throughout. `rm("4268.20")` turns ringgit into sen.

## The test files

| File | Locks |
|---|---|
| [epf.test.ts](epf.test.ts) | The Third Schedule rule (band top × rate, rounded up to the ringgit) for all 400 Part A rows and Part E; the 13% / 12% line at RM5,000; above RM20,000; the RM1,700 wage floor; ages 60 and 75 |
| [socso.test.ts](socso.test.ts) | The table's parts and rounding (nearest 5 sen, ties to even, with the known legacy bands); 2025 vs 2026 and the SKBBK opt-out; the RM6,000 ceiling; Second Category from 60 |
| [eis.test.ts](eis.test.ts) | 0.2% of the assumed wage rounded up to 5 sen for all 65 bands; the ceiling; ages 18 to 59 |
| [pcb.test.ts](pcb.test.ts) | LHDN's M, R, B table rebuilt from the tax brackets; reliefs by marital status and children; the RM400 rebate line; the whole-ringgit row rule; where PCB starts for each family type |
| [zakat.test.ts](zakat.test.ts) | Nisab and deductions by year; PPZ test vectors; where zakat starts; information only, never changing take-home; zakat above tax not recoverable |
| [breakdown.test.ts](breakdown.test.ts) | Take-home, employer cost and EPF total; 2027 = 2026 (D6); opt-out = 2025; every worked figure in v1-baseline.md; the salary-negotiation findings |
| [golden.test.ts](golden.test.ts) | 6,759 cases from the research script itself, every output to the sen |

## The golden cases

[fixtures/golden.json](fixtures/golden.json) is produced by the research script, not written by hand:

```
python3 -I tests/fixtures/generate_golden.py
```

It covers every RM100 from RM1,700 to RM30,000, plus 37 boundary salaries crossed with five ages, three years, seven family types and the SKBBK opt-out. Regenerate it only when the research changes, and review the diff before committing.

## When a policy changes

Most changes are new numbers in a data file under `docs/research/data/`, as [formulas.md §7](../docs/research/formulas.md) describes. The tests that check a table against its rule keep passing as long as the new table follows the rule. The tests with figures written out (worked examples, thresholds) will fail, which is the point: update them from the new research, and regenerate the golden file.

Budget 2027 isn't law, so nothing here uses it.

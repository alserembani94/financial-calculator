# Cross-scheme consistency check

Checked 2026-11-05. Covers `epf.md`, `socso.md`, `eis.md`, `pcb.md`, `zakat.md`, their files in `data/`, and `README.md`. Companion files: [config-schema.md](config-schema.md) and [owner-questions.md](owner-questions.md). IDs such as D3 or X1 refer to `owner-questions.md`.

This pass compared the reports and data with each other and re-ran the checks that can run offline. It did not re-read primary sources, and it did not touch the AGC portal. No report or data file was edited, so every finding below still has to be applied by whoever implements or revises those files.

## 1. Summary

**Tests.** `verify-epf.py`: 30 passed, 0 failed, 0 skipped. PCB official regression: 17 of 17 to the sen. Saved LHDN calculator results: 60 of 60 and 50 of 50. Details in §2.

**The figures agree.** All SOCSO and EIS amounts match across reports and data files at every band. EPF amounts match wherever a report uses them. The disagreements are in rules, defaults and inputs, not in table values.

**What changes a calculation**

| # | Finding | Size |
|---|---|---|
| 1 | Age switch at 60: EPF, SOCSO and EIS use different months, and one `age` input can't serve all three (§3.4) | Up to RM584.65 of one month's employee deductions at RM5,000 (EPF RM550 of it), before PCB |
| 2 | Fixed transport allowance: same statutory words, opposite defaults (§3.2) | RM62.20 a month on RM500 at RM5,000 in July 2026 (EPF RM55 of it) |
| 3 | Bonus and pay need more than one gross input, because five schemes treat them differently (§3.6) | RM1,300 vs RM1,200 employer EPF on one example; SOCSO and EIS change only if the bonus isn't annual |
| 4 | Whether SKBBK counts toward the RM350: the reports call it small, but at single RM4,029 it moves annual tax by RM400.53 (§3.5) | Usually under RM2 a year; one wage per profile at the rebate cliff |
| 5 | Employment and residency inputs: three different enums. Wrong mapping gives wrong coverage (§3.3) | Up to full EIS, SOCSO or EPF amounts for the affected group |
| 6 | "Contribution month" means different months in EPF and in SOCSO/EIS (§5, I5) | One-month error at any rate change if the label is shared |
| 7 | `Kt = table(Y1+Yt) − table(Y1)` doesn't fit EPF arrears (§3.6) | RM30 vs RM22 in the example; PCB changes only below the RM4,000 cap |
| 8 | RM10 and rounding order: `zakat.md` vs `pcb.md` (§3.1) | Up to 4 sen a month, 5 sen in a bonus month, and RM10 a month at the RM10 line |
| 9 | Zakat take-home pseudocode has no SKBBK line and rounds too early (§3.1, I6) | RM37.15 at RM5,000 if read literally |
| 10 | Zakat examples use 11% or base-salary EPF, not the recommended actual EPF (I7) | E8: RM1,546.00 vs RM1,524.00 |

## 2. Test results

Both were run on 2026-11-05 from outside `.research-cache/`, with `python3 -I`.

**`docs/research/data/verify-epf.py`**

```
python3 -I docs/research/data/verify-epf.py
30 passed, 0 failed, 0 skipped        exit status 0
```

That covers Parts A to E against the generating rule, 53 worked examples, 12 total-rounding cases, 8 i-Topup cases, 10 arrears cases, 8 age cases, the config file, KWSP's Jan 2019, Jul 2024 and Oct 2025 schedules, and the third-party workbook. It tests the labelled defaults; it can't show that the defaults are right. KWSP's calculator was not run.

**PCB regression with `.research-cache/scripts/pcb_ref_official.py`**

That file defines the model only, with no test harness, and the saved verification JSON stores outcomes, not a runnable case list. So I wrote a small throwaway runner in my scratchpad. It loads the model by path and feeds it the inputs in `pcb.md` §6.1.

| Test | Result |
|---|---|
| Official: Exhibit 5 ×4, slides p18 ×1, slides p20 ×12 | **17 of 17 to the sen** |
| Slides p18, remaining 11 months | All 70.00, total 840.00 |
| Saved calculator results, `pcb/verify/calc/results.json` | 60 of 60. 2 of the 62 entries skipped: non-resident, because the model has no non-resident path |
| Held-out calculator results, `results-heldout.json` | 50 of 50 |
| MTD 110.00, zakat 50.33 | 59.70 |
| Single 3,777, EPF 416 | raw 9.97, payable 0 |

The calculator evidence is year 2024 only. It carries to 2025 and 2026 by proxy, because Table 1 and the spec wording are unchanged. The Table 1 in the model matches `pcb-spec-2025.json` and `pcb-spec-2026.json` row for row.

**Extra cross-file checks run in this pass (all clean)**

- `socso-act4-2025.json` and `socso-act4-2026.json` phase 1: all 65 bands have the same edges, injury, invalidity and employer amounts.
- `socso-skbbk-2026.json` phase 1 equals the NEI column in `socso-act4-2026.json`, and Category 1 NEI equals Category 2 NEI at every band.
- EIS and SOCSO band edges are identical at all 65 bands.
- `pcb-verification-cases.json` `socsoEis.byWage` matches the tables, including the YA2025 and YA2026 annual totals.
- `tax-ya2025.json` and `tax-ya2026.json` have identical brackets, and their relief caps match `pcb.md` §4.4.
- `zakat-wp.json` nisab: 29,740 / 33,996 / null.

## 3. Settled and stated conflicts

### 3.1 RM10 test and rounding after zakat: `pcb.md` should win

- **`pcb.md` §3.2 step 6–7 (lines 153–155), §3.6 (lines 236–239):** test RM10 on the truncated figure before rounding, subtract zakat, then round up to 5 sen once on the final amount. 110.00 − 50.33 = 59.67 pays 59.70.
- **`zakat.md` §8.2 (lines 576–580, 585):** takes MTD already rounded up to 5 sen, tests RM10 after that, doesn't re-round, and rounds the bonus figure separately.

**Why `pcb.md` wins**

1. It rests on observed output. LHDN's calculator gave 0 for raw 9.96 and 9.97 (`r-raw996`, `t-s11-3777`) and 59.70 for `z-110-z5033`. The model built on these rules matches 110 of 110 saved results.
2. `zakat.md` calls its own no-re-round line "the proposal" and cites no source for it (line 585). Its order would pay 10.00 where the calculator pays 0.
3. It also explains a bonus-month case: 535.13 + 633.27 pays 1,168.40, where rounding each part gives 1,168.45 (`pcb.md` line 239).
4. Not re-rounding would produce deductions with odd sen, against the spec's rule that the final figure is rounded up to 5 sen.

`data/pcb-spec-2026.json` line 187 already records the `pcb.md` order. Everything else in `zakat.md` §8.2 agrees: Z takes the full zakat, net isn't floored in a bonus month, and non-residents get no offset.

**How sure:** medium-high, because the evidence is the 2024 calculator page, by proxy for 2025 and 2026. An e-PCB Plus run would settle it (M6 in `owner-questions.md`). The spec prints the RM10 thresholds and the round-up direction, not their order.

**For implementers:** the zakat module passes the actual zakat amount to the PCB module and does no rounding of MTD. Ignore `zakat.md` lines 576–580 and 585. Test vectors: raw 9.97 → 0; raw 10.00 → 10.00; 110.00 − 50.33 → 59.70; 7,777 with bonus 3,333 → 1,168.40; MTD 15, zakat 20, bonus MTD 32.55 → 27.55.

The §6 examples aren't affected, since 86.25 and 125.00 are multiples of 5 sen.

### 3.2 Fixed transport, petrol and car allowance: an inconsistency in the research, not a difference between the Acts

All three Acts use the same words:

| Act | Exclusion | Report |
|---|---|---|
| Act 452 (EPF) s.2 limb (f) | "any travelling allowance or the value of any travelling concession" | `epf.md` line 272 |
| Act 4 (SOCSO) s.2(24)(b) | Same words | `socso.md` line 174 |
| Act 800 (EIS) s.3(b) | Same words | `eis.md` line 66 |

So the opposite defaults don't come from the text. They come from different evidence, weighed differently:

| Default suggested | Evidence cited | Lines |
|---|---|---|
| EPF: counted, with override | Vendors and Donovan & Ho treat fixed sums as wages. KWSP's 2012 page and s.2(f) draw no fixed-versus-claim line | `epf.md` 21, 50, 278 |
| SOCSO: excluded, with toggle | Act wording. Against it: PERKESO booklets exclude only claims, and its Threads post of 7 Feb 2026 counts "elaun pengangkutan". Vendors split | `socso.md` 200, 990 |
| EIS: excluded, with toggle | Act wording, Circular 3/2017, and *ESIC v Texmo Industries* (India, 2021, on identical words, persuasive only). Same PERKESO post against it | `eis.md` 85, 107, 700 |

*Texmo* is cited only in `eis.md`, but it construes the phrase all three Acts share, so if it persuades on EIS it persuades on EPF and SOCSO too. Neither it nor anything else is a Malaysian ruling. EPF's definition does add "any bonus, commission or allowance", which makes allowances count by default, but the travelling exclusion is an express carve-out from that, so this doesn't separate the Acts on this item.

The data files disagree too: `epf-wage-components.json` lines 25–26 set `default: subject` for EPF, SOCSO and EIS, while `socso-config.json` line 223 recommends exclude and `eis-2025.json` line 374 says pending. One of these must change once X1 is decided.

**Money at stake, RM5,000 + RM500, July 2026, Category 1, with SKBBK**

| | Excluded | Counted | Difference |
|---|---|---|---|
| EPF employee / employer | 550 / 650 | 605 / 660 | +55 / +10 |
| SOCSO invalidity / SKBBK / employer | 24.75 / 37.15 / 86.65 | 27.25 / 40.85 / 95.35 | +2.50 / +3.70 / +8.70 |
| EIS each | 9.90 | 10.90 | +1.00 |
| **Employee total** | 621.80 | 684.00 | **+62.20** |

PCB is unchanged at this wage, because K is already at the RM4,000 cap. For PCB the allowance is income unless it's the official-duty exemption (`pcb.md` line 73). For zakat a fixed allowance is income (`zakat.md` line 57).

**This remains open (X1).** The law doesn't settle it for any of the three schemes. *Suggestion only:* one payslip item and one shared toggle, because a court would be reading the same words. See X1 for the choice of default.

### 3.3 One shared employment input

The three enums (`eis.md` lines 390–398 and 571; `socso.md` lines 277–278, 519–520 and 662; `epf.md` lines 360–361) mix two questions. Split them into **employment** and **residency**. This is a proposal; which values appear in v1 is D2.

| `employment` | Who | EPF | SOCSO | EIS | PCB K | Zakat retirement line |
|---|---|---|---|---|---|---|
| `private` | Private employee, including part-time, contract, probation, apprentice, salaried director, spouse in the business | Third Schedule | Category 1 or 2 | Table | Actual EPF | EPF share |
| `domestic` | Household worker | Only if elected | Yes | Yes, unless non-citizen | 0 unless elected | EPF share if any |
| `gov-contract` | Federal or State temporary, contract or interim | Yes, medium-high | Yes | **No** | Actual EPF | EPF share |
| `gov-permanent-epf` | Permanent on the EPF option | Yes, medium-high | **No** | No | Actual EPF | EPF share |
| `gov-permanent-pre-ptb` | Permanent on the pension track, before PTB | Yes, medium | **No** | No | Actual EPF | EPF share (inferred; no row in `zakat.md`) |
| `gov-pensionable` | Permanent after PTB | No | No | No | 0 | 0 |
| `statutory-new-scheme` | Statutory body or local authority on the Act 239 New Scheme | No (medium; EPF-option staff unclear) | No | No | 0 (medium) | 0 |
| `statutory-other` | Same bodies, not on the New Scheme, including contract and temporary | Yes | **Yes** | **No** | Actual EPF | EPF share |
| `armed-forces-police` | Armed forces, police | **Not checked** | No | Inferred no: **no row in `eis.md`** | Unverified (LTAT) | Open (ZAK14) |
| `self-employed` | Self-employed, sole proprietor, partner | Voluntary | Act 789 plan | No | No MTD | Voluntary EPF |
| `platform-gig` | Paid through a platform | Voluntary | Act 872, 1.25% per job | No | No MTD | Voluntary EPF |
| `director-fees-only` | Director paid fees only | No | 0/0 (medium) | 0/0 (medium) | Normal path, K 0 | Not addressed |

| `residency` | EPF | SOCSO | EIS |
|---|---|---|---|
| `citizen` | A then E | Local | Covered |
| `pr` | A then C | Local (opt-out assumed, I10) | Covered |
| `mykas-resident` | **Not researched** (assumed non-citizen) | Local (assumed) | Covered |
| `non-citizen` | F from Oct 2025 wages. Earlier: B/D if elected, otherwise none. Pre-1998 electors: A/C | Foreign: NEI mandatory, different age-55 test | Excluded |

Separate modifier inputs: `epfElectionBefore1998`, `domesticEmployerCloseRelative`, `foreignEmployerOfForeignDomestic`, `noValidPass`, `retireeOptOut`. Tax residence is its own input, because status follows physical presence, not citizenship (`pcb.md` line 67). Worked mappings from each old enum are in `config-schema.md` §7.

### 3.4 Age 60: which month each scheme switches

These are separate rules under separate Acts, and none is a written month rule. They may really differ, so the config should keep one setting per scheme instead of forcing them together.

| Scheme | Month used | Basis | How sure | Lines |
|---|---|---|---|---|
| **EPF** rate switch at 60 | **Month after the birth month** | KWSP calculator client code `getAge`, 2022 and 2026 captures, plus two uncited blogs. Server logic unseen; could be an off-by-one | **Medium** (age 75 stop: **low**) | `epf.md` 224–227; `epf-config.json` 62–65 |
| **SOCSO** Category 2 at 60 | **Contribution month containing the 60th birthday** | Inference from s.6(7)–(8). No PERKESO statement. Vendors split: PayrollPanda and brioHR month after; Mynd and Smartouch birthday month | **Medium** | `socso.md` 108, 111; `socso-config.json` 155–156 |
| **EIS** stop at 60 | **None stated** | Event-based cut-off in s.20(2) and First Sched. para 8, monthly contributions in s.20(1), and no linking rule. brioHR stops the month after | **Low** | `eis.md` 667; `eis-2025.json` 108–109 |

**Inputs also disagree.** `epf.md` line 165 needs birth month for a wage month, and line 228 says whole-year input needs no timing logic. `socso.md` line 111 labels its input "age at the end of this month". `eis.md` line 188 uses completed years with no test date. A single `age` field gives a different answer depending on when it's read.

**Example: born 15 Jul 1966, RM5,000, July 2026, not opted out**

| Reading | EPF ee / er | SOCSO ee / er | EIS each | Employee total |
|---|---|---|---|---|
| Current labelled defaults: EPF month after, SOCSO birthday month, EIS not yet 60 | 550 / 650 | 37.15 / 61.90 | 9.90 | 597.05 |
| Current defaults, EIS stops in the birthday month | 550 / 650 | 37.15 / 61.90 | 0 | 587.15 |
| All birthday month | 0 / 200 | 37.15 / 61.90 | 0 | 37.15 |
| All month after | 550 / 650 | 61.90 / 86.65 | 9.90 | 621.80 |

SKBBK doesn't change with category. EPF also feeds K1, so PCB moves too; that isn't included above. This is D3.

### 3.5 SKBBK and the RM350 relief

**YA2026**

| | `socso.md` | `pcb.md` |
|---|---|---|
| Position | "Probably yes, from contribution month June 2026" (line 392) | "Not settled: this stays open"; "yes on the statutory text, but no authority says so" (lines 1007–1009) |
| Reasoning | Para 46(1)(n) with A1788 s.3; LHDN's 2019 CTIM reply used the same test | Same statute; also lists why it doesn't close: no LHDN, PERKESO or MOF statement |
| Confidence | Medium-high (line 729) | Medium (line 1098) |
| What it asks for | Count it, with a note (Q13, recommended) | A config flag, `statutory-reading-unconfirmed-by-LHDN`, with no recommended default |
| Data | — | `tax-ya2026.json` line 328: `open: statutory reading, unconfirmed by LHDN` |

They agree on the reading and the amounts (RM350 reached from RM2,600.01–2,700 with SKBBK, RM4,200.01–4,300 without; 60+ at RM5,000: RM260.05). They differ in label. Use one status everywhere: **statutory reading, unconfirmed by LHDN**. Whether to count it by default is X7.

**A correction to both.** `socso.md` line 392 says the difference is about RM1–4 a year, and `pcb.md` line 1014 says it matters only at lower wages. A sweep of single, Part A, whole-ringgit wages from RM1,800 to RM4,399 found the usual maximum is RM1.81. But at **RM4,029** the question crosses the rebate cliff: relief 340.20 gives annual tax 600.47, relief 350 gives 199.94, a **RM400.53** difference. That's one wage for this profile; other categories have their own (not swept). At RM5,000 it makes no difference, since SOCSO + EIS alone are 415.80.

**YA2027 (Budget 2027 proposal, no Finance Bill as of 2026-11-05)**

| | `socso.md` line 383–390 | `pcb.md` lines 543, 1016–1026 |
|---|---|---|
| RM350 | Stays; adds mandatory Kendiri (3 sectors) | Same |
| RM150 | New, for voluntary LINDUNG 24 and 17 non-mandatory Kendiri sectors | Same |
| Total RM500 | "An inference; MOF doesn't state it" | States "maximum 500" (also `tax-ya2027-proposed.json`, `maxTotalRm`) |
| Separate or pooled | Open | Open; template uses Reading A (separate), line 1026 |
| Default-in locals | "Appear to count as voluntary", not a tax ruling | Reading A assumes the same, without saying so |
| Foreign workers | Open | "On the text it stays in the RM350" |
| First-time locals after 31 Aug | Open | Bucket unclear |

The figures match (RM3,000: 397.80 vs 500). Treat everything here as `proposed`, including RM500 itself. MOF's text outranks PERKESO's release and Bernama on who gets the RM150; both reports say so.

### 3.6 Bonus and arrears

| | EPF | SOCSO | EIS | PCB | Zakat |
|---|---|---|---|---|---|
| **Annual bonus** | Counted. Aggregated with that wage month | **Excluded** s.2(24)(e) | **Excluded** s.3(e) | Yt with Kt; 5-step formula | Added to the year's income |
| **Non-annual bonus** | Counted | Counted in its own month, medium-high | Same | Yt unless paid monthly | Same |
| **Commission** | Counted. No bonus note (medium) | Counted | Counted | Y1 if monthly, otherwise Yt | Income |
| **Rate effect** | Regular wage ≤ RM5,000 keeps employer 13% on actual wages, Parts A and C only; employee table on total | None | None | One round-up on the sum | Can cross the nisab |
| **Separate payroll runs in a month** | Aggregate | Aggregate (wage periods ending in the month) | Aggregate | Same month | n/a |
| **Backdated arrears for named months** | **Month earned** (FAQ Q17, medium) | **Month earned** (medium-high) | **Month earned** (medium-high) | **Month paid**, as Yt, even from an earlier year | **Year received** |
| **Unscheduled adjustment** | Current month (FAQ Q20) | Month earned if it relates to a period | Same | Yt or Y1 by pattern | Year received |
| **Arrears before Oct 2024** | Table verified back to Jul 2022 | Warn, out of config | Warn, out of config | n/a | n/a |

Lines: `epf.md` 297–319; `socso.md` 192–196, 208–216, 318; `eis.md` 95–101, 273–280, 513; `pcb.md` 71, 239, 276–295, 403; `zakat.md` 56, 214–222.

**Example: RM5,000 + RM5,000 annual bonus, July 2026, not opted out**

| | Amount |
|---|---|
| EPF employee | 1,100 (table on 10,000) |
| EPF employer | **1,300** (13% note; the table would give 1,200) |
| SOCSO, EIS | Unchanged: 61.90 and 9.90. If the bonus isn't annual: 74.40 and 11.90 |
| PCB | Kt 550; Net 110.00 + additional 400.00 = **510.00** |
| Zakat base | Kaedah 1: 65,000. Kaedah 2: 45,850 with EPF on the bonus |

**Kt doesn't fit arrears.** `pcb.md` lines 168 and 695 and `pcb-spec-2026.json` line 182 define Kt as `table(Y1+Yt) − table(Y1)`. That's right for a bonus. Arrears on the EPF side are recalculated by month. For a rise from 4,950 to 5,050 from January, paid in March: month-earned top-up 2 × 15 = **RM30**, against table(5,250) − table(5,050) = **RM22**. Suggested wording for implementers: Kt = whatever additional employee EPF the EPF module reports for this payment. It changes PCB only while K is below the RM4,000 cap, so at Part A wages up to about RM3,020 and Part C wages up to RM6,000.

**Lumping arrears can raise or lower the amounts.** In the same example the EPF lump gives employer 1,926 vs 1,836 and employee 1,675 vs 1,683. See `eis.md` line 287 for EIS. X2 decides whether v1 offers an arrears input.

## 4. Other consistency tables

### 4.1 What counts as wages

Line references: `epf.md` 268–293 and `epf-wage-components.json`; `socso.md` 186–204; `eis.md` 90–108; `pcb.md` 401–405; `zakat.md` 54–65.

| Item | EPF | SOCSO | EIS | PCB | Zakat |
|---|---|---|---|---|---|
| Basic pay | In | In | In | Y1 | In |
| Overtime | **Out** | In | In | Y1, K unchanged | In |
| Annual bonus | In | **Out** | **Out** | Yt | In |
| Other bonus | In | In | In | Yt | In |
| Commission | In | In | In | Y1 or Yt | In |
| Service charge | **Out** | In | In | Y1 (inferred) | Not named |
| Customer tips | Out | Not addressed | Out (medium) | Y1 (medium-high; direct tips not researched) | Not named |
| Meal, housing, shift, cost-of-living allowance | In | In | In | Y1 if monthly | In |
| Fixed transport allowance | §3.2 | §3.2 | §3.2 | Income, unless official-duty exemption | In |
| Travel and expense claims | Out | Out | Out | Exempt within limits | Out |
| Employee's own EPF | Is the deduction | **Not subtracted** | **Not subtracted** | Through K | Kaedah 2 only |
| Employer's contributions | Out | Out | Out | Out | Out |
| Gratuity, retrenchment | Out | Out | Out | Taxable excess in Yt, Kt 0 | **In** |
| Pay in lieu of notice | Out | Out (medium) | Out (medium) | Yt | In (compensation) |
| Leave encashment | In | In (medium) | In (medium) | Yt with Kt | Not named; "all sources" reads as in |
| Festive bonus, once a year | In (inference) | Out (low-medium) | Out (low-medium) | Yt | In |
| Director's fee | Out | Out (medium) | Out (medium) | Y1 or Yt | Not named |
| Non-cash benefits | Out | Not addressed | Out | Y1 for MTD | Unresolved (ZAK7) |

Part-month: EPF has a minimum-wage floor. SOCSO and EIS look up the actual wage, with no floor and no pro-rating. Both are consistent with their Acts.

### 4.2 Age cut-offs

| Age | EPF | SOCSO | EIS | PCB | Zakat |
|---|---|---|---|---|---|
| Under 18 | From 14 | No limit | **Excluded** | — | No age condition |
| 55 | No rate change | Category 2 if nothing payable before 55 | — | — | — |
| 57 | — | — | Excluded if nothing payable before 57 | — | — |
| 60 | Citizen 0%/4% (E); PR 5.5% (C); Part F no split | Category 2 for everyone | **Stops for everyone** | K follows EPF | — |
| 75 | Stops, all parts | No upper limit | — | — | — |

The 55 and 57 questions are separate; don't reuse one flag (`socso.md` D2, `eis.md` D3). A SOCSO invalidity pensioner is Category 2 at any age (medium). PCB's child test is any time in the basis year; zakat publishes no test date. These aren't conflicts.

### 4.3 What PCB takes from each scheme

| Source | How it enters | Cap | Figures agree? |
|---|---|---|---|
| EPF employee share | K1, K2, Kt, automatically. From the EPF module, after the floor, never Y1 × rate | RM4,000 with voluntary EPF | Yes. 5,000 → 550 |
| SOCSO invalidity | **Not automatic.** LP1 only if declared on TP1 C14 | RM350 combined | Yes. 24.75 |
| SKBBK | Same path if counted; status open | Same, YA2026. YA2027 proposal differs | Yes. 37.15 |
| EIS | Same path | Same | Yes. 9.90 |
| Zakat | Net MTD = MTD − zakat; Z takes the full amount; annual rebate pooled under s.6A(4) | Tax charged, pooled | Yes |
| Departure levy | Same path as zakat | Pooled | n/a |

Non-residents get no relief, rebate or offset. `pcb.md` §8's RM34.65 (to May 2026) and RM71.80 (from June 2026) match the data files.

### 4.4 Effective dates

| Date | Event | Scheme | Agreement |
|---|---|---|---|
| Oct 2024 | RM6,000 ceiling | SOCSO, EIS | Same start, same bands |
| Oct 2025 wages | Part F; B and D deleted | EPF | PCB Case 7 uses it |
| Feb–Jul 2025; Aug 2025 | RM1,700 floor, small-employer split | EPF only | No effect elsewhere |
| 2026-06 | SKBBK phase 1 | SOCSO | `tax-ya2026.json` contribution sources match |
| 8 Jul; 13 Jul–31 Aug 2026 | Voluntary for locals; opt-out window | SOCSO | README and `pcb.md` agree |
| 1 Oct 2026 | Benefits for job loss from this date; no contribution change | EIS | n/a |
| 2 Jan 2027 | Vacancy notification; no payroll effect | EIS | n/a |
| Jun 2027 | RM2,000 minimum wage, **not gazetted** | EPF floor only | `eis.md` line 335 confirms the table stays |
| YA2027 | Proposed rates and D 12,000 | PCB | Not law |
| About Feb each year | Nisab published; applies to the whole year | Zakat | 2027 null |
| Jun 2028, Jun 2031 | SKBBK phases 2, 3 | SOCSO | Law |

## 5. All inconsistencies found

Type: **calc** can change a figure; **gap** means a scheme hasn't researched what another scheme's input needs; **label** is wording or status; **stale** means a note written before a sibling report was revised.

| # | Type | Finding | References | What to do |
|---|---|---|---|---|
| I1 | calc | RM10 and rounding order | `zakat.md` 576–580, 585; `pcb.md` 153–155, 236–239 | §3.1 |
| I2 | calc | Fixed transport defaults | `epf.md` 278; `epf-wage-components.json` 25–26; `socso.md` 200; `socso-config.json` 223; `eis.md` 107; `eis-2025.json` 374 | §3.2, X1 |
| I3 | calc | Age switch month and age input | `epf.md` 165, 226–228; `epf-config.json` 62; `socso.md` 108, 111; `socso-config.json` 156; `eis.md` 188, 667; `eis-2025.json` 108 | §3.4, D3 |
| I4 | calc | Employment and residency enums | `eis.md` 390–404, 571; `socso.md` 277–279, 519–521, 662; `epf.md` 360–361; `zakat.md` 353; `pcb-spec-2026.json` 337 | §3.3, D2 |
| I5 | calc | "Contribution month": EPF is wage month + 1; SOCSO and EIS treat it as the wage month | `epf.md` 7; `epf-config.json` 15; `socso.md` 124; `eis.md` 192, 269 | Use `wageMonth` everywhere in code. Keep "contribution month" as display text per scheme |
| I6 | calc | Take-home formula omits SKBBK and direct zakat varies | `zakat.md` 581, 591; `pcb.md` 975 | Use the formula in `config-schema.md` §4 |
| I7 | calc | Zakat examples use 11% or base-salary EPF while the recommendation is actual EPF including bonus. E8 1,546.00 becomes 1,524.00; B1 850.60 becomes about 850.33 | `zakat.md` 143, 403, 425, 452 | Don't use them as integration tests with the EPF module; compute separately |
| I8 | calc | Kt formula vs EPF arrears | `pcb.md` 168, 695; `pcb-spec-2026.json` 182; `epf.md` 306–307 | §3.6 |
| I9 | calc | SKBBK effect understated at the rebate cliff | `socso.md` 392; `pcb.md` 1014 | §3.5 |
| I10 | gap | PR and MyKAS opt-out and category. `socso.md` says "local" and lists PRs and temporary residents as covered, but no text says they may opt out. README and `socso.md` line 30 say "Malaysians" | `socso.md` 30, 127, 140, 279, 666; README 113 | Assumed local. Ask PERKESO (M4) |
| I11 | gap | MyKAS has no EPF rule | `eis.md` 403; `epf.md` 101–111 | Treated as non-citizen, unverified |
| I12 | gap | Armed forces and police: no row in `eis.md`, not checked in `epf.md`, unverified in `pcb.md`, open in `zakat.md` | `socso.md` 62; `epf.md` 158; `pcb.md` 460; `zakat.md` 75 | Only matters if D2 includes them |
| I13 | gap | Concurrent employers: `epf.md` has no rule, and `pcb.md` covers only previous employers (TP3) and filing | `socso.md` 317, 672; `eis.md` 48; `pcb.md` 74, 84; `zakat.md` 209 | More research needed if D7 says yes |
| I14 | gap | i-Topup routing into PCB: payroll top-up as K1 or LP1? Both share the s.49(1)(b) cap, but only K1 is automatic | `pcb.md` 144, 172; `epf.md` 194, 513 | Unresolved. Matters below the RM4,000 cap |
| I15 | gap | Which basis year for wages earned in December and paid in January, or late SKBBK | `socso.md` 729; `zakat.md` 554; `pcb.md` 90 | Assume paid in the wage month; show a note |
| I16 | label | SKBBK relief confidence, medium-high vs medium | `socso.md` 729; `pcb.md` 1098 | §3.5 |
| I17 | label | "Maximum 500" stated as fact vs "an inference" | `pcb.md` 543, 1016; `tax-ya2027-proposed.json` (`maxTotalRm`); `socso.md` 390 | Mark as proposed inference |
| I18 | label | Festive bonus for SOCSO and EIS: "unverified" in the EPF file; "exclude, low-medium" in their own reports | `epf-wage-components.json` 45; `socso.md` 195; `eis.md` 101 | Follow the scheme's own report |
| I19 | label | `zakat.md` says "new non-pensionable" government staff; `epf.md` calls that claim wrong (interim contracts) | `zakat.md` 76; `epf.md` 151 | Use `gov-contract`. No amount changes |
| I20 | label | `pcb.md` lumps "non-pensionable or contract" government staff, who differ for SOCSO | `pcb.md` 457; `pcb-spec-2026.json` 337; `socso.md` 58–59 | Use §3.3 |
| I21 | label | Five status vocabularies, three date formats, RM vs sen | Schemas in each report's §5; `socso-act4-*.json`; `eis-2025.json` | `config-schema.md` §2 |
| I22 | label | File names don't match scope: `socso-act4-2025.json` covers Oct 2024 to May 2026; `eis-2025.json` covers 2025 to the 2027 template | `socso.md` 9; `eis.md` 6 | Refer by table id |
| I23 | label | SOCSO "Category 1/2" and PCB "Category 1/2/3" share a word | `socso.md` 90; `pcb.md` 70 | `socsoCategory`, `pcbCategory` |
| I24 | stale | `epf.md` says service charge for EIS is a "practical reading"; `eis.md` now cites PERKESO's list, high | `epf.md` 293; `epf-wage-components.json` 50; `eis.md` 77, 93 | Use `eis.md` |
| I25 | stale | `socso.md` says EIS item-level confirmation is on the text only; `eis.md` traces the list through Circular 3/2017 | `socso.md` 218; `eis.md` 79 | Use `eis.md` |
| I26 | stale | `eis.md` refers to SOCSO's question as "55/60"; it's 55 | `eis.md` 576; `socso.md` 667 | Use 55 |
| I27 | stale | `epf.md` notes on `pcb.md` (60+; approximate 11%) predate its revision | `epf.md` 532; `pcb.md` 795, 929 | Already fixed in `pcb.md`, apart from the calculator-run note at `pcb.md` 888 |
| I28 | stale | `zakat.md` says `pcb.md` still needs the zakat corrections; they're in | `zakat.md` 660, 713; `pcb.md` 1145 | Ignore those lines |
| I29 | stale | `pcb.md` says Jan–Sep 2025 EPF tables are inferred; `epf.md` and the JSON now verify from July 2022 | `pcb.md` 1112; `epf.md` 537 | Use `epf.md` |
| I30 | stale | `pcb.md` expects a Part F data file; `epf.md` says none should be built, it's a percentage | `pcb.md` 855, 1112; `epf.md` 218 | Part F stays a formula |
| I31 | stale | `epf.md` says README's 31 vs 19 no-live-search counts weren't reconciled; README lines 54–56 do reconcile them: 31 before the re-run, 19 after | `epf.md` 577; README 54–56 | Not a conflict |
| I32 | stale | README still says EPF and PCB are paused, that no report is revised, and that this file doesn't exist | README 5, 14–15, 44, 46–52, 122 | Owner or next editor to update |
| I33 | stale | README's Category 2 summary omits the invalidity-pensioner limb; its Q20 says the Basic Savings sources disagree, now settled | README 111, 162; `socso.md` 98; `epf.md` 349–351 | Use the reports |

**Sector rules.** The old app's `sector` input can't express any of these. Government, statutory-body and contract differences in §3.3 are real differences between the Acts, not errors: `eis.md` lines 171–175 and `socso.md` lines 58–61 say so directly.

## 6. Worked examples

**Person.** Single citizen, age 30, Muslim, workplace in WP, RM5,000 every month of 2026, no other pay, PCB Category 1, no TP1 claims, full-month monthly-rated, one employer, zakat paid from January, not opted out of SKBBK. "Take-home" means after all deductions and after zakat is paid.

**Sources.** EPF: `epf-third-schedule-2025-10-partA.json`, band 4,980.01–5,000. SOCSO May: `socso-act4-2025.json` band 54, Category 1. SOCSO July: `socso-act4-2026.json` phase 1 band 54. EIS: `eis-2025.json` item 54. Zakat: `zakat-wp.json` 2026. PCB: `pcb_ref_official.py`, 12 months simulated from January, with Table 1 matching `pcb-spec-2026.json`. PCB figures carry the by-proxy caveat in §3.1.

### 6.1 Contributions

| Item | May 2026 | July 2026 |
|---|---:|---:|
| EPF employee | 550.00 | 550.00 |
| SOCSO invalidity | 24.75 | 24.75 |
| SKBBK | none | 37.15 |
| EIS | 9.90 | 9.90 |
| **Employee subtotal before PCB and zakat** | **584.65** | **621.80** |
| *Employer, not deducted:* EPF 650.00, SOCSO 86.65, EIS 9.90 | *746.55* | *746.55* |

The employer's cost doesn't change in July. The band amount for SKBBK is not 0.75% of the actual wage: 0.75% × 5,000 = 37.50, the table says 37.15.

### 6.2 Zakat

Nisab 2026 is RM33,996. Both methods are officially valid. Which is the default is ZAK1.

| | Kaedah 1, no deductions | Kaedah 2, with deductions |
|---|---:|---:|
| Gross | 60,000.00 | 60,000.00 |
| Deductions | — | 18,600.00 (self 12,000 + EPF 6,600) |
| Base, tested against nisab | 60,000.00 | 41,400.00 |
| Annual zakat at 2.5% | 1,500.00 | 1,035.00 |
| Monthly | 125.00 | 86.25 |

### 6.3 PCB and take-home

**PCB trace, no zakat.** Annual tax is 1,320.00 from P = 47,000: (47,000 − 35,000) × 6% + 600.

| Month | K before | K2 | P | X | Raw | Payable |
|---|---:|---:|---:|---:|---:|---:|
| May | 2,200 | 178.57 | 47,000.01 | 440 | (1,320.00 − 440) ÷ 8 = 110.00 | 110.00 |
| July | 3,300 | 30.00 | 47,000.00 | 660 | (1,320.00 − 660) ÷ 6 = 110.00 | 110.00 |

**Zakat through payroll (PZB)**

| Scenario | Month | Raw | Zakat | Net | **PCB** | **Take-home** |
|---|---|---:|---:|---:|---:|---:|
| No zakat | May | 110.00 | — | 110.00 | 110.00 | **4,305.35** |
| | July | 110.00 | — | 110.00 | 110.00 | **4,268.20** |
| Kaedah 2 | May | 110.00 | 86.25 | 23.75 | 23.75 | **4,305.35** |
| | July | 110.00 | 86.25 | 23.75 | 23.75 | **4,268.20** |
| Kaedah 1 | May | 102.50 | 125.00 | −22.50 | 0.00 | **4,290.35** |
| | July | 95.00 | 125.00 | −30.00 | 0.00 | **4,253.20** |

Kaedah 1 raw falls because Z grows: May (1,320 − 500) ÷ 8; July (1,320 − 750) ÷ 6.

**Zakat paid directly to PPZ, not declared on TP1.** PCB stays at 110.00. These aren't payroll deductions, so payslip net is the no-zakat line above.

| Scenario | Month | PCB | Zakat | Payslip net | **After paying PPZ** |
|---|---|---:|---:|---:|---:|
| Kaedah 2 | May | 110.00 | 86.25 | 4,305.35 | **4,219.10** |
| | July | 110.00 | 86.25 | 4,268.20 | **4,181.95** |
| Kaedah 1 | May | 110.00 | 125.00 | 4,305.35 | **4,180.35** |
| | July | 110.00 | 125.00 | 4,268.20 | **4,143.20** |

A direct payer who declares it on TP1 gets the same PCB as the PZB rows.

**What to notice**

- Kaedah 2 leaves take-home unchanged, because all the zakat comes off PCB.
- Kaedah 1 costs RM15 a month more than the tax it replaces, because zakat is above PCB.
- SKBBK lowers take-home by RM37.15 in July, in every scenario.
- An opted-out local's July equals the May column.
- In June 2026 SKBBK applies to everyone, even someone who opted out later.

### 6.4 The whole year

| Scenario | PCB total | Zakat total | Take-home total | Tax after rebates, with RM350 relief | Result at filing | Zakat lost |
|---|---:|---:|---:|---:|---|---:|
| No zakat | 1,320.00 | — | 51,404.15 | 1,299.00 | Refund 21.00 | — |
| Kaedah 2, PZB | 285.00 | 1,035.00 | 51,404.15 | 264.00 | Refund 21.00 | 0 |
| Kaedah 1, PZB | 0.00 | 1,500.00 | 51,224.15 | 0.00 | None | 201.00 |
| Kaedah 2, direct, no TP1 | 1,320.00 | 1,035.00 | 50,369.15 | 264.00 | Refund 1,056.00 | 0 |
| Kaedah 1, direct, no TP1 | 1,320.00 | 1,500.00 | 49,904.15 | 0.00 | Refund 1,320.00 | 201.00 |

SOCSO + EIS for 2026 are 415.80 and SKBBK 260.05. The RM350 cap is reached either way, so at RM5,000 the SKBBK question (X7) doesn't change the annual result. Chargeable income is 46,650 with the relief, tax 1,299.00; without it 47,000, tax 1,320.00. "Refund" assumes the user files a BE. Under PCB-as-final-tax there is no refund (`pcb.md` §2).

### 6.5 If the SOCSO + EIS relief is applied in monthly PCB (PCB1)

TP1 C14 entered monthly until the RM350 cap:

| | May PCB | May take-home | July PCB | July take-home |
|---|---:|---:|---:|---:|
| No zakat, SKBBK counted | 108.95 | 4,306.40 | 107.60 | 4,270.60 |
| No zakat, SKBBK not counted | 108.95 | 4,306.40 | 108.30 | 4,269.90 |
| Kaedah 2 PZB, SKBBK counted | 22.70 | 4,306.40 | 21.35 | 4,270.60 |
| Kaedah 1 PZB, SKBBK counted | 0.00 | 4,290.35 | 0.00 | 4,253.20 |

The two no-zakat series reproduce `pcb.md` lines 1034–1035, and each totals 1,299.00.

### 6.6 To reproduce the PCB figures

Run with `python3 -I -B`, from any folder outside `.research-cache/`. `-B` stops Python writing a `__pycache__` next to the model:

```python
import importlib.util
from decimal import Decimal as D
s = importlib.util.spec_from_file_location("m", ".research-cache/scripts/pcb_ref_official.py")
m = importlib.util.module_from_spec(s); s.loader.exec_module(m)
st = m.new()
for mo in range(1, 13):  # zakat=D("86.25") Kaedah 2, D("125.00") Kaedah 1, D(0) none
    print(mo, m.month(st, D(5000), D(550), 1, D(9000), mo, zakat=D("86.25"))["final"])
```

Give the absolute path to the model if you aren't at the repo root.

## 7. Findings resting on saved AGC listings

**Not relied on: owner decision of 2026-11-06 (D1).** A manual check at lom.agc.gov.my (M7) would restore these findings. Nothing here was re-run, and the saved listings were not opened in this pass. No contribution amount depends on them.

- **`socso.md` [AGC listing]:** lines 74, 167, 251, 263, 708, 711, 717, 803, with the note at lines 945–950.
- **`eis.md`, resting on the same work but not tagged in that report:** lines 33, 139, 658, 672, and the T3 row at 742. The EIS-4 and EIS-8 votes (lines 724, 728) cite AGC listings. Line 672 says the "no later order" findings and the AGC gazette copies come from that work. Treat these as [AGC listing].
- **`pcb.md`:** none recorded. The route to the Act 874 URL isn't recorded either (line 1147).
- **`epf.md`, `zakat.md`:** none. Both record the listings as unusable (`epf.md` line 640, `zakat.md` line 889).

## 8. Remaining open items

**Decisions.** 48 owner questions are listed in [owner-questions.md](owner-questions.md). Seven shape the design: D1 to D7.

**Only an agency or a manual step can settle** (M1–M7 in that file)

| Item | Who | Default until then |
|---|---|---|
| Part F rounding; split above RM20,000; i-Topup method | KWSP calculator | Per share; rounded total with provisional split; table plus whole ringgit |
| EPF switch at 60 and 75; commission; fixed transport; part-time floor; i-Topup cap | KWSP in writing | Labelled defaults in `epf.md` §Research status |
| Switch month at 60 and 55; August filers; PR and MyKAS opt-out; pensioners; wage items; directors, interns | PERKESO in writing | Labelled defaults; owner questions |
| RM10 and rounding order for 2026 | e-PCB Plus | `pcb.md` rules, medium-high |
| SKBBK in the RM350 | LHDN: YA2026 BE notes, TP1 2027 notes | Unconfirmed reading |
| Part-year nisab; PZB divisor; child age; shared children; benefits in kind; LTAT | PPZ | Labelled defaults in `zakat.md` |

**Not published yet: recheck dates**

| When | What | Source |
|---|---|---|
| From about 18 Nov 2026 | Finance Bill (YA2027 rates, D, RM150) | Parliament bill list; inferred from the 2025 cycle |
| Dec 2026 – Jan 2027 | LHDN 2027 MTD spec and TP1; PERKESO year-end review of LINDUNG 24 Jam | LHDN, PERKESO |
| Jan 2027 | Act 4 and Act 789 bills; KWSP schedule; first interim contracts end around 31 Jan | Bill lists, KWSP, JPA |
| About Feb 2027 | Nisab 2027, fitrah 1448H, `setValues()` deductions | PPZ, e-Fatwa |
| Before Jun 2027 | RM2,000 minimum wage Order, day in June, MSME exemption | MOHR, Gazette |

**Research gaps surfaced here:** I10–I15. They only need work if the owner's scope includes those groups.

**What this pass could not do**

- Run KWSP's calculator, PERKESO's calculator, e-PCB Plus or LHDN's calculator for 2026. No result here is official output for 2026.
- Confirm any finding from a primary source. This was an internal consistency check.
- Check non-resident PCB against the model, which has no such path. `pcb.md` §3.9 stands on its own evidence.
- Fix any of the above in the reports, which were out of scope.

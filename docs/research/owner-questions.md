# Questions for the owner

Compiled 2026-11-05 from the "Questions for the owner" section of `epf.md`, `socso.md`, `eis.md`, `pcb.md` and `zakat.md`, and from `README.md`. Duplicates are merged, and "Asked by" shows where each came from. [§ Traceability](#traceability) maps every original question to its id.

**Only what's listed under [Decisions so far](#decisions-so-far) is decided**, including the D-section questions below that it answers. A "Suggested" line is a suggestion from the report named, or from this cross-check where it says so. Ids are stable, so the config schema can cite them.

**Count: 48 questions.** Decide first 7, across schemes 7, EPF 6, SOCSO 5, EIS 0 (all merged), PCB 8, zakat 15. There are also 8 [optional manual actions](#optional-manual-actions).

Figures come from the report cited or from [cross-check.md](cross-check.md).

## Decisions so far

**Goal for the first iteration (owner, 2026-11-06):** make the calculator as simple as possible for the baseline, and add capabilities later.

| Id | Decision | What it means for v1 | Later |
|---|---|---|---|
| D1 | **Don't rely on the saved AGC listings** | No amount changes. Those findings are unconfirmed until a manual check (M7) | Manual check when convenient |
| D2 | **Private sector first** | Malaysian private-sector employees only | Government, foreign and domestic workers |
| D3 | **Age only (whole years)** | No birth month. The 57 and 60 cut-offs apply to the whole year | |
| D4 | **Single figure, without allowances** (updated 2026-11-06, after the payslip check) | One input: monthly salary before deductions, without any allowances, overtime or bonus (usually basic salary). This avoids assuming whether an allowance is charged EPF or tax | Pay breakdown, including allowances (X1) |
| D5 | **One figure, stipulated for the whole year** | Flat January to December, with no start month | 12-month simulation |
| D6 | **Use 2026 values where no official value exists, with a note** | Applies to 2027 tax and nisab, until confirmed. This replaces the suggestion to show Budget 2027 proposed figures | Update when official values are published |
| D7 | **One employer only** | No multiple-employer input | Support several employers |
| N1 | **2026 uses the rules at the end of the year** | SKBBK is included for all 12 months of 2026 | Month-accurate figures |
| N2 | **PCB is annual tax ÷ 12** | Shown as approximate; LHDN's monthly rules aren't applied | Real monthly formula |
| Build | **No app yet; research only** | All research notes stay, for later iterations | |
| V1 | **Zakat is opt-in** | Off by default | Full zakat inputs |
| V2 | **SKBBK included by default; the user can opt out** | One toggle, for calculation only, not blocked by join date. Settles SOC1 and SOC2 for v1 | |
| V3 | **RM350 relief left out for now** | PCB1 and X7 don't affect v1 | **Revisit in the next iteration** |
| V4 | **Marital status and children are in v1, with simple inputs** | Children count as under 18 | Children's specific circumstances |
| V5 | **Marital status is one list of four options** | Single; Married, spouse doesn't work; Married, spouse works; Divorced or widowed | |
| V6 | **Zakat is information, not a deduction** | The user pays it themselves with no PCB offset, and claims the rebate when e-filing | Through salary and TP1 |
| V7 | **A wife-deduction checkbox** | Shown only when zakat is on and the user is married. Implies the with-deductions method | |
| Cache | **Saved AGC portal copies deleted (M8)** | Done 2026-11-06. All sources stay | |
| Assumed | **Malaysian citizen, tax resident. Age 60+ applies its rules for the whole year. Under 60 is assumed to have joined before the age cut-offs. Anything outside the baseline is deferred** | See [v1-baseline.md](v1-baseline.md) | |

**Status of the rest:** no questions are left for v1 ([v1-baseline.md §10](v1-baseline.md#10-v1-decisions)). For v1, V6 settles X6, V7 settles ZAK1 and ZAK8, V2 settles SOC1 and SOC2, ZAK2 uses annual ÷ 12 to the sen, SOC4 is settled by N1, and EPF4 uses the labelled default. All other questions below are **deferred to later iterations**, and stay here so nothing is lost. [v1-baseline.md §11](v1-baseline.md#11-roadmap-where-the-research-for-each-later-feature-lives) maps them to features.

## Decide first

These shape the inputs, the config or the engine, so the rest depends on them.

### D1. Saved AGC portal listings: may this research use them?

A few findings rested on saved copies of the Federal Legislation portal's (lom.agc.gov.my) P.U.(A) and P.U.(B) listings that weren't obtained through a normal page view. **Decided: don't rely on them** (see Decisions so far); the copies were deleted.

- **Options:** (a) Yes: the tagged findings stay. (b) No: the tagged findings should be removed, and they need a manual check at lom.agc.gov.my, with lower confidence until then (M7).
- **Suggested:** none. This one is yours.
- **Changes in the calculation:** no amount. It affects the "no later order" findings in `eis.md`, and in `socso.md` the "no gazetted instrument found" note on voluntary SKBBK, the P.U.(B) 381/2024 row, the Act 789 order check, the exemption-title check and the no-revocation check. If ruled out, "no instrument found" falls back on PERKESO's pages and the bill lists, which is weaker. List: [cross-check §7](cross-check.md#7-findings-resting-on-saved-agc-listings).
- **Asked by:** README, SOCSO Q17, EIS Q7. PCB records it as awaited. **See:** [README](README.md#agc-listings-owner-decision-needed-d1), [socso.md note](socso.md#agc-listing-note), [eis.md §10](eis.md#10-limitations-and-unverified-items).

### D2. Who does v1 support?

The rules for government, statutory-body, armed-forces, foreign and domestic workers are now known or nearly so, and they differ by scheme. Model them, or start with Malaysian private-sector employees and show a note for the rest?

- **Options:** (a) Malaysian private-sector first, with a note. (b) Add a status selector for government staff: pensionable, EPF option, before pension status, contract or interim, statutory body. (c) Also foreign workers and PRs. (d) Also domestic workers, armed forces and police.
- **Suggested:** no overall recommendation in any report. `epf.md` recommends the selector if government is included, labelled as based on the statutory schedule. `pcb.md` asks whether to add an LTAT-type "other approved scheme" as advanced, despite its unverified status. `eis.md` defaults residency to citizen, under Advanced.
- **Changes in the calculation:** coverage in every scheme. Example: a permanent officer on the EPF option pays EPF but no SOCSO or EIS; a contract officer pays EPF and SOCSO but no EIS. The shared employment input is proposed in [cross-check §3.3](cross-check.md#33-one-shared-employment-input). Armed forces, police and MyKAS have research gaps (I11, I12).
- **Asked by:** README Q1, Q4, Q7, Q18; EPF Q1; SOCSO Q1; PCB Q12. **See:** [epf.md §2](epf.md#2-applicability-rules), [socso.md §2.1](socso.md#21-who-contributes-under-act-4), [eis.md §2.3](eis.md#23-special-worker-types-gap-g1), [pcb.md §3.16](pcb.md#316-worker-categories).

### D3. Age input and the switch month at 60

Should the app ask for birth month and year, or whole years only? And which month should each scheme switch? No agency has written a month rule. EPF and SOCSO's best evidence currently points to different months.

- **Options:** (a) Birth month and year, with a labelled timing setting per scheme. (b) Whole years with a help note saying what date age is read at.
- **Suggested, and the reports disagree:** `epf.md` asks to collect birth month and accept "month after birth month", labelled unconfirmed. `socso.md` recommends the birthday month with a note, and says this decides whether whole-year age is enough. `eis.md` recommends staying on completed years, since at most RM11.90 is at stake. *Cross-check suggestion:* (a), because the EPF side is what makes it matter, and keep three separate settings.
- **Changes in the calculation:** one month's amounts around the birthday. At RM5,000: EPF RM550 employee (employer 650 vs 200), SOCSO RM24.75 each, EIS RM9.90 each, then PCB through K1. [Cross-check §3.4](cross-check.md#34-age-60-which-month-each-scheme-switches).
- **Asked by:** README Q2, Q5, Q17; EPF Q4; SOCSO Q2; EIS Q5. **See:** [epf.md §3.1](epf.md#31-age-switch-timing), [socso.md §2.2](socso.md#22-first-vs-second-category-the-age-rule), [eis.md §10](eis.md#10-limitations-and-unverified-items).

### D4. One gross figure, or a pay breakdown?

The five schemes count pay differently, so one "gross" can't be right for all of them once the user has bonus, commission or overtime. Can the UI collect them separately?

- **Options:** (a) Basic gross only, with a warning. (b) Progressive breakdown: wages excluding bonus; bonus with its frequency (once a year or more often); commission and incentives entered as wages; overtime; allowances; travel claims.
- **Suggested:** (b). `epf.md` and `socso.md` each recommend it for their own reason. `eis.md` defaults bonus frequency to once a year.
- **Changes in the calculation:** EPF's employer rate stays 13% if the regular wage is RM5,000 or less. SOCSO and EIS skip annual bonus only. PCB routes to Y1 or Yt by pay pattern. Example at RM5,000 + RM5,000: employer EPF 1,300 vs 1,200. Once-a-year AWS and festive bonuses would be treated as annual, at lower confidence.
- **Asked by:** README Q16; EPF Q3; SOCSO Q7; EIS (§7 option). **See:** [epf.md §3.4](epf.md#34-bonus-commission-arrears-and-separate-payroll-runs), [socso.md §2.4](socso.md#24-which-wages-count-shared-with-eis), [eis.md §2.1](eis.md#21-which-wages-count-s3-wages).

### D5. January figure or 12-month simulation for PCB?

PCB is recalculated every month, so January alone can mislead for some salaries.

- **Options:** (a) January only, shown as approximate. (b) Always simulate 12 months. (c) Simulate at least when a bonus, pay change, one-off overtime or claim month is set, and for salaries near the RM10 line.
- **Suggested:** `pcb.md` says the evidence favours at least (c).
- **Changes in the calculation:** single RM3,700 shows 0 in January, then 10.20–10.25 from April (total 92.00). It also decides engine shape, since zakat Z and tax X build up month by month. Example figures: [cross-check §6](cross-check.md#6-worked-examples).
- **Asked by:** README Q23; PCB Q3. **See:** [pcb.md §3.11](pcb.md#311-recommended-simplification-for-the-app).

### D6. What does 2027 show before the official figures exist?

Tax is a Budget proposal with no Finance Bill yet, and PPZ hasn't published the 2027 nisab.

- **Options, tax:** (a) Proposed figures with a "proposed, not law" badge. (b) YA2026 figures until the Act and spec are published.
- **Options, zakat:** (a) Block 2027 zakat. (b) Show 2026's nisab, clearly marked provisional.
- **Suggested:** tax (a), from `pcb.md`, because YA2026 would show rates and a D the Budget proposes to replace; the catch is that they can change, and payroll shouldn't apply them until LHDN publishes its spec. Zakat: no suggestion. `zakat.md` warns never to copy 33,996 silently.
- **Changes in the calculation:** at single RM5,000, PCB 95.00 vs 110.00. Zakat could flip between 0 and an amount near the nisab. EPF, SOCSO and EIS stay marked as carried forward either way.
- **Asked by:** README Q13, Q25; PCB Q5; zakat Q6. **See:** [pcb.md §4.5](pcb.md#45-year-status-and-effective-dates), [zakat.md §4](zakat.md#2027-template).

### D7. Support more than one employer?

- **Options:** (a) One employer only, with a note. (b) Support several as an advanced option.
- **Suggested:** none. `eis.md` lists it as Advanced, default off. `socso.md` notes the method is clear: per-job injury and invalidity, SKBBK at one chosen job.
- **Changes in the calculation:** ceilings and bands apply per employer. Two RM6,000 jobs pay EIS 2 × RM11.90. Adding wages together would give the wrong amount (RM104.15 vs RM74.40 employee SOCSO at 6,000 + 6,000 with SKBBK). `epf.md` and `pcb.md` haven't researched concurrent employers (I13), so (b) needs more research. Someone with two employers must also file: PCB can't be final tax.
- **Asked by:** README Q3, Q6; SOCSO Q10. **See:** [socso.md §7](socso.md#7-user-selectable-options), [eis.md §7](eis.md#7-user-selectable-options).

## Across schemes

### X1. Fixed monthly transport, petrol, toll, parking or car allowance

All three Acts exclude "any travelling allowance" in the same words, and no Malaysian ruling says whether a fixed monthly sum is one. The reports reached opposite defaults, so decide on one default or per-scheme defaults.

- **Options:** (a) Count by default, with a "my payslip shows no EPF/SOCSO/EIS on this" toggle. (b) Exclude by default, with a "my payslip counts this" toggle. (c) Per-scheme defaults, as the reports stand.
- **Suggested, and the reports disagree:** `epf.md` suggests counted for EPF. `socso.md` and `eis.md` suggest excluded for theirs. *Cross-check suggestion:* one shared toggle, since the words are the same. Between (a) and (b), (a) shows the lower take-home if wrong and matches EPF vendors and PERKESO's Feb 2026 post, while (b) follows the plain wording and *Texmo* (India). See below for the money.
- **Changes in the calculation:** RM500 on RM5,000 in July 2026: employee RM62.20 a month across EPF (RM55), SOCSO + SKBBK (RM6.20) and EIS (RM1). PCB doesn't change at this wage. Zakat counts it regardless.
- **Asked by:** EPF Q6, SOCSO Q6, EIS Q3. **See:** [cross-check §3.2](cross-check.md#32-fixed-transport-petrol-and-car-allowance-an-inconsistency-in-the-research-not-a-difference-between-the-acts).

### X2. Arrears input

- **Options:** (a) One "wages this month" field, with help text and a per-month override. (b) A current-month adjustment field with a warning when RM5,000 is crossed. (c) Full input: months and amounts, each month recalculated.
- **Suggested:** `eis.md` suggests (a) for v1. `epf.md` offers (c) or (b) without choosing: (c) follows KWSP FAQ Q17; (b) is simpler for new users. `socso.md` lists an advanced input.
- **Changes in the calculation:** EPF, SOCSO and EIS re-run the earned month. PCB treats arrears as paid-month Yt. A lump sum can differ by about RM98 of employer EPF over three months (rise from 4,900 to 5,200), and by up to about RM2.40 for EIS. Payslips may lump them anyway.
- **Asked by:** EPF Q7; EIS Q4; SOCSO (§7 option). **See:** [cross-check §3.6](cross-check.md#36-bonus-and-arrears).

### X3. Self-employed and gig users

- **Options:**
  - SOCSO: include the Act 789 plan picker and matching, or not. For 2027, show only the gross plan amount with an "announced, amounts not published" note, or also a labelled estimate. Platform workers: model 1.25% of each job, which needs a job-earnings input, or point to a note.
  - Tax: offer an annual estimate from net business income, or only say no PCB applies and point to Form B.
  - Zakat: build Zakat Perniagaan Method 3 for trading income, or show a note sending them to PPZ. And is freelance input gross or net of costs, since PPZ doesn't say?
- **Suggested:** for 2027 matching, gross amount with the note (`socso.md`). Otherwise none.
- **Changes in the calculation:** a separate path with no employer share, no PCB and no monthly zakat offset. A plan picker shows the wrong figure for platform workers (RM13.10–49.40 vs about RM37.50 on RM3,000 of jobs).
- **Asked by:** README Q9; SOCSO Q11, Q12; PCB Q11; zakat Q17. **See:** [socso.md §2.5](socso.md#25-self-employed-act-789-lindung-kendiri-formerly-sksps-and-platform-gig-workers-act-872), [pcb.md §3.16](pcb.md#316-worker-categories), [zakat.md §2.2](zakat.md#22-worker-categories).

### X4. Worker types with no PERKESO ruling

Industrial-training students paid only an allowance; a Malaysian working for a foreign company with no Malaysian registration; embassy and international-organisation staff.

- **Options:** (a) Ask "Does your payslip show this deduction?" and follow the answer. (b) No contribution by default. (c) Full table by default.
- **Suggested:** (a), from `socso.md` and `eis.md`, because it avoids guessing.
- **Changes in the calculation:** SOCSO and EIS amounts for these groups, either 0/0 or the normal table.
- **Asked by:** SOCSO Q8; EIS Q1. **See:** [socso.md §2.1](socso.md#21-who-contributes-under-act-4), [eis.md §2.3](eis.md#23-special-worker-types-gap-g1).

### X5. Coverage that's only inferred

Salaried directors, staff posted abroad, parent-paid expatriates, and public-university staff.

- **Options:** (a) Treat directors, posted staff and expatriates as covered, and public-university staff as statutory-body 0/0 for EIS, all with a "check your payslip" note. (b) Wait for PERKESO in writing.
- **Suggested:** (a), from `socso.md` and `eis.md`.
- **Changes in the calculation:** coverage only: for example a salaried director at RM8,000 pays the top-band SOCSO and EIS.
- **Asked by:** SOCSO Q9; EIS Q2. **See:** [socso.md §2.1](socso.md#21-who-contributes-under-act-4), [eis.md §2.3](eis.md#23-special-worker-types-gap-g1).

### X6. Zakat: through payroll or paid directly?

- **Options:** (a) PZB through payroll, offset against PCB monthly. (b) Paid directly to PPZ and declared on TP1. (c) Paid directly and not declared, recovered only at filing. The question is which is assumed by default for take-home.
- **Suggested:** none. `zakat.md` §7 asks the user, with no default.
- **Changes in the calculation:** at RM5,000, Kaedah 2, May 2026: (a) or (b) take-home 4,305.35; (c) 4,219.10 after paying PPZ, with RM1,056 back at filing.
- **Asked by:** README Q14; zakat Q2; PCB (§7 input). **See:** [zakat.md §8.2](zakat.md#82-payroll-mtdpcb), [cross-check §6.3](cross-check.md#63-pcb-and-take-home).

### X7. YA2026: does SKBBK count toward the RM350 relief?

The Act's wording reads as yes, but no LHDN, PERKESO or MOF statement says so.

- **Options:** (a) Count it, with "based on the Act's wording, not confirmed by LHDN". (b) Leave it out until LHDN says something.
- **Suggested:** (a), from `socso.md`. `pcb.md` keeps it as an open flag, with no default.
- **Changes in the calculation:** usually under RM2 a year for a single employee, and nothing at RM5,000. More for part-year or 60+ users (60+ at RM5,000: relief 0 vs 260.05). At single RM4,029 it crosses the rebate cliff: annual tax 600.47 vs 199.94. Whether the RM150 is separate or pooled for YA2027 waits on the Finance Bill, and isn't a choice for now.
- **Asked by:** SOCSO Q13; PCB (status item 3, §8). **See:** [cross-check §3.5](cross-check.md#35-skbbk-and-the-rm350-relief).

## EPF

### EPF1. Foreign workers, January to September 2025

Mandatory EPF started with October 2025 wages.

- **Options:** (a) "No EPF unless they elected", with Parts B and D as an advanced option. (b) Only "no EPF".
- **Suggested:** the question proposes (a).
- **Changes in the calculation:** 0/0, or employee 11% (5.5% at 60+) plus employer RM5, for 2025 back-calculations only.
- **Asked by:** README Q19; EPF Q2. **See:** [epf.md §2](epf.md#2-applicability-rules).

### EPF2. Pay basis and small employers

- **Options:** Default to "monthly-rated, full month" with an optional part-time, hourly or part-month section, or not. Show the small-employer input for February to July 2025, or not.
- **Suggested:** yes to both (`epf.md`).
- **Changes in the calculation:** without it the app overcharges a part-timer (about RM99 employee and RM117 employer a month at RM800), or undercharges a full-month low earner. Small employer: floor RM1,500 vs RM1,700.
- **Asked by:** EPF Q5. **See:** [epf.md §3.2](epf.md#32-minimum-wage-floor).

### EPF3. Part F rounding, until KWSP confirms

KWSP publishes both per-share and total rounding.

- **Options:** (a) Round each share up, with a visible "KWSP sources conflict" note. (b) Show both results.
- **Suggested:** (a) (`epf.md`).
- **Changes in the calculation:** a possible RM1 a month: RM1,751 gives 36 + 36 = 72 vs a total of 71.
- **Asked by:** README Q15; EPF Q8. **See:** [epf.md §3](epf.md#3-calculation-algorithm-with-rounding).

### EPF4. Wages above RM20,000

- **Options:** (a) Rounded total with the provisional split: employee rounded up, employer takes the rest. (b) Keep rounding each share.
- **Suggested:** (a) (`epf.md`).
- **Changes in the calculation:** RM1 of total for about half of all wages above RM20,000. The employee's own share may be RM1 off either way.
- **Asked by:** EPF Q9. **See:** [epf.md §3](epf.md#3-calculation-algorithm-with-rounding).

### EPF5. i-Topup

- **Options:** Method: table + whole-ringgit top-up, or combined rate on actual wages. Input: percentage, ringgit, or both. At RM100,000 a year: warn, or truncate.
- **Suggested:** table + whole ringgit as a labelled default; both inputs; warn, don't truncate (`epf.md`).
- **Changes in the calculation:** up to RM12 of total a month in KWSP's RM6,250 examples.
- **Asked by:** EPF Q10. **See:** [epf.md §7](epf.md#7-user-selectable-options).

### EPF6. Basic Savings benchmark

README asks because two sources disagreed. That's now settled (RM270k for 2026), so the question left is whether to show it.

- **Options:** (a) Leave it out of v1. (b) Keep it as a labelled optional extra.
- **Suggested:** (a) (`epf.md`). The 2026 by-age figures are lower than 2025's at every age, which could confuse new users.
- **Changes in the calculation:** nothing in take-home.
- **Asked by:** README Q20; EPF Q11. **See:** [epf.md §4](epf.md#4-per-year-config).

## SOCSO

### SOC1. Opted-out locals: is there NEI from July 2026?

PERKESO has published no month-by-month rule, and an August filer's July is unconfirmed.

- **Options:** (a) No NEI from July for everyone flagged opted out, with a caveat for August filers. (b) A filing-month input.
- **Suggested:** (a) (`socso.md`). (b) makes sense only if PERKESO confirms the month-of-filing reading.
- **Changes in the calculation:** one month of NEI at most: RM37.15 at RM5,000, RM44.65 at the ceiling.
- **Asked by:** SOCSO Q3. **See:** [socso.md §2.3](socso.md#23-lindung-24-jam--skbbk-participation-rules-complete-timeline).

### SOC2. New hires after 31 Aug 2026

The newest FAQ says first-time workers must contribute; older ones allowed an opt-out.

- **Options:** (a) One opt-out toggle, not blocked by join date. (b) Hide it for anyone who joined after the window.
- **Suggested:** (a) (`socso.md`), since people hired before FAQ v2.3 may hold valid opt-outs.
- **Changes in the calculation:** NEI on or off: RM37.15 a month at RM5,000.
- **Asked by:** SOCSO Q4. **See:** [socso.md §2.3](socso.md#23-lindung-24-jam--skbbk-participation-rules-complete-timeline).

### SOC3. "Receiving a SOCSO invalidity pension" option

- **Options:** (a) Show it as an advanced flag. (b) Leave it out and document the limitation.
- **Suggested:** none. It rests on the Act's text, with no PERKESO confirmation.
- **Changes in the calculation:** Category 2 at any age: at RM3,000, 36.90 / 22.15 vs 51.65 / 36.90 (employer / employee, July 2026).
- **Asked by:** SOCSO Q5. **See:** [socso.md §2.2](socso.md#22-first-vs-second-category-the-age-rule).

### SOC4. June 2026: legal amount or payslip?

Many payslips, including government ones, deducted June's SKBBK later as arrears.

- **Options:** (a) The amount legally due. (b) What many payslips actually showed.
- **Suggested:** none.
- **Changes in the calculation:** June 2026 only: RM37.15 at RM5,000.
- **Asked by:** README Q8; SOCSO Q14. **See:** [socso.md §2.3](socso.md#23-lindung-24-jam--skbbk-participation-rules-complete-timeline).

### SOC5. Preview future SKBBK phases?

1.00% from June 2028 and 1.25% from June 2031, both gazetted.

- **Options:** Show as a preview, or leave out.
- **Suggested:** none.
- **Changes in the calculation:** nothing for 2025 to 2027. Display only.
- **Asked by:** README Q10; SOCSO Q15. **See:** [socso.md §4](socso.md#future-gazetted-for-completeness).

## EIS

No EIS-only question remains. All were merged:

| `eis.md` question | Now |
|---|---|
| 1 Worker types with no ruling | [X4](#x4-worker-types-with-no-perkeso-ruling) |
| 2 Inferred coverage | [X5](#x5-coverage-thats-only-inferred) |
| 3 Fixed travel allowance | [X1](#x1-fixed-monthly-transport-petrol-toll-parking-or-car-allowance) |
| 4 Arrears | [X2](#x2-arrears-input) |
| 5 Age precision | [D3](#d3-age-input-and-the-switch-month-at-60) |
| 6 Asking PERKESO | [M4](#optional-manual-actions) |
| 7 AGC listing method | [D1](#d1-saved-agc-portal-listings-may-this-research-use-them) |

README Q4, Q5 and Q6 are the same as D2, D3 and D7. EIS's multiple-employer and residency options also fall under those.

## PCB

### PCB1. SOCSO + EIS relief in monthly PCB

The law makes it optional through TP1, and payroll vendors treat it as a setting.

- **Options:** (a) Off for monthly PCB, on for the annual estimate, with a toggle "my payslip already applies this". (b) On by default in monthly PCB.
- **Suggested:** (a) (`pcb.md`).
- **Changes in the calculation:** about RM1.75 a month at RM5,000 for a user whose payroll applies it. July 2026 PCB 107.60 vs 110.00. Over RM400 a year in the narrow rebate-cliff bands.
- **Asked by:** README Q21; PCB Q1. **See:** [pcb.md §8](pcb.md#8-interaction-with-the-other-modules).

### PCB2. Other TP1 reliefs: default treatment

- **Options:** (a) "Declared to employer": lower monthly PCB. (b) "Claimed at annual filing": refund later.
- **Suggested:** none.
- **Changes in the calculation:** monthly PCB vs year-end refund. A RM2,500 laptop in January: 97.50 vs 110.00 at RM5,000.
- **Asked by:** README Q22; PCB Q2. **See:** [pcb.md §4.4](pcb.md#44-relief-list-with-caps-and-tp1-eligibility).

### PCB3. Scope: mid-year joiners and special regimes

- **Options:** Support mid-year joiners (TP3) or not. Support the special 15% regimes or not, perhaps behind an advanced toggle.
- **Suggested:** for the regimes, leave them out of the beginner UI (`pcb.md` §3.10). For TP3, none.
- **Changes in the calculation:** TP3 feeds year-to-date EPF, PCB and zakat into the formula. The regimes use a different formula.
- **Asked by:** README Q24; PCB Q4. **See:** [pcb.md §3.10](pcb.md#310-special-15-regimes-optional-low-priority).

### PCB4. Childcare, child aged 7 to 12 at a TASKA or TADIKA

- **Options:** (a) Follow the Act: not claimable. (b) Follow LHDN's TP1 notes: 12 and under everywhere.
- **Suggested:** (a), with a short warning (`pcb.md`), because a claim under the wider wording could be disallowed.
- **Changes in the calculation:** up to RM3,000 of relief for YA2026.
- **Asked by:** PCB Q7. **See:** [pcb.md §3.12](pcb.md#312-differences-between-the-2025-and-2026-specs).

### PCB5. Overtime route

- **Options:** (a) LHDN's Y1 route only, with a note that payslips can differ. (b) Also an advanced "my payroll treats overtime as additional" toggle.
- **Suggested:** (a) (`pcb.md`).
- **Changes in the calculation:** that month's PCB, usually not the year's total. RM5,000 with OT 500 in January: 152.50 vs 140.00.
- **Asked by:** PCB Q8. **See:** [pcb.md §3.14](pcb.md#314-classifying-pay-overtime-tips-and-variable-items).

### PCB6. Termination payments

The payout may be held for tax clearance, and the formula keeps projecting salary after the last pay.

- **Options:** (a) No input. (b) An advanced input, shown as an estimate with a clearance warning, plus an ill-health tick-box, off by default, labelled as needing LHDN acceptance.
- **Suggested:** (b) (`pcb.md`).
- **Changes in the calculation:** only the taxable excess enters Yt. RM150,000 compensation with 10 years: June MTD 11,994.20 vs 36,994.20 if the gross were used.
- **Asked by:** PCB Q9. **See:** [pcb.md §3.15](pcb.md#315-termination-and-retirement-payments).

### PCB7. Domestic workers and household employers

The Act has no exception, but only LHDN can confirm its practice.

- **Options:** (a) Calculate from the formula, usually RM0, with a note that LHDN has published no household-employer guidance. (b) Also tell the household to get an E number and file Form E.
- **Suggested:** none.
- **Changes in the calculation:** none at most wages. The difference is in the instructions.
- **Asked by:** PCB Q10. **See:** [pcb.md §3.16](pcb.md#316-worker-categories).

### PCB8. Gifts in the annual estimate

- **Options:** (a) Two inputs: "approved donations and wakaf, 10% cap" and "gifts to Government, no cap". (b) Every s.44 category.
- **Suggested:** (a), noting that donations count only if the user files a BE (`pcb.md`).
- **Changes in the calculation:** annual estimate only. Can bring someone under the RM35,000 rebate line.
- **Asked by:** PCB Q13. **See:** [pcb.md §3.13](pcb.md#313-annual-tax-be-for-reconciliation).

## Zakat

### ZAK1. Default method

- **Options:** (a) Kaedah 2, with deductions: lower, needs inputs. (b) Kaedah 1, 2.5% of gross: simplest.
- **Suggested:** (a), PPZ's main method (`zakat.md` §7). The question itself is left open.
- **Changes in the calculation:** at RM5,000: RM86.25 vs RM125.00 a month. Through payroll, take-home is unchanged under (a) and RM15 a month lower under (b).
- **Asked by:** README Q11; zakat Q1. **See:** [zakat.md §7](zakat.md#7-user-selectable-options-proposed-ui).

### ZAK2. Monthly figure

PPZ has no rounding rule, because the payer sets the PZB amount.

- **Options:** (a) Exact annual ÷ 12 to the sen: 29.83, 12 months 4 sen short. (b) Round up to 10 sen: 29.90. Either way: may users enter their actual PZB amount?
- **Suggested:** none on the rounding. `zakat-wp.json` carries `sen` as a proposal. `zakat.md` §3.2 proposes allowing the actual amount.
- **Changes in the calculation:** sen per month, and PCB's final 5-sen rounding.
- **Asked by:** zakat Q3. **See:** [zakat.md §3.1](zakat.md#31-zakat-pendapatan-the-official-ppz-algorithm-haul--2018).

### ZAK3. Lump-sum display

Payroll can't absorb a lump sum, and the BE return refunds the PCB overpaid.

- **Options:** (a) Monthly cash flow, with the year-end refund shown separately. (b) Only the net annual effect.
- **Suggested:** none.
- **Changes in the calculation:** display only. RM1,000 in December at RM5,000: RM890 refund.
- **Asked by:** zakat Q4. **See:** [zakat.md §6.5](zakat.md#65-tax-rebate-and-mtd).

### ZAK4. Negative result

PPZ's calculator can show a negative zakat when the Caruman Berzakat offset is large.

- **Options:** (a) Clamp at 0. (b) Follow the calculator.
- **Suggested:** (a) (`zakat.md`).
- **Changes in the calculation:** RM4,500 with RM60,000 of contributions: 0 vs −598.50.
- **Asked by:** zakat Q5. **See:** [zakat.md §3.2](zakat.md#32-recommended-implementation-for-this-app).

### ZAK5. Part-year workers

- **Options:** (a) Actual income in the Gregorian year, whole nisab, whole deductions, labelled "no published PPZ rule". (b) The × 12 basis the calculator gives by default.
- **Suggested:** (a) (`zakat.md`).
- **Changes in the calculation:** RM5,000 × 6 months in 2026, Kaedah 2: RM0 vs RM1,035 a year.
- **Asked by:** zakat Q7. **See:** [zakat.md §3.8](zakat.md#38-part-year-workers-job-changes-and-state-moves).

### ZAK6. Bonus timing in the 12-month simulation

- **Options:** (a) Even over 12 months. (b) On receipt. (c) Year-end top-up.
- **Suggested:** (a), matching the calculator (`zakat.md`).
- **Changes in the calculation:** timing of Net MTD and take-home, not annual zakat.
- **Asked by:** zakat Q8. **See:** [zakat.md §3.9](zakat.md#39-bonus-and-irregular-income).

### ZAK7. Non-cash benefits-in-kind

- **Options:** (a) Out by default, with an optional override. (b) Included.
- **Suggested:** (a) (`zakat.md`).
- **Changes in the calculation:** 2.5% of the amount, and it can cross the nisab.
- **Asked by:** zakat Q9. **See:** [zakat.md §2.1](zakat.md#21-what-counts-as-income).

### ZAK8. Female payers

PPZ's official calculator has a wife deduction only.

- **Options:** (a) No spouse deduction, as the official calculator does. (b) Let them choose.
- **Suggested:** none. `zakat.md` §5 says not to add a husband field, since PPZ publishes none.
- **Changes in the calculation:** up to RM5,000 of deductions: RM125 a year, or more across the nisab.
- **Asked by:** README Q12; zakat Q10. **See:** [zakat.md §2](zakat.md#2-applicability-rules).

### ZAK9. Child age and study

No test date or definition of "IPT" is published.

- **Options:** (a) User's own classification, with a note. (b) A stated default, such as status on 31 Dec.
- **Suggested:** (a) (`zakat.md`).
- **Changes in the calculation:** RM2,000 vs RM5,000 for that child. It can flip zakat by RM851.50 at the nisab (D3, D4 in `zakat.md` §6.3).
- **Asked by:** zakat Q11. **See:** [zakat.md §2](zakat.md#2-applicability-rules).

### ZAK10. Shared children

- **Options:** (a) Warn that each child belongs on one parent's assessment. (b) Allow both without comment, as PPZ's calculator does.
- **Suggested:** (a). It follows Pahang, not a WP rule (`zakat.md`).
- **Changes in the calculation:** deductions on one parent's assessment or both.
- **Asked by:** zakat Q12. **See:** [zakat.md §2](zakat.md#2-applicability-rules).

### ZAK11. Remote and hybrid workers

- **Options:** (a) Default the zakat state to the employer's office. (b) Use where the user physically works. (c) Ask "Which zakat body do you pay?" and default from the workplace state.
- **Suggested:** (c) (`zakat.md`).
- **Changes in the calculation:** whether the WP module applies at all.
- **Asked by:** zakat Q13. **See:** [zakat.md §2](zakat.md#2-applicability-rules).

### ZAK12. Selangor resident working in WP

Both bodies may claim this person.

- **Options:** (a) Let users override to "pay LZS / other state", which turns off the WP module and its PCB offset. (b) Follow the WP workplace rule strictly.
- **Suggested:** none.
- **Changes in the calculation:** WP zakat figures or none.
- **Asked by:** zakat Q14. **See:** [zakat.md §2](zakat.md#2-applicability-rules).

### ZAK13. Moving between states mid-year

- **Options:** (a) Flag as unsupported. (b) Count WP-period income only.
- **Suggested:** (a) (`zakat.md`).
- **Changes in the calculation:** the nisab test and zakat base for that year.
- **Asked by:** zakat Q15. **See:** [zakat.md §3.8](zakat.md#38-part-year-workers-job-changes-and-state-moves).

### ZAK14. LTAT members

PPZ is silent on LTAT.

- **Options:** (a) Deduct the 10% in the Kaedah 2 EPF line, as an editable, flagged assumption. (b) Leave it at 0, following PPZ's text literally.
- **Suggested:** (a) (`zakat.md`).
- **Changes in the calculation:** RM150 a year at RM5,000 a month.
- **Asked by:** zakat Q16. **See:** [zakat.md §2.2](zakat.md#22-worker-categories).

### ZAK15. Non-citizens paying zakat at home

- **Options:** (a) A note that this earns no Malaysian rebate. (b) Also PPZ's general preference for paying locally.
- **Suggested:** none.
- **Changes in the calculation:** wording only.
- **Asked by:** zakat Q18. **See:** [zakat.md §8.1](zakat.md#81-the-annual-rebate).

## Optional manual actions

Nothing is blocked by these. Only a person can do them.

| # | Action | Could settle | Source |
|---|---|---|---|
| M1 | **Run KWSP's calculator** once in a normal browser, with the nine inputs in [`epf.md` Q12](epf.md#questions-for-the-owner) | EPF3, EPF4, EPF5, the bonus note, the age switch | EPF Q12 |
| M2 | **Write to KWSP** (employer contact centre, 03-8922 6000 per the research) | Switch at 60 and 75; commission; fixed transport, festive gifts, directors' fees; part-month floor; i-Topup cap | EPF Q13 |
| M3 | **Three small EPF checks:** save the BM Oct 2025 PDF to `.research-cache/epf/verify/ts/`; search "354/2025" by hand on lom.agc.gov.my; get a federal payslip at RM5,000 or below | Part F table in BM; gazette text; 13% vs 12% for government staff | EPF Q14 |
| M4 | **Write to PERKESO** (perkeso@perkeso.gov.my, 1-300-22-8000). Also, if you can get one, a real opt-out notification for an August filer | D3, SOC1, SOC3, X1, X2, X4, X5; AWS, ex-gratia, sign-on, pay in lieu; PR and MyKAS opt-out (I10) | SOCSO Q16; EIS Q6 |
| M5 | **Write to PPZ** (info@zakat.com.my, 1-300-88-5757) | ZAK5, ZAK7, ZAK8, ZAK9, ZAK10, ZAK14; PZB divisor; a working wife's RM5,000 | Zakat Q19 |
| M6 | **Run e-PCB Plus for 2026** with an employer MyTax login. January, resident, single: (a) RM10,000, EPF 1,100, bonus 10,000, bonus EPF 1,100: expect 3,429.25. (b) RM7,777, EPF 0, bonus 3,333: expect 1,168.40. (c) RM3,700, EPF 407, bonus 10,000, bonus EPF 0: expect 984.00. (d) RM4,000, EPF 440: expect 16.70. If you don't, the rules ship marked as verified on the 2024 calculator and the spec | The RM10 and rounding order for 2026 | PCB Q6 |
| M7 | **Search lom.agc.gov.my yourself** under both P.U.(A) and P.U.(B) for "Keselamatan Sosial Pekerja" after 8 Jul 2026, plus Act 800 orders. Needed if D1 is "no" | The AGC-labelled findings. A notice would change the legal-basis note only, not amounts | SOCSO Q17; EIS Q7 |
| M8 | **Housekeeping:** remove leftover local portal files. The saved AGC portal copies were deleted on 2026-11-06 | Nothing in the calculation | EIS revision summary |

## Traceability

Every original question, and where it went.

| Source | Mapping |
|---|---|
| README | Q1 D2 · Q2 D3 · Q3 D7 · Q4 D2 · Q5 D3 · Q6 D7 · Q7 D2 · Q8 SOC4 · Q9 X3 · Q10 SOC5 · Q11 ZAK1 · Q12 ZAK8 · Q13 D6 · Q14 X6 · Q15 EPF3 · Q16 D4 · Q17 D3 · Q18 D2 · Q19 EPF1 · Q20 EPF6 · Q21 PCB1 · Q22 PCB2 · Q23 D5 · Q24 PCB3 · Q25 D6 · AGC note D1 |
| `epf.md` | Q1 D2 · Q2 EPF1 · Q3 D4 · Q4 D3 · Q5 EPF2 · Q6 X1 · Q7 X2 · Q8 EPF3 · Q9 EPF4 · Q10 EPF5 · Q11 EPF6 · Q12 M1 · Q13 M2 · Q14 M3 |
| `socso.md` | Q1 D2 · Q2 D3 · Q3 SOC1 · Q4 SOC2 · Q5 SOC3 · Q6 X1 · Q7 D4 · Q8 X4 · Q9 X5 · Q10 D7 · Q11 X3 · Q12 X3 · Q13 X7 · Q14 SOC4 · Q15 SOC5 · Q16 M4 · Q17 D1, M7 |
| `eis.md` | Q1 X4 · Q2 X5 · Q3 X1 · Q4 X2 · Q5 D3 · Q6 M4 · Q7 D1, M7 |
| `pcb.md` | Q1 PCB1 · Q2 PCB2 · Q3 D5 · Q4 PCB3 · Q5 D6 · Q6 M6 · Q7 PCB4 · Q8 PCB5 · Q9 PCB6 · Q10 PCB7 · Q11 X3 · Q12 D2 · Q13 PCB8 |
| `zakat.md` | Q1 ZAK1 · Q2 X6 · Q3 ZAK2 · Q4 ZAK3 · Q5 ZAK4 · Q6 D6 · Q7 ZAK5 · Q8 ZAK6 · Q9 ZAK7 · Q10 ZAK8 · Q11 ZAK9 · Q12 ZAK10 · Q13 ZAK11 · Q14 ZAK12 · Q15 ZAK13 · Q16 ZAK14 · Q17 X3 · Q18 ZAK15 · Q19 M5 |

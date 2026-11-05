# EPF (KWSP) research

First pass 2026-11-04 to 2026-11-05, revised after the deep verification pass on 2026-11-05. Scope: financial years 2025 and 2026, plus a 2027 template.

> **Access caveat.** `kwsp.gov.my` returns HTTP 403 to automated requests, and we did not try to get around that. KWSP documents below were read as public Wayback Machine captures of KWSP's own URLs, identified by capture date. KWSP's contribution calculator runs on a private service behind reCAPTCHA, so it was **never run**: its client code was read, but no official calculator output has been seen. Confidence is stated for each item.

**Terms used here.** *Wage month*: the month the pay is for. *Contribution month*: the month after, when EPF is paid (due by the 15th). *Band*: a wage range in the official table. *Share*: the employee's or employer's part of a contribution. *Floor*: the minimum wage that EPF is charged on when actual wages are lower. *PTB* (Pemberian Taraf Berpencen): the grant of pension status to a civil servant.

## Research status

**Complete for this pass.** Every first-pass to-do was worked, and the statutory amounts for ordinary employees now rest on KWSP's own PDFs. What remains can't be settled from public documents, and each item has a labelled default in §3 and `data/epf-config.json`.

**Still open**

| Item | Default used now | What would settle it |
|---|---|---|
| Part F rounding: KWSP publishes both methods | Each share rounded up, labelled "KWSP sources conflict" | KWSP calculator run (owner Q12) |
| How a rounded total above RM20,000 splits between employee and employer | Total rounded up; employee share rounded up; employer takes the rest | KWSP calculator run (Q12) |
| i-Topup method: statute and KWSP's 2026 examples differ | Table amount + whole-ringgit top-up | KWSP calculator run (Q12) or written answer |
| Wage month of the switch at 60 and stop at 75 | Month after the birth month (calculator code; no written rule) | KWSP written answer (Q13) |
| Fixed transport, petrol and car allowances | Subject to EPF, with a user override | KWSP written answer or Employer Guide Book (Q13) |
| Commission taking a month above RM5,000 | Does not trigger the 13% bonus note | KWSP written answer (Q13) |
| Part-time and part-month floor arithmetic | Pro-rated floor from KWSP's 2018 FAQ | KWSP written answer (Q13) |
| Whether i-Topup counts toward the RM100,000 cap | Warning only, never truncates | KWSP written answer (Q13) |
| RM2,000 minimum wage from June 2027 | Template only, `announced, not gazetted` | A gazetted Order |
| Gazette text of P.U.(B) 354/2025 | Number from one law firm, date well corroborated | Manual search on lom.agc.gov.my (Q14); changes no amount |
| BM edition of the October 2025 schedule | Not needed for any number | Saving the PDF in a browser (Q14) |
| 2027 contribution rates | Copy of 2026 | KWSP's 2027 schedule, if any |
| Newest evidence of "no change" | KWSP captures of 24 to 26 Oct 2026 | Re-check before release; 27 Oct to 5 Nov 2026 was not observed directly |

**Verified in this pass, in brief.** Parts A, C and E match KWSP's own July 2022 and October 2025 PDFs with 0 mismatches. Official Parts B and D are parsed. The Act A1760 commencement instrument is identified. Part F's age 75 stop is confirmed. The Basic Savings conflict and the Budget 2027 check are settled. The minimum-wage floor, the wage classification, the government mapping, bonus, arrears and separate-payroll rules were all researched and merged below. Reproduce the numeric checks with `python3 -I docs/research/data/verify-epf.py`: 30 passed, 0 failed with the local cache.

**Data files** (`docs/research/data/`)
- `epf-third-schedule-2025-10-part{A,C,E}.json`: official tables, in force for all of 2025 and 2026.
- `epf-third-schedule-2022-07-part{B,D}.json`: official tables, wage months up to September 2025. New.
- `epf-config.json`: year and period keyed config, floor periods, rounding switches, government categories. New.
- `epf-wage-components.json`: payslip item classification. New.
- `epf-basic-savings-by-age.json`: benchmarks, not used for take-home. New.
- `verify-epf.py`: reproducible checks. Standard library only. New.

## Questions for the owner

**Decisions**

1. **Government employees in v1.** Include a small selector, or leave government out of v1? Recommended selector: contract or EPF-option staff use the normal tables; staff awaiting pension status also use them; staff with pension status have no EPF. It would be labelled as based on the statutory schedule, because no federal circular or payslip states the rate.
2. **Foreign workers, January to September 2025.** Show "no EPF unless they elected", with Parts B and D as an advanced option?
3. **Bonus input.** Can the UI collect "wages excluding bonus" and "bonus" separately, with commission and incentives entered as wages? The 13% employer rule needs that split.
4. **Age input.** Collect birth month and year, or whole years only? Whole years are one month off in the birthday month: at RM5,000 that is RM550 of take-home. Do you accept "month after birth month" as the default, labelled unconfirmed in the app?
5. **Pay basis.** Default to "monthly-rated, full month" with an optional part-time, hourly or part-month section? Without it the calculator either overcharges a part-timer (about RM99 employee and RM117 employer a month at RM800) or undercharges a full-month low earner. Also, show the small-employer input for February to July 2025, which only 2025 back-calculations use? Recommended: yes to both.
6. **Fixed transport, petrol or car allowance.** Default to "subject to EPF", with a toggle labelled "my payslip shows no EPF on this"? The cost is about RM55 more employee deduction per RM500 than some payslips show until the toggle is used.
7. **Arrears.** Offer a full input (months and amounts, each month recalculated), or one current-month adjustment field with an estimate warning when RM5,000 is crossed? The first follows KWSP FAQ Q17; the second is simpler for new users.
8. **Part F rounding until KWSP confirms.** Round each share up with a visible "KWSP sources conflict" note (recommended), or show both results? The catch is a possible RM1 a month overstatement.
9. **Wages above RM20,000.** Ship the rounded total with the provisional split in §3 (recommended), or keep rounding each share? They differ by RM1 of total for about half of all wages above RM20,000, and the employee's own share may be RM1 off either way.
10. **i-Topup.** Ship table + whole-ringgit top-up as a labelled default (recommended), allow both percentage and ringgit input, and warn rather than truncate at RM100,000 a year? The two methods differ by up to RM12 of total payable a month in KWSP's RM6,250 examples.
11. **Basic Savings benchmark.** Leave it out of v1 or keep it as a labelled optional extra? It has no effect on take-home, and the 2026 by-age figures are lower than 2025's at every age, which could confuse new users. Recommended: leave it out.

**Things only you can do (optional, nothing is blocked)**

12. **Run KWSP's calculator once in a normal browser** and record these. We can't run it, and this would settle more than any other single step.

    | Inputs | Result to look for |
    |---|---|
    | Non-Malaysian, wage RM6,710, then RM1,751 | 135 + 135 and 36 + 36 mean per-share. Anything else means total rounding; note the split |
    | Citizen under 60, wage RM20,000.01 | Total 4,601 or 4,602, and how it splits |
    | Citizen under 60, wages / bonus 4,000 / 3,950 | Employer 1,034, employee 880 |
    | Citizen under 60, wages / bonus 2,800 / 5,210 | Employer 1,042, employee 891 (a vendor's method gives 1,053) |
    | Citizen under 60, wages / bonus 5,500 / 0 | Employer 660, employee 605 |
    | Citizen under 60, wages / bonus 4,000 / 20,000 | Employer 3,120 if the note has no ceiling, 2,880 if it does; employee 2,640 |
    | RM6,250, employee i-Topup +5% | 1,006 or 1,000 |
    | RM3,010, employee i-Topup +2% | 394 or 392 |
    | Born 15/03/1966, March 2026 wages, then April 2026 | Whether March is still at the under-60 rate |

13. **Ask KWSP in writing** (employer contact centre; 03-8922 6000 per the research):
    - If an employee turns 60 or 75 on 15 March, what applies to March wages, and does it change for a birthday on the 1st?
    - Does commission, rather than bonus, keep the employer on 13% when it takes a month above RM5,000?
    - Is a fixed transport allowance a "travelling allowance"? Are festive cash gifts and directors' fees wages?
    - Does the 2018 part-month and hourly floor method still apply, and does it divide by calendar days?
    - Does i-Topup count toward the RM100,000 voluntary limit?

14. **Three small manual checks.**
    - Save `https://www.kwsp.gov.my/documents/d/guest/jadual-ketiga-bm-1-okt-2025` to `.research-cache/epf/verify/ts/`. It would show whether the BM edition has a Part F table.
    - Search "354/2025" under Subsidiary Legislation > P.U.(B) on lom.agc.gov.my.
    - If you can get one, a federal payslip at RM5,000 or below from a contract or EPF-option officer would settle 13% versus 12% for government staff.

---

## 1. Summary for a non-expert
- EPF is a compulsory retirement savings scheme. Each month your employer deducts **your share** from your pay and adds **their share** on top. Both go into your EPF account.
- Under 60 (Malaysian or PR): you pay about **11%**. Your employer pays about **13%** if you earn RM5,000 or less, or **12%** above that.
- Aged 60 to 74 and Malaysian: you pay **0%** and your employer pays **4%**. PRs aged 60+ pay **5.5%**, and their employer pays 6.5% (≤ RM5,000) or 6%. Once you reach 75, contributions stop.
- Foreign workers (from October 2025 pay): **2% + 2%**. Domestic workers aren't required to contribute, though they may choose to.
- Amounts are **whole ringgit and always rounded up**. Up to RM20,000 a month they come from an official table that charges the percentage on the *top* of your RM20 (or RM100) wage band. So the deduction is often slightly more than a straight 11%.
- **If you earn less than the minimum wage, EPF is still charged as if you earned it.** For a full month that is RM1,700, so the least a Malaysian under 60 pays is RM187, and the employer RM221. Part-timers and part-month workers have a lower floor.
- Overtime and travel *claims* don't count toward EPF. Bonus, commission and most allowances do. A *fixed* transport allowance is genuinely unsettled, and most payroll guidance treats it as counted.
- Under 55, the money is split 75% to Akaun Persaraan (retirement), 15% to Akaun Sejahtera (housing, education, health) and 10% to Akaun Fleksibel (withdraw any time).

## 2. Applicability rules

**Which part applies**

| Employee category | Under 60 | 60 to 74 | 75+ |
|---|---|---|---|
| Malaysian citizen | Part A | Part E (0% / 4%) | none |
| Permanent resident | Part A | Part C (5.5% / 6.5% or 6%) | none |
| Non-citizen who elected before 1 Aug 1998 | Part A | Part C | none |
| Non-citizen who elected on/after 1 Aug 1998, **wages before Oct 2025** | Part B (ee 11%, er RM5) | Part D (ee 5.5%, er RM5) | none |
| Non-citizen employee, **wages from Oct 2025** (mandatory; transitional s.11 moves the elected group here) | Part F 2%/2% | Part F (no age split) | none |
| Foreign worker, **wages before Oct 2025**, not elected | none | none | none |
| Domestic servant (citizen or foreign) | not mandatory; may elect (KWSP 16 / 16B) | same | none |
| Self-employed | not covered by the Third Schedule; voluntary i-Saraan / i-Simpan | same | — |
| Government employee | by status, see below | by status | none |

In this table, ee means employee share and er means employer share.

**Applicability notes**
- **Part E** covers citizens who have attained 60. P.U.(A) 370/2018, in force 1 Jan 2019, deleted the old Part C(a), per the Act's amendment table and the schedule's own "Deleted by" marker. The parliamentary reply confirms the January 2019 start, with the employer rate falling from 6% to 4% and the employee rate from 5.5% to 0%, but it doesn't name Part E. The gazetted order itself was not read.
- **Age 75 stop: high confidence, all categories including Part F.** Act 452 First Schedule para (13) says a person "who has attained the age of seventy-five years" is not an employee, and s.50(2B)(a) bars crediting contributions after that age. Act A1760 s.9 deleted only paras (6) and (7), so para (13) stands. KWSP's employer page says "maximum age of contribution is 75 years old", and its non-Malaysian FAQ Q20, Q21 and Q27 say the same. A vendor's 0%/4% at 60+ for foreign workers (QNE) contradicts KWSP's FAQ Q22 and is disregarded.
- **Which wage month the switch takes effect.** See §3.1. Medium for 60, low for 75.
- **Directors who draw a salary, and part-time, contract, temporary and probationary staff, are all liable.** There is no minimum number of employees (FAQ Q22, Q26, Q28). "Contract" means a contract *of* service; a genuine contract *for* service is outside (Q10).
- **Liability:** wages above RM10.00 in a month or part of one (Q18, Q25).
- **KWSP minimum age:** 14.

**Non-citizens (Part F, from October 2025 wages)**
- First payment was due by 15 Nov 2025. The switch follows the wage month: September 2025 wages paid in October stay on the old parts. Act A1760 came into operation on 1 Oct 2025 under P.U.(B) 354/2025. The number comes from one law firm (Skrine) and the gazette text wasn't retrieved; the date is corroborated by Zul Rafique, KWSP's own pages and The Star.
- Part F has no age split at 60 and no wage limit ("No limit" on KWSP's page), though para 3 lets the Board set one.
- PRs and non-citizens registered before 1 Aug 1998 stay on Parts A and C ("remain status quo").
- The obligation also ends two months before a work pass expires if it isn't extended (s.70G; FAQ Q27), and in the month of death.
- **Domestic workers:** excluded from the mandate and from the floor, but may elect (FAQ Q6). KWSP's note takes the term from the Workmen's Compensation Act 1952: maids, cooks, gardeners, cleaners, babysitters, drivers and others. First Schedule para (2) keeps domestic servants employed by a registered business, society or corporation as employees. Para (8) also excludes foreign-domiciled staff with Board approval to join another scheme in Malaysia.
- **Voluntary contributions:** non-citizens can't use s.43(8) Self Contribution (A1760 s.6; employee FAQ Q28), but **can** contribute above the statutory rate under s.43(3), including keeping 11%, through KWSP 17A/18A (AHL) (employee FAQ Q22, Q27). KWSP's i-Topup FAQ says "Malaysian and Non-Malaysian" members under 75 may apply.
- **Accounts:** no separate structure. The restructuring applies to "all EPF members, including non-Malaysians" under 55 on 11 May 2024 (Q7), with Akaun Emas from 55 (Q8). The 75/15/10 split for them is inferred, medium-high. No i-Saraan, no Self Contribution, nominations only for pre-1 Aug 1998 registrants, and the account closes after a Leaving Country withdrawal.

**Parts B and D (non-citizens who elected, January to September 2025)**
- Confirmed from KWSP's own PDF. Each has 401 rows on the Part A bands. Employer RM5, employee from the Part A (B) or Part C (D) column.
- **"Flat RM5" isn't literal at the bottom:** wages of RM10 or less are NIL for both shares, and RM5 starts at RM10.01.
- Above RM20,000 the employee pays 11% (B) or 5.5% (D), rounded up, and the employer stays at RM5. Total and per-share rounding agree here, because RM5 is whole.
- They also cover elections under First Schedule para 3 on or after 1 Aug 1998 and para 6 on or after 1 Aug 2001. Para 6 electors from 1 Aug 1998 to 31 Jul 2001 are unresolved, with no effect on the rates.

**Government employees: by appointment status, not by sector**

No JPA or KWAP circular found sets a separate rate. JPA instruments defer to EPF law "in force", and s.43(1) has no government exception, so the ordinary Third Schedule applies. That is a strong inference, not an express statement: the only explicit figures come from UTM, a statutory body.

| Status | EPF? | Rates | Confidence |
|---|---|---|---|
| Interim contract, new federal hires from 1 Feb 2024 | Yes | Part A, or E at 60+; C for PR | Medium-high |
| Ordinary contract (COS) | Yes | Same | Medium-high |
| Permanent officer who chose the EPF scheme (s.6A of Acts 227 and 239) | Yes | Same | Medium-high |
| Permanent, on the pension track, **before PTB** (including probation) | Yes, until PTB | Same (rate inferred) | Medium |
| Pensionable officer **after PTB** | No | None | High |
| Future permanent contributory scheme | Not in force | Unknown | Not decided |

- **"New permanent civil servants from 2024 are non-pensionable" was wrong.** Cabinet decided on 12 Jul 2023. New federal entrants since 1 Feb 2024 are on **interim contracts** of 3 years or until a new permanent method starts, which needs Act amendments. The Edge (July 2026) reports the Prime Minister's written reply that details are still being refined, with the first contracts ending around 31 Jan 2027. No later change was found.
- **Excluded from interim contracts:** armed forces and police schemes, serving officers (PSB), PSL appointees, and COS officers with 15+ years under UP 1.1.11. State services, statutory bodies and local authorities are covered only if they adopt it. Sarawak's new state hires are a separate case: permanent, non-pensionable and on EPF (Suara Sarawak, Mar 2024).
- **"Government pays 12%" looks like an old simplification.** UMPSA's form and a 2018 UTM slide say 12% of emoluments. UTM's 2026 sheet says employee 11%, employer 13% (RM5,000 and below) or 12% (above), subject to rates in force, and its 2020 and 2023 payroll guides agree. It matters only at RM5,000 or below: at RM3,000, employer RM390 against RM360. Take-home is the same.
- **"Statutory bodies contribute" is too broad.** Their pensionable staff are on the Act 239 pension route, with the employer paying KWAP 17.5% of basic pay. Only their option, contract and non-pensionable staff contribute to EPF.
- **The EPF option is narrow.** It must be made before confirmation and is final at confirmation. The re-option ended on 1 Feb 2009.
- **Not modelled in monthly take-home:** KWAP 17.5% (employer-only) and contract gratuity, which uses (17.5% minus employer %) × final pay × whole months.
- **Conflict left open:** JPA UP.1.1.1 para 64 lets rehired citizen pensioners aged 55+ choose not to contribute, while KWSP's FAQ lists employees who made the 55 withdrawal and are under 75 as liable. A retiree toggle handles both.
- **Not checked:** armed forces (LTAT) and police contributions, Sarawak's employer rate, which civil-service allowances count as EPF wages, and the 15 Jan 2024 JPA circular text.

## 3. Calculation algorithm (with rounding)
Work in integer **sen** to avoid floating-point errors. `ceilRM(x)` means rounding up to the next whole ringgit.

```
// one computation per wage month, on that month's totals
wage = wagesExclBonus + bonus + currentAdjustments        // EPF wages only, see §3.3
if wage <= RM10.00: employer = employee = 0               // tested on actual wages
part = selectPart(category, ageForWageMonth(birthMonth, wageMonth), wageMonth)   // §2, §3.1
if part is none: employer = employee = 0
base = max(wage, minWageFloor(wageMonth, payBasis, employerSize, daysOrHours))   // §3.2

noteApplies = part in {A, C} && bonus > 0
              && wagesExclBonus + currentAdjustments <= 5,000 && wage > 5,000    // §3.4

upper = base <= 20 ? 20                                   // top of the band, up to RM20,000
      : base <= 5,000 ? ceil(base/20)*20
      : ceil(base/100)*100

if part in {A, C, E}:
  if base <= 20,000:
     employee = ceilRM(upper * rate.ee)
     employer = noteApplies ? ceilRM(base * rate.erLow)    // exact %, not the band top
              : ceilRM(upper * (upper <= 5,000 ? rate.erLow : rate.erHigh))
  else:
     er = noteApplies ? rate.erLow : rate.erHigh
     total = ceilRM(base * (rate.ee + er))                 // the schedule rounds the total
     employee = ceilRM(base * rate.ee)                     // PROVISIONAL split, RM1 uncertainty
     employer = total - employee
if part == F:
  employee = employer = ceilRM(base * 0.02)                // default; KWSP sources conflict
if part in {B, D}:
  employer = 5
  employee = base <= 20,000 ? ceilRM(upper * rate.ee) : ceilRM(base * rate.ee)

i-Topup: employee += ceilRM(wage * topUpEmployee); employer += ceilRM(wage * topUpEmployer)   // labelled default, §7
```

**Rates.** A is 13%/12% employer and 11% employee. C is 6.5%/6% and 5.5%. E is 4%/4% and 0%.

**How the table rule was checked**
- All 401 rows × Parts A, C and E match KWSP's own "Effective 1 October 2025" and "Effective 1 July 2022 to 30 September 2025" PDFs, with 0 mismatches. The BM 2022 edition, the 2019 edition and the GitHub cross-checks agree. Parts A, C and E therefore needed no change at October 2025.
- That includes 0.01–10 (NIL), 10.01–20, 4,980.01–5,000 (A: 650/550), 5,000.01–5,100 (A: 612/561) and 19,900.01–20,000 (A: 2,400/2,200).
- The formula is a description, not statutory text: the schedule prints a table. Up to RM20,000 each share is rounded separately, for example 10.01–20 gives 3 + 3 = 6, not 24% of 20. KWSP forbids exact percentages at or below RM20,000 for statutory shares.

**Above RM20,000: corrected.** The rates are the same, but the schedule says "the total contribution which includes cents shall be rounded to the next ringgit". KWSP's employer page, labelled "Correct approach", adds unrounded shares and rounds the sum (Example 2.1: RM2,550.00 + RM2,337.50 = RM4,887.50 = RM4,888).
- So RM20,000.01 in Part A totals **RM4,601**, not 4,602, and RM25,000.50 totals **RM5,751**, not 5,752. The two methods differ by RM1 for about half of all wages above RM20,000.
- **Confidence: medium.** KWSP's Part A and C examples can't separate the methods, because one share is whole in each. No official Part A or C example has sen in both shares. KWSP's non-Malaysian FAQ does round per share on Part F.
- **The split isn't stated anywhere.** The default (employee rounded up, employer takes the rest) is an inference, so an employer share can land a few sen under its exact percentage. Keep it as one config switch. The employee's take-home could be RM1 off until KWSP's calculator is run.
- The first-pass claim that KWSP's VE examples round per share was wrong: they round the sum (RM1,755.50 = RM1,756).
- A first-pass pseudocode bug is fixed: it applied 13% to every wage above RM20,000.
- Schedule para 2 lets the Board prescribe a limit. None was found, and KWSP's page says "No limit" for Parts E and F, so "no cap" isn't contradicted, but it isn't separately confirmed.

**Part F rounding: KWSP publishes both methods.**
- Per share: non-Malaysian FAQ, Employer Q23 and Employee Q24, unchanged across captures from 3 Oct 2025 to 20 Oct 2026: RM1,751 × 2% = RM35.02, so RM36 + RM36 = RM72 (the total method gives RM71).
- Total: mandatory-contribution page, Example 2.4, captures 6 Jan and 10 Aug 2026: RM6,710 gives RM134.20 + RM134.20 = RM268.40 = RM269 (per share gives RM270). The split isn't stated.
- The two methods differ by exactly RM1 when 0 < the sen part of 2% × wage ≤ 0.50. For whole-ringgit wages that is wage mod 50 from 1 to 25, about half of all wages.
- Default per share, because it's the example in KWSP's Part F-specific FAQ, it yields whole-ringgit shares, and a take-home figure needs a defined employee share. Label it "KWSP sources conflict", **not** "confirmed".
- **Why Part F and Parts A/C default differently:** Part F has an explicit KWSP per-share example in its own FAQ. Parts A and C have only the schedule's wording and total-level examples. If KWSP's calculator shows one method for both, both switches should follow it.
- MYWave doesn't reproduce a KWSP table. Its slides are its own infographic ("Method: Direct calculation"; RM10.01 gives RM1 + RM1). The official English schedule has no Part F band table, so don't build one.

**Note on the cliff at RM5,000.** At RM5,000.00 the employer pays RM650. At RM5,000.01 it pays RM612. Employer cost falls by RM38 while the employee's deduction rises by RM11.

### 3.1 Age switch timing
- **The text doesn't settle it.** The schedule says "attain the age of sixty years". The Act has a month rule for death (s.43(7)) but none for age. None of KWSP's FAQ text read names a switch month.
- **Best evidence: KWSP's own calculator.** `getAge(wageMonth, dob)` is identical in the 2022-07-04 and 2026-04-09 client code and was re-read in this revision. It compares a 0-indexed wage month with a 1-indexed birth month, so the birth month still counts as the old age. Born March 1966: March 2026 wages give 59, April 2026 gives 60. Born December 1966: December 2026 gives 59, January 2027 gives 60. Born March 1951: April 2026 gives 75.
- **Why it isn't settled.** The comparison could be an accidental off-by-one, and the server's thresholds aren't visible. Two uncited commercial blogs (hopesmalaysia, info-tech) state the same rule for age 60; about 13 other pages give no timing. Nothing names a month for age 75, and s.50(2B)(a) could cut against month-after there.
- **Default:** first wage month at the new age is the month after the birth month. Confidence is medium for 60 and low for 75. Keep timing as a setting, and test birthdays on the 1st and the last day of a month.
- **It matters for one month.** At RM5,000 a citizen goes from employee RM550 / employer RM650 to RM0 / RM200.
- **Whole-year input needs no timing logic:** age ≥ 60 uses Part E or C, and age ≥ 75 means no contribution. The old app's `age > 75` is wrong at exactly 75.
- KWSP's 2019 line "January 2019 salary/wage for contribution month of February 2019" is the start of that rate change, not a birthday rule.

### 3.2 Minimum-wage floor
Act 452 s.43(1A), as quoted on KWSP's pages: the monthly contribution of everyone subject to a minimum wages order "shall not be less than the monthly contributions based on the amount of the minimum wages for the month as determined under the minimum wages order at the rate respectively set out in the Third Schedule".

**It applies to all Parts, not just Part F, and it raises the employee's deduction too.** KWSP's i-Akaun Employer guide p.83 shows RM1,700 with minimum RM221/RM187 for Malaysians and RM34/RM34 for non-Malaysians, and its calculator request carries a minimum-wage validation flag. It isn't a flat RM1,700 for everyone:

| Pay basis | Floor | Confidence |
|---|---|---|
| Monthly-rated, full month | Monthly rate | High |
| Monthly-rated, part month (joiner or leaver; unpaid leave is an extension) | Monthly rate × days eligible ÷ days in wage period | Medium: KWSP 2018 FAQ Q21 gives the principle, Employment Act s.18A the proposed divisor |
| Daily-rated | Daily rate for days per week × days worked | Medium |
| Hourly or part-time | Hourly rate × hours worked | Medium: FAQ Q17 says the floor applies, with no formula |
| No basic pay: piece, task, trip or commission only | Monthly rate, flat | High for full month; part month not addressed by any source |

**Floor periods by wage month**

| Wage months | Who | Monthly | Hourly | Daily (6 / 5 / 4 days a week) | Instrument |
|---|---|---|---|---|---|
| to 2025-01 | All | 1,500 | 7.21 | 57.69 / 69.23 / 86.54 | P.U.(A) 140/2022 |
| 2025-02 to 2025-07 | 5+ employees, or a MASCO professional activity at any size | 1,700 | 8.72 | 65.38 / 78.46 / 98.08 | P.U.(A) 376/2024 para 3 |
| 2025-02 to 2025-07 | Fewer than 5, not MASCO professional | 1,500 | 7.21 | 57.69 / 69.23 / 86.54 | P.U.(A) 376/2024 para 4 |
| 2025-08 onward | All | 1,700 | 8.72 | 65.38 / 78.46 / 98.08 | P.U.(A) 376/2024 paras 3, 5 |
| 2027-06 onward (**template**) | Non-exempt | 2,000 | not set | not set | Budget 2027, **not gazetted** |
| 2027-06 onward (**template**) | MSME under RM50m sales | 1,700 (assumed) | 8.72 | as above | Exemption, period unstated |

**Reading notes**
- The small-employer deferral also deferring the EPF floor is a statutory reading, medium-high. No KWSP statement covers February to July 2025.
- Wage-month mapping is inferred from KWSP's 2018 FAQ Q2. Neither instrument starts mid-month.
- **Outside the floor:** domestic servants (MWO para 2). Apprentices owed EPF throughout, but the floor applies to them only from 2025-08 wages, when the NWCC (Amendment) Act 2025 took effect (inference). UNHCR cardholders aren't EPF employees (2018 FAQ Q20). Self-employed i-Saraan members have no contract of service.
- **Parts B and D:** the floor text covers "the rate respectively set out in the Third Schedule", so it should apply to them in 2025. No source states this, so treat it as inference.
- **Public sector:** KWSP's 2018 FAQ says the floor applies to public employees on EPF, while MOHR describes the Order as private-sector. Unresolved, with little practical effect.
- **The test compares contributions, and EPF wages include allowances**, while the minimum wage itself is basic pay. So basic RM1,500 + allowance RM300 = EPF wage RM1,800 gives 198/234 from the table and the floor doesn't bite, even though the basic pay breaches the Order. This is a reading, not a KWSP statement.
- **RM10 test:** run on actual wages first (inference). KWSP's "RM10.01" liability example dates from March 2013, before Minimum Contribution began in January 2019. It stays consistent: an hourly worker paid RM10.01 for one hour has a floor of RM8.72, so band 10.01–20 applies and gives 3/3. A monthly-rated worker with 1 of 31 days has a floor of RM54.84, giving 7/8. Part F itself prints no NIL row, so for Part F this rests on the general FAQ.
- **i-Akaun's check is a warning.** p.83 says an error shows under RM1,700, but the screen reads "Please amend the details provided or click Next to proceed". So it isn't proof of a flat floor.
- Show a warning when wage is below the floor. It also signals a possible breach by the employer.
- **RM2,000 status at 2026-11-05.** The speech says the rate takes effect "mulai Jun 2027" and "PMKS dengan hasil jualan di bawah 50 juta ringgit dikecualikan". MOHR's minimum-wage site still shows the 2024 Order, and no P.U.(A) number has been reported. The day in June and the exemption period are unconfirmed. Derived rates (RM10.26/hour) are not official and shouldn't be shipped. The RM2,500 semi-skilled and graduate minimum has no instrument and is **not** a floor.

### 3.3 What counts as EPF wages
**The test** (Act 452 s.2): "all remuneration in money, due to an employee under his contract of service or apprenticeship", including "any bonus, commission or allowance ... whether ... payable under his contract of service, apprenticeship or otherwise". An allowance counts by default, and substance beats the label. KWSP says its non-wage list "is not exhaustive", and s.2(g) lets the Minister exempt more (no order found).

**Counts (stated by the Act or KWSP FAQ Q8):** salary, bonus (contractual or not), allowances, commission, incentives, arrears, unused annual or medical leave pay, paid maternity, study and half-day leave, a driver's trip allowance (Q23), salaried director's pay, and other payments under the service contract or otherwise.

**Doesn't count (stated, FAQ Q11 and s.2):** service charge including customer tips, overtime (including work on public holidays and rest days), gratuity, retirement, retrenchment, lay-off and termination benefits, pay in lieu of notice (KWSP's position; not named in s.2), and "any travelling allowance or the value of any travelling concession".

**Common payslip items** (full list with confidence in `data/epf-wage-components.json`)

| Item | EPF | Basis |
|---|---|---|
| Fixed transport, petrol, toll or parking allowance; car allowance | **Unsettled**: default counts, with override | Vendors and Donovan & Ho treat fixed sums as wages. s.2(f) and KWSP's 2012 page ("to cover travelling and transport expenses") draw no such line. No KWSP test found |
| Mileage, toll or parking claims at actual cost | Doesn't count | s.2(f); commentary |
| Fixed meal, phone, housing, shift, cost-of-living | Counts | Commentary and vendors; no KWSP statement |
| Attendance, standby on-call | Counts | Inference |
| Genuine expense reimbursement | Doesn't count | Meaning of "remuneration", not s.2's wording. A label isn't enough |
| Non-cash benefits, company car, employer-provided housing | Doesn't count | "in money" (inference). Cash in lieu counts |
| Ex-gratia during employment / on exit | Counts (inference) / doesn't count (gratuity or termination) | s.2 |
| Festive bonus / cash gift | Counts (inference) / **unsettled** | Some vendors exempt gifts; KWSP doesn't list them |
| Director's fee | Doesn't count | KWSP's 2012 page and vendors. Owner-director fees are a grey area |
| Share options | Doesn't count | Donovan & Ho: "no local precedents". Cash-settled awards could count |

**Case law.** *Maniam Subramaniam v Cold Chain Network* (KL High Court, 14 Aug 2017, press reports of an oral ruling only): a driver's per-trip pay labelled "reimbursement" was wages, because the employer paid fuel and tolls. It doesn't decide fixed allowances.

**Money at stake.** Adding RM500 to RM3,000 moves employee 330 → 385 and employer 390 → 455. Adding RM500 to RM4,800 moves employee 528 → 583 and employer 624 → 636, because the rate falls at RM5,000.

**Where SOCSO and EIS differ, so inputs must be separate:** overtime (EPF no; SOCSO/EIS yes), annual bonus (EPF yes; SOCSO/EIS no), service charge (EPF no; SOCSO yes; EIS as practical reading). Show a note that results can differ from a payslip when an employer classifies an allowance differently.

### 3.4 Bonus, commission, arrears and separate payroll runs

**Bonus note (Parts A and C only).** Verbatim, Part A: "Where the employer pays bonus to an employee who receives monthly wages of RM5,000.00 and below, and upon receiving the said bonus renders the wages received for that month to exceed RM5,000.00, the employer's contribution shall be calculated at the rate of 13% of the amount of wages for the month. The total contribution which includes cents shall be rounded to the next ringgit." Part C says 6.5%. Part E and Part F have no note. A bonus therefore does **not** push the employer from 13% down to 12%.

- **Employer share:** exact rate on actual wages, rounded up. High. One vendor (QNE) applies 13% to the band top instead: RM1,053 against RM1,042 at RM8,010. The statutory wording supports actual wages.
- **Employee share:** table lookup on total wages, or exact 11% above RM20,000. Medium-high: consistent text and vendors (Talenox, HReasily, QNE, Worksy), no official example.
- **Commission, incentive or allowance doesn't trigger the note.** Medium. The note says "bonus", and s.2 and FAQ Q8 list these separately. KWSP's calculator has only "Wages without Bonus" and "Bonus only" fields. Worksy disagrees, with no citation.
- **The RM5,000 test** runs each month on that month's EPF wages excluding bonus. No averaging or look-back rule was found. A commission earner's employer rate can move month to month. Inference, medium.
- **Above RM20,000 the note has no ceiling**, while the Part's closing sentence says 12%. Recommended reading: the specific note wins, which also avoids a cliff at RM20,000. Low-medium. RM4,000 + RM20,000 gives employer 3,120 against 2,880, a RM240 gap.

**Arrears.** KWSP FAQ Q17: annual-increment arrears are contributed "on the actual month". FAQ Q20: a salary adjustment "is not a scheduled payment and not subject to any particular month", so it goes in the current month. KWSP gives no definition or worked example.
- Backdated rises and unpaid wages for named months go to the actual month. Unscheduled adjustments not tied to a month go to the current month, added to that month's wages. Inference, medium.
- "Actual month" means recalculating: add the arrears to that month's original wages, apply that month's band, rate, Part, age and floor, and pay the difference. Inference.
- The employee's top-up is deducted when the arrears are paid (s.48(4)). The employer's top-up can be negative.
- Arrears aren't bonus, so the note doesn't apply.

| Rise, effective January, paid in March (3 months' totals) | Recalculated: er / ee | Lump sum in March: er / ee |
|---|---|---|
| 3,000 → 3,300 | 1,287 / 1,089 | 1,287 / 1,089 |
| 8,000 → 8,500 | 3,060 / 2,805 | 3,060 / 2,805 |
| 4,900 → 5,200 | 1,872 / 1,716 | 1,970 / 1,716 |
| 4,950 → 5,050 | 1,836 / 1,683 | 1,926 / 1,675 |
| 4,500 → 4,800 | 1,872 / 1,584 | 1,818 / 1,584 |

**Separate payroll runs in one wage month: aggregate.** One computation per wage month on total wages; the later run pays the total minus what was already paid. Basis: s.43(1), FAQ Q13, and the calculator tooltip ("Bonus calculations should be calculated along with the amount of pay for the selected contribution month"). Per-run lookups give wrong results: 2,810 + 5,210 gives employee 894 instead of 891.

## 4. Per-year config

Full version: `data/epf-config.json`.

| Year | Period (wage months) | Rules | Status |
|---|---|---|---|
| 2025 | 2025-01 → 2025-09 | A/C/E tables; B/D for non-citizens who elected on/after 1998; foreign workers otherwise none; i-Saraan 20%, RM500/yr | confirmed from KWSP's PDF |
| 2025 | 2025-10 → 2025-12 | A/C/E unchanged; **Part F 2%/2%**; B/D deleted; domestic workers excluded | confirmed |
| 2026 | 2026-01 → 2026-12 | Same rates; i-Saraan Plus RM600/yr; i-Suri to age 60; i-Simpan / i-Topup renamed; RIA framework | confirmed to the newest capture (24–26 Oct 2026) |
| 2027 | 2027-01 → 2027-05 | Copy of 2026 | **template** |
| 2027 | 2027-06 → 2027-12 | Copy of 2026, with the RM2,000 floor for non-exempt employers | **template, not gazetted** |

The minimum-wage floor has its own periods, which cut across these (§3.2).

**2025 evidence.** KWSP's Third Schedule page, captured 24 Oct 2026 and marked "Last updated: 26 May 2026", lists "Effective 1 July 2022 to 30 September 2025" and "Effective 1 October 2025" as the latest. Earlier rows end "1 January 2021 to 30 June 2022", so there's no later reduced-rate table. A second KWSP-hosted copy (`bi-jadual-ketiga-20240730.pdf`, Part B employee 9%) is the expired 2021–22 table. **Don't build from it.**

**2027 notes.** The Budget 2027 speech was read directly: tabled 9 Oct 2026, with no mention of "kadar caruman" or "Jadual Ketiga". This shows nothing was announced, not that no order can follow.
- EPF items: automatic membership at 18 (para 35, p.32, no date, no effect on amounts); e-hailing and p-hailing match up to RM600 a year or RM6,000 lifetime (p.32); i-Emas monthly payouts at 55 or 60 (para 76, p.47); under-55s may pay MediAsas premiums from Akaun Sejahtera (p.50); Simpanan Shariah members may pay zakat directly from dividends (p.46), worth a cross-reference in `zakat.md`.
- The annex (p.107) groups i-Saraan, i-Saraan Plus and i-Suri under "up to RM600 a year or RM6,000 lifetime", while the speech applies that to e-hailing and p-hailing only, and KWSP's i-Saraan page of 23 Oct 2026 still says RM500/RM5,000. Keep the separate caps, marked unconfirmed.
- MOF said in October 2026 that the 2% foreign-worker rate is relatively low, and KWSP says it's "subject to revision". No change announced. A former EPF CEO's September 2026 proposal for different employer rates was only a proposal.
- First federal interim contracts end around 31 Jan 2027 (§2).

**Other configuration values**
- **Account split:** under 55, 75/15/10. From 55, everything goes to Akaun Emas.
- **Voluntary cap:** RM100k a year.
- **Dividends:** 2023 5.50/5.40; 2024 6.30/6.30; 2025 6.15/6.15.
- **No reduced-rate election in 2025 or 2026.** The 2020–2022 reductions ended with June 2022 wages: P.U.(A) 467/2021 extended P.U.(A) 387/2020 only "from 1 January 2022 to 30 June 2022".

**Basic Savings (Simpanan Asas): settled, not used for take-home.** KWSP edited its 12 Dec 2024 release in place, keeping the original date.
- Original: RM290k by 2026, RM340k by 2027, RM390k by 2028, which Utusan reported.
- Revised, after 4 Aug 2025 and by 22 Feb 2026: **RM270k, RM300k, RM330k, RM360k, RM390k at age 60, from 1 Jan 2026 to 2030**, following Ministry of Finance approval. RinggitPlus's figures match this.
- 2019–2025: RM240k at age 55, from KWSP's i-Invest page.
- **Trap:** every 2026 by-age value is lower than 2025's at the same age, because the anchor moved from 55 to 60. Age 30 goes RM35,000 → RM26,300; age 55 goes RM240,000 → RM203,000. So "RM240k to RM270k" isn't like for like.
- The 2026 age points (30: RM26,300; 40: RM74,000; 50: RM150,000; 60: RM270,000) are secondary but strongly corroborated. Ages 56 and 58 rest on one blog. Ages 56–59 for 2027–2029 were not found and aren't interpolated. Table in `data/epf-basic-savings-by-age.json`.
- Related thresholds from the same release: withdrawal of savings above RM1m rises to RM1.1m in 2026, RM1.2m in 2027 and RM1.3m in 2028. Adequate is RM650k and Enhanced is RM1.3m at age 60.

## 5. Proposed TypeScript-shaped schema
```ts
type PartId = 'A'|'B'|'C'|'D'|'E'|'F';
type Category = 'citizen'|'pr'|'nonCitizenPre1998'|'nonCitizenPost1998Elected'|'foreignWorker'|'domesticWorker'|'selfEmployed'
  |'govContract'|'govEpfOption'|'govPensionPrePTB'|'govPensionable';
type Rounding = 'ceilPerShare'|'ceilTotal';
interface BandedPart { kind:'banded'; id:'A'|'C'|'E'; tableFile:string; nilAtOrBelow:10;
  bands:{upTo:number; width:number}[];            // [{upTo:20,width:10},{upTo:5000,width:20},{upTo:20000,width:100}]
  erLow:number; erHigh:number; erThreshold:5000; ee:number;
  above20000:{rounding:Rounding; split:'employeeCeilEmployerRemainder'; confidence:'medium'}; bonusKeepsErLow:boolean; }
interface PercentPart { kind:'percent'; id:'F'; er:0.02; ee:0.02; nilAtOrBelow:10; wageCap:number|null;
  rounding:Rounding; roundingStatus:'sourcesConflict'; ageMin:14; }
interface FlatEmployerPart { kind:'flatEmployer'; id:'B'|'D'; tableFile:string; nilAtOrBelow:10; erFlat:5; eeFromPart:'A'|'C'; confidence:'high'; }
interface MinWageRates { monthly:number; hourly:number|null; daily:Record<4|5|6,number>|null; pieceRateMonthly:number|null; }
interface MinWagePeriod extends Partial<MinWageRates> { from:string; to:string|null; status:'confirmed'|'announced'; instrument:string;
  standard?:MinWageRates; smallEmployer?:MinWageRates; exemptMsmeBelowRm50mSales?:Partial<MinWageRates>; }
type PayBasis = 'monthly'|'daily'|'hourly'|'noBasicPieceOrCommission';
interface EpfMonthInput { wageMonth:string; wagesExclBonus:number; bonus:number; currentAdjustments:number;
  arrears:{wageMonth:string; amount:number}[]; payBasis:PayBasis; daysEligible?:number; daysInWagePeriod?:number; daysWorked?:number; hoursWorked?:number;
  employerSmallNonMasco?:boolean; msmeBelowRm50m?:boolean; retireeOptOut?:boolean; }
interface AgeBoundaries { rateSwitchAge:60; stopAge:75; rateSwitchTiming:'monthAfterBirthMonth'|'birthdayMonth'; stopTiming:'monthAfterBirthMonth'|'birthdayMonth'; }
interface TopUp { input:'percent'|'ringgit'; method:'tablePlusWholeRinggit'|'combinedRateOnActualWage'; methodStatus:'sourcesConflict'; }
interface EpfPeriod { from:string; to:string; /* wage months, inclusive */ status:'confirmed'|'inferred'|'announced'|'template';
  parts:Partial<Record<PartId, BandedPart|PercentPart|FlatEmployerPart>>;
  selection:{category:Category; minAge:number; maxAgeExcl:number; part:PartId|null}[];
  accountSplit:{under55:{persaraan:.75; sejahtera:.15; fleksibel:.10}; from55:{emas:1}};
  voluntary:{annualCap:100000; schemes:string[]; iTopup:{countsTowardCap:'conflicting'; behaviour:'warnOnly'}};
  iSaraan?:{matchRate:number; annualCap:number; lifetimeCap:number; maxAge:60};
  iSaraanPlus?:{matchRate:number; annualCap:number; lifetimeCap:number; maxAge:60}; // shares the lifetime pool; only one incentive a year
  sources:string[]; }
interface EpfYear { year:number; status:'confirmed'|'template'; periods:EpfPeriod[]; dividend?:{conventional:number; syariah:number}; }
interface EpfConfig { ageBoundaries:AgeBoundaries; topUp:TopUp; minWagePeriods:MinWagePeriod[]; wageComponentsFile:string; years:EpfYear[]; }
```

## 6. Worked examples
Computed from the verified tables and checked by `verify-epf.py`. KWSP's online calculator was not run. Unless stated, wage months are from August 2025, monthly-rated, full month, floor RM1,700.

**Core cases**

| # | Case | Wage (RM) | Part / band | Employee | Employer |
|---|---|---|---|---|---|
| 1 | citizen, 30 | 10.00 | A, NIL | 0 | 0 |
| 2 | citizen, 30 | 1,700 | A, 1,680.01–1,700 | 187 | 221 |
| 3 | citizen, 30 | 2,950 | A, 2,940.01–2,960 | 326 | 385 |
| 4 | citizen, 30 | 5,000.00 | A, 4,980.01–5,000 | 550 | 650 |
| 5 | citizen, 30 | 5,000.01 | A, 5,000.01–5,100 | 561 | 612 |
| 6 | citizen, 30 (from KWSP's i-Topup illustration) | 6,250 | A, 6,200.01–6,300 | 693 | 756 |
| 7 | citizen, 45 | 12,345 | A, 12,300.01–12,400 | 1,364 | 1,488 |
| 8 | citizen, 40 | 20,000.01 | A, % | 2,201 *provisional* | 2,400 *provisional*; **total 4,601** (was 2,401, total 4,602) |
| 9 | citizen, 40 | 25,000.50 | A, % | 2,751 *provisional* | 3,000 *provisional*; **total 5,751** (was 3,001, total 5,752) |
| 10 | citizen, 62 | 4,500 | E | 0 | 180 |
| 11 | age 60+ (from KWSP's i-Topup illustration) | 6,250 | E | 0 | 252 |
| 12 | PR, 62 | 8,000 | C, 7,900.01–8,000 | 440 | 480 |
| 13 | citizen, salary 4,000 + bonus 4,000 | 8,000 | A + bonus note | 880 | 1,040 (the table would give 960) |
| 14 | foreign worker, Nov 2025 | 1,725 | F | 35 | 35 (if the total is rounded instead: RM69 total, split unstated) |
| 15 | foreign worker, Mar 2025 (not elected) | 1,725 | none | 0 | 0 |
| 16 | citizen, 30, i-Topup +2% employee | 3,000 | A + i-Topup | 330 + 60 = 390 | 390 |

Case 16 is the same under both i-Topup methods only because RM3,000 is the top of a band.

**KWSP's own examples, employer page captured 2026-08-10**

| # | Case | Wage | Employee | Employer |
|---|---|---|---|---|
| 52 | Part A | 3,250 | 359 | 424 |
| 53 | Part A | 6,710.80 | 748 | 816 |
| 54 | Part E | 3,250 | 0 | 131 |
| 55 | Part C | 3,250 | 180 | 212 |
| 41 | Part A, total 4,888 per KWSP (2,338 + 2,550 is our split) | 21,250 | 2,338 | 2,550 |
| 42 | Part C, total 2,444 per KWSP (1,169 + 1,275 is our split) | 21,250 | 1,169 | 1,275 |

**Minimum-wage floor**

| # | Case | Actual wage | Floor | Employee | Employer | On actual wage |
|---|---|---|---|---|---|---|
| 17 | citizen under 60, full month | 1,550 | 1,700 | 187 | 221 | 172 / 203 |
| 18 | citizen 60+ | 1,550 | 1,700 | 0 | 68 | 0 / 63 |
| 19 | PR 60+ | 1,550 | 1,700 | 94 | 111 | 86 / 102 |
| 20 | Part F | 1,550 | 1,700 | 34 | 34 | 31 / 31 |
| 21 | citizen, Apr 2025, small employer (also Jan 2025, any employer) | 1,400 | 1,500 | 165 | 195 | 154 / 182 |
| 22 | citizen, Apr 2025, other employer (also Aug 2025, any employer) | 1,400 | 1,700 | 187 | 221 | 154 / 182 |
| 23 | hourly, RM10 × 80 h | 800 | 697.60 | 88 | 104 | same |
| 24 | hourly, RM7 × 80 h | 560 | 697.60 | 77 | 91 | 62 / 73 |
| 25 | monthly RM1,800, 10 of 30 days (min. wage RM1,700 × 10/30) | 600 | 566.67 | 66 | 78 | same |
| 26 | citizen, Jun 2027 template, non-exempt | 1,800 | 2,000 | 220 | 260 | 198 / 234 |
| 27 | Part F, Jun 2027 template, non-exempt | 1,800 | 2,000 | 40 | 40 | 36 / 36 |
| 28 | citizen, Jun 2027 template, exempt MSME (assumed) | 1,800 | 1,700 | 198 | 234 | same |

Misapplying RM1,700 to case 23 would give 187/221, overcharging 99/117 a month. A domestic worker who elected has no floor.

**Bonus and commission**

| # | Case | Total | Employee | Employer | Note |
|---|---|---|---|---|---|
| 29 | 4,000 + 3,950 bonus | 7,950 | 880 | 1,034 | Separates the readings: exact 11% would give 875; the table employer is 960 |
| 30 | 2,800 + 5,210 bonus | 8,010 | 891 | 1,042 | QNE gives 1,053 |
| 31 | 3,000 + 2,500 bonus | 5,500 | 605 | 715 | |
| 32 | 3,000 + 1,500 bonus | 4,500 | 495 | 585 | Total ≤ 5,000, note not engaged |
| 33 | 4,000 + 1,500 commission | 5,500 | 605 | 660 | Commission: table |
| 34 | 4,500 + 800 commission + 2,000 bonus | 7,300 | 803 | 876 | Excluding bonus is 5,300: note off |
| 35 | 4,500 + 300 commission + 2,000 bonus | 6,800 | 748 | 884 | Excluding bonus is 4,800: note on |
| 36 | 4,000 + 20,000 bonus | 24,000 | 2,640 | 3,120 | 2,880 if the 12% sentence wins; low-medium |

**Above RM20,000, other Parts**

| # | Part | Wage | Total | Employee | Employer |
|---|---|---|---|---|---|
| 37 | C | 20,000.01 | 2,301 (was 2,302) | 1,101 *provisional* | 1,200 *provisional* |
| 38 | C | 25,000.50 | 2,876 (was 2,877) | 1,376 *provisional* | 1,500 *provisional* |
| 39 | E | 20,000.01 | 801 | 0 | 801 |
| 40 | E | 25,000.50 | 1,001 | 0 | 1,001 |

**Part F, per share with the total alternative in brackets**

| # | Wage | Employee | Employer | Total (if total-rounded) | Source |
|---|---|---|---|---|---|
| 43 | 1,751 | 36 | 36 | 72 (71) | KWSP FAQ Q23 shows 72 |
| 44 | 6,710 | 135 | 135 | 270 (269) | KWSP Example 2.4 shows 269 |
| 45 | 3,250 | 65 | 65 | 130 (130) | KWSP Example 2.4 |

**Parts B and D, wages before October 2025**

| # | Part | Wage | Employee | Employer |
|---|---|---|---|---|
| 46 | B | 10.01 | 3 | 5 |
| 47 | D | 10.01 | 2 | 5 |
| 48 | B | 5,000 | 550 | 5 |
| 49 | D | 5,000.01 | 281 | 5 |
| 50 | B | 20,000.01 | 2,201 | 5 |
| 51 | D | 25,000.50 | 1,376 | 5 |

**i-Topup, the two methods** (Part A unless stated)

| Case | Table + whole ringgit (statute; default) | Combined rate on actual wage (KWSP 2026 pages) |
|---|---|---|
| RM3,000, employee +2% | 330 + 60 = 390 | 13% × 3,000 = 390 |
| RM3,010, employee +2% | 333 + 61 = 394 | 13% × 3,010 = 391.30, so 392 |
| RM6,250, employee +5% | 693 + 313 = 1,006; total payable 1,762 | 16% × 6,250 = 1,000; KWSP's total 1,750 (uses employer 12% = 750) |
| RM6,250, employer +5% | 756 + 313 = 1,069; total payable 1,762 | 17% × 6,250 = 1,062.50; KWSP's total 1,755.50 = 1,756 |
| RM6,250, 60+, employer +5% | 252 + 313 = 565 | 9% × 6,250 = 562.50 = 563 |
| RM6,250, 60+, employee +5% | 313 + 252 = 565 | 312.50 + 252 = 564.50 = 565 |
| RM1,000, any of the above +5% | 290 (under 60), 90 (60+) | Same |

## 7. User-selectable options
- **Employee i-Topup, and employer i-Topup (contract dependent).** Formerly Voluntary Excess, renamed from January 2026. Either a percentage or a ringgit amount: KWSP's calculator takes both, limited to 100% and to total wages. Both parties may contribute above the rate, and the last rate chosen stays until cancelled. Employee forms KWSP 17A(AHL)/18A(AHL), or i-Akaun since 16 May 2026. Employers need no form and use i-Akaun; the older KWSP 17(MAJ) form no longer appears on the current page. Self-employed members can't use it.
- **i-Topup calculation: labelled default, sources conflict.** Act 452 s.43(3) allows a rate that "exceeds the rate respectively set out in the Third Schedule by one ringgit or a multiple of one ringgit", which fits table + whole-ringgit top-up, and KWSP's 2022 page used it for under-60s. KWSP's 2026 pages apply a combined rate to actual wages instead, which moves the total payable by RM2 to RM12 in its RM6,250 examples. Those pages are internally inconsistent: the unchanged share is the table amount in some rows (693, 252) but exact 12% (750) in another, and KWSP's employer page separately calls exact-percentage amounts at RM6,250 inaccurate for statutory shares. KWSP's 2022 page also shows 563 at 60+. We can't tell what i-Akaun enforces. The start date of the page change is unknown; the earliest capture with the new examples is 9 Jan 2026.
- **No reduced-rate election exists for 2025 or 2026.** Rates below statutory aren't allowed (s.43(1), (1A)).
- **Voluntary cap: RM100k a year.** The Star (2022) gives RM60k to RM100k with no date. The 1 Jun 2023 start comes from the Deputy Finance Minister in the Dewan Rakyat, via an MOF press clipping of a Bernama report, and that's the only source found. The list varies by year:
  - 2025 (KWSP capture Sep 2025): Self Contribution, i-Saraan, i-Suri, Akaun Persaraan Top-Up.
  - 2026 product pages (latest 23 Oct 2026): i-Simpan, i-Saraan, i-Saraan Plus, i-Suri, Akaun Persaraan Top-Up.
  - 2026 Terms & Conditions s.3.2 (latest Mar 2026): i-Simpan, **i-TopUp**, i-Saraan, i-Suri, Akaun Persaraan Top-Up.
- **Does i-Topup count? KWSP conflicts with itself.** The T&C is the only KWSP text addressing it directly, but it omits i-Saraan Plus, so it isn't fully maintained. Product pages omit i-Topup. StashAway's "no" rests on those product pages. AJobThing doesn't directly address i-Topup. A refund of excess is documented only for i-Simpan. Practical impact is tiny: a 5% top-up reaches RM100k only at about RM2m a year in wages. Warn, don't truncate.
- **i-Saraan** (self-employed and others): 20% match (from 1 Jan 2025, up from 15%), capped at RM500 a year and RM5k lifetime or age 60. Lifetime room counts incentives since 2024. Citizens only; also open to pensionable civil servants and serving military.
- **i-Saraan Plus** (e-hailing and p-hailing, through the service provider, from 1 Jan 2026): 20%, capped at RM600 a year and RM6k lifetime, also below 60. RM3,000 contributed earns the full RM600.
- **A member gets only one of i-Saraan or i-Saraan Plus in a year**, and the Plus lifetime limit isn't a fresh pool: it counts incentives since 2024. Separate counters would be wrong.
- **i-Suri** (housewives, not a self-employed scheme): 50%, capped at RM300 a year and RM3k lifetime. Age limit raised from 55 to 60 from 1 Jan 2026 per KWSP's release and Budget 2026. KWSP's T&C of Mar 2026 still says below 55, treated as stale. The incentive needs eKasih registration. Rests on the release and budget documents; KWSP's i-Suri page wasn't read.
- **Employees aged 60+ (Part E)** may still elect an employee share through i-Topup.

## 8. Discrepancies vs the old `epf.ts`
1. It uses a plain percentage instead of the Third Schedule bands. The error is up to RM11 (employee) and RM12 (employer) at RM5,000.01: the old code gives 550.00/600.00 against the correct 561/612.
2. It rounds to cents with `round2` instead of **rounding up to whole ringgit**. This applies above RM20k too, where the total is what gets rounded.
3. It has no citizenship input, so PRs and pre-1998 non-citizens aged 60 to 75 wrongly get 0%/4%. They should get 5.5% and 6.5%/6% (Part C).
4. `age > 75` means a 75-year-old still contributes. Contributions stop on attaining 75. It also takes whole years, so it can't handle the birthday month.
5. It has no foreign-worker logic. Part F (2%/2%) applies from October 2025 wages, and Parts B/D applied before that.
6. It does not exclude domestic workers.
7. It does not apply the NIL rule for wages ≤ RM10: at RM10.00 it gives 1.10/1.30.
8. It does not implement the bonus note, under which the employer keeps 13%. The brief's premise that a bonus causes 13% → 12% is wrong.
9. Overrides *replace* the statutory rate and can go below it. i-Topup should be *on top of* the statutory amount, and no rate below statutory is allowed in 2025 or 2026.
10. "Gross salary" is used as the EPF wage. Overtime, travel claims and similar items must be excluded, and the classification lists are not closed (§3.3).
11. It treats every non-private sector as having no EPF. Status decides instead: government contract staff, EPF-option staff and permanent staff before PTB do contribute (§2).
12. It has no effective-date or year keying, no account split and no Akaun Emas at 55+.
13. Its comment says the error is "a few ringgit". Banding alone can reach RM23 a month combined, and the missing floor is larger: RM48 at RM1,500 (165/195 against 187/221).
14. **It has no minimum-wage floor** (§3.2), and no pay-basis or part-month input.
15. **It has no arrears or multi-run handling** (§3.4).

**Notes for sibling reports, not edited here.** `pcb.md` says "60+ → 0% employee share", which is true only for citizens, so K1 must take the amount from the EPF module. `pcb.md`'s threshold table uses an approximate "11% rounded up" rather than band amounts. `socso.md` and `eis.md` leave the same birthday-month question open. Evidence in §2 helps close SOCSO's gap on pensionable statutory-body staff.

## 9. Limitations and unverified items
| Item | Confidence |
|---|---|
| A/C/E table values, all of 2025 and 2026 | high: 1,203 rows against KWSP's own July 2022 and October 2025 PDFs, 0 mismatches |
| Parts B/D band details | high: KWSP's own PDF, 802 rows |
| Bonus note, employer share | high |
| Bonus note, employee share from the table | medium-high: no official example |
| Commission doesn't trigger the note | medium |
| Bonus note above RM20,000 | low-medium |
| Rates above RM20,000 | high |
| Total rounding above RM20,000 | medium |
| Split of the rounded total | low: not stated anywhere |
| Part F rates, start date, no age split | high |
| Part F per share vs total rounding | conflict inside KWSP |
| Part F stops at 75 | high (timing as below) |
| Part F has a floor | high: KWSP FAQ Q4, s.43(1A) |
| Floor, full-month monthly-rated | high |
| Floor, small-employer period Feb–Jul 2025 | medium-high: statutory reading |
| Floor, hourly, daily and part-month arithmetic | medium: KWSP text from 2018, under an earlier Order |
| Floor from June 2027 | low until gazetted |
| Month of the switch at 60 / stop at 75 | medium / low |
| Fixed transport allowance, cash gifts | unsettled |
| Other wage components | see `data/epf-wage-components.json` |
| i-Topup method | conflict; statute and KWSP examples differ |
| i-Topup in the RM100k cap | conflict inside KWSP |
| Government: contract and EPF-option staff | medium-high |
| Government: before PTB | medium |
| Government: after PTB, no EPF | high |
| Commencement instrument, Act A1760 | date high; P.U.(B) 354/2025 number from one law firm; gazette text not seen |
| Basic Savings anchors | high; by-age tables secondary for 2026–2029 |
| 2027 anything | template |

**Limits of the evidence**
- `kwsp.gov.my` returned 403 throughout, so KWSP pages are dated archive captures. A few capture dates come from cached filenames.
- Act 452 was read from a law-firm consolidation to 7 May 2013 and the AGC online text as at 1 Jul 2022 (marked not authentic), read with Act A1760. s.43(1A) is as quoted by KWSP. Later amendments outside A1760 were not reviewed. `lom.agc.gov.my` wasn't usable.
- Not read: the BM October 2025 PDF, the file behind KWSP's newer `third_schedule_from_-1-july-2022` URL (the same-labelled table was read from its older URL), KWSP's Employer Guide Book, its 2014 FAQ images, the UMPSA form (search snippet only), and JPA PP 15/2001 and PP 2/2008 (scanned, no OCR).
- The BM 2022 capture is truncated at 1 MiB. Rows were recovered from raw page streams and not rendered.
- **Automated access record.** One verification agent's curl requests to the Internet Archive sent a generic browser-style User-Agent and included retries. The Archive returned HTTP 429 flagging suspected bot traffic, and the agent stopped. Another agent's curl probe of `lom.agc.gov.my` with a browser User-Agent was denied by the permission system and not retried. No reCAPTCHA or access control was bypassed.

## Verification log (deep pass, 2026-11-05)

Each claim was checked by three independent lenses: `primary` (official sources), `currency` (still in force) and `compute` (recalculation). REFUTED means 2 or more refutes. In the votes column, ✓ confirmed, ✗ refuted, ? could not decide.

**"no live search"** marks a check that ran with no live web search, because a shared session cap was used up. It relied on saved sources and direct page fetches, so it's lower confidence, particularly for anything published after those sources. It doesn't mean the check is wrong. `README.md` quotes a higher count of affected EPF checks (31) than `no-live-search.json` (19); this log follows the JSON, and the two weren't reconciled.

| Claim id | Claim | Outcome | Votes | Action taken | Key source |
|---|---|---|---|---|---|
| epf-1 | Part A banded table, formula and check rows | CONFIRMED | currency ✓; primary ✓ (primary: no live search); compute ✓ | Kept. Citation upgraded to KWSP's PDFs | KWSP Third Schedule Oct 2025 and Jul 2022 PDFs |
| epf-2 | Tables unchanged for Jan–Sep 2025 and 2026; no reduced-rate election; no 2027 change announced | CONFIRMED | primary ✓ (primary: no live search); currency ✓; compute ✓ (compute: no live search) | Kept. C and E raised to high. "July 2022 table never retrieved" removed. Budget now cited from the speech | KWSP schedule PDFs; P.U.(A) 467/2021; Budget 2027 speech |
| epf-3 | Above RM20,000: rates, and rounding each share | REFUTED | compute ✗ (compute: no live search); primary ✗ (primary: no live search); currency ✗ | **Corrected.** Rates kept; total rounded; split marked provisional; examples 8, 9, 37, 38 recomputed; pseudocode bug fixed | Third Schedule wording; KWSP employer page Examples 2.1, 2.3, 2.4 |
| epf-4 | Bonus note, 13% / 6.5% of actual wages | CONFIRMED | primary ✓ (primary: no live search); compute ✓ (compute: no live search); currency ✓ | Kept. Scope, test and employee share extended from gap G3 | Third Schedule Part A and C notes |
| epf-5 | Cut-offs at 60 and 75; switch month unverified | CONFIRMED | currency ✓; compute ✓ (compute: no live search); primary ✓ (primary: no live search) | Kept. 75 raised to high with statutory citations. Switch month raised to medium for 60 from calculator code | Act 452 First Schedule para (13), s.50(2B)(a); KWSP calculator `getAge` |
| epf-6 | Part F: 2%/2%, start date, rounding, age, domestic workers | REFUTED | primary ✗ (primary: no live search); compute ✗; currency ✗ | **Corrected.** Floor added; age 75 raised to high; pass-expiry stop added; domestic and s.43(3) nuances added; MYWave description fixed; RM10 rule re-sourced; RM2,000 period added. Rounding kept as a conflict (see below) | KWSP non-Malaysian FAQ Q4, Q20–23, Q27; Example 2.4; s.43(1A) |
| epf-7 | 60+ rates by citizenship, Parts C and E | CONFIRMED | currency ✓; primary ✓ (primary: no live search); compute ✓ | Kept. Part E citation corrected. RM252 relabelled as an i-Topup illustration | KWSP schedule PDFs; employer page Examples 1.3, 1.4 |
| epf-8 | Parts B and D for Jan–Sep 2025 | CONFIRMED | currency ✓; primary ✓; compute ✗ | Kept, raised to high. The one refute was accepted: RM5 starts at RM10.01, NIL below; schema gains `nilAtOrBelow`. Tables added | KWSP Jul 2022 PDF, 802 rows |
| epf-9 | EPF wage definition, RM10 liability, who is liable | CONFIRMED | primary ✓ (primary: no live search); currency ✓; compute ✓ (compute: no live search) | Kept. Lists marked not exhaustive; components from gap G2 | KWSP FAQ Q8, Q11, Q18–Q28; Act 452 s.2 |
| epf-10 | VE added to the table; RM100k cap and its list | REFUTED | primary ✗ (primary: no live search); compute ✗ (compute: no live search); currency ✗ (see note) | **Corrected.** Method marked as a conflict with a labelled default; ringgit input added; renamed i-Topup; cap list by year; 1 Jun 2023 re-sourced; forms updated | KWSP i-Topup pages 2026-01-09, 2026-10-23; Act 452 s.43(3); T&C s.3.2 |
| epf-11 | Government sector | REFUTED | primary ✗ (primary: no live search); currency ✗; compute ✗ (compute: no live search) | **Corrected.** Rewritten by appointment status; interim contracts; before-PTB rule; flat 12% dropped; statutory-body scope narrowed | JPA release and FAQ 24 Jan 2024; MyPPSM UP.1.1.1; UTM 2026 sheet; The Edge Jul 2026 |
| epf-12 | i-Saraan, i-Saraan Plus, i-Suri | CONFIRMED | currency ✓; compute ✓ (compute: no live search); primary ✓ (primary: no live search) | Kept. Non-stacking, Plus age limit, 2024 counting, eligibility added. Bernama 2477398 no longer relied on | KWSP i-Saraan and Plus pages; KWSP release 31 Dec 2025; Budget documents |

**Notes on the log.** The epf-10 currency check disclosed it saw earlier votes in a results file, so it wasn't fully blind, though it re-read every source. For Budget 2027, to-do 6 read the speech directly, while some lenses relied on press reports.

**Reviser's own checks.** For the refuted claims I re-read the cited passages in the cached sources: employer page Examples 2.1 and 2.4 and the schedule's closing sentence, non-Malaysian FAQ Q4 and Q23, i-Topup page rows, T&C s.3.2, s.43(3), s.43(1A) as quoted by KWSP, the calculator's `getAge`, P.U.(A) 376/2024, the 2018 FAQ Q21, the JPA release, the UTM sheet and The Edge. They hold up. All examples were recomputed independently in `verify-epf.py`.

**Where a refuting vote was not followed in full**
- **epf-6, primary lens, "per-share is high confidence, drop the total alternative".** Kept as a conflict. KWSP's Example 2.4 (RM6,710 → RM269) is real and in the captures of 6 Jan and 10 Aug 2026. The other two lenses and to-do 2 treat it as open.
- **epf-3, "do not invent a split".** No split is presented as fact, but the calculator needs an employee figure, so a default is kept as a labelled, switchable provisional value. The compute lens noted the same candidate.
- **epf-6, compute lens, "base = max(wages, RM1,700)".** Narrowed per gap G1: that's right only for a full-month, monthly-rated worker.

**Deep-pass to-dos and gaps**

| Id | Result | Status |
|---|---|---|
| todo-1 | KWSP PDFs obtained and diffed, 0 mismatches. BM Oct 2025 not obtained | partial |
| todo-2 | Age 75 and non-Malaysian accounts resolved. Rounding conflict documented. Floor surfaced | partial |
| todo-3 | P.U.(B) 354/2025 and 1 Oct 2025 found. Gazette text not retrieved | partial |
| todo-4 | No written KWSP rule. Calculator evidence came from claim epf-5 | partial |
| todo-5 | No separate government rate. Status mapping built | partial |
| todo-6 | B/D, Basic Savings and Budget 2027 settled. i-Topup cap conflict documented. Script placed | partial |
| G1 | Floor rules, periods and exclusions. RM2,000 not gazetted | partial |
| G2 | Wage classification. Fixed transport unsettled | partial |
| G3 | Bonus, commission, arrears, separate runs. Calculator not run | partial |

**Not independently verified** (dropped from the claim list before voting, kept as first-pass findings)
- Account split from 11 May 2024 for members under 55: 75% Akaun Persaraan, 15% Akaun Sejahtera, 10% Akaun Fleksibel; from 55, new contributions go to Akaun Emas (KWSP press release 25 Apr 2024 via MAICSA). This does not affect take-home pay.
- Dividends: 2023 5.50% conventional / 5.40% syariah; 2024 6.30% / 6.30%; 2025 6.15% / 6.15%. Used for projections only.
- Basic Savings (Simpanan Asas) benchmarks conflict: RM290k for 2026 (Utusan) versus RM270k for 2026 (RinggitPlus), and RM240k before 2026. Used for projections only. *(The conflict was later settled by to-do 6, §4.)*
- Budget 2027: automatic EPF registration at 18, i-Emas monthly payout option, minimum wage RM2,000 from June 2027. None of these changes contribution amounts. *(Later read directly in to-do 6. The minimum wage does change the floor; §3.2.)*
- Domestic servants (citizen or foreign) are not mandatory contributors but may elect via KWSP 16/16B. *(The election itself is supported by non-Malaysian FAQ Q6; forms not re-checked.)*
- Note on the RM5,000 cliff: employer cost falls by RM38 while the employee deduction rises by RM11. This is a consequence of claim epf-1, not a separate fact.
- The old app's error can reach RM23 a month combined. This is a discrepancy note, not a statutory fact.

## 10. Sources
Accessed 2026-11-04/05. Archive captures are identified by date. Local copies are under `.research-cache/epf/` (git-ignored).

**Third Schedule and legislation**
- KWSP Third Schedule, effective 1 Oct 2025: https://www.kwsp.gov.my/documents/d/guest/third_schedule_from_-1-october-2025 (read via https://web.archive.org/web/20261026163316id_/https://www.kwsp.gov.my/documents/d/guest/third_schedule_from_-1-october-2025; digest AMJLXGQ2YW7C2LQRHW635MHA4J3KBJ7V)
- KWSP Third Schedule EN, effective 1 Jul 2022 to 30 Sep 2025: https://www.kwsp.gov.my/documents/d/guest/jadual-ketiga-bi-pdf-1 (captures https://web.archive.org/web/20240728065937id_/https://www.kwsp.gov.my/documents/d/guest/jadual-ketiga-bi-pdf-1 and 20250811; digest SFWC57EG23O5RJ6GD3J7YPI4GLSLQEU6)
- KWSP Third Schedule BM, effective 1 Jul 2022: https://www.kwsp.gov.my/documents/d/guest/jadual-ketiga-bm-pdf-1 (https://web.archive.org/web/20241011002335id_/https://www.kwsp.gov.my/documents/d/guest/jadual-ketiga-bm-pdf-1 and https://web.archive.org/web/20240415214223id_/https://www.kwsp.gov.my/documents/d/guest/jadual-ketiga-bm-pdf-1?preview; truncated)
- Not obtained, BM Oct 2025: https://www.kwsp.gov.my/documents/d/guest/jadual-ketiga-bm-1-okt-2025 (403, no capture; index search https://web.archive.org/cdx/search/cdx?url=kwsp.gov.my/documents/d/guest/*&from=20251001&filter=urlkey:.*(jadual|third|ketiga|schedule).*&collapse=urlkey)
- First-pass transcription of the Oct 2025 schedule, superseded: https://github.com/niru89-coder/PayVerify-AI/blob/15a9815af46acbb09e93688a10f0f299306fd055/docs/markdown/epf-employee-and-employer-contribution-10-effective-1-october-2025.md
- Independent Part A data: https://github.com/arya020595/st_intent_harvest/blob/0b15287992a2ab5a29f673767194014799de035c/db/master_data/master_data_deductions/epf_local_wage_ranges.csv and https://github.com/keanteng/epf (data/kwsp_schedule.xlsx, committed 2024-01-09)
- Act A1760, EPF (Amendment) Act 2025: https://www.ramco.com/hubfs/compliance-portal/Act%20A1760-%20EMPLOYEES%20PROVIDED%20FUND%20(AMENDMENT)%20ACT%202025.pdf
- The bill, with its explanatory statement: https://www.cljlaw.com/files/bills/pdf/2025/MY_FS_BIL_2025_08.pdf
- Act 452, consolidated to 7 May 2013: https://www.lowpartners.com/employees-provident-fund-act-1991/ . Secondary text as at 1 Jan 2006: https://lawplayer.com/my/act/act-452 . AGC online text as at 1 Jul 2022: local copy `verify/age60/act452-online2022.pdf`
- P.U.(A) 467/2021: https://ccs-co.com/wp-content/uploads/126.1-P.U-A-467-2021.pdf
- P.U.(B) 354/2025, attempted, "Invalid request": https://lom.agc.gov.my/act-view.php?type=pub&no=P.U.%20(B)%20354/2025&lang=BI&language=BI . LOM search results are encrypted client-side, so not used: https://lom.agc.gov.my . Checked, list starts at A1777: http://www.cljlaw.com/?page=latestmyactmore
- Parliamentary written reply no. 108, 2019: https://pardocs.sinarproject.org/documents/2019-march-april-parliamentary-session/written-replies-soalan-bertulis/p14p2m1-soalan-bukanlisan-108.pdf
- Employment Act s.18A, secondary text as at 1 Aug 2023: https://lawplayer.com/my/act/act-265

**KWSP pages (403 live; dated captures)**
- Employer mandatory contribution and FAQ, captures 2025-05-23, 2025-11-05, 2026-01-06, 2026-08-10: https://www.kwsp.gov.my/en/employer/responsibilities/mandatory-contribution
- Member mandatory contribution, capture 2026-10-23: `verify/member-mandatory-20261023.txt`
- Third Schedule page, captures 2025-01-17, 2025-04-15, 2025-06-19, 2026-01-08, 2026-10-24: https://www.kwsp.gov.my/en/epf-act-1991-third-schedule
- Non-Malaysian employees and FAQ, captures 2025-10-03, 2025-10-29, 2026-01-05, 2026-10-20: https://www.kwsp.gov.my/en/employer/responsibilities/non-malaysian-citizen-employees
- i-Topup, member (capture 2026-10-23): https://www.kwsp.gov.my/en/member/savings/voluntary-excess . Employer (capture 2026-01-09): https://www.kwsp.gov.my/en/employer/responsibilities/contributing-more-than-the-statutory-rate
- Terms & Conditions s.3.2, captures 2025-10-01, 2026-01-07, 2026-02-09, 2026-03-22: https://www.kwsp.gov.my/en/others/terms-and-conditions
- i-Saraan, capture 2026-10-23: https://www.kwsp.gov.my/en/member/savings/i-saraan . i-Saraan Plus, capture 2026-01-01: https://www.kwsp.gov.my/en/member/savings/i-saraan-plus
- i-Invest, capture 2025-04-24: https://www.kwsp.gov.my/en/member/savings/i-invest
- 2026 enhancements release, 31 Dec 2025, capture 2026-01-02: https://www.kwsp.gov.my/en/w/news/epf-policy-product-enhancements-2026
- Belanjawanku and RIA release, original and revised captures: https://www.kwsp.gov.my/en/w/epf-releases-belanjawanku-2024/2025-and-retirement-income-adequacy-framework
- 2019 rate release, 7 Jan 2019: https://www.kwsp.gov.my/en/w/new-minimum-statutory-rate-for-employees-above-age-60-takes-effect-1
- i-Akaun employer guide for non-Malaysian employees: https://www.kwsp.gov.my/documents/d/guest/managing-non-malaysian-citizen-employees-in-i-akaun-employer-verification-registration-contributions . Migrant worker flyer: https://www.kwsp.gov.my/documents/d/guest/migrant-worker-flyer-eng-3
- Minimum Contribution FAQ, 13 Nov 2018: https://web.archive.org/web/20181220201732/http://www.kwsp.gov.my:80/portal/documents/10180/153456/Frequently-Asked_Questions_on_Minimum_Contribution_General_05122018.pdf
- Exempted payments page, capture 2012-08-04: https://web.archive.org/web/20120804012241/http://www.kwsp.gov.my:80/portal/en/web/kwsp/employers/employers-responsibility/contribution/explanation-regarding-payments-exempted-from-epf-contribution
- Not read, blocked: https://web.archive.org/web/20180618214332/http://www.kwsp.gov.my:80/portal/documents/10180/6118535/BUKU_PANDUAN_MAJIKAN_18052018.pdf and https://web.archive.org/web/20150426210352/http://www.kwsp.gov.my/portal/documents/10180/1858080/Definisi_Q11_EN_.png?t=1404535516105
- KWSP calculator client code, captures 2022-07-04 and 2026-04-09, inspected only: `verify/calc/cc-20220704.min.js`, `verify/calc/cc-20260409.min.js`, `verify/calc/props-20260409.js`
- KWSP employer page (1 Jul 2022), via MAICSA: https://www.maicsa.org.my/media/7064/technical_announcements_220704_2_1.pdf
- KWSP press release on account restructuring (25 Apr 2024): https://www.maicsa.org.my/media/9090/technical_announcements_240425_2_1.pdf . Restructuring FAQ, capture 2026-10-20: `verify/restructuring-20261020.txt`
- CTIM note on P.U.(A) 21/2016, local `dl/ctim2016.pdf`, found but not read.

**Part F commencement and commentary**
- Skrine, 3 Oct 2025 (P.U.(B) 354/2025): https://www.skrine.com/insights/alerts/october-2025/epf-contribution-for-foreign-employees-commences-o . Skrine, June 2025: https://www.skrine.com/insights/alerts/june-2025/mandatory-2-epf-contributions-for-foreign-workers-
- Zul Rafique, 1 Oct 2025: https://www.zulrafique.com.my/article-sample.php?id=2382
- The Star: https://www.thestar.com.my/news/nation/2025/10/01/epf-begins-mandatory-contributions-for-non-malaysian-employees and https://www.thestar.com.my/news/nation/2025/10/02/epf-contributions-for-foreign-workers-begin
- Kosmo (1 Oct 2025), KWSP CEO: https://www.kosmo.com.my/2025/10/01/kwsp-kuat-kuasa-caruman-mandatori-pekerja-asing-bulan-ini/
- MOHR media statement (3 Feb 2025): https://www.mohr.gov.my/images/pdf/JLD4%20(22)Caruman%20Mandatori%20KWSP%20kepada%20Pekerja%20Bukan%20Warganegara%20Malaysia.pdf
- JSA Prism, Nov 2025, found but not processed: https://www.jsalaw.com/wp-content/uploads/2025/11/JSA-Prism-Employment-November-2025-EPF-Applicability-on-International-Workers.Final_.pdf
- MYWave infographic, secondary: https://mywave.biz/new-kwsp-table-3-part-f-for-foreign-workers-effective-1-october-2025/
- Worksy: https://worksy.freshdesk.com/support/solutions/articles/63000277020 . QNE, contradicts KWSP at 60+: https://qne.cloud/my/?p=33334 . Kakitangan: https://blog.kakitangan.com/new-epf-contribution-rate-of-non-malaysian-in-2025/
- Sinar Harian on the foreign-worker rate: https://www.sinarharian.com.my/article/710604/berita/nasional/cadangan-caruman-kwsp-pekerja-asing-kekal-sehingga-kajian-lanjut---steven-sim . NST, MOF on the 2% rate: https://www.nst.com.my/amp/news/nation/2026/10/1561626/2pc-epf-contribution-rate-foreign-workers-relatively-low-says-mof

**Minimum wage**
- P.U.(A) 376/2024: https://gajiminimum.mohr.gov.my/wp-content/uploads/PUA%20376.pdf (text read from https://amcham.com.my/wp-content/uploads/PUA-376.pdf)
- P.U.(A) 140/2022: https://jtksm.mohr.gov.my/sites/default/files/2023-04/Warta_PGM_2022.pdf
- MOHR FAQs: https://www.mohr.gov.my/images/mpgn/FAQ%202024.pdf and https://gajiminimum.mohr.gov.my/wp-content/uploads/FAQ%20PERINTAH%20GAJI%20MINIMUM%202024_AWAM%20FINAL.pdf
- KESUMA statements: https://www.mohr.gov.my/images/pdf/JLD4%20(19)%20KENYATAAN%20MEDIA%20KESUMA_Pelaksanaan%20Perintah%20Gaji%20Minimum%20RM1700%20Sebulan.pdf and https://www.mohr.gov.my/images/pdf/2025/KenyataanMedia/JLD4%20(77).pdf
- Act 732, 2015 reprint: https://jtksm.mohr.gov.my/sites/default/files/2023-03/3.%20National%20Wages%20Consultative%20Council%20Act%202011.pdf
- MPGN portal, fetched 2026-11-05: https://gajiminimum.mohr.gov.my/ and https://gajiminimum.mohr.gov.my/perintah-perintah-gaji-minimum/
- 2026 reporting: https://www.bernama.com/en/general/news.php?id=2621437 , https://www.bernama.com/bm/news.php?id=2621379 , https://www.bernama.com/en/general/news.php?id=2619936 , https://berita.rtm.gov.my/nasional/senarai-berita-nasional/senarai-artikel/jualan-pmks-bawah-rm50-juta-dikecualikan-kenaikan-gaji-minimum/ , https://berita.rtm.gov.my/?p=707907 , https://www.thestar.com.my/news/nation/2026/10/09/budget-2027-smes-exempt-from-minimum-wage-hike-for-now-says-amir-hamzah , https://www.thevibes.com/articles/news/128291/rm2000-minimum-wage-firms-with-sales-below-rm50m-exempt-from-2027-hike , https://www.malaymail.com/amp/news/malaysia/2026/10/09/budget-2027-minimum-wage-raised-to-rm2000-effective-june-2027/238424 , https://www.thestar.com.my/business/business-news/2026/10/09/minimum-wage-increase-important-labour-market-reform-says-epf , https://www.ajobthing.com/resources/blog/malaysia-minimum-wage-proposed-hike-msme-exemption-budget-update
- 2018 reporting: https://www.thestar.com.my/business/business-news/2018/12/06/epf-to-align-monthly-contribution-with-new-minimum-wage-order/ and https://www.humanresourcesonline.net/epf-in-malaysia-to-align-employer-and-employee-contribution-to-minimum-wages/
- Skrine alerts: https://www.skrine.com/insights/alerts/december-2024/minimum-wages-order-2024-gazetted and https://www.skrine.com/insights/alerts/july-2025/minimum-wage-throughout-malaysia-aligned-from-1-au

**Wage classification**
- Donovan & Ho: https://dnh.com.my/what-payments-are-subject-to-epf/ , https://conventuslaw.com/report/malaysia-what-payments-are-subject-to-epf/ , https://dnh.com.my/are-employee-stock-options-subject-to-epf/ , https://conventuslaw.com/report/malaysia-are-employee-stock-options-subject-to-epf/
- Cold Chain, press reports: https://www.freemalaysiatoday.com/category/nation/2017/08/14/lorry-driver-wins-appeal-over-non-payment-of-epf-for-trips-made , https://www.theborneopost.com/2017/08/15/high-court-allows-lorry-drivers-appeal-over-epf-contribution/ , https://nst.com.my/amp/news/crime-courts/2017/08/267684/high-court-allows-lorry-drivers-appeal-against-epf-ex-company-over , https://www.freemalaysiatoday.com/category/2017/04/28/lorry-driver-seeks-epf-pay-from-ex-boss-for-trips-made/
- Vendors, secondary: https://briohr.com/blog/everything-you-ever-wanted-to-know-about-wages/ , https://www.ajobthing.com/resources/blog/which-allowances-are-subject-to-epf-in-malaysia , https://www.reeracoen.com.my/articles/epf-allowances-malaysia-subject-vs-exempt-guide-2026 , https://pandahrms.com/which-allowances-subject-to-epf-malaysia-wages-2026/ , https://support.hreasilygroup.com/en/support/solutions/articles/72000581882-payroll-components-subjected-and-exempted-from-epf , https://autocountsystem.com/transport-vs-travelling-allowance-malaysia/ , https://www.payrollpanda.my/help/payments-subject-to-epf-contribution/ , https://blog.kakitangan.com/which-payments-are-subject-to-epf-contribution-and-which-are-exempted/ , https://righthouse.com.my/do-you-know-which-payment-is-subjected-or-exempted-from-epf-contribution/ , https://www.cwca.com.my/sharings/remuneration-that-subject-to-epf-socso-eis-hrdf/ , https://landco.my/information-sharing/details-of-payroll-contribution/ , https://payroll.my/payroll-software/wages-or-salary-payment-subject-to-epf-contribution , https://www.sql.com.my/payroll-software/kwsp/ , https://weirdkaya.com/how-much-should-your-boss-contribute-to-your-epf-and-can-they-refuse-to-pay/ , https://accounting.my/business/director-fees-vs-salary-malaysia-guide/ , https://kcgroup.biz/director-fee-malaysia-2026/

**Bonus, arrears and age timing**
- KWSP January 2012 FAQ as reproduced, and 2012 replies: https://www.nbc.com.my/blog/?p=2481 and https://www.nbc.com.my/blog/?p=1268
- Talenox: https://help.talenox.com/en/articles/2488717-epf-contribution-rate (also https://help.talenox.com/articles/2488717-epf-contribution-rate) and https://www.talenox.com/blog/talenox-q2-2026-product-updates-malaysia-payroll-got-just-smarter/ . HReasily: https://hreasily-help.freshdesk.com/en/support/solutions/articles/72000647322-why-does-my-staff-s-epf-employer-contribution-look-incorrect-when-a-bonus-is-paid-
- Worksy: https://worksy.freshdesk.com/support/solutions/articles/63000277127 , https://worksy.freshdesk.com/support/solutions/articles/63000269714 , https://worksy.freshdesk.com/support/solutions/articles/63000287279-what-to-do-if-overpaid-or-underpaid-epf-contributions . QNE: https://qnemy.freshdesk.com/support/solutions/articles/81000389727-how-to-calculate-epf-bonus-if-employee-s-wages-less-than-5k-but-bonus-wages-more-than-5k- . SQL: https://docs.sql.com.my/sqlpay/miscellaneous/epf/overview . TimeTec, contrary example with no salary stated: https://www.timeteccloud.com/blog/?p=4886
- Month-after rule stated, no citation: https://www.hopesmalaysia.com/post/epf-contribution-for-age-above-60 and https://www.info-tech.com.my/blog/epf-contribution-rate-malaysia/
- No timing stated: https://www.swingvy.com/blog-my/epf-contribution-rate-malaysia , https://support.briohr.com/knowledge/setting-statutory-contributions-for-employees-aged-60-and-above-malaysia-payroll , https://www.omnihr.co/faqs/is-the-epf-calculator-for-employees-above-60-accurate , https://kcgroup.biz/epf-contribution-malaysia-2026-complete-guide/ , https://www.theedgemarkets.com/article/employers-minimum-epf-contribution-staff-aged-60-and-above-cut-4
- Singapore CPF, different scheme, comparison only: https://www.cpf.gov.sg/service/article/when-will-my-employee-s-cpf-contribution-rates-change-when-they-turn-55-60-65-or-70

**Government sector**
- JPA: https://dmedia.penerangan.gov.my/upload/sm/24012024.2076432687.pdf , https://docs.jpa.gov.my/docs/akhbar/2024/FAQ_siaran_media_24012024_a.pdf , https://docs.jpa.gov.my/docs/myppsm/PPSM/UP/Pelantikan/96/ , https://docs.jpa.gov.my/docs/myppsm/PPSM/UP/Pelantikan/97/ , https://docs.jpa.gov.my/docs/sspa/Notis_Pindaan_Syarat_Kontrak.pdf , https://docs.jpa.gov.my/docs/spp/2016/spp022016.pdf , https://docs.jpa.gov.my/docs/myppsm/PPSM/PP/pencen/36/ , https://docs.jpa.gov.my/docs/myppsm/PPSM/PP/pencen/65/ , https://docs.jpa.gov.my/docs/myppsm/PPSM/PP/pencen/188/ , https://docs.jpa.gov.my/docs/myppsm/PA/Akta-227/10/ , https://docs.jpa.gov.my/docs/myppsm/PA/Akta-227/11/ , https://docs.jpa.gov.my/docs/sspa/faq_persaraan_dan_faedah_persaraan.pdf , https://docs.jpa.gov.my/docs/sspa/PP_SSPA_INDUK_COMBINED.pdf , https://pencen.jpa.gov.my/skim-kwsp.html?view=article&id=19:skim-kwsp-faedah-persaraan&catid=12
- SPANM Bil. 2/2026: https://www.anm.gov.my/images/dokumen/pekeliling/surat-pekeliling-anm/2026/SPANM_Bil_2_Tahun_2026_Tatacara_Pengurusan_Bayaran_Emolumen_Pegawai_Awam_Persekutuan.pdf
- KWAP e-bulletin: https://www.kwap.gov.my/documents/contribution/e-bulletin/Special_Edition-Contribution_Department.pdf
- UTM: https://registrar.utm.my/bsm/wp-content/uploads/sites/420/2026/08/Perbandingan-Opsyen-Borang-Opsyen-KWSP-Lampiran-PP.1.1.2B.pdf , https://bursary.utm.my/wp-content/uploads/2020/12/8.-Garis-Panduan-Penggajian-Bil.1-2020.pdf , https://bursary.utm.my/wp-content/uploads/2023/05/SLIDE-DIBACA-BERSAMA-PROSEDUR-EMOLUMEN-VERSI-APRIL-2023_compressed.pdf , https://registrar.utm.my/bsm/wp-content/uploads/sites/420/2018/10/Slide-Overview-Skim-Pencen-UTM-20180926.pdf
- UMPSA form, search snippet only: https://edasar.umpsa.edu.my/borang/3399-tawaran-opsyen-untuk-memilih-skim-kumpulan-wang-simpanan-pekerja-selaras-dengan-peruntukan-seksyen-6a-1-pindaan-akta-pencen-pihak-pihak-berkuasa-berkanun-dan-tempatan-1980-akta-239-kemaskini-11-julai-2023/file
- The Edge, July 2026: https://theedgemalaysia.com/node/809680 . NST, Aug 2025: https://www.nst.com.my/amp/news/nation/2025/08/1263277/govt-still-reviewing-epf-scheme-civil-servants . Suara Sarawak, Mar 2024: https://suarasarawak.my/lantikan-baharu-berasaskan-caruman-bermula-tahun-ini/

**Dividends and 2026 policy**
- 2025: https://www.malaymail.com/amp/news/malaysia/2026/02/28/epf-announces-615pc-dividend-for-both-conventional-shariah-savings-for-2025/210707
- 2024: https://thestar.com.my/news/nation/2025/03/01/epf-63-dividend-for-both-conventional-and-syariah-savings-for-2024
- 2023: https://www.thestar.com.my/news/nation/2024/03/03/epf-declares-55-dividend-for-conventional-savings-for-2023
- 2026 policy changes: https://malaymail.com/news/malaysia/2025/12/31/epf-announces-policy-and-product-enhancements-effective-january-2026/203873 and https://www.thestar.com.my/news/nation/2026/01/01/new-epf-policy-changes-will-take-effect-from-today
- Other 2026 commentary, secondary: https://landco.my/social/kwsp-2026-reforms/ , https://www.ajobthing.com/resources/blog/epf-kwsp-new-updates-in-january-2026-for-employers-hr-in-malaysia , https://www.malaysia.gov.my/my/topics/caruman-kwsp-sebagai-hak-pekerja

**Budgets and matching schemes**
- Budget 2025 (i-Saraan 20%, RM500/yr): https://www.sinarharian.com.my/article/692284/berita/nasional/kwsp-umum-liputan-mandatori-kepada-pekerja-bukan-warganegara-malaysia
- Budget 2026: https://belanjawan.mof.gov.my/pdf/belanjawan2026/ucapan/ub26.pdf , https://www.malaymail.com/news/malaysia/2025/10/10/budget-2026-gig-workers-to-get-up-to-rm600-a-year-in-epf-matching-under-new-i-saraan-plus-scheme/194145 , https://www.thestar.com.my/news/nation/2025/10/10/budget-2026-introduces-enhanced-epf-scheme-for-gig-workers-self-employed-to-boost-savings , https://www.theborneopost.com/?p=1283550
- Budget 2027 speech: https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf . Lampiran 1 summary: https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/touchpoint-budget-bm.pdf
- Budget 2027 reporting: https://www.malaymail.com/news/malaysia/2026/10/10/budget-2027-epf-backs-rm2000-minimum-wage-automatic-membership-from-age-18/238517 , https://www.malaymail.com/news/malaysia/2026/10/09/budget-2027-all-malaysians-to-be-automatically-registered-with-epf-at-18/238430 (also https://malaymail.com/news/malaysia/2026/10/09/budget-2027-all-malaysians-to-be-automatically-registered-with-epf-at-18/238430) , https://mercans.com/resources/statutory-alerts/malaysia-budget-2027-key-payroll-measures-ya-2027/ , https://bernama.com/en/region/news.php?id=2617943 , https://ringgitplus.com/en/blog/budget-2027/budget-2027-e-hailing-drivers-could-earn-up-to-rm227-more-a-month.html , https://says.com/my/news/gomen/budget-2027-malaysia-cash-aid-tax-relief-wages-housing , https://www.ajobthing.com/resources/blog/budget-epf-backs-minimum-wage-automatic-membership-from-age , https://theedgemalaysia.com/node/821291
- Former EPF CEO's proposal: https://www.malaymail.com/news/malaysia/2026/09/30/ex-epf-ceo-proposes-employers-pay-higher-epf-contributions-for-low-wage-workers-while-reducing-contributions-for-high-income-staff/237173
- i-Saraan 2026, shows only a headline, not relied on: https://www.bernama.com/en/news.php?id=2477398 . i-Suri, secondary, stale line on age 55: https://ecentral.my/i-suri-kwsp/

**Voluntary cap and i-Topup**
- RM100k: https://www.thestar.com.my/news/nation/2022/10/07/budget-2023-epf-voluntary-contribution-limit-increases-to-rm100000-annually
- 1 Jun 2023, MOF clipping of a Bernama report: https://mof.gov.my/portal/ms/berita/akhbar/872-000-ahli-kwsp-buat-caruman-sukarela-setakat-ogos-2024-lim
- Voluntary contribution figures: https://www.sinarharian.com.my/article/769823/berita/nasional/caruman-sukarela-rm192-bilion-bukti-rakyat-ada-lebihan-pendapatan-untuk-simpanan---amir-hamzah
- Secondary: https://www.stashaway.my/r/epf-voluntary-contribution-malaysia , https://www.ajobthing.com/resources/blog/i-topup-kwsp-contribution-rules-guide-for-employers-in-malaysia , https://ecentral.my/i-topup-kwsp/

**Basic Savings**
- https://ringgitplus.com/ms/blog/berita-kewangan-peribadi/hampir-4-daripada-10-ahli-aktif-kwsp-di-landasan-capai-simpanan-asas-rm390000.html
- https://www.utusan.com.my/ekonomi/2024/12/kwsp-naikkan-penanda-aras-simpanan-asas-kepada-rm390000/ (original schedule, superseded)
- By-age tables, secondary: https://hlam.com.my/faq/ (capture 2026-04-11), https://www.kenangainvestors.com.my/epf-members-investment-scheme-investment-eligibility , https://smarterpik.com/blog/epf-retirement-savings-target-by-age-malaysia-2026/

**Local copies** (`.research-cache/epf/`, plus earlier first-pass sources in `.research-cache/kwsp/` and `.research-cache/kwsp3/`)
- `dl/actA1760.pdf`, `dl/bill2025.pdf`, `dl/126.1-P.U-A-467-2021.pdf`, `dl/mohr_jld4.pdf`, `dl/maicsa240425.pdf`, `dl/maicsa220704.pdf`, `dl/ctim2016.pdf`
- `gh/niru_epf.md`, `gh/rows.json`, `gh/arya.csv`, `gh/keanteng.xlsx`, `gh/kx/`
- `gh/yz.html`: an **incorrect** table; it uses round-half instead of ceiling, so 149 rows differ. Do not use it.
- `verify/`: KWSP PDFs and page captures, `verify/gov/` (government sources), `verify/g1/` (minimum wage), `verify/wagedef/` (wage definition), `verify/basic-savings/`, `verify/b27/` (Budget 2027), `verify/calc/` (calculator client code)
- First-pass scripts: `.research-cache/scripts/` (`cross.py`, `emit.py`, `examples.py` and others)

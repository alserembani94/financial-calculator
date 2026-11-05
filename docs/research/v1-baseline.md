# V1 baseline: flat take-home calculator

Research spec for the first iteration, written 2026-11-06. **Nothing is being built yet.** This narrows the research to the simplest useful calculator. All the wider research stays in the five scheme reports, and [§11](#11-roadmap-where-the-research-for-each-later-feature-lives) shows where to find it for each later feature.

All figures come from [data/v1-baseline.py](data/v1-baseline.py), which reads the data files in [data/](data/). To reproduce them, run `python3 -I docs/research/data/v1-baseline.py` from the repo root.

## 1. Goal

**Who it's for:** someone new to personal finance, getting their first salary.

**The main use:** they're weighing a job offer or negotiating a salary expectation. They enter a gross salary and see exactly what it turns into: each deduction, what they take home, and what goes to their retirement savings.

**What it isn't:** a payslip predictor. It's a flat stipulation, assuming the same salary from January to December. It doesn't ask when the salary starts.

## 2. Inputs

| Input | Default | Notes |
|---|---|---|
| **Monthly gross salary** | | Labelled "monthly salary before deductions, without any allowances, overtime or bonus", which is usually basic salary (D4, updated 2026-11-06) |
| **Age** | | Whole years |
| **Financial year** | Current year | Options: 2025, 2026, 2027 |
| **Marital status** | Single | One list: Single; Married, spouse doesn't work; Married, spouse works; Divorced or widowed (V4, wording in V5) |
| **Children under 18** | 0 | A whole number. Hidden for Single (V4) |
| **LINDUNG 24 Jam (SKBBK)** | Included | The user can opt out, for the calculation only. Shown for 2026 and 2027, since 2025 has no SKBBK (V2) |
| **Calculate zakat** | Off | Opt-in. Adds a separate zakat section for information, and leaves the main results as they are (V1, V6). If married, it also asks whether to apply the wife deduction (V7) |

Everything after salary and age has a default, so someone can still get a result from two inputs.

## 3. Fixed assumptions

| Assumption | Decision |
|---|---|
| Malaysian citizen and tax resident, private-sector employee | D2, assumed |
| One employer | D7 |
| The same salary every month, January to December, full month, monthly-rated | D5 |
| Salary is entered without allowances, so v1 never has to decide whether an allowance is charged EPF, SOCSO, EIS or tax. All of the entered salary counts for each of them | D4, updated 2026-11-06 |
| No bonus, overtime, commission or arrears | D4 |
| Each year uses the rules in force at the end of that year, for all 12 months | N1 |
| PCB is annual tax ÷ 12 | N2 |
| Where no official value exists, use the 2026 value with a note | D6 |
| The age given applies for the whole year | D3 |
| Anyone under 60 joined before the age cut-offs | Assumed |
| Reliefs are self, EPF, spouse and children only. No TP1 reliefs, and no RM350 SOCSO + EIS relief | V3, V4 |
| Each child counts as one child under 18, claimed in full by this user | V4 |
| Nobody in the household is registered as disabled | V4 |
| Zakat follows PPZ-MAIWP rules, for Muslims working in KL, Putrajaya or Labuan | V1 |
| Zakat is information, not a deduction. The user pays it themselves with no PCB offset, and claims the rebate when e-filing | V6 |

## 4. The calculation

Amounts per month, unless stated. Work in sen to avoid floating-point errors.

### EPF

1. **Base:** `max(salary, RM1,700)`, the minimum-wage floor ([epf.md §3.2](epf.md#32-minimum-wage-floor)).
2. **Table:** under 60 uses Part A; 60 to 74 uses Part E; 75 and over pays nothing.
3. **Up to RM20,000:** look up the employee and employer shares in the [Part A](data/epf-third-schedule-2025-10-partA.json) or [Part E](data/epf-third-schedule-2025-10-partE.json) table.
4. **Above RM20,000:**
   - Under 60: employee = 11% rounded up to the next ringgit; total = 23% rounded up; employer = the difference.
   - 60 to 74: employee RM0; employer 4% rounded up.

   The split above RM20,000 is provisional, with up to RM1 of uncertainty (EPF4).

### SOCSO

1. **Category:** under 60 is First Category; 60 and over is Second Category.
2. **Table:** look up the band. The wage ceiling is RM6,000, and there's no percentage calculation.
   - **2025:** [socso-act4-2025.json](data/socso-act4-2025.json), no SKBBK.
   - **2026 and 2027:** [socso-act4-2026.json](data/socso-act4-2026.json), Phase 1. Use `employeeWithNEI` by default, or `employeeWithoutNEI` if the user opts out of SKBBK. The employer's share stays the same.

### EIS

Age 18 to 59: look up the band in [eis-2025.json](data/eis-2025.json). The employee and employer pay the same amount, with a RM6,000 ceiling. Under 18 or 60 and over: nothing.

### PCB (annual tax ÷ 12)

Marital status decides the LHDN category:

| Marital status | Category | Spouse relief | Children counted | Rebate built into B |
|---|---|---|---|---|
| Single | 1 | None | No, forced to 0 | RM400 |
| Married, spouse doesn't work | 2 | RM4,000 | Yes | RM800 |
| Married, spouse works | 3 | None | Yes | RM400 |
| Divorced or widowed | 3 | None | Yes | RM400 |

Categories 1 and 3 give the same tax when there are no children. "Spouse doesn't work" legally means the spouse has no income or the couple is assessed jointly ([pcb.md §3.4](pcb.md#34-reliefs-inside-the-formula)). Placing divorced or widowed parents in Category 3 is an inference from the category's wording, as noted in [pcb.md §2](pcb.md#2-applicability-rules).

```
EPF relief  = min(employee EPF x 12, 4,000)
reliefs     = EPF relief + 9,000 (self) + spouse relief + 2,000 x children
P           = salary x 12 - reliefs, cut to 2 decimals
row         = the tax table row chosen on the whole-ringgit part of P
annual tax  = max(0, (P - M) x R + B)     // B depends on the category
PCB         = annual tax / 12, to the sen
```

M, R and B for each category are in [pcb-spec-2026.json](data/pcb-spec-2026.json) and [pcb.md §3.5](pcb.md#35-table-1-p-m-r-b-ya2025--ya2026).

### Results

```
take-home      = salary - employee EPF - employee SOCSO - EIS - PCB
retirement     = employee EPF + employer EPF
employer cost  = salary + employer EPF + employer SOCSO + employer EIS
```

These stay the same when zakat is switched on.

### Zakat (only if switched on)

Zakat is shown for information only, as what the user would need to pay at this salary. It isn't deducted, so PCB, take-home and the other results don't change (V6).

```
base          = salary x 12 - 12,000 (self) - employee EPF x 12 - 2,000 x children - 5,000 if wife deduction
annual zakat  = base x 2.5% if base >= nisab, otherwise 0
monthly zakat = annual zakat / 12, to the sen
left after paying zakat = take-home - monthly zakat
rebate when e-filing    = min(annual zakat, annual tax)
not recoverable         = max(0, annual zakat - annual tax)
```

This is the with-deductions method (Kaedah 2). The wife deduction in V7 exists only under it.

**Not in v1, kept for later:** zakat through salary (PZB) or declared on Form TP1 lowers monthly PCB instead of waiting for filing. The rules are in [zakat.md §8](zakat.md#8-interaction-with-income-tax-and-monthly-take-home), and `zakat_routes()` in [the script](data/v1-baseline.py) already works out the through-salary figures. Someone paying that way will see lower PCB on their payslip than v1 shows.

**The automatic options on PPZ's website** (checked 2026-11-06), for pointing users to:

- **Salary deduction (PZB):** the employee fills in PPZ's [online form](https://ptg.zakat.com.my/), which asks for the employer's payroll email.
- **Autodebit (e-Mandate):** this appears in PPZ's payment menu, but I found no page explaining how it works.

## 5. What changes by year

| | 2025 | 2026 | 2027 |
|---|---|---|---|
| **EPF table** | Part A/E | Same | Same as 2026, with note |
| **EPF floor** | RM1,700 | RM1,700 | RM1,700, with note. RM2,000 from June 2027 isn't gazetted |
| **SOCSO** | No SKBBK | SKBBK Phase 1 for all 12 months (N1) | Same as 2026, with note |
| **EIS** | Same table | Same table | Same as 2026, with note |
| **Tax brackets, self relief** | Same; RM9,000 | Same; RM9,000 | Same as 2026, with note. Budget 2027 proposes RM12,000 and lower rates, so RM5,000 would show PCB of RM95 instead of RM110 if it passes |
| **SKBBK opt-out** | Not shown | Shown | Shown |
| **Spouse relief, child relief, Table 1 by category** | RM4,000; RM2,000 | Same | Same as 2026, with note |
| **Zakat nisab** | RM29,740 | RM33,996 | Same as 2026, with note. PPZ hasn't published it |
| **Zakat deductions** | Self RM12,000; wife RM5,000; child RM2,000 | Same | Same as 2026, with note |

So in v1, 2025 and 2026 differ only by SKBBK and the zakat nisab.

## 6. Worked figures

Age 30, 2026 rules. In ringgit per month.

| Gross | EPF | SOCSO | EIS | PCB | **Take-home** | Employer pays in total |
|---|---|---|---|---|---|---|
| 1,700 | 187.00 | 20.60 | 3.30 | 0.00 | **1,489.10** | 1,953.15 |
| 2,000 | 220.00 | 24.40 | 3.90 | 0.00 | **1,751.70** | 2,298.05 |
| 2,500 | 275.00 | 30.60 | 4.90 | 0.00 | **2,189.50** | 2,872.75 |
| 3,000 | 330.00 | 36.90 | 5.90 | 0.00 | **2,627.20** | 3,447.55 |
| 3,500 | 385.00 | 43.10 | 6.90 | 1.67 | **3,063.33** | 4,022.25 |
| 4,000 | 440.00 | 49.40 | 7.90 | 16.67 | **3,486.03** | 4,597.05 |
| 4,500 | 495.00 | 55.60 | 8.90 | 80.00 | **3,860.50** | 5,171.75 |
| 5,000 | 550.00 | 61.90 | 9.90 | 110.00 | **4,268.20** | 5,746.55 |
| 5,500 | 605.00 | 68.10 | 10.90 | 152.50 | **4,663.50** | 6,266.25 |
| 6,000 | 660.00 | 74.40 | 11.90 | 207.50 | **5,046.20** | 6,836.05 |
| 7,000 | 770.00 | 74.40 | 11.90 | 324.17 | **5,819.53** | 7,956.05 |
| 8,000 | 880.00 | 74.40 | 11.90 | 514.17 | **6,519.53** | 9,076.05 |
| 10,000 | 1,100.00 | 74.40 | 11.90 | 929.17 | **7,884.53** | 11,316.05 |
| 15,000 | 1,650.00 | 74.40 | 11.90 | 2,179.17 | **11,084.53** | 16,916.05 |
| 20,000 | 2,200.00 | 74.40 | 11.90 | 3,429.17 | **14,284.53** | 22,516.05 |
| 25,000 | 2,750.00 | 74.40 | 11.90 | 4,679.17 | **17,484.53** | 28,116.05 |

For 2025, add back the SKBBK. For example, RM5,000 takes home RM4,305.35 in 2025.

**By age, at RM5,000, 2026 rules:**

| Age | EPF | SOCSO | EIS | PCB | Take-home | Employer EPF | Employer SOCSO | Employer EIS |
|---|---|---|---|---|---|---|---|---|
| 17 | 550.00 | 61.90 | 0.00 | 110.00 | 4,278.10 | 650.00 | 86.65 | 0.00 |
| 30 | 550.00 | 61.90 | 9.90 | 110.00 | 4,268.20 | 650.00 | 86.65 | 9.90 |
| 60 | 0.00 | 37.15 | 0.00 | 134.17 | 4,828.68 | 200.00 | 61.90 | 0.00 |
| 75 | 0.00 | 37.15 | 0.00 | 134.17 | 4,828.68 | 0.00 | 61.90 | 0.00 |

**PCB by marital status and children under 18,** age 30, 2026 rules. Each ringgit of PCB saved adds a ringgit to take-home.

| Gross | Single | Spouse works, or divorced/widowed: 0 children | 1 | 2 | 3 | Spouse doesn't work: 0 children | 1 | 2 | 3 |
|---|---|---|---|---|---|---|---|---|---|
| 3,500 | 1.67 | 1.67 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| 4,000 | 16.67 | 16.67 | 11.67 | 6.67 | 1.67 | 0.00 | 0.00 | 0.00 | 0.00 |
| 4,500 | 80.00 | 80.00 | 70.00 | 60.00 | 16.67 | 60.00 | 0.00 | 0.00 | 0.00 |
| 5,000 | 110.00 | 110.00 | 100.00 | 90.00 | 80.00 | 90.00 | 80.00 | 70.00 | 60.00 |
| 6,000 | 207.50 | 207.50 | 189.17 | 170.83 | 152.50 | 170.83 | 152.50 | 134.17 | 120.00 |
| 8,000 | 514.17 | 514.17 | 482.50 | 450.83 | 419.17 | 450.83 | 419.17 | 387.50 | 355.83 |
| 10,000 | 929.17 | 929.17 | 887.50 | 845.83 | 804.17 | 845.83 | 804.17 | 767.50 | 735.83 |

Only PCB changes with marital status and children. EPF, SOCSO and EIS don't.

**SKBBK opt-out,** 2026 rules:

| Gross | Age 30: SOCSO, in / out | Take-home, in / out | Age 60: SOCSO, in / out | Take-home, in / out |
|---|---|---|---|---|
| 1,700 | 20.60 / 8.25 | 1,489.10 / 1,501.45 | 12.35 / 0.00 | 1,687.65 / 1,700.00 |
| 3,000 | 36.90 / 14.75 | 2,627.20 / 2,649.35 | 22.15 / 0.00 | 2,977.85 / 3,000.00 |
| 5,000 | 61.90 / 24.75 | 4,268.20 / 4,305.35 | 37.15 / 0.00 | 4,828.68 / 4,865.83 |
| 6,000 and above | 74.40 / 29.75 | At RM6,000: 5,046.20 / 5,090.85 | 44.65 / 0.00 | At RM6,000: 5,711.18 / 5,755.83 |

**Zakat, for information,** with deductions, age 30, 2026 rules:

| Gross | Case | Take-home | Zakat a year | Zakat a month | Left after paying zakat | Rebate when e-filing | Not recoverable |
|---|---|---|---|---|---|---|---|
| 4,000 | Single | 3,486.03 | 0.00 | 0.00 | 3,486.03 | 0.00 | 0.00 |
| 4,309 | Single | 3,701.36 | 849.90 | 70.83 | 3,630.53 | 822.48 | 27.42 |
| 5,000 | Single | 4,268.20 | 1,035.00 | 86.25 | 4,181.95 | 1,035.00 | 0.00 |
| 6,000 | Spouse works, 2 children, no wife deduction | 5,082.87 | 1,202.00 | 100.17 | 4,982.70 | 1,202.00 | 0.00 |
| 6,000 | Spouse doesn't work, 2 children, wife deduction | 5,119.53 | 1,077.00 | 89.75 | 5,029.78 | 1,077.00 | 0.00 |
| 8,000 | Single | 6,519.53 | 1,836.00 | 153.00 | 6,366.53 | 1,836.00 | 0.00 |

## 7. Findings useful for a salary negotiation

These come straight from the rules and fit the job-offer use.

- **A higher salary can mean lower take-home.** Going up by RM1 lowers take-home at 1,415 of the 28,300 steps from RM1,700 to RM30,000 (5%), because EPF and SOCSO move in bands.

  | Step | Take-home | Why | Take-home recovers at |
  |---|---|---|---|
  | RM4,000 → RM4,001 | Falls RM36.79 | The RM400 tax rebate ends | RM4,045 |
  | RM5,000 → RM5,001 | Falls RM11.46 | EPF moves to a RM100-wide band | RM5,014 |

  Elsewhere in that range, the drop is at most RM11.61. These figures are for a single person.
- **The rebate line moves with family status.** So does the salary where PCB starts:

  | Status | Children | PCB starts at | Largest fall in take-home | Recovers at |
  |---|---|---|---|---|
  | Single, or spouse works, or divorced/widowed | 0 | RM3,445 | RM36.79, RM4,000 → RM4,001 | RM4,045 |
  | Spouse works, or divorced/widowed | 1 | RM3,612 | RM32.37, RM4,166 → RM4,167 | RM4,209 |
  | Spouse works, or divorced/widowed | 2 | RM3,778 | RM32.38, RM4,333 → RM4,334 | RM4,373 |
  | Spouse works, or divorced/widowed | 3 | RM3,945 | RM36.89, RM4,500 → RM4,501 | RM4,545 |
  | Spouse doesn't work | 0 | RM4,334 | RM49.04, RM4,333 → RM4,334 | RM4,393 |
  | Spouse doesn't work | 1 | RM4,501 | RM53.56, RM4,500 → RM4,501 | RM4,565 |
  | Spouse doesn't work | 2 | RM4,667 | RM49.02, RM4,666 → RM4,667 | RM4,729 |
  | Spouse doesn't work | 3 | RM4,834 | RM49.04, RM4,833 → RM4,834 | RM4,893 |

  Where the spouse doesn't work, PCB goes straight from RM0 to about RM50 a month at that line.
- **RM5,000 is a real line for employers.** Their EPF share falls from 13% to 12% above it, so going from RM5,000 to RM5,001 costs the employer RM35.10 *less* in total.
- **SKBBK costs up to RM44.65 a month.** That's RM37.15 at RM5,000, which is the difference opting out would make.
- **Most zakat comes back as a tax rebate, as long as it's no more than the year's tax.** Paying yourself, the money leaves each month and the rebate arrives after e-filing. With deductions in 2026, a single person owes zakat from RM4,309 a month. It's above their tax only from RM4,309 to RM4,369, by at most RM27.42 a year.
- **Zakat can exceed tax by much more in other cases.** The excess is lost, so these users pay more in total:

  | Case, with deductions | Salaries where zakat is above tax | Largest loss a year |
  |---|---|---|
  | 2026, single | RM4,309 to RM4,369 | RM27.42 |
  | 2026, spouse doesn't work, no children, no wife deduction | RM4,309 to RM4,900 | RM856.50 |
  | 2026, spouse doesn't work, wife deduction | None (checked with 0, 1, 2, 3 and 6 children) | RM0 |
  | 2026, single, age 60 | RM3,833 to RM4,142 | RM130.14 |
  | 2025, single | RM3,911 to RM4,369 | RM575.74 |

  On gross (Kaedah 1), a single person in 2026 pays more zakat than tax from RM2,833 to RM5,323.
- **What you keep falls as salary rises:** about 87.6% at RM3,000, 85.4% at RM5,000 and 81.5% at RM8,000.
- **Your EPF grows faster than your deduction.** At RM5,000, RM550 is deducted but RM1,200 goes into your EPF each month.
- **Employers pay more than the gross salary:** about 14.9% on top at RM5,000, and 13.5% at RM8,000.
- **SOCSO and EIS stop growing at RM6,000**, because of the wage ceiling.

## 8. How accurate it is

**PCB compared with a real payslip.** I compared annual tax ÷ 12 with the 12-month LHDN formula for every whole-ringgit salary from RM1,700 to RM30,000 (28,301 salaries):

| | Result |
|---|---|
| Any month differs by RM1 or more | 307 salaries, all between RM3,473 and RM3,779 |
| Largest single-month gap | RM18.01 at RM3,499, which pays RM0 until December, then RM19.65 |
| All other salaries | Under RM1 in every month (at most RM0.83) |
| Year total differs from annual tax by RM1 or more | 27 salaries, all between RM3,448 and RM3,667. Largest gap is RM9.98 at RM3,528 |

So it's very close except just above where tax starts. The comparison uses the PCB model built from LHDN's 2024 calculator, with its rounding by proxy for later years.

**The same comparison by family status:**

| Status | Salaries with a month RM1 or more off | Largest single-month gap | Salaries with a year total RM1 or more off |
|---|---|---|---|
| Spouse works or divorced/widowed, 0 children | 307, RM3,473 to RM3,779 | RM18.01 | 27, largest RM9.98 |
| 1 child | 306, RM3,639 to RM3,944 | RM18.15 | 28, largest RM9.98 |
| 2 children | 307, RM3,806 to RM4,112 | RM18.24 | 28, largest RM9.98 |
| 3 children | 307, RM3,973 to RM4,279 | RM18.01 | 27, largest RM9.98 |
| Spouse doesn't work, 0 to 3 children | None | RM0.05 | None, largest RM0.04 |

The spouse-doesn't-work rows are closest because their tax starts at about RM600 a year, so no month falls under LHDN's RM10 minimum.

**Checked against real payslips** (2026-11-06). The owner provided several real payslips from different years and employers. The figures stay private; only the findings are recorded here.

- **With basic salary entered,** current-year payslips matched every line: EPF, SOCSO and EIS for both employee and employer, and PCB within a few sen a month. The few sen are rounding, since payroll rounds PCB up to the next 5 sen. LHDN's month-by-month calculation matched the year-to-date PCB exactly.
- **Allowances aren't always wages.** One payroll charged neither EPF nor PCB on official-duty travel and phone allowances, so including them in the salary input understated take-home. This led to the label change in §2.
- **The year-to-date SOCSO** of an employee who had opted out of SKBBK held exactly one month of it, which fits June 2026 being payable for everyone (row below).
- **Also tested:** pay below RM6,000, the 13% employer EPF band, and LHDN's RM10 minimum, where payroll deducted RM0 for a month in which v1 shows a small PCB (the known gap).
- **The PCB method holds across years.** With the tax table in force at the time, LHDN's month-by-month method matched the payslips' PCB to the sen, including a month with a bonus.
- **Older years differ.** Earlier payslips used rules since changed: a temporary 9% employee EPF rate, a lower SOCSO and EIS ceiling, and the tax bands from before August 2023. Each moved take-home by tens of ringgit a month against today's rules.
- **A bonus month is far off.** v1, given the salary alone, was well over 20% off in a month with a bonus, because the bonus adds EPF and much more PCB. EPF was worked out on salary and bonus together.
- **Still not tested:** the rebate zone, age 60 and over, and zakat.

**Other known differences, all accepted for v1:**

| Difference | Size |
|---|---|
| 2026 includes SKBBK from January, but it started in June (N1) | Overstated by up to RM44.65 a month for 5 months. RM185.75 for the year at RM5,000 |
| The year someone turns 60 | Uses one set of rules all year, where a real payslip changes partway (D3) |
| Someone who first joined SOCSO at 55 to 59, or EIS at 57 to 59 | Slightly off, because under-60s are assumed to have joined earlier |
| Opted out of SKBBK in 2026 | v1 charges none for the year, but June 2026 was payable even for people who later opted out ([socso.md §2.3](socso.md#23-lindung-24-jam--skbbk-participation-rules-complete-timeline)). So the year is understated by one month, up to RM44.65 |
| Allowances | Not entered (D4). Take-home on a real payslip is higher by the allowance, less any EPF, SOCSO, EIS and tax charged on it. Which allowances are charged depends on the allowance and the employer; fixed transport is still open (X1) |
| Bonus and overtime | Not modelled (D4). A bonus month on a real payslip has more EPF and much more PCB than v1 shows, and the year's tax is higher too |
| Salary below RM1,700 | EPF is charged on RM1,700. Part-timers actually have a lower floor |
| Above RM20,000 | Employee and employer EPF split is provisional, by up to RM1 |
| Actual tax can be lower | Reliefs claimed at filing aren't included, so a refund is possible. This includes the RM350 relief (V3): RM1.75 a month at RM5,000 |
| Children aged 18 or over, or registered as disabled | Tax relief can be up to RM16,000 a child, against the RM2,000 used here. Zakat allows RM5,000 for a child 18+ in higher education. Not modelled (V4) |
| Parents sharing a child | Couples assessed separately may claim different children, and two people entitled to the same child can each get half. The count is taken as what this user claims |
| Registered disabled user or spouse | Extra relief of RM7,000 or RM6,000. Not modelled |
| Zakat paid through salary or declared on TP1 | PCB on the payslip will be lower than shown, because v1 assumes the user pays themselves and claims when e-filing (V6) |

## 9. Notes to show the user

These are draft wording for the first iteration.

- **Always:** "This is an estimate that assumes the same salary from January to December. Your payslip can differ slightly."
- **Older payslips:** "Payslips from earlier years used different EPF rates, contribution ceilings and tax bands, so they won't match this year's figures."
- **Bonus:** "A month with a bonus has more EPF and tax taken off than shown here."
- **Salary field:** "Enter your monthly salary without allowances, overtime or bonus. This is usually your basic salary. Allowances are left out because whether EPF and tax apply to them depends on the allowance and your employer."
- **Allowances:** "If you also get allowances, your actual take-home will be higher than shown."
- **PCB:** "Estimated as your year's tax divided by 12. Your actual tax may be lower once you claim reliefs when filing."
- **2026:** "Includes the LINDUNG 24 Jam (SKBBK) contribution, which started in June 2026, for all 12 months."
- **2027 (D6):** "2027 uses 2026 values until official figures are confirmed."
- **Below RM1,700:** "EPF is charged as if you earned the RM1,700 minimum wage."
- **Age 60 and over:** "Contribution rules change at 60. This applies those rules to the whole year."
- **Outside the baseline:** "Currently for Malaysian private-sector employees with one employer."
- **Spouse doesn't work:** "Choose this if your spouse has no income, or you're assessed jointly."
- **Children:** "Count children under 18 that you claim for. Older children who are studying, and children with a disability, can get more relief, which isn't included yet."
- **SKBBK opt-out:** "Most employees pay this. The opt-out window closed on 31 August 2026 and PERKESO's newest guidance says first-time workers must contribute, so use this only to compare, or if you've already opted out."
- **Zakat:** "For Muslims working in KL, Putrajaya or Labuan. Other states have their own rules. This is how much zakat you'd need to pay at this salary, and it isn't taken out of your take-home above. You can claim it as a tax rebate when you e-file."
- **Zakat above tax:** "Your zakat is more than your tax this year. Only RM[tax] can be claimed as a rebate, and the remaining RM[excess] isn't refunded."

## 10. V1 decisions

**No questions are left for v1.** All decided on 2026-11-06:

| Id | Decision | What it means for v1 |
|---|---|---|
| **V1** | **Zakat is opt-in** | Off by default |
| **V2** | **SKBBK is included by default, and the user can opt out** | This is about the calculation, not about who's allowed to opt out, so it isn't blocked by join date. Settles SOC1 and SOC2 for v1 |
| **V3** | **RM350 relief is left out for now** | **Revisit in the next iteration**, along with PCB1 and X7 |
| **V4** | **Marital status and children are in v1, with simple inputs** | Each child counts as under 18. Children's specific circumstances come later |
| **V5** | **Marital status is one list of four options** | Single; Married, spouse doesn't work; Married, spouse works; Divorced or widowed |
| **V6** | **Zakat is information, not a deduction** | The user pays it themselves, with no PCB offset, and claims the rebate when e-filing. Settles X6 for v1. Replaces showing both ways side by side |
| **V7** | **A wife-deduction checkbox** | Shown only when zakat is on and the user is married. PPZ has no husband deduction, and v1 doesn't ask gender. Implies the with-deductions method, which settles ZAK1 and ZAK8 for v1 |

## 11. Roadmap: where the research for each later feature lives

Nothing below is lost. Each feature's rules, sources and open questions are recorded here.

| Later feature | Research | Open questions |
|---|---|---|
| **RM350 SOCSO + EIS relief: revisit next iteration (V3)** | [pcb.md §8](pcb.md#8-interaction-with-the-other-modules), [cross-check.md §3.5](cross-check.md#35-skbbk-and-the-rm350-relief) | PCB1, X7 |
| **Zakat through salary or on TP1, offset against PCB** | [zakat.md §8.2](zakat.md#82-payroll-mtdpcb), `zakat_routes()` in [the script](data/v1-baseline.py) | X6 |
| **Bonus, commission, overtime** | [epf.md §3.4](epf.md#34-bonus-commission-arrears-and-separate-payroll-runs), [socso.md §2.4](socso.md#24-which-wages-count-shared-with-eis), [eis.md §2.1](eis.md#21-which-wages-count-s3-wages), [pcb.md §3.14](pcb.md#314-classifying-pay-overtime-tips-and-variable-items) | PCB5, ZAK6 |
| **Allowances** (one real payroll charged neither EPF nor PCB on official-duty travel and phone allowances, §8) | [data/epf-wage-components.json](data/epf-wage-components.json), [socso.md §2.4](socso.md#24-which-wages-count-shared-with-eis), [eis.md §2.1](eis.md#21-which-wages-count-s3-wages) | X1 |
| **Arrears** | [epf.md §3.4](epf.md#34-bonus-commission-arrears-and-separate-payroll-runs), [eis.md §3.3](eis.md#3-exact-algorithm), [cross-check.md §3](cross-check.md#3-settled-and-stated-conflicts) | X2 |
| **Salary start month, real monthly PCB, 12-month simulation** | [pcb.md §3](pcb.md#3-exact-algorithm), [pcb.md §3.11](pcb.md#311-recommended-simplification-for-the-app), `.research-cache/scripts/pcb_ref_official.py` | PCB3, ZAK3, ZAK5 |
| **Month-accurate rules and exact age** | [epf.md §3.1](epf.md#31-age-switch-timing), [socso.md §2.2](socso.md#22-first-vs-second-category-the-age-rule), [cross-check.md §3.4](cross-check.md#34-age-60-which-month-each-scheme-switches) | D3, SOC4 |
| **Detailed children and spouse: older children, studying, disability, shared claims** | [pcb.md §3.4](pcb.md#34-reliefs-inside-the-formula), [data/pcb-spec-2026.json](data/pcb-spec-2026.json), [zakat.md §2](zakat.md#2-applicability-rules) | ZAK8, ZAK9, ZAK10 |
| **TP1 reliefs, annual filing estimate** | [pcb.md §4](pcb.md#4-per-year-config), [data/tax-ya2026.json](data/tax-ya2026.json) | PCB2, PCB4, PCB8 |
| **More than one employer** | [socso.md §7](socso.md#7-user-selectable-options), [eis.md §7](eis.md#7-user-selectable-options). EPF and PCB still need research | D7 |
| **Government staff** | [epf.md §2](epf.md#2-applicability-rules), [socso.md §2.1](socso.md#21-who-contributes-under-act-4), [eis.md §2.3](eis.md#23-special-worker-types-gap-g1), [pcb.md §3.16](pcb.md#316-worker-categories), [cross-check.md §3.3](cross-check.md#33-one-shared-employment-input) | D2, X4, X5 |
| **Foreign workers and PRs** | [epf.md §2](epf.md#2-applicability-rules), [socso.md §2.1](socso.md#21-who-contributes-under-act-4), [pcb.md §3](pcb.md#3-exact-algorithm) for non-resident rules | D2, EPF1, EPF3 |
| **Domestic workers** | [cross-check.md §3.3](cross-check.md#33-one-shared-employment-input), [eis.md §2.3](eis.md#23-special-worker-types-gap-g1), [pcb.md §3.16](pcb.md#316-worker-categories) | D2, PCB7 |
| **Self-employed and gig** | [socso.md](socso.md) (Act 789 and Act 872), [pcb.md §3.16](pcb.md#316-worker-categories) | X3 |
| **Termination and retirement pay** | [pcb.md §3.15](pcb.md#315-termination-and-retirement-payments) | PCB6 |
| **Part-time and low pay** | [epf.md §3.2](epf.md#32-minimum-wage-floor) | EPF2 |
| **Higher EPF rates and top-ups** | [epf.md §7](epf.md#7-user-selectable-options) | EPF5 |
| **Growing wealth: EPF accounts, dividends, Basic Savings** | [data/epf-config.json](data/epf-config.json), [data/epf-basic-savings-by-age.json](data/epf-basic-savings-by-age.json) | EPF6 |
| **What each deduction gets you** | [eis.md §8](eis.md#8-benefits-briefly-what-you-get-for-this-deduction), [socso.md](socso.md) | SOC3 |
| **Future SKBBK rates** (1.00% from June 2028, 1.25% from June 2031) | [data/socso-act4-2026.json](data/socso-act4-2026.json), [data/socso-skbbk-2026.json](data/socso-skbbk-2026.json) | SOC5 |
| **Full zakat: older children, several wives, parents, education, savings, fitrah, state moves** | [zakat.md](zakat.md), [data/zakat-wp.json](data/zakat-wp.json) | ZAK3 to ZAK15, X6 |
| **The full config for all of the above** | [config-schema.md](config-schema.md) | |

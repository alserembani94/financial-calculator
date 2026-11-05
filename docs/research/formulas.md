# Formulas and how they change

Reference written 2026-11-06. It shows each line of the breakdown as a formula with its 2026 numbers, which numbers can change, and how each kind of policy change is handled. The detail and sources are in each scheme's report; the year-by-year structure is in [config-schema.md](config-schema.md); v1's choices are in [v1-baseline.md](v1-baseline.md).

**The idea:** every line is a fixed formula with that year's numbers plugged in. A policy change usually edits only the numbers. The formula itself changes only when the structure does, such as a new kind of contribution.

## 1. EPF

```
base       = max(salary, wage floor)                  // floor = minimum wage, RM1,700
band top   = base rounded up to the band width        // RM20 bands up to RM5,000, RM100 bands up to RM20,000
employee   = band top × employee rate, rounded up to the next ringgit
employer   = band top × employer rate, rounded up to the next ringgit
               employer rate = 13% if salary ≤ RM5,000, otherwise 12%
above RM20,000: employee = salary × 11% rounded up; employer = (salary × 23% rounded up) − employee
```

| Number | 2026 | By age |
|---|---|---|
| Employee rate | 11% | 0% at 60–74, nothing at 75+ |
| Employer rate | 13% / 12% | 4% at 60–74 |
| Line between 13% and 12% | RM5,000 | |
| Wage floor | RM1,700 | |
| Band widths | RM20 / RM100 | |

Example: at RM9,000 the band top is RM9,000. You pay RM9,000 × 11% = RM990, and your employer pays RM9,000 × 12% = RM1,080.

**Checked 2026-11-06:** the formula reproduces all 401 rows of the official Part A table exactly. The split above RM20,000 is provisional (EPF4). Details: [epf.md](epf.md), test script [data/verify-epf.py](data/verify-epf.py).

## 2. SOCSO

```
assumed wage = middle of the RM100 band the salary falls in (top band RM5,950, because of the RM6,000 ceiling)
employer     = assumed wage × 1.25% (injury) + assumed wage × 0.5% (invalidity)
employee     = assumed wage × 0.5% (invalidity) + assumed wage × 0.75% (LINDUNG 24 Jam)
```

| Number | 2026 | Changes ahead |
|---|---|---|
| Wage ceiling | RM6,000 | Was RM4,000, then RM5,000 |
| Injury rate (employer) | 1.25% | |
| Invalidity rate (each side) | 0.5% | |
| LINDUNG 24 Jam rate (you) | 0.75% | 1.00% from June 2028, 1.25% from June 2031 |
| Age 60+ | Employer pays injury only, you pay LINDUNG 24 Jam only | |

**The published table doesn't follow the formula exactly.** It rounds to the nearest 5 sen, with ties to even, and a few low bands are 5 sen off. In Phase 1, the LINDUNG 24 Jam amount is the injury amount minus the invalidity amount, not a clean 0.75%. So the calculator uses the official table, and the formula is only for checking it or building a future one. Details: [socso.md](socso.md).

## 3. EIS

```
each side = assumed wage × 0.2%, rounded up to the next 5 sen    (same bands and RM6,000 ceiling as SOCSO)
```

Paid from age 18 to 59. The maximum is RM11.90 for each side. Rounding up only matters in the six lowest bands. Details: [eis.md](eis.md).

## 4. PCB (income tax)

```
EPF relief      = min(your EPF × 12, RM4,000)
reliefs         = EPF relief + RM9,000 self + RM4,000 if your spouse doesn't work + RM2,000 × children
chargeable      = salary × 12 − reliefs
tax for year    = tax on chargeable income using the brackets, minus the RM400 rebate if it's RM35,000 or less
PCB             = tax for year ÷ 12
```

| Number | 2026 |
|---|---|
| Tax brackets | 0%, 1%, 3%, 6%, 11%, 19%, 25%, 26%, 28%, 30% |
| Self relief | RM9,000 |
| EPF relief cap | RM4,000 |
| Spouse relief | RM4,000 |
| Child relief | RM2,000 |
| Rebate | RM400 (RM800 with a non-working spouse), on chargeable income up to RM35,000 |

**LHDN's monthly table (M, R, B) is built from the brackets and the rebate:** M is a band's lower limit, R its rate, and B the tax on income up to M, less the rebate where M is below RM35,000. When the brackets change, the calculator rebuilds that table rather than storing it as a separate input.

PCB as annual tax ÷ 12 is v1's simplification (N2). The real monthly formula is `[(P − M) × R + B − (Z + X)] / (n + 1)`, which spreads what's left of the year's tax over the remaining months. Details: [pcb.md](pcb.md).

## 5. Zakat (for information only)

```
base  = salary × 12 − RM12,000 self − your EPF × 12 − RM2,000 × children − RM5,000 wife deduction
zakat = base × 2.5%, if base ≥ nisab; otherwise 0
```

The 2.5% rate is fixed by religious law. The **nisab changes every year**, because it follows the gold price (RM33,996 in 2026). The deduction amounts change only if PPZ changes them. Details: [zakat.md](zakat.md).

## 6. Results

```
take-home      = salary − your EPF − your SOCSO − your EIS − PCB
employer cost  = salary + employer EPF + employer SOCSO + employer EIS
into your EPF  = your EPF + employer EPF
```

## 7. How it handles future policy changes

Each year has its own set of numbers. A policy change edits that year's set, and the formulas stay the same unless the change is structural:

| Kind of change | Real example | What changes |
|---|---|---|
| **A value** | Self relief RM9,000 → RM12,000 (proposed); nisab every year; minimum wage | One number in that year's set |
| **A rate** | EPF employee 11% → 9% (2021–2022); LINDUNG 24 Jam 0.75% → 1.00% (2028) | The rate. The table is rebuilt from the formula, then checked against the gazetted one |
| **A band or ceiling** | New 24% tax band (proposed); SOCSO ceiling RM4,000 → RM5,000 → RM6,000 | The bracket list or ceiling. The tables built from them follow automatically |
| **A mid-year start** | LINDUNG 24 Jam from June 2026; minimum wage RM2,000 from June 2027 | A dated period inside the year. v1 uses the year-end rule (N1); a 12-month simulation would switch in the right month |
| **A new item** | LINDUNG 24 Jam added to SOCSO; the proposed RM150 relief | **A new term in the formula**, plus its number. This is the only kind that changes a formula |
| **Temporary** | EPF 9% that ended June 2022; tourism relief for one year | A period with an end date |
| **Proposed, not law** | Budget 2027 | Stays out until gazetted (owner's rule). Its numbers wait in a template file: [data/tax-ya2027-proposed.json](data/tax-ya2027-proposed.json), and the report [reports/Malaysia Budget 2027 tax changes.md](reports/Malaysia%20Budget%202027%20tax%20changes.md) |

**Published tables stay the source.** For EPF, SOCSO and EIS, the calculator uses the gazetted tables. The formulas above are for checking them and for building a table when a rate changes, before a new table is out.

# PCB / MTD and resident individual income tax: research notes

Status: **YA2025 and YA2026 confirmed. YA2027 is an unconfirmed template** built from the Budget 2027 speech, tabled 9 Oct 2026.
Researched 2026-11-04/05; deep verification pass 2026-11-05 (log near the end of this file). Data files are in `docs/research/data/`:

| File | Contents |
|---|---|
| `tax-ya2025.json`, `tax-ya2026.json` | Resident brackets, rebates, non-resident rate, relief list with caps and TP1 mapping, gift deductions, termination-payment exemptions |
| `tax-ya2027-proposed.json` | YA2027 template: Budget 2027 proposals. Items Budget 2027 didn't mention are carried forward and flagged |
| `pcb-spec-2025.json` | MTD computerised-method parameters for 2025, from the official 2025 spec (retrieved in the deep pass) |
| `pcb-spec-2026.json` | MTD computerised-method parameters for 2026, from the official spec |
| `pcb-spec-2027-template.json` | MTD 2027 template. The B values are **derived by us** |
| `pcb-verification-cases.json` | Official LHDN results, LHDN calculator results, and our computed cases |

## Research status

**Complete for building the 2025 and 2026 config.** Nothing below blocks the calculator. These items stay open:

1. **LHDN's calculator only runs year 2024.** The rounding details in §3.6 and §3.8 come from it, and from one GPO example. They carry to 2025 and 2026 by proxy, because the Table 1 and spec wording are the same. Confidence is medium-high. A run on e-PCB Plus would settle it (question 6).
2. **YA2027 is not law.** As of 2026-11-05 there is no Finance Bill on Parliament's list and no LHDN 2027 spec or TP1. Recheck points, inferred from the 2025 cycle and not official dates: the bill list from about 18 Nov 2026, the end of the Dewan Rakyat sitting on 8 Dec, the end of the Dewan Negara sitting on 22 Dec, the gazette around year end, and LHDN's page from Dec 2026 to Jan 2027.
3. **SKBBK and the RM350 relief.** Open: the statute points to yes, but no LHDN statement settles it (§8).
4. **What most payroll software does with the SOCSO + EIS relief.** Only a few vendors could be checked (§8).
5. **Household employers.** No LHDN guidance found, and the parent 1994 Rules (P.U.(A) 507/1994) were not obtained (§3.16).
6. **Smaller unverified points:** LTAT's approved-scheme status; statutory-body pensionable staff under s.49(1)(b); tips and service charge in Y1; the 2014 FAQ on late-filing penalties; the subsidised-loan formula, which the spec prints as an image we could not render (§2).

PwC's Budget 2027 note was not read (HTTP 403; a Wayback snapshot exists, §11). Nothing depends on it, because the MOF annexes are primary.

Local copies of sources are in `.research-cache/pcb/` and `.research-cache/pcb/verify/`. Scripts are in `.research-cache/scripts/`: `pcb_ref_official.py` is the current model. `pcb_ref.py` is kept only for history and should not be used (§6.1).

---

Terminology: **PCB** (*Potongan Cukai Bulanan*) = **MTD** (Monthly Tax Deduction). **YA** = year of assessment, the same as the calendar/financial year for an employee. **TP1** = the form an employee gives the employer to claim optional reliefs and rebates for PCB. **TP3** = the form a new employee gives with previous-employer figures for the year. **BE** = the annual tax return for residents without business income.

---

## 1. Summary for a non-expert

- **Income tax is charged on the year, but collected monthly.** Your employer estimates your *whole-year* tax from what you've earned so far and what you'll probably earn for the rest of the year. It subtracts the tax already deducted and spreads the remainder over the months left. That monthly amount is PCB.
- **What reduces your tax.** These come off your income before tax is worked out:
  - **RM9,000** for yourself, automatically.
  - Your EPF contributions, **up to RM4,000 a year**.
  - **RM4,000** if your spouse doesn't work.
  - **RM2,000 to RM16,000 per child**, depending on age, studies and disability.
  - Many optional reliefs, such as insurance, medical, gadgets, sports, childcare and SOCSO/EIS. These only lower your monthly PCB **if you declare them to your employer on Form TP1**. Otherwise you claim them when you file your annual return.
- **Tax rates are progressive**, from 0% to 30%. For YA2025 and YA2026 the first RM5,000 of chargeable income is tax-free, the next RM15,000 is taxed at 1%, and so on. **YA2025 and YA2026 use exactly the same rates.** Budget 2026 did not touch these brackets. It changed reliefs, and added a separate 2% rate on large LLP profit distributions to partners, which doesn't affect salary.
- **Small incomes pay nothing.** If your chargeable income is RM35,000 or less, you get a **RM400 rebate** (RM800 if your spouse doesn't work), which wipes out the small amount of tax at that level. In practice, a single person paying normal EPF sees **no PCB in January until RM3,778/month** gross, though PCB can start later in the year from RM3,473/month (§6.2). A married person whose spouse doesn't work has none until RM4,334/month. Watch out for the **"rebate cliff"**: just above RM35,000 of chargeable income, tax jumps by RM400 a year (about RM600 for Category 2).
- **Zakat is a ringgit-for-ringgit offset.** Zakat paid through payroll is subtracted from PCB, so it replaces tax rather than adding to it, up to the tax left after your other rebates. Non-residents get no zakat rebate and no PCB offset.
- **Bonuses** get their own formula. The employer works out the whole-year tax with and without the bonus, and the difference is deducted in the bonus month.
- **Overtime** counts as normal monthly pay for PCB, so a one-off overtime payment can push that month's PCB up briefly (§3.14).
- **Retrenchment and retirement payments** are often partly or fully tax-free. Only the taxable part goes into PCB (§3.15).
- **Non-residents** (generally people in Malaysia for fewer than 182 days in the year) pay a **flat 30%** with no reliefs.
- **PCB can be your final tax.** If you have only employment income with PCB deducted, you may choose not to file. Your PCB then counts as your final tax, but you give up any refund or extra reliefs.
- **YA2027 (proposed, not law yet):**
  - Self relief rises to **RM12,000**.
  - The RM70k–100k band falls to **18%**.
  - A new RM100k–150k band is taxed at **24%**.
  - The **30%** top rate starts at **RM1 million** instead of RM2 million.

---

## 2. Applicability rules

| Rule | Detail | Source |
|---|---|---|
| Who deducts PCB | Every employer, from every employee's taxable remuneration each month. The legal basis is s.107(2) ITA and the Income Tax (Deduction from Remuneration) Rules 1994 (P.U.(A) 507/1994). | GPO 1/2024 §1, §3 |
| Methods | (a) **e-Jadual PCB**, the electronic schedule in e-CP39, used by employers without payroll software; or (b) the **Computerised Calculation** method, used by LHDN's e-PCB / e-CP39 / Kalkulator PCB and by verified payroll software. The app should implement (b). | GPO 1/2024 §4.1 |
| Residence (s.7 ITA) | Resident for a basis year if any of these holds: (a) in Malaysia **≥182 days** in the year; (b) <182 days, but the stay links to a period of ≥182 consecutive days spanning the year before or after (temporary absences ≤14 days count); (c) ≥90 days in the year **and** resident or ≥90 days in 3 of the 4 preceding years; (d) resident in the following year **and** in each of the 3 preceding years. Status is decided year by year, by physical presence, not citizenship. | LHDN "Tax Treatment Residents & Non-Residents" (updated 08/04/2026); PR 11/2017 |
| PCB residence for foreigners | Since Aug 2017, foreign employees with an employment contract of **≥182 days** (including VP(TE) holders and expatriates) are given **resident** MTD. | Spec 2026 §D(a) |
| Non-resident | MTD = **30%** of taxable remuneration (monthly pay + BIK + VOLA + additional pay). Exempt allowances are excluded. No reliefs, rebates or categories, and no zakat rebate or offset. The general rounding and RM10 rules still apply (§3.9). Employment income for periods of 60 days or less can be exempt (Sch.6 para 21, subject to para 22). | Spec 2026 §D(a), §E.1–3; ITA Sch.1 para 1A, s.6A(1); LHDN slides 2024 ("Kadar Semasa: 30%"); LHDN calculator 2024 page |
| Employee category | **Category 1**: single. **Category 2**: married, spouse not working (spouse relief claimed). **Category 3**: married with a working spouse, divorced, widowed, or single with an adopted child. In Category 1, children are forced to 0. Single parents (divorced or widowed) use Category 3; that is an inference from the category wording. The disabled-spouse relief Su applies only in Category 2 (§3.4). | Spec 2026 §D(b)(1); GPO 1/2024 §4.3.2 |
| Remuneration types | **Normal**: monthly pay whether fixed or variable, including overtime, commission-only pay, monthly allowances and daily/hourly pay totalled for the month. **Additional**: bonus, arrears, ESOS (only if the employee opts for MTD), tax borne by employer, the taxable part of gratuity and compensation for loss of employment, ex-gratia, director's fees, commissions, allowances or perquisites not paid monthly, and any other extra payment. The test is the payment pattern (§3.14). | Spec 2025 and 2026 §D(b)(1)–(2); LHDN calculator note on overtime; P.U.(A) 314/2013 |
| BIK / VOLA | Benefits-in-kind and value of living accommodation are added to Y1 (and so projected through Y2) for MTD only, not to the payslip or EA, and for the current year only. Two input methods: (i) the employer keys in a monthly amount, or (ii) annual value ÷ remaining months including the current one, cut to whole ringgit (25,000 ÷ 9 = 2,777.77 → RM2,777.00). | Spec 2026 §E.11–12 |
| Exempt items | Excluded from MTD remuneration, with any excess taxable: petrol/travel/toll for official duty up to RM6,000/yr, with a further deduction for documented official spending above that; **care allowance for a child (up to 12 in the spec), parents, adoptive parents or grandparents, up to RM3,000/yr combined, from YA2025**; meal allowance, if regular at the same rate for all employees or at a rate in the employer's written instruction, limited to actual spending; parking rate and allowance; award perquisites up to RM2,000; **one unit per asset category** (fixed line, mobile, pager, PDA), covering the gift of the device and monthly bills including broadband; subsidised housing, education or car loan interest, fully exempt if total loans are RM300,000 or less, otherwise limited by a formula on A, B and C (reported as A × B / C; the spec prints it as an image we could not render, so check it before coding). The spec's §E.9 still says "child care allowance", which is narrower than the 2025 Order. | Spec 2025 and 2026 §E.9; P.U.(A) 113/2025 para 2(3)(c), effective YA2025 |
| Mid-year joiners | The employee submits **TP3** with year-to-date figures from previous employers. These feed into ∑(Y−K), X, Z and ∑LP. Trap: TP3 D11(a) is life/voluntary EPF (3,000) and D11(b) is voluntary EPF (4,000), the reverse of TP1 C11. | Spec 2026 §E.10; spec 2025 Exhibit 2 |
| TP1 | The employee may submit TP1 in any month to claim optional reliefs and rebates. Employers must process it **at least twice a year**, and TP1 may be submitted more than twice. | GPO 1/2024 §4.2; TP1 notes 2026 |
| PCB as final tax (s.77C ITA, since YA2014) | Employees with employment income and PCB may elect **not to file** the return, and PCB is then their final tax. Not filing is itself the election (s.77C(2)(a)), so there is no form. The conditions and consequences are below. | LHDN Practice Note 1/2021; ITA s.77C |
| Filing / registration | LHDN says an individual with annual employment income above **RM37,333** and PCB deducted is liable to tax (in other words, must be registered). The BE deadline is 30 April. Form B (business income) is due 30 June under s.77(1)(a). | LHDN "Tax Treatment" slides p6, p19; ITA s.77 |
| Who has no PCB | Self-employed and gig workers: no MTD (§3.16). Government staff and domestic workers have no exemption and use the normal path (§3.16). | ITA s.107, s.107B; GPO 1/2024 §3.1 |

**PCB as final tax: conditions (Practice Note 1/2021, YA2016 onward)**

All of these must hold:
- Employment income only.
- The same employer for the year. Someone with two or more employers in the year must file (s.77C(1)(c)). Twelve months of service is not required.
- Tax not borne by the employer.
- No joint assessment (s.45).
- PCB deducted under the Rules, or no PCB because income was below the threshold ("PCB kosong").
- BIK and VOLA included in the PCB calculation.
- Since YA2015, less than 12 months with the employer, or a new employee, is also allowed.
- Arrears received in the year are taxed in the year received (s.25(1)).

Consequences of electing it:
- No refund of any over-deduction.
- Reliefs not declared on TP1 are lost unless the employee files a BE.
- LHDN can still raise an assessment if it finds other income (for example rent).
- Filing late, to claim a refund, can attract a s.112(3) penalty. LHDN's FAQ says no penalty applies if actual tax equals the MTD, and otherwise the penalty is worked on tax before set-off and can be offset against the refund. That FAQ dates from 2014, so confirm it before stating it as current.

**Implication for the app:**
- The "PCB ≈ final tax" shortcut is accurate only for a salary-only employee whose TP1 claims match their actual reliefs.
- Otherwise, show the **annual tax** (§3.13) next to PCB, and the expected refund or balance.

---

## 3. Exact algorithm

Identical in 2024, 2025 and 2026. The 2026 spec says: *"In line with the Budget 2026 … there is no amendment to the MTD formula."* The 2025 and 2026 §D formula text is identical; Table 4 (C-suite) was added between the 2024 and 2025 specs.

The steps below follow the spec and also LHDN's own Kalkulator PCB, where the spec's wording leaves a detail open. Each such detail is marked **(calculator)**. The calculator only runs year 2024, so these details reach 2025 and 2026 by proxy.

### 3.1 Variables

| Symbol | Meaning |
|---|---|
| **P** | Chargeable income projected for the whole year |
| **∑(Y−K)** | Accumulated **net** normal plus additional remuneration paid **before** the current month, including previous employers' (from TP3) |
| **Y** | Accumulated gross normal plus additional remuneration paid before the current month |
| **K** | Accumulated EPF (or other approved scheme) on Y, subject to the annual qualifying amount |
| **Y1** | Gross normal remuneration for the current month, including overtime, monthly allowances and BIK/VOLA. Y1 = 0 if only additional remuneration is paid |
| **K1** | EPF on Y1, capped so that K + K1 ≤ 4,000 |
| **Y2** | Estimated normal remuneration for each remaining month. Always equal to the full Y1, including any variable part |
| **K2** | Estimated EPF for each remaining month: **min([4,000 − (K + K1 + Kt)] ÷ n, K1)** |
| **Yt** | Gross additional remuneration for the current month |
| **Kt** | EPF on Yt, subject to the cap (K + K1 + Kt ≤ 4,000) |
| **n** | Remaining months after the current month (12 − month number). n + 1 includes the current month |
| **D** | Individual relief = 9,000 |
| **S** | Spouse relief = 4,000, Category 2 only |
| **Du** | Disabled individual = 7,000 (YA2025+) |
| **Su** | Disabled spouse = 6,000 (YA2025+). Category 2 only |
| **Q** | 2,000 per child unit |
| **C** | Number of qualifying child units. 0 in Category 1. Can be fractional. Units table in §3.4 |
| **∑LP** | Optional (TP1) deductions accumulated this year before the current month, including from previous employers |
| **LP1** | Optional (TP1) deductions claimed this month |
| **M, R, B** | Table 1 lookup by floor(P): band floor, rate, and tax at M **after** the rebate (§3.5) |
| **Z** | Zakat and departure levy accumulated this year, **excluding** this month's. It takes each month's full amount, not just any excess over MTD |
| **X** | MTD accumulated for previous months this year, including previous employers'. Excludes additional MTD the employee asked for (CP38) and tax instalments |
| **T** | Rebate used in the 15% regimes (400 / 800 if P ≤ 35,000) |

`*` K + K1 + K2·n + Kt ≤ 4,000 (the "total qualifying amount per year").

### 3.2 Normal remuneration (each month)

```
1. Category c ∈ {1,2,3}; C = 0 if c = 1; S = 4,000 if c = 2 else 0; Su only if c = 2.
2. K1 = min(EPF_employee_this_month, max(0, 4000 − K))
   K2 = n > 0 ? min( trunc2((4000 − (K + K1)) / n), K1 ) : 0     (floor at 0)
3. P = trunc2( ∑(Y−K) + (Y1 − K1) + (Y2 − K2)·n
               − [ D + S + Du + Su + Q·C + (∑LP + LP1) ] )
4. If floor(P) ≤ 5,000 → annual tax = 0.
   Otherwise find the row with M < floor(P) ≤ next M (calculator):
   annualTax = trunc2(trunc2((P − M) × R) + B[category])      (may be negative;
                                                               the sum uses the fractional P)
5. raw = trunc2( (annualTax − (Z + X)) / (n + 1) )
6. MTD_current = raw if raw ≥ 10, otherwise 0                 (test BEFORE rounding; calculator)
7. Net = MTD_current − zakat_this_month − levy_this_month
   Payable = Net ≤ 0 ? 0 : roundUpTo5sen(Net)                 (round once, after zakat; calculator)
   A positive Net below RM10 is still deducted, as long as MTD_current was ≥ 10.
8. Carry forward: ∑(Y−K) += Y1−K1; K += K1; X += Payable;
   Z += zakat_this_month + levy_this_month (the full amounts); ∑LP += LP1.
```

Self-correction: because each month re-projects the whole year and subtracts X, rounding drift is corrected later in the year. For a flat salary with annual tax of about RM120 or more, the 12 deductions add up to the annual tax rounded up to the next 5 sen, so exact or up to 4 sen over. Lower down the RM10 rule can leave the total short (§3.11).

Example of step 7: MTD 110.00 − zakat 50.33 = 59.67, payable 59.70.

### 3.3 EPF in the formula

- Monthly EPF goes through K1, K2 and Kt, **not** as a flat RM333.33/month. The annual cap is RM4,000 under s.49(1)(b). K1 comes from the EPF module's Third Schedule table, chosen by citizenship, age and wage month, never Y1 × rate. Cap K1 and Kt in the engine, because the calculator rejects a single EPF entry above 4,000.
- **Kt = table(Y1 + Yt) − table(Y1)**, never 11% of the bonus. LHDN's Exhibit 5 uses Kt 908 where the table gives 913. The April result stays 833.70 because the cap has already been reached.
- Overtime adds to Y1 and Y2 but not to K1 or K2, because EPF wages exclude it (§3.14).
- When EPF is ≥ 4,000/yr, K2 shrinks so the projected total is exactly 4,000. Example: salary 5,500, EPF 605 → K2 = (4,000 − 605)/11 = 308.63.
- If the employee's EPF is below 4,000/yr, K2 = K1 and the actual EPF is used. On Third Schedule Part A that means wages up to RM3,020.00 (RM333/month, RM3,996/year). From RM3,020.01 the share is RM335/month and the cap applies. On Part C the cap applies from RM6,000.01.
- **Voluntary EPF** (TP1 C11(a)) is an LP1 item. Mandatory plus voluntary EPF together may not exceed 4,000 under 49(1)(b). Any excess can use the 3,000 "life insurance / additional voluntary EPF" slot under 49(1)(a). With **no** mandatory EPF (for example a director, a pensionable officer, or a citizen aged 60+ on a 0% employee rate), voluntary EPF up to **7,000** can be claimed (4,000 + 3,000), but the 7,000 needs voluntary EPF of at least 4,000: the s.49(1)(b) slot takes EPF or an approved scheme only, and life insurance alone never exceeds 3,000. See spec 2026 §E.13(iv)–(vi); e-BE YA2025 notes G17.

  ```
  s49b = min(4000, compulsory + voluntaryEpf)
  voluntaryLeft = voluntaryEpf − max(0, s49b − compulsory)
  s49a = min(3000, lifeInsurance + voluntaryLeft)
  total = min(7000, s49b + s49a)
  ```

  This reproduces LHDN's four examples in G17: Saiful 3,000, Sally 7,000, Charlene 7,000, Manaf 7,000.
- Allowance subject to EPF but not to tax: if it is normal remuneration, the whole EPF goes into K1. If it is additional remuneration, the EPF difference goes into Kt (spec §E.13(i)–(iii)).
- The e-Jadual (schedule) method instead caps EPF at **RM333/month**. That is irrelevant if we implement the computerised method.

### 3.4 Reliefs inside the formula

| Kind | Items | How they enter |
|---|---|---|
| Compulsory | D 9,000; S 4,000 (Category 2); Q·C children; EPF (K) | Always applied from the employee's personal data |
| Additional (computerised method) | Du 7,000; Su 6,000 (Category 2 only); disabled-child units | Applied from the employee's declared status (JKM registration) |
| Optional | Everything on TP1 Part C (C1–C17, §4.4) | LP1 in the month claimed, then ∑LP. Each is capped at its annual limit |
| Rebates | Self and spouse 400 (in B); zakat (Z / current-month zakat); TP1 Part D: zakat paid outside payroll, umrah/religious departure levy | See §3.7 |

**Child units (C), YA2025 and YA2026** (spec 2026 §E.14(i)(c); LHDN YA2025 relief page):

| Child | Units | RM |
|---|---|---|
| Under 18, unmarried | 1 | 2,000 |
| 18+, unmarried, full-time pre-tertiary (A-Level, certificate, matriculation, preparatory) | 1 | 2,000 |
| 18+, diploma+ in Malaysia, degree+ abroad, or serving under articles or indentures | 4 | 8,000 |
| Disabled (certified by JKM) | 4 (was 3 up to YA2024) | 8,000 (was 6,000) |
| Disabled, 18+, studying diploma+ (Malaysia) or degree+ (abroad), or under articles or indentures | 8 (was 7) | 16,000 (was 14,000) |

Spouses filing separately may each claim **different** children (LHDN testing question 2, 2026; BE notes H16). C is the number of units the employee claims. Three more rules from the Act:

- **Half shares, s.48(4).** Where two or more people are each entitled to claim the same child (for example divorced parents), each gets 50%: 0.5 unit (RM1,000), 2 units for a 4-unit child (RM4,000), or 4 units for an 8-unit child (RM8,000). So C isn't always a whole number. The spec has no half-unit rule. The calculator accepted this only in a run for an under-18 child, so the other half-share values are from the Act. A wife assessed separately may elect the whole deduction (s.48(1) proviso), though PR 7/2025 Example 49 still limits her to 50% if a third person is entitled.
- **Child's income, s.48(5).** No relief if the child's own total income exceeds the deduction otherwise due. Scholarships and articled-service payments aren't counted.
- **Age test, s.48(1)(a).** "Under 18" is tested at any time in the basis year, so a child turning 18 mid-year still qualifies.

**Su is not free-standing.** The spouse deduction conditions must be met (no income or no total income, or joint assessment), so Su is available in Category 2 only. A Category 3 employee with a working, separately assessed disabled spouse gets no Su (s.45A, s.47(1), s.47(4); the calculator gives Su = 0 in that status).

### 3.5 Table 1: P, M, R, B (YA2025 = YA2026)

| P (RM) | M | R | B Category 1 & 3 | B Category 2 |
|---|---|---|---|---|
| ≤ 5,000 | – | – | tax = 0 | tax = 0 |
| 5,001 – 20,000 | 5,000 | 1% | −400 | −800 |
| 20,001 – 35,000 | 20,000 | 3% | −250 | −650 |
| 35,001 – 50,000 | 35,000 | 6% | 600 | 600 |
| 50,001 – 70,000 | 50,000 | 11% | 1,500 | 1,500 |
| 70,001 – 100,000 | 70,000 | 19% | 3,700 | 3,700 |
| 100,001 – 400,000 | 100,000 | 25% | 9,400 | 9,400 |
| 400,001 – 600,000 | 400,000 | 26% | 84,400 | 84,400 |
| 600,001 – 2,000,000 | 600,000 | 28% | 136,400 | 136,400 |
| > 2,000,000 | 2,000,000 | 30% | 528,400 | 528,400 |

B = cumulative tax at M, minus the RM400 self rebate (and the RM400 spouse rebate in Category 2) when P ≤ 35,000. This is why the old code's "rebate when chargeable ≤ 35,000" gives the same answer.

**Choose the row on floor(P), the whole-ringgit part of P (calculator).** The tax sum still uses the fractional P. So P = 20,000.50 uses M 5,000, and P = 35,000.99 uses M 20,000, R 3%, B −250: tax 200.02. The upper row starts at P = 35,001.00: M 35,000, R 6%, B 600, tax 600.06. This matches the spec's integer ranges, and the calculator also confirmed it at 50,000.50, 70,000.50 and 100,000.50. It matters: K2's truncation can leave P a few sen above 35,000 for someone whose true chargeable income is exactly 35,000 (Case 12).

Legal basis: Table 1 in the Rules 1994 Schedule para 4(1) was last replaced by P.U.(A) 230/2023 from 1 Aug 2023, and all 9 rows match the spec. The YA2021 table in P.U.(A) 123/2021 is out of date, so don't use it. Any YA2027 table needs a new amendment, whose date may not be 1 January.

### 3.6 Rounding and minimums (spec 2026 §E.1–4, §E.6)

1. **Truncate** every calculation to 2 decimal places ("omit subsequent figures": 123.4534 → 123.45). This applies to K2, P, tax and MTD.
2. MTD for the month before zakat **below RM10 → not deducted**. Test the truncated figure **before** any rounding (calculator): raw 9.97 → 0, not 10.00. Raw 10.00 → 10.00.
3. Net MTD after zakat below RM10 → **still deducted**, provided MTD before zakat passed step 2.
4. MTD on additional remuneration below RM10 → not deducted, also tested before rounding (calculator).
5. **Round up** to the next 5 sen, **once**, on the final payable figure, after zakat (calculator): .01–.04 → .05 and .06–.09 → next .10. For example, 287.02 → 287.05 and 152.06 → 152.10. Don't round MTD and additional MTD separately: 535.13 + 633.27 = 1,168.40, where rounding each part gives 1,168.45.
6. Pay the actual amount, including sen.

What is printed and what is observed: rules 1, 3, the RM10 thresholds and the round-up direction are printed in the 2025 and 2026 specs. The order in rules 2, 4 and 5 is not spelled out in the spec, and comes from the calculator (2024 page). Its RM10 minimum has a legal basis in the Rules 1994 Schedule para 5(4), inserted by P.U.(A) 123/2021 from 1 Jan 2021.

The e-Jadual schedule method rounds **to the nearest** 5 sen (up or down) with a RM1 minimum (GPO 1/2024 §6.1.1). It is not used here.

### 3.7 Zakat and rebates

**In payroll (MTD):**
- Each month, Net = MTD_current − zakat paid that month (by salary deduction, or declared on TP1 D1(a) for zakat paid directly to a zakat centre). Previous zakat is in Z. The departure levy on TP1 D1(b) follows the same path (spec §E note 5 covers "zakat and departure levy" together).
- **With no bonus in the month**, payable = max(0, Net). Zakat larger than MTD → nothing is deducted.
- **In a bonus month, Net is not floored** before the bonus MTD is added (§3.8).
- **Z takes the month's full zakat**, whether or not it exceeded MTD, including in months when an under-RM10 MTD was set to 0. It works only within the same year. Any zakat above MTD reduces later months only indirectly, because X rose by less.
- Spec §E.5(i) examples, no additional pay:
  - MTD 8 → 0 because it is under RM10; zakat 5; Z += 5.
  - MTD 15, zakat 20 → net 0; Z += 20.
  - MTD 15, zakat 8 → net 7, still deducted; Z += 8.
  - MTD 120, zakat 100 → net 20; Z += 100.
- Spec §E.5(ii) examples, with additional pay:
  - MTD 8 → 0, zakat 5, additional 9 → 0: payable 0.00.
  - MTD 8 → 0, zakat 5, additional 25.00: −5 + 25 = 20.00.
  - MTD 15, zakat 20, additional 32.55: −5 + 32.55 = 27.55, not 32.55.
  - MTD 15, zakat 8, additional 127.30: 134.30.
  - MTD 120, zakat 100, additional 392.25: 412.25.

**At year end (annual tax):**
- **One pooled cap, s.6A(4).** The total of the self and spouse rebates, the departure levy and zakat cannot exceed the tax charged before rebates. The excess isn't refunded and can't be set against this or a later year's tax. Rebates apply before s.110 set-off and s.132/133 credits (s.6A(1)). PCB isn't a rebate, so overpaid PCB is refundable while excess rebate is lost.
- **No ordering is needed.** The cap is pooled, so the order doesn't change tax payable. PR 3/2023 lists the rebates as one block, and Example 7 attributes the lost RM1,055 jointly ("lebihan rebat individu dan zakat"). To show "zakat that actually saved tax", treat zakat as last: `usefulZakat = min(zakat, max(0, taxCharged − selfSpouse − levy))`. That is a display choice, not a rule.
- **Self and spouse rebates**, RM400 each (s.6A(2)(a)–(c)), apply when chargeable income ≤ 35,000. The spouse rebate needs a deduction under s.47(1) or (2), which includes alimony, or s.45A for a wife. It isn't limited to the RM4,000 spouse relief. In MTD both are inside B, for Category 2 only, so an alimony-based rebate shows up only in annual tax.
- **Only the taxpayer's own zakat counts. There is no non-working-spouse exception.** PR 3/2023 says zakat paid by a husband or wife who doesn't work or has no income can't be set against the other spouse's tax (Example 8).
- **Departure levy** for umrah or other religious pilgrimage: the amount is under s.6A(2A). The limit of 2 times is s.6A(2B)(a), and the hajj exclusion is s.6A(2B)(b). Own travel by air. On TP1 it is D1(b).
- **Rebate cliff.** At chargeable income just above 35,000, payable tax jumps RM400 for Categories 1 and 3 (200 → 600) and about RM600 for Category 2 (0 → 600), not RM800, because rebate above the RM600 tax charged was already lost under s.6A(4).
- **Non-residents get no zakat rebate and no MTD offset** (§3.9).

### 3.8 Additional remuneration (bonus month)

```
Step 1  Compute P and raw as in §3.2 WITHOUT this month's Yt/Kt.
        MTD_current = raw if raw ≥ 10, otherwise 0              (never rounded here)
        Net = MTD_current − zakat_this_month                    (NOT floored at 0)
        totalMtdYear = X + MTD_current × (n + 1)
Step 2  Recompute P INCLUDING (Yt − Kt). K2 is recomputed with Kt:
        K2 = min([4000 − (K + K1 + Kt)]/n, K1)
Step 3  annualTax = (P − M) × R + B          (Table 1 on floor of the Step-2 P)
Step 4  MTD_additional = trunc2(annualTax − (totalMtdYear + Z))
        → 0 if below RM10 (tested before rounding) or negative
Step 5  Sum = Net + MTD_additional
        Payable = Sum ≤ 0 ? 0 : roundUpTo5sen(Sum)              (round once, on the sum)
```

Notes:
- "Zakat already paid" in Step 4 is Z.
- **Step 1[E] uses the unrounded MTD_current. This is settled.** The calculator shows it: single, RM10,000, EPF 1,100, bonus 10,000, EPF 1,100: 929.16 × 12 = 11,149.92, tax 13,650.01, additional 2,500.09, payable 3,429.25. Published support: GPO 1/2024 s7.2 Contoh 4, the computerised method, shows 71.33 × 12 = 855.96. An under-RM10 raw counts as 0 here: single RM3,700 with a RM10,000 bonus has raw 7.66, so totalMtdYear is 0 and payable is 984.00.
- **A negative Net offsets the bonus MTD.** This is printed in spec §E.5(ii). MTD 110, zakat 150, additional 950 → −40 + 950 = **910.00**. Zakat is not lost in that month.
- Since YA2016, employment income is taxed in the **year received** (s.25(1)). Arrears for earlier years are additional remuneration this year.
- Commission, allowance or perquisite not paid monthly: Kt = total EPF minus EPF on normal pay (spec §E.13(ii)–(iii)).

### 3.9 Non-resident

MTD = 30% × (remuneration + BIK + VOLA + additional remuneration) for the month, excluding exempt allowances. No reliefs, rebates or category logic. The general §E rules still apply: keep 2 decimals, below RM10 → 0 (tested before rounding), then round up to the next 5 sen.

| Remuneration | 30% | MTD | Source |
|---|---|---|---|
| 3,000 | 900.00 | 900.00 | Spec example |
| 5,000 | 1,500.00 | 1,500.00 | Calculator |
| 1,234.56 | 370.36 | 370.40 | Calculator |
| 33.00 | 9.90 | 0.00 | Calculator |
| 5,000 + bonus 1,234.56 | 1,870.36 | 1,870.40 | Calculator |

**No zakat rebate and no MTD offset.** s.6A(1) rebates tax on "every individual resident", and the specs put all zakat terms in the resident formulas only; the calculator's non-resident form has no zakat field. Neither spec says this outright, but take-home pay falls by the full zakat. A foreign employee on a contract of 182 days or more runs the resident MTD path (§2), so payroll netting does happen during the year. If they turn out non-resident for the year, the rebate falls away; that last step is an inference, and no LHDN text on clawback was found.

### 3.10 Special 15% regimes (optional, low priority)

These apply only with Minister/LHDN approval:
- **Returning Expert Programme (REP)**: 15% for 5 consecutive YAs.
- **Knowledge worker in a specified region** (Iskandar, now IRDA): 15%.
- **Non-citizen C-suite in an approved company**: 15%.

```
REP / knowledge worker:  MTD = [ (P × 15% − T) − (Z + X) ] / (n + 1)
                         T = 400 (Category 1 & 3) or 800 (Category 2) if P ≤ 35,000, else 0
C-suite:                 MTD = [ P × 15% − (Z + X) ] / (n + 1)   (Table 4: P > 35,000, R = 15%)
```

Recommendation: leave these out of the beginner UI, perhaps behind an "advanced: special tax status" toggle.

### 3.11 Recommended simplification for the app

- Most users enter a flat monthly salary. The **January calculation** (month = 1, n = 11, no history) gives the steady-state PCB **only when January's raw figure is at least RM10 and P isn't at the RM35,000 rebate edge**. There it differs from later months by at most 5 sen. Example: 929.20 / 929.15 at RM10,000.
- **Below that, January misleads.** For a single employee on Part A EPF, RM3,473–3,777 shows RM0 in January, but PCB of RM10 or more falls due later in the year. Example: RM3,500 pays 0 for January to October, then 10.00 in November and December (total 20.00). RM3,700 pays 0, 0, 0, then 10.20–10.25 from April (total 92.00). The same applies to about RM3,806–4,111 for Category 3 with 2 children.
- **Totals.** Scanning single employees on whole-ringgit salaries from RM3,000 to RM12,000 (9,001 salaries, Part A EPF): the year's deductions are never 5 sen or more above annual tax. 30 salaries fall short because of the RM10 rule. RM3,445–3,472 pay nothing against annual tax of up to RM9.92, and the largest gap is RM9.98 (RM3,528 pays 20.10 against 30.08). Tax under RM10 for the year is never collected.
- Show it as "monthly PCB (approx.)". **Simulate 12 months** whenever a bonus, a pay change, one-off overtime or a TP1 claim month is entered, and for salaries in the low bands above. For one-off overtime, a January figure would project the overtime across the year (§3.14).

### 3.12 Differences between the 2025 and 2026 specs

The formula, Table 1, the categories, the rounding rules and the D, S, Du, Su and child-unit values are unchanged. The changes are relief/TP1 items from Budget 2026, all effective YA2026:

| # | Item | 2025 | 2026 |
|---|---|---|---|
| 1 | Vaccination, under the self/spouse/child medical relief (sub-cap 1,000) | 8 listed vaccines (pneumococcal, HPV, influenza, rotavirus, varicella, meningococcal, Tdap, COVID-19) | **All NPRA-registered vaccines** |
| 2 | Parents/grandparents full medical exam and vaccination (sub-cap 1,000 within 8,000) | Vaccination included (from YA2025) | All NPRA-registered vaccines |
| 3 | Childcare (TP1 C8), 3,000 | 2,000 permanent + 1,000 time-bound (to YA2027); child ≤6; TASKA/TADIKA | **3,000 permanent**. Age limit depends on premises under s.46(1)(r) (Act 874 s.6(a)(iv)): TASKA (Act 308) or TADIKA (Act 550), child **≤6**; care centre under the Care Centres Act 1993 (Act 506), including JKM day-care and **after-school transit centres**, child **≤12**. TP1 C8 notes say ≤12 for all premises, which is wider than the Act (question 7) |
| 4 | Life insurance / takaful (C11(b)), 3,000 | Self and spouse | **+ children** (unmarried <18; 18+ in tertiary education; disabled at any age). The same child criteria apply to education/medical insurance |
| 5 | Learning-disability diagnosis/intervention/rehab, child ≤18 (within the 10,000 medical cap) | sub-cap **6,000** | sub-cap **10,000** |
| 6 | Tourist attraction / cultural programme admission fees (new TP1 **C17**), 1,000 | – | Enacted for **YA2026 only** (Act 874 s.3(2), s.46(1)(sa)). Budget 2027 proposes one more year, YA2027 |
| 7 | EV charging / composting machine (C15), 2,500 | EV charging (YA2022–27); composting machine (YA2025–27, once per 3 YAs) | + household **food-waste grinder** and **home CCTV** (YA2026–27, once per 2 YAs) |
| 8 | TP1/TP3 layout | TP1 (1/2025): already names Act 4 and Act 800 at C14 | TP1 (1/2026): B4 removed; C4(d) "dan" becomes "atau"; C4(e) drops the COVID-19 wording (spec §E keeps it, so keep the sub-cap scope); C4(f), C8 and C15 as above; new C17. No C-numbers change. No formula text changed |
| 9 | Spec §E childcare row | – | Still says "extended to 2027" and "aged 6 and below", while its §C.3 makes the 1,000 permanent and widens premises. Follow the Act |

None of these needs a mid-year period: all are keyed by YA or SPA date. Table 4 (C-suite: P > 35,000, R 15%) first appears in the 2025 spec, not 2026. The list of 8 vaccines in row 1 is from the TP1 2025 notes C4(c) and the 2026 spec's description.

The 2025 changes compared with 2024 (from the official 2025 spec §C and §E, Budget 2025, the LHDN YA2025 relief page and the Mercans alert):
- Disabled self 6,000 → **7,000**; disabled spouse 5,000 → **6,000**; disabled child 3 → **4 units**; disabled child studying 7 → **8 units**.
- Education/medical insurance 3,000 → **4,000**.
- Learning disability 4,000 → **6,000**.
- Parents' relief extended to **grandparents**, with vaccination added.
- Sports relief extended to **parents**.
- Medical-exam sub-item now covers self-test equipment and disease-detection tests.
- **New**: first-home loan interest (C16), 7,000 / 5,000.
- **New**: composting machine (within C15).
- Extended: SSPN to YA2027, PRS to YA2030, the childcare 1,000 top-up to YA2027.

### 3.13 Annual tax (BE) for reconciliation

```
aggregate   = annual employment income, taxable part, including bonus (BE item B6; not reduced by EPF)
gifts       = min(cappedGifts, 10% × aggregate) + uncappedGifts + fixed-cap gifts
totalIncome = max(0, aggregate − gifts)
chargeable  = totalIncome − reliefs (self, spouse/alimony, children, EPF ≤4,000, life ins ≤3,000,
              PRS, edu/med insurance, SOCSO+EIS ≤350, medical, lifestyle, …)
taxCharged  = bracket tax(chargeable)                 (§4.1)
rebates     = (chargeable ≤ 35,000 ? 400 + (spouse deduction allowed ? 400 : 0) : 0)
              + departure levy + zakat/fitrah
rebatesUsed = min(taxCharged, rebates)                (s.6A(4): pooled; excess is lost)
taxPayable  = taxCharged − rebatesUsed
balance     = taxPayable − total PCB deducted
              (negative = refund, unless PCB was elected as final tax)
```

**Approved donations (s.44).** The cap is **10% of aggregate income**, shared across four provisions, from YA2020 (Act 823 s.8; PR 7/2025 para 5.2), unchanged for YA2025, YA2026 and the YA2027 proposals. It is annual only: not on TP1 or in the MTD spec, so a user treating PCB as final tax gets no benefit (our inference).

| Provision | Gift | Limit |
|---|---|---|
| s.44(6) | Money to Government, State Government, local authority | None |
| s.44(6) proviso | Money to a DGIR-approved institution or fund | Shared 10% |
| s.44(11B) | Money for an MoF-approved sports activity | Shared 10% |
| s.44(11C) | Money or in-kind for an MoF-approved national-interest project | Shared 10% |
| s.44(11D) | Wakaf or endowment | Shared 10% |
| s.44(6A), s.44(11) | Artefacts, manuscripts, paintings | Value as determined |
| s.44(8), s.44(10) | Library facilities; healthcare facility or medical equipment | RM20,000 each |
| s.44(9) | Facilities for disabled persons | Amount or value |

Check: PR 7/2025 Example 2: aggregate 220,000, gifts 26,000, allowed 22,000. A gift lowers chargeable income, so it can bring someone under RM35,000. Our own arithmetic on YA2026 brackets: aggregate 49,000, reliefs 13,000 gives chargeable income 36,000 and tax 660; a RM1,000 donation gives 35,000, tax 600, less RM400 rebate, so RM200 payable, a saving of RM460. No carry-forward provision was found. Receipts are kept 7 years. Budget changes touch scope only: Budget 2026 (anti-corruption CSO programmes under s.44(11C); teaching-hospital endowments under s.44(11D)); Budget 2027 Lampiran 10 (school funds under s.44(6)).

### 3.14 Classifying pay: overtime, tips and variable items

The rule is the same in the 2025 and 2026 specs.

- **Overtime goes in Y1, whether regular or one-off. It never goes in Yt.** LHDN's calculator form says: "Effective from 1 January 2013, overtime is categorised as current month remuneration". LHDN's 2024 slides p13 list overtime and tips only under normal pay, and P.U.(A) 314/2013 dropped overtime from the additional-remuneration list. No LHDN text addresses a truly one-off overtime payment in terms, so confidence is high for overtime generally and medium-high for one-off overtime.
- **Variable pay follows the payment pattern, not the amount.** Normal remuneration is monthly pay "whether the amount paid is fixed or variable".

| Goes in Y1 | Goes in Yt |
|---|---|
| Salary; wages, including daily/hourly pay totalled for the month; overtime; tips (medium-high confidence, slide p13 only); commission paid monthly, even if the amount varies; commission-only pay; allowances, director's fees and perquisites paid monthly; BIK/VOLA | Bonus/incentive; arrears; ESOS (if opted); tax borne by employer; taxable part of gratuity and compensation; ex-gratia; commission, allowances, director's fees and perquisites NOT paid monthly; any other extra payment |

Monthly service charge in Y1 is our inference; it isn't named anywhere. Tips received directly from customers weren't researched.

- **Y2 always equals the full Y1**, including the variable part. The spec says "Estimated remuneration as Y1 for the subsequent months", and the calculator has no Y2 input. Don't add an override. The spec adds that reclassifying pay needs LHDN approval, though the scope of that sentence is unclear.
- **K1 isn't scaled with Y1.** The SOCSO and EIS wage bases include overtime; EPF wages don't (from each module). Vendors disagree: SQL Payroll treats overtime as normal; Talenox and HReasily list it as additional; BrioHR lets employers choose. So real payslips can differ (question 8).

**Worked comparison** (single, EPF on base pay only; computed with the current model, not run on LHDN's calculator):

| Base, overtime | Y1 route (LHDN) | Yt route, for comparison | Year total |
|---|---|---|---|
| 5,000, OT 500 in January | 152.50, then 108.85–108.90 | 140.00, then 110.00 | 1,350.00 both |
| 5,000, OT 500 in June | 110.00 ×5, 143.60, 109.40 ×6 | 110.00 ×5, 140.00, 110.00 ×6 | 1,350.00 both |
| 5,000, OT 500 in December | 110.00 ×11, 140.00 | same | 1,350.00 both |
| 10,000, OT 500 in January | 1,054.20, then 929.15–929.20 | 1,054.25, then 929.15–929.20 | 11,275.00 both |
| 3,700, OT 500 in January | 62.00, 0 ×7, 11.25 ×4 | 107.00, then 0 | 107.00 both |
| 3,400, OT 600 in January | 16.70, then 0 | 0 | 16.70 vs 0. Annual tax is 2.00, so Y1 over-deducts 14.70, recoverable only by filing |
| 4,000, OT 100 in January | 56.00, then 50.00 | 422.75, then about 16.65 | 606.00 both |

If P stays in one band, the projection cancels out, and the month's extra PCB is about overtime × R. The two routes only differ noticeably near a band edge or the RM35,000 line. Recurring overtime belongs in Y1 for all 12 months: at base 10,000 with OT 500 every month, Y1 stays flat at about 1,054.15–1,054.20, and a Y2 that excluded overtime (not compliant) climbs from 939.60 to 1,317.05, with the same total of 12,650.00.

### 3.15 Termination and retirement payments

Only the **taxable excess** enters Yt, and **Kt = 0** on these items. Compute taxable = gross − the exemption for that head, floored at 0. If 0, skip the additional-remuneration step. This is a firm reading of spec Terms note 9 and Practice Note 1/2021, but LHDN has no worked example of a part-exempt payment in Yt. The figures are the same for YA2025 and YA2026 and carried forward for YA2027 (no change found by keyword search of the annex).

| Payment | Exemption | Source |
|---|---|---|
| Compensation for loss of employment, ill health | Full, if the Director General is satisfied (PR 1/2012 Example 3: certified by a Medical Board) | Sch.6 para 15(1)(a) |
| Compensation, other | **RM10,000 × completed years** with the same employer or group, capped at the payment. 12 years 10 months counts as 12; 10 months gives nil. A further RM10,000 a year applied only to cessations from 1 Jan 2020 to 31 Dec 2021, so it is history only | Sch.6 para 15(1)(b); PR 1/2012 |
| Compensation, exclusions | Controlled company paying a director who isn't a whole-time service director; separation scheme that provides for re-employment | Sch.6 para 15(1), (3) |
| Gratuity, full exemption, no ringgit cap | Ill-health retirement (DG satisfied); retirement at 55+ or a statutory compulsory age with 10 years with the same employer or group; contractual compulsory age of 50 to under 55 with 10 years; public funds on retirement or contract end; death gratuity | Sch.6 paras 25(1)(a)–(c), 25A, 25B, 14 |
| Gratuity, partial | **RM1,000 × completed years**, last company only (no group service), YA2016 onward. Age 60 with 9 years: RM9,000. Early retirement at 53 with 16 years: RM16,000 | Sch.6 para 25D; PR 9/2016 |
| Gratuity while still employed | No exemption, even at 55 | PR 9/2016 para 7.3 |
| Pension | Not employment income (s.4(e)). Exempt at 55, statutory compulsory age or accepted ill health; only the highest pension if more than one. Not in MTD by default | Sch.6 para 30; GPO 1/2024 §4.3.3(a) |

Substance beats the label: premature termination is generally compensation, and a payment for past service at contract end or retirement age is gratuity. A mixed lump sum is split using the employer's normal gratuity practice (PR 9/2016 Example 1). Gratuity credited to EPF is still taxable.

**EPF:** gratuity, retirement benefit, retrenchment, lay-off or termination benefit and pay in lieu of notice aren't EPF wages. Unused leave paid out **is** liable and has no para 15 or 25D exemption, so it is ordinary Yt with Kt.

**Worked effect** (single, Y1 8,000, EPF 880, paid in June, salary projection kept, June MTD without a lump sum 514.15; computed, not LHDN output):

| Payment | Exempt | Yt | June MTD | If the gross were wrongly used |
|---|---|---|---|---|
| RM100,000 compensation, 10 years | 100,000 | 0 | 514.15 | 24,494.20 |
| RM150,000 compensation, 10 years | 100,000 | 50,000 | 11,994.20 | 36,994.20 |
| RM50,000 gratuity, age 40, 10 years | 10,000 | 40,000 | 9,494.20 | 11,994.20 |
| RM50,000 gratuity, age 56, 10 years | 50,000 | 0 | 514.15 | 11,994.20 |

**Limits.** The spec has no cessation wording: Step 1 still projects Y2 × n after the last pay, so MTD can exceed final tax, and the difference comes back on the BE. The payout may also be held for tax clearance (CP22A, up to 90 days), and then the clearance letter sets the final amount, not this formula. The citizen exception to notice is limited to those who receive no compensation or gratuity (LHDN's 2025 employer slides).

### 3.16 Worker categories

| Worker | PCB path | K | Confidence |
|---|---|---|---|
| Private employee; government non-pensionable or contract staff (Skim KWSP, COS, MySTEP, interim); statutory body on EPF or the combined pension and EPF scheme | Normal | Actual EPF from the payslip | High for private; choose from the payslip, never infer from "government" |
| Pensionable officer | Normal | K1 = K2 = Kt = 0. No employee pension or KWAP contribution was found. Voluntary EPF and life insurance go through TP1 as LP1 | High. Single RM5,000: P 51,000, tax 1,610, MTD 134.20; with insurance only P 48,000, tax 1,380; with the full 7,000 P 44,000, tax 1,140 |
| Statutory-body pensionable employee | Normal, K = 0 | s.49(1)(b) literally names Act 227 officers | Medium |
| LTAT-type scheme | Normal | Advanced input | Unverified: s.150 approval not confirmed |
| Domestic worker | Normal: no exemption found ("every employer", s.83(1); GPO 1/2024 §3.1(a)) | 0, unless EPF is elected or the employer is a registered business | Usually RM0 from the formula: no tax up to RM3,111.11/month, and MTD stays under RM10 up to RM3,444/month with no EPF. Whether LHDN expects a household to hold an E number is unverified |
| Foreign employee, including domestic | Resident MTD if the contract is 182 days or more, otherwise 30% | Per the EPF module | Annual residence still follows s.7, so MTD status and final assessment can differ |
| Self-employed, gig | **No MTD.** Tax on net business income, Form B, CP500 instalments under s.107B. No K, TP1 or s.77C election. Mixed income: PCB on the salary only | Voluntary EPF up to the same 7,000 rule | High. Gig platforms' 1.25% deduction (P.U.(A) 143/2026) is social security, not tax. s.107D's 2% on agents, dealers and distributors above RM100,000 is a separate credit |

Public-service items outside Y, Yt, EPF and SOCSO: Sch.6 paras 25A, 25B, 25D, 14, 7, 9, 16, 30, 30A; federal BKK 2026, RM500 for Gred 15 and below (equivalent to Gred 56 and below), RM250 for pensioners (SPANM 1/2026 §3.6). BKK is year-specific and state versions weren't verified. Regular allowances such as housing and COLA default to taxable, because no carve-out was found; that is a default, not a confirmed list. Citizens in public service abroad are deemed resident (s.7(1B)). The annual statement in federal service is Form EC.

LINDUNG KENDIRI (Act 789) gets no s.46(1)(n) relief for YA2025 or YA2026, because the paragraph names only Act 4 and Act 800. Whether government-matched i-Saraan money counts for EPF relief is unverified; assume own money only.

---

## 4. Per-year config

### 4.1 Resident brackets

**YA2025 and YA2026 (confirmed):**
- YA2025 is confirmed by the e-BE YA2025 explanatory notes' tax schedule and the LHDN Tax Treatment slides.
- YA2026 is confirmed by the 2026 MTD spec (Table 1). Budget 2026 did not change the Part I resident brackets.
- **Separate rate, not for salaries:** from YA2026, 2% on an individual LLP partner's chargeable income from profit distributions above RM100,000 a year (Budget 2026 Lampiran 7; Finance Act 2025 [Act 874] s.17, new Part XXIII of Schedule 1, "Notwithstanding Part I"; s.3(1)). This doesn't affect employment-income MTD. It matters only if the app ever models LLP income.

| Chargeable income (RM) | Rate | Tax on lower bound |
|---|---|---|
| 0 – 5,000 | 0% | 0 |
| 5,001 – 20,000 | 1% | 0 |
| 20,001 – 35,000 | 3% | 150 |
| 35,001 – 50,000 | 6% | 600 |
| 50,001 – 70,000 | 11% | 1,500 |
| 70,001 – 100,000 | 19% | 3,700 |
| 100,001 – 400,000 | 25% | 9,400 |
| 400,001 – 600,000 | 26% | 84,400 |
| 600,001 – 2,000,000 | 28% | 136,400 |
| > 2,000,000 | 30% | 528,400 |

**YA2027 (PROPOSED, Budget 2027 Lampiran 1 and MOF Appendix 1, "Mulai tahun taksiran 2027").** Tax on the lower bound is computed by us and rechecked independently in the deep pass.

| Chargeable income (RM) | Rate | Tax on lower bound | Change |
|---|---|---|---|
| 0 – 5,000 | 0% | 0 | |
| 5,001 – 20,000 | 1% | 0 | |
| 20,001 – 35,000 | 3% | 150 | |
| 35,001 – 50,000 | 6% | 600 | |
| 50,001 – 70,000 | 11% | 1,500 | |
| 70,001 – 100,000 | **18%** | 3,700 | was 19% |
| 100,001 – 150,000 | **24%** | 9,100 | new band (was 25%) |
| 150,001 – 400,000 | 25% | 21,100 | |
| 400,001 – 600,000 | 26% | 83,600 | |
| 600,001 – 1,000,000 | 28% | 135,600 | band shortened |
| > 1,000,000 | **30%** | 247,600 | was > 2,000,000 |

Cross-check: tax on RM1.5m is 388,400 under YA2026 and 397,600 under YA2027. This matches published commentary (misslobang / L&Co).

### 4.2 Rebates (all years; Budget 2027 is silent → carried forward)

| Rebate | Amount | Condition | MTD |
|---|---|---|---|
| Self, s.6A(2)(a) | 400 | Chargeable ≤ 35,000; s.46(1)(a) deduction allowed | In B |
| Spouse, s.6A(2)(b)/(c) | 400 | Chargeable ≤ 35,000 and a deduction under s.47(1) or (2), including alimony, or s.45A for a wife | In B (Category 2 only). Alimony case: annual only |
| Zakat/fitrah, s.6A(3) | Actual paid, own payment, Malaysian statutory body, with receipt | Pooled cap below | Net MTD and Z; TP1 D1(a) |
| Departure levy, umrah/religious, s.6A(2A), (2B) | Levy paid for own travel by air: RM8 economy ASEAN, RM20 economy non-ASEAN, RM50 other class ASEAN, RM150 other class non-ASEAN (PR 3/2023 para 5.5.3) | 2 times; not hajj; pooled cap below | Treated like zakat: Net MTD and Z; TP1 D1(b) |
| **Total cap, s.6A(4)** | All of the above together ≤ tax charged before rebates | Excess not refunded and not carried forward | Payable never goes below 0 |

Rebates apply to resident individuals only (s.6A(1)).

### 4.3 Non-resident: 30% flat for YA2025, YA2026 and the YA2027 template (no change announced). Rules in §3.9.

### 4.4 Relief list with caps and TP1 eligibility

Legend: **Auto** = the employer always applies it. **Status** = the employer applies it from declared status (computerised method). **TP1** = it lowers monthly PCB only if declared on TP1 (otherwise only at annual filing). **Annual** = annual return only.

| Relief | YA2025 | YA2026 | YA2027 (proposed) | MTD route |
|---|---|---|---|---|
| Self and dependent relatives | 9,000 | 9,000 | **12,000** | Auto (D) |
| Disabled individual (additional) | 7,000 | 7,000 | 7,000* | Status (Du) |
| Spouse (no income / joint) or alimony to former wife | 4,000 combined | 4,000 | 4,000* | Category 2 (S). Alimony: TP1 C10 |
| Disabled spouse (additional) | 6,000 | 6,000 | 6,000* | Status (Su), Category 2 only |
| Child <18 / 18+ pre-tertiary | 2,000 each | 2,000 | 2,000* | Status (1 unit) |
| Child 18+ diploma+ (MY) / degree+ (abroad) / articles or indentures | 8,000 | 8,000 | 8,000* | Status (4 units) |
| Disabled child | 8,000 | 8,000 | 8,000* | Status (4 units) |
| Disabled child 18+ studying diploma+/degree+ | 16,000 | 16,000 | 16,000* | Status (8 units) |
| EPF / approved scheme (mandatory and voluntary), s.49(1)(b) | 4,000 | 4,000 | 4,000* | Auto (K). Voluntary: TP1 C11(a) |
| Life insurance / family takaful / additional voluntary EPF, s.49(1)(a) | 3,000 (self, spouse) | 3,000 (+ children) | 3,000* | TP1 C11(b) |
| PRS and deferred annuity (to YA2030) | 3,000 | 3,000 | 3,000* | TP1 C12 |
| Education and medical insurance (self, spouse, child) | 4,000 | 4,000 | 4,000* | TP1 C13 |
| SOCSO (Act 4) + EIS (Act 800), s.46(1)(n) | 350 | 350 | 350, scope + LINDUNG KENDIRI mandatory (3 sectors); **+150** on top for voluntary LINDUNG 24 / 17 non-mandatory LINDUNG KENDIRI sectors, so maximum 500 | TP1 C14 |
| Parents and grandparents: medical, dental, special needs, carer, s.46(1)(c) | 8,000 (full exam + vaccination ≤1,000) | 8,000 (all NPRA vaccines) | 8,000: all care expenses (home, day-care, residential), no doctor certification | TP1 C1 |
| Basic supporting equipment for a disabled self/spouse/child/parent | 6,000 | 6,000 | 6,000* | TP1 C2 |
| Education fees (self) | 7,000 (up-skilling ≤2,000, to YA2026) | 7,000 | 7,000: any field, cert–PhD; TVET ≤3,000 (self/spouse); non-work courses or child STEM/arts/language/religion tuition ≤2,000 | TP1 C3 |
| Medical (self/spouse/child), combined cap | 10,000 | 10,000 | 10,000 ("health & well-being") | TP1 C4 |
| – serious disease, fertility | within 10,000 | within | within | |
| – vaccination | ≤1,000 | ≤1,000 (all NPRA) | ≤1,000* | |
| – dental exam/treatment | ≤1,000 | ≤1,000 | ≤1,000* | |
| – full exam, mental health, disease tests, self-test kits and equipment | ≤1,000 | ≤1,000 | ≤1,000* | |
| – learning disability, child ≤18 | ≤6,000 | **≤10,000** | ≤10,000* | |
| – post-natal care | – | – | **≤3,000 (new)** | |
| – breastfeeding equipment | (separate relief) | (separate) | **≤1,000, merged here** | |
| Lifestyle: books, PC/phone/tablet, internet, self-enrichment courses, s.46(1)(p) | 2,500 | 2,500 | 2,500: + AI subscriptions, pet adoption/vet; courses move to the education relief | TP1 C5 |
| Sports (self, spouse, child, parents), s.46(1)(u) | 1,000 | 1,000 | 1,000 (sports shoes ≤300) | TP1 C6 |
| Breastfeeding equipment (child ≤2; not in the YA right after a claim), s.46(1)(q) | 1,000 | 1,000 | proposed to end as a separate relief and merge into medical: count it once, under medical | TP1 C7 (fate unknown for 2027) |
| Childcare / kindergarten fees, s.46(1)(r) | 3,000 (TASKA/TADIKA, child ≤6) | 3,000 (TASKA/TADIKA ≤6; Act 506 care centre incl. transit centres ≤12) | 3,000, same rule (enacted YA2026 onward) | TP1 C8 |
| SSPN net deposit (to YA2027) | 8,000 | 8,000 | 8,000* | TP1 C9 |
| EV charging / composting (+ grinder, CCTV in 2026) | 2,500 | 2,500 | 2,500* (EV to YA2027) | TP1 C15 |
| First-home loan interest (SPA 2025–2027; 3 YAs), s.46B (TP1 2026 notes say "46C"; the Act has no s.46C) | 7,000 (≤RM500k) / 5,000 (RM500k–750k) | same | same* | TP1 C16 |
| Tourist attraction / cultural admission, s.46(1)(sa) | – | 1,000 (enacted YA2026 only) | 1,000 (proposed for YA2027 only; needs new law) | TP1 C17 |
| Approved donations / gifts (§3.13): a deduction, not a relief | Shared cap 10% of aggregate income | same | same* | **Annual only** |

\* = carried forward and unconfirmed for YA2027 because Budget 2027 doesn't mention it.

Legal references from the Act as at 1 Jan 2026 (LHDN's online updated text, "not an authentic text"): self s.46(1)(a); disabled self s.46(1)(e); spouse s.45A(1)–(2) (husband) and s.47(1)(a), (2)–(6) (wife, alimony; the s.47(3) cap of 4,000 is shared); disabled spouse s.45A(1) and s.47(1)(b), outside that cap; children s.48. Exact sub-references are in the JSON files. PR 7/2025 and the e-BE notes give the same provisions.

For divorced parents sharing one child's childcare fees, sources conflict: the PR 7/2025 note lets both claim, while the e-BE and TP1 notes say it can't be the same child. The Act is silent. This is unresolved, and low impact.

Practically every relief except donations can be put through TP1. The app should still treat TP1 reliefs as "declared to employer? yes/no", because that decides whether they change monthly take-home pay or only the year-end refund.

### 4.5 Year status and effective dates

Tax config needs **no mid-year periods**. All relief and rate rules are keyed by YA or SPA date. The one dated input is the SOCSO relief's contribution source for 2026:

| Year | Tax law | MTD spec | Contribution sources for the SOCSO + EIS relief |
|---|---|---|---|
| YA2025 | Confirmed | Official spec, updated 1 Jan 2025 (retrieved from the Wayback Machine; live URL 404) | 2025-01-01 to 12-31: `socso-act4-2024-10` + `eis-act800-sched2-2024-10` |
| YA2026 | Confirmed; Finance Act 2025 (Act 874), Royal Assent 27 Dec 2025, gazetted 31 Dec 2025 | Official spec, updated 1 Jan 2026 | 2026-01-01 to 05-31: as above. From 2026-06-01: `socso-act4-a1788` phase 1 + EIS, plus SKBBK if participating (status open, §8) |
| YA2027 | **Proposed.** No Finance Bill as of 2026-11-05; Supply Bill 2027 passing does not enact tax rates | **Not published.** B values are ours | As 2026 from June, full year |

Track tax law and the MTD spec separately in config (`taxStatus`: proposed → bill-tabled → enacted; `specStatus`: not-published → spec-published), because the Act drives annual tax and LHDN's spec drives monthly PCB. Replace the derived B values when the spec is published. Map TP1 lines by relief id, not C number, until TP1 2027 is out.

The Finance Bill isn't late on precedent: Finance Bill 2025 had first reading on 18 Nov 2025 and passed the Dewan Negara on 15 Dec 2025.

---

## 5. Proposed TypeScript config schema

```ts
type Rm = number; // ringgit; tax maths uses decimal-safe helpers (truncate to sen)

interface TaxBracket { fromExclusive: Rm; to: Rm | null; rate: number; taxAtLowerBound: Rm }

type ConfigStatus = 'confirmed' | 'reconstructed' | 'unconfirmed-template';

interface PcbTable1Row {
  floorPFromExclusive: Rm; floorPTo: Rm | null;  // compare with floor(P), never raw P
  M: Rm; R: number;                      // (P − M) × R uses the fractional P
  B: Record<1 | 2 | 3, Rm>;              // B already net of 400/800 rebate when floor(P) ≤ 35,000
}

type ReliefMtdTreatment =
  | 'automatic'            // D
  | 'category2'            // S
  | 'mandatoryAdditional'  // Du, Su (declared status)
  | 'childUnits'           // Q × C
  | 'epfK'                 // K, K1, K2, Kt
  | 'tp1'                  // LP1 / ∑LP — only if user says "declared to employer"
  | 'annualOnly';

interface ReliefDef {
  id: string;                       // stable across years, e.g. 'lifestyle'
  label: string;
  capRm: Rm | null;                 // annual cap; null = see subCaps / unlimited
  subCaps?: { id: string; label: string; capRm: Rm | null }[];   // inside capRm
  additionalCaps?: { id: string; capRm: Rm; appliesTo: string[] }[]; // on top of capRm (YA2027 SOCSO)
  eligibility?: { premises: string; childAgeMax: number }[];     // childcare from YA2026
  excludeFromClaim?: boolean;       // e.g. YA2027 breastfeeding, merged into medical
  treatment: ReliefMtdTreatment;
  tp1Item?: string;                 // 'C5'
  legalRef?: string;                // 'ITA s.46(1)(p)'
  validFromYa?: number; validToYa?: number;
  status: ConfigStatus;
  note?: string;
}

interface ChildUnitRule { id: string; label: string; units: number } // Q per unit in PcbSpec

interface RebateConfig {
  chargeableIncomeThreshold: Rm;   // 35,000
  self: Rm;                        // 400
  spouse: Rm;                      // 400 (requires spouse relief)
  totalRebatesCappedAtTaxCharged: true; // s.6A(4): self + spouse + levy + zakat, pooled
  departureLevyMaxTimes: 2;
  residentOnly: true;              // s.6A(1)
}

interface GiftDeductions {
  sharedCapRate: 0.10;             // of aggregate income; s.44(6) proviso, (11B), (11C), (11D)
  fixedCapsRm: Record<string, Rm>; // s.44(8), s.44(10)
  mtd: 'annualOnly';
}

interface TerminationExemptions {
  compensationPerCompletedYear: Rm; // 10,000, Sch.6 para 15(1)(b)
  gratuityPartialPerCompletedYear: Rm; // 1,000, Sch.6 para 25D
}

interface PcbSpec {
  specYear: number;
  status: ConfigStatus;
  epfAnnualCap: Rm;                 // 4,000
  deductions: { D: Rm; S: Rm; Du: Rm; Su: Rm; Q: Rm };
  childUnits: ChildUnitRule[];
  table1: PcbTable1Row[];
  zeroTaxAtOrBelowP: Rm;            // 5,000
  rounding: {
    intermediate: 'truncate-2dp';
    final: 'round-up-5sen-once-on-final-amount';
    minMonthlyMtdBeforeZakat: Rm;   // 10, tested on the truncated figure before rounding
    minAdditionalMtd: Rm;           // 10, tested the same way
    netAfterZakatBelowMinStillDeducted: true;
    netNotFlooredInBonusMonth: true;
    step1EUsesUnrounded: true;
  };
  nonResidentRate: number;          // 0.30, then the same rounding and RM10 rules; no zakat
  specialRegimes?: { id: 'REP' | 'KW' | 'CSUITE'; rate: number; rebateT: Record<1|2|3, Rm> | null }[];
  sources: { url: string; accessed: string }[];
}

interface YearConfig {
  ya: number;
  status: ConfigStatus;
  taxStatus: 'proposed' | 'bill-tabled' | 'enacted';
  specStatus: 'not-published' | 'spec-published';
  bSource: 'lhdn' | 'derived';
  residentBrackets: TaxBracket[];
  rebates: RebateConfig;
  reliefs: ReliefDef[];
  giftDeductions: GiftDeductions;
  terminationExemptions: TerminationExemptions;
  pcb: PcbSpec;
  notes?: string[];                 // e.g. "YA2027 = Budget 2027 proposal, Finance Bill pending"
}

// Engine inputs (per month)
interface PcbMonthInput {
  month: 1|2|3|4|5|6|7|8|9|10|11|12;
  category: 1 | 2 | 3;
  resident: boolean;
  Y1: Rm; epfOnY1: Rm;              // epf from EPF module: Third Schedule, never Y1 × rate
                                    // Y1 includes overtime; there is no Y2 input (Y2 = Y1)
  Yt?: Rm; epfOnYt?: Rm;            // taxable part only; epfOnYt = table(Y1+Yt) − table(Y1)
  LP1?: Rm;                         // TP1 claims this month (already capped by relief caps)
  zakatThisMonth?: Rm;              // ignored on the non-resident path
  levyThisMonth?: Rm;               // TP1 D1(b); same path as zakat
  childUnits: number;               // may be fractional: s.48(4)
  disabledSelf: boolean; disabledSpouse: boolean; // disabledSpouse applies in category 2 only
  ytd: { netRemuneration: Rm; epf: Rm; mtdPaid: Rm; zakatPaid: Rm; lp: Rm }; // ∑(Y−K), K, X, Z (incl. levy), ∑LP
}
interface PcbMonthResult {
  P: Rm; annualTax: Rm; mtdCurrent: Rm;  // unrounded; 0 if raw < 10
  netMtd: Rm;                            // may be negative in a bonus month
  mtdAdditional: Rm; mtdPayable: Rm;     // payable is the only rounded figure
  trace: Record<string, Rm>;        // K1, K2, M, R, B … for an explain-my-PCB UI
}
```

Implementation notes:
- Use integer sen or a decimal library. Every step truncates to sen; use `Math.trunc(x*100)/100` with care for float error, or work in sen.
- The relief **caps** are applied **before** a value becomes LP1. ∑LP for one relief must never exceed its annual cap across months.
- A year simulation should return both the first-month figure and the annual total, since January alone misstates some salaries (§3.11).

---

## 6. Worked examples

### 6.1 Official results reproduced exactly (verification)

The current model is `.research-cache/scripts/pcb_ref_official.py`, which implements §3 as corrected in the deep pass. Regression run on 2026-11-05:

| Test | Current model | Old `pcb_ref.py` |
|---|---|---|
| **17 official monthly results** (Exhibit 5 ×4, slides p18 ×1, slides p20 ×12) | **17 of 17 to the sen** | 17 of 17 |
| LHDN calculator, 60 saved resident results | 60 of 60 | 44 of 60 |
| LHDN calculator, 50 held-out results (predictions fixed before submitting) | 50 of 50 | 39 of 50 |

So the corrected rules didn't break any published result. The old script matched the published examples but not the calculator, so it shouldn't be treated as validated. The calculator is only available for year 2024, reached over plain HTTP on 2026-11-05, and later attempts returned HTTP 500. Raw output is in `.research-cache/pcb/verify/calc/`.

**(a) Spec 2026, Exhibit 5** (worked example labelled 2025).
Inputs:
- Category 3, 3 children.
- Y1 = 5,500 and EPF 605 every month.
- TP1: March 300 (books 100 + parents' medical 200); April 300 (sports 100 + SSPN 200).
- April bonus 8,250, with EPF 908. This is LHDN's published input, so it stays in the regression. The Third Schedule would give Kt 913 (RM1,518 on 13,750 − 605). P becomes 54,650.04 and April payable stays 833.70, because the RM4,000 cap has already been reached.
- The 2025 spec's Exhibit 5 has identical numbers, labelled Jan–Apr 2024.

| Month | Working | LHDN | Ours |
|---|---|---|---|
| Jan | K2 = (4,000−605)/11 = 308.63. P = 4,895 + (5,500−308.63)×11 − (9,000+6,000) = 47,000.07. ((47,000.07−35,000)×6% + 600 − 0)/12 | 110.00 | 110.00 |
| Feb | K2 = (4,000−1,210)/10 = 279.00. P = 47,000.00. (1,320 − 110)/11 | 110.00 | 110.00 |
| Mar | K2 = 242.77; LP1 = 300. P = 46,700.07. (1,302.00 − 220)/10 | 108.20 | 108.20 |
| Apr step 1 | K2 = 197.50; ∑LP = 300, LP1 = 300. P = 46,400. (1,284 − 328.20)/9 = 106.20. Total for year = 328.20 + 106.20×9 = 1,284.00 | 106.20 | 106.20 |
| Apr steps 2–4 | Kt = 908 → K2 = 84.00. P = 14,685 + 4,895 + 43,328 + 7,342 − 15,600 = 54,650. Tax = 4,650×11% + 1,500 = 2,011.50. 2,011.50 − 1,284.00 | 727.50 | 727.50 |
| Apr payable | 106.20 + 727.50 | **833.70** | **833.70** |

**(b) LHDN PCB briefing slides 2024, p18–19 (Kalkulator PCB output):** single, RM4,000/month, EPF 0. P = 4,000 + 4,000×11 − 9,000 = 39,000. Tax = 600 + 4,000×6% = 840, so 70.00/month. **LHDN 70.00; ours 70.00** for all 12 months.

**(c) LHDN slides p20, "PCB sebenar" for a real 2023 year.** The 2023 tax table is identical to YA2025/2026.
Inputs: single, EPF 0; 3,500/month January–October, 4,000 November–December; bonus 10,000 in October.

| | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| LHDN | 11.70 | 11.70 | 11.70 | 11.65 | 11.65 | 11.65 | 11.65 | 11.70 | 11.65 | 11.65 + 940.00 | 41.65 | 41.65 | 1,140.00 |
| Ours | 11.70 | 11.70 | 11.70 | 11.65 | 11.65 | 11.65 | 11.65 | 11.70 | 11.65 | 11.65 + 940.00 | 41.65 | 41.65 | 1,140.00 |

This one example confirms the 5-sen round-up, the self-correction through X, the additional-remuneration formula (Oct: P = 43,000 → tax 1,080 − 140.00 = 940) and the re-projection after a pay rise. Under the unrounded rule, MTD(B) in October is 140.00 (X 128.35 + 11.65) and the sum 11.65 + 940.00 needs no further rounding.

**(d) GPO 1/2024 s7.2, Contoh 4 (computerised method).** The example still uses the YA2022 8% band: Category 3, 2 children, 4,600 / EPF 506, bonus 9,200 / EPF 1,012. It isn't part of the 17.

| | LHDN | Current model |
|---|---|---|
| Normal (Step C) | 71.33 | 71.33 |
| Step 1[E] | 71.33 × 12 = 855.96 | 855.96 |
| Tax with bonus | 1,592.00 | 1,592.00 |
| Additional | 736.04 | 736.04 |
| Total | 807.37 | 807.37, then 807.40 after the one round-up |

The first version of this report misread this example as inconsistent. It is published evidence for the unrounded Step 1[E] rule. The rounded 856.20 appears only in Contoh 3, the schedule method. The only quirk left is that the GPO rounds K2 half-up (317.64) where the spec and the calculator truncate (317.63); this doesn't change the figures above. Contoh 4 stops at 807.37, so 807.40 is model-computed.

**(e) LHDN calculator results that separate the rules** (year 2024 page; all reproduced by the current model):

| Input | LHDN | Old `pcb_ref.py` | Rule shown |
|---|---|---|---|
| Single 10,000, EPF 1,100, bonus 10,000, EPF 1,100 | 3,429.25 | 3,428.85 | Unrounded Step 1[E] |
| Single 7,777, EPF 0, bonus 3,333 | 1,168.40 | – | One round-up on the sum (separately: 1,168.45) |
| Single 3,700, EPF 407, bonus 10,000 | 984.00 | 891.60 | Raw 7.66 → 0, and that 0 feeds Step 1[E] |
| Zakat 150 on MTD 110, bonus 10,000 | 910.00 | 950.00 | Net isn't floored in a bonus month |
| Raw 8.00, zakat 5, additional 126.08 | 121.10 | – | −5 + 126.08 = 121.08, rounded once |
| MTD 110.00, zakat 50.33 | 59.70 | – | Zakat before the round-up |
| Single 4,000, EPF 440 | 16.70 | 50.00 | Row chosen on floor(P) |
| P = 35,000.99 / P = 35,001.00 | tax 200.02 / 600.06 | – | The cliff starts at 35,001.00 |
| Salary 3,777 (raw 9.97) / 3,778 (raw 10.00) | 0.00 / 10.00 | 10.00 / 10.00 | RM10 tested before rounding |
| Salary 3,444, no EPF (raw 9.98) / 3,445 (raw 10.01) | 0.00 / 10.05 | 10.00 / 10.05 | Same |
| Single 180,000, EPF 4,000 (P = 2,147,000) | yearly tax 572,500.00, payable 47,708.35 | – | Upper rows of Table 1 |

Don't copy the calculator's stale labels ("S = RM3,000", "Kt not exceeding RM6,000"); it applies 4,000 for both.

### 6.2 Requested cases (current model, with Third Schedule EPF)

Assumptions for every case:
- Month = January unless stated; YA2025 = YA2026 unless stated. Resident. No TP1 claims unless stated.
- **Employee EPF comes from `data/epf-third-schedule-2025-10-partA.json`** (citizens, PRs and pre-1998 elected non-citizens under 60), not from an assumed 11%. The share is the band's top wage × 11%, rounded up to the next ringgit. This rule matches all 400 rows from RM10.01 to RM20,000; RM10 and below is nil. Above RM20,000 there are no bands: 11% of the actual wage, rounded up.
- **Provenance.** Except where stated, Cases 1–10 and the January values of Cases 11 and 12 were also run on LHDN's calculator (2024 page) with the same inputs, and match. That confirms YA2025/26 by proxy. Case 11 confirms the arithmetic only, because the 2024 page can't test YA2026 eligibility.

| Wage | Part A | Flat 11%, rounded up | | Wage | Part A | Flat 11%, rounded up |
|---|---|---|---|---|---|---|
| 3,000 | 330 | 330 | | 5,000 | 550 | 550 |
| 3,700 | 407 | 407 | | 5,000.01 | 561 | 551 |
| 3,722 | 412 | 410 | | 8,000 | 880 | 880 |
| 3,778 | 416 | 416 | | 10,000 | 1,100 | 1,100 |
| 4,000 | 440 | 440 | | 15,000 | 1,650 | 1,650 |
| 4,001 | 443 | 441 | | 20,000 | 2,200 | 2,200 |

**The table changes no PCB figure at these worked wages,** because they sit at band tops. Above the RM4,000 cap, K totals 4,000 whichever way EPF is worked out. In a sweep of every whole-ringgit wage from RM1,000 to RM25,000 across 4 profiles (96,004 January results), table EPF and exact 11% gave **no PCB differences**. Part C does matter (Case 7), because 5.5% can stay under the cap. Mid-year joiners under the cap weren't swept.

**Case 1: single, RM3,000** (Category 1). K1 = 330.
- K2 = min((4,000−330)/11 = 333.63, 330) = 330.
- P = 2,670 + 2,670×11 − 9,000 = **23,040.00**.
- Tax = (3,040×3%) − 250 = −158.80 → raw −13.23 → **MTD 0.00**.
- Annual: 23,040 → 150 + 91.20 = 241.20 − 400 rebate → 0.

**Case 2: single, RM5,000.** K1 = 550.
- K2 = (4,000−550)/11 = 313.63.
- P = 4,450 + 4,686.37×11 − 9,000 = **47,000.07**.
- Tax = 12,000.07×6% = 720.00 + 600 = 1,320.00.
- 1,320.00/12 = **110.00/month**, all 12 months; year total 1,320.00 = annual tax on 47,000.

**Case 3: single, RM10,000.** K1 = 1,100.
- K2 = (4,000−1,100)/11 = 263.63.
- P = 8,900 + 9,736.37×11 − 9,000 = **107,000.07**.
- Tax = 7,000.07×25% = 1,750.01 + 9,400 = 11,150.01.
- /12 = 929.16 → round up → **929.20**.
- Full year: 929.20 ×3, 929.15 ×4, 929.20, 929.15 ×4 = **11,150.00** (exact annual tax; confirmed on the calculator).
- The old code shows 929.17.

**Case 4: married, spouse not working, 2 children under 18, RM8,000** (Category 2). K1 = 880.
- K2 = 283.63.
- P = 7,120 + 7,716.37×11 − (9,000 + 4,000 + 2×2,000) = **75,000.07**.
- Tax = 5,000.07×19% = 950.01 + 3,700 = 4,650.01.
- /12 = **387.50**; year total 4,650.00.

**Case 5: married, spouse working, 2 children claimed by this parent, RM8,000** (Category 3). K1 = 880.
- P = 7,120 + 84,880.07 − (9,000 + 4,000) = **79,000.07**.
- Tax = 9,000.07×19% + 3,700 = 5,410.01.
- /12 = 450.83 → **450.85**; full year 450.85 ×8, 450.80 ×4 = 5,410.00.
- Without children (Category 3, C = 0): P = 83,000.07 → **514.20**, the same as a single person.

**Case 6: zakat** (single, RM5,000, K1 = 550, zakat by salary deduction).
- RM50/month: MTD 110.00 − 50 = **net 60.00** every month. Year: PCB 720 + zakat 600 = 1,320, equal to the tax. Take-home pay is unchanged compared with no zakat.
- RM150/month:
  - January: MTD 110.00 − 150 = −40 → payable **0**. Z = 150, the full amount.
  - February: (1,320 − 150 − 0)/11 = 106.36; 106.36 − 150 → 0.
  - PCB is 0 all year. Zakat 1,800 is RM480 more than the tax of 1,320, and that excess is a real cost (§3.7). On the YA2027 template, tax is 1,140 and the excess is RM660.
- RM150/month with a RM10,000 January bonus (Kt 1,100): net −40 + additional 950.00 = **910.00**, not 950 (confirmed on the calculator).

**Case 7: aged 60+ or other reduced EPF** (single, RM5,000).

| Person | Employee EPF | P | Tax | PCB/month | Source of EPF |
|---|---|---|---|---|---|
| Citizen aged 60+ | 0 | 51,000 | 1,610 | **134.20** (134.20 ×3, 134.15 ×4, 134.20, 134.15 ×4 = 1,610.00) | `partE.json` |
| PR or pre-1998 elected non-citizen aged 60+ | 275 | 47,700 | 1,362 | **113.50** | `partC.json` |
| Resident foreign employee, from Oct 2025 wages | 100 | 49,800 | 1,488 | **124.00** | Part F: medium confidence, from the to-do result; no Part F data file exists yet |
| Foreign worker with no EPF, Jan–Sep 2025 | 0 | 51,000 | 1,610 | 134.20 | No EPF |

"60+ means 0%" holds only for citizens. Which month the age-60 and age-75 switches apply is unverified. They could claim voluntary EPF and life insurance via TP1: up to 7,000 combined, which needs at least 4,000 of voluntary EPF (§3.3).

**Case 8: bonus month** (single, RM5,000, bonus RM10,000, paid in January).
- Kt = table(15,000) − table(5,000) = 1,650 − 550 = 1,100.
- Step 1: MTD_current 110.00; total MTD for the year = 0 + 110.00×12 = 1,320.00.
- Step 2: K2 = (4,000−550−1,100)/11 = 213.63. P = 4,450 + 4,786.37×11 + 8,900 − 9,000 = **57,000.07**.
- Step 3: tax = 7,000.07×11% + 1,500 = 2,270.00.
- Step 4: 2,270.00 − 1,320.00 = **950.00**.
- Step 5: **1,060.00** payable in January, then 110.00/month. Year total 2,270.00.
- The same bonus paid in December gives 11 × 110 + 1,060 = 2,270.
- Note: the bonus EPF doesn't lower tax here, because the RM4,000 cap is already reached.

**Case 9: non-resident, RM5,000.** 30% × 5,000 = **1,500.00**. No reliefs or rebates. If they pay zakat, **PCB stays 1,500.00** and take-home pay falls by the full zakat (§3.9).

**Case 10: TP1 lifestyle claim** (single, RM5,000, RM2,500 laptop declared in January).
- LP1 = 2,500 → P = 44,500.07.
- Tax = 9,500.07×6% + 600 = 1,170.00 → **97.50/month** (instead of 110.00).

**Case 11: YA2025 vs YA2026 difference** (Category 3, 2 children, RM8,000; TP1 RM3,000 for a 9-year-old at a JKM-registered after-school transit centre under Act 506).
- **YA2025: not claimable** (child > 6, premises not eligible). PCB 450.85.
- **YA2026: claimable**, LP1 = 3,000 in January → P = 76,000.07 → tax 4,840.01 → **403.35** in the claim month. Later claim months differ: June 369.40, November 165.80, because the saving is spread over the remaining months.
- The same child at a TASKA or TADIKA is **not** claimable under the Act (limit 6), although the TP1 notes read more widely (question 7).

**Case 12: the RM35,000 edge** (single, RM4,000, EPF 440). **Corrected: the first version showed 50.00/month.**
- K2 = 323.63. P = **35,000.07**, so floor(P) = 35,000 and the row is M 20,000, R 3%, B −250.
- Tax = 15,000.07×3% − 250 = 200.00 → raw 16.66 → **16.70**.
- Full year: 16.70 ×3, 16.65 ×4, 16.70, 16.65 ×4 = **200.00**. The calculator confirmed January to March at 16.70 and December at 16.65; the other months are model values.
- True chargeable income is exactly 35,000 (48,000 − 4,000 − 9,000), so the rebate applies and this person never crosses the cliff.
- **The cliff is one ringgit a month away.** Single, RM4,001, EPF 443: P = 35,012.04, row M 35,000, tax 600.72 → **50.10**; year total 600.75.

**Thresholds** (January, Third Schedule EPF; whole-ringgit salaries). PCB can start late in the year below the January figure, so both are shown. The January figures for single on Part A, single with no EPF and Category 2 on Part A were run on the calculator, using EPF of 11% rounded up (for example 477 at RM4,334, where the table gives 478). The PCB is the same on either. The rest are model values.

| Profile | First PCB in January | First PCB in any month | YA2027 template: January / any month |
|---|---|---|---|
| Single, Part A | **RM3,778** (10.00) | RM3,473 (December, 10.30) | 4,028 / 3,723 |
| Category 2, no children, Part A | RM4,334 (50.05: rebate cliff) | RM4,334 | 4,584 / 4,584 |
| Category 2, 2 children, Part A | RM4,667 (50.05) | RM4,667 | 4,917 / 4,917 |
| Category 3, 2 children, Part A | RM4,112 (10.05) | RM3,806 (December, 10.20) | 4,362 / 4,056 |
| Single, Part E (citizen 60+, no EPF) | **RM3,445** (10.05) | RM3,139 (December, 10.05) | 3,695 / 3,389 |
| Category 2, no children, Part E | RM4,001 (50.10) | RM4,001 | 4,251 / 4,251 |
| Category 2, 2 children, Part E | RM4,334 (50.05) | RM4,334 | 4,584 / 4,584 |
| Single, Part C (PR 60+) | RM3,647 (10.05) | RM3,323 (December, 10.05) | 3,911 / 3,587 |
| Category 2, no children, Part C | RM4,235 (50.10) | RM4,235 | 4,499 / 4,499 |
| Category 2, 2 children, Part C | RM4,587 (50.05) | RM4,587 | 4,852 / 4,852 |

### 6.3 YA2027 template results (illustrative only: proposed rates, D = 12,000, our derived B)

| Case | YA2025/26 | YA2027 (proposed) |
|---|---|---|
| Single 3,000 | 0.00 | 0.00 |
| Single 5,000 | 110.00 | 95.00 |
| Single 10,000 | 929.20 | 838.35 |
| Single 20,000 | 3,429.20 | 3,300.00 |
| Category 2, 2 children, 8,000 | 387.50 | 338.35 |
| Category 3, 2 children, 8,000 | 450.85 | 398.35 |
| Single 5,000, 0% EPF | 134.20 | 115.00 |
| Single 5,000 + bonus 10,000 (January) | 1,060.00 | 895.00 |
| Single 4,000 | 16.70 | 0.00 in January, then 10.00 February to December (total 110.00) |

The YA2027 column was rerun with the corrected rules and Third Schedule EPF; only the Single 4,000 row needed more explanation. All computed values are in `data/pcb-verification-cases.json`.

---

## 7. User-selectable options and inputs

**Basic (beginner):**

| Input | Default | Feeds |
|---|---|---|
| Year (YA) | Current year | Selects YearConfig. Show a "proposed, not law" badge for YA2027 |
| Monthly gross salary | – | Y1 (taxable part) |
| Age and citizenship | – | EPF table from the EPF module (K1). 60+ → 0% employee share for citizens only; PRs and foreign employees differ (Case 7) |
| Worker type | Private employee | Pensionable government staff K = 0; self-employed → no PCB (§3.16) |
| Tax residence | Resident | Non-resident → 30% path |

**Family (progressive disclosure):**

| Input | Default | Feeds |
|---|---|---|
| Marital status | Single | Single → Category 1 |
| Spouse works? | – | Category 2 or 3 |
| Divorced / widowed / single parent | No | Category 3 |
| Children, by type | 0 | Units: <18; 18+ pre-tertiary; 18+ diploma/degree; disabled; disabled studying. Plus "Are you claiming this child (vs your spouse)?" |
| I am disabled (JKM-registered) | No | Du |
| My spouse is disabled | No | Su |

**Zakat:** the monthly zakat amount (from the zakat module), and whether it is paid through payroll (offsets PCB monthly) or directly (TP1 D1(a), or year-end only). Hide the offset on the non-resident path.

**Reliefs (advanced):**
- For each relief in §4.4: an annual amount, plus a toggle "declared to employer on TP1?". If yes, it goes into LP1, either spread evenly or in a chosen month. If no, it affects only the annual estimate and refund.
- Group by plain-language labels: "Insurance", "Medical", "Gadgets & books", "Sports", "Childcare", "Education", "Home loan", "Parents".
- Preset: "SOCSO + EIS relief (up to RM350)", using the amount from the SOCSO/EIS modules (§8; question 1).
- Donations are a separate annual-only input, since they aren't on TP1 (§3.13; question 13).

**Advanced pay:**
- Bonus amount and month (additional-remuneration path).
- Overtime, added to Y1. EPF isn't scaled with it. One-off overtime needs a chosen month and the 12-month simulation (§3.14).
- Taxable allowances with a "paid every month?" flag: yes goes to Y1, no goes to Yt. BIK/VOLA go to Y1.
- Exempt allowances (excluded).
- Termination payment: type, completed years, age, same-employer years (§3.15; question 9).
- Voluntary EPF.
- Special 15% regime: REP, knowledge worker or C-suite.
- Mid-year start (month index plus TP3 year-to-date figures).

**Outputs:**
- Monthly PCB: Net MTD + additional MTD.
- An "explain" trace: P, M, R, B, K2.
- Annual tax estimate (§3.13).
- Expected refund or balance at filing. Show it near the RM10 and RM35,000 lines, where PCB and annual tax can differ.
- A "PCB as final tax?" hint.

---

## 8. Interaction with the other modules

- **EPF** (`data/epf-third-schedule-2025-10-part*.json`): provides the employee contribution for Y1 and Yt. This module applies the 4,000 cap through K1, K2 and Kt. The citizen 60+ employee rate is 0% (Part E); PRs aged 60+ pay about 5.5% (Part C). See Case 7.
- **Zakat** (data in `data/zakat-wp.json`): Net MTD = MTD − zakat (this month). Z accumulates the full amount. The annual rebate shares the s.6A(4) cap with the other rebates. Non-residents have no offset.
- **Take-home pay** = gross − EPF − SOCSO − EIS − SKBBK (if participating) − MTD payable − zakat (if through payroll).

### SOCSO + EIS and the RM350 relief

Contributions are **not** deducted automatically in MTD. They are a TP1 item (C14; item j in the 2025 spec's optional list and item k in 2026), with one combined RM350 cap under s.46(1)(n). The Act covers "a contribution made or suffered in that basis year by that individual to the Social Security Organization pursuant to" Act 4 or Act 800.

**The first version's RM34.65/month estimate is checked against the data files, and it is right only without SKBBK.** RM5,000 is SOCSO band 54 (RM4,900–5,000, First Category) and EIS item 54.

| Period | SOCSO | EIS | SKBBK | Employee total/month |
|---|---|---|---|---|
| Jan 2025 – May 2026 | 24.75 | 9.90 | none | **34.65** |
| From June 2026, in SKBBK | 24.75 | 9.90 | 37.15 | **71.80** |
| From June 2026, foreign worker (no EIS; SKBBK mandatory) | 24.75 | – | 37.15 | 61.90 |
| From June 2026, citizen 60+ (Second Category; EIS stopped at 60) | 0 | 0 | 37.15, if they stay in | 37.15 |

Files: `socso-act4-2025.json`, `socso-act4-2026.json` phase 1, `socso-skbbk-2026.json`, `eis-2025.json`, `socso-config.json`. SKBBK was mandatory for everyone in contribution month June 2026, with a local opt-out window from 13 Jul to 31 Aug 2026. From 1 Sep 2026 locals who stayed in are permanently in, and foreign workers are always in. Many payrolls deducted June as a later arrear, so real June payslips can differ.

Annual employee contributions, flat wage, First Category, under 60: ("June only" assumes someone out from July. PERKESO has published no month-by-month rule for people who filed in August, so that column is an approximation for them.)

| Wage | YA2025 | YA2026, SKBBK Jun–Dec | YA2026, June only (opted out) | Full-year SKBBK (YA2027) |
|---|---|---|---|---|
| 2,000 | 163.80 | 266.35 | 178.45 | 339.60 |
| 2,500 | 205.80 | 334.25 | 224.15 | 426.00 |
| 3,000 | 247.80 | 402.85 | 269.95 | 513.60 |
| 4,000 | 331.80 | 539.35 | 361.45 | 687.60 |
| 5,000 | 415.80 | 675.85 | 452.95 | 861.60 |
| 6,000 and above | 499.80 | 812.35 | 544.45 | 1,035.60 |

First wage band that reaches RM350 in the year: YA2025 RM4,200.01–4,300 (357.00); YA2026 in SKBBK RM2,600.01–2,700 (361.55); YA2026 opted out after June RM3,800.01–3,900 (352.25). At RM5,000 the cap is reached in November for YA2025 and in August for YA2026, if SKBBK counts.

Wage bases differ: EPF excludes overtime and includes bonus, while SOCSO and EIS include overtime and exclude annual bonus. Take the relief input from each module's own output, not from gross pay. Non-residents get no relief. Exclude any share an employer bears instead of the employee, because it wouldn't be "made or suffered" by them (inference).

### Does SKBBK count toward the RM350? Not settled: this stays open

**The evidence doesn't settle it. YA2026 reading: yes on the statutory text, but no authority says so.**

- **For counting it:** para 46(1)(n) covers contributions to SOCSO "pursuant to" Act 4. Act A1788 s.3 rewrites Act 4 s.6(2), so first- and second-category contributions cover non-employment injury ("bukan bencana kerja"), and s.6(4)–(5) make them payable under the Third Schedule. So SKBBK is an Act 4 contribution, not a separate scheme.
- **Why that doesn't close it:** no LHDN, PERKESO or MOF statement addresses it. The relief page stops at YA2025, TP1 2026 predates SKBBK, YA2026 BE notes don't exist yet, and PERKESO's FAQ v2.3 has no tax content. One vendor release note (Access UBS) reportedly adds SKBBK to the relief, seen only as a search excerpt and not an authority. Press reports are confusing, so we don't rely on them.
- **What to do until then:** treat it as a config flag with status `statutory-reading-unconfirmed-by-LHDN`. Recheck against the YA2026 BE notes and TP1 2027 notes.
- **It matters only at lower wages.** At RM4,300 and above, SOCSO + EIS alone reach the cap. Effect on the YA2026 relief: RM2,000: 163.80 or 266.35; RM3,000: 247.80 or 350; RM4,000: 331.80 or 350. A citizen aged 60+ at RM5,000: 0 or 260.05.

**YA2027 (proposal, Lampiran 9):** mandatory LINDUNG KENDIRI (3 sectors) joins the RM350, and up to RM150 more applies to "caruman sukarela" for LINDUNG 24 and the 17 non-mandatory LINDUNG KENDIRI sectors. The total maximum is RM500. Press reports attaching the RM150 to mandatory LINDUNG Kendiri conflict with the MOF text, and the MOF text wins. Whether the RM150 is a separate bucket or pooled is open until the Finance Bill text exists:

| Wage | SOCSO + EIS | SKBBK | Reading A: separate, min(S+E, 350) + min(SKBBK, 150) | Reading B: pooled, min(all, 500) |
|---|---|---|---|---|
| 2,000 | 163.80 | 175.80 | 313.80 | 339.60 |
| 3,000 | 247.80 | 265.80 | 397.80 | 500.00 |
| 4,000 | 331.80 | 355.80 | 481.80 | 500.00 |
| 5,000 and above | 415.80+ | 445.80+ | 500.00 | 500.00 |
| Citizen 60+, 5,000 | 0 | 445.80 | 150.00 | 445.80 |

Reading A fits the annex wording better, so the template uses it, marked unconfirmed. Foreign workers' SKBBK is mandatory, so on the text it stays in the RM350. First-time local contributors after 31 Aug 2026 are treated as mandatory on a medium-confidence reading, so their bucket is unclear.

### Effect on PCB

With TP1 C14 entered monthly until the cap, single RM5,000 (model values):

| Year | Monthly PCB | Total | Saving |
|---|---|---|---|
| YA2025 | 109.85, 109.65, 109.45, 109.20, 108.95, 108.65, 108.30, 107.90, 107.35, 106.65, 106.55, 106.50 | 1,299.00 | 21.00 |
| YA2026, SKBBK counted | 109.85, 109.65, 109.45, 109.20, 108.95, 108.35, 107.60, 107.20, 107.20, 107.20, 107.20, 107.15 | 1,299.00 | 21.00 |

At RM10,000 the saving is RM87.50. So the effect is normally 350 × marginal rate, about RM1.75/month at RM5,000 and RM7/month at RM10,000. **The exception is the rebate cliff.** When the relief brings P from just above to at or below 35,000:

- Single RM4,010, YA2026: annual tax falls from 607.20 to 193.10, a saving of RM414.10.
- Bands affected: single about RM4,001–4,029; Category 2 no children about RM4,334–4,362; Category 2 with 2 children about RM4,667–4,695, where tax falls from about RM600 to as low as nil.
- Monthly PCB may not catch up. Single RM4,029, YA2026: PCB totals 405.60 against annual tax of 199.94. This is another reason to show the annual estimate.

### Does payroll apply it automatically?

**Not by law.** Spec §E.14(ii) lists it under "Optional deductions", claimed "by submitting Form TP1", subject to employer approval. LHDN's 2026 testing questions (Q1, Q3) include a monthly SOCSO input. In practice it is a per-system setting, with thin evidence:

- AutoCount: per-employee "Claim Employee's SOCSO & EIS Tax Relief" setting (vendor page, seen by one checker; a later fetch returned 404).
- Worksy: "Auto-Include SOCSO/EIS in TP1". StaffAny: a Yes/No field per employee. Defaults aren't stated.
- Access EasyPay and Access UBS: seen only in search excerpts. JustLogin (excerpt) tells users to enter year-to-date SOCSO + EIS at point 14.
- CountServa calculator: off by default. Smartlink calculator: an optional TP1 field.

Not determined: SQL Payroll, UBS's defaults, Talenox, Swingvy, PayrollPanda, Kakitangan, or what most employers do.

---

## 9. Discrepancies vs the old implementation (`financial-view-app/src/lib/salary/rates/pcb.ts`)

| # | Old behaviour | Correct behaviour | Impact |
|---|---|---|---|
| 1 | Annualise salary, compute annual tax, divide by 12 | LHDN cumulative formula: ∑(Y−K), K2 projection, X, Z, n+1, recomputed every month (§3.2) | Flat salary: same annual total, monthly figure off by a few sen. Wrong for bonus months, pay changes, mid-year joiners and TP1 claims. Medium |
| 2 | `round2` (Math.round to sen) | Truncate to 2 dp at each step, then **round up** to 5 sen | E.g. single RM10,000: old 929.17 vs 929.20. Low |
| 3 | No RM10 minimum | MTD < RM10 → 0 (before zakat and before rounding) | E.g. single RM3,500 (P ≈ 29,000, tax 20/yr): old 1.67/month; correct is **0 for January to October, then 10.00 in November and December**. Single RM3,700: 0 to March, then 10.20–10.25. Low |
| 4 | Brackets "same YA2024–2026" | Correct for YA2025 and YA2026 (confirmed) | None for 2025/26. **YA2027 needs the new table** (old code has no 2027) |
| 5 | Self 9,000; spouse 4,000 for "married-spouse-not-working" | Correct for 2025/26. YA2027 proposes self 12,000 | OK |
| 6 | Every child = 2,000 (`childrenUnder18 + childrenOver18Studying`) | Units: 18+ diploma/degree or articles = 8,000 (4 units); 18+ pre-tertiary = 2,000; disabled = 8,000; disabled studying = 16,000; half shares under s.48(4); income test under s.48(5) | **High** for families with university-age children: e.g. one degree student under-relieved by 6,000 → up to RM1,140/yr extra PCB at 19% |
| 7 | Children counted even in 'single' | Category 1 forces C = 0. Divorced/widowed/single parents are **Category 3** | Old code has no Category 3 for single parents (its `married-spouse-working` is the only Category 3). High for single parents |
| 8 | No disabled reliefs | Du 7,000; Su 6,000 (Category 2 only) | Medium for affected users |
| 9 | EPF relief = min(annual compulsory + voluntary EPF, 4,000) | Same cap, but applied through K1/K2/Kt month by month. Voluntary EPF beyond 4,000 can use the 3,000 slot under 49(1)(a), shared with life insurance. K1 comes from the Third Schedule | Low (cap OK) |
| 10 | No SOCSO/EIS relief | Correct **for MTD by default** (TP1 optional). Wrong for the annual tax estimate | Low (normally ≤ 350 × marginal rate), but over RM400 in the narrow rebate-cliff bands (§8) |
| 11 | No other reliefs (life insurance 3,000, PRS, medical, lifestyle, …) | TP1 / annual reliefs (§4.4) | Medium to high, depending on the user |
| 12 | Rebate 400 (+400 for spouse not working) when chargeable ≤ 35,000 | Equivalent to B in Table 1 for annual tax, with rebates capped at tax charged. MTD picks the row on floor(P), and alimony also earns the spouse rebate at annual level | OK, minor |
| 13 | No zakat interaction | Net MTD = MTD − zakat; Z takes the full amount; the net isn't floored in a bonus month; annual rebates share the s.6A(4) cap; none for non-residents | **High** for Muslim users paying zakat via payroll (old code double-counts zakat and tax) |
| 14 | No bonus / additional remuneration | 5-step formula (§3.8), with the taxable part of any termination payment (§3.15) | Medium |
| 15 | Always resident | Non-resident 30% flat, with the usual rounding and RM10 rule, no zakat offset | Medium for expats and short contracts |
| 16 | Assessment year fallback silently uses the latest year | Each YA must have explicit config with a status flag. YA2027 is "unconfirmed-template" | Process |
| 17 | Comment says tax brackets "verified against LHDN-sourced references" for 2024–2026 | Now verified against the BE YA2025 schedule and the 2026 MTD spec | Doc |
| 18 | Self-employed → PCB not applicable | Correct (no MTD), but they still owe annual tax (B form). A separate concern | – |
| 19 | (Not modelled) | Worker categories: pensionable government staff K = 0; domestic workers on the normal path (§3.16) | Medium for those users |

---

## 10. Limitations, unverified items and confidence

| Item | Status | Confidence |
|---|---|---|
| YA2025 and YA2026 brackets | Confirmed from official LHDN docs (BE YA2025 notes; MTD spec 2026; tax-treatment slides 2026). Budget 2026 didn't change Part I; LLP 2% is separate | **High** |
| MTD formula, Table 1 values for 2025 and 2026 | Official 2025 and 2026 spec PDFs; 17 of 17 published monthly results reproduced to the sen (§6.1). All 9 rows also match gazetted P.U.(A) 230/2023 | **High** |
| **2025 MTD spec** | **Retrieved** in the deep pass from one Wayback capture (2026-01-18; 53 pages; SHA-256 2ae32898…). §D text is identical to 2026, and the only formula-page change is a page cross-reference. TP1 (1/2025) layout confirmed; every reconstructed item was right. The 2025 testing questions weren't found | **High** |
| LHDN Kalkulator PCB | Reached over plain HTTP on 2026-11-05, for **year 2024 only**; 2025–2027 pages return 404. Traffic was unencrypted, though results were coherent. Later attempts returned HTTP 500, and HTTPS doesn't connect. `calcpcbplus.hasil.gov.my/HITS_CE/x2026` is JavaScript-only; e-PCB Plus needs a MyTax login | Year 2024 engine: high. YA2025/26 by proxy: medium-high. YA2027: low-medium |
| Rounding order: RM10 before rounding, one round-up, floor(P), unrounded Step 1[E] | Calculator (110 of 110 results), GPO Contoh 4 for Step 1[E], and the spec's integer ranges. Not spelled out in the spec text | Medium-high for 2025/26 |
| Negative Net offsets additional MTD; Z takes the full amount | Printed in specs 2025 and 2026 §E.5 | **High** |
| Worked cases in §6.2 | January figures and Case 3's full year run on the calculator's 2024 page. Thresholds beyond those listed, year totals and YA2027 are model values. Third Schedule EPF is used | High for 2024 page; medium-high by proxy |
| Non-resident rounding and RM10 | Spec §E applies to MTD generally; calculator confirms | High |
| Non-resident zakat | s.6A(1) and the structure of the specs. Not stated outright | High |
| Zakat rebate cap | Pooled under s.6A(4); PR 3/2023 paras 4.3, 5.3, Examples 5, 7, 8. Consolidated Act read as at 1 Jan 2026 | **High** |
| Approved donations cap | 10% shared cap (Act 823 s.8; PR 7/2025 para 5.2) | **High** |
| SOCSO + EIS amounts | Checked against the data files (§8) | **High** |
| SKBBK in the RM350 relief | **Open.** Statutory reading says yes; no authority confirms it (§8) | Medium |
| YA2027 SOCSO RM150: separate or pooled | Open until the Finance Bill text (§8) | Medium |
| SOCSO/EIS relief automatic or TP1 in payroll practice | Not automatic in law; a per-vendor setting; few vendors checked | Medium |
| GPO 1/2024 examples | Contoh 4 is valid evidence for Step 1[E], with a half-up K2 quirk. The 8% band is out of date, so don't use them as regression tests | High |
| TP1 notes 2026, C13 text | Says the education/medical insurance cap is "RM3,000", while the TP1 form, the spec, the LHDN relief page and the 2025 notes say 4,000. We use **4,000** | High |
| TP1 notes 2026, C8 and C16 | C8 age wording is wider than the Act; C16 cites s.46C, which doesn't exist. Follow the Act | High |
| Legal paragraph numbers | Filled from LHDN's online Act as at 1 Jan 2026, which says it isn't an authentic text. Act 874 and P.U.(A) 230/2023 were read on third-party mirrors | Medium-high |
| YA2027 | Budget 2027 **proposals** only (speech annex and MOF English annex agree, 9 Oct 2026). No Finance Bill as of 2026-11-05, though the tracker may lag and the 2–5 Nov order papers couldn't be read. No 2027 MTD spec or TP1. B values derived by us and rechecked. Rebates, non-resident rate, EPF cap and unmentioned reliefs carried forward | **Low to medium**: flag in UI |
| YA2027 breastfeeding merge | MOF: merged into health & well-being (≤1,000, self **or spouse**). EY: the existing relief is removed. Whether TP1 C7 disappears, and whether the once-per-2-YAs condition survives, is unknown | Medium |
| Practice Note 1/2021 (PCB as final tax) | Dated 3 May 2021; no newer replacement found. The 2014 FAQ is secondary and partly out of date (its 12-month rule and s.13(1)(b)/(c) exclusion) | Medium-high |
| Termination exemptions (§3.15) | Act as at 1 Jan 2026 and PR 1/2012, PR 9/2016 (firm mirrors). "Only the taxable excess enters Yt" is a firm reading with no LHDN worked example. A newer ruling for 2026 isn't excluded | Medium-high |
| Overtime in Y1 (§3.14) | Calculator note, P.U.(A) 314/2013, slides p13. Worked figures not run on LHDN's calculator. No 2025/2026 slide found | High for overtime generally; medium-high for one-off; tips medium-high; service charge inferred |
| Worker categories (§3.16) | Act and GPO for the path. Parent Rules P.U.(A) 507/1994 not obtained. Household practice, LTAT and statutory-body pensionable staff unverified | Medium |
| Mid-year joiners under the EPF cap | Table EPF changes P directly here; not swept | Medium |
| EPF figures in the examples | From the Third Schedule data files. Parts A, C, E verified for wage months from Oct 2025; Jan–Sep 2025 inferred (medium-high) per the file. Part F has no data file yet | High at the worked wages |

## Verification log (deep pass, 2026-11-05)

| Claim | What it said | Outcome | Votes | Action taken | Key source |
|---|---|---|---|---|---|
| C1 | YA2025 and YA2026 brackets identical; Budget 2026 changed reliefs only | REFUTED | primary ✗; compute ✗; currency ✓ | Brackets kept. Sentence corrected: LLP 2% added in §1, §4.1 and tax JSON. | Act 874 s.17, Sch.1 Part XXIII; ub26 Lampiran 7 |
| C2 | MTD Table 1 values; row applies when M < P; 2025 table reconstructed | REFUTED | primary ✗; compute ✗; currency ✓ | Values kept. Row rule changed to floor(P); JSON keys renamed; 2025 marked confirmed. | Calculator P 35,000.99 / 35,001.00; spec 2025 Table 1 |
| C3 | Normal formula; 12 months add up exactly; January within 5 sen | REFUTED | primary ✗; compute ✗; currency ✗ | Formula kept. Both closing statements narrowed in §3.2 and §3.11; rescanned on Third Schedule EPF. | Calculator; our 9,001-salary scan |
| C4 | EPF K1, K2, Kt and RM4,000 cap | CONFIRMED | primary ✓; compute ✓; currency ✓ | Kept. 7,000 wording refined from gap G2 (§3.3). | Spec 2026 §E.13; Exhibit 5 |
| C5 | Rounding and RM10 rules; negative results become 0 | REFUTED | primary ✗; compute ✗; currency ✗ | Corrected §3.2, §3.6, JSON: RM10 before rounding, one round-up, net unfloored in bonus month. | Spec §E.5(ii); calculator |
| C6 | Categories and D, S, Du, Su, Q | REFUTED | primary ✗; compute ✗; currency ✓ | Amounts kept. Added Su Category 2 only and fractional C. | ITA s.45A, s.47, s.48(4) |
| C7 | Child units | REFUTED | primary ✗; compute ✗; currency ✓ | Units kept. Added articles or indentures, s.48(4), s.48(5), age test. | ITA s.48; PR 7/2025 §6.19 |
| C8 | Rebates; cliff of 400/800; RM4,000 gives PCB 50.00 | REFUTED | primary ✗; compute ✗; currency ✗ | Case 12 now 16.70; cliff 400/600; spouse condition and levy references corrected. | Calculator c12; ITA s.6A(2), (2B), (4) |
| C9 | Zakat offset; cap under s.6A(3); ordering unverified | REFUTED | primary ✗; compute ✗; currency ✗ | Corrected: bonus month unfloored; Z full amount; pooled cap under s.6A(4); levy on the same path. | Spec §E.5; ITA s.6A(4); PR 3/2023 Ex 7 |
| C10 | Bonus 5-step formula; rounded Step 1[E] | REFUTED | primary ✗; compute ✗; currency ✗ | Rewritten §3.8: unrounded Step 1[E], additional not rounded separately, one round-up on the sum. | Calculator b01–b06; GPO Contoh 4 |
| C11 | Non-resident 30%; no rounding steps | REFUTED | primary ✗; compute ✗; currency ✓ | 30% and residence tests kept. Added §E rounding and RM10, base, Sch.6 para 21; no zakat offset per zakat cross-check. | Spec §E.1–3; calculator; ITA s.6A(1) |
| C12 | YA2027 proposed rates, D 12,000, derived B | CONFIRMED | primary ✓; compute ✓; currency ✓ | Kept as proposal. MOF English annex added. | ub27 Lampiran 1–2; tax-measures.pdf |
| C13 | SOCSO + EIS RM350, TP1 C14; RM34.65 unchecked; SKBBK unknown | CONFIRMED | primary ✓; compute ✗; currency ✓ | Kept. RM34.65 dated, 71.80 added. SKBBK stays open with the statutory reading stated (§8). | PR 7/2025 para 6.10; ITA s.46(1)(n); data files |
| C14 | Optional relief caps YA2025 and YA2026 | CONFIRMED | primary ✓ (primary: no live search); compute ✓; currency ✓ | Kept. s.46C corrected to s.46B; childcare note refined. | Spec 2026; TP1 2026; ITA s.46B |
| C15 | YA2026 relief changes; childcare to 12; tourism YA2026 only | REFUTED | primary ✗; compute ✗; currency ✗ | Childcare split by premises; tourism shown as enacted YA2026, proposed YA2027. Claim-month variants added. | ITA s.46(1)(r); Act 874 s.6; Budget 2027 App. 8 |
| C16 | YA2027 proposed relief changes | CONFIRMED | primary ✓ (primary: no live search); compute ✗ (compute: no live search); currency ✓ | Kept. Noted the two exceptions to "others unchanged" (D and SOCSO 350 + 150). | ub27 Lampiran 1–9; tax-measures.pdf |
| C17 | January PCB figures and thresholds; 17 official results | REFUTED | primary ✗; compute ✗; currency ✓ | Eight figures kept. Thresholds 3,778 and 3,445. Provenance updated; pcb_ref.py no longer treated as validated. | Calculator t-s11, t-s0; results.json |
| C18 | MTD base: BIK, exempt items, additional list, TP3 | REFUTED | primary ✗ (primary: no live search); compute ✗; currency ✗ | Corrected §2: care allowance scope, phone per category, loan interest, additional list, BIK methods. | Spec §D(b), §E.9–12; P.U.(A) 113/2025 |

✓ = confirmed, ✗ = refuted. REFUTED means 2 or more of the 3 checks refuted. **All the refutations were checked against the cited source and upheld; most are narrow.** C13's and C16's single refutations are narrow and were also applied.

**"No live search"** means that check ran without live web search, because of a session cap. It used saved sources and direct fetches only, so it is lower confidence than a check that could search. This applies to C14 primary, C16 primary, C16 compute and C18 primary. In each case the other checks on that claim did have search.

**To-dos and gaps merged:** T1 2025 spec (§3.12, §4.5, §10); T2 calculator (§3.6, §3.8, §6); T3 Finance Bill (§4.5, §10, YA2027 JSON); T4 zakat cap and gifts (§3.7, §3.13); T5 cross-module (§6.2, §8); T6 legal references (§4.4, §3.5, JSON); G1 termination payments (§3.15); G2 worker categories (§3.3, §3.16); G3 overtime (§3.14).

**Where results conflicted.** T5's full-year RM4,000 series (50, 13.65, 53.65 … total 328.50) and its January thresholds came from the old `pcb_ref.py`, and the calculator contradicts them, so they were not used. All figures here were recomputed with the current model. C8 compute's RM4,001 example used EPF 441 (P 35,012.06); the Third Schedule gives 443 (P 35,012.04). C3 currency's RM3,722 example used EPF 410 and showed a total of 90.00; on the table's 412 the total is 99.95, so the §3.11 examples use the table.

**Cross-check with `zakat.md` §8.** Six points were checked against the Act, PR 3/2023, the specs and the calculator, and all hold: pooled s.6A(4) cap; no non-working-spouse exception; Z takes the full amount; the RM10 order; an unfloored net in a bonus month; no zakat rebate or offset for non-residents. Two details in that report's §8.2 differ from the calculator: it applies the RM10 test after rounding, and it proposes no re-rounding after zakat. This report follows the calculator: raw 9.96 pays 0, and 110.00 − 50.33 pays 59.70.

**AGC portal.** No finding in this report is recorded as resting on the saved AGC (lom.agc.gov.my) listings. The owner decided on 2026-11-06 not to rely on those listings (D1). Two AGC links appear in §11 as direct PDF URLs: the 2006 reprint of the Act, and Act 874. The records don't say how the Act 874 URL was found, so its route is unconfirmed; the Act 874 text used here was also read on a third-party mirror, and its wording matches LHDN's online Act.

**Not independently verified** (`droppedClaims`, not put through the deep check):
- Special 15% regimes (REP, knowledge worker in a specified region, non-citizen C-suite) formulas and rebate T: low priority, approval-only
- PCB as final tax (s.77C, Practice Note 1/2021) conditions and consequences: affects only the annual-estimate hint, not monthly PCB
- LHDN registration/liability threshold of RM37,333 annual employment income, and the BE deadline of 30 April
- TP1 processing rule (employer processes it at least twice a year) and the TP3 mechanics beyond the base inputs
- e-Jadual schedule method (round to nearest 5 sen, RM1 minimum, EPF RM333/month): not to be implemented
- GPO 1/2024 Contoh 4 results (71.33/736.04): flagged as inconsistent, not to be used as tests
- Annual tax (BE) reconciliation formula in §3.13: derived from claims C1, C8, C9 and C14
- Old-implementation discrepancy list (§9) items not already covered by claims C3-C11
- Departure levy amounts (RM8-RM150 by class/destination)

## Questions for the owner

1. **SOCSO + EIS relief in monthly PCB.** Should the default apply it through TP1, or not? The law makes it optional, and vendors treat it as a setting. Suggestion: off for monthly PCB, on for the annual estimate, with a toggle "my payslip already applies this". The cost of off is PCB about RM1.75/month too high at RM5,000 for a user whose payroll applies it.
2. **Other TP1 reliefs.** Should they default to "declared to employer" (lower monthly PCB) or "claimed at filing" (refund later)?
3. **January or 12 months.** Show the January PCB only, or simulate 12 months? The evidence now favours simulating at least when a bonus, pay change, one-off overtime or claim month is set, and for salaries near the RM10 line (§3.11).
4. **Scope.** Support mid-year joiners (TP3) and the special 15% regimes, or leave them out?
5. **YA2027 display.** Show the proposed figures with a "proposed, not law" badge, or YA2026 figures until the Act and spec are published? Suggestion: proposed with the badge, because YA2026 would show rates and a D that the Budget proposes to replace. The catch is that they can change, and payroll shouldn't apply them until LHDN publishes the spec.
6. **e-PCB Plus check.** Can you run these on e-PCB Plus for 2026 with an employer MyTax login, or should we ship with the rules marked as verified on the 2024 calculator and the spec? January, resident, single: (a) RM10,000, EPF 1,100, bonus 10,000, bonus EPF 1,100: expect 3,429.25. (b) RM7,777, EPF 0, bonus 3,333: expect 1,168.40. (c) RM3,700, EPF 407, bonus 10,000, bonus EPF 0: expect 984.00. (d) RM4,000, EPF 440: expect 16.70.
7. **Childcare, child aged 7 to 12 at a TASKA or TADIKA.** Follow the Act (not claimable) or LHDN's TP1 notes (12 and under everywhere)? Suggestion: the Act, with a short warning, because a claim under the wider wording could be disallowed.
8. **Overtime.** Use LHDN's Y1 route only, with a note that payslips can differ, or also offer an advanced "my payroll treats overtime as additional" toggle? Suggestion: Y1 only.
9. **Termination payments.** Offer an input at all, given that the payout may be held for tax clearance and the formula keeps projecting salary after the last pay? Suggestion: yes, as an advanced option, showing the result as an estimate with a clearance warning, and an ill-health tick-box, off by default, labelled as needing LHDN acceptance.
10. **Domestic workers.** Calculate from the formula (usually RM0) with a note that LHDN has published no household-employer guidance, or also tell the household to get an E number and file Form E? The Act has no exception, but only LHDN can confirm its practice.
11. **Self-employed and gig users.** Offer an annual estimate from net business income, or only say that no PCB applies and point to Form B?
12. **Government staff.** Offer separate choices (pensionable / Skim KWSP / contract or interim / statutory body), with an LTAT-type "other approved scheme" field as advanced despite its unverified status?
13. **Gifts in the annual estimate.** Two inputs ("approved donations and wakaf, 10% cap" and "gifts to Government, no cap"), leaving out the rarer RM20,000 and valuation-based gifts, or every s.44 category? Suggestion: two inputs, noting that donations count only if the user files a BE.

---

## 11. Sources (accessed 2026-11-04 unless noted; deep-pass sources accessed 2026-11-05)

**LHDN (official):**
- MTD computerised calculation specification 2026 (updated 1 Jan 2026): https://www.hasil.gov.my/wp-content/uploads/spesifikasi-kaedah-pengiraan-berkomputer-pcb-2026.pdf
- MTD specification 2024 (official LHDN document, third-party mirror): https://www.hr2eazy.com/images/Statutory-Deductions-pdf/Spesifikasi%20Kaedah%20Pengiraan%20Berkomputer%20PCB%202024.pdf
- MTD computerised calculation specification 2025 (updated 1 Jan 2025), Wayback capture, accessed 2026-11-05: https://web.archive.org/web/20260118131226id_/https://www.hasil.gov.my/media/mdahzjwi/spesifikasi-kaedah-pengiraan-berkomputer-pcb-2025.pdf (original URL returns 404)
- TP1 2025, BM, English and notes, Wayback captures, accessed 2026-11-05: https://web.archive.org/web/20260107161011id_/https://www.hasil.gov.my/media/gs2pt520/tp1-2025.pdf ; https://web.archive.org/web/20250415092937id_/https://www.hasil.gov.my/media/qrulhwku/tp1-2025-en.pdf ; https://web.archive.org/web/20251031093742id_/https://www.hasil.gov.my/media/hkzf5rqd/nota-penerangan-borang-tp1-2025-en.pdf
- 2026 spec archived copy (byte-identical): https://web.archive.org/web/20260312211420id_/https://www.hasil.gov.my/media/arvlrzh5/spesifikasi-kaedah-pengiraan-berkomputer-pcb-2026.pdf
- MTD testing questions 2026 (no answers published): https://www.hasil.gov.my/wp-content/uploads/mtd-testing-question-2026.pdf
- TP1 2026 form and explanatory notes: https://www.hasil.gov.my/wp-content/uploads/bm-borang-tp1-2026.pdf and https://www.hasil.gov.my/wp-content/uploads/nota-penerangan-tp1-2026.pdf
- Jadual PCB & spesifikasi page: https://www.hasil.gov.my/majikan/jadual-pcb-dan-spesifikasi-data/
- Garis Panduan Operasi 1/2024 (PCB): https://www.hasil.gov.my/wp-content/uploads/20240102-gpo-1-2024-potongan-cukai-bulanan-di-bawah-kaedah-kaedah-cukai-pendapatan-potongan-daripada-saraan-1994.pdf
- Income Tax (Deduction from Remuneration) Rules 1994, amendment 2021, P.U.(A) 123/2021: https://www.hasil.gov.my/wp-content/uploads/Kaedah_Kaedah_Cukai_Pendapatan_Potongan_Daripada_Saraan_1994_Pindaan_2021.pdf (its Table 1 is out of date; the parent Rules P.U.(A) 507/1994 weren't obtained)
- Rules amendment 2023, P.U.(A) 230/2023, third-party mirror, accessed 2026-11-05: https://ccs-co.com/wp-content/uploads/194.-Income-Tax-Deduction-from-Remuneration-Amendment-Rules-2023-PUA-230.pdf
- P.U.(A) 314/2013, via the calculator's notes, Wayback, accessed 2026-11-05: http://web.archive.org/web/20260111235655/http://calcpcb.hasil.gov.my/NOTA_PENERANGAN_JADUAL_PCB_2013.pdf
- PCB guideline 2016, Wayback, accessed 2026-11-05: http://web.archive.org/web/20241126190034/http://calcpcb.hasil.gov.my/GARIS_PANDUAN_PCB_2016.pdf
- Kaedah page: https://www.hasil.gov.my/majikan/kaedah/ (accessed 2026-11-05)
- Income Tax (Exemption) Order 2009 (Amendment) Order 2025, P.U.(A) 113/2025 (local: `.research-cache/pcb/verify/c18-currency/pua-113-2025.pdf`)
- PCB management briefing slides 2024 (Kalkulator and "sebenar" examples): https://www.hasil.gov.my/wp-content/uploads/T2024_slaid-taklimat-pengurusan-pcb.pdf (accessed 2026-11-05)
- Tax relief page (YA2025 and earlier): https://www.hasil.gov.my/en/individu/pelepasan-cukai/
- e-BE YA2025 explanatory notes (tax schedule, rebates, SOCSO/EIS): https://ef.hasil.gov.my/eBE2026/Pdf/Nota_BE_e.pdf
- Form B YA2025 explanatory notes: https://www.hasil.gov.my/wp-content/uploads/explanatorynotes_b2025_1.pdf
- Public Ruling 7/2025, Taxation of a Resident Individual Part I (5 Dec 2025): https://www.hasil.gov.my/wp-content/uploads/pr-7-2025.pdf
- Tax Treatment Residents & Non-Residents (updated 08/04/2026): https://www.hasil.gov.my/wp-content/uploads/Tax-Treatment-Residents-Non-Residents.pdf
- Practice Note 1/2021, Cukai Muktamad: https://www.hasil.gov.my/wp-content/uploads/NA_1_2021.pdf
- Kalkulator PCB: http://calcpcb.hasil.gov.my/pcb_calc_2024.php, landing page http://calcpcb.hasil.gov.my/index.php?&lang=eng (plain HTTP worked for year 2024 on 2026-11-05, later HTTP 500; https://calcpcb.hasil.gov.my/ refused or timed out on 2026-11-04). Year 2025–2027 pages return 404
- Kalkulator user manual, downloaded but not read: http://calcpcb.hasil.gov.my/MANUAL_PENGGUNA_KALKULATOR_PCB_BM.pdf
- calcpcbplus, JavaScript-only, not read: calcpcbplus.hasil.gov.my/HITS_CE/x2026
- Explanation of the e-PCB Plus / e-CP39 systems (not read in depth): https://www.hasil.gov.my/wp-content/uploads/T2025_manual-pengguna-e-cp39.pdf
- LHDN FAQ "MTD as final tax", 2014, Wayback, accessed 2026-11-05: https://web.archive.org/web/20210615222026id_/http://lampiran2.hasil.gov.my/pdf/pdfam/FAQ_MTD_Final_Tax_2.pdf (old URL http://lampiran2.hasil.gov.my/pdf/pdfam/FAQ_MTD_Final_Tax_2.pdf returned empty or 404)
- Income Tax Act 1967, online text as at 1 Jan 2026 (not an authentic text), accessed 2026-11-05: https://www.hasil.gov.my/wp-content/uploads/Income-Tax-Act-1967-online-version-as-at-1-January-2026.pdf
- Income Tax Act 1967, LOM reprint to 1 Jan 2006, out of date: https://lom.agc.gov.my/ilims/upload/portal/akta/LOM/EN/Act%2053.pdf
- Public Ruling 3/2023 (zakat and rebates): https://www.hasil.gov.my/wp-content/uploads/ku-3-2023-pencukaian-individu-bermastatutin-bahagian-iii-pengiraan-cukai-pendapatan-dan-cukai-kena-dibayar.pdf
- Public Ruling 4/2024: https://www.hasil.gov.my/wp-content/uploads/pr-no-4-2024.pdf
- Public Ruling 5/2019, Wayback: https://phl.hasil.gov.my/pdf/pdfam/KU_05_2019_1.pdf
- Public Rulings list: https://www.hasil.gov.my/en/perundangan/ketetapan-umum/
- Public Ruling 1/2012 (compensation), firm mirror: https://ccs-co.com/wp-content/uploads/5.6-PR-1_2012-【Compensation-For-Loss-Of-Employment】.pdf
- Public Ruling 9/2016 (gratuity), firm mirror: https://ccs-co.com/wp-content/uploads/5.5-PR-09_2016-【Gratuity】.pdf
- Employer responsibilities: https://www.hasil.gov.my/en/majikan/tanggungjawab-majikan/ and slides https://www.hasil.gov.my/wp-content/uploads/T2025_tanggungjawab-majikan.pdf
- e-Buletin 6/2023 (gig income): https://www.hasil.gov.my/wp-content/uploads/e_buletin_hasil_edisi_6_2023.pdf
- Approved institutions: https://www.hasil.gov.my/en/institusi-organisasi-tabung/ ; individual FAQ: https://www.hasil.gov.my/en/individu/soalan-lazim-individu/
- Approved payroll software list, 12 Oct 2026: https://www.hasil.gov.my/wp-content/uploads/List-of-Software-Provider-of-Payroll-System-approved-as-at-12-October-2026.pdf
- Tax calculators page: https://www.hasil.gov.my/en/eduzone/kira-dan-kalkulator-cukai/ ; slides list: https://www.hasil.gov.my/en/eduzone/slaid-poster-percukaian/
- Tax rates page: https://www.hasil.gov.my/en/individu/kadar-cukai/

**Ministry of Finance (official):**
- Budget 2025 speech with Lampiran II tax measures: https://belanjawan.mof.gov.my/pdf/belanjawan2025/ucapan/ub25.pdf
- Budget 2026 speech with tax annexes: https://belanjawan.mof.gov.my/pdf/belanjawan2026/ucapan/ub26.pdf
- Budget 2027 speech with Lampiran II (individual measures in Lampiran 1–9), tabled 9 Oct 2026: https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf
- Budget 2027 tax measures, English annex, accessed 2026-11-05: https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/tax-measures.pdf

**Acts, Parliament and other government (accessed 2026-11-05):**
- Finance Act 2025 (Act 874): https://lom.agc.gov.my/ilims/upload/portal/akta/outputaktap/3276537_BI/Act%20874%20-%20FINANCE%20ACT%202025.pdf ; mirror https://www.ramco.com/hubfs/compliance-portal/act-874-finance-act-2025.pdf
- Finance Bill 2025: https://cljlaw.com/files/bills/pdf/2025/MY_FS_BIL_2025_38.pdf
- Finance Act 2019 (Act 823), firm copy: https://zulrafique.com.my/ckfinder/userfiles/files/legislation%20update/Act%20823_%20Finance%20Act%202019%20(01952373xA335E).pdf
- Act A1788: https://perkeso.gov.my/images/akta/ACT%204/Akta_A1788_-_AKTA_KESELAMATAN_SOSIAL_PEKERJA_PINDAAN_2026.pdf
- PERKESO LINDUNG 24 Jam FAQ v2.3: https://www.perkeso.gov.my/images/lindung/lindung-24-jam/FAQ_LINDUNG24Jam_v_2.3%20.pdf
- Parliament bills: https://www.parlimen.gov.my/bills-dewan-rakyat.html?uweb=dr&lang=en and https://www.parlimen.gov.my/bills-dewan-negara.html?uweb=dn&lang=en ; sittings https://www.parlimen.gov.my/takwim-dewan-rakyat.html?uweb=dr&lang=en and https://www.parlimen.gov.my/takwim-dewan-negara.html?uweb=dn&lang=en ; order papers https://www.parlimen.gov.my/aum-dewan-rakyat.html?uweb=dr&lang=en (PDFs not retrievable)
- Government staff: https://www.anm.gov.my/images/dokumen/pekeliling/surat-pekeliling-anm/2026/SPANM%20Bil%201%20Tahun%202026%20-%20BKK.pdf ; https://www.anm.gov.my/images/dokumen/pekeliling/surat-pekeliling-anm/2026/SPANM_Bil_2_Tahun_2026_Tatacara_Pengurusan_Bayaran_Emolumen_Pegawai_Awam_Persekutuan.pdf ; https://docs.jpa.gov.my/docs/se/2026/se23022026_FAQ.pdf ; https://docs.jpa.gov.my/docs/pp/2026/pp012026.pdf ; https://hq.moh.gov.my/akaun/filelink/fileman-files/upload/garis_panduan/pembayaran_emolumen/Garis Panduan Bahagian Akaun _Emolumen_Bil. 2_2025 19052025.pdf ; https://hq.moh.gov.my/akaun/filelink/fileman-files/upload/garis_panduan/pembayaran_emolumen/Lampiran B_2025.pdf
- Act 239, non-official copy as at 2012: https://legaladvisor.uitm.edu.my/images/ACT/Act_239_-_Statutory_and_Local_Authorities_Pensions_Act_19801.pdf ; Act 227, non-official mirror: https://lawplayer.com/my/act/act-227
- Gig Workers regulations, P.U.(A) 143/2026: https://www.mohr.gov.my/aktapekerjagig2025/assets/documents/PUA143_2026 - PERATURAN PEKERJA GIG (KESELAMATAN SOSIAL).pdf
- CTIM note on the s.44(6) guideline: https://www.ctim.org.my/file/2020/TECH-DT/e-CTIM%20TECH-DT%2017-2020%20-%20LHDNM%20Technical%20Guidelines%20-%20Guidelines%20for%20approval%20of%20DGIR%20under%20subsection%2044(6)%20of%20ITA%201967%20dated%2030%20January%202020%20(26022020)(F).pdf

**Secondary (used only where noted):**
- Mercans, "Update on Specification for MTD Calculation – 1 January 2025" (9 Dec 2024): https://mercans.com/wp-content/uploads/2024/12/MY_Update-on-Specification-for-Monthly-tax-deduction-MTD-calculation_1-January-2025_updated-1.pdf
- Malay Mail, Budget 2027 individual tax (9 Oct 2026): https://www.malaymail.com/news/malaysia/2026/10/09/budget-2027-individual-tax-relief-rises-to-rm12000-income-tax-percentage-lowered/238401
- Commentary cross-checking the YA2027 RM1.5m example: https://www.misslobang.my/article/budget-2027-income-tax-changes-malaysia and https://landco.my/social/malaysia-ya-2027-personal-income-tax-rates/ (search snippets only)
- Budget 2026 secondary summaries (BDO, Grant Thornton): not needed, because the official annex was read
- PwC Tax in Motion, Budget 2027: not read (HTTP 403): https://www.pwc.com/my/en/assets/publications/tax-in-motion/2026/pwc-tax-in-motion-budget2027-edition.pdf ; Wayback snapshot not retrieved: http://web.archive.org/web/20261010024319/https://www.pwc.com/my/en/assets/publications/tax-in-motion/2026/pwc-tax-in-motion-budget2027-edition.pdf
- EY Take 5, Budget 2027: https://www.ey.com/content/dam/ey-unified-site/ey-com/en-my/technical/take-5-business-alert/documents/ey-take-5-budget-2027.pdf
- Deloitte Budget 2027 snapshot: https://www.deloitte.com/southeast-asia/en/services/tax/perspectives/malaysia-budget-2027-snapshot.html ; Baker McKenzie summary: https://www.bakermckenzie.com/en/insight/publications/2026/10/malaysia-budget-2027-employment-highlights
- Press on Parliament and status: https://www.bernama.com/bm/am/news.php?id=2627640 ; https://www.freemalaysiatoday.com/category/nation/2026/10/29/dewan-rakyat-passes-2027-supply-bill-at-policy-stage ; https://bernama.com/en/news.php?id=2365173
- Press on government appointments: https://www.utusan.com.my/nasional/2024/01/penjawat-awam-lantikan-kontrak-berkuat-kuasa-1-februari/ ; https://www.bharian.com.my/amp/berita/nasional/2024/01/1204228/penjawat-awam-tetap-baharu-tidak-berpencen-tpm ; https://malaysiagazette.com/2025/05/15/jpa-usul-bayaran-pencen-lebih-selamat-untuk-pesara-kerajaan/
- Press on CP500 and gig filing: https://www.thestar.com.my/news/nation/2026/06/04/lhdn-sheds-more-light-oncp500-penalty-exemption ; https://thestar.com.my/news/nation/2023/04/24/file-and-pay-taxes-gig-workers-told
- SOCSO relief, secondary: https://newswav.com/article/budget-2027-extra-rm150-tax-relief-if-you-stayed-in-lindung-24-jam-A2610_mUezvg ; https://dataon.com/en-my/blog/lindung-24-jam-skbbk-socso/ ; https://www.yycadvisors.com/budget-2027-malaysia-individual-tax-relief.html
- Payroll vendors, not authorities: https://help.staffany.com/en/articles/15594888-setting-up-employee-profiles-for-malaysia-payroll ; https://help-easypay.theaccessgroup.com/en/articles/12856049-payroll-malaysia-enable-socso-relief-in-the-tax-computation (excerpt only) ; https://support.justlogin.com/hc/en-us/articles/47606706686873-How-to-Use-the-Official-LHDN-PCB-Calculator-Malaysia (excerpt only) ; https://countserva.com/payroll-calculator/ ; https://www.smartlinkerp.com/my/calculator/take-home-pay-pcb-calculator
- Overtime, vendors: https://sites.google.com/site/sqlestream/sql-payroll/2-payroll/2-29-how-to-classified-to-pcb-or-pcb-a ; https://www.talenox.com/blog/malaysia-tax-guide-how-do-i-calculate-pcb-mtd-part-2-of-3/ ; https://hreasily-help.freshdesk.com/support/solutions/articles/72000575870--my-normal-remuneration-vs-additional-remuneration ; https://support.briohr.com/knowledge/setting-default-overtime-payroll-items-as-fixed-or-additional-remuneration
- Third-party claim that e-PCB Plus replaced the old system for 2025 onward, not confirmed: https://ecentral.my/kalkulator-pcb/

**Project data:** `docs/research/data/`: `epf-third-schedule-2025-10-part{A,C,E}.json`, `socso-act4-2025.json`, `socso-act4-2026.json`, `socso-skbbk-2026.json`, `socso-config.json`, `eis-2025.json`. Sibling reports are not used as a source for figures here. `zakat.md` §8 was cross-checked against the primary sources in §3.7.

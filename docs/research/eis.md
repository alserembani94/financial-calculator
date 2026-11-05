# EIS / SIP (Employment Insurance System, Act 800): research notes

- **Researched:** 2026-11-04. **Deep verification pass and revision:** 2026-11-05 (see [Verification log](#verification-log-deep-pass-2026-11-05)).
- **Scope:** monthly EIS (Malay: *Sistem Insurans Pekerjaan*, SIP) contributions for the take-home-salary calculator, for financial years 2025 and 2026, plus a 2027 template.
- **Out of scope:** SOCSO / Act 4 (Employment Injury, Invalidity, Lindung 24 Jam/SKBBK). A separate agent researches those.
- **Data file:** [`data/eis-2025.json`](data/eis-2025.json) holds the full 65-row table, plus the per-year periods, eligibility rules, benefit parameters and wage classification. The same table applies to all of 2026, so there is no separate `eis-2026.json` (see section 4).
- **Name of the Act:** from 1 Oct 2026, Act 800 is called the *Employment Insurance System and Employment Services Act 2017* (A1796 ss.3, 17(1)). This report still says "Act 800".

---

> **Owner decision, 2026-11-06 (D1): saved AGC portal listings are not relied on.** Findings that rest on them stay in this report for reference, but they aren't evidence until someone checks lom.agc.gov.my by hand (`owner-questions.md`, M7). No contribution amount depends on them.

## 1. Summary for a non-expert

- **What it is.** EIS is a small, compulsory insurance deduction from your salary. If you lose your job involuntarily (for example through retrenchment or company closure), PERKESO pays you a falling percentage of your former wage for 3 to 6 months. It also funds training and job-matching to help you find work again.
- **How much.** Roughly **0.2 % of your monthly wage from you**, and the **same amount again from your employer**. It is **not** an exact percentage. The law sets a table of wage bands, each with a fixed amount.
  - Example: on RM2,500/month you pay **RM4.90** and your employer pays RM4.90.
- **Cap.** Wages above **RM6,000/month** are treated as RM6,000, so the most you pay per employer is **RM11.90/month** (that employer also pays RM11.90). This has applied since **1 October 2024** and has not changed since.
- **Who pays it.** Private-sector employees (including Malaysian/PR domestic workers) who are aged 18 to 59. It does **not** apply to:
  - civil servants, including government contract and temporary staff;
  - employees of statutory bodies or local authorities, including contract staff;
  - self-employed people, sole proprietors and partners;
  - most foreign workers;
  - a domestic worker employed by a close relative (for example, a sister employing her brother as a driver at home).
- **What counts as wages.** Basic pay, overtime, commission and most allowances count, even if they vary from month to month. An annual bonus, travel claims and employer EPF don't. See section 2.1.
- **Starting late.** If you start your first EIS-covered job at age 57 or older, you are exempt. If you were already contributing before 57, you continue until 60. Everyone stops at 60.
- **2025 vs 2026 vs 2027.** The deduction is the same for all of 2025 and 2026.
  - From 1 October 2026, the *benefits* became more generous for people who lose their job on or after that date. Contributions did not change.
  - Nothing announced so far (including Budget 2027, tabled 9 Oct 2026) changes the 2027 contribution.

---

## 2. Applicability rules

Primary source: Act 800 s.2 and the **First Schedule** (persons to whom the Act does not apply), as in the AGC updated text dated 1 Sep 2022, plus the exemption order P.U.(A) 250/2021. The AGC listing of subsidiary legislation, cached to 4 Nov 2026, shows no First Schedule order and no exemption order for Act 800 after those of 31 May 2021 (see section 10). Act A1725 and Act A1796 don't touch the First Schedule.

| # | Rule | Legal basis | Confidence |
|---|------|-------------|------------|
| A1 | Applies to all industries with ≥1 employee. "Employee" means a person employed for wages under a contract of service or apprenticeship (written, oral, express or implied). This covers full-time, part-time, temporary and contract staff in the private sector. The Act doesn't name those categories; they follow from the definition, subject to First Sched. para 1 (section 2.3). There is no minimum hours, days or pay test (s.16(1): "irrespective of the amount of wages"). | s.2(1), s.3 "employee", s.16(1) | High |
| A2 | **Age floor:** excluded if the employee "has not attained the age of eighteen years". | First Sched. para 8 | High |
| A3 | **Age ceiling:** excluded if the employee "has attained the age of sixty years". This applies **even to long-time contributors**. There is no "continue after 60" path, which differs from SOCSO. Contributions also "cease when the employee attains the minimum retirement age" (60). | First Sched. para 8; s.20(2) | High |
| A4 | **Late-entry rule:** excluded if the employee "has attained the age of fifty-seven years and in respect of whom no contributions were payable under this Act before he attained the age of fifty-seven years". If *any* contribution was payable before 57, the person stays covered from 57 until 60. The test is "payable", not "paid", so an employer who failed to pay does not change the outcome. "From any employer" is a reading of the unqualified wording; no official text says it expressly. PERKESO's flyer and booklet say "never contributed", which is looser, and the Act governs. | First Sched. para 9; Employers' Circular 3/2024 para 3.6 | High |
| A5 | Excluded: "Any member of the public service of the Federation and the States" (civil servants). | First Sched. para 6 | High |
| A6 | Excluded: "Any employee of the local authority or statutory body". This covers **all** such employees, permanent or contract, not just permanent staff. | First Sched. para 7 | High |
| A7 | **Contract or temporary public-sector staff** (Contract of Service appointees in government, statutory bodies and local authorities): covered by **SOCSO (Act 4) but not EIS**. Paras 6 and 7 of the Act are not limited to permanent staff. PERKESO's ceiling FAQ of 1 Oct 2024, Q9, says: "Ya, bagi kakitangan awam yang berstatus kontrak dan sementara di bawah Akta 4. Walau bagaimanapun, kakitangan awam tidak diliputi di bawah Akta 800." The sentence says "public staff" generally but directly follows the contract and temporary sentence. On the SOCSO side, P.U.(B) 240/2013 para 2(2) carves temporary and contract staff out of the Act 4 exemption; Act 800 has no such carve-out. No JPA circular addresses EIS directly. The first-pass Crowe citation wasn't re-read (HTTP 403 in the deep pass) and is no longer needed. | First Sched. paras 6–7; PERKESO FAQ 1 Oct 2024 Q9; P.U.(B) 240/2013 | High for government staff. High on statute text for statutory-body and local-authority contract staff, where no PERKESO sentence names them. |
| A8 | **Foreign employees are excluded**, with three exceptions: (a) permanent residents (red MyPR IC, NRR 5(3)(b)); (b) people lawfully in Malaysia on a pass allowing ≥12 months' residence (exactly 12 counts) *and* holding an IC under NRR 5(3)(c) (PERKESO calls them "temporary residents", i.e. MyKAS); (c) people born in Malaysia with undetermined citizenship holding a 5(3)(c) IC. A long pass with no such IC doesn't qualify. Ordinary foreign workers on PLKS/work permits are **still excluded in 2025 and 2026**. Among PERKESO schemes they are under Act 4 only; EPF is a separate question (see `epf.md`). The 5(3)(c)-to-MyKAS link rests on a JPN statement reported in the press plus PERKESO's FAQ; NRR 5(3) itself wasn't read. | First Sched. para 10; PERKESO clarification 24 Dec 2018; PERKESO FAQ domestic workers | High |
| A9 | **Domestic workers ARE covered** from 1 Jun 2021 if they are Malaysian citizens, PRs or TRs. Para 2, which used to exclude domestic servants, was deleted by P.U.(A) 249/2021. Foreign domestic workers are not covered (A8). **Exception: see A14**, a domestic worker employed by a close relative. | P.U.(A) 249/2021; PERKESO FAQ Domestic Workers (Q6, Q7, Q9, Q11) | High |
| A10 | **Self-employed** people are not "employees" and are outside Act 800. They are covered by Act 789 (SKSPS), which is a different scheme. Gig/platform workers are self-employed for this purpose. The 2026 amendment lets PERKESO offer *employment services* (job matching) to "any person" including gig workers, but it does **not** make them contributors. The Minister said on 4 Nov 2025 that SIP has not been extended to gig workers and that PERKESO is studying feasibility: a watch item for 2027, not a rule. | s.3 "employee"; Act A1796 s.11 (Parts VIA, VIB); Sinar Harian 4 Nov 2025 | High |
| A11 | Other exclusions rarely relevant for this app: casual workers employed outside the employer's industry (para 1; see section 2.3); mineral/produce share-croppers (para 3); persons detained in prison and similar institutions (para 5). Para 4 read "The spouse of an employer" and was deleted by P.U.(A) 145/2018 from 1 Jul 2018, so a spouse employed in a business **is** covered (section 2.3). | First Sched.; original Act text; P.U.(A) 145/2018 | High |
| A12 | **Two or more employers:** each employer pays contributions separately, on the wages that employer pays. | s.19 | High |
| A13 | **Who pays what:** the employer remits both shares and deducts only the employee share from wages. Before 1 Oct 2026 this rests on the split in s.18(1), the duty to pay in reg 9(1) and arrears recovery in s.23(3); no express general deduction clause was found. From **1 Oct 2026**, the Act states it explicitly: the employer may recover the employee share only by wage deduction, and may **not** deduct or recover the employer share from the employee. PERKESO's 2025 booklet loosely says both shares are "deducted from the employee's monthly wages"; that is wrong against these provisions. | s.18(1); s.23(3); s.24(1); P.U.(A) 452/2017 reg 9(1); s.20(1A)/(1B) inserted by Act A1796 s.6 (gazetted text, verbatim the same as the Bill) | High |
| A14 | **Domestic worker employed by a close relative: exempt from the whole Act, RM0 for both shares.** Close relative means a spouse; a child; a parent, sibling or grandparent; a parent-in-law, son-in-law or daughter-in-law (all including adopted and step); or a sibling-in-law. This covers only "domestic employee" work in a private home. The same relative employed in the family shop is covered (section 2.3). In force 1 Jun 2021, gazetted the same day as P.U.(A) 249/2021. The order's other limbs concern foreign domestic employees, who para 10 already excludes. | P.U.(A) 250/2021 para 2(1)(a), 2(3)(a), 2(3)(c), made under s.83(b); PERKESO FAQ Domestic Workers Q4 (worded around SOCSO) | High |

**PERKESO's own web copy is inconsistent. Treat the Act as authoritative.**
- PERKESO's *Contributions* page (re-fetched 2026-11-05) still says "Government employees, domestic workers and the self-employed are exempt". As a general statement, the domestic-worker part has been wrong since 1 Jun 2021; only the close-relative case in A14 is exempt.
- A 2024 PERKESO briefing deck (hosted by MBSJ) says EIS excludes people who first contribute at "55". The Act says 57, and so do PERKESO's SIP flyer (Feb 2024), its 2025 booklet, its induction notes and Employers' Circular 3/2024 para 3.6. The deck is wrong for EIS. That it was copied from the SOCSO column is my inference; the deck doesn't show it.
- PERKESO's Contributions page also calls the cap an "assumed monthly salary of RM6,000". The Act's top assumed wage is RM5,950; RM6,000 is the wage ceiling.

### 2.1 Which wages count (s.3 "wages")

"All remunerations payable in money by an employer to an employee", **including** payments for leave, holidays, overtime and extra work on holidays.

**Excluded:**

| Code | Excluded item |
|---|---|
| (a) | Employer contributions to any pension, social security or provident fund (e.g. the employer's EPF share) |
| (b) | Any travelling allowance or the value of any travelling concession |
| (c) | Sums paid to cover special expenses incurred because of the employment (reimbursements) |
| (d) | Gratuity on discharge or retirement |
| (e) | **Any annual bonus** |
| (f) | Any benefit under another law administered by PERKESO |
| (g) | Any other remuneration as prescribed. No instrument prescribing anything was found: the listed Act 800 instruments were screened by title, and P.U.(A) 452/2017 and 252/2018 were read. It adds no exclusion today. |

A1725 and A1796 don't change this definition (A1796 s.4 changes only other definitions in s.3), so it is the same for 2025, 2026 and the 2027 template.

- **Monthly wages** for the table means "the wages payable to an employee in respect of any wage period ending in the month" (Second Schedule para 1). Section 3.3 explains how to assemble them.
- **PERKESO's own list** (correcting the first pass, which called this a vendor reading):
  - **Count:** salary, overtime, commission and service charge, leave and holiday pay, and "allowances such as incentives, shift, food/meal, cost of living, housing and etc". There is **no limit to fixed allowances**, so variable shift and incentive allowances count.
  - **Don't count:** employer payments to statutory funds, travelling claims, gratuity or payments for dismissal or retrenchment, and annual bonus.
  - **Where it comes from:** 2025 booklet p.8. The list sits in the booklet's Act 4 chapter. It reaches EIS through Employers' Circular 3/2017 para 5 ("Definisi 'Gaji' adalah sama seperti" Act 4) and the induction notes' single wage row for both Acts. It is guidance; the Act governs.
- **Effect of the correction:** RM3,000 basic + a variable RM500 shift allowance is RM3,500, item 39, RM6.90. Counting fixed allowances only would give RM5.90, RM1.00 a month too low for each party.

**Three wording conflicts, and how they resolve:**

1. **"Annual bonus" vs plain "bonus".** The induction slide says "bonus", but the Act, Circular 3/2017 and the booklet all say *annual* bonus. A one-line slide can't amend the Act. **Don't implement "all bonuses out"** (High). Some payrolls may still follow the slide, so payslips can differ.
2. **"Travelling allowance" (Act) vs "travelling claims" (booklet).** The Act's wider words should govern, and Circular 3/2017 repeats them (medium-high on the words, medium on the outcome). India's Supreme Court, on identical words, held that a fixed monthly conveyance allowance is excluded (*ESIC v Texmo Industries*, 8 Mar 2021; persuasive only, and I found no Malaysian decision adopting it). Against that, a PERKESO Threads post of 7 Feb 2026 counts "elaun pengangkutan" (not re-read in this revision), and vendors split. The default is an owner decision: see [Questions for the owner](#questions-for-the-owner).
3. **"Dismissal/retrenchment payments".** I found no express statutory basis. s.3(d) names only gratuity on discharge or retirement, and Circular 3/2017 repeats that. This is PERKESO's administrative position: follow it, and label it as practice (medium).

**Classification for the wage breakdown** (data: `wageComponents` in the data file). Most rows below "high" are my reading. No PERKESO item-level ruling or Malaysian decision was found for them, and CLJ/MLJ law reports weren't available, so "none found" doesn't mean none exists.

| Item | EIS wages? | Confidence |
|---|---|---|
| Basic, overtime, leave and holiday pay | Yes | High |
| Commission; service charge paid by the employer | Yes | High |
| Meal, housing, shift, cost-of-living, incentive allowances (fixed or variable) | Yes | High |
| Quarterly, half-yearly or monthly bonus or incentive | Yes | Medium-high |
| Leave encashment on resignation | Yes | Medium |
| Fixed phone allowance | Yes, unless it truly repays work phone costs | Medium |
| Sign-on bonus | Yes on the literal text | Low |
| Annual bonus, including annual performance bonus | No | High |
| 13th-month or AWS paid once a year | No | Medium-low |
| Festive bonus paid once a year | No (a second once-a-year payment on top of a year-end bonus is unresolved) | Low-medium |
| Trip, mileage, toll and parking claims; reimbursements | No | High |
| Gratuity; benefits in kind, including a company car | No | High |
| Retrenchment or termination payments | No (PERKESO practice) | Medium |
| Payment in lieu of notice (notice actually worked counts) | No | Medium |
| Tips paid directly by customers | No | Medium |
| Fixed monthly travel, transport, petrol, toll, car or parking allowance | **Owner decision** | Medium; low for parking, medium-low for car |
| Ex-gratia; incentive paid once a year; half-year instalment of one annual bonus | **Unresolved**: flag in the UI | Low |

**EIS wages are not EPF wages**, so keep the wage bases separate (per `epf.md` and gap G2):

| Item | EIS | EPF |
|---|---|---|
| Annual bonus | No | Yes |
| Overtime | Yes | No |
| Service charge | Yes | No |

**Money at stake** (employee share; the employer pays the same):

| Case | Effect |
|---|---|
| RM3,000 + RM500 fixed travel allowance | RM5.90 vs RM6.90: RM1.00 a month, RM12 a year |
| RM3,500 + RM500 quarterly bonus | RM6.90 vs RM7.90 in that month only: RM4 a year |
| RM5,800 + RM500 | RM11.50 vs RM11.90 |
| RM6,000 or more | No change |

The wage base also moves the assumed wage used for benefits: RM2,950 vs RM3,450 in the first case, up to RM1,350 of Job Search Allowance over six months if it holds across the whole average.

### 2.2 Rates over time

| Period | Rule | Source |
|---|---|---|
| 1 Jan 2018 – 31 Aug 2022 | Table, ceiling RM4,000 | Act 800 original |
| 1 Sep 2022 – 30 Sep 2024 | Same table extended, ceiling RM5,000, max RM9.90 each | Act A1657 |
| **1 Oct 2024 – present** | Table items 1–65, ceiling **RM6,000**, max **RM11.90** each. Employers had a no-penalty transition from 1 Oct 2024 to 31 Mar 2025; the amounts did not differ. | Act A1725 (Royal Assent 11 Sep 2024, gazetted 25 Sep 2024); P.U.(B) 382/2024 (dated 27 Sep 2024, gazetted 30 Sep 2024) appoints 1 Oct 2024; Employers' Circular 3/2024; PERKESO FAQ 1 Oct 2024 Q6–Q7 |
| 1 Oct 2026 | **No contribution change.** Benefits enhanced for job loss from this date; Act renamed "Employment Insurance System and Employment Services Act 2017" | Act A1796 (Royal Assent 30 Aug 2026, gazetted 15 Sep 2026), P.U.(B) 391/2026 (dated 25 Sep 2026, gazetted 30 Sep 2026) |
| 2 Jan 2027 | s.11 of A1796 (employer vacancy notification, ss.45A–45H) in force. **No contribution change.** | P.U.(B) 391/2026 |

The nominal rate has been 0.2 % employer + 0.2 % employee throughout 2025 and 2026. The gazetted A1796 amends the long title, ss.1, 3, 8, 20, 36, 44, 45, 47, 59, 67 and the **Third** Schedule, and inserts s.37A, Parts VIA–VIB (ss.45A–H) and ss.81A–B. It does not touch s.16 (ceiling), s.18 (contributions), or the First, Second or Fourth Schedule. Compared with the Bill as tabled, only the short-title year and the s.45F fine differ. The cached AGC listings show no Second Schedule order. PERKESO-relayed coverage (ecentral.my) also states "Kadar caruman bulanan SIP kekal sama", i.e. the monthly SIP contribution rate stays the same.

### 2.3 Special worker types (gap G1)

Act 800 has no category for directors, interns or posted staff. Coverage turns on s.3 "employee", minus the First Schedule and any exemption order. Where a row says "inference", no PERKESO statement or court decision was found (open web only; CLJ/MLJ weren't available).

| Case | EIS result | Confidence and basis |
|---|---|---|
| **Salaried company director** | Covered, normal table. Only salary under a contract of service counts. | Medium. Inference from s.3 "employee" and "wages"; a vendor page (Talenox) exempts director fees. |
| **Director paid fees only** | 0/0 | Medium. Same basis. |
| **Sole proprietor or partner** | 0/0. Act 789 gives no job-loss equivalent. | High in result. No contract of service with himself; booklet excludes self-employed from Act 800. LLP members not checked. |
| **Spouse or relative in the family business**, under a contract of service | Covered, normal table. Para 4 ("the spouse of an employer") was deleted from 1 Jul 2018, and other relatives were never excluded. | High. Original Act text; P.U.(A) 145/2018; induction notes list "Suami/Isteri kepada pemilik tunggal/perkongsian" as eligible. |
| **Same relative as a household helper** | 0/0 (A14) | High. P.U.(A) 250/2021. |
| **Apprentice** | Covered. Named in s.3. An "allowance" label doesn't take them out. | High. s.3; PERKESO Program Perantisan FAQ (31 Dec 2020; programme closed). |
| **Paid intern on an employment contract** | Covered, normal table. No minimum wage in Act 800. Under 18: 0/0. | Medium. s.3; inference. |
| **Student on industrial training paid only an allowance** | **Unresolved.** Evidence leans against automatic coverage, but there is no ruling. | Low. PERKESO FAQ treats such students separately; Bernama 15 Jan 2026 reports "kecuali pelajar" (read through a summarising fetch). |
| **Part-time, weekend, event staff serving the business** | Covered. Para 1 needs *both* casual work *and* work outside the employer's industry, and "industry" is wide. | High on the text; no PERKESO test. Illustrations are mine. |
| **One-off helper outside the business** (a shop owner's house painter) | May be excluded under para 1. A one-off helper at a non-events company's dinner is grey. | Medium-low. No hours or duration threshold exists. |
| **Genuine contract *for* service** | Outside the Act | Medium. An Act 4 High Court appeal, press report only. |
| **Posted overseas on a Malaysian contract** | Likely covered | Low-medium. Inference. Act 800 lacks Act 4's "or elsewhere". |
| **Settled abroad, or hired by a foreign host** | Probably not covered | Low-medium. Domestic FAQ Q34 is the only Act 800 statement, for a different case. |
| **Malaysian in Malaysia employed by a foreign company with no local entity** | **Unresolved.** On the text probably within the Act; in practice often not contributing. With an employer of record, the normal table applies. | Low. Deloitte article 2021 on SOCSO/EPF only. |
| **Embassy or international organisation staff** | **Unresolved.** No PERKESO statement. | Low. Vienna Convention art.33 and *AIBD* summary only; Act 636 not read. |
| **Foreign national seconded into Malaysia** | 0/0 unless PR or 5(3)(c) IC holder (A8) | High. Para 10. |
| **GLC or subsidiary of a statutory body; private university** | Covered. Companies-Act bodies aren't statutory bodies. | Medium. Act 240 s.2 analogy. Transition to the Companies Act 2016 not read. |
| **Body created by its own Act (EPF, Bank Negara, MARA and so on), permanent or contract** | 0/0 (para 7) | High on para 7. Which bodies qualify rests on the Act 240 analogy. |
| **Public university staff, permanent or contract** | Probably 0/0. Check the individual institution. | Low-medium, `unverified`. Created under statute; constituting Acts not read and no PERKESO statement found. IIUM's status not confirmed. |

**"Statutory body" has no definition in Act 800**, and I found no PERKESO list or test. The best analogy is Act 240 s.2: a body corporate incorporated under federal law that is a public authority or government agency, excluding local authorities and Companies Act companies. A court could read Act 800 differently. State-enactment bodies are treated the same way by inference.

**Helper text idea:** "Created by its own Act of Parliament or State law? Choose statutory body. Registered with SSM as Sdn Bhd or Bhd? Choose private, even if government-owned."

**EIS and SOCSO diverge, so one dropdown must not assume one answer for both:**
- expatriates (EIS excludes them under para 10);
- statutory-body contract staff (EIS no, SOCSO yes under P.U.(B) 239/2013);
- under-18s (EIS no);
- overseas work (the Acts use different words).

**Translation trap:** the BM text of para 1 says "bersifat sambilan", and PERKESO also uses "sambilan" for covered part-timers. In BM copy, don't use "sambilan" alone to mean excluded.

---

## 3. Exact algorithm

The **Second Schedule table is the law**. Implement a table lookup, not a percentage.

```
input: monthlyWagesRm  (total EIS wages from ONE employer for all wage periods ending
                        in the contribution month, across all payroll runs; see 2.1, 3.3)
       age             (completed years)
       hadEisContributionsBefore57: boolean   (only asked when 57 <= age < 60)
       employmentType, residency
       employerIsCloseRelative: boolean        (only asked for domestic-worker)
       contributionMonth  'YYYY-MM'  (picks the table and eligibility, see section 5)

1. If employmentType ∉ {private-employee, domestic-worker}   -> not applicable
   (reason: excluded-employment for civil-servant, statutory-body/local-authority incl. contract
    staff, public-sector contract, self-employed/gig;
    reason: no-contract-of-service for director-fees-only, sole proprietor, partner)
1a. If domestic-worker and employerIsCloseRelative            -> not applicable (reason: domestic-close-relative)
2. If residency ∉ {citizen, permanent-resident, mykas-resident} -> not applicable (reason: foreign-worker)
3. If age < 18                                                -> not applicable (reason: under-18)
4. If age >= 60                                               -> not applicable (reason: age-60-plus)
5. If age >= 57 and not hadEisContributionsBefore57           -> not applicable (reason: first-time-57-plus)
6. If no wages are payable for the month                      -> 0 / 0 (reasoned proposal from s.20(1), not an
   official rule; wages owed but unpaid ARE payable, so this doesn't cover them)
   There is no floor and no pro-rating of the band: look up the actual part-month wage.
7. band = first row in period.table.bands (ascending) where
          wageNotExceedsRm == null  OR  monthlyWagesRm <= wageNotExceedsRm
   (equivalently wageExceedsRm < W <= wageNotExceedsRm)
8. employee = band.employeeSen / 100 ; employer = band.employerSen / 100
9. Annual = sum of monthly lookups (12 × monthly for a flat salary). Do not count an annual bonus.
   A non-annual bonus changes only its own month. With multiple employers, run steps 6–8 per
   employer and add up (s.19).
```

Cases in section 2.3 marked unresolved or `unverified` use the normal path, with `coverageUnverified` set so the UI can say "check your payslip". Which default they get is an owner decision.

- **Boundaries.** Band edges are "exceed X but not exceed Y". RM5,000.00 is in item 54 (RM9.90). RM5,000.01 is in item 55 (RM10.10).
- **Ceiling.** Any wage above RM5,900 lands on RM11.90.
- **Rounding.** There is no rounding of the input wage. Compare the exact sen value. Amounts are stored as integer sen.

### 3.1 Generating rule (derived; use only for verification)

Each share equals **0.2 % of the band's "assumed monthly wage", rounded up to the next 5 sen**. The assumed monthly wage is the Third Schedule para 8 figure:
- it is the band midpoint for items 2–64 (RM5,950 is item 64's true midpoint);
- it is RM20 for item 1 (midpoint RM15);
- it is RM5,950 for open-ended item 65, the same as item 64.

For items 7–65, 0.2 % × midpoint is already a multiple of 10 sen, so no rounding happens. For example, the 900–1,000 band has midpoint 950, and 0.2 % × 950 = RM1.90.

Rounding only matters for items 1–6:

| Item | Band | Assumed wage | 0.2 % | Table |
|---|---|---|---|---|
| 1 | ≤30 | 20 | 4 sen | 5 sen |
| 2 | 30–50 | 40 | 8 sen | 10 sen |
| 3 | 50–70 | 60 | 12 sen | 15 sen |
| 4 | 70–100 | 85 | 17 sen | 20 sen |
| 5 | 100–140 | 120 | 24 sen | 25 sen |
| 6 | 140–200 | 170 | 34 sen | 35 sen |

Two alternative rules fail:
- Rounding to the *nearest* 5 sen gives 10 sen for item 3 and 15 sen for item 4, which does not match the table.
- Using 0.2 % of the band's *upper* limit gives 6 sen for item 1, which does not match.

I checked the "ceil-to-5-sen of 0.2 % × assumed wage" rule programmatically against all 65 rows: **0 mismatches**.

**Pitfall:** 0.2 % of the *actual* wage is **wrong**.
- RM1,700 gives RM3.40, but the table says **RM3.30**. A May 2026 Utusan article makes exactly this mistake.
- RM8,000 gives RM16.00, but the table says **RM11.90**.

### 3.2 How the table was verified

1. **Act text.** I parsed items 1–55 programmatically from the AGC updated text of Act 800 (as at 1 Sep 2022, Second Schedule para 2). Then I applied Act A1725 s.3, which replaces item 55 and inserts items 56–65. The result is 65 rows. For every row I checked that employer = employee, that total = 2 × share, and that the bands are contiguous.
2. **PERKESO's published table.** I compared every row against PERKESO's "Rate of Contribution Employment Insurance System (Act 800)" (`151124-Rate Contribution ACT 800.pdf`, four embedded images), transcribed by eye. All 65 rows match.
3. **Third Schedule.** I cross-checked against Third Schedule para 8 (assumed monthly wages), taking items 1–54 from the 2022 text and items 55–65 from A1725 s.4. Each row's total contribution matches the Second Schedule.
4. **Old code.** I compared the old app's `EIS_BANDS` + `lookupBand` with the new table at **every sen from RM0.01 to RM10,000.00**. The amounts are identical. The old code merges items 64 and 65 into one open-ended band, which is functionally the same. (At RM0.00 the old code gives RM0.05: see D6.)
5. **Deep pass.** Three independent checks re-parsed both Schedules from the Act texts and found 0 mismatches against the data file. They also re-read PERKESO's table images. Employers' Circular 3/2024, Lampiran 1, separately confirms items 57–65.

### 3.3 How a month's wages are assembled (gap G3)

**Rule:** add up all EIS wages from one employer whose wage period ended in that calendar month, and look up the band **once**. Wages tied to an earlier wage period go back to that earlier month and are looked up there.

This is a reading of the statute backed by how PERKESO's filing system works. I found no PERKESO statement or court decision that says it outright for arrears. The text behind it:
- s.18(2) bases rates on monthly wages, and s.20(1) charges a contribution "every month for the wages payable to the employee for that month";
- Second Schedule para 1 ties monthly wages to the wage period ending in the month;
- P.U.(A) 452/2017 reg 12 has one schedule per calendar month, with "an additional contribution schedule" for any deficiency;
- PERKESO's filing format has one contribution month and one salary per record;
- its arrears function is entered "for respective contribution month";
- Circular 2/2022 para 3.3 treats the contribution month as the wage month. EPF labels this differently, so don't share the label between schemes.

| Situation | Treatment | Confidence |
|---|---|---|
| Backdated increment or wages owed for named past months | Each earlier month is re-looked up on its corrected total, with that month's table and eligibility. Payslips may still show a lump in the paid month. | Medium-high |
| Late overtime or commission | Use the item's own wage period. A quarterly commission has one lookup at quarter end. Overtime with a 16 Jan–15 Feb cut-off falls in February. Many payrolls probably just use the paid month (my expectation; not sourced). | Medium |
| Several weekly or fortnightly periods ending in one month | Add them and look up once. "Any wage period" is arguable on its own words, but the monthly table, the ceiling "a month" and the one-salary record point this way. No PERKESO worked example exists. | Medium-high |
| Wage period straddling two months | The whole period goes to the month it ends in, with no apportioning. 26 Jan–25 Feb is all February. | Medium-high |
| Part-month joiner or leaver, unpaid leave | Look up the actual wage on the normal table. No floor and no pro-rating. EPF does have a minimum floor, so this differs. | Medium-high |
| Separate payroll run in the same month | Aggregate before the lookup. Whether ASSIST 2.0 accepts two records wasn't checked. | Medium-high |
| Final pay | Goes to the wage period it relates to. June pay paid on 7 July is June. | Medium-high |
| Arrears for a month before 60, paid after 60 | Still contributable. Current wages after 60 carry no EIS. The same logic at 18: arrears for a month before 18 carry nothing. | Medium (inference) |

**Worked figures** (employee share; employer the same):

| Case | Method A | Method B | Difference |
|---|---|---|---|
| Raise RM3,000→RM3,300 with 6 months' arrears | Month earned: RM6.50 + 6 × RM0.60 = RM10.10 | Lumped on RM5,100: RM10.10 | None |
| Raise RM5,000→RM5,300 with 6 months' arrears | Month earned: RM10.50 + 6 × RM0.60 = RM14.10 | Lumped on RM7,100: RM11.90 | Lump RM2.20 lower |
| Raise RM5,800→RM6,100 with 6 months' arrears | Month earned: RM11.90 + 6 × RM0.40 = RM14.30 | Lumped on RM7,900: RM11.90 | Lump RM2.40 lower |
| RM700 a week, four-week month | One lookup on RM2,800: RM5.50 | Four lookups: RM5.20 | Split RM0.30 lower |
| RM700 a week, five-week month | One lookup on RM3,500: RM6.90 | Five lookups: RM6.50 | Split RM0.40 lower |
| RM1,600 a week, four-week month | One lookup on RM6,400: RM11.90 | Four lookups: RM12.40 | Split RM0.50 higher |
| Runs of RM5,500 + RM1,500 | One lookup on RM7,000: RM11.90 | Two lookups: RM13.80 | Split RM1.90 higher |
| Runs of RM3,000 + RM1,000 | One lookup on RM4,000: RM7.90 | Two lookups: RM7.80 | Split RM0.10 lower |

- Below the cap, the methods barely differ because the bands are linear. They diverge once a lump crosses RM6,000.
- Splitting a weekly wage undercharges below the cap and overcharges near it, contrary to the deep-pass critic's assumption.
- **Don't average weekly pay.** RM700 a week with 8 four-week and 4 five-week months gives RM71.60 a year. Twelve lookups of the RM3,033.33 average give RM73.20; 52 split lookups give RM67.60.
- **Part month:** RM2,900 a month, 20 of 30 days, is RM1,933.33, which gives RM3.90 instead of RM5.70.
- **Arrears at 60:** RM4,000→RM4,300 for the last six months before 60 gives RM3.60 from each party.
- **Recovery:** s.23(3) lets the employer recover the employee share of arrears for not more than six months. From 1 Oct 2026, s.20(1A) allows recovery only by wage deduction. Whether 6 % late interest (reg 10, RM5 minimum) applies to an increment awarded later wasn't established.
- **Arrears before 1 Oct 2024** use the older table even if paid later: RM5,800 for Sep 2024 is RM9.90. Those older tables aren't in the config.

---

## 4. Per-year config

Both years reference one table, `eis-act800-sched2-2024-10` (the [`data/eis-2025.json`](data/eis-2025.json) file). It is in force from 2024-10-01 with no end date. October 2024 wages already use it (Circular 3/2024 para 3.3), so a period is chosen by wage month. A wage period straddling 1 Oct 2024 uses the new table as a whole (my inference from para 1).

**Benefit parameters key on the date of job loss, not on the calendar periods below.** Someone who lost their job before 1 Oct 2026 and is still claiming in October stays on the old rates, on PERKESO's reading (section 8).

### 4.1 Financial year 2025 — status: confirmed

| Period | Contribution table | Eligibility | Benefit parameters (educational) |
|---|---|---|---|
| 2025-01-01 → 2025-12-31 | `eis-act800-sched2-2024-10` (ceiling RM6,000, max RM11.90 + RM11.90) | Section 2 rules | Job Search Allowance (JSA/EMP) 80/50/40/40/30/30 % of assumed monthly wage. Early re-employment allowance 25 % of unpaid JSA. Training allowance 25 % of assumed wage per day, min RM10, max RM20/day. Training fee max RM4,000. Reduced income allowance (RIA/EPB) as JSA. |

No mid-year change in 2025. I found no 2025 amendment in force, and the Bill tabled 4 Nov 2025 only took effect in 2026. The employer no-penalty transition ended on 31 Mar 2025; the amounts weren't affected, so no config split is needed.

### 4.2 Financial year 2026 — status: confirmed

| Period | Contribution table | Eligibility | Benefit parameters |
|---|---|---|---|
| 2026-01-01 → 2026-09-30 | `eis-act800-sched2-2024-10` | Section 2 rules | Same as 2025 |
| 2026-10-01 → 2026-12-31 | `eis-act800-sched2-2024-10` (**unchanged**) | Section 2 rules (unchanged). New s.20(1A)/(1B) forbids passing the employer share to the employee. | For **job loss on or after 1 Oct 2026**: early re-employment allowance **50 %** of unpaid JSA. Training allowance flat **RM30/day**. Training fee max **RM7,000**. New **mobility assistance allowance RM1,000** (lump sum, with PERKESO's own conditions, including the 100 km test: section 8). JSA rates unchanged. Job loss before that date stays on the 2025 values. |

The split exists only for legal metadata (Act name, s.20(1A)/(1B)). Deductions are identical across both periods, so the engine can treat them as one contribution period.

### 4.3 Financial year 2027 — status: **template / unconfirmed**

| Period | Contribution table | Status |
|---|---|---|
| 2027-01-01 → (open) | `eis-act800-sched2-2024-10` carried forward | **UNCONFIRMED.** Nothing announced changes it. The Budget 2027 speech (9 Oct 2026) has no EIS/SIP measure. Its PERKESO items are SOCSO matching incentives for gig workers, Tabung Haji paying SOCSO for imams and others, and tax relief extended to Lindung Kendiri, which belong to the PCB and SOCSO research. |

- The only known 2027 change is A1796 s.11, in force 2 Jan 2027. It is the employer duty to notify PERKESO of vacancies, with fines up to RM1,000 / RM3,000 / RM5,000 after the Senate amendment (s.45F(4) in the gazetted Act), and it has no payroll effect. A Dec 2025 report quoting PERKESO, before enactment, spoke of a moratorium of up to two years on enforcing it.
- The RM2,000 minimum wage reported for June 2027 moves some workers to a different band; the table stays the same.
- Re-check in Q4 2026 and Q1 2027 for:
  - a Second Schedule revision (s.18(3) lets the Minister revise rates) or a ceiling amendment;
  - a First Schedule order (s.84) or exemption order (s.83);
  - a change to the minimum retirement age (Act 753 s.4(2)). s.20(2) would follow it, but para 8 hard-codes 60. Raising it to 65 was still a proposal as of Oct 2026;
  - the outcome of PERKESO's gig-worker feasibility study.

### 4.4 Config sketch (JSON-ish)

```jsonc
{
  "scheme": "EIS",
  "years": {
    "2025": { "status": "confirmed", "periods": [
      { "from": "2025-01-01", "to": "2025-12-31", "tableId": "eis-act800-sched2-2024-10",
        "eligibility": "eis-elig-v1", "benefits": "eis-benefits-2018" } ] },
    "2026": { "status": "confirmed", "periods": [
      { "from": "2026-01-01", "to": "2026-09-30", "tableId": "eis-act800-sched2-2024-10",
        "eligibility": "eis-elig-v1", "benefits": "eis-benefits-2018" },
      { "from": "2026-10-01", "to": "2026-12-31", "tableId": "eis-act800-sched2-2024-10",
        "eligibility": "eis-elig-v1", "benefits": "eis-benefits-2026-10" } ] },
    "2027": { "status": "unconfirmed-carried-forward", "periods": [
      { "from": "2027-01-01", "to": null, "tableId": "eis-act800-sched2-2024-10",
        "eligibility": "eis-elig-v1", "benefits": "eis-benefits-2026-10",
        "notes": ["No 2027 change announced as of 2026-11-05; Budget 2027 silent on EIS."] } ] }
  },
  "eligibilityRules": {
    "eis-elig-v1": { "minAge": 18, "maxAgeExclusive": 60, "lateEntryAge": 57,
      "coveredEmployment": ["private-employee", "domestic-worker"],
      "coveredResidency": ["citizen", "permanent-resident", "mykas-resident"],
      "exemptions": ["domestic-close-relative", "no-contract-of-service"],
      "ageBoundaryBasis": "unconfirmed" }
  },
  "benefitParams": {
    "eis-benefits-2018":    { "appliesToLossOfEmployment": { "before": "2026-10-01" } },
    "eis-benefits-2026-10": { "appliesToLossOfEmployment": { "onOrAfter": "2026-10-01" } }
  }
}
```

The full version is in [`data/eis-2025.json`](data/eis-2025.json) (`years`, `eligibilityRules`, `benefitParams`, `wageComponents`). The `benefits` field on a period is the default for explainer copy; a benefit estimate must choose by job-loss date.

---

## 5. Proposed TypeScript config schema

```ts
/** ISO date, inclusive. */
type IsoDate = string;

type ConfigStatus =
  | 'confirmed'                    // backed by gazetted law in force
  | 'announced'                    // gazetted/announced but not yet in force
  | 'unconfirmed-carried-forward'; // copied from prior year; nothing announced

type EisEmploymentType =
  | 'private-employee'        // incl. part-time, contract, probation, apprentice
  | 'domestic-worker'         // covered since 2021-06-01 if citizen/PR/TR
  | 'civil-servant'           // First Sched. para 6
  | 'statutory-or-local-authority' // First Sched. para 7 (incl. contract staff)
  | 'public-sector-contract'  // COS appointees: SOCSO yes, EIS no
  | 'self-employed'           // incl. gig/platform
  | 'director-fees-only'      // no contract of service; salaried directors use private-employee
  | 'sole-proprietor-or-partner';

type EisResidency =
  | 'citizen'
  | 'permanent-resident'      // First Sched. para 10(a)
  | 'mykas-resident'          // para 10(b)/(c): 5(3)(c) IC holders
  | 'foreign-worker';         // excluded

interface EisBand {
  item: number;                    // Second Schedule item number
  wageExceedsRm: number;           // lower bound, exclusive (0 for item 1)
  wageNotExceedsRm: number | null; // upper bound, inclusive; null = open-ended
  employerSen: number;
  employeeSen: number;
  totalSen: number;
  assumedMonthlyWageRm: number;    // Third Schedule para 8 (used for benefits)
}

interface EisContributionTable {
  id: string;                      // e.g. 'eis-act800-sched2-2024-10'
  effectiveFrom: IsoDate;
  effectiveTo: IsoDate | null;
  legalBasis: string[];
  wageCeilingRm: number;           // 6000
  bands: EisBand[];                // ascending, contiguous
}

interface EisEligibilityRules {
  id: string;
  minAgeInclusive: number;         // 18
  maxAgeExclusive: number;         // 60  (applies to continuing contributors too)
  lateEntryAge: number;            // 57  (no contributions payable before this => excluded)
  coveredEmployment: EisEmploymentType[];
  coveredResidency: EisResidency[];
  exemptions: { id: 'domestic-close-relative' | 'no-contract-of-service'; basis: string }[];
  ageBoundaryBasis: 'unconfirmed' | 'month-after-birthday' | 'age-at-wage-period-end';
}

/** One classification, year-independent, shared in shape with SOCSO and EPF. Replaces the old
 *  excludedWageComponents list, which could not express "unresolved" or a pending decision. */
interface EisWageComponent {
  id: string;
  label: string;
  eis: 'counted' | 'excluded' | 'pending-owner-decision' | 'unresolved';
  confidence: string;
  basis: string;
}

interface EisBenefitParams {       // educational only; never used for deductions
  id: string;
  appliesToLossOfEmployment: { before?: IsoDate; onOrAfter?: IsoDate }; // keyed on job-loss date
  jobSearchAllowancePctByMonth: number[];   // [0.8, 0.5, 0.4, 0.4, 0.3, 0.3]
  earlyReemploymentPctOfUnpaidJsa: number;  // 0.25 -> 0.5 from 2026-10-01
  trainingAllowance: { kind: 'pct-of-assumed-daily'; pct: number; minRmPerDay: number; maxRmPerDay: number }
                   | { kind: 'flat'; rmPerDay: number };
  trainingFeeMaxRm: number;        // 4000 -> 7000
  mobilityAllowanceRm: number | null; // null -> 1000
  mobilityConditions?: { distance: string; reportForDutyWithinMonths: number;
    applyWithinDaysOfReporting: number; withinMalaysiaOnly: boolean;
    notForReducedIncomeAllowanceRecipients: boolean };
  assumedWageCapRm: number;        // 5950
  firstClaimQualifying: { monthsContributed: number; eligibilityPeriodMonths: number;
    includesMonthOfLoss: boolean }; // 12 in 24, including the month of job loss
}

interface EisPeriod {
  effectiveFrom: IsoDate;
  effectiveTo: IsoDate | null;
  contributionTableId: string;
  eligibilityRulesId: string;
  benefitParamsId: string;
  status: ConfigStatus;
  sources: { title: string; url: string; accessed: IsoDate }[];
  notes?: string[];
}

interface EisYearConfig {
  financialYear: number;
  status: ConfigStatus;            // worst status of its periods
  periods: EisPeriod[];            // non-overlapping, cover Jan 1..Dec 31 (last may be open)
}

interface EisInput {
  monthlyWagesRm: number;          // total EIS wages from this employer for all wage periods
                                   // ending in contributionMonth, across all runs (2.1, 3.3)
  age: number;
  hadEisContributionsBefore57?: boolean; // ask only if 57 <= age < 60; default true
  employmentType: EisEmploymentType;
  employerIsCloseRelative?: boolean;     // ask only for domestic-worker; default false
  residency: EisResidency;
  contributionMonth: string;       // 'YYYY-MM'; picks the table and eligibility. Not payment date.
}

type EisExemptReason =
  | 'excluded-employment' | 'foreign-worker' | 'under-18'
  | 'age-60-plus' | 'first-time-57-plus'
  | 'domestic-close-relative' | 'no-contract-of-service';

interface EisResult {
  applicable: boolean;
  exemptReason: EisExemptReason | null;
  bandItem: number | null;
  employeeSen: number;
  employerSen: number;
  periodStatus: ConfigStatus;      // surface "unconfirmed" in UI for 2027
  coverageUnverified?: { reason: string }; // UI: "check your payslip" (section 2.3)
}
```

Notes:
- Tables are referenced by `id`, so 2025, 2026 and 2027 share one table without copying it.
- Store money as integer sen.
- Period resolution: pick the period containing the first day of `contributionMonth`. For an annual view, compute month by month and sum. The old mid-month `asOf` idea is dropped, because a wage period belongs to the month it ends in.
- No required pay-frequency input. Help text: "Weekly or fortnightly paid? Add up every pay period that ended this month." Never use a 52/12 average.
- A per-month wage override in the month-by-month view covers part months, unpaid leave and 4- or 5-week months.
- If an arrears input is ever added, use `arrears: [{earnedMonth, extraWagesRm}]`. For each entry, delta = lookup(original + extra, with that month's table and eligibility) minus lookup(original). Attribute the delta to `earnedMonth` for totals and show the deduction in the paid month's take-home.
- If birth month is ever added, set `ageBoundaryBasis` on the rule, not per year.

---

## 6. Worked examples

All figures come from the official table in [`data/eis-2025.json`](data/eis-2025.json). They are identical for 2025, 2026 and the 2027 template. Each example assumes:
- a private-sector employee who is a citizen;
- one employer;
- wage = EIS wages for the month.

| # | Monthly wage | Age / history | Band (item) | Employee | Employer | Total | Check vs official table |
|---|---|---|---|---|---|---|---|
| 1 | RM1,000.00 | 30 | 900 < W ≤ 1,000 (14) | **RM1.90** | **RM1.90** | RM3.80 | Row 14: RM1.90 / RM1.90 / RM3.80 ✔ |
| 2 | RM1,700.00 | 25 | 1,600 < W ≤ 1,700 (21) | **RM3.30** | **RM3.30** | RM6.60 | Row 21 ✔. A straight 0.2 % gives RM3.40, which is wrong. |
| 3 | RM2,500.00 | 30 | 2,400 < W ≤ 2,500 (29) | **RM4.90** | **RM4.90** | RM9.80 | Row 29 ✔ |
| 4 | RM4,999.99 | 30 | 4,900 < W ≤ 5,000 (54) | **RM9.90** | **RM9.90** | RM19.80 | Row 54 ✔ |
| 5 | RM5,000.00 | 30 | 4,900 < W ≤ 5,000 (54) | **RM9.90** | **RM9.90** | RM19.80 | Row 54 ✔ (upper bound inclusive) |
| 6 | RM5,000.01 | 30 | 5,000 < W ≤ 5,100 (55) | **RM10.10** | **RM10.10** | RM20.20 | Row 55 (A1725) ✔. Before 1 Oct 2024 this would have been RM9.90. |
| 7 | RM5,900.00 | 30 | 5,800 < W ≤ 5,900 (63) | **RM11.70** | **RM11.70** | RM23.40 | Row 63 ✔ |
| 8 | RM5,900.01 | 30 | 5,900 < W ≤ 6,000 (64) | **RM11.90** | **RM11.90** | RM23.80 | Row 64 ✔ |
| 9 | RM6,000.00 | 30 | 5,900 < W ≤ 6,000 (64) | **RM11.90** | **RM11.90** | RM23.80 | Row 64 ✔ |
| 10 | RM8,000.00 | 30 | > 6,000 (65) | **RM11.90** | **RM11.90** | RM23.80 | Row 65 ✔. A straight 0.2 % gives RM16.00, which is wrong. |
| 11 | RM4,000.00 | **58, first EIS job at 58** (no contributions payable before 57) | – | **RM0.00** | **RM0.00** | – | First Sched. para 9: exempt |
| 12 | RM4,000.00 | **58, contributing since age 30** | 3,900 < W ≤ 4,000 (44) | **RM7.90** | **RM7.90** | RM15.80 | Row 44 ✔ |
| 13 | RM4,000.00 | **60, contributing since age 30** | – | **RM0.00** | **RM0.00** | – | First Sched. para 8. The old code charges RM7.90 here (bug D1). |
| 14 | RM1,200.00 | **17** | – | **RM0.00** | **RM0.00** | – | First Sched. para 8 (under 18). The old code charges RM2.30. |
| 15 | RM3,000.00 | 30, **foreign worker (PLKS)** | – | **RM0.00** | **RM0.00** | – | First Sched. para 10. Act 4 SOCSO still applies. |
| 16 | RM2,000.00 | 40, **Malaysian domestic worker, employer not a close relative** | 1,900 < W ≤ 2,000 (24) | **RM3.90** | **RM3.90** | RM7.80 | Covered since 1 Jun 2021 ✔ |
| 17 | RM3,000.00 | 35, **statutory-body contract staff** | – | **RM0.00** | **RM0.00** | – | First Sched. para 7 |
| 18 | RM2,000.00 | 40, **Malaysian domestic worker employed by a sibling** | – | **RM0.00** | **RM0.00** | – | P.U.(A) 250/2021 para 2(1)(a) |
| 19 | RM2,000.00 | 40, **spouse working in the family shop** | 1,900 < W ≤ 2,000 (24) | **RM3.90** | **RM3.90** | RM7.80 | Row 24 ✔. Para 4 deleted from 1 Jul 2018. |
| 20 | RM3,500.00 | 30, RM3,000 basic + **variable RM500 shift allowance** | 3,400 < W ≤ 3,500 (39) | **RM6.90** | **RM6.90** | RM13.80 | Row 39 ✔. Counting fixed allowances only gives RM5.90, which is wrong. |
| 21 | RM3,500.00 | 30, RM3,000 basic + **RM500 annual bonus in the month** | 2,900 < W ≤ 3,000 (34) on RM3,000 | **RM5.90** | **RM5.90** | RM11.80 | Row 34 ✔. Annual bonus is excluded by s.3(e). |
| 22 | RM4,000.00 | 30, RM3,500 basic + **RM500 quarterly bonus in the month** | 3,900 < W ≤ 4,000 (44) | **RM7.90** | **RM7.90** | RM15.80 | Row 44 ✔. Medium-high confidence. Other months: RM6.90. |
| 23 | RM8,000.00 | 45, **salaried director** | > 6,000 (65) | **RM11.90** | **RM11.90** | RM23.80 | Row 65 ✔. Medium confidence. |
| 24 | RM8,000.00 | 45, **director paid fees only** | – | **RM0.00** | **RM0.00** | – | s.3. Medium confidence. |
| 25 | RM1,933.33 | 30, **part-month joiner** on RM2,900 | 1,900 < W ≤ 2,000 (24) | **RM3.90** | **RM3.90** | RM7.80 | Row 24 ✔. No pro-rating of the band. |
| 26 | RM20.00 | 30, very short engagement | ≤ 30 (1) | **RM0.05** | **RM0.05** | RM0.10 | Row 1 ✔. No floor. |
| 27 | RM0.00 | 30, **no wages payable** | – | **RM0.00** | **RM0.00** | – | s.20(1). Reasoned proposal. |
| 28 | RM2,800.00 | 30, **paid RM700 weekly, four weeks ended this month** | 2,700 < W ≤ 2,800 (32) | **RM5.50** | **RM5.50** | RM11.00 | Row 32 ✔. One lookup. Section 3.3. |
| 29 | RM7,000.00 | 30, **two payroll runs in a month**: RM5,500 + RM1,500 | > 6,000 (65) | **RM11.90** | **RM11.90** | RM23.80 | Row 65 ✔. One lookup, not RM13.80. |

**Annual example.** RM2,500 every month for all of 2026 gives 12 × RM4.90 = **RM58.80** from the employee and RM58.80 from the employer.

**Arrears, weekly-pay and averaging fixtures** are in section 3.3.

**PERKESO calculator.** The calculator is behind the ASSIST employer login and was not accessed (see section 9). The examples were checked against PERKESO's published table PDF and the Act text instead.

---

## 7. User-selectable options

Defaults are chosen so a beginner who enters only salary and age gets the correct result for the common case.

| Option | Default | Shown when | Why |
|---|---|---|---|
| **Employment type**: private employee / domestic worker / civil servant / statutory body or local authority (incl. contract) / government contract (COS) / self-employed or gig / director paid fees only / sole proprietor or partner | Private employee | Always (one dropdown shared with SOCSO/EPF) | Decides coverage (A5–A7, A9, A10, section 2.3). Statutory-body and COS staff need their own options because they behave differently for SOCSO and EIS. Add the "own Act vs SSM-registered" helper text. Part-time and event staff need no option; an explanatory note says they're covered. |
| **"Is your employer a close relative?"** | No | Only for domestic worker | A14. RM0 if yes. List the relatives in the help text. |
| **Unresolved worker types**: industrial-training student, foreign employer with no Malaysian registration, embassy, international organisation, overseas posting | Pending owner decision | Advanced or help text | Section 2.3. See Questions for the owner. |
| **Residency**: Malaysian citizen / PR / other resident with MyKAS / foreign worker | Citizen | Advanced | A8. Affects EIS and also EPF/SOCSO. |
| **Age** | – | Always | A2–A4 |
| **"Were you already paying EIS before you turned 57?"** | Yes | Only when 57 ≤ age < 60 and EIS is otherwise applicable | A4. Must be a **separate** question from SOCSO's "first contribution before 55/60" question. |
| **Wage breakdown**: basic, overtime, commission, service charge and non-travel allowances, fixed or variable (count); travel claims, reimbursements, annual bonus (don't count); fixed travel allowance (pending owner decision) | Salary = EIS wages | Advanced | 2.1. Prevents EIS being charged on annual bonus or travel claims, and undercharged on variable allowances. |
| **Bonus frequency**: once a year / more often | Once a year | Only if a bonus is entered | 2.1. The label isn't decisive; a non-annual bonus counts in its own month. Needs a note. |
| **Second job / multiple employers** | Off | Advanced | s.19. Each employer computes separately, so two RM6,000 jobs give 2 × RM11.90 each. |
| **Contribution month** and per-month wage override | Whole-year view | Advanced | 3.3. Covers part months, unpaid leave, 4- or 5-week months and any future mid-year table change. Today the table doesn't change within a year. |
| **Help text on "wages this month"** | Shown | Always | 3.3. "Weekly or fortnightly paid? Add up every pay period that ended this month." |
| **Show employer share** | On (as info, not deducted) | Always | Educational: "your employer also pays RM x for you". |
| **"What do I get?" explainer** | Collapsed | Always | Section 8 |

---

## 8. Benefits, briefly ("what you get for this deduction")

Sources: Act 800 Third and Fourth Schedules; Act A1796 ss.8, 16, 17; P.U.(A) 346/2026; PERKESO FAQ of 1 Oct 2026; PERKESO EIS page; PERKESO SIP flyer.

**The new rates depend on when you lost your job.** PERKESO applies the 1 Oct 2026 rates to job loss on or after that date ("for job loss from 1st October 2026 ONLY"; FAQ Q1 agrees). Someone retrenched in September stays on the old rates even if they claim in October. One tension is open: A1796 s.17(3) applies the amended claim provisions to s.27 claims pending on 1 Oct 2026, and no official statement says whether that reaches the rates for a pending pre-October job loss.

- **Who can claim.** People who lose their job **involuntarily**. This includes:
  - retrenchment;
  - VSS/MSS;
  - business closure or bankruptcy;
  - closure due to natural disaster;
  - constructive dismissal;
  - resignation because of sexual harassment or threats.

  **Not covered:** voluntary resignation, dismissal for misconduct, compulsory retirement, and end or mutual termination of a fixed-term contract. The claim must be made within 60 days of losing the job.
- **Qualifying contributions.** For a first claim, at least **12 months of contributions in an eligibility period of 24 consecutive months**, which includes the month of job loss. 12–15 months gives 3 months of JSA, 16–19 gives 4, 20–23 gives 5, and 24 gives 6. Second and third claims need more contribution months (Fourth Schedule). The end of a fixed-term contract isn't a claimable job loss, so short-engagement staff can pay in with little prospect of claiming.
- **Job Search Allowance (EMP)** is paid as a % of the *assumed monthly wage*, which is the average of the last 6 months' assumed wages (Third Schedule paras 1, 6, 8):

  | Month | 1 | 2 | 3–4 | 5–6 |
  |---|---|---|---|---|
  | % of assumed monthly wage | 80 % | 50 % | 40 % | 30 % |

  The assumed wage is capped at **RM5,950**, so the maximum is RM4,760 in month 1, RM2,975 in month 2, RM2,380 in months 3–4 and RM1,785 in months 5–6. That is RM16,065 over 6 months, computed from the Act's percentages. Reaching six months needs 24 of 24 contribution months on a first claim.
- **Reduced Income Allowance (EPB):** paid at the same rates when you lose one of several jobs. s.3 describes it as a lump sum.
- **Early Re-employment Allowance (EBSA):** 25 % of unpaid JSA. For job loss from **1 Oct 2026** it is **50 %**.
- **Training:** fee paid directly to the provider, up to RM4,000 (RM7,000 for job loss from 1 Oct 2026). Training allowance RM10–20/day (flat RM30/day for job loss from 1 Oct 2026).
- **Mobility Assistance Allowance (EBM):** new, for job loss from 1 Oct 2026. RM1,000 lump sum when you report for a new job within 12 months (s.37A; Third Schedule para 5A). PERKESO's own conditions apply, because s.37A leaves terms to the Organization:
  - **Distance:** the FAQ of 1 Oct 2026 says the new workplace must be "tidak kurang daripada 100 kilometer" from home (at least 100 km), measured with Google Maps. PERKESO's English page says "more than 100 km". So exactly 100 km is unsettled; prefer the FAQ wording, or flag it. The condition isn't in the Bill, the Act or P.U.(A) 346/2026.
  - **Other limits:** placement within Malaysia only; apply within 60 days of reporting for duty; not for reduced income allowance recipients.
- **Job matching:** through MYFutureJobs.

**Suggested copy:** "For about RM5 a month on a RM2,500 salary, you'd get up to 6 months of partial income if you're retrenched, plus paid training."

---

## 9. Discrepancies vs the old implementation

Old files:
- `oldrepo/financial-view-app/src/lib/salary/rates/socso-eis.ts`
- `oldrepo/financial-view-app/src/lib/salary/rates/socso-eis-bands.ts`
- `calculate.ts`
- `salary-workspace.tsx`

| # | Old behaviour | Correct behaviour | Severity |
|---|---|---|---|
| D1 | **No age-60 cut-off.** `calculateEis` only exempts `age >= 57 && !contributingBeforeThreshold`, so a 60+ employee who answers "yes, contributing before" is charged EIS. | Excluded at ≥60 regardless of history (First Sched. para 8; s.20(2)). | **High** (wrong deduction for every 60+ private employee) |
| D2 | No under-18 exclusion. | Excluded below 18 (para 8). | Medium |
| D3 | One shared flag, `socsoEisContributingBeforeThreshold`, drives both SOCSO and EIS. The UI shows it when `age >= 60 \|\| age >= 57`, which is effectively `age >= 57`. | EIS asks "contributions payable before 57?"; SOCSO asks a different question with a different threshold. Use separate flags and show the EIS one only when 57 ≤ age < 60. | Medium |
| D4 | `Sector = 'government' \| 'private' \| 'self-employed'` only. | Needs domestic worker (covered), statutory body / local authority (excluded, incl. contract staff) and public-sector COS contract (SOCSO yes, EIS no). The old comment mentions "statutory-body employees", but no input represents them. | Medium |
| D5 | No residency or nationality input. Foreign workers on private payroll are charged EIS. | Foreign workers are excluded unless PR or MyKAS (para 10). | Medium |
| D6 | `lookupBand` returns item 1 for wage ≤ 0, so RM0 salary gives RM0.05 EIS. | 0 when no wages are payable. | Low |
| D7 | No financial-year or effective-date keying. One hard-coded table with no `effectiveFrom`. | Year → periods → table id (section 5). Required for the 2027 template and any mid-year change. | Medium (architecture) |
| D8 | Items 64 and 65 merged into one open-ended band. | Equivalent amounts. Keep the official 65 items so they map 1:1 to the gazette. | None (cosmetic) |
| D9 | Amounts stored as RM floats (`0.05`, `11.9`) and passed through `round2`. | Works, but integer sen is safer and matches the gazette. | Low |
| D10 | Band amounts. | **Identical to the official table at every sen from RM0.01 to RM10,000.** Ceiling RM6,000 / RM11.90 confirmed. | ✔ no discrepancy |
| D11 | Private-sector-only rule. | Correct in spirit, but "private" must include Malaysian domestic workers and exclude statutory bodies (see D4). | Low–Medium |
| D12 | The 57+ rule exempts people "who never contributed before 57". | Correct, with one refinement: the test is contributions *payable* (not paid) before 57, from any employer. | ✔ (wording only) |
| D13 | The `socso-eis-bands.ts` header says the table was "verified against real payslips". | Now verified against the Act text, Act A1725 and PERKESO's PDF (section 3.2). Cite those instead. | Docs |
| D14 | The old FAQ says bonuses and allowances are not modelled. | If the new app adds a bonus input, EIS must exclude **annual** bonus only, count non-travel allowances including variable ones, and handle travel allowance per the owner's decision (2.1). | Note for future |
| D15 | No close-relative exemption for domestic workers. | A domestic employee employed by a close relative is exempt (A14). RM2,000: old-style result RM3.90 + RM3.90, correct RM0 + RM0. The new "domestic worker" option must not repeat this. | Low–Medium |
| D16 | Salary is one number with no month definition. | `monthlyWagesRm` is all EIS wages for wage periods ending in the month, one lookup per employer (3.3). | Low (help text) |

---

## 10. Limitations and unverified items

| Item | Status | Confidence |
|---|---|---|
| Second Schedule amounts, all 65 rows, 2025–2026 | Verified from the Act text + A1725 + PERKESO PDF + Third Schedule cross-check | **High** |
| RM6,000 ceiling effective 1 Oct 2024 | A1725 text (Royal Assent 11 Sep 2024, gazetted 25 Sep 2024). P.U.(B) 382/2024 appoints 1 Oct 2024. PERKESO's Employers' Circular 3/2024 and media release of 1 Oct 2024 agree. | **Very high** |
| No contribution change in 2025 or 2026 | Gazetted A1796 read in full: no amendment of s.16, s.18 or the First, Second or Fourth Schedule. P.U.(B) 391/2026 read. The English text was used; the authoritative BM text of A1796 wasn't downloaded, though nothing suggests a difference. No later amending Act was found, but the AGC amending-Act table couldn't be read. | High |
| No First Schedule or exemption order after 31 May 2021 | Title-level check of the AGC listing (7,377 P.U.(A) records, newest 4 Nov 2026, no numbering gaps for 2022–2026). The only Act 800 items since are Supply Regulations and P.U.(A) 346/2026 (benefits). Not every order was opened, and no consolidated reprint after 1 Sep 2022 was available. **Not relied on (D1):** needs a manual check at lom.agc.gov.my. | Low until checked |
| Foreign workers still excluded in 2025/2026 | Act para 10, PERKESO 2018 clarification, Feb 2024 flyer, 2025 booklet. No later change found. | High |
| Contract or temporary civil servants excluded from EIS | Paras 6–7 + PERKESO FAQ 1 Oct 2024 Q9 + P.U.(B) 240/2013. No JPA statement specific to EIS. | **High** |
| Statutory-body and local-authority contract staff excluded | Para 7 text and booklet p.46. No PERKESO sentence names contract staff there. | High on statute text |
| Director, student, overseas, foreign-employer, embassy and public-university cases | No PERKESO FAQ or circular addresses them under Act 800. See section 2.3. Hansard, law reports, Act 636, university constituting Acts and the MoF list of statutory bodies weren't read. | Per row: Low to Medium |
| Wage classification below "high" in section 2.1 | No PERKESO item-level ruling and no Malaysian decision found. Texmo is Indian and not binding. Law reports weren't available. | Per row |
| Month-earned treatment of arrears, and one lookup for several wage periods (section 3.3) | A statutory reading supported by PERKESO's filing system, not a PERKESO statement. ASSIST wasn't tested; the 2022 manual's menus may have changed. | Medium to Medium-high |
| 0/0 when no wages are payable | Reasoned from s.20(1); no official statement. Wages owed but unpaid are a different case. | Medium |
| Multiple employers | s.19 is clear on separate payment. "On the wages it pays" is a reading; no official worked example. | High |
| Birthday-month handling at 18, 57 and 60 (e.g. whether EIS applies in the month someone turns 60) | **No official source found** after a targeted search of PERKESO pages, circulars, FAQs and booklets. The Act states an event-based cut-off (s.20(2), First Sched. paras 8–9) and monthly contributions (s.20(1)), with no rule linking them. Vendors differ: brioHR stops the month after; Oracle's SOCSO age test uses the period end. Maximum effect is one month's contribution (RM11.90 each). The app takes completed-years age, so this only matters for a month-precise view. SAP KBAs and ASSIST weren't accessible. | **Low**. Ask PERKESO if month precision is ever needed. |
| Mobility allowance "100 km" condition | PERKESO FAQ of 1 Oct 2026 ("not less than") vs PERKESO English page ("more than"). Not in the Bill, the Act or P.U.(A) 346/2026. The boundary at exactly 100 km is unsettled. | High that the condition exists; boundary unresolved |
| New benefit rates for a pre-October job loss with a claim pending on 1 Oct 2026 | PERKESO says job loss from 1 Oct only; A1796 s.17(3) applies amended claim provisions to pending claims. No official statement reconciles them. Explainer only. | Unresolved |
| PERKESO official calculator | Not accessed (ASSIST portal requires employer login). Verification used the gazette and PERKESO's published table instead. | n/a |
| Direct PDF download | `curl` to perkeso.gov.my was rejected by the site's WAF ("Request Rejected"). The PDFs were obtained via the WebFetch tool or the Wayback Machine, and text was extracted with `pypdf` or PDFKit; the table PDF and Circular 3/2024 are image-only and were read visually. PERKESO web pages were read through a summarising fetch, so treat their quotes as less exact than the PDFs. | n/a |
| AGC listing method | The "no later order" findings and the AGC gazette copies rest on saved copies of the portal's P.U.(A) and P.U.(B) listings that weren't obtained through a normal page view. Not relied on (D1) until a manual check. See [Questions for the owner](#questions-for-the-owner). | Disclosure |
| 2027 | Nothing announced. Budget 2027 speech (MOF, 9 Oct 2026) has no EIS measure; annexes weren't read. | Template only: **Unconfirmed** |
| PERKESO material that conflicts with the Act (domestic workers "exempt"; "55" in a 2024 deck; plain "bonus" on a slide; both shares "deducted" in the booklet) | Flagged; the Act prevails. | – |
| Tax relief (SOCSO + EIS, reportedly RM350/yr combined) | Not researched here. Belongs to the PCB/income-tax research. | Out of scope |

---

## Research status

**Complete for the calculator's numbers.** The table, ceiling, age limits and coverage rules are verified from gazetted text for 2025 and 2026. The 2027 template remains an unconfirmed carry-forward.

What remains open needs a PERKESO answer or an owner decision, and research can't close it from free sources:
- worker types with no PERKESO ruling (section 2.3);
- item-level wage classification below "high" (section 2.1);
- month-earned treatment of arrears as an official rule (section 3.3);
- birthday-month handling (section 10);
- the 100 km boundary and pending-claim rates, which affect explainer copy only (section 8).

Not read: the BM text of A1796, law reports (CLJ/MLJ), Hansard, Act 636, universities' constituting Acts, the MoF list of statutory bodies.

## Questions for the owner

1. **Worker types with no PERKESO ruling.** For an industrial-training student paid only an allowance, a Malaysian working for a foreign company with no Malaysian registration, embassy staff and international-organisation staff, which default do you want?
   - (a) Ask "Does your payslip show an EIS/SIP deduction?" and follow the answer (researcher's recommendation: avoids guessing).
   - (b) Default to no contribution.
   - (c) Default to the full table.
2. **Inferred coverage.** Should salaried directors and staff on overseas postings be treated as covered with a "check your payslip" note, and public-university staff as statutory-body 0/0 with the same note (researcher's recommendation)? Or should these wait for written confirmation from PERKESO?
3. **Fixed monthly travel, transport, petrol, toll, parking or car allowance.** Should the calculator leave it out of EIS wages?
   - (a) Exclude by default with a "my payslip counts this" toggle (researcher's recommendation; follows the Act, Circular 3/2017 and Texmo).
   - (b) Count it, matching PERKESO's Feb 2026 Threads post and some payrolls.

   The EIS error is about RM1 a month per RM500 either way. `epf.md` research recommends the opposite default on the same statutory phrase, so also: one shared toggle, or per-scheme defaults?
4. **Arrears.** Should v1 keep one "wages for this month" input with help text and a per-month override (researcher's recommendation), or also add an arrears input now? With the first option, a payslip can differ by a few sen to about RM2.40 when arrears or late-paid items are involved.
5. **Age precision.** Will the app stay on completed-years age (researcher's recommendation; the most it can change is RM11.90 of one month's pay and it needs no PERKESO answer), or ask for birth month?
6. **Asking PERKESO.** Do you want to send PERKESO a written query (1-300-22-8000 or perkeso@perkeso.gov.my)? Only you can make or authorise it. It would cover:
   - whether arrears and late overtime or commission go to the earned month, and whether several weekly periods get one lookup;
   - AWS, festive bonus, ex-gratia, sign-on, pay in lieu, leave encashment and fixed travel allowance;
   - the worker types in questions 1 and 2;
   - for someone turning 60, 18 or 57 partway through a month, whether that month's wages are contributable, in full or apportioned.
7. **Decided 2026-11-06 (D1): don't rely on them.** Original question: **AGC listing method.** Could the report rely on saved AGC portal listings that weren't obtained through a normal page view? Since the answer is no, the "no later order" findings need a manual check in a browser at lom.agc.gov.my, and their confidence should drop until then. Contribution amounts don't depend on it.

## Verification log (deep pass, 2026-11-05)

Each claim had three independent checks: **primary** (against the legal text), **compute** (recalculated) and **currency** (still in force for each year). A claim is REFUTED when two or more checks refute it. Votes below are in the order primary / compute / currency. ✓ = confirmed, ✗ = refuted, ? = unverified.

**Live search:** `no-live-search.json` lists no EIS checks, so none of the votes below is marked "no live search". All EIS checks had live web search available, although several PERKESO and AGC pages were blocked or could only be read through a summarising fetch or a cached copy.

| Claim id | Claim | Outcome | Votes (✓/✗/?) | Action taken | Key source |
|---|---|---|---|---|---|
| EIS-1 | 65-row band table, employee = employer, exact-sen lookup | CONFIRMED | ✓ / ✓ / ✓ | Kept. Added deep-pass note in 3.2. | Act 800 Second Sched.; A1725 s.3; PERKESO table images |
| EIS-2 | RM6,000 ceiling, RM11.90 max, from 1 Oct 2024; earlier periods | CONFIRMED | ✓ / ✓ / ✓ | Kept. Stale evidence note replaced; date now rests on the gazette. | A1725; P.U.(B) 382/2024; Circular 3/2024 |
| EIS-3 | 0.2 % nominal is not the table; generating rule fits all 65 rows | CONFIRMED | ✓ / ✓ / ✓ | Kept. Wording fixed: only items 1 and 65 depart from the midpoint pattern. | Act 800 Second and Third Scheds.; A1725 ss.3–4 |
| EIS-4 | No contribution change in 2025–2026; A1796 benefits only; 2027 carry-forward | CONFIRMED | ✓ / ✓ / ✓ | Kept. Bill-based caveat replaced by the gazetted Act. | A1796; P.U.(B) 391/2026; AGC listings; Budget 2027 speech |
| EIS-5 | Under 18 and 60+ excluded regardless of history | CONFIRMED | ✓ / ✓ / ✓ | Kept. Added retirement-age watch item to 4.3. | First Sched. para 8; s.20(2); Act 753 s.4(1) |
| EIS-6 | Late-entry rule at 57; MBSJ "55" is an error | CONFIRMED | ✓ / ✓ / ✓ | Kept. Marked "from any employer" and the copy-paste explanation as readings. | First Sched. para 9; Circular 3/2024 para 3.6 |
| EIS-7 | Coverage by employment type | **REFUTED** (narrow) | ✗ / ✗ / ✗ | **Corrected.** I read the order: added the close-relative exemption (A14), example 18, schema and option. Raised COS confidence after reading FAQ Q9 myself. All else kept. | P.U.(A) 250/2021 para 2(1)(a); PERKESO FAQ 1 Oct 2024 Q9 |
| EIS-8 | Coverage by residency; PLKS excluded | CONFIRMED | ✓ / ✓ / ✓ | Kept. Added 12-month boundary, MyKAS caveat, and that "Act 4 only" means PERKESO schemes. | First Sched. para 10; FAQ Domestic Q7–Q8; AGC listing |
| EIS-9 | EIS wages definition | **REFUTED** (narrow) | ✗ / ✗ / ✗ (currency at medium) | **Corrected.** Statutory part stands. I read the booklet, circular and slide: replaced "vendors, fixed allowances" with PERKESO's own list; added limb (g). Added example 20. | Act 800 s.3; booklet 2025 p.8; Circular 3/2017 para 5; induction notes |
| EIS-10 | Two employers separate; who remits; s.20(1A)/(1B); 0/0 proposal | CONFIRMED | ✓ / ✓ / ✓ | Kept. A13 now cites the gazetted Act and reg 9(1). 0/0 labelled as a reasoned proposal. | s.19; P.U.(A) 452/2017 reg 9(1); A1796 s.6 |
| EIS-11 | No official birthday-month rule | CONFIRMED (medium) | ✓ / ✓ / ✓ | Kept. Section 10 now states the event-based wording and vendor split; Low confidence stays. | s.20; First Sched. paras 8–9; brioHR; Oracle |
| EIS-12 | Benefit parameters | **REFUTED** (narrow) | ✗ / ✗ / ✗ | **Corrected.** All numbers stand. I read the FAQ and re-fetched the PERKESO page: 100 km is PERKESO's condition, the wording conflicts at exactly 100 km, and rates key on job-loss date. Updated 4.2 and 8, and split benefit config by job-loss date. | PERKESO FAQ 1 Oct 2026 Q1, Q3; PERKESO EI page; A1796 ss.8, 16, 17 |

I checked every refutation against its source and upheld all three, each narrowly. No refutation was rejected.

**Research to-dos and gaps merged:**

| Id | Task | Status | Result |
|---|---|---|---|
| EIS-T1 | Official evidence for 1 Oct 2024 | Partial, now closed | PERKESO circular and release found. T1 didn't get the P.U.(B); T3 did, and I read it (382/2024). Sections 2.2, 10. |
| EIS-T2 | Gazetted A1796 | Resolved | Read; matches the Bill except the short-title year and s.45F fine. T2 couldn't read P.U.(B) 391/2026; T3 retrieved it, and I read it. Sections 2.2, 10. |
| EIS-T3 | First Schedule orders; COS statement | Resolved | No later order; FAQ Q9 found; P.U.(A) 250/2021 found. A7, A14, section 10. |
| EIS-T4 | Birthday-month guidance | Partial | No official rule. Section 10; `ageBoundaryBasis`. |
| G1 | Special worker types | Partial | Section 2.3; para 4 wording in A11. |
| G2 | Item-level wage classification | Partial | Section 2.1; `wageComponents`. |
| G3 | Assembling a contribution month | Partial | Section 3.3; `contributionMonth`. |

**Not independently verified** (`droppedClaims`, left out of the deep-pass claim list):

- SOCSO + EIS combined income-tax relief (reportedly RM350/yr). The report marks it out of scope and leaves it to the PCB research.
- A1796 s.11 employer duty to notify PERKESO of vacancies (ss.45A–45H), in force 2 Jan 2027, with fines of RM1,000/RM3,000/RM5,000. It has no payroll effect.
- Historical pre-2025 periods (RM4,000 ceiling 2018 to Aug 2022; RM5,000 / RM9.90 from Sep 2022 to Sep 2024) as standalone claims. They appear only as context in EIS-2.
- Annual example: 12 × RM4.90 = RM58.80 on RM2,500/month. It is arithmetic derived from the table.
- Integer-sen storage and the cosmetic merge of items 64 and 65 in the old code (D8, D9). These are implementation notes, not statutory facts.
- Other First Schedule exclusions irrelevant to the app (casual workers outside the employer's industry, share-croppers, prisoners; para 4 deleted by P.U.(A) 145/2018).
- JSA duration by contribution months (12–15 → 3 months, 16–19 → 4, 20–23 → 5, 24 → 6), the 60-day claim window, and the list of qualifying job-loss events. These are educational benefit details only.
- Old app discrepancies D1–D14 as separate items. D1, D2, D3, D5 and D6 are folded into the relevant claims; the old band amounts were found identical to the official table at every sen.

Some of these were touched while checking other items: G1 examined para 1 and para 4, and I read the Fourth Schedule's JSA durations. They still had no three-way vote.

---

## 11. Sources

Items 1–22 were accessed 2026-11-04, and later items 2026-11-05. Local copies are under `.research-cache/`, which is git-ignored.

**Primary: legislation**
1. Employment Insurance System Act 2017 [Act 800], AGC updated text as at 1 Sep 2022 (s.2, s.3, ss.16–20, First–Fourth Schedules). https://perkeso.gov.my/images/akta/ACT%20800/Akta%20800_EMPLOYMENT%20INSURANCE%20SYSTEM%20ACT%202017.pdf
2. Employment Insurance System (Amendment) Act 2024 [Act A1725]. Amends s.16(2) (RM5,000 → RM6,000), Second Schedule items 55–65, Third Schedule items 55–65. https://www.perkeso.gov.my/images/akta/ACT%20800/ACT%20A1725%20(BI)_EMPLOYMENT%20INSURANCE%20SYSTEM%20(AMENDMENT)%20ACT%202024.pdf
3. Employment Insurance System (Amendment) Bill 2025, as tabled; later Act A1796 (2026). https://www.cljlaw.com/files/bills/pdf/2025/MY_FS_BIL_2025_33.pdf
4. CLJ "Latest Malaysian Acts": A1796 commencement 1 Oct 2026 except s.11 (2 Jan 2027), P.U.(B) 391/2026. http://www.cljlaw.com/?page=latestmyactmore
5. P.U.(A) 145/2018, EIS (Amendment of First Schedule) Order 2018. https://perkeso.gov.my/images/akta/ACT%20800/P.U(A)/P.U.%20(A)%20145%20-%20Perintah%20SIP%20(Pindaan%20Jadual%20Pertama)%202018_PERINTAH%20SISTEM%20INSURANS%20PEKERJAAN(PINDAAN%20JADUAL%20PERTAMA)%202018.pdf

**Primary: PERKESO**
6. PERKESO, "Rate of Contribution Employment Insurance System (Act 800)" (151124). https://www.perkeso.gov.my/images/dokumen/151124-Rate%20Contribution%20ACT%20800.pdf
7. PERKESO, Contributions page. https://www.perkeso.gov.my/en/our-services/employer-employee/contributions.html
8. PERKESO, Employment Insurance (benefits, 1 Oct 2026 changes). https://www.perkeso.gov.my/en/our-services/protection/employment-insurance.html
9. PERKESO, FAQ Domestic Workers (28 Jul 2021). https://www.perkeso.gov.my/images/pekerja_domestik/280721_-_FAQ_Domestic_Workers.pdf
10. PERKESO, Clarification on Coverage for Foreign Workers (24 Dec 2018). https://www.perkeso.gov.my/images/pekerja_asing/bm/CLARIFICATION_ON_COVERAGE_FOR_FOREIGN_WORKERS.pdf
11. PERKESO, SIP flyer (BM, Feb 2024). https://www.perkeso.gov.my/images/flyers/sip/200224%20-%20Flyers%20-%20SIP%20-%20BM_compressed.pdf
12. PERKESO briefing deck, 2024, hosted by MBSJ (contains the "55" inconsistency). https://www.mbsj.gov.my/sites/default/files/SLIDE%20Ceramah%20PERKESO%20-%20Semua%20Akta%20PERKESO%202024.pdf

**Primary: Budget**
13. MOF, Speech: The Fifth MADANI Budget 2027 (9 Oct 2026). https://www.mof.gov.my/portal/en/news/speech/speech-the-fifth-madani-budget-2027

**Secondary**
14. Skrine, "Maximum contribution rate under Employees' Social Security…" (Oct 2024), 1 Oct 2024 commencement. https://www.skrine.com/insights/alerts/october-2024/maximum-contribution-rate-under-employees%E2%80%99-social-
15. Skrine, "EIS (Amendment) Bill 2025 extends coverage and enhances benefits" (Nov 2025). http://www.skrine.com/insights/alerts/november-2025/employment-insurance-system-amendment-bill-2025-ex
16. Skrine, "Amendments to EIS legislation come into operation on 1 October 2026". https://www.skrine.com/insights/alerts/october-2026/amendments-to-employment-insurance-system-legislat
17. Crowe Malaysia, "New SOCSO and EIS changes effective October 2024" (public-sector contract staff: Act 4 yes, Act 800 no). https://www.crowe.com/my/insights/new-socso-and-eis-changes-effective-october-2024---key-updates-for-employers
18. eCentral, "Penambahbaikan SIP PERKESO – Berkuatkuasa Mulai 1 Oktober 2026" ("Kadar caruman bulanan SIP kekal sama"). https://ecentral.my/penambahbaikan-sip-perkeso/
19. The Star, "Stronger benefits for job loss" (6 Nov 2025). https://www.thestar.com.my/news/nation/2025/11/06/stronger-benefits-for-job-loss
20. Bernama, "Employment Insurance Bill retabled with progressive penalties". https://www.bernama.com/en/general/news.php?id=2574973
21. brioHR help, "Types of EIS options" (vendor birthday-month convention). https://support.briohr.com/knowledge/types-of-eis-options
22. Utusan, "Caruman kecil, perlindungan besar untuk pekerja" (May 2026; shows the RM3.40 straight-percentage error). https://www.utusan.com.my/nasional/2026/05/caruman-kecil-perlindungan-besar-untuk-pekerja/

**Added in the deep pass (accessed 2026-11-05)**

*Primary: legislation*

23. Employment Insurance System (Amendment) Act 2026 [Act A1796], gazetted English text. Supersedes the Bill (source 3) for this report. https://lom.agc.gov.my/ilims/upload/portal/akta/outputaktap/3696918_BI/Act%20A1796%20-%20EMPLOYMENT%20INSURANCE%20SYSTEM%20(AMENDMENT)%20ACT%202026.pdf
24. P.U.(A) 250/2021, Employment Insurance System (Exemption) Order 2021; P.U.(A) 249/2021, Amendment of First Schedule Order 2021; P.U.(A) 346/2026, Benefit and Re-Employment Placement Programme (Amendment) Regulations 2026. AGC listing: https://lom.agc.gov.my/subsid.php?type=pua (local: `eis/verify/eis-t3/`)
25. P.U.(B) 382/2024 (commencement of A1725); P.U.(B) 391/2026 (commencement of A1796). AGC listing: https://lom.agc.gov.my/subsid.php?type=pub (local: `eis/verify/eis-t3/`)
26. P.U.(A) 452/2017, EIS (Registration and Contribution) Regulations 2017. https://www.perkeso.gov.my/images/akta/ACT%20800/P.U(A)/P.U.%20(A)%20452%20-%20PP%20SIP%20(Pendaftaran%20dan%20Caruman)%202017_PERATURAN-PERATURAN%20SISTEM%20INSURANS%20PEKERJAAN%20(PENDAFTARAN%20DAN%20CARUMAN)%202017.pdf
27. P.U.(B) 240/2013, Act 4 exemption for Federal and State employees. https://perkeso.gov.my/images/akta/ACT%204/P.U.(B)/PUB%20240%20(2013)%20-%2012%20-%20PEMBERITAHUAN%20KESELAMATAN%20SOSIAL%20PEKERJA%20(PENGECUALIAN%20KEPADA%20PEKERJA%20KERAJAAN%20PERSEKUTUAN%20DAN%20KERAJAAN%20NEGERI)%202013.pdf
28. P.U.(B) 239/2013, Act 4 exemption for statutory bodies and local authorities. https://perkeso.gov.my/images/akta/ACT%204/P.U.(B)/PUB%20239%20(2013)%20-%2011%20-%20PEMBERITAHUAN%20KESELAMATAN%20SOSIAL%20PEKERJA%20(PENGECUALIAN%20KEPADA%20PEKERJA%20BADAN%20BERKANUN%20DAN%20PIHAK%20BERKUASA%20TEMPATAN)%202013.pdf
29. Minimum Retirement Age Act 2012 [Act 753], s.4. https://jtksm.gov.my/sites/default/files/2023-03/6.%20Minimum%20Retirement%20Age%20Act%202012.pdf
30. Statutory Bodies (Accounts and Annual Reports) Act 1980 [Act 240], s.2, as at 1 Dec 2011 (used by analogy). https://legaladvisor.uitm.edu.my/images/ACT/Act_240_-_Statutory_Bodies_Accounts_and_Annual_Reports_Act1.pdf
31. Employment Act 1955 [Act 265], ss.2, 13(1). https://jtksm.gov.my/sites/default/files/2023-11/Akta%20Kerja%201955%20(Akta%20265).pdf
32. Vienna Convention on Diplomatic Relations 1961, art.33. https://legal.un.org/ilc/texts/instruments/english/conventions/9_1_1961.pdf

*Primary: PERKESO*

33. PERKESO Employers' Circular No. 3 Year 2024 (1 Oct 2024; EN ref PERKESO.600-2/4/1(32)), via Wayback. http://web.archive.org/web/20260308142436id_/https://perkeso.gov.my/images/arahan/011024%20-%20EMPLOYERS%20CIRCULAR%20NO.%203%20YEAR%202024%20-%20INCREMENT%20OF%20THE%20WAGE%20CEILING%20FOR%20MONTHLY%20CONTRIBUTIONS%20FROM%20RM5K%20TO%20RM6K.pdf
34. The same circular in BM, with Lampiran 1, enclosed in a JANM Pahang bulletin (25 Oct 2024). https://pahang.anm.gov.my/images/JANM/AO/Pahang/02-Berita/2024/BULETIN_EDARAN_PERKESO_BIL.3_2024_PENINGKATAN_HAD_LIMIT.pdf
35. PERKESO media release, 1 Oct 2024, via Wayback. http://web.archive.org/web/20260609055032id_/https://www.perkeso.gov.my/images/kenyataan_media/2024/011024%20-%20SIARAN%20MEDIA%20KUATKUASA%20PENINGKATAN%20SILING%20GAJI%20RM5000%20KEPADA%20RM6000%20FINAL.pdf
36. PERKESO, FAQ Peningkatan Had Siling Gaji RM5K to RM6K, 1 Oct 2024 (Q6, Q7, Q9). https://www.perkeso.gov.my/images/dokumen/011024%20-%20FAQ%20PENINGKATAN%20HAD%20SILING%20GAJI%20DARI%20RM5K%20KEPADA%20RM6K%20DI%20BAWAH%20AKSP%20969%20AKTA%204%20%20ASIP%202017%20AKTA%20800.pdf
37. PERKESO FAQ on the 2026 amendment, Bahagian Faedah, 1 Oct 2026 (Q1–Q3). https://www.perkeso.gov.my/images/lindung/kerjaya/faq/02102026-FAQ-Sistem-Insurans-Pekerjaan.pdf
38. PERKESO Pekeliling Majikan Bil. 3 Tahun 2017, para 5 "Definisi Gaji". https://mkma.org/wp-content/uploads/2020/12/EISPekeliling_Majikan-1.pdf (local: `eis/verify/eis-t3/pm-3-2017.pdf`)
39. PERKESO Booklet 2025 (BI), p.8 "Definition of Wages", p.46–47 Act 800. https://perkeso.gov.my/images/dokumen/risalah/2025-BOOKLET_PERKESO_BI.pdf
40. PERKESO Booklet 2025 (BM). https://perkeso.gov.my/images/dokumen/risalah/2025-BOOKLET_PERKESO_BM.pdf
41. PERKESO Nota Penerangan Induksi Majikan, slide 3. https://perkeso.gov.my/images/Induksi_Majikan/Nota_Penerangan_Induksi_Majikan_Baharu_PERKESO_CURRENT.pdf
42. PERKESO, Frequently Asked Questions (General Q4, Q6, Q18; EIS Q1; read through a summarising fetch). https://www.perkeso.gov.my/en/contact-us/pejabat-perkeso-new/frequently-asked-question.html
43. PERKESO, Pekerja Bermajikan page. https://www.perkeso.gov.my/perkhidmatan-kami/perlindungan/pekerja-bermajikan.html
44. PERKESO, Combined text-file format (v2.1, 13 Feb 2026). https://www.perkeso.gov.my/images/borang/lindung24jam/28072026-formatteksfail.pdf
45. PERKESO, Text-file format FAQ (Q4, Q7). https://www.perkeso.gov.my/images/lindung/lindung-24-jam/FAQ_TextFileFormat_EN.pdf
46. PERKESO, Combine Contribution & Payment user manual (2022). https://www.perkeso.gov.my/images/panduan/280722_-_User_Manual_-_Combine_Contribution__Payment_-_External_User_v1.pdf
47. PERKESO, FAQ Program Perantisan (31 Dec 2020). https://www.perkeso.gov.my/images/belanjawan2021/sip/penjanakerjaya/311220%20-%20Latest%20FAQ-%20Program%20Perantisan%20(BM).pdf
48. PERKESO, Threads post dated 7 Feb 2026 (via the SOCSO gap research; not re-read). https://www.threads.com/@perkeso.official/post/DaS0fcDGpIY/ini-termasuklah-gaji-pokok-bayaran-ot-komisen-dan-elaun-seperti-elaun-makan/
49. KESUMA media statement, 25 Jun 2024 (Dewan Rakyat passage; no commencement date). https://mohr.gov.my/images/pdf/KENYATAAN%20MEDIA%20PINDAAN%20KENAIKAN%20SILING%20GAJI%20BULANAN%202024.pdf

*Secondary and foreign (persuasive or context only)*

50. *ESIC v Texmo Industries*, Supreme Court of India, SLP (C) 811/2021, 8 Mar 2021. Not binding in Malaysia. https://api.sci.gov.in/supremecourt/2021/82/82_2021_43_13_26745_Judgement_08-Mar-2021.pdf
51. *ESIC v Universal Medikit*, Bombay HC Nagpur, 18 Apr 2019 (opposite view, predates Texmo; read through a summarising fetch). https://lawtext.in/judgement.php?bid=58148
52. Sinar Harian, Steven Sim on SIP and gig workers, 4 Nov 2025. https://www.sinarharian.com.my/article/755363/berita/nasional/perkeso-kaji-peluasan-skim-insurans-pekerjaan-kepada-pekerja-gig
53. RinggitPlus on the 1 Oct 2026 changes. https://ringgitplus.com/en/blog/insurance/perkeso-pays-more-if-you-lose-your-job-from-1-october.html
54. Conventus Law, A1796 gazetted, tiered s.45F fines. https://conventuslaw.com/?p=139059
55. The Vibes, s.45F moratorium (Dec 2025, pre-enactment). https://www.thevibes.com/articles/business/116881/socso-signals-cooperative-approach-smes-given-time-to-adapt-to-job-vacancy-reporting-rule
56. Bernama, amended Act 800 in force 1 Oct 2026. https://www.bernama.com/bm/am/news.php?id=2614117
57. Bernama, PERKESO on industrial-training students, 15 Jan 2026 (read through a summarising fetch). https://www.bernama.com/bm/am/news.php?id=2512626
58. The Edge, statutory bodies commentary, 15 Feb 2021 (read through a summarising fetch). https://theedgemalaysia.com/article/my-say-statutory-bodies-need-meaningful-parliamentary-oversight
59. MOF, statutory-body FAQ. https://www.mof.gov.my/portal/pdf/bahagian/sbm/faq-en.pdf
60. UMT, Skim Lantikan Khas guideline, s.6.10. https://pendaftar.umt.edu.my/wp-content/uploads/2024/10/GARIS-PANDUAN-SKIM-LANTIKAN-KHAS-SOKONGAN-AKADEMIK.pdf
61. Deloitte (The Star, Oct 2021, republished), foreign employers with no local entity. https://labourlawbox.blogspot.com/2021/10/remote-working-track-me-if-you-can.html
62. DNH, summary of *AIBD v Menteri Sumber Manusia* (8 Mar 2022; judgment not read). https://dnh.com.my/case-spotlight-international-organizations-immune-from-unfair-dismissal-claims/
63. Focus Malaysia, contract for service under Act 4 (16 Jun 2023; judgment not read). https://focusmalaysia.my/socso-eligibility-takes-into-account-employee-or-independent-contractor-status/
64. L&Co, payroll contribution details (updated 3 Apr 2026). https://landco.my/information-sharing/details-of-payroll-contribution/
65. CWCA, remuneration subject to contributions. https://www.cwca.com.my/sharings/remuneration-that-subject-to-epf-socso-eis-hrdf/
66. AJobThing, payments subject to SOCSO/EIS (19 Feb 2025). https://www.ajobthing.com/resources/blog/payments-subject-to-socso-eis-contribution-malaysia
67. Swingvy help, payments subject to SOCSO. https://help.swingvy.com/knowledge/which-payment-is-subjected-to-socso
68. Talenox help, EIS contributions (director fees; 6 Dec 2023). https://help.talenox.com/en/articles/2807806-contributions-to-employment-insurance-system-eis
69. Talenox help, backdated salary. https://help.talenox.com/en/articles/6074546-how-to-process-backdated-salary-malaysia
70. PayrollPanda help, over- or underpaid SOCSO/EIS. https://www.payrollpanda.my/help/what-to-do-if-an-employer-overpays-or-underpays-socso-eis-contributions/
71. Worksy support, contributions on partial-month wages. https://worksy.freshdesk.com/support/solutions/articles/63000277042
72. Oracle PeopleSoft, SOCSO contribution process (vendor; SOCSO only). https://docs.oracle.com/cd/G20540_01/hcm92pbr51/eng/hcm/hgpl/UnderstandingtheSOCSOContributionProcess-e34bc2.html
73. DuitTools, SOCSO above 60 (uncited; no authority). https://duittools.com/blog/socso-for-employees-above-60-malaysia-2026

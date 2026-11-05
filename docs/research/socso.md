# SOCSO (PERKESO, Act 4): research for the take-home salary calculator

Researched 2026-11-04. Revised 2026-11-05 after a deep verification pass (see the [verification log](#verification-log-deep-pass-2026-11-05)). Scope: Employees' Social Security Act 1969 (Act 4), including the new Non-Employment Injury Scheme (SKBBK / "LINDUNG 24 Jam"). It also notes Act 789 (self-employed), Act 872 (platform gig workers) and Act 838 (housewives). EIS (Act 800) is out of scope and is covered in a separate doc. The two acts share a wage definition (see §2.4).

Data files (machine-readable, generated from the official text and cross-checked):

| File | What |
|---|---|
| `data/socso-act4-2025.json` | Third Schedule table in force for contribution months **Oct 2024 to May 2026**: employment injury + invalidity, RM6,000 ceiling, 65 bands, both categories. |
| `data/socso-act4-2026.json` | Third Schedule as replaced by **Act A1788**, in force from contribution month **June 2026**. All 3 phases × 2 categories × 65 bands, with separate employment-injury, invalidity and non-employment-injury columns. |
| `data/socso-skbbk-2026.json` | Non-employment-injury (SKBBK) employee column only, for phases 1–3, plus the participation rules. |
| `data/socso-config.json` | Per-financial-year config (2025, 2026 with effective-date periods, 2027 template, bridge to 2028+), plus year-independent rules: category, coverage, wage components, arrears, multiple employers, opt-out effect, and Act 789 / Act 872. |

No table amount changed in the deep pass. Every band in all tables was re-derived from the Acts with 0 mismatches. What changed is who pays, what counts as wages, and how the self-employed and platform workers are handled.

---

> **Owner decision, 2026-11-06 (D1): saved AGC portal listings are not relied on.** Findings that rest on them stay in this report for reference, but they aren't evidence until someone checks lom.agc.gov.my by hand (`owner-questions.md`, M7). No contribution amount depends on them.

## 1. Summary for a non-expert

* **SOCSO (PERKESO) is accident and disability insurance that comes with your job.** It is not savings and you can't withdraw it. It pays out if you're injured at work or on the way to work, or if you become permanently unable to work (invalidity). Since June 2026 it can also pay out for accidents outside work.
* **Deductions are a fixed amount from a table, not a percentage.** Your monthly wage falls into an RM100-wide band (narrower at the very bottom), and each band has a fixed amount. Above RM6,000 a month, everyone pays the same as someone earning RM6,000.
* **The band uses your pay before deductions.** Don't subtract your own EPF first. Overtime, commission and most allowances count. Annual bonus and travel claims don't (§2.4).
* **Two parts until May 2026:**
  * Your employer pays about **1.75%** of your wage: 1.25% employment injury plus 0.5% invalidity.
  * You pay about **0.5%** for invalidity.
  * At RM6,000 or above: employer **RM104.15**, you **RM29.75**.
* **A third part from June 2026: "LINDUNG 24 Jam" (SKBBK).** This covers accidents outside work, such as at home, on the road or on holiday in Malaysia.
  * Only you pay it, about **0.75%** of your wage, up to **RM44.65** a month on wages above RM5,900. Your employer pays nothing extra.
  * It was compulsory for everyone in June 2026.
  * On 8 July 2026 the Cabinet made it **voluntary for Malaysians, as opt-out**. You were in automatically unless you filed an opt-out between 13 July and 31 August 2026.
  * That window has closed. If you opted out you can opt back in at any time. If you didn't opt out you stay in.
  * **Foreign workers cannot opt out.**
  * The rate is gazetted to rise to about 1.00% from June 2028 and about 1.25% from June 2031.
* **Age matters:**
  * From **age 60**, the invalidity part stops. Your employer then pays only employment injury and you pay nothing, except LINDUNG 24 Jam if you're in it.
  * The same applies to anyone who **first joins SOCSO at age 55 or older**, and, on the Act's wording, to someone already **receiving a SOCSO invalidity pension** who is back at work.
* **Who is not in SOCSO:**
  * **Permanent Federal and State government staff**, pensionable or not, plus the armed forces and police. Temporary and contract government staff **are** covered.
  * Statutory-body and local-authority staff on the pension "New Scheme". Other staff at those bodies are covered.
  * Domestic workers employed by a close relative.
  * Business owners and the self-employed. They have a separate scheme, LINDUNG Kendiri / SKSPS. Workers paid through a platform such as e-hailing or p-hailing have 1.25% taken from each job under the Gig Workers Act since 31 March 2026.
  * Housewives have a separate RM120/year scheme.
  * Foreign workers and most domestic workers **are** covered.

---

## 2. Applicability rules

### 2.1 Who contributes under Act 4

The test is whether you are "employed for wages under a contract of service or apprenticeship" (s.2(5)), minus the First Schedule and gazetted exemptions. There is no wage floor (s.5(1) applies "irrespective of the amount of wages"), so a claim that SOCSO starts at RM1,000 is wrong.

**Settled from gazettes or PERKESO:**

| Person | Act 4? | Category / notes | Confidence |
|---|---|---|---|
| Private-sector employee (contract of service or apprenticeship), any wage, including part-time, contract and temporary | Yes | Category 1 or 2 by age rule (§2.2). The RM6,000 ceiling only caps the contribution. | High (s.5(1); Circular 2/2022 §3.1; Circular 2/2026 §3.2; Guidelines 2025 p.8) |
| Federal or State government **temporary or contract** staff | Yes | Same tables as private. Federal interim-contract hires since 1 Feb 2024 fit here today (see the 2027 watch item below). | High (P.U.(B) 240/2013 para 2(2); FAQ 1 Oct 2024 Q9) |
| Federal or State government **permanent** staff, **pensionable or not** | **No** | 0/0. The test is permanent status, not pension status, so a permanent officer on the EPF option or a Sarawak JBC appointee is also exempt. | High (P.U.(B) 240/2013 para 2(1); Guidelines 2025 p.8; PERKESO Pekerja Bermajikan page, "bertaraf tetap") |
| Statutory body or local authority staff on the Act 239 **"New Scheme"** (opted, deemed to have opted, appointed under or bound by it) | **No** | 0/0. Temporary and contract staff stay in. | High on the text (P.U.(B) 239/2013 para 2). Medium on who is "New Scheme": the Act 239 s.2 definition wasn't read, and EPF-option staff are unclear. |
| Statutory body or local authority staff **not** on the New Scheme | Yes | Same tables. Guidelines 2025 list statutory-body employees as eligible. PERKESO's briefing decks narrow this to contract or temporary staff, and UTM payroll treats all permanent staff as outside. The gazette controls. | Medium |
| Armed forces and police | **No** | Excluded whatever the contract type. | High (First Schedule paras (6), (7)) |
| Foreign workers (valid passport + work pass), including expatriates | Yes | Employment injury since 1 Jan 2019. **Invalidity since 1 Jul 2024**, so **the same Category 1 / 2 tables** as locals, with one difference in the age-55 test (§2.2). **LINDUNG 24 Jam from 1 Jun 2026, mandatory, no opt-out.** So 2025 and Jan–May 2026 have no NEI for them. Not covered by EIS. | High (P.U.(A) 351/2018; P.U.(A) 180/2024; FAQ 3 Jul 2024; FAQ v2.3 Q18–19) |
| Foreign worker **without a valid pass** | **No** | Excluded, including the period before a pass is issued. | High (First Schedule para (12A); P.U.(B) 738/2018) |
| Domestic workers (maid, driver, gardener, nanny, etc.) | Yes, since 1 Jun 2021 | **Local:** employment injury + invalidity + LINDUNG 24 Jam + EIS, invalidity from the start because P.U.(A) 247/2021 deleted the whole exclusion. **Foreign:** employment injury + invalidity (from 1 Jul 2024) + LINDUNG 24 Jam, no EIS. Same Act 4 table. | High |
| Domestic worker employed by a **close relative** (spouse, child, parent, sibling, grandparent, in-law, sibling-in-law, including adopted and step) | **No** | 0/0. | High (P.U.(B) 312/2021 para 2(1)(a), 2(3)(c)) |
| **Foreign** domestic worker with a **foreign employer**, or for any period before a valid Visit Pass (Temporary Employment) | **No** | 0/0. A PR or long-stay pass holder doesn't count as a "foreign employer". | High (P.U.(B) 312/2021 para 2(1)(b)–(c), 2(3)(d)) |
| Spouse employed by a sole proprietor or partnership | Yes, since 1 Jul 2018 | Normal path. Other relatives on the payroll follow the normal s.2(5) test (the Schedule never named them; my reading). | High for spouses (P.U.(A) 144/2018; PERKESO leaflet Sept 2020). Ignore PERKESO's "Formal Employee" page and MIDA's list, which are stale. |
| Sole proprietor or partner (the owner) | **No** (Act 789 instead) | Use the self-employed path, not an unexplained 0/0. LLP members weren't addressed. | High (Guidelines 2025 p.8; Employers' Circular 6/2020) |
| Contract **for** service (a genuine independent contractor) | **No** | Courts look at control, independence, integration and economic reality (High Court appeal reported by Focus Malaysia, 2023; judgment not read). | High for the rule (Guidelines 2025 p.8) |
| Self-employed | **No** (Act 789 instead) | See §2.5. | High |
| Housewives | No (Act 838) | RM120/year, note only. | High |

**Inferred from the statute, no PERKESO statement found.** No exemption instrument names any of these groups. The list check was by title. **[AGC listing]**

| Person | Act 4? | Notes | Confidence |
|---|---|---|---|
| Salaried company director | Likely yes | Normal path on the salary only. Director fees are not wages. A salaried director on RM6,000+ in Jul 2026 pays like anyone else: employer 104.15, employee 74.40. s.108A (directors liable for unpaid contributions) is about liability, not coverage. | Medium |
| Director paid fees only | Likely no | 0/0: no contract of service. | Medium |
| Intern on an employment or apprenticeship contract | Likely yes | Normal path. No minimum allowance. | Medium |
| Industrial-training student paid only an allowance | **Unresolved** | PERKESO's FAQ Bil. 1/2026 lists "pelajar latihan industri" under Act 789 KENDIRI Didik, which suggests not every student is an Act 4 employee, but that's a marketing category, not a ruling. Default is an owner decision. | Low |
| Malaysian posted overseas, Malaysian contract continuing | Likely yes | s.2(5)(i) covers work "elsewhere". LINDUNG 24 Jam pays no benefit for accidents abroad (s.44A), yet nothing reduces the contribution, so warn locals who stayed in. | Medium |
| Malaysian hired abroad by a foreign employer | Likely no | No Malaysian principal employer. | Medium |
| Expatriate whose salary is paid by a foreign parent | Likely yes | s.2(5)(iii) covers staff "lent or let on hire", s.2(19) and s.7(1) make the local principal employer liable. Whether an offshore pay portion counts is unsettled, which only matters if the Malaysian-paid part is RM6,000 or less. | Medium |

**Casual workers.** First Schedule para (2) excludes "any person whose employment is of casual nature **and** who is employed otherwise than for the purposes of the employer's industry". Both limbs must apply, and "industry" is defined broadly (s.2(10)). So a weekend waiter at a cafe is covered, while someone a shop owner hires once to paint his own house may be excluded (my illustration, not PERKESO's). **Translation trap:** the Malay Schedule says "sambilan" for casual, while PERKESO's FAQ uses "sambilan" for part-timers, who **are** covered. No menu option is proposed; a note is enough.

**2027 watch item, government hiring.** Since 1 Feb 2024, new Federal hires are on "Lantikan Kontrak (Interim)" for 3 years or until a new permanent method starts (JPA, 24 Jan 2024). The Edge reports the first contracts end 31 Jan 2027. If they convert to permanent, P.U.(B) 240/2013 para 2(1) would exempt them unless amended; para 3 only protects benefits already earned. A 2024 statement said new hires would contribute to EPF and Perkeso (press, not law). No Act 4 ruling found.

### 2.2 First vs Second Category (the age rule)

Sources: Act 4 First Schedule para (12) with s.6(2); PERKESO Pekeliling Majikan Bil. 2/2026 para 5.1; Employers' Circular 2/2022 para 3.5; foreign-worker FAQ (2024).

* **First Category** covers employment injury + invalidity, plus non-employment injury from Jun 2026. It applies to everyone not in the Second Category.
* **Second Category** covers employment injury only, plus non-employment injury from Jun 2026. The employee pays nothing except NEI. It applies to:
  * **every employee who has reached 60** and is still working, *regardless of contribution history*;
  * employees who had **already reached 55 with no contributions payable before 55**; and
  * **a certified invalid receiving an invalidity pension, at any age** (First Schedule para (12)(iii)). P.U.(A) 180/2024 kept this limb and deleted only (iv); A1788 doesn't touch the Schedule. *Medium confidence:* PERKESO's circulars list only the 55 and 60 triggers, and no PERKESO document applies this limb to working pensioners. The case can occur, since s.49(2)(a) suspends the pension only if insurable pay exceeds one third of the prior average wage. Whether a suspended pension still counts is open.
* **"Payable", not "paid".** The Act tests whether contributions were *payable* before 55. If an earlier employer owed contributions and didn't pay, the person stays in Category 1. PERKESO's circulars say "first contributed", which is fine for UI wording.
* **The 55 test is lifetime, not per employer.** Earlier contributions at any age under 55 keep someone in Category 1 until 60.
* **Foreign workers: a different starting point.** PERKESO's Guidelines test age at first entry to the **Invalidity Scheme** (from 1 Jul 2024), not first SOCSO contribution. So a foreign worker aged 55–59 on 1 Jul 2024 is Category 2 even with employment-injury contributions since 2019. PERKESO's calculator note says the same ("reached 55 years and above as of 1st July 2024"). The 2024 FAQ wording is looser. *Medium confidence.*
* **No upper age limit** applies to employment injury or LINDUNG 24 Jam coverage while the person is an employee (Circular 2/2026 §3.3; FAQ v2.3 Q4; employer induction deck).

**When the switch happens (no PERKESO statement, inference from the Act).**

| Case | Inferred rule | Confidence |
|---|---|---|
| Reaching 60 | Category 2 from the **contribution month containing the 60th birthday**. A month is the contribution unit (s.6(7)) and contributions fall due on its last day (s.6(8)), by which time the person is 60. If someone leaves before the birthday in that month, the due date is the last day of employment, so that part-month stays Category 1. | Medium |
| First job in the month of the 55th birthday, continuing to month-end | Category 2, because nothing fell due before 55. | Medium-low. "Payable" might not mean "fallen due", and PERKESO's "mula-mula memasuki skim" could be read as the entry date. |

Payroll vendors split: PayrollPanda and brioHR say the month after; Mynd and Smartouch say the birthday month; none cites a source. So real payslips may show Category 1 in the birthday month. The difference is one month of the invalidity share: RM14.75 each for employee and employer at RM3,000, up to RM29.75 each at the ceiling. NEI doesn't change. With integer-age input, use `age >= 60` and label the input "age at the end of this month". Which month to use is an [owner question](#questions-for-the-owner).

### 2.3 LINDUNG 24 Jam / SKBBK participation rules (complete timeline)

| Date | Event | Source |
|---|---|---|
| 2025-01-02 | PERKESO announces SKBBK as a 2025 priority. | PERKESO media release 020125 |
| 2025-10-30 | Employees' Social Security (Amendment) Bill 2025 first reading. | Malay Mail / Bernama |
| 2025-12-02 / 2025-12-18 | Passed by Dewan Rakyat / Dewan Negara. | Circular 2/2026 §2.3 |
| 2026-02-23 | Royal assent. | Act A1788 |
| 2026-03-05 | Gazetted as **Act A1788**, Akta Keselamatan Sosial Pekerja (Pindaan) 2026. | Act A1788; Circular 2/2026 §2.4 |
| 2026-04-28 | Pekeliling Majikan Bil. 2/2026 issued: all Act 4 employees *must* be registered and contribute. | Circular 2/2026 |
| 2026-05-29 | **P.U.(B) 196/2026** (dated 25 May) appoints the start date and all three phases. P.U.(B) 195/2026 makes the English text of A1788 authoritative. P.U.(A) 206/2026 adds the employer-selection rule (reg 12B) from 1 Jun 2026. | Federal Gazette |
| **2026-06-01** | **In force.** Phase 1 = 0.75% employee share, contribution month June 2026, payable by 15 Jul 2026. | P.U.(B) 196/2026; Circular 2/2026 §5–6; Circular 3/2026 §2.1–2.4 |
| 2026-06-01 to 2026-11-30 (approx.) | Six-month grace period with no penalties for employer NEI non-compliance. | FAQ v2.3 Q41; The Star 30 May 2026 |
| **2026-07-08** | **Cabinet: NEI contribution no longer mandatory, voluntary with immediate effect.** | The Star 8 Jul 2026 (Fahmi Fadzil); FAQ v2.3 Q3, Q11 |
| 2026-07-09 / 10 | KESUMA: voluntary for **local** employees only; foreign workers still mandatory. PERKESO: **opt-out**, not opt-in. Mechanism to be reviewed by end-2026. | PERKESO release 10 Jul 2026; The Star 9 Jul 2026; FAQ v2.3 Q3 |
| **2026-07-13** | Opt-out facility opens (LINDUNG Faedah portal, or a paper "Notis Pelepasan Liabiliti" if the system is offline). | FAQ v2.3 Q5, Q53 |
| **2026-08-31** | **Opt-out window closes.** Locals who didn't opt out are automatically "in", on a "once in, always in" basis. **No opt-out after this date.** | FAQ v2.3 Q10, Q25, Q26 |
| 2026-09-02 | Online opt-back-in opens, with no time limit. | PERKESO release 9 Sep 2026 |
| 2026-09 / 10 | 8.5 million (87.6%) stayed in. About 1.2 million opted out. | PERKESO release 9 Sep 2026; Bernama 17 Oct 2026 |
| Any time after opting out | Opting back in is allowed, effective from the date and time it is submitted, not backdated. That month's NEI is due on the **full** month's wage. | FAQ v2.3 Q6–8, Q45 |
| 2028-06-01 | Phase 2 (1.00%) starts. | P.U.(B) 196/2026; FAQ v2.3 Q35 |
| 2031-06-01 | Phase 3 (1.25%) starts, open-ended. | same |

Other rules:

* **June 2026 is always payable.** It was mandatory and is non-refundable, even for people who later opted out. Employers had to deduct any June shortfall as arrears (FAQ Q11, Q12, Q22). Q13 allows a refund for a non-selected employer where someone has several employers, which is a narrow possible exception. Government payrolls (iGFMAS) did not deduct NEI in June 2026 pay and recovered it later (JANM Pahang notice, 29 Jun 2026).
* **Who pays:** the employee only. The employer deducts and remits (Act A1788 Third Schedule; FAQ Q35–36; Circular 2/2026 §5.2).
* **Covered:** all Act 4 employees, meaning locals, PRs, temporary residents and foreign workers, including contract and part-time staff, with no age limit (FAQ Q2, Q4, Q20). The table amount is added only for **participating** employees: everyone in June 2026, then foreign workers and locals who didn't opt out or who opted back in.
* **Not covered:** the self-employed (Act 789), housewives (Act 838), accidents abroad, illness, and pre-1 June 2026 accidents (Act A1788 s.44A, s.44B, s.96B; FAQ Q50).
* **Category interaction:** NEI sits on top of **both** categories. Category 1 = EI + invalidity + NEI. Category 2 = EI + NEI. The NEI amount for a band is **identical in both categories**.

**What an opt-out does, month by month.** PERKESO has published no month-by-month rule.

| Situation | NEI treatment | Evidence | Confidence |
|---|---|---|---|
| June 2026 | Payable, not refundable, for everyone | FAQ v2.3 Q11, Q12, Q22 | High |
| Filed 13–31 Jul: July and August | None for the whole of July, though cover ran until filing | CEO press conference 10 Jul (The Star, Utusan, Kosmo, NST). No FAQ states it per filing month. | Medium-high |
| Filed in Aug: August | None for the whole of August | Inference from the July treatment | Medium |
| Filed in Aug: **July** | **Unconfirmed** | For "July for everyone": Q14 says refunds run from July, Q11 says June is locked because it was before the decision. For "month of filing": Q14 adds "depending on the eligible opt-out period", and cover ended only at the opt-out (Q47, Q51). | Open |
| Sep–Dec 2026, opted out | None | Window closed 31 Aug | High |

The most this can change is one month of NEI: RM22.15 at RM3,000, RM44.65 at the ceiling. **Refunds** are claimed only by the employer through ASSIST (Q15, Q16), with no published formula or deadline, so real Jul/Aug payslips may show NEI that is later refunded. The amount would be that month's NEI column, not prorated (inference). Early "no refunds" press predates FAQ v2.1. How the calculator should treat this is an [owner question](#questions-for-the-owner).

**New first-time contributors: PERKESO's position changed.**

| Document | What it says for a new local hire |
|---|---|
| FAQ 13 Jul 2026 Q19, Q22; v2.0 Q20, Q23 | May opt out through the portal within 30 days of registration |
| FAQ v2.1 Q28 (2 Aug); English FAQ 13 Aug Q28 | Employer registers and submits the Notice of Release if the worker opts out before the first deduction |
| Panduan Pengguna §5.0 (undated, screenshots 1–2 Sep 2026, source URL not recorded) | Shows a new-worker opt-out flow with status "TIDAK MENYERTAI" and declaration date 2026-09-01 |
| **FAQ v2.3** (13 Oct 2026; still the linked version) | Q26: no opt-out after 31 Aug, including all employees in PERKESO's database. Q27: a first-time worker "adalah mandatori untuk mencarum". Q29 drops the Notice of Release. |

*Reading, medium confidence:* the newest document says mandatory and the removal looks deliberate. But someone hired around Aug–Oct 2026 may hold a valid opt-out made under the older rule, and the portal route couldn't be tested (it needs a login). So don't block the opt-out flag by join date. Third-party guides with a 30-day window (YYC, Central HR, Info-Tech, Links International) trace to superseded FAQs.

**Legal basis of "voluntary": no gazetted instrument found.** PERKESO describes a "perubahan dasar" following the Cabinet decision and the Minister's instruction, with the signed release serving as "asas perundangan" (release of 10 Jul 2026). The Minister said findings would go to Parliament as proposed Act 4 amendments "if needed". s.5 and A1788 s.3 are unamended. **[AGC listing]** Federal Legislation listings saved on 5 Nov 2026 (newest entries P.U.(B) 447/2026 published 3 Nov and P.U.(A) 383/2026 published 4 Nov) show nothing under Act 4 or A1788 after 29 May 2026, and no 2026 title elsewhere mentions social security. PERKESO's circulars stop at Bil. 3/2026. That's a check of titles in a snapshot, not proof, and the listing part may have to be dropped depending on the owner's decision (see the [AGC listing note](#agc-listing-note)). The other evidence stands without it: PERKESO's own statements and pages, and the bill lists. The legal basis is an open risk for 2027, but it changes no amount today.

### 2.4 Which wages count (shared with EIS)

Act 4 s.2(24) defines wages as "all remuneration payable in money by an employer to an employee including any payment in respect of leave, holidays, overtime, and extra work on holidays". It **excludes**:

1. contributions payable **by the principal or immediate employer** to a pension or provident fund or under Act 4;
2. any travelling allowance or the value of any travelling concession;
3. any sum paid to defray special expenses incurred because of the job;
4. any gratuity payable on discharge or retirement;
5. **annual bonus**;
6. any other remuneration prescribed by regulation. None was found, but the General Regulations 1971 weren't read.

A1724 and A1788 didn't touch this definition, so it's the same for 2025, 2026 and the 2027 template. LINDUNG 24 Jam uses it too (FAQ v2.3 Q37). PERKESO's FAQ paraphrases exclusion 1 as "caruman statutori", which is looser than the Act.

**Use the wage before employee deductions.** Exclusion 1 covers only the employer's own contributions. The employee's EPF, SOCSO and EIS shares come out of wages (s.7(2)), so they aren't subtracted. Subtracting 11% EPF from RM5,000 would move band 54 to band 49 and understate the employee's deduction by RM6.30 a month. *This reading rests on the Act's text and PERKESO's "payments by an employer"; no PERKESO document says it outright.*

**Item by item.** PERKESO's Guidelines 2025 and leaflets list as wages: salary, overtime, commissions and service charges, leave payments, and "allowances such as incentives, shift, food/meal, cost of living, housing and etc". As non-wages they list employer payments to statutory funds, travelling claims, gratuity or payments for dismissal or retrenchment, and annual bonus. Everything beyond that list is a reading of the text, because **no item-level PERKESO ruling or Malaysian decision was found** (free sources only; CLJ and MLJ weren't available).

| Item | Treatment | Basis | Confidence |
|---|---|---|---|
| Basic salary, overtime, leave and holiday pay, extra work on holidays | **Count** | s.2(24) | High |
| Commission, service charge | **Count** | PERKESO Guidelines 2025 and leaflets | High |
| Allowances for incentive, shift, meal, cost of living, housing, **fixed or variable** | **Count** | PERKESO list; "all remuneration" | High |
| Fixed phone allowance | **Count**, unless it really reimburses work phone costs | Not travel; "allowances… and etc" | Medium |
| Bonus or incentive paid more often than yearly (monthly, quarterly, half-yearly) | **Count** | Only "annual" bonus is excluded. Label doesn't decide it. | Medium-high |
| Annual bonus, including annual performance bonus | **Exclude** | s.2(24)(e) | High |
| 13th-month or AWS paid once a year | Exclude | Treated as annual bonus; no source addresses AWS | Medium-low |
| Festive bonus paid once a year | Exclude | Treated as annual bonus; one uncited vendor blog | Low-medium |
| Incentive paid once a year | Unresolved | | Low |
| Ex-gratia | Unresolved. A true one-off gift is arguably not remuneration; a recurring one looks like wages. | | Low |
| Sign-on bonus | Count on the literal text, since it isn't annual | No source | Low |
| Travel or mileage claims; toll or parking claims against receipts; expense reimbursements | **Exclude** | s.2(24)(b)–(c) | High |
| **Fixed monthly travel, transport, petrol, toll or parking allowance** | **Real conflict.** The Act says "any travelling allowance". PERKESO's booklets exclude only *claims*, and its official Threads post (7 Feb 2026) counts "elaun… pengangkutan". Vendors split. | [Owner question](#questions-for-the-owner) | Unresolved |
| Gratuity on discharge or retirement; retrenchment or dismissal payments | **Exclude** | s.2(24)(d); PERKESO list | High |
| Payment in lieu of notice from the employer | Exclude. Notice actually worked is ordinary wages. | Fits PERKESO's "payments for dismissal" | Medium |
| Leave encashment on resignation | **Count**, in the final wage month | "any payment in respect of leave" | Medium |
| Director fees | Exclude | Not wages under a contract of service | Medium |

Indian ESI cases don't transfer. *Whirlpool v ESIC* excluded a quarterly incentive because India's definition has a limb Act 4 lacks. PERKESO's induction note saying "bonus tidak termasuk" drops the word "annual" and shouldn't be relied on.

**Which month a wage belongs to.** "Monthly wages" means wages **payable** for all wage periods **ending in** that month (Third Schedule para 1A up to May 2026; A1788 para 2 from June 2026). It isn't the pay date. So overtime or commission with its own cut-off belongs to the month its wage period ends.

**Arrears and backdated increments: the month earned, not the month paid** (medium-high; statutory text plus PERKESO's systems, with no decision on increments). s.9(1) charges contribution for each month in respect of which wages are payable. The s.7(2) proviso lets the employee share come out of the arrears payment. ASSIST has an "Arrears Contribution" function and the text file carries a per-record contribution month. So:

* Re-run each earned month with its corrected wage, using that month's table, category and NEI status.
* Arrears for Oct 2024–May 2026 use `socso-act4-2024-10` with **no NEI**, even if paid after 1 June 2026.
* June 2026 arrears carry NEI for everyone. July 2026 onward follows that month's participation.
* Months before Oct 2024 need the older RM5,000-ceiling table, which isn't in the config. Warn instead of computing.
* Payroll software may lump arrears into the current month, so payslips can differ. Whether 6% late interest applies to a later-awarded increment wasn't established.

The old app looked up the band on `monthlyGrossSalary`, which is right only if that figure excludes the items above. EIS (Act 800) has the same core wording, but item-level confirmation for it is on the text only. EPF differs (bonus in, overtime out; see `epf.md`), so keep separate flags per scheme.

### 2.5 Self-employed (Act 789: LINDUNG Kendiri, formerly SKSPS) and platform gig workers (Act 872)

| Plan | Insured monthly earning | Monthly | Yearly |
|---|---|---|---|
| 1 | RM1,050 | RM13.10 | RM157.20 |
| 2 | RM1,550 | RM19.40 | RM232.80 |
| 3 | RM2,950 | RM36.90 | RM442.80 |
| 4 | RM3,950 | RM49.40 | RM592.80 |

* The contribution is about 1.25% of insured earnings. **Store the table.** The amounts fit only at the nearest 10 sen, because each is a tie at 5 sen (13.125 → 13.10, 19.375 → 19.40). It covers self-employment injury only: no invalidity and no LINDUNG 24 Jam.
* **Status of the table:** 2025 confirmed (FAQ Bil. 1/2025 Jadual 1; P.U.(A) 229/2024 Schedule for hawkers, which sets 12-month amounts, so monthly figures may not apply to hawkers). 2026 confirmed (FAQ Bil. 1/2026; FAQ Bil. 2/2026 Q9). 2027 carried forward: no change instrument found as of 5 Nov 2026, not positively confirmed.
* **Mandatory sectors under Act 789:** passenger transport (e-hailing, taxi; from 2017), goods or food transport (p-hailing; P.U.(A) 372/2021 from 1 Oct 2021, though PERKESO's 2024 release says 2022), and hawkers (from 1 Jan 2025 after a transition from 1 Sep 2024). The other 17 sectors are voluntary.

**Platform gig workers, from 31 March 2026 (Gig Workers Act 2025 [Act 872]; P.U.(A) 143/2026).** This is a separate route that the plan picker doesn't describe.

* **Who:** anyone paid through a platform, including e-hailing, p-hailing, childminders and helpers, maintenance and domestic services. So the **route**, not just the sector, decides it: Household Services is a voluntary Act 789 sector, yet a platform-based domestic worker is mandatory. Non-platform gig workers stay voluntary (FAQ Bil. 2/2026 Q5, Q13).
* **How much:** **1.25% of each completed job**, not of insured earnings, collected in a wallet (Q8; P.U.(A) 143/2026 reg 2).
* **Plan:** defaults to Plan 1 at RM157.20/yr. Deductions continue up to 24 months' worth even after Plan 1 is reached. The worker tops up any shortfall and may upgrade (Q9, Q15, Q18).
* **Rollout:** uneven. PERKESO's 25 Apr 2026 release put on-boarding at about 2%, and Q17 allows a one-off payment where the platform isn't ready. The minister reported enforcement against platforms from 1 Oct 2026, and 1.28 million registered by 18 Sep 2026 (Hansard 3 Nov 2026).
* **Not read:** Act 872 itself and P.U.(B) 122/2026.

**Government matching.** Store RM amounts, not percentages: a true 70% of RM232.80 would be RM162.96, not the published RM162.80.

| Year | Matching | Application window | Status |
|---|---|---|---|
| 2025 | **SPS Padanan Caruman 3.0:** contributor RM70.00, Government RM162.80, Plan 2, 13 target categories including hawkers (SPS Jaja 4.0) and platform workers (SPS Gig 5.0), so not limited to non-mandatory sectors. **SPS Madani 3.0:** Government pays all RM232.80 for 3 target groups. | 13 Mar – 31 Dec 2025 | Official (FAQ Bil. 1/2025; PERKESO release 22 Oct 2024) |
| 2026 | **Padanan70:** first-time contributor in a non-mandatory sector pays RM70.00, Government RM162.80. **Padanan50:** RM116.40 each, for a renewal in a non-mandatory sector, or someone with earlier mandatory contributions now contributing in a non-mandatory sector. **Mandatory-sector contributors aren't eligible**, first-time or renewal. Plan 2 only, 12 months' cover, one initiative per person, 11 target categories. | 6 Apr – 31 Dec 2026 (end date subject to Government decision). Nothing found for 1 Jan – 5 Apr. | Official (FAQ Bil. 1/2026) |
| 2027 | 70% for 200,000+ self-employed in 17 non-mandatory sectors. 35% for e-hailing and p-hailing, 50% if the platform co-funds. Income cap RM3,000 and RM30 million allocation come only from the minister via Bernama (medium confidence). A RM160 million Government-Grab package includes SOCSO contributions; how it interacts isn't stated. | Unpublished | **Official proposal (MOF speech, PERKESO release 11 Oct 2026). RM amounts, plan, renewal tier, eligibility and dates unpublished.** Don't assume 2026 rolls over. |

**Two loose ends closed.**

* "Mandatory Self-Employment Coverage" in Budget 2027 summaries is **adviser wording for the tax relief, not a new mandate**. MOF's annex still lists 3 mandatory and 17 non-mandatory sectors. **[AGC listing]** No P.U.(A) under Act 789 has changed sectors, plans or the rate since P.U.(A) 229/2024, apart from Supply regulations (titles only).
* The **Act 789 amendment** reported in May 2026 is about Malaysians working **abroad** (the "Traveller Scheme", starting with about 480,000 Johor–Singapore commuters), not domestic sectors. It was **untabled as of 5 Nov 2026**: not on the Dewan Rakyat or Dewan Negara bill lists, and an MP was still asking when it would be tabled on 20 Oct 2026. The minister said on 17–18 Oct it would come in the current sitting, so it could still appear. Watch item only. It would add a separate path outside Malaysian payroll. "Less than RM1 per day" is an early press estimate; don't use it.

### 2.6 Housewives (Act 838, SKSSR / LINDUNG Suri). Note only

RM120 paid in advance for 12 months (PERKESO contribution page). For Malaysian housewives who first register before 55 (press). Not part of take-home pay.

### 2.7 Wage ceiling history and status

| Effective | Ceiling | Source |
|---|---|---|
| 1 Sep 2022 | RM4,000 → RM5,000 | Act A1658; Employers' Circular 2/2022 |
| **1 Oct 2024** | RM5,000 → **RM6,000** | **Act A1724** s.2 amending s.5(2) (royal assent 11 Sep 2024, gazetted 25 Sep 2024); P.U.(B) 381/2024 (listing row: commencement 01/10/2024; **[AGC listing]**); Employers' Circular 3/2024 para 3.3 (contributions for the month of October 2024); PERKESO FAQ 1 Oct 2024. No-penalty transition for employers: 1 Oct 2024 to 31 Mar 2025. |
| 2025, 2026 | No change | Act A1788 Third Schedule tops out at "exceeds RM6,000"; PERKESO release 1 Jun 2026; FAQ 13 Aug 2026 ("current wage ceiling of RM6,000") |
| 2027 | **No change announced** as of 5 Nov 2026 | MOF Budget 2027 speech and tax measures; PERKESO release 11 Oct 2026; Parliament bill list to D.R.27/2026 has no Act 4 bill. The ceiling has only moved by amending the Act, so a later bill could change it. |

The transition meant no penalty, not a separate table. Employers still had to comply (FAQ Q7, Q8), so the amounts due didn't change, though a real Jan–Mar 2025 payslip from a late employer may differ.

---

## 3. Exact algorithm

```
input: periodDate (contribution month), monthlyWage (Act 4 wages before employee
         deductions, §2.4, held in integer sen),
       age (age at the end of the contribution month),
       employment: 'private' | 'domestic' | 'govTempContract' | 'govPermanent'
                 | 'statutoryLocalAuthority' | 'armedForcesPolice' | 'selfEmployed',
       residency: 'local' | 'foreign',
       statutoryNewScheme: boolean          // only for statutoryLocalAuthority
       exempt: boolean                      // no contract of service (fees-only director),
                                            // domestic exemption (§2.1), foreign worker
                                            // without a valid pass
       firstContributedBefore55: boolean    // 55 <= age < 60; for foreign workers means
                                            // first entry to the Invalidity Scheme
       receivingInvalidityPension: boolean  // advanced, default false
       nei: { optedOut: boolean }           // only for local AND periodDate >= 2026-07
```

1. **Applicability.**
   * `govPermanent` or `armedForcesPolice`: Act 4 does not apply, return 0/0.
   * `statutoryLocalAuthority` with `statutoryNewScheme`: return 0/0 (P.U.(B) 239/2013). Temporary and contract staff should answer `statutoryNewScheme = false`.
   * `exempt`: return 0/0 with the reason.
   * `selfEmployed`: Act 4 does not apply. Use the Act 789 plan table (user picks a plan; no employer share). Platform gig workers are different (§2.5): 1.25% of each job.
   * All other cases continue.
2. **Category.**
   * `age >= 60` → Category 2.
   * Else if `age >= 55 && !firstContributedBefore55` → Category 2.
   * Else if `receivingInvalidityPension` → Category 2.
   * Else → Category 1.
3. **Pick the period** from `socso-config.json` by `periodDate` (`from <= date <= to`). This gives the table id, the phase, and whether NEI exists and is mandatory or opt-out.
4. **If no wages are payable for the month** (`monthlyWage <= 0`), there is no contribution: return 0/0. s.9(1) charges "for each month in respect of the whole or part of which wages are payable… and not otherwise". The test is wages *payable*, not paid, so wages owed but unpaid still attract contribution. Always guard this explicitly, since a naive `wage <= upTo` scan would return band 1 for RM0.
5. **Band lookup.** Find the first band with `wageAbove < monthlyWage <= wageUpTo`. The last band has `wageUpTo = null`. Do **not** pre-round the wage. RM5,000.00 falls in the 4,900–5,000 band, while RM5,000.01 falls in the 5,000–5,100 band. RM5,900.00 falls in the 5,800–5,900 band (NEI 43.85), while RM5,900.01 falls in the 5,900–6,000 band (NEI 44.65). Do **not** compute rate × wage; the amounts are statutory table values (see §3.1). Hold the wage in integer sen too: summing floats can drift across a boundary (50,000 × 0.1 gives 5000.0000000006585, which lands in band 55).
6. **Amounts:**
   * Category 1:
     * employer = `employerEmploymentInjury + employerInvalidity`
     * employee = `employeeInvalidity`
   * Category 2:
     * employer = `employerEmploymentInjury`
     * employee = 0
   * NEI applies (`exists`) when:
     * the period is `mandatory`; or
     * the period is `default-in-opt-out` or `default-in-opt-out-closed` and `residency === 'foreign' || !optedOut`.
   * When NEI applies: employee += `employeeNonEmploymentInjury` (same value in both categories).
   * Advanced: if the user has two or more employers and this is not the employer chosen for NEI, skip NEI for this job (s.9(3)).
7. **No further rounding.** All table values are already exact multiples of 5 sen. Sum them as integers in sen to avoid floating-point drift.
8. **Multiple jobs (advanced).** Employment injury and invalidity are computed **per employer** on that employer's wage, and the RM6,000 ceiling applies per job. Don't add the wages together. This is a strong inference: no provision says it in those words, but s.6(9)–(10) expect two or more contributions for the same person in a month and count them as one only for benefits, s.7 has each principal employer pay and deduct on the wages it pays, and s.9(3) carves out only NEI. NEI goes through **at most one** employer: zero times for an opted-out local, otherwise once, on that employer's band.
9. **Arrears (advanced).** Never add arrears to the current month's wage. For each `{earnedMonth, amount}`, re-run steps 2–7 for that month with the corrected wage, then show the difference from what was already paid. Earned months before 2024-10 are out of config: warn instead of computing.

### 3.1 How the band amounts are built (derived and verified, not used for computation)

Act A1788's Fourth Schedule para 4 gives each band an **assumed monthly wage**:

* RM20, 40, 60, 85, 120, 170 and 250 for the 7 lowest bands;
* then the band midpoint (350, 450, …, 5,950);
* RM5,950 for the above-RM6,000 band.

Testing every column against assumed wage × rate (script output, 65 bands):

| Column | Rule that reproduces it | Exceptions |
|---|---|---|
| Invalidity (employer = employee) | 0.5% × assumed wage, rounded to the nearest 5 sen, ties to even | none (65/65) |
| Employment injury (employer) | 1.25% × assumed wage, nearest 5 sen, ties to even | bands ≤RM30, RM50–70 and RM70–100 are 5 sen higher (legacy) |
| Category 1 employer | = EI + invalidity | none |
| NEI Phase 1 (0.75%) | **= EI − invalidity**. Not a clean 0.75% rounding: e.g. 0.75% × 1,650 = 12.375 → table 12.35, but 0.75% × 5,950 = 44.625 → table 44.65 | band RM70–100 (0.65 instead of 0.70) |
| NEI Phase 2 (1.00%) | 1% × assumed wage (exact) | bands ≤RM30, RM50–70, RM70–100 (+5 sen) |
| NEI Phase 3 (1.25%) | = EI | none |

Conclusion: the amounts follow "rate × band midpoint" closely but not exactly. Ties go different ways per column and the bottom bands are irregular. **Always use the lookup table.** Third-party sites that compute "0.75% × wage" are wrong. For example, they give RM45.00 at the ceiling (official RM44.65) and RM12.75 at RM1,700 (official RM12.35).

---

## 4. Per-year config

Full machine-readable version: `data/socso-config.json`.

### 2025 (confirmed)

| Period | Table | Ceiling | NEI |
|---|---|---|---|
| 2025-01-01 → 2025-12-31 | `socso-act4-2024-10` (`socso-act4-2025.json`) | RM6,000 | does not exist |

No mid-year changes in 2025. The employer no-penalty transition for the RM6,000 ceiling ended 31 Mar 2025; the amounts due were unaffected. Hawkers became mandatory under Act 789 from 1 Jan 2025 (§2.5).

### 2026 (confirmed, four periods)

| Period | Table | NEI (local) | NEI (foreign) |
|---|---|---|---|
| 2026-01-01 → 2026-05-31 | `socso-act4-2024-10` | does not exist | does not exist |
| 2026-06-01 → 2026-06-30 | `socso-act4-a1788` phase 1 | **mandatory** | mandatory |
| 2026-07-01 → 2026-08-31 | `socso-act4-a1788` phase 1 | default **in**; opt-out window open 13 Jul – 31 Aug | mandatory |
| 2026-09-01 → 2026-12-31 | `socso-act4-a1788` phase 1 | default **in**; opt-out closed; opted-out users stay out unless they opt back in | mandatory |

The last two periods have identical amounts; only the label differs. Every relevant mid-year date in 2026: **1 Jun** (A1788 in force), **8 Jul** (voluntary decision), **13 Jul** (opt-out opens), **31 Aug** (opt-out closes), **1 Sep** (no more opt-out), **2 Sep** (online opt-back-in). The six-month employer penalty grace period from 1 Jun has no effect on amounts. The calculator works per contribution month, so the 8 Jul decision is modelled as starting in contribution month July (FAQ Q14, Q17). Separately, **31 Mar 2026** starts the Act 872 platform deduction, and matching applications run 6 Apr – 31 Dec 2026 (§2.5).

### 2027 (template, UNCONFIRMED)

| Period | Table | NEI (local) | NEI (foreign) |
|---|---|---|---|
| 2027-01-01 → 2027-12-31 | `socso-act4-a1788` phase 1 (0.75%) | default in; opt-out closed; opted-out users stay out unless they opt back in | mandatory |

Basis:

* P.U.(B) 196/2026 fixes Phase 1 until 31 May 2028.
* Budget 2027 (9 Oct 2026) has no Act 4 rate or ceiling change. MOF's speech and tax measures, PERKESO's 11 Oct release and the bill lists all agree. This is "none announced as of 5 Nov 2026", not a guarantee.
* **Risks to re-check in Jan 2027:**
  * the PERKESO/KESUMA year-end review of the LINDUNG 24 Jam mechanism, which could lead to an Act 4 amendment;
  * the Federal interim-contract hires (§2.1);
  * the Act 789 Traveller Scheme and the 2027 matching details (§2.5).

**Budget 2027 tax items (official proposal, not yet law).** MOF Budget 2027 tax measures, Appendix 9 (BM Lampiran 9), from **YA2027**:

1. The RM350 SOCSO relief stays at RM350, and its scope adds **mandatory** LINDUNG Kendiri contributions for the 3 mandatory sectors.
2. A new additional relief of up to **RM150** covers **voluntary** contributions to LINDUNG 24 and to the **17 non-mandatory** LINDUNG Kendiri sectors.

Details:

* **Status:** no Finance Bill was listed on 5 Nov 2026. Last year's had first reading on 18 Nov, so one may still come. By that pattern it'd be "Finance Bill 2026".
* **Conflict:** PERKESO's 11 Oct release and Bernama say mandatory Kendiri contributors get the RM150. MOF puts them in the RM350. MOF controls because it sets the tax proposal, but only the bill will settle it.
* **Still open:** whether voluntary SKBBK goes only into the RM150 or can also fill unused RM350 room (at RM3,000 that's relief of RM397.80 vs RM500). Also whether the RM150 is one combined cap, and how non-voluntary SKBBK (foreign workers, first-time contributors) is treated. RM500 as a total is an inference; MOF doesn't state it. Contributors who stayed in by default appear to count as voluntary (PERKESO counts 8.5 million), but that isn't a tax ruling.

**YA2026: does SKBBK count toward the RM350?** Probably yes, from contribution month June 2026. This is a reading of the statute, medium-high confidence, with no LHDN or PERKESO statement. LHDN PR 7/2025 para 6.10.1 and the TP1 and BE notes allow contributions "pursuant to" Act 4 or Act 800. A1788 s.3 makes SKBBK a contribution under Act 4, and LHDN's 2019 reply to CTIM used the same test. The Budget 2027 change doesn't reach back. The effect is small: SOCSO+EIS alone reaches RM350 from the RM4,200–4,300 band, or from the RM2,600–2,700 band with 7 months of SKBBK. The tax difference is roughly RM1–4 a year for full-year employees and RM0 at higher wages. It's larger for part-year and 60+ users: a 60+ employee on RM5,000 pays 7 × RM37.15 = RM260.05 in SKBBK, worth about RM16 at 6%. This affects `tax-ya2026.json` and PCB, not the SOCSO tables. See `pcb.md`. Re-check at Finance Bill first reading, the YA2026 e-BE notes, and the 2027 TP1 notes.

### Future (gazetted, for completeness)

| Period | Table |
|---|---|
| 2028-01-01 → 2028-05-31 | phase 1 (still NEI ≈0.75%) |
| 2028-06-01 → 2031-05-31 | phase 2 (NEI ≈1.00%) |
| 2031-06-01 → open | phase 3 (NEI ≈1.25%) |

The first row closes a gap: the earlier config had no period for Jan–May 2028. Phase tables and dates are law. The ceiling and participation carried on these periods are today's rules, not forecasts.

---

## 5. Proposed TypeScript-shaped config schema

```ts
/** RM amounts are stored as numbers with at most 2 dp; compute in integer sen. */
type ISODate = `${number}-${number}-${number}`;

interface Act4Band {
  no: number;                 // 1..65
  wageAbove: number;          // exclusive lower bound (0 for band 1)
  wageUpTo: number | null;    // inclusive upper bound; null = "exceeds RM6,000"
  assumedMonthlyWage: number; // Fourth Schedule; informational
  firstCategory: {
    employerEmploymentInjury: number;
    employerInvalidity: number;
    employer: number;                      // EI + invalidity
    employeeInvalidity: number;
    employeeNonEmploymentInjury?: number;  // present from Jun 2026 tables
  };
  secondCategory: {
    employerEmploymentInjury: number;
    employer: number;
    employeeNonEmploymentInjury?: number;
  };
}

interface Act4Table {
  id: 'socso-act4-2024-10' | 'socso-act4-a1788';
  phase?: 1 | 2 | 3;
  wageCeiling: number;        // 6000
  bands: Act4Band[];
}

type NeiParticipation =
  | { exists: false }
  | {
      exists: true;
      local: 'mandatory' | 'default-in-opt-out' | 'default-in-opt-out-closed';
      foreign: 'mandatory';
      keyDates?: Record<string, ISODate>;
      legalBasis?: string;
      reVerify?: string;
    };

interface SocsoPeriod {
  from: ISODate;              // inclusive, first day of a contribution month
  to: ISODate | null;         // inclusive
  table: { id: Act4Table['id']; phase?: 1 | 2 | 3 };
  wageCeiling: number;
  nonEmploymentInjury: NeiParticipation;
  unconfirmed?: boolean;
  notes?: string[];
}

interface SocsoYearConfig {
  year: number;
  status: 'confirmed' | 'template-unconfirmed';
  periods: SocsoPeriod[];     // contiguous, non-overlapping, cover the year
  sources: { title: string; url: string; accessed: ISODate }[];
}

type Confidence = 'high' | 'medium-high' | 'medium' | 'medium-low' | 'low-medium' | 'low';

/** Year-independent rules: the same for 2025, 2026 and the 2027 template. */
interface SocsoRules {
  categoryRules: {
    secondCategoryIf: { rule: string; source: string; confidence: Confidence }[];
    foreignWorkerAge55Test: { rule: string; source: string; confidence: Confidence };
    ageTestDate: { value: 'lastDayOfContributionMonth'; status: 'owner-decision'; confidence: Confidence };
  };
  coverage: {
    rules: {
      group: string;
      applicable: boolean | null;   // null = unresolved
      route?: 'selfEmployed';
      from?: ISODate;
      basis: string;
      unverified?: boolean;         // inferred; UI should say "check your payslip"
      confidence: Confidence;
      status?: 'owner-decision';
    }[];
  };
  wageRules: {
    wageComponents: {
      counted: { item: string; confidence: Confidence }[];
      excluded: { item: string; confidence: Confidence }[];
      ownerDecision: { item: string; status: string; recommended?: string }[];
    };
    arrears: { rule: string; basis: string; confidence: Confidence; outOfConfig: string };
  };
}

interface SelfEmployedConfig {
  plans: { plan: 1 | 2 | 3 | 4; insuredMonthlyEarning: number; monthly: number; yearly: number }[];
  planStatus: Record<string, string>;   // per year; 2027 is 'carried-forward'
  mandatorySectors: { sector: string; from?: ISODate; fromYear?: number }[];
  platformGigWorkersAct872: {
    from: ISODate;                       // 2026-03-31
    deduction: string;                   // 1.25% of each completed job
    defaultPlan: 1;
    continuesUpToMonths: 24;
  };
  governmentMatching: Record<string, {
    status: string;
    applicationWindow: { from: ISODate; to: ISODate } | null;
    plan: 2 | null;
    rmAmounts?: null;                    // 2027: unpublished, never compute
  }>;
}

interface SocsoInput {
  periodDate: ISODate;
  monthlyWage: number;        // Act 4 wages for wage periods ending this month, BEFORE employee EPF/SOCSO/EIS
  age: number;                // age at the end of the contribution month
  employment: 'private' | 'domestic' | 'govTempContract' | 'govPermanent'
            | 'statutoryLocalAuthority' | 'armedForcesPolice' | 'selfEmployed';
  residency: 'local' | 'foreign';
  statutoryNewScheme?: boolean;          // default false
  exempt?: boolean;                      // fees-only director, domestic exemption, no valid pass
  firstContributedBefore55?: boolean;    // default true; foreign: first entry to Invalidity Scheme
  receivingInvalidityPension?: boolean;  // default false
  neiOptedOut?: boolean;                 // default false; ignored for foreign or pre-Jul-2026
  neiPaidByThisEmployer?: boolean;       // default true (multi-employer edge case)
  arrears?: { earnedMonth: ISODate; amount: number }[];
}

interface SocsoResult {
  applicable: boolean;
  reason?: string;            // e.g. 'permanent government staff', 'no contract of service'
  category: 1 | 2 | null;
  bandNo: number | null;
  employer: { employmentInjury: number; invalidity: number; total: number };
  employee: { invalidity: number; nonEmploymentInjury: number; total: number };
  periodUsed: { from: ISODate; to: ISODate | null; unconfirmed: boolean };
}
```

The earlier enum values `govContract` and `govPensionable` are renamed because the legal test is temporary or contract vs permanent, not pensionable. `eis.md` describes a shared employment dropdown with different values, so the cross-scheme pass needs to reconcile them.

---

## 6. Worked examples

All amounts are taken from the official tables via `data/*.json`, and were recomputed on 2026-11-05.

* Ages: "Age 30" is Category 1. "Age 61" is Category 2, whatever the contribution history. "With NEI" means a local who didn't opt out, or any foreign worker.
* Checks against official sources:
  * Every Phase 1 row matches PERKESO's published PDFs (EN and BM), Act A1788 and Circular 2/2026 Lampiran 1–2. The RM6,000 and RM10,000 rows also match PERKESO's 1 Oct 2024 FAQ (RM133.90 Category 1 total, RM74.40 Category 2).
  * The RM1,750 row reproduces The Star's 30 May 2026 example (total RM39.40 → RM52.55, NEI RM13.15). The article labels that band "RM1,600–1,700", but the table puts those amounts in RM1,700–1,800.
  * PERKESO's own online calculator was **not** used; the statutory tables were used instead.

### A. Financial year 2025, and Jan–May 2026 (no NEI)

| # | Wage | Band | Age 30 (Cat 1) employer | Age 30 employee | Age 30 total | Age 61 (Cat 2) employer | Age 61 employee |
|---|---|---|---|---|---|---|---|
| 1 | RM1,500 | 1,400–1,500 | 25.35 | 7.25 | 32.60 | 18.10 | 0.00 |
| 2 | RM3,000 | 2,900–3,000 | 51.65 | 14.75 | 66.40 | 36.90 | 0.00 |
| 3 | RM4,999 | 4,900–5,000 | 86.65 | 24.75 | 111.40 | 61.90 | 0.00 |
| 4 | RM5,000 | 4,900–5,000 | 86.65 | 24.75 | 111.40 | 61.90 | 0.00 |
| 5 | RM6,000 | 5,900–6,000 | 104.15 | 29.75 | 133.90 | 74.40 | 0.00 |
| 6 | RM10,000 | >6,000 | 104.15 | 29.75 | 133.90 | 74.40 | 0.00 |

### B. From June 2026 (Phase 1). Valid for Jun–Dec 2026 and the 2027 template

| # | Wage | Age 30 employer | Age 30 employee, **with** NEI (invalidity + NEI) | Age 30 employee, opted out | Age 30 total with NEI | Age 61 employer | Age 61 employee with NEI | Age 61 employee, opted out |
|---|---|---|---|---|---|---|---|---|
| 7 | RM1,500 | 25.35 | **18.10** (7.25 + 10.85) | 7.25 | 43.45 | 18.10 | **10.85** | 0.00 |
| 8 | RM3,000 | 51.65 | **36.90** (14.75 + 22.15) | 14.75 | 88.55 | 36.90 | **22.15** | 0.00 |
| 9 | RM4,999 | 86.65 | **61.90** (24.75 + 37.15) | 24.75 | 148.55 | 61.90 | **37.15** | 0.00 |
| 10 | RM5,000 | 86.65 | **61.90** (24.75 + 37.15) | 24.75 | 148.55 | 61.90 | **37.15** | 0.00 |
| 11 | RM6,000 | 104.15 | **74.40** (29.75 + 44.65) | 29.75 | 178.55 | 74.40 | **44.65** | 0.00 |
| 12 | RM10,000 | 104.15 | **74.40** (29.75 + 44.65) | 29.75 | 178.55 | 74.40 | **44.65** | 0.00 |
| 12a | RM5,900.00 | 102.35 | **73.10** (29.25 + 43.85) | 29.25 | 175.45 | 73.10 | **43.85** | 0.00 |
| 12b | RM5,900.01 | 104.15 | **74.40** (29.75 + 44.65) | 29.75 | 178.55 | 74.40 | **44.65** | 0.00 |

Notes:

* Employer amounts **do not change** in June 2026.
* June 2026 must use the "with NEI" column for everyone.
* Foreign workers always use "with NEI".
* RM4,999 and RM5,000 share a band. RM5,000.01 would move to the RM5,000–5,100 band:
  * Category 1: employer 88.35, employee 25.25 (+37.85 NEI)
  * Category 2: employer 63.10
* The NEI cap of RM44.65 starts **above** RM5,900, not at it. Code written as `wage >= 5900` would overcharge a round RM5,900 salary by RM0.80.
* Not a coincidence: in Phase 1, "Category 1 employee with NEI" equals "Category 2 employer" for almost every band, because NEI = EI − invalidity (see §3.1).

### C. Edge cases

| # | Case | Result |
|---|---|---|
| 13 | Age 57, **first job ever** (never contributed), RM3,000, Jul 2026, local, not opted out | **Category 2**: employer 36.90, employee 22.15 (NEI only). The old code would give Category 1 (51.65 / 14.75 + NEI). |
| 14 | Age 61, contributed all career, RM3,000, 2025 | **Category 2**: employer 36.90, employee 0. Old code with "contributing before threshold" checked: Category 1 (51.65 / 14.75). **Wrong.** |
| 15 | Foreign worker age 30, RM1,750, Aug 2026 | Category 1: employer 30.65, employee 8.75 + 13.15 = 21.90. No opt-out possible. In 2025 the same worker: 30.65 / 8.75. |
| 16 | Phase 2 preview (Jun 2028), RM6,000, Category 1 | employer 104.15, employee 29.75 + 59.50 = 89.25 |
| 17 | Age 45, receiving an invalidity pension, back at work, RM3,000, not opted out, Jul 2026 | **Category 2** (statute, medium confidence): employer 36.90, employee 22.15. Without the flag: 51.65 / 36.90. In 2025: 36.90 / 0 vs 51.65 / 14.75. |
| 18 | Foreign worker aged 57 on 1 Jul 2024, employment-injury contributions since 2019, RM3,000, Aug 2025 | **Category 2** on the Guidelines wording (medium confidence): employer 36.90, employee 0. |
| 19 | Born 15 Mar 1966, RM3,000: Feb 2026 / Mar 2026 | Feb: 51.65 / 14.75. Mar on the birthday-month reading: 36.90 / 0. On the following-month reading, Mar stays 51.65 / 14.75. |
| 20 | Born 15 Jul 1966, RM3,000, Jul 2026, opted out (filed in July) | Birthday-month reading: employer 36.90, employee 0. |

### D. Who pays nothing

| # | Case | Result |
|---|---|---|
| 21 | Permanent non-pensionable government officer, RM6,000, Aug 2026 | **0 / 0** (P.U.(B) 240/2013). Treating them as contract staff would wrongly give 104.15 / 74.40. |
| 22 | Domestic worker employed by a sibling, RM1,500, 2026 | **0 / 0** (P.U.(B) 312/2021). |
| 23 | Director paid RM3,000 in fees only | **0 / 0** (inferred, medium confidence). |

### E. What goes into the wage

| # | Case | Right | Wrong, and why |
|---|---|---|---|
| 24 | RM5,000 gross, Jul 2026, with NEI | Band 54: employer 86.65, employee 61.90 | Subtracting 11% EPF first (RM4,450, band 49): 77.85 / 55.60. Without NEI, 24.75 vs 22.25. |
| 25 | RM3,000 + RM200 variable shift allowance, with NEI | RM3,200, band 36: employee 39.40 | Dropping the allowance because it isn't fixed: 36.90. |
| 26 | RM3,500 + RM500 **quarterly** bonus, Jun–Dec 2026, with NEI, in the bonus month | RM4,000: employer 69.15, employee 49.40 | Treating it as annual: 60.35 / 43.10. |
| 27 | RM3,500 + RM500 **annual** bonus | No change: 60.35 / 43.10 | Adding the bonus: 69.15 / 49.40. |

### F. Arrears

**Case 28.** RM3,000 raised to RM3,300, backdated to March 2026, paid in July 2026 (arrears RM1,200). Category 1, not opted out.

| Earned month | Employer + | Employee + | Note |
|---|---|---|---|
| Mar, Apr, May 2026 | 5.20 each | 1.50 each | No NEI, old table, even though paid in July |
| Jun 2026 | 5.20 | 1.50 + 2.20 NEI | |
| Jul 2026, normal | 56.85 | 40.60 | Current month at RM3,300 |
| **Total in July pay** | **77.65** | **48.80** | |

The wrong method, RM4,500 all in July, gives employer 77.85 and employee 55.60, overcharging the employee RM6.80.

### G. Multiple employers

Phase 1, Category 1, NEI at employer A, not opted out.

| # | Wages A / B | Employer shares A / B | Employee A / B | Employee total | If NEI wrongly at both | If wages wrongly added |
|---|---|---|---|---|---|---|
| 29 | 3,000 / 2,000 | 51.65 / 34.15 | 36.90 / 9.75 | 46.65 | 61.30 | 61.90 |
| 30 | 6,000 / 6,000 | 104.15 / 104.15 | 74.40 / 29.75 | 104.15 | 148.80 | 74.40 |
| 31 | 7,000 / 500 | 104.15 / 7.85 | 74.40 / 2.25 | 76.65 | 80.00 | 74.40 |

The choice of employer matters. In case 29, NEI is 22.15 at A or 14.65 at B. An opted-out local pays no NEI at either job.

### H. Other

| # | Case | Result |
|---|---|---|
| 32 | Intern on an employment contract, under 60, not opted out, Jul 2026 | RM600: employer 9.65, employee 6.90. RM1,000: employer 16.65, employee 11.90. (Coverage inferred.) |
| 33 | Platform e-hailing driver earning RM3,000 a month in jobs | 1.25% × each job, about RM37.50 a month, not 13.10 or 19.40. My arithmetic: reaches RM314.40 (2 × RM157.20, my reading of the 24-month rule) in about 8.4 months. |
| 34 | Platform worker earning RM1,000 a month in jobs | About RM12.50 a month, RM150 over 12 months, leaving a RM7.20 top-up to Plan 1. |

---

## 7. User-selectable options

These are proposals. Which groups to expose is the owner's call (see [Questions for the owner](#questions-for-the-owner)).

| Option | Show when | Default | Notes |
|---|---|---|---|
| Employment type: private / domestic worker / government (temporary or contract) / government (permanent) / statutory body or local authority / armed forces or police / self-employed | always | private | Permanent government and armed forces or police → SOCSO not applicable. Statutory body → ask about the New Scheme. Self-employed → Act 789 path. |
| "Are you on the pension New Scheme?" | statutory body or local authority | No | Temporary and contract staff answer No. |
| "How are you paid?" helper: salary / director fees only / owner of the business | advanced | salary | Fees only → 0/0 with "check your payslip". Owner → self-employed path. |
| Domestic exemption: employer is a close relative, or foreign worker with a foreign employer | domestic | No | → 0/0. |
| Residency: Malaysian or PR / foreign worker | always (advanced) | Malaysian | Foreign: NEI cannot be opted out; the age-55 test runs from the Invalidity Scheme. Also drives EIS (no EIS for foreigners). |
| "Did you start contributing to SOCSO before age 55?" | 55 ≤ age < 60 | Yes | **Separate** from the EIS age-57 question. Wording can stay "started contributing or working under SOCSO". |
| "Are you receiving a SOCSO invalidity pension?" | advanced | No | → Category 2. Owner question on whether to show it. |
| "LINDUNG 24 Jam: I have a recorded opt-out and haven't opted back in" | local AND period ≥ Jul 2026 | **No** (i.e. paying) | Explain: the window closed 31 Aug 2026; opting back in is possible any time. Not limited to "Jul–Aug 2026" in the label and not blocked by join date (§2.3). |
| Wage composition: basic, allowances, overtime, commission, **bonus with frequency (once a year vs more often)**, travel allowance vs travel claims | progressive detail | basic only | Only Act 4 wages go into the band lookup. Warn that the bonus label doesn't decide it. Don't subtract EPF. |
| Arrears: earned month and amount | advanced | none | Each month is re-run on its own table. |
| Multiple employers: "LINDUNG 24 Jam is deducted at this job" | advanced | Yes | s.9(3). Not a date-driven rule. PERKESO can pick if you don't choose, and the choice can change only on listed grounds (see below). |
| Self-employed plan (1–4), sector, platform route, and matching incentive (first-time / renewal) | self-employed | Plan 2, no matching | Matching is Plan 2 only and non-mandatory only (2026). Platform workers: 1.25% per job, default Plan 1. 2027: treatment pending owner answer. |
| Note for Malaysians posted abroad | posted overseas | hidden | LINDUNG 24 Jam pays nothing for accidents abroad, though the deduction continues. |

**Multiple employers: how the choice works (from 1 June 2026).** P.U.(A) 206/2026 reg 12B applies whenever someone has two or more employers "at any one time": PERKESO gives written notice, and the employee picks one within **30 days of that notice**. People who had two active employers on 1 June 2026 are the first case (Circular 3/2026 paras 4.4–4.5); those who gain a second job later use the same method and time limit (para 4.7). If no choice is made, PERKESO notifies the chosen employer within **14 days** (reg 12B(3), para 4.10), and picks by: (1) the employer named in a NEI benefit application, (2) the employer with the latest contribution, (3) the highest contribution amount, (4) the most contribution months (paras 4.9.1–4.9.4). The choice can change only if the selected job ends, the employer closes, there's a dormant no-wage period, or another employer pays more (FAQ v2.3 Q30). Reg 12B(4) requires notifying PERKESO within 7 days of leaving the chosen employer. FAQ v2.3 doesn't repeat the 30 days, and whether PERKESO still enforces it after 8 July is unverified. It doesn't change any amount, since the calculator takes the choice as an input.

---

## 8. Discrepancies vs the old implementation

Old files: `src/lib/salary/rates/socso-eis.ts`, `socso-eis-bands.ts` and related types, defaults and FAQ.

| # | Old behaviour | Correct behaviour | Severity |
|---|---|---|---|
| D1 | **Category 2 only when first registering at 60+**: `category = age < 60 \|\| contributingBeforeThreshold ? 1 : 2`. | Category 2 applies to **everyone aged ≥ 60** whatever their history, **and** to anyone with no contributions payable before **55**, **and** to a working invalidity pensioner. Existing contributors do *not* stay in Category 1 after 60; invalidity cover ends at 60. | **High.** Overstates employer and employee deductions for every 60+ worker who ticks the box, and for every 55–59-year-old first-time registrant (old code gives them Category 1). |
| D2 | One shared flag `socsoEisContributingBeforeThreshold` for both SOCSO (threshold assumed 60) and EIS (57). | The SOCSO threshold question is "first contributed **before 55**". The EIS question is "before 57". They are different questions; split them. | High |
| D3 | SKBBK is an **optional toggle, off by default**. | From contribution month **June 2026**, NEI is **mandatory** for June 2026 and **default-on** from July 2026. It is mandatory for foreigners. Opt-out was only possible 13 Jul – 31 Aug 2026. Default must be **on** for periods ≥ Jun 2026, and the option should be phrased as "I have a recorded opt-out". | **High.** Understates employee deductions by up to RM44.65/month for most users. |
| D4 | The SKBBK toggle is not date-gated, so a user can add SKBBK to pre-June-2026 payslips. | NEI does not exist before 1 Jun 2026. Gate by period. | Medium |
| D5 | No financial-year or effective-date periods; "only today's rates". | Needs 2025 / 2026 (4 periods) / 2027 config (§4). | High (architecture) |
| D6 | SOCSO applies only to `sector === 'private'`; government always excluded. | Federal and State **temporary and contract** staff contribute under Act 4. **Permanent** staff are excluded, pensionable or not. Statutory-body and local-authority staff are in unless on the New Scheme. Armed forces and police are out. | Medium |
| D7 | No foreign-worker or domestic-worker modelling. | Foreign workers use the same Category 1/2 tables (since 1 Jul 2024), with NEI mandatory from Jun 2026 and no EIS. Domestic workers are covered, except close-relative and foreign-employer cases. | Medium (audience is mostly locals) |
| D8 | Self-employed → SOCSO 0, with no alternative. | Offer Act 789 LINDUNG Kendiri plans (§2.5). Platform e-hailing and p-hailing workers pay 1.25% per job under Act 872 since 31 Mar 2026, which a plan picker doesn't capture. | Low–medium |
| D9 | Band lookup on `monthlyGrossSalary`. | Should use Act 4 wages before employee deductions: excludes annual bonus and travel allowance; includes overtime, commission, non-annual bonus and variable allowances. Fine if "gross" means regular monthly pay. Don't subtract EPF. | Low |
| D10 | Band table: 64 rows; the last row (`upTo: null`) merges the "5,900–6,000" and "exceeds 6,000" bands. | Official table has 65 rows, but bands 64 and 65 have identical amounts. **All amounts match the official table exactly.** No numeric error. Comments say SKBBK is "on top of the classic Invalidity employee contribution" and "does not change the employer share". Both are correct. | None (cosmetic) |
| D11 | FAQ copy: "SKBBK… off by default since most payslips don't reflect it yet". | Wrong since June 2026. NEI is the default and was compulsory in June 2026. Also, the old code cited only the English PDF; the legal source is Act A1788. | Medium (user-facing) |
| D12 | Category 2 still adds SKBBK when enabled. | Correct: NEI applies to Category 2 at the same amount. | none |
| D13 | `round2` applied after summing floats. | OK in practice, but prefer integer sen, for the wage as well as the amounts. | Low |
| D14 | `lookupBand` returns band 1 for a wage of RM0 or below, charging Category 1 RM0.40 employer / RM0.10 employee. | No wages payable means no contribution (s.9(1)). Guard it. `eis.md` D6 records the same bug for EIS. | Low |

---

## 9. Limitations and unverified items

| Item | Status | Confidence |
|---|---|---|
| Act 4 band amounts, both categories, all phases | Parsed from Act A1788 text, re-parsed independently in the deep pass; Phase 1 matched 0/455 cell mismatches against PERKESO's EN and BM PDFs; Circular 2/2026 scans spot-checked. **Limit:** P.U.(B) 195/2026 makes the **English** text of A1788 authoritative, but the Act parsed is the Malay text. The English statutory text wasn't retrieved (the portal and PERKESO rejected direct fetches). | **High** |
| Pre-June-2026 table (Oct 2024 – May 2026) | Enacted **Act A1724** items 55–65 match with 0 differences; Circular 2/2022 bands 1–54 and PERKESO's Guidelines 2025 full table also match. The A1724 copy comes from a law firm's site. P.U.(B) 381/2024 was read as a listing row, not opened **[AGC listing]**; Circular 3/2024 and the FAQ give the same date independently. | **High** |
| Wage ceiling RM6,000 in 2025–2026; none announced for 2027 | Act A1724, Circular 3/2024, PERKESO 2026 documents; MOF Budget 2027 documents and bill lists. | High (2025–26), medium-high (2027: nothing announced, not a guarantee) |
| Phase dates (1 Jun 2026 / 1 Jun 2028 / 1 Jun 2031) | **P.U.(B) 196/2026 read directly.** Circular 2/2026 para 5.3's "dates set by PERKESO" is superseded. FAQ Q35 still says phasing is subject to its effective dates, so dates could be re-gazetted, but none has been. | **High** |
| Voluntary status for locals from 8 Jul 2026 | Cabinet statement, PERKESO release 10 Jul 2026, FAQ v2.3 Q3. **No gazetted instrument found** in PERKESO's page or, **[AGC listing]**, the saved Federal Legislation listings to 3–4 Nov 2026. Title-level check of a snapshot. e-federalgazette didn't resolve. | High as fact; no legal instrument found (medium-high) |
| New entrants after 31 Aug 2026: no opt-out | FAQ v2.3 Q26–27, Q29 say mandatory; earlier FAQs and a portal guide differ (§2.3). The live portal wasn't tested, and an FAQ isn't law. | Medium |
| Effective month of an opt-out filed in Aug 2026 | PERKESO has published no month-by-month rule. No ASSIST refund guide or real employer notification seen. | Medium; July for August filers open |
| Category switch at 60 and first entry at 55 | Inferred from s.6(7)–(8) and First Schedule para (12). General Regulations 1971 unread (reg 32 might address it), ASSIST behaviour not tested, PERKESO not contacted. | Medium (60), medium-low (55) |
| Working invalidity pensioners in Category 2 | First Schedule para (12)(iii) read directly in the 2022 reprint and 2013 BM text; P.U.(A) 180/2024 keeps it. No PERKESO operational statement either way. | Medium |
| Foreign workers' age-55 test from 1 Jul 2024 | Guidelines 2025 and calculator note, vs looser 2024 FAQ wording and para (12)(i). No ruling. | Medium |
| Federal and State permanent staff excluded | **P.U.(B) 240/2013 read directly.** Listed as PRINCIPAL with no revocation in the snapshot **[AGC listing]**. The earlier "Treasury slide" had no source entry and is no longer relied on. | High |
| Statutory-body and local-authority staff | **P.U.(B) 239/2013 read directly.** Act 239 s.2 definition of "New Scheme" not retrieved. EPF-option staff unclear; UTM treats all permanent staff as outside, which is one employer's practice. | High (text), medium (who is in) |
| Domestic workers | P.U.(A) 247/2021 and P.U.(B) 312/2021. No revocation found, though no positive 2026 restatement of the close-relative exemption. The Guidelines repeat it. P.U.(B) 313/2021 lapsed by 31 May 2022. | High |
| Directors, interns, overseas postings, parent-paid expatriates | Inferred from s.2(5). No PERKESO statement, no court decision found (CLJ/MLJ unavailable). P.U.(B) 736/2018 couldn't be opened. | Medium; training students low |
| Wage items beyond PERKESO's list | No item-level ruling or decision. General Regulations 1971 unread, so s.2(24)(f) and the rule on "reckoning of wages" could change the classification. The Threads post was read through a summariser. | Per row in §2.4 |
| Employee EPF stays in wages | Act's text and PERKESO's wording. No PERKESO statement or worked example says so outright. | Medium-high |
| Arrears go to the month earned | Statutory text plus ASSIST. No decision on increments. Late interest not established. | Medium-high |
| Per-employer EI and invalidity | Strong inference from s.6(9)–(10), s.7, s.9(3). No express provision, no PERKESO worked example. Deleted reg 12A not read. | Medium-high |
| Act 789 plans for 2025 and 2026 | Confirmed from FAQ Bil. 1/2025 and Bil. 1/2026. | High |
| Act 789 plans and rate for 2027 | No change instrument found, no dated 2027 table. Act 789 itself not read. | Medium |
| Act 872 platform deduction | P.U.(A) 143/2026 and FAQ Bil. 2/2026 read. Act 872 and its commencement notice not read, and rollout is uneven. The deputy minister cites 1 Apr for enforcement vs 31 Mar in the regulations. | High on the rule, medium on practice |
| Budget 2027 tax items | MOF Appendix 9 read. Official proposal, no Finance Bill yet. PERKESO's release conflicts on mandatory Kendiri. | High that it's proposed; unresolved on routing |
| SKBBK in the RM350 for YA2026 | Statutory reading; no LHDN statement. Finance Act 2021 not read directly, para (n) taken from LHDN's ruling and notes. Basis year for late deductions unresolved. | Medium-high |
| 2027 matching details | Rates official. RM amounts, plan and dates aren't published yet, so this can't be closed by more research. | High on rates; rest unknowable today |
| NEI cover in a no-salary month | FAQ v2.3 Q46 says covered if there's one active contribution month in the previous three. v2.1 Q17 and English 13 Aug Q17 say no. v2.3 is later. No effect on amounts. | Medium |
| PERKESO online calculator | Not used; verification was against the statutory table. | n/a |
| Later FAQ versions | v2.3 is the version PERKESO links. Guessed URLs for v2.2, v2.4, v2.5 and v3.0 returned error pages, so a newer unlinked FAQ can't be ruled out. | n/a |
| Downloads | The perkeso.gov.my firewall blocked direct `curl`. PDFs were retrieved through the web-fetch tool. Scanned circulars were read visually from rendered page images. | n/a |
| Dropped from the deep pass | See the list under the verification log: not independently verified. | Medium |

---

## 10. Sources

Downloaded copies are in `.research-cache/socso/` (including `verify/`) and, for a few gazettes, `.research-cache/eis/verify/eis-t3/`. Federal Legislation portal links use the portal's own link form. The `act-view.php` links (entries 31–36, 45, 47, 48) follow a pattern taken partly from link tokens in the saved listings, so they carry the same [AGC listing note](#agc-listing-note) and weren't tested. The portal often rejected automated fetches, so gazette text was read from the saved copies.

### Accessed 2026-11-04

**Primary: legislation and PERKESO**

1. Akta Keselamatan Sosial Pekerja (Pindaan) 2026 [Act A1788]: full text, including Third Schedule Parts I–VI and Fourth Schedule. <https://perkeso.gov.my/images/akta/ACT%204/Akta_A1788_-_AKTA_KESELAMATAN_SOSIAL_PEKERJA_PINDAAN_2026.pdf>
2. PERKESO, "Employees' Social Security Act 1969 (Act 4): New Contribution Rate Including SKBBK" (PDF dated 30 May 2026). <https://www.perkeso.gov.my/images/lindung/lindung-24-jam/NewContributionRateIncludingSKBBK.pdf>
3. PERKESO, "Jadual Caruman Baharu Termasuk SKBBK" (BM, 8 Jun 2026). <https://www.perkeso.gov.my/images/lindung/lindung-24-jam/JadualCarumanBaharuTermasukSKBBK.pdf>
4. PERKESO Pekeliling Majikan Bil. 2 Tahun 2026, "Perluasan Perlindungan Skim LINDUNG 24 Jam" (28 Apr 2026). <https://www.perkeso.gov.my/images/arahan/Bil_2_2026-PekelilingLindung24Jam.pdf>
5. PERKESO Pekeliling Majikan Bil. 3 Tahun 2026, "Pelaksanaan Skim LINDUNG 24 Jam dan Pemilihan Majikan" (Jun 2026). <https://www.perkeso.gov.my/images/arahan/PEKELILING%20MAJIKAN%20BILANGAN%203_%202026_PELAKSANAAN%20SKIM%20LINDUNG%2024%20JAM%20DAN%20PEMILIHAN%20MAJIKAN%20BAGI%20MAKSUD%20PEMBAYARAN%20CARUMAN.pdf>
6. PERKESO, Soalan Lazim LINDUNG 24 Jam v2.3 (65 Q&As; file generated 13 Oct 2026). <https://www.perkeso.gov.my/images/lindung/lindung-24-jam/FAQ_LINDUNG24Jam_v_2.3%20.pdf>
7. PERKESO, Borang Penyertaan SKBBK / LINDUNG 24 Jam (opt-in form, Jul 2026). <https://www.perkeso.gov.my/images/lindung/lindung-24-jam/penyertaan.pdf>
8. PERKESO, LINDUNG 24 Jam page. <https://www.perkeso.gov.my/skim-kemalangan-bukan-bencana-kerja-lindung-24-jam.html>
9. PERKESO, Contribution Rate page (ceiling; Act 789 plans; Act 838 RM120). <https://www.perkeso.gov.my/en/contribution-rate/> and <https://www.perkeso.gov.my/en/our-services/employer-employee/kadar-caruman.html>
10. PERKESO, FAQ Peningkatan Had Siling Gaji RM5,000 → RM6,000 (updated 1 Oct 2024). <https://www.perkeso.gov.my/images/dokumen/011024%20-%20FAQ%20PENINGKATAN%20HAD%20SILING%20GAJI%20DARI%20RM5K%20KEPADA%20RM6K%20DI%20BAWAH%20AKSP%20969%20AKTA%204%20%20ASIP%202017%20AKTA%20800.pdf>
11. PERKESO Employers' Circular No. 2 Year 2022 (RM4,000 → RM5,000; category definitions; Appendix 1 table). <https://www.perkeso.gov.my/images/arahan/Employers_Circular_No_2_Year_2022_-_Increment_Of_The_Wage_Ceiling_For_Monthly_Contributions_From_RM4000_to_RM5000.pdf>
12. Rang Undang-Undang D.R. 11/2024, Keselamatan Sosial Pekerja (Pindaan) 2024 (RM6,000 ceiling, bands 55–65). <https://repositori.parlimen.gov.my/bitstream/123456789/1605/16/DR%2011/2024>
13. PERKESO, FAQ Extension of the Invalidity Scheme to Foreign Workers (3 Jul 2024). <https://www.perkeso.gov.my/images/pekerja_asing/250724%20-FAQ%20-%20INVALIDITY%20SCHEME%20FOREIGN%20WORKER.pdf>
14. PERKESO, Foreign Worker page. <https://www.perkeso.gov.my/en/our-services/protection/foreign-worker.html>
15. PERKESO, Domestic Workers page. <https://perkeso.gov.my/en/our-services/protection/domestic-workers.html>
16. PERKESO, FAQ KENDIRI Padanan Caruman 2026 (Bil. 1/2026, 6 Apr 2026). <https://perkeso.gov.my/images/belanjawan2026/kendiri_padanan_caruman/060426-FAQ%20INISIATIF%20BELANJAWAN%202026%20-%20LINDUNG%20KENDIRI-XNS250112.pdf>
17. PERKESO media release, "Pengenalan SKBBK, pindaan dua akta antara tumpuan PERKESO pada 2025" (2 Jan 2025). <https://perkeso.gov.my/images/kenyataan_media/2025/020125%20-%20PENGENALAN%20SKBBK%20PERKESO%202025.pdf>
18. JANM Pahang notice: PERKESO Act 4 (Amendment) 2026, SKBBK "Lindung 24 Jam" (29 Jun 2026; phase table and P.U.(B) 196/2026 reference). <https://pahang.anm.gov.my/arkib-pengumuman-pahang/pengumuman/2026/11749-perkeso-akta-keselamatan-sosial-pekerja-pindaan-2026-skim-kemalangan-bukan-bencana-kerja-skbbk-lindung-24-jam>

**Secondary: news and advisers**

19. The Star, "Slightly higher salary deductions for enhanced Perkeso protection" (30 May 2026). <https://www.thestar.com.my/news/nation/2026/05/30/slightly-higher-salary-deductions-for-enhanced-perkeso-protection>
20. The Star, "PERKESO's Lindung 24 Jam scheme now optional, says Fahmi" (8 Jul 2026). <https://www.thestar.com.my/news/nation/2026/07/08/perkesos-lindung-24-jam-scheme-now-optional-says-fahmi>
21. Mercans, "Malaysia SKBBK (Lindung 24 Jam) opt-out form now available" (13 Jul 2026). <https://mercans.com/resources/statutory-alerts/malaysia-skbbk-lindung-24-jam-opt-out-form-now-available-13-july-2026/>
22. NST, "Opt-out for the Lindung 24 Jam until Aug 31" (Jul 2026). <https://www.nst.com.my/news/nation/2026/07/1489648/opt-out-lindung-24-jam-until-aug-31>
23. Mercans, "Malaysia Budget 2027: Key Payroll Measures". Says "No change announced" for SOCSO rates and doesn't mention a ceiling. <https://mercans.com/resources/statutory-alerts/malaysia-budget-2027-key-payroll-measures-ya-2027/>
24. HRO, "Malaysia Budget 2027: Highlights of PM Anwar's speech on 9 October". On re-reading it doesn't support the SOCSO relief, rate or ceiling items, so it's no longer relied on for them. <https://www.humanresourcesonline.net/malaysia-budget-2027-live-updates-from-pm-anwar-s-madani-budget-on-9-october>
25. Malay Mail, "Employees' Social Security (Amendment) Bill 2025… tabled for first reading" (30 Oct 2025). <https://www.malaymail.com/news/malaysia/2025/10/30/minister-employees-social-security-amendment-bill-2025-proposing-off-duty-injury-scheme-tabled-for-first-reading/196659>
26. Infosini, "Skim LINDUNG 24 Jam" (contains errors, e.g. a 0.5% rate; used only as a lead to the 8 Jul decision). <https://infosini.my/lindung-24-jam-perkeso/>
27. Budget 2025 SKSPS matching (Bernama via The Sun). The page returned no content when re-checked; superseded by FAQ Bil. 1/2025. <https://bernama.com/en/region/news.php?id=2355037>

### Accessed 2026-11-05 (deep pass)

**Legislation and gazettes**

28. Act A1724, Employees' Social Security (Amendment) Act 2024 (copy on a law firm's site). <https://zulrafique.com.my/ckfinder/userfiles/files/legislation%20update/ActA1724-Employees_SocialSecurity_Amendment_Act2024.pdf>
29. Act 4, English consolidation as at 1 Sep 2022 (s.2(5), s.2(24), s.5, s.6, s.7, s.9, First Schedule, Third Schedule para 1A). <https://perkeso.gov.my/images/akta/ACT%204/Act%204%20-%20EMPLOYEES%E2%80%99%20SOCIAL%20SECURITY%20ACT%201969%20(As%20at%201%20September%202022).pdf>
30. Act 4, Malay reprint as at 1 Mar 2013. Source URL not recorded; saved at `.research-cache/socso/verify/akta4_2013.pdf`.
31. P.U.(B) 196/2026, appointment of date of coming into operation of A1788 and the phases. <https://lom.agc.gov.my/act-view.php?type=pua&no=P.U.%20(B)%20196/2026&status=PRINCIPAL>
32. P.U.(B) 195/2026, English text of A1788 authoritative. <https://lom.agc.gov.my/act-view.php?type=pua&no=P.U.%20(B)%20195/2026&status=PRINCIPAL>
33. P.U.(A) 206/2026, Employees' Social Security (General) (Amendment) Regulations 2026, reg 12B. <https://lom.agc.gov.my/act-view.php?type=pua&no=P.U.%20(A)%20206/2026&status=AMENDMENT>
34. P.U.(B) 381/2024, commencement of A1724 (listing row). <https://lom.agc.gov.my/act-view.php?type=pua&no=P.U.%20(B)%20381/2024&status=PRINCIPAL>
35. P.U.(B) 240/2013, exemption of Federal and State Government employees. <https://lom.agc.gov.my/act-view.php?type=pua&no=P.U.%20(B)%20240/2013&status=PRINCIPAL>
36. P.U.(B) 239/2013, exemption of statutory-body and local-authority employees. <https://lom.agc.gov.my/act-view.php?type=pua&no=P.U.%20(B)%20239/2013&status=PRINCIPAL>
37. P.U.(B) 312/2021, Employees' Social Security (Exemption) Notification 2021. <https://perkeso.gov.my/images/akta/ACT%204/P.U.(B)/PUB%20312%20(2021)%20-%2031%20-%20PEMBERITAHUAN%20KESELAMATAN%20SOSIAL%20PEKERJA%20(PENGECUALIAN)%202021.pdf>
38. P.U.(B) 313/2021, Exemption (No. 2) Notification 2021. <https://lom.agc.gov.my/ilims/upload/portal/akta/outputp/1702278/PUB%20313.pdf>
39. P.U.(A) 247/2021, Amendment of First Schedule Order 2021. <https://lom.agc.gov.my/ilims/upload/portal/akta/outputp/1702260/PUA%20247.pdf>
40. P.U.(A) 180/2024, Amendment of First Schedule Order 2024. <https://lom.agc.gov.my/ilims/upload/portal/akta/outputp/2187224/PUA%20180.pdf>
41. P.U.(A) 351/2018, Amendment of First Schedule (No. 2) Order 2018. <https://lom.agc.gov.my/ilims/upload/portal/akta/outputp/1697071/P.U.%20(A)%20351-2018.pdf>
42. P.U.(A) 144/2018, Amendment of First Schedule Order 2018 (spouse exclusion deleted). <https://perkeso.gov.my/images/akta/ACT%204/P.U.(A)/PUA%20144%20(2018)%20-%2021%20-%20PERINTAH%20KESELAMATAN%20SOSIAL%20PEKERJA%20(PINDAAN%20JADUAL%20PERTAMA)%202018.pdf>
43. P.U.(B) 738/2018, Exemption of Benefit for Foreign Worker Notification 2018. <https://www.perkeso.gov.my/images/imej/pekerja_asing/Warta_Kerajaan_PA4.pdf>
44. P.U.(B) 737/2018, Exemption (No. 2) Notification 2018. <https://perkeso.gov.my/images/imej/pekerja_asing/Warta_Kerajaan_PA3.pdf>
45. P.U.(B) 240/2024, Exemption of Benefit for Foreign Worker Notification 2024. <https://lom.agc.gov.my/act-view.php?type=pua&no=P.U.%20(B)%20240/2024&status=PRINCIPAL>
46. P.U.(A) 143/2026, Gig Workers (Social Security) Regulations 2026. <https://lom.agc.gov.my/ilims/upload/portal/akta/outputp/3434451/PUA143_2026.pdf>
47. P.U.(A) 229/2024, Self-Employment Social Security (Rates of Contribution for Hawker or Trader) Regulations 2024. <https://lom.agc.gov.my/act-view.php?type=pua&no=P.U.%20(A)%20229/2024&status=PRINCIPAL>
48. P.U.(A) 372/2021, Act 789 rates for goods or food transport. <https://lom.agc.gov.my/act-view.php?type=pua&no=P.U.%20(A)%20372/2021&status=PRINCIPAL>
49. Federal Legislation portal P.U.(A) and P.U.(B) listings, saved copies. **[AGC listing]** Newest entries P.U.(A) 383/2026 and P.U.(B) 447/2026. Portal: <https://lom.agc.gov.my/>; the saved copies were deleted on 2026-11-06 at the owner's request. Not obtained through a normal page view. See the [AGC listing note](#agc-listing-note).
50. Parliament of Malaysia, Dewan Rakyat bills list (last updated 5 Nov 2026). <https://www.parlimen.gov.my/bills-dewan-rakyat.html?uweb=dr&lang=en>
51. Parliament of Malaysia, Dewan Negara bills list. <https://www.parlimen.gov.my/bills-dewan-negara.html?uweb=dn&lang=en>
52. Hansard, Dewan Rakyat, 20 Oct 2026 (PDF pp.86–87). <https://www.parlimen.gov.my/files/hindex/pdf/DR-20102026.pdf>
53. Hansard, Dewan Rakyat, 29 Oct 2026 (PDF pp.100–108). <https://www.parlimen.gov.my/files/hindex/pdf/DR-29102026.pdf>
54. Hansard, Dewan Rakyat, 3 Nov 2026 (PDF pp.48–49). <https://www.parlimen.gov.my/files/hindex/pdf/DR-03112026.pdf>

**Government finance and tax**

55. MOF, Budget 2027 Speech (English). <https://www.mof.gov.my/portal/images/2026/10/09/Budget-2027-Speech.pdf>
56. MOF, Budget 2027 speech with annexes (BM). <https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf>
57. MOF, Budget 2027 tax measures, Appendix 9. <https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/tax-measures.pdf>
58. PMO, The Fifth Madani Budget 2027 speech (para 34). <https://www.pmo.gov.my/en/speeches-en/speech-the-fifth-madani-budget-2027-by-yab-pm/>
59. LHDN Public Ruling 7/2025, para 6.10. Source URL not recorded; saved at `.research-cache/pcb/pr-7-2025.txt`.
60. LHDN Nota Penerangan TP1 2026, item C14. Source URL not recorded; saved at `.research-cache/pcb/nota-penerangan-tp1-2026.txt`.
61. LHDN e-BE explanatory notes, item G20. <https://ef.hasil.gov.my/eBE2026/Pdf/Nota_BE_e.pdf>
62. e-CTIM TECH-DT 22/2019, LHDN reply of 12 Mar 2019 on para 46(1)(n). <https://www.ctim.org.my/file/2019/TECH-DT/e-CTIM%20TECH-DT%2022-2019%20-%20Personal%20Deduction%20of%20Employee's%20Contribution%20to%20SOCSO%20(19032019)(F).pdf>

**PERKESO**

63. PERKESO Employers' Circular 3/2024 (RM5,000 → RM6,000), archived copy. <http://web.archive.org/web/20260308142436id_/https://perkeso.gov.my/images/arahan/011024%20-%20EMPLOYERS%20CIRCULAR%20NO.%203%20YEAR%202024%20-%20INCREMENT%20OF%20THE%20WAGE%20CEILING%20FOR%20MONTHLY%20CONTRIBUTIONS%20FROM%20RM5K%20TO%20RM6K.pdf>
64. PERKESO Employer's Circular 6/2020 (sole proprietors and partners). <https://www.perkeso.gov.my/images/arahan/PEKELILING_MAJIKAN_BIL6_TAHUN_2020_-_PERLINDUNGAN_SKIM_BENCANA_PEKERJAAN_SENDIRI_DI_BAWAH_AKSPS_2017_AKTA_789_BAGI_MAJIKAN_BERSTATUS_PEMILIK_TUNGGAL_ATAU_PERKONGSIAN_DI_BAWAH_AKSP_1969.pdf>
65. PERKESO Guidelines on Social Security Protection, 2025 (EN). <https://perkeso.gov.my/images/dokumen/risalah/2025-BOOKLET_PERKESO_BI.pdf>
66. PERKESO Guidelines, 2025 (BM). <https://perkeso.gov.my/images/dokumen/risalah/2025-BOOKLET_PERKESO_BM.pdf>
67. PERKESO leaflets, Sept 2020. <https://www.perkeso.gov.my/images/dokumen/SEPT_2020-RISALAH_EN.pdf> and <https://perkeso.gov.my/images/dokumen/SEPT_2020-RISALAH_BM.pdf>
68. PERKESO employer induction note. <https://perkeso.gov.my/images/Induksi_Majikan/Nota_Penerangan_Induksi_Majikan_Baharu_PERKESO_CURRENT.pdf>
69. PERKESO guide, 2017. <https://www.perkeso.gov.my/images/rujukan/InnerPages_ENG_2017.pdf>
70. PERKESO FAQ, English, 13 Aug 2026. <https://www.perkeso.gov.my/images/lindung/lindung-24-jam/130826-FAQ%20_LINDUNG24Jam_EN_version.pdf>
71. PERKESO FAQ v2.1. <https://www.perkeso.gov.my/images/lindung/lindung-24-jam/faq-2.1.pdf>
72. PERKESO FAQ v2.0. <https://www.perkeso.gov.my/images/lindung/lindung-24-jam/160726V2-FAQ_PERLINDUNGAN_SKBBK_Ver2.0_FAQL24J.pdf>
73. PERKESO FAQ, 13 Jul 2026. <https://www.perkeso.gov.my/images/lindung/lindung-24-jam/130726-FAQ_LINDUNG_24_JAM.pdf>
74. PERKESO Panduan Pengguna Portal Lindung Faedah (§5.0, new-worker opt-out). Source URL not recorded; saved at `.research-cache/socso/verify/panduan_lindung_faedah.pdf`.
75. PERKESO Notis Pelepasan Liabiliti form. Source URL not recorded; saved at `.research-cache/socso/verify/notis_pelepasan.pdf`.
76. PERKESO release, 10 Jul 2026. <https://www.perkeso.gov.my/images/kenyataan_media/2026/100726%20-%20OPSYEN%20OPT-OUT%20LINDUNG%2024%20JAM%20DISEDIAKAN%20ISNIN%20DEPAN.pdf>
77. PERKESO release, 9 Sep 2026. <https://www.perkeso.gov.my/images/kenyataan_media/2026/090926%20-%20FINAL%20PR%20LATEST__.pdf>
78. PERKESO release, 11 Oct 2026 (Budget 2027). <https://www.perkeso.gov.my/images/kenyataan_media/2026/111026%20-%20PR%20PERKESO%20BELANJAWAN%202027%20Final.pdf>
79. PERKESO release, 1 Jun 2026. Source URL not recorded; saved at `.research-cache/socso/verify/PR_010626.pdf`.
80. PERKESO media release, 1 Oct 2024 (archived). <https://web.archive.org/web/20250430041650/https://www.perkeso.gov.my/images/kenyataan_media/2024/011024%20-%20SIARAN%20MEDIA%20KUATKUASA%20PENINGKATAN%20SILING%20GAJI%20RM5,000%20KEPADA%20RM6,000%20FINAL.pdf>
81. PERKESO Akta & Peraturan page. <https://www.perkeso.gov.my/mengenai-kami/rujukan/akta-peraturan.html>
82. PERKESO circulars page. <https://www.perkeso.gov.my/mengenai-kami/rujukan/arahan-pekeliling.html>
83. PERKESO Contribution Calculator. <https://www.perkeso.gov.my/en/our-services/employer-employee/contribution-calculator.html>
84. PERKESO general FAQ. <https://www.perkeso.gov.my/en/contact-us/pejabat-perkeso-new/frequently-asked-question.html>
85. PERKESO "Formal Employee" page (stale on spouses). <https://www.perkeso.gov.my/en/education-benefit.html?view=article&id=54%3Aformal-employee&catid=24>
86. PERKESO FAQ, foreign worker protection, 2019. <https://www.perkeso.gov.my/images/imej/imej2_sip/FAQ_Foreign_Worker_Protection.pdf>
87. PERKESO FAQ RUU (Pindaan) 2015, para 2.4. <https://www.perkeso.gov.my/images/pengumuman/perluasan_liputan/FAQ_RUU_PINDAAN__2015_bertarikh_30_mei_2016.pdf>
88. PERKESO Threads post, 7 Feb 2026 (read through a summariser). <https://www.threads.com/@perkeso.official/post/DaS0fcDGpIY/ini-termasuklah-gaji-pokok-bayaran-ot-komisen-dan-elaun-seperti-elaun-makan/>
89. PERKESO ASSIST manual, 2022 (arrears). <https://www.perkeso.gov.my/images/panduan/280722_-_User_Manual_-_Combine_Contribution__Payment_-_External_User_v1.pdf>
90. PERKESO text file format v2.1 (13 Feb 2026 per file). <https://www.perkeso.gov.my/images/borang/lindung24jam/28072026-formatteksfail.pdf>
91. PERKESO text-file FAQ. <https://www.perkeso.gov.my/images/lindung/lindung-24-jam/FAQ_TextFileFormat_EN.pdf>
92. PERKESO FAQ Bil. 1/2025, SPS Padanan Caruman 3.0 and SPS Madani 3.0 (13 Mar 2025). <https://perkeso.gov.my/images/belanjawan2025/sps/170325%20-%20FAQ%20SKIM%20KESELAMATAN%20SOSIAL%20PEKERJAAN%20SENDIRI%2013032025.pdf>
93. PERKESO FAQ Bil. 2/2026, LINDUNG Kendiri for gig workers under Act 872 (31 Mar 2026). <https://perkeso.gov.my/images/lindung/kendiri/080425-FAQ%20AKTA%20PEKERJA%20GIG.pdf>
94. PERKESO gig worker leaflet. <https://perkeso.gov.my/images/sps/risalah/RISALAH_PEKERJA_GIG.pdf>
95. PERKESO LINDUNG Kendiri page. <https://perkeso.gov.my/perkhidmatan-kami/perlindungan/pekerjaan-sendiri.html>
96. PERKESO release, 22 Oct 2024 (Budget 2025). <https://perkeso.gov.my/images/kenyataan_media/2024/221024%20-%20PR%20RESPON%20BELANJAWAN%202025%20PERKESO.pdf>
97. PERKESO release, 2 Oct 2024 (hawkers mandatory). <https://perkeso.gov.my/images/kenyataan_media/2024/021024%20-%20PR%20MANDATORI%20SKSPS%20v2.pdf>
98. PERKESO release, 1 Apr 2026 (Act 872). <https://perkeso.gov.my/images/kenyataan_media/2026/010426%20SIARAN%20MEDIA%20SAMBUT%20AKTA%20PEKERJA%20GIG%20AKTA%20872%20-%20latest.pdf>
99. PERKESO release, 25 Apr 2026 (Act 872 integration). <https://perkeso.gov.my/images/kenyataan_media/2026/250426%20-%20PR%20INTEGRASI%20SISTEM%20AKTA%20872%20Final.pdf>
100. PERKESO release, 19 May 2026 (gig worker protection). <https://perkeso.gov.my/images/kenyataan_media/2026/190526%20-%20AKSES%20PERLINDUNGAN%20PEKERJA%20GIG%20DIPERMUDAH%20LEBIH%20TERJAMIN.pdf>
101. PERKESO Budget 2027 page. <https://www.perkeso.gov.my/en/about-us/source/belanjawan-2027.html>
102. PERKESO LINDUNG 24 Jam page (EN). <https://www.perkeso.gov.my/en/our-services/protection/lindung-24-jam.html>

**Government, other**

103. JPA media statement, 24 Jan 2024, and FAQ on Lantikan Kontrak (Interim). <https://dmedia.penerangan.gov.my/upload/sm/24012024.2076432687.pdf> and <https://docs.jpa.gov.my/docs/akhbar/2024/FAQ_siaran_media_24012024_a.pdf>
104. Sabah Service Circular 4/2005 on the EPF option. Saved at `.research-cache/epf/verify/gov/`; URL not recorded beyond library.sabah.gov.my.
105. UTM payroll guidance 2020 and emolument slides 2023. <https://bursary.utm.my/wp-content/uploads/2020/12/8.-Garis-Panduan-Penggajian-Bil.1-2020.pdf> and <https://bursary.utm.my/wp-content/uploads/2023/05/SLIDE-DIBACA-BERSAMA-PROSEDUR-EMOLUMEN-VERSI-APRIL-2023_compressed.pdf>

**Secondary: news, advisers and vendors**

106. Bernama, 9 Jul 2026. <https://www.bernama.com/bm/am/news.php?id=2578573>
107. RTM, 9 Jul 2026. <https://berita.rtm.gov.my/nasional/senarai-berita-nasional/senarai-artikel/skim-lindung-24-jam-kekal-mandatori-bagi-pekerja-asing/>
108. The Star, 9 Jul 2026. <https://www.thestar.com.my/news/nation/2026/07/09/lindung-24-jam-still-mandatory-for-foreign-workers-only-optional-for-locals-says-hr-minister>
109. The Star, 11 Jul 2026. <https://www.thestar.com.my/news/nation/2026/07/11/form-available-to-opt-out-of-lindung-24-jam>
110. NST, 11 Jul 2026. <https://www.nst.com.my/amp/business/corporate/2026/07/1485760/lindung-24-contributions-june-may-not-be-refunded>
111. Utusan, Jul 2026. <https://www.utusan.com.my/nasional/2026/07/pencarum-boleh-opt-out-lindung-24-jam-mulai-isnin/>
112. Kosmo, 10 Jul 2026. <https://www.kosmo.com.my/2026/07/10/pencarum-boleh-tarik-diri-dari-lindung-24-jam-bermula-isnin-depan/>
113. Bernama, 17 Oct 2026. <https://bernama.com/bm/am/news.php?id=2621796>
114. Bernama, 11 Oct 2026. <https://www.bernama.com/en/general/news.php?id=2618628>
115. Bernama, 17–18 Oct 2026. <https://bernama.com/en/news.php?id=2621809>
116. Bernama, 21 Jun 2026. <https://bernama.com/en/news.php?id=2571194> and <https://bernama.com/bm/am/news.php?id=2571182>
117. Malay Mail, 11 Oct 2026. <https://www.malaymail.com/amp/news/malaysia/2026/10/11/budget-2027-socso-offers-up-to-rm150-tax-relief-for-lindung-24-jam-lindung-kendiri-contributors/238704>
118. RinggitPlus, Budget 2027 RM150 relief (EN). <https://ringgitplus.com/en/blog/budget-2027/budget-2027-extra-rm150-tax-relief-if-you-stayed-in-lindung-24-jam.html>
119. RinggitPlus, Budget 2027 RM150 relief (BM). <https://ringgitplus.com/ms/blog/berita-kewangan-peribadi/belanjawan-2027-pelepasan-cukai-tambahan-kepada-pencarum-lindung-24-jam.html>
120. RinggitPlus, 1.2 million urged to rejoin (19 Oct 2026). <https://ringgitplus.com/ms/blog/berita-kewangan-peribadi/1-2-juta-pekerja-digesa-sertai-semula-lindung-24-jam-semak-kos-mengikut-gaji-anda.html>
121. RinggitPlus, 8.5 million stay in (9 Sep 2026). <https://ringgitplus.com/en/blog/personal-finance-news/8-5-million-workers-stay-in-lindung-24-jam-despite-opt-out-option.html>
122. Shearn Delamore via Conventus Law, 31 Jul 2026. <https://conventuslaw.com/report/malaysia-employment-and-industrial-relations-update-socso-reverses-position-on-lindung-24-jam-what-employers-need-to-know/>
123. Central HR, 6 Aug 2026. <https://www.centralhr.my/perkeso-lindung-24-jam-2026-complete-employer-payroll-and-opt-out-guide/>
124. Links International, 28 Sep 2026. <https://linksinternational.com/blog/malaysias-lindung-24-jam-what-employers-should-check-after-the-opt-out-period/>
125. YYC Advisors, 20 Jul 2026. <https://www.yycadvisors.com/lindung-24-jam-opt-out-guide.html>
126. Info-Tech. <https://www.info-tech.com.my/blog/lindung-24-jam-opt-out-guide/>
127. Other opt-out blogs, weak: Malaysia Post <https://themalaysiapost.com/caruman-perkeso-lindung-24-jam/>; byte-hr <https://byte-hr.com/my/blog/skbkk-lindung-24-jam-malaysia-employee-guide>; Pandahrms <https://pandahrms.com/?p=10109>; Maukerja <https://www.maukerja.my/career-advice/blog/ms/34189/cara-batalkan-lindung-24-jam>; PeKhabar <https://pekhabar.com/perkeso-lindung-24-jam-sukarela-cara-opt-out-2026/>; eWarta <https://ewarta.my/cara-batalkan-lindung-24-jam/>; DataOn <https://dataon.com/en-my/blog/lindung-24-jam-skbbk-socso/>.
128. Payroll vendors on the month of the switch at 60: PayrollPanda <https://www.payrollpanda.my/help/how-are-statutory-contributions-set-based-on-the-employees-personal-details/>; brioHR <https://support.briohr.com/knowledge/types-of-eis-options> and <https://support.briohr.com/knowledge/types-of-socso-options>; Duittools <https://duittools.com/blog/socso-for-employees-above-60-malaysia-2026>; Mynd <https://www.myndsolution.com/best-practices/epf-socso-eis-contributions-malaysia-payroll/>; Smartouch <https://smartouch.com.my/post/socso-rates-for-employees-above-60-moving-safely-to-the-second-category/>; Oracle PeopleSoft <https://docs.oracle.com/cd/G20540_01/hcm92pbr51/eng/hcm/hgpl/UnderstandingtheSOCSOContributionProcess-e34bc2.html>.
129. RTM, 25 Nov 2024 (invalidity capped at 60). <https://berita.rtm.gov.my/nasional/senarai-berita-nasional/senarai-artikel/pekerja-60-tahun-ke-atas-layak-mohon-tuntutan-perkeso/>
130. Skrine, Oct 2024. <https://www.skrine.com/insights/alerts/october-2024/maximum-contribution-rate-under-employees%E2%80%99-social->
131. Berita Harian, Jan 2024 (new permanent posts non-pensionable). <https://www.bharian.com.my/amp/berita/nasional/2024/01/1204228/penjawat-awam-tetap-baharu-tidak-berpencen-tpm>
132. Utusan, Jun 2024 (contributory scheme under study). <https://www.utusan.com.my/berita/2024/06/skim-caruman-masih-dalam-kajian/>
133. The Edge, timeline on civil-service pension reform. <https://theedgemalaysia.com/node/809680>
134. Suara Sarawak on JBC appointments (exact date not established). <https://suarasarawak.my/lantikan-baharu-berasaskan-caruman-bermula-tahun-ini/>
135. L&Co Chartered Accountants, on SOCSO coverage and payroll contributions. <https://landco.my/social/socso/> and <https://landco.my/information-sharing/details-of-payroll-contribution/>
136. KPMG Flash Alerts 2016-080 and 2019-034. <https://assets.kpmg.com/content/dam/kpmg/pdf/2016/07/fa16-080.pdf> and <https://assets.kpmg.com/content/dam/kpmg/xx/pdf/2019/02/fa19-034.pdf>
137. Focus Malaysia, 16 Jun 2023 (High Court appeal on contract of service). <https://focusmalaysia.my/socso-eligibility-takes-into-account-employee-or-independent-contractor-status/>
138. AJobThing (RM1,000 claim, rejected; festive gifts, uncited). <https://www.ajobthing.com/resources/blog/internship-allowance-how-much-should-pay> and <https://www.ajobthing.com/resources/blog/payments-subject-to-socso-eis-contribution-malaysia>
139. Central HR on internships (MySIP allowances). <https://www.centralhr.my/1-3-internship-policy-malaysia-2026/>
140. Kosmo, 30 May 2023 (trainee law status). <https://www.kosmo.com.my/?p=440315>
141. MIDA statutory contributions (stale and self-contradicting on spouses). <https://www.mida.gov.my/setting-up-content/statutory-contributions/>
142. Lowyat forum thread (anecdote only). <https://forum.lowyat.net/topic/4776256>
143. Whirlpool of India v ESIC (Indian, not binding). <https://www.legalauthority.in/judgement/m-s-whirlpool-of-india-ltd-vs-employees-state-insurance-corporation-22547>
144. NATLEX record for the General Regulations 1971 (metadata only). <https://natlex.ilo.org/dyn/natlex2/r/natlex/fe/details?p3_isn=43902>
145. Act 789 overseas extension and platform items: FMT <https://www.freemalaysiatoday.com/category/nation/2026/05/03/self-employment-social-security-act-amendments-to-be-tabled-says-ramanan>; The Star <https://www.thestar.com.my/news/nation/2026/06/22/cross-border-worker-protection-plan-set-for-tabling> and <https://www.thestar.com.my/news/nation/2026/05/04/bid-to-expand-perkeso-protection-for-msians-working-abroad>; Bernama <https://www.bernama.com/en/general/news.php?id=2552072>; Star Picks (sponsored section) <https://www.thestar.com.my/starpicks/2026/10/17/strengthening-social-protection-amid-rising-costs>; Asia News Network <https://asianews.network/?p=282140> and <https://asianews.network/?p=283695>; Insurance Business <https://www.insurancebusinessmag.com/asia/news/breaking-news/malaysia-to-launch-new-insurance-scheme-for-singapore-crossborder-workers-564422.aspx>; HRO <https://www.humanresourcesonline.net/malaysia-budget-2027-what-employers-need-to-know-about-wages-skills-training-and-gig-worker-protections>.

146. Other sources cited by the checks: PERKESO Pekerja Bermajikan page <https://www.perkeso.gov.my/perkhidmatan-kami/perlindungan/pekerja-bermajikan.html>; PERKESO Caruman page <https://www.perkeso.gov.my/perkhidmatan-kami/majikan-pekerja/caruman.html>; Employers' Circular 3/2018 <https://www.perkeso.gov.my/images/imej/pekerja_asing/Employers_Circular_No._3_Year_2018.pdf>; PERKESO release 11 Oct 2025 <https://perkeso.gov.my/images/kenyataan_media/2025/111025%20-%20Reaksi%20PERKESO%20Terhadap%20Belanjawan%202026.pdf>; MOF speech page <https://www.mof.gov.my/portal/en/news/speech/speech-the-fifth-madani-budget-2027>; The Star, Budget 2027 highlights <https://www.thestar.com.my/business/business-news/2026/10/09/highlights-from-budget-2027>; The Sun <https://thesun.my/news/budget-2027-wages-skills-worker-protection-ramanan>; NST, 10 Jul 2026 <https://www.nst.com.my/amp/business/corporate/2026/07/1485254/lindung-24-contributions-june-may-not-be-refunded>; NST, 15 Jul 2026 <https://www.nst.com.my/amp/news/nation/2026/07/1489648/opt-out-lindung-24-jam-until-aug-31>; RTM, 1 Oct 2024 <https://berita.rtm.gov.my/nasional/senarai-berita-nasional/senarai-artikel/kuat-kuasa-had-siling-gaji-baharu-tujuan-caruman-mulai-1-oktober/>; Utusan, Aug 2025 (retirement-age proposal) <https://www.utusan.com.my/nasional/2025/08/parlimen-kerajaan-teliti-cadangan-naik-umur-persaraan-65-tahun/>; Bloomberg Tax notices <https://news.bloombergtax.com/daily-tax-report-international/malaysia-gazettes-employees-social-security-amendment-act-2026> and <https://news.bloombergtax.com/payroll/malaysia-gazettes-order-on-employees-social-security-general-amendment-regulations-2026>. Bernama's 1 Jul 2021 date for domestic workers conflicts with the gazette and is treated as an error <https://www.bernama.com/en/news.php/?id=2617410>. A Kosmo hit that looked like a July 2026 ceiling change is dated 1 Oct 2024 <https://www.kosmo.com.my/?p=662212>.
147. Saved locally without a recorded URL: PERKESO briefing deck 2024 (`.research-cache/eis/mbsj-slides.txt`); EY Take 5, Budget 2027 (`.research-cache/pcb/verify/ey/ey-take-5-budget-2027.txt`); Income Tax Act 1967 as at 1 Jan 2026 (`.research-cache/pcb/verify/g2/`); Act 800 text (`.research-cache/eis/act800.txt`); Finance Act 2021 summary (`.research-cache/socso/verify/t2/finance-act-2021-kpmg.txt`).

---

## Verification log (deep pass, 2026-11-05)

Each claim was checked by three independent lenses: **primary** (against the law and PERKESO's own documents), **compute** (recalculated from the data), and **currency** (anything changed up to today). REFUTED means 2 or more refuted it. ✓ confirmed, ✗ refuted, ? unverified. No check ended as "?" for this scheme.

**"No live search"** marks checks that ran with no live web search because a shared search limit ran out. They used saved sources and direct fetches, so they couldn't look for news newer than the cache, and they're lower confidence on "has anything changed". This matters less for checks against a fixed legal text. Every claim had at least one lens with live search. 22 of this scheme's 36 checks are in this group.

I re-read the decisive evidence myself for every REFUTED claim, as noted in the table. No claim ended CONTESTED or UNVERIFIED. C4 and C10 are CONFIRMED with one dissenting lens each, marked below with what was done about it.

| Claim id | Claim | Outcome | Votes (✓/✗/?) | Action taken | Key source |
|---|---|---|---|---|---|
| C1 | Oct 2024–May 2026 table: 65 bands, RM6,000 ceiling, spot values | CONFIRMED | primary ✓ (primary: no live search) · compute ✓ (compute: no live search) · currency ✓ | Kept all values. Citation upgraded: bill replaced by enacted Act A1724, Circular 3/2024 and P.U.(B) 381/2024. | Act A1724; Circular 2/2022 App. 1; Guidelines 2025 |
| C2 | RM6,000 ceiling from Oct 2024; no change 2025–26; none announced for 2027 | CONFIRMED | primary ✓ (primary: no live search) · currency ✓ · compute ✓ (compute: no live search) | Kept. 2027 citation moved from Mercans to MOF documents and bill lists, stated as "none announced, not a guarantee". | Act A1724 s.2; FAQ 1 Oct 2024 Q1, Q6–8; MOF Budget 2027 |
| C3 | NEI added from Jun 2026; amounts; "cap 44.65 at RM5,900 and above" | **REFUTED** (narrow) | currency ✗ · primary ✗ (primary: no live search) · compute ✗ | Holds: I read band 63 in A1788 as RM43.85. The data and the report never had this error; only the claim's wording did. Added rows 12a–b and the explicit "above RM5,900" rule, and "for participating employees". All other values confirmed. Noted that the English text of A1788 is authoritative but wasn't retrieved. | A1788 Third Sch. Part I row 63; PERKESO EN PDF; P.U.(B) 195/2026 |
| C4 | NEI participation; opt-out window; "no NEI from July" model | CONFIRMED, one dissent, model clause medium | primary ✓ (primary: no live search) · compute ✗ (compute: no live search) · currency ✓ | Rules kept. Compute's dissent is narrow: an August filer's July NEI. Removed the unsupported config note, added the month-by-month table and the new-hire FAQ history, recorded the year-end review. Model default sent to owner. To-do T4 also couldn't settle it. | FAQ v2.3 Q3, Q11, Q14, Q25–27, Q45; PERKESO release 10 Jul 2026 |
| C5 | Phase dates; all 2027 is Phase 1; first-timers can't opt out | CONFIRMED; new-entrant clause medium | compute ✓ (compute: no live search) · primary ✓ (primary: no live search) · currency ✓ | Phase dates raised to High from the gazette. Fixed the config gap for Jan–May 2028. Stale "subject to PERKESO dates" note removed. New-entrant conflict recorded. | P.U.(B) 196/2026; FAQ v2.3 Q26–29; Panduan §5.0 |
| C6 | Category rule: 55 and 60 triggers | **REFUTED** (narrow) | primary ✗ (primary: no live search) · currency ✗ · compute ✗ (compute: no live search) | Holds: I read First Schedule para (12)(iii) and P.U.(A) 180/2024, which deletes only (iv). Added the working-pensioner limb (medium: no PERKESO operational text), "payable" wording, foreign-worker Invalidity Scheme test, new input, examples 17–18. 55 and 60 rules unchanged. | Act 4 First Sch. para (12); s.6(2); P.U.(A) 180/2024; Guidelines 2025 |
| C7 | Band lookup, no rounding, zero wages | CONFIRMED | primary ✓ (primary: no live search) · compute ✓ (compute: no live search) · currency ✓ | Kept. "Wages paid" corrected to "payable" with s.9(1). Para 1A vs para 2 citation fixed. Added integer-sen wage note and old-app bug D14. | A1788 Third Sch.; s.9(1) |
| C8 | Wage definition; "EXCLUDES statutory contributions (EPF etc.)"; "fixed" allowances | **REFUTED** | compute ✗ (compute: no live search) · primary ✗ (primary: no live search) · currency ✓ | Holds: I read s.2(24)(a), which says "payable by the principal employer or the immediate employer". Reworded: employer contributions only, band on wages before employee deductions. Allowances fixed or variable. Commission and service charge raised to primary. Currency's ✓ carried the same precision flag. | Act 4 s.2(24), s.7(2); Guidelines 2025 p.9 |
| C9 | Coverage: pensionable excluded; contract in; foreign; domestic | **REFUTED** | currency ✗ · compute ✗ (compute: no live search) · primary ✗ (primary: no live search) | Holds: I read P.U.(B) 240/2013, 239/2013 and 312/2021. Test changed to permanent vs temporary or contract. Statutory bodies resolved to the New Scheme test. Added armed forces and police, domestic exemptions, dated NEI for foreign workers, interim-contract watch item. Foreign-worker dates unchanged. Enum renamed. | P.U.(B) 240/2013; P.U.(B) 239/2013; P.U.(B) 312/2021; First Sch. paras (6), (7) |
| C10 | Budget 2027 tax relief, "press only"; YA2026 not established | CONFIRMED, one dissent | primary ✓ (primary: no live search) · compute ✗ (compute: no live search) · currency ✓ | Figures kept. All three lenses agreed the "press only" label was stale, so relabelled official proposal, not yet law. Scope narrowed to 17 non-mandatory sectors. YA2026 restated as a statutory reading via to-do T2, no LHDN statement. | MOF tax measures App. 9; LHDN PR 7/2025 para 6.10; A1788 s.3 |
| C11 | Act 789 plans; mandatory sectors; matching | **REFUTED** | primary ✗ (primary: no live search) · currency ✗ · compute ✗ (compute: no live search) | Holds: I read P.U.(A) 143/2026, FAQ Bil. 2/2026, FAQ Bil. 1/2026 and FAQ Bil. 1/2025. Plan table kept. Added Act 872 period from 31 Mar 2026, dated matching windows, Padanan50 limit, primary 2025 scheme, 2027 upgraded to official with amounts unpublished, rounding note fixed. | P.U.(A) 143/2026; FAQ Bil. 2/2026 Q5, Q8, Q9, Q15; FAQ Bil. 1/2026 Q16, Table 5; FAQ Bil. 1/2025 |
| C12 | Multiple employers; "within 30 days of 1 Jun 2026" | **REFUTED** (narrow) | primary ✗ (primary: no live search) · compute ✗ · currency ✗ | Holds: I read reg 12B and Circular 3/2026 paras 4.4–4.10 (scan). 30 days now runs from PERKESO's notice, for anyone with two or more employers. Added 14-day step, selection criteria, change grounds, "zero or once", citations for per-employer. No amount changes. | P.U.(A) 206/2026 reg 12B; Circular 3/2026 §4; FAQ v2.3 Q30 |

Independence note: the C4 currency check reports that it saw this claim's then-current outcome field in the slice file while searching, so it wasn't fully blind. It didn't rely on it.

**To-dos and gaps merged:** T1 (legal instrument, new entrants) → §2.3, §9. T2 (RM350, Budget 2027) → §4. T3 (switch timing) → §2.2. T4 (opt-out effect, refunds) → §2.3. G1 (wage items, arrears) → §2.4, §3 step 9, §6 E–F. G2 (directors, spouses, casuals, interns, posted staff, expatriates) → §2.1. G3 (Act 789 amendment, 2027 matching) → §2.5.

<a id="agc-listing-note"></a>**AGC listing note (owner decided 2026-11-06: not relied on, D1).** Treat every **[AGC listing]** finding as unconfirmed until a manual check at lom.agc.gov.my. Findings tagged **[AGC listing]** rest on two saved copies of the AGC Federal Legislation portal's P.U.(A) and P.U.(B) lists, deleted on 2026-11-06 at the owner's request.

* **Why they're flagged:** the saved copies weren't obtained through a normal page view, so the owner decided not to rely on them (D1).
* **What rests on them:** the title-level "nothing gazetted after 29 May 2026" check (§2.3, §9); the row for P.U.(B) 381/2024 (C1, C2, §2.7); no Act 789 order since 2024 (G3, §2.5); no exemption naming directors, interns and similar groups (G2, §2.1); no revocation of the 2013 notifications (C9); and the Act 4 instrument checks in the C1 and C2 votes.
* **If the owner rules them out:** no amount changes. The 1 Oct 2024 date stands on Circular 3/2024 and the FAQ. "No instrument found" falls back on PERKESO's pages and the bill lists, which is weaker. The gazette texts read as PDFs, such as P.U.(B) 240/2013, aren't affected by this note unless a copy was itself found through the listings.

**Not independently verified** (`droppedClaims`, kept in the report but not checked by the three lenses):

* Act 838 housewives scheme: RM120/year (note only, not part of take-home pay)
* Budget 2027 Act 789 matching: 70% for 17 non-mandatory sectors, 35% (50% with platform co-funding) for e-hailing/p-hailing. *Press only when dropped; since confirmed by the C11 currency check and gap G3.*
* Six-month employer no-penalty grace period for NEI non-compliance (1 Jun – ~30 Nov 2026). Does not change amounts.
* June 2026 payroll practice: iGFMAS and some payrolls did not deduct NEI in June and collected it later as arrears. Payslips may differ from the amount legally due.
* Fourth Schedule assumed-wage derivation (invalidity = 0.5% × assumed wage rounded to 5 sen with ties to even; NEI Phase 1 = EI minus invalidity). Explanatory only, not used for computation.
* Phase 1 coincidence: Category 1 employee with NEI equals Category 2 employer for almost every band.
* NEI cover continues for 3 months without wages (FAQ Q46). Does not affect contribution amounts. *Older FAQ versions differ; see §9.*
* Local domestic workers' invalidity coverage history for 2021–2024 (not traced). *Since answered by the C9 checks: P.U.(A) 247/2021 deleted the exclusion entirely, so there was no carve-out from the start.*
* Act A1788 legislative timeline (first reading 30 Oct 2025; passed Dec 2025). Background only.
* Old-app discrepancies D1–D13 (these follow from claims C1–C9, not separate statutory facts).

---

## Research status

**Complete for building the calculator.** All 12 claims, 4 to-dos and 3 gaps are merged. All tables are verified, and 2025, 2026 and the 2027 template are configured with effective-date periods.

**What remains is outside research:**

* **Only PERKESO can settle:** the switch month at 60 and first entry at 55, an August filer's July NEI, working invalidity pensioners, fixed travel allowances and other wage items, directors and interns, and whether the new-hire opt-out path still exists.
* **Not published yet:** 2027 matching amounts, the Finance Bill implementing Budget 2027, LHDN's position on SKBBK and the RM350, and the outcome of the PERKESO/KESUMA year-end review.
* **Could not be retrieved:** the English text of Act A1788, the General Regulations 1971, Act 789, Act 872 and the Act 239 s.2 definition of "New Scheme".

**Re-check in January 2027:** bill lists (Act 4, Act 789, Finance Bill), Federal Legislation listings (method subject to owner question 17), PERKESO's FAQ and circulars, and the first interim-contract expiries on 31 Jan 2027.

---

## Questions for the owner

These overlap the README's questions where noted. "Recommended" is the researcher's suggestion; nothing here has been decided.

1. **Scope: which worker types go in v1?** (README Q1, Q7.) The rules are now known for government permanent vs contract, statutory bodies, armed forces and police, foreign and domestic workers. Model them all, or Malaysian private-sector first with a note for the rest?
2. **Which month does the switch at 60 use?** Recommended: the birthday month, the only reading with support in the Act, with a note that some payrolls switch a month later. The alternative is the following month, which matches some vendors but has no legal source. The difference is at most RM29.75 each for employee and employer, for one month. This also decides whether whole-year age is enough. (README Q2.)
3. **Opted-out locals: keep showing no NEI from July 2026 for everyone?** Recommended: yes, with a short caveat for August filers, because the most it can be wrong by is one month's NEI (RM44.65). The alternative is a filing-month input, which only makes sense if PERKESO confirms the month-of-filing reading.
4. **New hires after 31 Aug 2026: one opt-out toggle, not blocked by join date?** Recommended: yes, since people hired before FAQ v2.3 may hold valid opt-outs. The alternative is to hide the toggle for anyone who joined after the window, which follows FAQ v2.3 strictly but would overstate NEI for those people.
5. **Show a "receiving a SOCSO invalidity pension" option?** It's an advanced flag for a small group, and rests on the Act's text with no PERKESO confirmation. Alternatively, leave it out and document the limitation.
6. **Fixed monthly travel, transport, petrol, toll or parking allowance: count it or not?** Recommended: exclude per the Act, with a visible "my payslip counts this" toggle. The alternative is to count it by default, matching PERKESO's public messaging.
7. **Bonus input: split by frequency?** Recommended: ask "once a year or more often", since only annual bonus is excluded. Once-a-year AWS and festive bonuses would be treated as annual (lower confidence). This ties in with README Q16 for EPF.
8. **Industrial-training students paid only an allowance: which default?** (a) Ask "Does your payslip show a PERKESO deduction?" and follow the answer (recommended), (b) no contribution, or (c) full contributions.
9. **Salaried directors, staff posted abroad and parent-paid expatriates:** treat as covered with a "check your payslip" note (recommended), or wait until PERKESO confirms in writing?
10. **Multiple employers: support it?** (README Q3.) The method is clear: per-job EI and invalidity, NEI at one chosen job.
11. **Self-employed: include the plan picker and matching?** (README Q9.) For 2027, show only the gross plan amount with an "announced, amounts not published" note (recommended), or also an estimated net labelled as an estimate?
12. **Platform gig workers: model 1.25% of each job, or just point them to a note?** Modelling needs a job-earnings input. Without it, the plan picker would show the wrong figure for them.
13. **YA2026: count SKBBK deductions toward the RM350 relief without LHDN confirmation?** Recommended: yes, with a "based on the Act's wording, not confirmed by LHDN" note, because the tax difference is about RM1–4 a year for typical full-year employees. Leaving it out is more cautious but slightly overstates tax for lower-wage, part-year and 60+ users. This feeds `tax-ya2026.json` and PCB.
14. **June 2026: amount legally due, or what many payslips showed?** (README Q8.)
15. **Show future NEI phases (1.00% from Jun 2028, 1.25% from Jun 2031) as a preview?** (README Q10.)
16. **Will you contact PERKESO?** One written query (perkeso@perkeso.gov.my, or 1-300-22-8000) could settle questions 2, 3, 5, 6 and 8–9, plus AWS, ex-gratia, sign-on and pay in lieu. Only you can make or authorise that contact. A real PERKESO opt-out notification for someone who filed in August, if you or an employer contact has one, would likely answer question 3 directly.
17. **Decided 2026-11-06 (D1): don't rely on them; the manual search stays optional (M7).** Original question: **Saved AGC portal listings: may this research use them?** The saved copies weren't obtained through a normal page view (see the [AGC listing note](#agc-listing-note)). Since the answer is no, you could search lom.agc.gov.my yourself under both P.U.(A) and P.U.(B) for "Keselamatan Sosial Pekerja" after 8 Jul 2026. A notice there would change the legal-basis note only, not any amounts.

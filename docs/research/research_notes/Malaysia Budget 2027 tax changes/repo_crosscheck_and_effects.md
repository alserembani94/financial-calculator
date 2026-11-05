# Budget 2027 (Malaysia): repo cross-check and illustrative YA2027 effects on take-home pay

Researched 2026-11-06. Budget 2027 was tabled on 9 Oct 2026. **Every YA2027 figure below is "proposed, not law".** No Finance Bill text or LHDN 2027 MTD spec was found. Nothing in the repo was changed. The calculation script is at `/private/tmp/claude-501/-Users-atifaiman-coding-personal-financial-calculator/d7f41a17-7223-4cfc-981b-fd5da3d9e0cf/scratchpad/budget2027/scripts/proposed_ya2027.py` and its output is at `.../scratchpad/budget2027/output.txt`.

How the primary source was checked: the Budget 2027 speech annex, Lampiran 1–9 on pp.191–202, was read from the repo's local text copy `.research-cache/pcb/ub27.txt` of the official [Ucapan Belanjawan 2027 PDF](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf). The MOF English annex is still live: [tax-measures.pdf](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/tax-measures.pdf) downloaded on 2026-11-06, 238 KB. Its text could not be extracted because it uses subset fonts and no PDF text tool was available, so it was **not** re-read line by line this pass.

## 1. What the repo records for YA2027 (brackets, self relief, other reliefs, rebates, sources, confidence)

### Takeaway
The repo treats YA2027 as an "unconfirmed-template" with `taxStatus: "proposed"`. It records the Budget 2027 bracket table (18% for RM70–100k, a new 24% band for RM100–150k, and 30% from RM1m), self relief of RM12,000, a set of relief scope changes, and a RM350 + RM150 SOCSO relief. Its sources are the speech's Lampiran 1–9 and MOF Appendix 1. Rebates, the non-resident rate and reliefs the Budget doesn't mention are carried forward from YA2026 and flagged as unconfirmed. Overall confidence is "Low to medium".

### Cited Findings
**What the repo files record** (repo files, cited by path):
- `docs/research/data/tax-ya2027-proposed.json`:
  - Status `"unconfirmed-template"` and `taxStatus: "proposed"`, with stages proposed → bill-tabled → enacted. The `$comment` says: "No Finance Bill on Parliament's list as of 2026-11-05; no LHDN 2027 spec or TP1. Items not mentioned in Budget 2027 are carried forward from YA2026 and are unconfirmed."
  - Brackets, given as band, rate and tax at the lower bound:
    - 0–5k: 0%, 0
    - 5–20k: 1%, 0
    - 20–35k: 3%, 150
    - 35–50k: 6%, 600
    - 50–70k: 11%, 1,500
    - 70–100k: 18%, 3,700
    - 100–150k: 24%, 9,100
    - 150–400k: 25%, 21,100
    - 400–600k: 26%, 83,600
    - 600k–1m: 28%, 135,600
    - above 1m: 30%, 247,600
  - The bracket sources are `ub27.pdf Lampiran 1` and `tax-measures.pdf Appendix 1`. A note says the tax-at-lower-bound values were "computed by us … not published by MOF/LHDN".
- Rebates in the same file:
  - Individual RM400 and spouse RM400, each where chargeable income ≤ RM35,000 (s.6A(2)).
  - Zakat and departure levy, pooled under the s.6A(4) cap.
  - `$comment`: "Budget 2027 does not mention rebates; carried forward (unconfirmed)."
  - A `rebateCliff` of RM400 for categories 1 and 3, and RM600 for category 2.
- Relief statuses in the same file:
  - Self relief: 12,000, "PROPOSED Budget 2027 Lampiran 2".
  - Parents medical/care: 8,000, Lampiran 3.
  - Medical: 10,000, Lampiran 4.
  - Breastfeeding: merged into medical.
  - Education: 7,000, Lampiran 5.
  - Lifestyle: 2,500, Lampiran 6.
  - Sports: 1,000, Lampiran 7.
  - Tourism admission: 1,000 for YA2027 only, Lampiran 8.
  - SOCSO + EIS: 350, plus an `additionalCaps` 150 for voluntary LINDUNG 24 and the 17 non-mandatory LINDUNG KENDIRI sectors. `maxTotalRm` is 500. `poolingRule: "separate"` is marked unconfirmed (Lampiran 9).
  - Carried forward and unconfirmed: disabled self 7,000, spouse 4,000, disabled spouse 6,000, children, EPF 4,000, life insurance 3,000, PRS 3,000, education/medical insurance 4,000, supporting equipment 6,000, SSPN 8,000, EV/composting 2,500, first-home interest 7,000/5,000.
  - Childcare 3,000 is marked "enacted from YA2026 onward … Not a Budget 2027 measure".
  - The per-relief `confidence` and `source` fields are null. Confidence is recorded at file level and in pcb.md.
- `docs/research/data/pcb-spec-2027-template.json`:
  - Status `"unconfirmed-template"`. "Table 1 B values DERIVED by us from Budget 2027 Lampiran 1 rates with the 400/800 rebate below P 35,000 carried forward. D = 12,000 per Lampiran 2 … do not assume 1 Jan 2027."
  - Table 1 rows, given as M, R, B (cat1/cat2/cat3):
    - 5,000, 1%, −400/−800/−400
    - 20,000, 3%, −250/−650/−250
    - 35,000, 6%, 600
    - 50,000, 11%, 1,500
    - 70,000, 18%, 3,700
    - 100,000, 24%, 9,100
    - 150,000, 25%, 21,100
    - 400,000, 26%, 83,600
    - 600,000, 28%, 135,600
    - 1,000,000, 30%, 247,600
  - The formula and rounding are assumed unchanged from 2026. D = 12,000, S = 4,000, Du = 7,000, Su = 6,000, Q = 2,000.

**What pcb.md says:**
- Status line: "YA2027 is an unconfirmed template built from the Budget 2027 speech, tabled 9 Oct 2026."
- §4.1 has the YA2027 table, with the change column "was 19%", "new band (was 25%)", "band shortened", "was > 2,000,000".
- §4.1 cross-check: tax on RM1.5m is 388,400 for YA2026 and 397,600 for YA2027.
- §4.2: "Budget 2027 is silent → carried forward" for rebates.
- §4.4 has the relief table with `*` marking carried-forward items.
- §4.5: YA2027 "Proposed. No Finance Bill as of 2026-11-05 … MTD spec Not published. B values are ours".
- §10 confidence: "Low to medium: flag in UI".
- Deep-pass claims: C12 (rates, D 12,000, derived B) and C16 (relief changes) are both CONFIRMED against ub27 Lampiran 1–9 and tax-measures.pdf.
- §6.3 YA2027 template results: Single 5,000 is 95.00 (YA2026 110.00), and Single 4,000 is "0.00 in January, then 10.00 February to December (total 110.00)".
- PwC's Budget 2027 note is recorded as not read (HTTP 403).

**What v1-baseline.md says:**
- The 2027 column uses 2026 values, "with note. Budget 2027 proposes RM12,000 and lower rates, so RM5,000 would show PCB of RM95 instead of RM110 if it passes".
- Decision D6: "2027 uses 2026 values until official figures are confirmed."

### Inferences
- The repo separates proposal from law consistently, with status flags in both JSON files, pcb.md §4.5 and v1-baseline D6. The derived B values are clearly labelled as ours.

### Gaps
- Per-relief `confidence` and `source` fields in tax-ya2027-proposed.json are empty. Sources sit only in `status` strings and at file level.

## 2. Do current public sources confirm each recorded figure? (agreements, disagreements, gaps)

### Takeaway
Every YA2027 figure in the repo that comes from Budget 2027 matches the official speech annex (Lampiran 1–9): brackets, self relief, relief scope changes and the SOCSO 350 + 150. Big Four and press summaries agree on the headline items. No source mentions the RM400 rebate or the RM35,000 threshold, which supports the repo's "carried forward (unconfirmed)" treatment.

No disagreement with the repo was found in a primary source. The only conflicts are in secondary sources: incomplete band tables, and the known press error on the LINDUNG KENDIRI RM150, which the repo already records. The status is still "proposed": no Finance Bill 2026 tabling and no LHDN 2027 MTD spec were found as of 6 Nov 2026.

### Cited Findings
**Agreements: brackets (Lampiran 1)**
- The proposed table in the speech annex is 0–5,000 0; 5,001–20,000 1; 20,001–35,000 3; 35,001–50,000 6; 50,001–70,000 11; 70,001–100,000 **18**; 100,001–150,000 **24**; 150,001–400,000 25; 400,001–600,000 26; 600,001–1,000,000 28; above 1,000,000 30, "Mulai tahun taksiran 2027". This matches the repo exactly — [Budget 2027 speech, Lampiran 1, pp.191–192](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf).
- The "current position" table in the same annex matches the repo's YA2026 table: 70,001–100,000 19; 100,001–400,000 25; 600,001–2,000,000 28; above 2,000,000 30 — [ub27.pdf Lampiran 1, p.191](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf).
- Speech para 29–30: a one-point cut, to 18% on RM70,001–100,000 and to 24% on RM100,001–150,000. The rate above RM1m "diselaraskan kepada 30 peratus". Para 31 gives up to RM1,600 more disposable income for about 5 million taxpayers — [ub27.pdf pp.28–29](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf).
- PwC (via TechNode) says relief rises from MYR9,000 to MYR12,000, with 18% on MYR70,001–100,000 and 24% on MYR100,001–150,000, and "up to MYR1,600" — [TechNode, 11 Oct 2026, quoting PwC](https://technode.global/2026/10/11/malaysia-budget-2027-malaysia-budget-2027-cuts-taxes-for-m40-smes-while-targeting-smaller-fiscal-deficit-pwc/).
- Deloitte's snapshot says relief RM9,000 → RM12,000, a one-point cut for chargeable income RM70,000–RM150,000, and 30% above RM1m (down from RM2m). Affected taxpayers "could pay up to RM20,000 more" — [Deloitte Budget 2027 snapshot](https://www.deloitte.com/southeast-asia/en/services/tax/perspectives/malaysia-budget-2027-snapshot.html).
- Malay Mail's arithmetic agrees with the repo's rates:
  - Rates only: RM300 saving at chargeable income RM100,000 and RM800 at RM150,000.
  - RM19,200 more tax at RM2m.
  - Combined with the relief: RM840 at RM100k and RM1,520 at RM150k.
  - Our script reproduces all five figures from the repo brackets.
  - [Malay Mail, 16 Oct 2026](https://www.malaymail.com/news/malaysia/2026/10/16/budget-2027-how-much-tax-could-malaysians-save-under-the-proposed-new-rates-we-did-the-maths-for-you/239089).
- The repo's RM1.5m cross-check (388,400 → 397,600) is reproduced by our script.

**Agreements: self relief (Lampiran 2)**
- Individual and dependent-relatives relief goes from RM9,000 to RM12,000 "Mulai tahun taksiran 2027". It was last revised in YA2010, from RM8,000 — [ub27.pdf Lampiran 2, p.193](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf).
- Press confirms it: [Malay Mail, 9 Oct 2026](https://www.malaymail.com/news/malaysia/2026/10/09/budget-2027-individual-tax-relief-rises-to-rm12000-income-tax-percentage-lowered/238401); [The Star](https://www.thestar.com.my/news/nation/2026/10/09/budget-2027-individual-tax-relief-raised-to-rm12000); [Emerhub](https://emerhub.com/news/malaysia-budget-2027-cuts-sme-and-individual-income-tax-rates-from-ya2027/), which says it is "subject to the relevant legislation".

**Agreements: other reliefs (Lampiran 3–9), all from YA2027 unless stated** — all [ub27.pdf pp.194–202](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf):
- Lampiran 3, parents and grandparents (cap 8,000 unchanged): all types of care expense at home, day-care and residential care, no longer limited to health care. Evidence is the carer's written certificate or work permit plus receipt, with no doctor certification. This matches the repo.
- Lampiran 4, medical: renamed "Kesejahteraan Kesihatan", cap kept at RM10,000. It adds post-natal care up to RM3,000, and breastfeeding equipment (child ≤2) up to RM1,000 "sama ada dibayar oleh diri sendiri atau pasangan". The separate breastfeeding relief "disatukan" (merged) into it. This matches the repo, including "self or spouse".
- Lampiran 5, education: renamed "Yuran Pengajian dan Latihan Kemahiran", cap kept at RM7,000.
  - Certificate to PhD in any field.
  - TVET up to RM3,000 for self or spouse.
  - Up to RM2,000 for non-work courses for self or spouse, or STEM, arts, language or religion classes for children.
  - The lifestyle course-fee item is merged in.
  - This matches the repo.
- Lampiran 6, lifestyle: cap stays RM2,500. Adds AI software and app subscriptions (self, spouse or child), adoption from a registered shelter, and registered vet services for **vaccination and sterilisation**. This matches the repo; the repo's "pet adoption/vet" is a shorthand.
- Lampiran 7, sports: cap stays RM1,000, with sports shoes up to RM300. This matches the repo.
- Lampiran 8, tourism admission: RM1,000 extended "Bagi tahun taksiran 2027" only. This matches the repo.
- Lampiran 9, SOCSO relief:
  - Scope widened to mandatory LINDUNG KENDIRI in 3 sectors (passenger transport, goods or food transport, hawkers), with the cap kept at RM350.
  - Plus an "additional relief limit" of up to RM150 for "caruman sukarela" to LINDUNG 24 and the 17 non-mandatory LINDUNG KENDIRI sectors.
  - This matches the repo's reading that the RM150 is for voluntary contributions. Pooling is not stated in the text, which matches the repo's "unconfirmed".

**Agreements: rebates and the RM35,000 threshold**
- The Lampiran 1–9 text and speech paras 29–31 never mention the s.6A rebate or the RM35,000 threshold. The only "rebat" mentions in the speech are unrelated programmes, such as NUR MADANI — [ub27.pdf](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf).
- No secondary source mentions a change either: the Malay Mail and Emerhub summaries "do not mention" a rebate. The rule currently in force is RM400 where chargeable income ≤ RM35,000 — [PwC Tax Summaries](https://taxsummaries.pwc.com/malaysia/individual/other-tax-credits-and-incentives).

**Disagreements (secondary sources only, none with the repo's primary reading)**
- Emerhub's comparison table leaves out the RM400,001–600,000 band and the rates below RM70k. It says they are unchanged but doesn't give them. This is incomplete, not wrong — [Emerhub](https://emerhub.com/news/malaysia-budget-2027-cuts-sme-and-individual-income-tax-rates-from-ya2027/).
- Deloitte gives RM840 at RM100,000 and RM1,520 at RM150,000 as savings. These include the RM3,000 relief, measured on pre-relief chargeable income of RM100k/150k. Malay Mail's RM300/RM800 are rate-only figures. Both are arithmetically right but answer different questions — [Deloitte](https://www.deloitte.com/southeast-asia/en/services/tax/perspectives/malaysia-budget-2027-snapshot.html); [Malay Mail](https://www.malaymail.com/news/malaysia/2026/10/16/budget-2027-how-much-tax-could-malaysians-save-under-the-proposed-new-rates-we-did-the-maths-for-you/239089).
- The repo itself records that Malay Mail and Bernama attach the RM150 to *mandatory* LINDUNG KENDIRI, which conflicts with Lampiran 9's "caruman sukarela". This pass re-read Lampiran 9 and it supports the repo — [ub27.pdf Lampiran 9, p.202](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf).
- One search summary claimed Deloitte (RM70k–150k) and L&Co (RM70k–100k at 18%) "conflict". They don't: the cut spans two bands, 18% and 24%.

**Status (still proposed)**
- No report of a Finance Bill 2026 first reading was found as of this search. Precedent: the Finance Bill 2025 had first reading on 18 Nov 2025 — [MOF press citation](https://mof.gov.my/portal/en/news/press-citations/two-finance-ministry-bills-tabled-for-first-reading-in-dewan-rakyat).
- HASiL's employer spec page lists the "Spesifikasi Pengiraan PCB 2026" and no 2027 spec. Its approved payroll-software list covers specs for 2012–2026, as at 17 Aug 2026 — [HASiL Majikan spesifikasi data](https://www.hasil.gov.my/majikan/majikan-payroll-spesifikasi-data/); [HASiL software list](https://www.hasil.gov.my/wp-content/uploads/List-of-Software-Provider-Payroll-System-approved-as-at-17-Aug-2026-.pdf).

### Inferences
- The repo's YA2027 template has **no factual disagreement** with the official speech annex on any Budget 2027 item checked: brackets, self relief, and Lampiran 3–9.
- The "up to RM1,600" headline fits the repo brackets (our arithmetic, proposed, not law). Same pre-relief chargeable income, comparing YA2026 with YA2027 (chargeable income less the 3,000 extra relief):
  - About RM1,520 at RM150k.
  - RM1,550 from about RM153k to RM400k.
  - About RM1,580 at RM400k–600k.
  - RM1,640 at about RM603k–1.003m.
  - The saving then shrinks, because of the 30% rate above RM1m, and turns negative above roughly RM1.085m.
  - So "up to RM1,600" reads as a rounded figure for the RM150k–RM1m range.
- The repo's statement that the MOF English annex and the Malay speech annex agree could not be re-verified this pass, because the English PDF text couldn't be extracted. The Malay annex alone confirms every figure.

### Gaps
- The KPMG Budget Snapshot 2027 PDF is AES-encrypted and couldn't be read — [KPMG snapshot](https://assets.kpmg.com/content/dam/kpmgsites/my/pdf/2026/10/budgetsnapshot2027.pdf). The EY Take 5 and PwC Tax in Motion PDFs were not read in this pass, so PwC was covered only through TechNode's summary.
- No source, primary or Big Four, says anything about the RM400 rebate, the spouse rebate, the non-resident 30% rate, the EPF/life-insurance caps or the other carried-forward reliefs for YA2027. Silence is not confirmation. These stay "carried forward, unconfirmed" until the Finance Bill.
- Whether the SOCSO RM150 is a separate bucket or pooled with the RM350 is not settled by any public text found.
- The Dewan Rakyat order papers for Nov 2026 were not checked directly, so a very recent Finance Bill first reading can't be ruled out.

## 3. Illustrative YA2027 annual tax, monthly PCB and take-home at RM2,000 / 4,000 / 5,000 / 9,000 / 15,000 (single, age 30)

### Takeaway
**Proposed, not law.** Under the Budget 2027 brackets and RM12,000 self relief, with EPF, SOCSO (SKBBK included) and EIS kept at 2026 values, monthly take-home rises by:
- RM0 at RM2,000
- **RM7.50** at RM4,000
- **RM15.00** at RM5,000
- **RM65.84** at RM9,000
- **RM129.17** at RM15,000

These are annual tax savings of RM0 / 90 / 180 / 790 / 1,550.

### Cited Findings
- Method:
  - YA2026 baseline: `breakdown(gross, age=30, year=2026)` from `docs/research/data/v1-baseline.py`, loaded read-only with importlib under `python3 -I`.
  - YA2027: our own script, with chargeable income = 12 × gross − min(12 × employee EPF, 4,000) − 12,000; tax from the Lampiran 1 brackets; RM400 rebate if chargeable income ≤ 35,000; PCB = annual tax ÷ 12 to the sen. This is the v1 method in `docs/research/v1-baseline.md` §4 ("PCB is annual tax ÷ 12").
  - The SOCSO RM350 relief is not deducted, as in v1. Brackets come from [ub27.pdf Lampiran 1–2](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf).
- Every YA2027 annual tax below equals the repo template's Table 1 formula, `trunc2((P−M)×R)+B` with category 1 B from `pcb-spec-2027-template.json`, at all five salaries (script check: all True).
- Every YA2026 bracket-by-bracket figure equals v1-baseline.py's `annualTax` (script assertion).

**Deductions at 2026 values (same for both years), RM/month**

| Gross | Employee EPF | SOCSO (with SKBBK) | EIS |
|---|---|---|---|
| 2,000 | 220.00 | 24.40 | 3.90 |
| 4,000 | 440.00 | 49.40 | 7.90 |
| 5,000 | 550.00 | 61.90 | 9.90 |
| 9,000 | 990.00 | 74.40 | 11.90 |
| 15,000 | 1,650.00 | 74.40 | 11.90 |

**YA2026 (enacted) vs YA2027 (PROPOSED, NOT LAW), annual RM unless stated**

| Gross/month | Year | Chargeable income | Band (M) and rate | Tax before rebate | Rebate | Tax after rebate | PCB/month | Take-home/month |
|---|---|---|---|---|---|---|---|---|
| 2,000 | YA2026 | 12,360 | 5,001–20,000 @ 1% | 73.60 | 73.60 | 0.00 | 0.00 | 1,751.70 |
| 2,000 | **YA2027 proposed** | 9,360 | 5,001–20,000 @ 1% | 43.60 | 43.60 | 0.00 | 0.00 | 1,751.70 |
| 4,000 | YA2026 | 35,000 | 20,001–35,000 @ 3% | 600.00 | 400 | 200.00 | 16.67 | 3,486.03 |
| 4,000 | **YA2027 proposed** | 32,000 | 20,001–35,000 @ 3% | 510.00 | 400 | 110.00 | 9.17 | 3,493.53 |
| 5,000 | YA2026 | 47,000 | 35,001–50,000 @ 6% | 1,320.00 | 0 | 1,320.00 | 110.00 | 4,268.20 |
| 5,000 | **YA2027 proposed** | 44,000 | 35,001–50,000 @ 6% | 1,140.00 | 0 | 1,140.00 | 95.00 | 4,283.20 |
| 9,000 | YA2026 | 95,000 | 70,001–100,000 @ 19% | 8,450.00 | 0 | 8,450.00 | 704.17 | 7,219.53 |
| 9,000 | **YA2027 proposed** | 92,000 | 70,001–100,000 @ **18%** | 7,660.00 | 0 | 7,660.00 | 638.33 | 7,285.37 |
| 15,000 | YA2026 | 167,000 | 100,001–400,000 @ 25% | 26,150.00 | 0 | 26,150.00 | 2,179.17 | 11,084.53 |
| 15,000 | **YA2027 proposed** | 164,000 | 150,001–400,000 @ 25% (plus the new 24% band below it) | 24,600.00 | 0 | 24,600.00 | 2,050.00 | 11,213.70 |

**Change, YA2027 proposed minus YA2026 (proposed, not law)**

| Gross/month | Annual tax change | PCB change/month | Take-home change/month | Main driver |
|---|---|---|---|---|
| 2,000 | 0 | 0.00 | 0.00 | Already no tax: the rebate covers it in both years |
| 4,000 | −90 | −7.50 | +7.50 | RM3,000 relief × 3% |
| 5,000 | −180 | −15.00 | +15.00 | RM3,000 relief × 6% |
| 9,000 | −790 | −65.84 | +65.84 | Relief × 19% (570) + 1-point cut on 22,000 above 70k (220) |
| 15,000 | −1,550 | −129.17 | +129.17 | 1-point cut on RM70k–150k (800) + relief × 25% (750) |

- These match the repo's own figures:
  - RM5,000 PCB of 95.00 vs 110.00 (pcb.md §6.3; v1-baseline.md §5).
  - RM4,000 annual tax of 110.00 (pcb.md §6.3, "total 110.00").
  - The YA2026 take-home values match v1-baseline.md §6 (for example 4,268.20 at RM5,000 and 11,084.53 at RM15,000).

### Inferences
- At RM4,000, the v1 method (÷12) shows PCB of 9.17. A real LHDN month-by-month payslip would show **0.00 in January, then 10.00 February to December**, because MTD below RM10 is set to 0 (pcb.md §6.3, model values). The annual tax is the same, 110.00; only the payslip timing differs.
- The gain is largest for people whose income reaches the RM70k–150k bands. For a single person at RM15,000/month, the proposed 1-point cut is worth more than the higher relief. The relief alone is worth 3,000 × the marginal rate.
- These figures exclude the minimum wage rise to RM2,000 from June 2027 (speech para 32, [ub27.pdf p.29](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf)), as instructed. The EPF floor is held at 2026 values. They also exclude optional TP1 reliefs such as the SOCSO 350 (+150 proposed).

### Gaps
- The figures are illustrative. The final Finance Act could change rates or relief amounts, and LHDN's 2027 MTD spec (formula, rounding, Table 1) is unpublished.
- EPF, SOCSO and EIS for 2027 are assumed unchanged (no 2027 schedules were checked in this pass).

## 4. Proposed Table 1 (M, R, B) and whether the RM400 rebate or RM35,000 threshold changes

### Takeaway
A YA2027 Table 1 can be derived from Lampiran 1 (proposed, not law, our derivation). It matches the repo's `pcb-spec-2027-template.json` exactly. The rows below RM70k, and therefore the rebate rows (B −400/−250 for categories 1 and 3, −800/−650 for category 2), don't change.

The RM35,000 chargeable-income threshold isn't changed by Budget 2027. But because self relief rises by RM3,000, the rebate cliff moves up by **RM250 a month in salary terms**: from RM4,000 → RM4,001 to **RM4,250 → RM4,251** for a single person aged 30 on Part A EPF. The cliff itself, about RM33.39/month more PCB, stays.

### Cited Findings
**Derived Table 1** (our script; B = tax at M, less 400 (category 1/3) or 800 (category 2) where M < 35,000). Brackets from [ub27.pdf Lampiran 1](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf):

| P range (floor) | M | R YA2026 → YA2027 | B cat 1 & 3: YA2026 → YA2027 | B cat 2: YA2026 → YA2027 |
|---|---|---|---|---|
| 5,001–20,000 | 5,000 | 1% → 1% | −400 → −400 | −800 → −800 |
| 20,001–35,000 | 20,000 | 3% → 3% | −250 → −250 | −650 → −650 |
| 35,001–50,000 | 35,000 | 6% → 6% | 600 → 600 | 600 → 600 |
| 50,001–70,000 | 50,000 | 11% → 11% | 1,500 → 1,500 | same |
| 70,001–100,000 | 70,000 | 19% → **18%** | 3,700 → 3,700 | same |
| 100,001–150,000 (new) | 100,000 | 25% → **24%** | 9,400 → **9,100** | same |
| 150,001–400,000 (new row) | 150,000 | – → 25% | – → **21,100** | same |
| 400,001–600,000 | 400,000 | 26% → 26% | 84,400 → **83,600** | same |
| 600,001–1,000,000 (was to 2,000,000) | 600,000 | 28% → 28% | 136,400 → **135,600** | same |
| above 1,000,000 (was above 2,000,000) | 1,000,000 (was 2,000,000) | 30% → 30% | 528,400 (at M 2m) → **247,600** (at M 1m) | same |

- All YA2027 rows equal the repo's `pcb-spec-2027-template.json` `table1` (M, R and B by category), and the template formula gives the same annual tax at all five test salaries (script check).
- The s.6A rebate is RM400 where chargeable income ≤ RM35,000, under current law — [PwC Tax Summaries](https://taxsummaries.pwc.com/malaysia/individual/other-tax-credits-and-incentives). Budget 2027's individual measures (Lampiran 1–9) don't propose changing it — [ub27.pdf](https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf).

**Cliff location** (single, age 30, Part A EPF, PCB = annual ÷ 12; proposed, not law):
- **YA2026:** chargeable income first exceeds 35,000 at RM4,001. PCB goes from 16.67 at RM4,000 to 50.06 at RM4,001, and take-home falls RM36.79 (v1-baseline.md §6).
- **YA2027 proposed:** chargeable income first exceeds 35,000 at **RM4,251**.
  - RM4,250: chargeable income 35,000.00, PCB 16.67, take-home 3,702.73.
  - RM4,251: chargeable income 35,012.00, PCB 50.06, take-home 3,670.34, a fall of RM32.39.
  - In the same RM4,001–4,250 range, YA2027 PCB is 9.20 at RM4,001, against 50.06 under YA2026: a saving of about RM40.86/month just above the old cliff.
- The repo's pcb.md §6.2 thresholds column ("YA2027 template … Single, Part A 4,028 / 3,723"; "Category 2 … 4,584") already reflects this shift of about RM250 to RM264 under the month-by-month method (for example 3,778 → 4,028; 4,334 → 4,584; Part C 3,647 → 3,911).

### Inferences
- The rebate doesn't interact differently in mechanics: it stays inside B, on rows with M < 35,000, and the B values for those rows are unchanged because the brackets below RM70k are unchanged.
- What changes is who gets the rebate. Because self relief rises by RM3,000, about RM3,000 a year (RM250/month) more gross income fits under the RM35,000 chargeable-income line. So more low-to-middle earners keep the RM400 rebate. For anyone earning between the old and new cliff (about RM4,001 to RM4,250/month single), the combined saving is close to RM400 + 3,000 × 3%, roughly RM490/yr, rather than RM90 or RM180. This is our arithmetic and proposed, not law.
- Edge case already in both years: row selection uses floor(P), so a P such as 35,000.50 falls in the 20,000 row and gets the rebate in B. Under the Act, chargeable income above 35,000 wouldn't. This has a negligible effect for whole-ringgit salaries.

### Gaps
- LHDN has not published a 2027 MTD spec, so the official Table 1 B values, and whether the Rules amendment takes effect on 1 Jan 2027, are unknown. The B values above are derived, not published — [HASiL spec page lists 2026 only](https://www.hasil.gov.my/majikan/majikan-payroll-spesifikasi-data/).
- No public source was found that comments on whether the s.6A RM35,000 threshold or the RM400 amount will be revisited in the Finance Bill.

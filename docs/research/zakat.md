# Zakat — Wilayah Persekutuan (PPZ-MAIWP)

Research date: **2026-11-04**. Deep verification pass and revision: **2026-11-05**. Scope: Kuala Lumpur, Putrajaya and Labuan only. The machine-readable data is in [`data/zakat-wp.json`](data/zakat-wp.json).

**How this was verified.** The official PPZ calculator at zakat2u.com.my runs its calculation in the browser, in a Vue component (`Pendapatan.vue`) bundled in `https://zakat2u.com.my/js/app.js?v=20260326`. I downloaded that bundle and read the formula and constants directly. I also called the two JSON endpoints the calculator uses, `/nisab-list` and `/nisab-value?year=…`. The worked examples in §6 were run through a line-by-line transcription of the official formula (§3.1). I did not click through the UI by hand, but the UI only displays the result of this JS.

The deep pass checked 12 key claims through three lenses each, and read the gazettes, the Income Tax Act and both LHDN MTD specs directly. Results are in the [Verification log](#verification-log-deep-pass-2026-11-05). **Two tax claims were wrong and are now corrected (§8). All nisab, rate and deduction amounts held up.**

---

## 1. Summary for a non-expert

- **What it is.** *Zakat pendapatan* (income zakat) is a yearly religious levy on Muslims. It is **2.5%** of the income that qualifies.
- **Who pays in WP.** Muslims whose **workplace** is in KL, Putrajaya or Labuan. Under a gazetted WP fatwa (P.U.(B) 316/2021), income zakat goes to the territory where you work, not where you live.
- **The threshold (nisab).** Zakat is due only if the qualifying income for the year is **at least the nisab**, the value of 85 g of gold. PPZ-MAIWP sets **one nisab per calendar year**:
  - **2025: RM29,740**
  - **2026: RM33,996**
- **Two ways to calculate. The user chooses; both are valid.**
  1. **Without deductions ("Tanpa Tolakan").** 2.5% × total gross annual income, provided the gross is at least the nisab. Simpler, but you pay more.
  2. **With deductions ("Dengan Tolakan").** Subtract fixed allowances first: self RM12,000, each wife RM5,000, each child under 18 RM2,000, each child 18+ studying RM5,000. Also subtract what you actually give your parents, your own education (up to RM2,000) and your EPF contribution. If the remainder is at least the nisab, pay 2.5% of the remainder.
- **There is no one-year waiting period (haul)** for income zakat. It is assessed on the calendar year's income, and most people pay it monthly.
- **Effect on take-home pay.** For a tax-resident employee, zakat is a **ringgit-for-ringgit rebate against income tax**. If you pay zakat through your employer (PPZ's *Skim Potongan Zakat Bulanan, PZB*), your monthly tax deduction (PCB/MTD) falls by the zakat amount. Up to your tax bill, zakat therefore **replaces** tax instead of adding to your deductions.
- **When zakat does cost you extra.** Only the part above your remaining tax bill lowers your take-home pay, and that part is lost: it is not refunded or carried to next year. Low earners should note that the RM400 self and spouse rebates use up the tax bill first (§8).
- **Non-residents get no rebate.** A non-resident Muslim on the flat 30% tax pays zakat on top of tax, with no offset (§8.3).
- **Some real-life cases have no published rule.** PPZ does not say how to treat someone who works only part of a year, when a child's age is tested, or whether non-cash benefits count. The report marks these clearly, and the app needs a stated default for each (§10, [Questions for the owner](#questions-for-the-owner)).

---

## 2. Applicability rules

| Rule | Detail | Source / confidence |
|---|---|---|
| Religion | Muslim only. No citizenship condition appears in the fatwas or in Act 505's definition of "Muslim". | zakat.com.my *Syarat Wajib*; P.U.(B) 152/1999, 316/2021. High |
| Jurisdiction | Pay to the state or territory where you **work**, "walaupun pembayar zakat itu tidak menetap di negeri tersebut". WP fatwa from the 109th meeting of the Jawatankuasa Perundingan Hukum Syarak WP (31 Jul 2018), dated 28 May 2021, gazetted 1 Jun 2021 as P.U.(B) 316/2021. The gazette's own example: someone who works in Putrajaya and lives in Selangor pays in Putrajaya. So the app should ask for **workplace state**, not home state. | Gazette text read. **High** |
| Territories | KL, Putrajaya and Labuan all fall under it, with no separate Labuan rule. Act 505 covers KL and Labuan from 15 Oct 1993 and Putrajaya from 1 Feb 2001. PPZ runs a Labuan counter. | Act 505 s.1, s.2; zakat.com.my. High |
| Works outside WP | A KL resident who works in Selangor falls outside this module. | Same fatwa. High |
| Who the fatwa legally binds | Act 505 s.34(3) makes a gazetted fatwa binding on "every Muslim resident in the Federal Territories". A Selangor resident working in KL is the case the fatwa names, but its binding force formally reaches FT residents. A 2001 Selangor fatwa reportedly claims anyone who lives **or** works in Selangor, so both bodies may claim that person. The app should describe this as the WP position, not a nationwide rule. | Act 505 read. The Selangor fatwa is from secondary sources only. Medium |
| Remote, hybrid or multi-state work | **No rule.** "Negeri tempat dia bekerja" is not defined, and no Mufti WP or PPZ ruling covers it. | Gazette; e-Fatwa list of 27 zakat fatwas. High that no rule exists |
| Fatwa still in force | No amendment or revocation found. The Mufti (WP) Bill 2024's status is unconfirmed; an existing fatwa should survive under the usual saving provisions, but I did not verify that. | e-Fatwa portal, checked 2026-11-05. Medium-high |
| Haul | **None** for income zakat: "Zakat Pendapatan, Pertanian dan Rikaz tidak disyaratkan haul". The assessment year is the **Gregorian** calendar year, which the calculator labels "Tahun / Haul". Mufti WP Al-Kafi #1076 (2019) speaks generally of nisab and haul for workers, but PPZ's page is the collector's operative position. | zakat.com.my *Syarat Wajib*. High |
| Nisab | 85 g gold at the **published annual figure** for the haul year (§4). | High |
| Nisab test | **On or above** the nisab (`>=`). Without deductions, the test uses **gross** income (salary plus other income). With deductions, it uses income **after** deductions. The infographic says "melebihi" (exceeds), but the calculator code and PPZ's savings and gold pages ("menyamai atau melebihi") support `>=`. The two differ only at an exact tie. | Official JS. High |
| Age | No age condition for income zakat. PPZ also says children with savings above the nisab owe savings zakat (Sinar Harian). | *Syarat Wajib* lists no age or baligh condition. High |
| Gender / spouse | The calculator has only an **"Isteri"** (wife) field, for 0–4 wives. It has **no husband deduction**, so a female payer has no spouse deduction there. Every PPZ version from 2007 to the 2025 booklet lists "wife" only. | Official JS; 2025 booklet. **High** that PPZ publishes no husband deduction. Counter practice is unknown (§10) |
| Working wife | The husband's RM5,000 has no published "wife must not work" condition. A working wife also files her own assessment with self RM12,000, because zakat is assessed on the individual, not the household. | Calculator; AZJAF 4(3). Medium |
| Children | Only children **under your care** ("di bawah tanggungan sahaja"). Two categories: under 18, and 18+ **studying**. The infographic and booklet say "belajar IPT" (higher education); the calculator says only "belajar". A child 18+ who is not studying gets **RM0**. A 2017-only note gave such a child RM2,000, but PPZ dropped it in March 2018. | 2025 booklet, infographic, JS, Wayback. High |
| Child age test and "IPT" | **Not published.** No document gives the date age is tested. A child aged exactly 18 fits neither label. Form 6, matriculation, TVET, foreign university and part-time study are not addressed. There is no apportionment, so a child sits in one category for the whole year. | Searched and silent. High that no rule exists |
| Both parents claiming one child | **No WP rule.** The calculator cannot detect it. Pahang's FAQ (not binding on WP) says a child is claimed once, and a couple may split several children by agreement. A working mother may deduct children really under her care: there is no gender gate. | Pahang FAQ by analogy. Medium for the default |

### 2.1 What counts as income

"Pendapatan dari semua sumber" (income from all sources), assessed on the whole year.

| Item | Treatment | Source / confidence |
|---|---|---|
| Salary, wages, bonus, overtime ("tuntutan kerja lebih masa"), arrears | **In.** Bonus is added to income, not treated separately. | Calculator modal; form PPZ 052 item 8; PPZ FAQ (Wayback 2016). High |
| Fixed allowances, including travel or phone, and tax-exempt ones | **In.** P.U.(B) 152/1999 names "elaun". PPZ has no tax-exemption carve-out. | Gazette. High (the tax-exempt part is inferred) |
| Gifts, awards, incentives, ESOS, cash perquisites | **In.** The ESOS valuation date is not defined. | Modal; infographic. High |
| Gratuity, compensation, severance, pension | **In,** with no tax-style exemption. Treat as other income in the year received. An old FAQ said compensation is due a year after receipt but paying on receipt is fine; that wording is gone from the site. A lump sum can pull a whole year above the nisab. | Modal; old FAQ. High for in; low for timing |
| Freelance and consultancy fees, contractor payments or profits, commissions and residual income (insurance, takaful, unit trust, broking), royalties | **In.** | Modal; infographic. High |
| Rent from houses, buildings, vehicles, premises, equipment; livestock produce such as milk, eggs, honey | **In.** | Modal; infographic. High |
| Reimbursement claims: lodging, overseas travel, entertainment, mileage and "tuntutan lain-lain" | **Out.** Read "other claims" as money paid against actual costs. A fixed monthly amount paid regardless of spending is an allowance and is in. That boundary is inferred. | Modal. High |
| Employer's EPF share | **Out** when contributed. It becomes zakatable on withdrawal (§3.6). | PPZ KWSP page; 120th meeting fatwa. High |
| Employer's SOCSO and EIS | **Out**, by the same reasoning. No PPZ text. | Inferred. Medium |
| Non-cash benefits-in-kind (company car, housing, phone, medical) | **Unresolved for WP.** No PPZ text names them. Other states' practice varies. Proposed default: out, with an override. | Low |

### 2.2 Worker categories

The take-home formula in §8 assumes a tax-resident employee with EPF and PCB. Other categories differ:

| Category | Kaedah 2 retirement line | PZB and PCB offset | Confidence |
|---|---|---|---|
| Private employee | EPF employee share | Yes | High |
| Government, pensionable (KWAP) | **0.** The employer pays KWAP, so there is no employee contribution to deduct. | Yes. Same formula, different form (Agensi box on PPZ 052). | Medium-high |
| Armed forces with LTAT | **Open.** LTAT takes 10% of salary, and PPZ is silent. PPZ's booklet groups EPF and LTAT as savings without full ownership, which supports deducting it, but that is an inference. | Yes. Separate form PPZ 052 (ATM). | Low; owner decision |
| Government, new non-pensionable with EPF | EPF employee share | Yes | Medium |
| Self-employed | Voluntary EPF, if any (inferred) | **No PCB, so no monthly offset.** The rebate comes through Form B under s.6A(3). s.44(11A) excludes individuals. | High for the rebate route |
| Retiree | 0 (no contribution; inferred) | No PZB. Government pension is often tax-exempt, so the rebate may have no tax to offset, and zakat is then a full cost. | Medium |
| Non-resident Muslim | As above | **No rebate and no offset** (§8.3). | High |
| Non-citizen Muslim working in WP | As above | Follows tax residence. No PPZ rule is specific to non-citizens. zakat2u accepts a passport as ID for direct payment; PZB forms ask for an IC, so PZB access is unconfirmed. | Medium |

**Self-employed: which zakat.** PPZ's booklet lists freelance income, professional fees, contractor payments and commissions under income zakat, so they use the formula in §3.1. Trading income falls under *zakat perniagaan* (one-year haul; Method 3 for small traders is [revenue − costs] × 2.5%), which this module does not cover. PPZ draws no firm line between them: the same page quotes a 1992 Muzakarah that treats professional income as business zakat. PPZ also does not say whether a freelancer's figure is gross receipts or profit.

---

## 3. Exact algorithms

### 3.1 Zakat pendapatan: the official PPZ algorithm (haul ≥ 2018)

Transcribed from `Pendapatan.vue` (computed properties). "round2" means JS `toFixed(2)`, which the official code applies at the steps shown.

```
inputs (all annual RM unless stated):
  kaedah ∈ {TANPA_TOLAKAN (jenis_kiraan=0), DENGAN_TOLAKAN (jenis_kiraan=1)}
  pendapatan_tahunan   // a Bulanan/Tahunan radio: type monthly (computed × 12, the default) or type the annual figure
  pendapatan_lain      // bonus, rental, pension, gifts…
  wives (0..4), childrenUnder18, children18PlusStudying
  parentsSupport       // actual amount, no cap
  selfEducation        // capped at 2,000 (the input is clamped to the max)
  epf                  // EITHER a % of pendapatan_tahunan (default 11, editable) OR an RM amount
  carumanBerzakat      // annual contributions to bodies that pay zakat for you (Tabung Haji, Bank Rakyat, listed co-ops)
  nisab                // for the haul year (§4)

grossIncome = round2(pendapatan_tahunan + pendapatan_lain)

if kaedah == DENGAN_TOLAKAN:
  epfAmt = round2(epf is % ? pendapatan_tahunan × pct/100 : epfRM)   // NB: % applies to pendapatan_tahunan only, not to pendapatan_lain
  deductions = round2( 12000
                     + 5000 × wives
                     + 2000 × childrenUnder18
                     + 5000 × children18PlusStudying
                     + epfAmt
                     + min(selfEducation, 2000)
                     + parentsSupport )
  base = grossIncome − deductions      // not rounded in the official code
else:
  base = grossIncome

zakatable = base >= nisab ? base : 0

if zakatable == 0 (i.e. below nisab):
  annualZakat = 0                                   // the caruman offset is not applied
else:
  annualZakat = round2( zakatable × 2.5% − round2(carumanBerzakat × 2.5%) )
                                                    // NB: the official code does NOT clamp at 0 (see §3.2)
monthlyZakat = round2(annualZakat / 12)
```

Notes taken from the code:

- **Deductions for haul 2018 onward**, in the `default` branch of `setValues()`, which covers 2018 through 2026 and any later year until the code changes: self **12,000**, wife **5,000**, child under 18 **2,000**, child 18+ studying **5,000**. Self-education is capped at **2,000** (`pendidikan_sendiri_max`). **2025 and 2026 use identical amounts.** Builds captured on 2025-02-10, 2025-04-06, 2025-08-08 and 2026-02-16 all have them, and so does the 2025 PPZ booklet. Older tiers, for reference: 2017 was 9,000 / 4,000 / 2,000 / 8,000; 2011–2016 was 9,000 / 3,000 / 1,000 / 0.
- **"Caruman Berzakat" (zakat-paying contributions).** From haul 2018, 2.5% of your annual contribution to a listed zakat-paying organisation is **subtracted from the zakat amount**, because that organisation already pays zakat for you. Up to 2017 it was instead deducted from income. The field sits **outside** the deductions card, so it applies under **both** methods (PPZ's infographic happens to show it only under Cara 2). The full list of 43 bodies (Lembaga Tabung Haji, Bank Rakyat, Koperasi Tabung Haji and many staff co-ops) is in the JSON. Store it per year. An August 2026 public dispute over Tabung Haji's zakat has not changed the calculator, which still lists it.
- **There is no input for "zakat already paid this year".** The calculator computes the **assessment** for the year. Tracking payments against it is a separate matter.
- **No other deductions.** SOCSO, EIS, income tax (PCB), insurance, loans and rent are **not** deductible.
- **Rounding.** 2 decimal places throughout. Monthly = annual ÷ 12, rounded to sen. The official online PZB sign-up link pre-fills that exact figure (`/potongan-gaji/daftar?amaun=29.83`). There is **no published PZB rounding rule**, because the payer chooses the amount: form PPZ 052, guide item 3, says "Jumlah pembayaran zakat untuk potongan gaji dipersetujui pembayar sendiri".
- **PPZ's printed monthly figures do not follow one rule.** The infographic and English booklet show RM358 ÷ 12 as **29.90** (the code gives 29.83), and the 2025 English booklet shows RM625 ÷ 12 as **52.10** (52.08). The 2025 BM booklet shows RM1,515 ÷ 12 as **126.25**, which is exact. Plain round-up to 10 sen would give 126.30, and round-up to 5 sen would give 29.85. Only "exact stays, otherwise round up to 10 sen" fits all three, and PPZ states no such rule. Treat this as a choice for the app, not a statutory value.

### 3.2 Recommended implementation for this app

Same as §3.1, except:

1. **Clamp the result at zero:** `annualZakat = max(0, …)`. The official JS can return a **negative** zakat when the Caruman Berzakat offset is larger than the zakat; example E9 gives −RM598.50. PPZ would not ask anyone to pay a negative amount, so this looks like a UI bug on their side. I could not check whether PPZ's server clamps it.
2. **EPF:** pass the **actual** employee EPF contribution (the calculator's "RM" mode) from the app's EPF module, including EPF on bonus. The official default of 11% × base salary is only an approximation. Remember that the employee rate is 0% for citizens aged 60 and over. For other worker categories, see §2.2.
3. Keep "zakat already paid" (amounts paid this year outside payroll) **separate** from the assessment, as a `remaining = annual − paidYTD` view. Do not mix it into the formula.
4. Round each intermediate to sen the way the official code does, so results match the official calculator exactly. **Copy `toFixed(2)` behaviour, not decimal half-up:** it works on the binary float, so half-sen ties can go down. For example, `34030.60 × 2.5%` gives **850.76** (half-up gives 850.77) and `1035.06 / 12` gives **86.25** (half-up gives 86.26). Do not round `base`.
5. **Income comes from the 12-month schedule** when the app knows it, not monthly × 12 (§3.8). This is a proposal pending an owner decision.
6. Let the user enter their **actual PZB amount**, since the payer sets the real deduction. The PCB module takes that amount as this month's zakat.

### 3.3 Zakat simpanan (savings), advanced

*Not independently verified in the deep pass.*

- **Nisab:** the same annual nisab, 85 g gold. The calculator uses the same `/nisab-value?year=haul−1` lookup.
- **Haul:** one full year.
- **Amount:** **the balance at the end of the haul** ("baki terakhir di penghujung haul"), **not** the lowest balance. This follows the WP fatwa from the 111th MJPHS WP meeting on 4 Oct 2018, which chose end-of-haul balance because checking all year long is impractical. Sum all accounts (savings, fixed deposit, current account, etc.) and compare the total with the nisab.
- **Rate:** 2.5% of the **whole** total if total ≥ nisab, otherwise 0. PPZ's example: 91,000 × 2.5% = 2,275.
- An account whose bank already pays zakat for the depositor **still counts toward the nisab test** (PPZ note). Whether that account's balance is then left out of the zakat payable is **not stated** (§10).
- Calculator formula: `total = Σ balances; zakat = total ≥ nisab ? round2(total × 2.5%) : 0`.

### 3.4 Zakat emas (gold), advanced

*Not independently verified in the deep pass.*

- **Kept gold** (simpan: investment bars or coins, unworn jewellery, or any gold a man owns): uruf/nisab **85 g**, haul one year. If weight ≥ 85 g, zakat = **weight × gold price × 2.5%** on the **whole** weight.
- **Worn jewellery** (pakai): uruf **800 g** in WP. From haul 2017, if weight ≥ 800 g, zakat is 2.5% of the **whole** weight's value. Up to 2016 the uruf was 150 g and only the excess above it was zakatable.
- **Gold price:** PPZ's annual published price, the same figure that sets the nisab: 2025 **RM349.88/g**, 2026 **RM399.95/g**. The calculator calls `/nisab-value/emas?year=haul−2`, which returns 399.95 for haul 2026.
- **Shariah-compliant gold investment** (physical or passbook backed by physical gold): treated as above at 85 g. **Non-compliant** (no physical backing, or forex gold): zakat on the principal only, using the savings-zakat method.

### 3.5 Zakat saham (shares), advanced

*Not independently verified in the deep pass.*

2.5% × (current market value + trust-account balance [+ dividends for long-term holdings] − related costs), if the total is at least the nisab, with **valuation at the end of the haul**. For non-shariah-compliant shares, the profit must be disposed of (given away) and the principal is zakated as savings. Sources: WP fatwas from the 94th meeting (11 Nov 2015) and the 111th meeting (2018).

### 3.6 Zakat KWSP (EPF), advanced

*Not independently verified in the deep pass.*

The WP fatwa from the 120th MJPHS WP meeting (1 Nov 2019) sets these rules. EPF money is **not** zakatable while locked, because it lacks *milk al-taam* (full ownership). Zakat arises **when an amount becomes withdrawable**, at **2.5% subject to the nisab, with no haul**:

| Withdrawal type | Zakat? |
|---|---|
| Savings above RM1 million; age 50, 55 or 60; leaving the country; pensioners and optional retirees | **Yes.** 2.5% of the **whole withdrawable amount** (≥ nisab). Any part not withdrawn after a year falls under savings zakat. |
| Age 50, partial withdrawal from Account 2 | Only the **amount withdrawn**. |
| Age 50 but not withdrawn | At **age 51**, the whole withdrawable amount becomes zakatable. Account 2 money not withdrawn is not zakated. |
| Housing (basic need), education, health, permanent incapacity, and haji (per the calculator) | **No zakat.** Housing withdrawn for investment is zakatable. |

**Unresolved:** the 2019 fatwa predates EPF's May 2024 split into Akaun Persaraan, Sejahtera and Fleksibel. I found **no PPZ ruling on Akaun Fleksibel** (Account 3), which can be withdrawn at any time (§10). The Budget 2027 speech proposes letting EPF Simpanan Shariah members pay zakat directly from dividends. That is not a tax change, and it may affect this section once details are out.

### 3.7 Zakat fitrah

| Year | Rates (per person) | Source |
|---|---|---|
| 2025 (1446H) | **RM7** (local super rice with 5% broken grains, and regular imported rice) / **RM15** (premium imported) / **RM22** (basmathi). | **P.U.(B) 523/2024**, gazetted 24 Dec 2024, read directly. RTM, 26 Feb 2025, and zakat2u `kadar="7"` (Wayback 2025-03-15) agree. |
| 2026 (1447H) | **RM8** (local rice) / **RM15** (super import) / **RM25** (basmati or equivalent). The zakat2u fitrah page currently renders `kadar="8"`. | RTM, 10 Feb 2026, and zakat2u. No 1447H gazette is listed on the e-Fatwa portal. |
| 2027 (1448H) | Not announced. Ramadan 1448H falls around Feb 2027. The 1446H gazette came out in the December before, so check the e-Fatwa portal. | — |

- **The higher tiers are optional.** The 2025 gazette says those "lebih berkemampuan" who wish to pay by the rice they eat may choose them. The base rate is enough. For 2026 this is inferred from the 2025 gazette.
- **Who pays fitrah is wider than income zakat.** The 2025 gazette covers Muslims who live **or** work in WP, not just those who work there.
- Fitrah is due per person (self and dependants) in Ramadan. It is not part of the monthly salary calculation. Fitrah is also covered by the s.6A(3) tax rebate.

### 3.8 Part-year workers, job changes and state moves

**PPZ-MAIWP publishes no rule for any of these.** No source addresses a joiner, leaver or part-year worker. The treatment below is an **inference** from PPZ's annual-income wording.

- **Proposed basis: actual income received in the Gregorian year,** tested against the **whole** nisab, with **whole** fixed deductions. Evidence: "pendapatan kasar setahun" (2003 Muzakarah, on PPZ's live page); "Pendapatan dari semua sumber (Setahun)" (booklet); "dikira semua sumber yang diperolehi dalam setahun" (old PPZ FAQ, Wayback 2011). No pro-rating exists in any PPZ material: nisab comes from a yearly lookup, and fixed deductions are yearly constants.
- **WP has no monthly nisab.** AZJAF lists "2.5% of monthly income if one month reaches nisab" as a method only Pulau Pinang offers.
- **The official calculator gives no warning.** It has no months-worked input, and its default Bulanan mode multiplies by 12. A new joiner who types a monthly salary gets the × 12 answer. Because of the nisab cliff, the two bases can differ by the whole amount: see P1 in §6.2.
- **Leavers and job changes.** Sum all employment income in the year, with no reset. Form PPZ 052 is per employer, so a new employer needs a new authorisation (my reading).
- **Salary changes.** The "Penambahan/Pengurangan" box on form PPZ 052 is a **standing** change to the monthly amount, not a one-off entry. PPZ does not recompute the deduction.
- **Mid-year starter's monthly amount.** The calculator always divides by 12, which under-collects unless the payer tops up. No rule says whether to divide by 12 or by the months left.
- **Moving between WP and another state.** No rule. The natural reading is that income earned while working in WP goes to PPZ, but whether WP's nisab test uses WP income or the whole year's income is unpublished, and no credit or transfer rule between state bodies was found.

### 3.9 Bonus and irregular income

- **Assessment: stated by PPZ.** "Bonus hendaklah dikira bersama dengan pendapatan" (PPZ FAQ, Wayback 2016-12-10; not on the live FAQ, and nothing contradicts it). So a bonus counts toward the annual nisab test and can trip the cliff (example B1 in §6.3).
- **Payment timing: not prescribed.** Annual zakat stays the same; only the month it lands in changes. The options:
  - **Even over 12 months:** what the calculator and booklet produce, but it assumes the bonus is known up front.
  - **On receipt:** a PPZ Threads post of 9 Feb 2026 shows RM10,000 bonus → RM250 (promotional; it ignores deductions and nisab). PZB has no bonus field.
  - **Raising the monthly amount** through Penambahan for the rest of the year.
  - **Year-end top-up:** PPZ's Year End Zakat campaign targets bonus, raises and commission, with payment by 31 Dec to get the rebate.
- Timing changes Net MTD, Z and that month's take-home pay (§8.2). Only amounts actually **paid in the basis year** earn the rebate.

---

## 4. Per-year config

**How PPZ-MAIWP sets nisab:** **one value per Gregorian year**, from 85 g × a published gold price per gram. The Mufti WP (Al-Kafi #1811, 30 Jun 2021) explains that PPZ uses "the mean based on the previous year as the standard of nisab value for the next year". It keeps that value until the end of the year, and gold price moves during the year are deliberately ignored. This differs from **Selangor (LZS)**, which revises twice a year (Jan–Jun 2026 was RM42,047); RinggitPlus's claim that nisab "changes twice a year" does not apply to WP. Supporting evidence:

- Wayback snapshots of the archive page on 2025-03-18, 2025-06-16, 2025-10-15 and 2026-01-20 all show **"Nisab 2025: RM29,740"**, with the same page-modified stamp, so there was no mid-year change in 2025.
- A snapshot from 2026-04-21, plus the live page and API on 2026-11-05, show **33,996**, with the page unedited since 2026-02-26, so there was no mid-year change in 2026 so far.
- The calculator's lookup is keyed by year only, with no dates.
- **Publication lag:** the new year's figure appears on the archive page some weeks into the year. The page dates are **2024-02-02, 2025-02-26 and 2026-02-26**, and the 2026-02-18 snapshot still showed 29,740, so do not hard-code a date. Until the update, PPZ's site shows the previous figure, even in the row labelled with the new year. PPZ states no formal "effective from" date. That the figure applies to the **whole** haul year is inferred from the calculator: haul *Y* always uses the row for *Y*−1, which holds the nisab announced for *Y*.
- **Endpoint semantics:** `/nisab-list` row `tahun: Y` has `tahun_nisab` (the nisab **for haul Y**) and `nisab` (the nisab for haul Y+1). The `2026` row is a placeholder that copies 2025's price (399.95) and nisab (33,996). `/nisab-value?year=2027` returns `{}`.
- **Don't recompute nisab from price.** PPZ's rounding is inconsistent. To the nearest ringgit: 85 × 349.88 = 29,739.80 → **29,740**; 85 × 399.95 = 33,995.75 → **33,996**; 85 × 254.42 = 21,625.70 → **21,626**; 85 × 238.81 = 20,298.85 → **20,299**. Truncated: 85 × 284.69 = 24,198.65 → **24,198**; 85 × 239.55 = 20,361.75 → **20,361**. Store the **published** amount.

### 2025 (final)

| Item | Value |
|---|---|
| Nisab | **RM29,740.00**, 2025-01-01 → 2025-12-31, one period. Gold price RM349.88/g. Published by about 2025-02-26. |
| Silver nisab (reference only) | RM2,466 at RM4.14/g, as published. 595 g × 4.14 = 2,463.30, which does not match, so do not recompute. |
| Rate | 2.5% |
| Deductions (Kaedah 2) | Self 12,000; wife 5,000 each (max 4); child under 18: 2,000; child 18+ studying: 5,000; parents: actual; self-education: actual, capped at 2,000; EPF employee: actual |
| Caruman Berzakat offset | 2.5% of contribution, subtracted from zakat |
| Tax rebate and MTD rules (§8) | s.6A unchanged since YA2019. The 2025 MTD spec has the same zakat rules as 2026. |
| Fitrah | RM7 / RM15 / RM22 (P.U.(B) 523/2024) |
| Emas | Uruf pakai 800 g, simpan 85 g, price RM349.88/g |

### 2026 (final)

| Item | Value |
|---|---|
| Nisab | **RM33,996.00**, 2026-01-01 → 2026-12-31, one period. Gold price RM399.95/g. Published between 2026-02-18 and 2026-02-26. |
| Silver nisab (reference only) | RM3,278 (595 g × RM5.51) |
| Rate, deductions, offset | **Unchanged from 2025** |
| Tax rebate and MTD rules (§8) | **Unchanged from 2025** |
| Fitrah | RM8 / RM15 / RM25 |
| Emas | Uruf pakai 800 g, simpan 85 g, price RM399.95/g |

### 2027 (template)

The nisab is **not announced** (expected around February 2027). All amounts are `null` until verified. Rate 2.5%, the two methods and the uruf weights are structural and expected to carry over. The deduction amounts have not changed since 2018, but they must be re-checked in `setValues()` before 2027 is marked final. **Do not** copy 33,996 into 2027. The live API currently returns it for haul 2027, but only as a placeholder row.

The tax rebate carries forward provisionally: Budget 2027 coverage shows no change to s.6A, but re-check against the Finance Bill and LHDN's 2027 MTD spec, which LHDN usually issues around January.

**No rule in this report needs a mid-year effective-date period.** The rounding convention, jurisdiction fatwa, rebate rules and MTD rules are the same across all three years, and live under `structuralRules` in the JSON.

---

## 5. Proposed TypeScript config schema

```ts
type ISODate = `${number}-${number}-${number}`;

/** One nisab value and the dates it applies to. WP has exactly one period per year, but the schema allows several. */
interface NisabPeriod {
  from: ISODate;              // inclusive
  to: ISODate;                // inclusive
  amountRM: number | null;    // the PUBLISHED figure; never recompute from price
  goldPricePerGramRM: number | null;
  publishedOn?: ISODate | null;
  source: string | null;
}

type ZakatPendapatanMethod = 'TANPA_TOLAKAN' /* Kaedah 1, gross */ | 'DENGAN_TOLAKAN' /* Kaedah 2, with deductions */;

type MonthlyRounding = 'sen' | 'ceil-10sen';      // no PPZ rule; the payer sets the amount (PPZ 052 item 3)

interface ZakatPendapatanRules {
  rate: number;                                   // 0.025
  methods: ZakatPendapatanMethod[];
  deductions: {
    selfRM: number;                               // 12000
    perWifeRM: number;                            // 5000
    maxWives: number;                             // 4
    perChildUnder18RM: number;                    // 2000
    perChild18PlusStudyingRM: number;             // 5000; IPT per the booklet, undefined further
    child18PlusNotStudyingRM: 0;                  // the RM2,000 fallback was 2017 only
    parentsSupport: 'actual';                     // no cap
    selfEducationCapRM: number;                   // 2000
    retirementContribution: 'actual';             // employee share only; see RetirementSource
  };
  zakatPayingContributionOffsetRate: number;      // 0.025, subtracted from zakat (haul ≥ 2018)
  nisabComparison: 'gte';                         // income >= nisab
  assessmentBasis: 'ACTUAL_GREGORIAN_YEAR';       // inferred; no published PPZ rule
  nisabProrated: false;                           // inferred
  fixedDeductionsProrated: false;                 // inferred
  bonusCombinedWithIncome: true;                  // stated by PPZ
  rounding: {
    decimals: 2;
    semantics: 'toFixed';                         // JS toFixed, not decimal half-up; base is not rounded
    monthly: MonthlyRounding;                     // app setting, default pending owner decision
  };
}

interface ZakatYearConfig {
  year: number;                                   // Gregorian haul year
  status: 'final' | 'provisional' | 'template';
  jurisdiction: 'WP';
  nisab: { goldGrams: 85; periods: NisabPeriod[] };
  pendapatan: ZakatPendapatanRules;
  simpanan: { rate: 0.025; basis: 'END_OF_HAUL_BALANCE'; haulMonths: 12 };
  emas: { urufPakaiGrams: 800; urufSimpanGrams: 85; goldPricePerGramRM: number | null; rate: 0.025; wholeWeightAboveUruf: true };
  kwsp: { rate: 0.025; zakatableWithdrawals: string[]; exemptWithdrawals: string[]; haulRequired: false };
  fitrah: {
    ratesRM: { base: number; tier2: number; tier3: number } | null;  // same keys every year
    tierLabels: { base: string; tier2: string; tier3: string } | null;
    higherTiersOptional: boolean | null;
  };
}

/** Not per-year: the same in 2025, 2026 and the 2027 template. */
interface ZakatApplicability {
  religion: 'muslim';
  jurisdictionBasis: 'workplace';
  territories: ['KUL', 'PJY', 'LBN'];
  citizenshipTest: false;
  legalBasis: { ref: string; dated?: ISODate; gazetted: ISODate; source: string }[];
}

/** Not per-year: ITA s.6A unchanged since YA2019. */
interface ZakatRebateRule {
  eligibleResidence: 'resident';
  capRule: 'AGGREGATE_S6A_2_2A_3';                // pooled with the self/spouse and levy rebates
  refundable: false;
  carryForwardYears: 0;
  basis: 'PAID_IN_BASIS_YEAR';                    // by payment date, not haul year
  recipient: 'MALAYSIAN_STATUTORY_RELIGIOUS_AUTHORITY';
}

type TaxResidence = 'resident' | 'non_resident';
type WorkerCategory = 'private_employee' | 'government_pensionable' | 'armed_forces_ltat' | 'government_epf' | 'self_employed' | 'retiree';
type RetirementSource = 'epf' | 'none' | 'ltat';   // 'ltat' is flagged not PPZ-confirmed
type PaymentChannel = 'PZB' | 'DIRECT_WITH_TP1' | 'DIRECT_NO_TP1';
type PaymentSchedule = 'EVEN_12' | 'REMAINING_MONTHS' | 'BONUS_ON_RECEIPT' | 'YEAR_END_TOPUP';  // app setting; moves timing only

/** User inputs for income zakat. */
interface ZakatPendapatanInput {
  method: ZakatPendapatanMethod;
  workplaceState: string;            // gate: KUL, PJY or LBN. Not home state.
  taxResidence: TaxResidence;
  workerCategory: WorkerCategory;
  annualSalaryRM: number;            // sum of amounts received 1 Jan–31 Dec from the 12-month schedule, from all employers
  otherIncomeAnnualRM: number;       // bonus, rental, commission, severance…
  wives: 0 | 1 | 2 | 3 | 4;
  childrenUnder18: number;           // payer's own classification; one category per child per year
  children18PlusStudying: number;
  parentsSupportAnnualRM: number;
  selfEducationAnnualRM: number;     // clamped to the cap
  retirementSource: RetirementSource;
  retirementContributionAnnualRM: number; // from the EPF module for months worked; 0 for pensionable staff
  zakatPayingContributionsAnnualRM: number; // Tabung Haji etc.
  paymentChannel: PaymentChannel;
  paymentSchedule: PaymentSchedule;
  actualMonthlyPzbRM?: number;       // what the payer put on the form; overrides the computed monthly figure
  paidOutsidePayrollYTDRM?: number;  // tracking only, NOT part of the assessment
}

interface ZakatPendapatanResult {
  nisabRM: number;
  grossIncomeRM: number;
  deductionsRM: number;              // 0 for TANPA_TOLAKAN
  zakatableRM: number;               // 0 if below nisab
  meetsNisab: boolean;
  fullYearEquivalentAboveNisab: boolean; // warn when actual income is below nisab but the × 12 figure is above it
  contributionOffsetRM: number;
  annualZakatRM: number;             // max(0, …)
  monthlyZakatRM: number;            // annual / 12, to sen
  zakatRebateUsedRM: number;         // min(zakat, max(0, taxCharged − selfSpouse − levy)); 0 for non-residents
  zakatRealCostRM: number;           // annualZakatRM − zakatRebateUsedRM
}
```

**Choosing the nisab for a period:** WP has one period per year, so `nisab = periods.find(p => p.from <= assessmentDate && assessmentDate <= p.to)`. PPZ assesses the **whole year at the haul-year nisab**. PPZ publishes no rule for blending periods, because WP never has more than one. If another state with several periods is added later, the app needs a new policy decision.

**Do not add fields** for a husband deduction, an OKU-child deduction or a deduction for an 18+ child not studying. PPZ publishes none of them. Do not derive child categories from a date of birth, because PPZ publishes no test date.

---

## 6. Worked examples (haul 2026, nisab RM33,996, unless stated)

All results come from the transcribed official formula (§3.1) and were recomputed on 2026-11-05. EPF uses the calculator default of **11% of salary**, and there is no other income unless stated. The test vectors are in the JSON under `testVectors`.

### 6.1 Full-year employee

| # | Case | Gross | Deductions | Zakatable | Annual zakat | Monthly |
|---|---|---:|---:|---:|---:|---:|
| E1 | Single, RM3,000/mo, **Kaedah 2** | 36,000 | 15,960 (12,000 + EPF 3,960) | **0** (20,040 < nisab) | **0.00** | 0.00 |
| E1b | Single, RM3,000/mo, **Kaedah 1** | 36,000 | — | 36,000 | **900.00** | 75.00 |
| E2 | Single, RM5,000/mo, Kaedah 2 | 60,000 | 18,600 (12,000 + 6,600) | 41,400 | **1,035.00** | 86.25 |
| E2b | Single, RM5,000/mo, Kaedah 1 | 60,000 | — | 60,000 | 1,500.00 | 125.00 |
| E3 | Single, RM10,000/mo, Kaedah 2 | 120,000 | 25,200 (12,000 + 13,200) | 94,800 | **2,370.00** | 197.50 |
| E3b | Single, RM10,000/mo, Kaedah 1 | 120,000 | — | 120,000 | 3,000.00 | 250.00 |
| E4 | Married, 2 kids under 18, RM6,000/mo, Kaedah 2 | 72,000 | 28,920 (12,000 + 5,000 + 2×2,000 + 7,920) | 43,080 | **1,077.00** | 89.75 |
| E4b | Same, Kaedah 1 | 72,000 | — | 72,000 | 1,800.00 | 150.00 |
| E5 | **Just below nisab**: single, RM4,300/mo, Kaedah 2 | 51,600 | 17,676 | **0** (33,924 < 33,996) | **0.00** | 0.00 |
| E5b | **Just above**: single, RM4,310/mo, Kaedah 2 | 51,720 | 17,689.20 | 34,030.80 | **850.77** | 70.90 |
| E5d | Same as E5b with the **real EPF** Third Schedule amount (RM476/mo) | 51,720 | 17,712 | 34,008 | **850.20** | 70.85 |
| E5c | Same as E5 but **haul 2025** (nisab 29,740) | 51,600 | 17,676 | 33,924 | **848.10** | 70.67 |
| E6 | **Kaedah 1, below nisab**: RM2,800/mo | 33,600 | — | **0** (33,600 < 33,996) | **0.00** | 0.00 |
| E6b | Same, **haul 2025** | 33,600 | — | 33,600 | 840.00 | 70.00 |
| E7b | **PPZ's own infographic** (haul 2018, nisab 14,772): 48,000; 1 wife, 1 kid under 18, 1 kid 18+ studying, education 2,000, parents 1,200, EPF 11%, Tabung Haji 1,200 | 48,000 | 32,480 | 15,520 | **358.00** (388 − 30) | 29.83 (infographic shows 29.90) |
| E7 | Same inputs at haul 2026 | 48,000 | 32,480 | 0 (15,520 < nisab) | 0.00 | 0.00 |
| E8 | RM8,000/mo plus RM8,000 bonus; wife; 2 kids under 18 and 1 kid 18+ studying; parents 3,600; education 3,000 (**capped to 2,000**) | 104,000 | 42,160 (EPF 10,560 = 11% of 96,000 only) | 61,840 | 1,546.00 | 128.83 |
| E9 | RM4,500/mo with RM60,000 Caruman Berzakat | 54,000 | 17,940 | 36,060 | **−598.50 officially**; the app should show **0** | −49.88 |

What the examples show:

- **E7b reproduces PPZ's published infographic exactly** (15,520 → 388 − 30 = 358). That confirms the transcription. It works only as a haul-2018 vector, since 15,520 is below every recent nisab. (The earlier version of this report gave haul 2018's nisab as 13,968, which is haul 2019's figure. The result is the same.)
- E1, E5 and E6 show that **the method you choose and the year's nisab can flip the answer between zero and several hundred ringgit**. This "cliff" matters for the UI: at RM4,300 versus RM4,310 a month, zakat jumps from RM0 to RM850.77 a year.
- E5b and E5d show why the EPF figure matters. The real EPF Third Schedule amount is rounded **up** by wage band, so results differ from a flat 11%, and cases close to the cliff can land on the other side. The app should use the real EPF amount.

### 6.2 Part-year worker: single, RM5,000/mo, EPF 11% of income received

These use the proposed **actual-income basis**, which is inferred (§3.8). Compare with E2 and E2b.

| # | Months worked | Haul | Method | Gross | Zakatable | Annual zakat |
|---|---|---|---|---:|---:|---:|
| P1 | 6 | 2026 | Kaedah 2 | 30,000 | 0 (14,700 < nisab) | **0.00** (the × 12 basis gives 1,035.00) |
| P2 | 6 | 2026 | Kaedah 1 | 30,000 | 0 | **0.00** (the × 12 basis gives 1,500.00) |
| P3 | 6 | 2025 | Kaedah 1 | 30,000 | 30,000 (≥ 29,740) | **750.00** |
| P4 | 6 | 2025 | Kaedah 2 | 30,000 | 0 (14,700 < nisab) | **0.00** |
| P5 | 7 | 2026 | Kaedah 1 | 35,000 | 35,000 | **875.00** (first month it becomes due) |
| P6 | 10 | 2025 | Kaedah 2 | 50,000 | 32,500 | **812.50** (first month it becomes due) |
| P7 | 11 | 2026 | Kaedah 2 | 55,000 | 36,950 | **923.75** (first month it becomes due) |

### 6.3 Bonus, dependants and retirement line (haul 2026, Kaedah 2)

| # | Case | Gross | Deductions | Zakatable | Annual zakat |
|---|---|---:|---:|---:|---:|
| B1 | RM4,300/mo plus **RM100 bonus** (EPF on salary only). Compare E5: RM0. | 51,700 | 17,676 | 34,024 | **850.60** |
| D1 | Single, RM4,500/mo | 54,000 | 17,940 | 36,060 | **901.50** |
| D2 | D1 plus a **wife** | 54,000 | 22,940 | 0 (31,060 < nisab) | **0.00** |
| D3 | D1 plus a child at the **under-18** rate | 54,000 | 19,940 | 34,060 | **851.50** |
| D4 | D1 plus the same child at the **18+ studying** rate | 54,000 | 22,940 | 0 (31,060 < nisab) | **0.00** |
| R1 | RM5,000/mo, **pensionable**, no retirement line | 60,000 | 12,000 | 48,000 | **1,200.00** |
| R2 | RM5,000/mo, **LTAT 10%**, flagged not PPZ-confirmed | 60,000 | 18,000 | 42,000 | **1,050.00** |

D3 and D4 show that the unpublished age boundary can move zakat by RM851.50, not just by the RM75 that RM3,000 × 2.5% suggests. The nisab cliff for a single person also moves with the retirement line: about RM3,833/mo with no deduction, and about RM4,259/mo with a 10% deduction.

### 6.4 PPZ's 2025 booklet as test vectors

| # | Source | Gross | Deductions | Zakatable | Zakat − offset | Monthly: code / printed |
|---|---|---:|---:|---:|---:|---:|
| V1 | BM booklet p.7, runs at the 2025 or 2026 nisab | 100,000 | 38,200 | 61,800 | 1,545 − 30 = **1,515.00** | 126.25 / 126.25 |
| V2 | EN booklet p.7, **arithmetic only** | 60,000 | **33,800** | 26,200 | 655 − 30 = **625.00** | 52.08 / 52.10 |

V2 has two problems in the source. The booklet prints total deductions as 32,800, but its items add up to 33,800, and its own next line (26,200) needs 33,800. And 26,200 is below the 2025 and 2026 nisab, even though the booklet says "C is more than nisab", so the calculator gives RM0 for those years. Test it only with an older nisab such as 14,772.

### 6.5 Tax rebate and MTD

Annual rebate (§8.1):

| # | Case | Tax charged | Self/spouse rebate | Zakat | Rebate used on zakat | Real cost of zakat |
|---|---|---:|---:|---:|---:|---:|
| A1 | PR 3/2023 Example 7 (zakat and fitrah) | 570 | 800 | 825 | **0** | **825** (the old formula wrongly gave 255) |
| A2 | Single, chargeable income RM34,000 | 570 | 400 | 300 | **170** | **130** (the old formula wrongly gave 0) |
| A3 | Single, RM5,000/mo, tax after rebate 1,320, zakat 150/mo | 1,320 net | in B | 1,800 | **1,320** | **480** |

Monthly MTD (§8.2), LHDN's own table, identical in the 2025 and 2026 specs:

| MTD | Zakat | MTD on bonus | MTD payable | Added to Z |
|---:|---:|---:|---:|---:|
| 8.00 (treated as 0) | 5.00 | none | 0.00 | 5.00 |
| 15.00 | 20.00 | none | 0.00 | 20.00 |
| 15.00 | 8.00 | none | 7.00 | 8.00 |
| 120.00 | 100.00 | none | 20.00 | 100.00 |
| 8.00 (treated as 0) | 5.00 | 9.00 (treated as 0) | 0.00 | 5.00 |
| 8.00 (treated as 0) | 5.00 | 25.00 | **20.00** | 5.00 |
| 15.00 | 20.00 | 32.55 | **27.55** | 20.00 |
| 15.00 | 8.00 | 127.30 | 134.30 | 8.00 |
| 120.00 | 100.00 | 392.25 | 412.25 | 100.00 |

**Why Z must take the full zakat.** Annual tax 1,440, 12 months left: MTD 120, zakat 100, net 20. Next month, correct (Z = 100, X = 20): (1,440 − 120) / 11 = **120.00**. With excess-only Z (Z = 0): (1,440 − 20) / 11 = 129.09, which over-withholds.

Lump-sum timing, simulated on single RM5,000/mo with annual tax after rebate of 1,320:

| Payment | PCB in the year | Zakat | BE result | Lost |
|---|---:|---:|---|---:|
| RM150/mo through PZB | 0 | 1,800 | no balance | **480** |
| RM1,000 in March, claimed on TP1 | 320 | 1,000 | no balance | **0** |
| RM1,000 in December | 1,210 | 1,000 | **RM890 refund** on the BE return | **0** |

Non-resident: RM5,000/mo, Kaedah 1. Zakat is RM1,500/yr, or RM125/mo. MTD stays RM1,500/mo. Take-home is RM125/mo lower than with no zakat.

---

## 7. User-selectable options (proposed UI)

**Basic** (default view for new users):
1. **"Do you pay zakat?"** Yes/No, default No. Show it only when the user says they are Muslim and work in WP. Ask for **workplace state**, not home state.
2. **Method:** "With deductions (lower, PPZ Kaedah 2)" or "Without deductions (simpler, 2.5% of gross)". Suggested default: **with deductions**, PPZ's main method and the one a sensible newcomer would use. Explain that both are valid.
3. **Payment channel:** "Through my employer (PZB salary deduction)", "I pay PPZ myself and tell my employer (TP1)" or "I pay PPZ myself". This decides how take-home pay is shown (§8).

**More detail** (expandable):
- Number of wives (0–4). Children under 18. Children 18+ in higher education. Help text: "These counts are your own classification. Count each child on one parent's assessment." PPZ's calculator offers no deduction for a husband, a disabled child, or a child 18+ not in higher education. Contact PPZ-MAIWP if your situation differs.
- Annual support given to parents (actual, no cap).
- Own education fees (capped at 2,000; show "max RM2,000").
- EPF: filled in automatically from the EPF module, and editable. Other retirement schemes follow worker category.
- Other income: bonus, rental, commission, freelance, severance (feeds the gross). Fixed allowances count; reimbursement claims do not. Non-cash benefits stay out unless the user adds them.
- Contributions to zakat-paying bodies such as Tabung Haji (offset at 2.5%).
- My actual monthly PZB amount, if different from the computed figure.
- Zakat already paid this year outside payroll (tracking only).

**Who you are** (only when it changes the answer): tax residence, worker category (§2.2), and "Which zakat body do you pay?" for remote or cross-border workers.

**Warnings the app should show:**
- Actual income is below the nisab, but the × 12 figure is above it (a part-year worker).
- A bonus or lump sum takes the year across the nisab.
- Zakat is above the tax bill, so the excess is a real cost.
- Non-resident: no rebate.
- Non-citizen paying zakat abroad: no Malaysian rebate.

**Advanced** (separate panel): savings (balances at the end of the haul), gold (kept/worn grams), shares, EPF withdrawals by type, fitrah household size and rice type (higher tiers shown as optional).

---

## 8. Interaction with income tax and monthly take-home

### 8.1 The annual rebate

- **The rebate (ITA 1967 s.6A(3)).** Zakat, fitrah and other compulsory Islamic payments made in the basis year to a religious authority established under written law (including PPZ-MAIWP), with a receipt, are a **rebate** that reduces **tax payable** ringgit for ringgit. It is a rebate, not a relief, so it does not change chargeable income or move anyone across the RM35,000 self/spouse rebate threshold.
- **The cap is shared, not zakat-only (s.6A(4)).** The **total** of the s.6A(2) self and spouse rebates (RM400 + RM400 when chargeable income is RM35,000 or less), the s.6A(2A) departure-levy rebate and the zakat rebate cannot exceed the tax charged before rebates. The excess is **not refunded and not carried forward**. LHDN Public Ruling 3/2023, Example 7, shows this: tax 570, rebates 800 + zakat 825 = 1,625, so RM1,055 of *combined* excess is lost ("lebihan rebat individu dan zakat"). In that example the personal rebates alone cancel the tax, so the zakat saves nothing.
- **The formulas.** There is no legal order between the rebates, because the cap is pooled. Treating zakat as applied last gives the marginal figure, and matches MTD, where B already includes the RM400/800:

  ```
  taxPayable      = max(0, taxCharged − selfSpouse − levy − zakat)
  zakatRebateUsed = min(zakat, max(0, taxCharged − selfSpouse − levy))
  zakatRealCost   = zakat − zakatRebateUsed
  ```

- **Only zakat the taxpayer paid personally counts. There is no exception for a non-working spouse.** PR 3/2023 para 5.6.5 says zakat paid by a husband or wife who does not work, or has no income, cannot be claimed against the other spouse's tax (Example 8). Under joint assessment, only the assessed spouse's own zakat counts (Example 9). Spouses assessed separately each claim their own (para 5.6.4).
- **The rebate follows the payment date, not the haul year.** Zakat for haul 2026 paid in January 2027 counts toward YA2027.
- **It must go to a Malaysian statutory body.** Zakat paid abroad earns no rebate, even for a resident: PR 3/2023 Example 6 refuses a payment to Majlis Ugama Islam Singapura.
- **Unchanged across the years.** s.6A was last amended by Act 823 (YA2019). Act 862 (YA2025) and Act 874 (YA2026) do not touch it, and PR 3/2023 is still LHDN's current ruling.

### 8.2 Payroll (MTD/PCB)

In LHDN's computerised MTD specification (2025 and 2026 are identical on all of this):
`MTD_month = [ (P − M) × R + B − (Z + X) ] / (n + 1)`, then **`Net MTD = MTD_month − zakat and departure levy for the current month`**.

Here *Z* is the **zakat paid earlier in the year, not counting this month's** (accumulated), and *X* is the MTD already paid.

- **Z takes the month's full zakat,** whether or not it exceeded MTD, including months when MTD under RM10 was set to 0. It is not just the excess. An excess reduces later months only indirectly, because X rose by less. Z also includes zakat declared from a previous employer through TP3, and Z restarts each January.
- **The RM10 rules run in this order.** MTD **before** zakat under RM10 is not deducted at all (counts as 0). Net MTD **after** zakat under RM10 **is** still deducted. MTD on additional pay under RM10 is 0.
- **Bonus months differ.** A negative net amount is not floored straight away. It reduces the bonus MTD in the same month (Step 5). LHDN's table: MTD 15, zakat 20, bonus MTD 32.55 → **27.55**, not 32.55. The total is floored at 0 only at the end.
- **Zakat through payroll** appears on the payslip and EA form. **Zakat paid directly to PPZ** can be declared to the employer on **Form TP1**. It then counts as zakat for the month claimed and does not appear on the payslip or EA form.
- **Zakat payroll has not absorbed by December is not automatically lost.** It is settled on the BE return, where PCB overpaid is refunded. Only the part above the pooled cap in §8.1 is lost.
- **PPZ's own description** (zakat.com.my/zakat-cukai): the employer may remit part or all of the PCB to PPZ. Examples: PCB 100 − zakat 70 = PCB 30; PCB 50 − zakat 70 = nothing.
- **Name of the scheme:** in WP it is the **Skim Potongan Zakat Bulanan (PZB)**; its form calls it "Skim Thohir". "Skim Berkat" is Selangor's (LZS) scheme and does not apply to WP. PPZ says PZB "boleh diselaraskan" (can be coordinated) with PCB, so the offset assumes the employer actually applies Net MTD.
- **Automatic channels on PPZ's website (checked 2026-11-06).** Salary deduction is set up through the online form at ptg.zakat.com.my, which collects the employee's details and the employer's payroll email. PPZ's pages state no minimum amount and don't say what the employer must do. News reports say a salary deduction from RM50 a year qualifies for the scheme's benefits, which I didn't confirm with PPZ. PPZ's menu also lists "Autodebit" and "e-Mandate (Autodebit)", linking to infaqpay.my, but no page I could read describes them. Autodebit from a bank account isn't payroll, so treating it as paying directly (declared on TP1, or claimed at filing) is my inference.

**Monthly take-home effect (for the app):**

```
// mtdRaw and mtdAdditionalRaw come from the PCB module, month by month, rounded up to 5 sen
mtdCurrent    = mtdRaw < 10 ? 0 : mtdRaw
mtdAdditional = mtdAdditionalRaw < 10 ? 0 : mtdAdditionalRaw
net           = mtdCurrent − zakatThisMonth        // may be negative; do not floor yet
mtdPayable    = max(0, net + mtdAdditional)        // with no bonus this is max(0, mtdCurrent − zakat)
takeHome      = gross − EPF − SOCSO − EIS − mtdPayable − zakatThisMonth
// then: Z += zakatThisMonth (the full amount); X += mtdPayable
```

The spec does not say whether to re-round Net MTD to 5 sen after subtracting a zakat amount with odd sen (110 − 29.83 = 80.17). The proposal is not to re-round. The effect is a few sen at most.

- If MTD ≥ zakat, take-home pay is **unchanged** by zakat: the money goes to PPZ instead of LHDN.
- If MTD < zakat (low earners; for example E1b or E6b, where tax is little or nothing), take-home pay falls by `zakat − MTD` that month.
- These two statements only hold when MTD means the amount actually deducted, so take MTD from the PCB module run month by month, not a steady annual/12 figure. Near the RM10 line they can be wrong for single months, though the annual total still comes out right.
- Over the year, the real cost of zakat is `zakatRealCost` in §8.1.
- If the user pays PPZ directly and does not file a TP1, take-home pay falls by the full zakat each month. The tax is only recovered when they file the annual BE return, as a lower balance or a refund, and never more than the pooled cap allows.

### 8.3 Non-residents and others without PCB

- **Non-resident: no rebate and no offset.** s.6A(1) rebates tax on "every individual **resident**", and s.6A(3) sits under that opening. PR 3/2023 paras 4.2, 5.1 and 5.6.1 say the same. The MTD specs put a non-resident on 30% of remuneration under s.D(a), with all zakat terms only in the resident formulas. Neither spec says "no zakat for non-residents" outright: the result comes from s.6A(1) plus the structure of the spec. So take-home falls by the full zakat. **High confidence.**
- **Foreign workers on contracts of 182 days or more** run the resident MTD path, so payroll netting does happen during the year. If they turn out non-resident for the year, the rebate falls away. That last step is my inference; I found no LHDN text on clawback.
- **Self-employed.** No MTD, so no monthly offset. The rebate is claimed on Form B against tax charged, with a receipt, and the same pooled cap applies. No source mentions zakat in the CP500 or CP502 process, so lowering instalments for expected zakat is an inference, not published guidance. That zakat perniagaan paid by a sole proprietor earns the s.6A(3) rebate is my reading of "any zakat"; I found no LHDN statement on it.

---

## 9. Discrepancies vs the old implementation (`financial-view-app/src/lib/salary/rates/zakat.ts`)

| # | Old code | Finding | Severity |
|---|---|---|---|
| 1 | Only Kaedah 2 | PPZ offers **two** methods. Kaedah 1 (2.5% of gross, nisab tested on gross) is missing. | High |
| 2 | Subtracts "zakat already paid" (`alreadyPaidAnnual`) from the assessment | The official calculator has **no** such input. What it subtracts is **2.5% × "Caruman Berzakat"** (contributions to Tabung Haji, Bank Rakyat and listed co-ops), not zakat paid. The "already paid" figure should be a separate tracking value. | High |
| 3 | No Caruman Berzakat offset | Missing (see #2). | Medium |
| 4 | Comment says "nisab moves with the gold price roughly twice a year" | **Wrong for WP**: one nisab per Gregorian year, set from the previous year's average price (Mufti WP; archive snapshots). "Twice a year" describes Selangor. | Medium (affects config design) |
| 5 | `DEFAULT_NISAB = 33_996` used for any unknown year | Silent extrapolation; a 2027 query would quietly return 33,996. Unknown years should be flagged as provisional or rejected. | Medium |
| 6 | Nisab 2024 = 24,198, 2025 = 29,740, 2026 = 33,996 | **All correct** (archive page and live API). | — |
| 7 | Self 12,000; spouse 5,000; child under 18 2,000; child 18+ studying 5,000; education cap 2,000; parents actual; EPF actual; rate 2.5% | **All correct** for 2025 and 2026, and unchanged since 2018. | — |
| 8 | `spouseCount` with no limit or gender | The official field is **wives only, 0–4**. There is no husband deduction for female payers. Rename to `wivesCount` and cap at 4. How to treat female users is an owner decision. | Low/Medium |
| 9 | `meetsNisab = zakatable >= nisab` | Correct (`>=`, after deductions) for Kaedah 2. Kaedah 1 compares **gross**. | — |
| 10 | Rounds zakatable, then zakat, then net/12 | Close, not identical. The official code does **not** round the zakatable amount, and it uses `toFixed` rather than half-up. They can differ by a sen at a half-sen tie. The monthly figure is not a bug: PPZ has no PZB rounding rule. | Low |
| 11 | No clamp issue: `max(0, …)` is applied | Good. The official JS is actually missing this clamp (E9). | — |
| 12 | `otherIncomeAnnual` added to gross; EPF passed as actual | Correct. The official % mode applies EPF only to base salary; using actual EPF (as the old code did) is better. | — |
| 13 | Supported years 2024–2026 | Brief needs 2025, 2026 and a 2027 template. 2024 can be dropped or kept. | Low |
| 14 | Comment claims "verified directly against the live calculator (research doc section 7)" | The deduction values check out. The "twice a year" claim does not. | Low |
| 15 | No workplace or Muslim applicability gating | Add a gate: Muslim **and** workplace in WP. Now backed by the gazette text. | Medium |
| 16 | No tax-rebate / PCB interaction | Needed for take-home pay (§8). | High (for take-home) |
| 17 | `totalIncome = monthlyGrossSalary × 12 + otherIncomeAnnual` | Fine for a full year. A part-year worker can get a zakat figure on income they never received (§3.8, P1). | Medium |
| 18 | Assumes an EPF contributor with PCB | Pensionable staff, self-employed people and non-residents all differ (§2.2, §8.3). | Medium |

---

## 10. Limitations and unverified items

| Item | Status | Confidence |
|---|---|---|
| Nisab 2025 = 29,740; 2026 = 33,996; one period each | Verified: archive page, live API and Wayback history, re-fetched 2026-11-05. | **High** |
| Deductions and formula for 2025 and 2026 | Verified from the official calculator JS (`setValues` default branch and computed props), builds across 2025–2026, the 2025 booklet, and reproduced against PPZ's infographic. | **High** |
| Tax rebate rules | s.6A(1)–(4) read in the AGC/LHDN text as at 1 Jan 2026. PR 3/2023 paras 5.3–5.6 and Examples 6–9 read. | **High** |
| MTD zakat rules for 2025 and 2026 | Both specs read. The 2025 spec was recovered from Wayback, and the two match on every zakat, rebate, fitrah and levy line. | **High** |
| Workplace jurisdiction fatwa | Gazette read. Exceptions and remote work: none stated. | **High** for the text |
| Exact effective date of each nisab | PPZ applies it per haul year (1 Jan–31 Dec) but publishes it in February. No official "effective from" date is stated. | Medium-high |
| How the gold price behind the nisab is derived (which series or average) | Mufti WP says "previous year's mean", but the published 399.95 for 2026 looks low next to 2025 market prices. The series and window are not published. Store published figures only. Not independently verified in the deep pass. | Medium |
| 2027 nisab | **Not announced.** The live API returns 33,996 for haul 2027 only as a placeholder. | — |
| Monthly PZB rounding | **Resolved as "no rule".** The payer sets the amount (form PPZ 052). PPZ's printed examples are mixed (§3.1). I did not reach majikan.zakat.com.my, and MyMajikan needs a login. | High that no published rule exists |
| Husband deduction, OKU-child deduction, deduction for a child 18+ not studying | **None published** for 2018–2026. Old FAQs (2009–2012) said amounts were guides and "tolakan boleh dibuat berdasarkan perbelanjaan sebenar" within basic expenses, but that wording is gone and never named these. An AZKA-noted university project on deductions for wives who contribute to family support (2022) has no adopted output. Whether a PPZ counter would accept them on manual assessment is unknown. | High for published; low for counter practice |
| Child age test date, "IPT" scope, working wife's RM5,000, shared children | **Not published.** See §2. Only PPZ can settle these. | High that no rule exists |
| Part-year assessment, mid-year state moves | **Not published.** The treatment in §3.8 is inferred. | Medium for the inference |
| Bonus payment timing | Not prescribed. Assessment rule stated in a FAQ no longer live. | Medium |
| Non-cash benefits-in-kind | **Not published for WP.** An academic paper says Malaysian zakat institutions in practice do not levy all BIK (abstract only; full text timed out). A paper on Kelantan favours exemption. Neither binds WP. | Low |
| LTAT in place of EPF | PPZ is silent. LTAT figures come from search excerpts of annual reports, since the PDFs returned 404 and Act 101 was not read. | Low |
| KWAP has no employee contribution | A KWAP Q&A bulletin plus search excerpts. The Retirement Fund Act 2007 was not read. | Medium-high |
| Selangor's 2001 fatwa | From secondary sources only. I did not read the Selangor gazette. | Low-medium |
| Mufti (WP) Bill 2024 status | Not confirmed. | — |
| YA2025/2026 Form M | Could not be obtained. The YA2020 form (third-party copy) has no rebate line. | Medium |
| LHDN's T2025 residents deck | Reads as "not entitled" to rebates for non-residents, but the column mapping is inferred from flattened PDF text, and it misstates the RM35,000 test. Rely on the statute. | — |
| Compensation timing | An old FAQ says due a year after receipt, which conflicts with the current no-haul position. | Low |
| Self-employed gross vs profit, professional vs business zakat | PPZ draws no line. | Low |
| MAIWP **had kifayah** (asnaf eligibility thresholds) | **Could not retrieve** current figures. maiwp.gov.my sits behind a bot challenge, and news reports (Bernama, 30 Jun 2022) only say rates were raised in 2022. **Relationship:** had kifayah is MAIWP Baitulmal's *distribution* standard, used to decide who is fakir or miskin and gets aid. PPZ's income-zakat deductions are a separate, fixed list of *"perbelanjaan asasi yang dibenarkan"* (allowed basic expenses), aligned in 2017 to LHDN reliefs ("berpandukan pelepasan cukai oleh LHDN"). PPZ's AZJAF journal (2023) calls this deduction method the had kifayah deduction, but the **amounts in the calculator are the only ones that matter for zakat pendapatan**. Not independently verified in the deep pass. | Figures: not found. Relationship: medium |
| EPF Akaun Fleksibel (Account 3) zakat | **No PPZ ruling found.** The 2019 fatwa predates the 2024 account restructure. | — |
| Savings: whether balances already zakated by the bank are left out of the amount payable (they **are** counted for the nisab) | Not stated. | Low |
| Fitrah 2025 rice-category mapping | **Resolved:** P.U.(B) 523/2024 states it. | **High** |
| Fitrah 2026 | RTM (government broadcaster) and the calculator's base rate. No gazette listed. | Medium-high |
| s.6A(3) statute text | **Resolved:** read directly. | **High** |
| Mufti WP e-fatwa pages | efatwa.muftiwp.gov.my was reachable with TLS verified on several fetches on 2026-11-05, including this revision's, but other checks that day still hit a certificate error. Treat access as intermittent. | — |
| UI click-through | Not done. The calculation is client-side JS, which I read and transcribed in full. | — |
| Statements in pcb.md | `pcb.md` §3.2 step 7 and §3.8 floor Net MTD before adding bonus MTD. §3.7 says the "excess carries into Z". §3.7 and §4.2 treat the zakat rebate as capped on its own. §3.9 and Case 9 can now cite s.6A(1) for the non-resident point. This report's §8 is the corrected version, and the medium rating on rebate ordering can rise to high. I did not edit that file. | — |

---

## Questions for the owner

PPZ's own answer would settle several of these (see question 19). Where a recommendation appears, it is the researcher's, and the choice is yours.

**Defaults for most users**

1. **Default method:** Kaedah 2 (lower, needs deduction inputs) or Kaedah 1 (simplest)?
2. **Take-home default:** assume PZB through payroll (zakat offsets PCB monthly), or direct payment (relief only at year end)?
3. **Monthly figure:** show the exact annual/12 to the sen (29.83; 12 months total 357.96, 4 sen short), or round up to 10 sen (29.90; 12 months total 358.80)? PPZ has no rule. Either way, should users be able to enter their actual PZB amount?
4. **Lump sums:** when zakat is paid in a lump, payroll cannot absorb it all, and the BE return later refunds the PCB overpaid. Show (a) monthly cash flow with the year-end refund separate, or (b) only the net annual effect?
5. **Negative result:** clamp at 0 where PPZ's calculator would show a negative (Caruman Berzakat case)? Recommended: yes.
6. **2027 before PPZ publishes the nisab:** block 2027 zakat, or show 2026's figure clearly marked "provisional"?

**Income and timing**

7. **Part-year workers:** use actual income in the Gregorian year with whole nisab and whole deductions (recommended, labelled "no published PPZ rule"), or the × 12 basis the calculator gives by default? For RM5,000 × 6 months at haul 2026 this is RM0 vs RM1,035 a year under Kaedah 2.
8. **Bonus timing in the 12-month simulation:** even over 12 months (recommended default, matching the calculator), on receipt, or year-end top-up?
9. **Non-cash benefits-in-kind:** keep them out by default with an optional override (recommended), or include them?

**Dependants**

10. **Female payers:** offer no spouse deduction (as the official calculator does), or let them choose?
11. **Child age and study:** leave a child who turns 18 in the year, or who is in Form 6, matriculation, TVET, a foreign university or part-time study, to the user's own classification with a note (recommended), or apply a stated default such as "status on 31 Dec"?
12. **Shared children:** warn that each child belongs on one parent's assessment (recommended; follows Pahang, not a WP rule), or allow both without comment as PPZ's calculator does?

**Where you work and who you are**

13. **Remote and hybrid workers:** (a) default the zakat state to the employer's office, (b) use where the user physically works, or (c) simply ask "Which zakat body do you pay?" and default it from the workplace state (recommended)?
14. **Cross-border overlap:** a Selangor resident working in WP may be claimed by both bodies. Let users override to "pay LZS / other state", which turns off the WP module and its PCB offset, or follow the WP workplace rule strictly?
15. **Moving between states mid-year:** flag as unsupported (recommended), or count WP-period income only?
16. **LTAT members:** deduct the 10% contribution in the Kaedah 2 EPF line as an editable, flagged assumption (recommended), or leave it 0 to follow PPZ's text literally? At RM5,000/mo the difference is RM150/yr.
17. **Self-employed:** build Zakat Perniagaan Method 3 for trading income, or show only a note sending them to PPZ? For freelance income, is the input gross or net of costs, since PPZ does not say?
18. **Non-citizens paying zakat in their home country:** show only the note that this earns no Malaysian rebate, or also state PPZ's general preference for paying locally?

**Asking PPZ**

19. **Will you send PPZ one enquiry** (info@zakat.com.my, 1-300-88-5757)? It could settle: part-year nisab and pro-rating, and whether PZB is annual/12 or annual/months remaining; the date child age is tested and what counts as IPT; a working wife's RM5,000 and shared children; benefits-in-kind; LTAT; and whether a counter accepts husband or OKU-child deductions on manual assessment.

---

## Research status

**Complete** for everything published sources can settle. All 12 verified claims, 4 to-dos and 3 gap questions have been merged. Amounts for 2025 and 2026 are final.

What still remains, none of which further web research can answer:

- **Only PPZ can answer:** the items in question 19.
- **Only time can answer:** 2027 nisab (around Feb 2027), 2027 fitrah, 2027 deductions in `setValues()`, LHDN's 2027 MTD spec, and the Finance Bill's effect on s.6A.
- **Not independently verified:** the items listed under the verification log. They are advanced features or background, and none affects take-home pay.
- **Sibling report:** `pcb.md` needs the corrections noted in §10.

---

## Verification log (deep pass, 2026-11-05)

Votes are shown as **P** primary, **C** currency (was it current and in force for each year?), **X** compute (independent recalculation). ✓ confirmed, ✗ refuted, ? could not tell. REFUTED means two or more refutes.

**No live search limits.** `no-live-search.json` flags checks that ran without live web search because of a session cap, which makes them lower confidence. **It lists no checks for zakat, so none is marked here.** Some zakat checks did rely on saved copies by choice (for example, Z7 and Z8 used the cached PR 3/2023 and MTD specs), and web.archive.org was unavailable for some of them, but none was limited by the session cap.

| Claim id | Claim | Outcome | Votes | Action taken | Key source |
|---|---|---|---|---|---|
| Z1 | Nisab 29,740 (2025) and 33,996 (2026), one period each; use the published figure; 2027 null, API 33,996 is a placeholder | CONFIRMED | P✓ C✓ X✓ | Kept. Fixed the 2025 silver note (595 × 4.14 ≠ 2,466). Added PPZ's inconsistent rounding and `year=2027` → `{}`. | zakat.com.my Arkib Nisab; zakat2u `/nisab-list`, `/nisab-value` |
| Z2 | One nisab per Gregorian year from the previous year's mean; twice-yearly is Selangor; published around 26 Feb, applies from 1 Jan; no mid-year change | CONFIRMED | P✓ C✓ X✓ | Kept. Publication date is not fixed (2024-02-02); the 2026-02-18 snapshot still showed the old figure; application from 1 Jan marked as inferred. | Mufti WP Al-Kafi #1811; Wayback snapshots |
| Z3 | 2.5%; two methods; `>=` test; whole base, so a cliff; no haul | CONFIRMED | P✓ C✓ X✓ | Kept. Added the infographic's "melebihi" wording and the real-EPF case E5d. Did not adopt the P caveat against the infographic as a test vector: it is valid at the haul-2018 nisab. | `Pendapatan.vue`; *Syarat Wajib* |
| Z4 | Kaedah 2 deductions identical for 2025 and 2026; wife 0–4; no husband; two child categories; parents uncapped; education cap; EPF | CONFIRMED | P✓ C✓ X✓ | Kept. Noted the ambiguity at exactly 18, that "IPT" is from the infographic only, and that 11% is editable. | `setValues()`; Wayback builds across 2025–2026 |
| Z5 | Caruman Berzakat offset 2.5% off zakat, both methods, only once nisab is met; no clamp; no "zakat already paid" input | CONFIRMED | P✓ C✓ X✓ | Kept. Added the Aug 2026 Tabung Haji dispute (no calculator change) and per-year storage of the list. | `Pendapatan.vue`; Bernama, The Star Aug 2026 |
| Z6 | Rounding by `toFixed(2)` at each step; monthly annual/12; 29.90 on the infographic is unconfirmed | CONFIRMED | P✓ C✓ X✓ | Kept. Corrected §9 row 10 (zakatable is not rounded). Added `toFixed` vs half-up vectors. Combined with T1 and T3 to resolve as "no rule". | `Pendapatan.vue`; form PPZ 052; PPZ booklets |
| Z7 | s.6A(3) rebate capped at tax charged; RM1,055 excess in Example 7; exception for a non-working wife; real cost = max(0, zakat − tax before zakat) | **REFUTED** | P✗ C✗ X✗ | **Corrected.** I checked it myself: s.6A(4) pools the cap, Example 7's note 5 says combined excess, para 5.6.5 denies a spouse exception. New formula in §8.1. The old formula gave 255 in Example 7; correct is 825. | ITA 1967 s.6A as at 1 Jan 2026; PR 3/2023 |
| Z8 | MTD formula; Net MTD; "excess carries into Z"; RM10; TP1 | **REFUTED** | P✗ C✓ X✗ | **Corrected narrowly.** I checked the spec's table E.5: Z takes the full zakat, and bonus months do not floor at 0. The rest was right. The C vote flagged the same wording as loose. New pseudocode in §8.2. | LHDN MTD specs 2025 and 2026, E.3–E.5, §15 |
| Z9 | Muslims only, no age condition; workplace not residence; fatwa details; gazette not read | CONFIRMED | P✓ C✓ X✓ | Kept. Gazette now read, so "not read" is removed. Added s.34(3), Selangor overlap and undefined workplace. | P.U.(B) 316/2021; Act 505 |
| Z10 | Income from all sources; reimbursements excluded | CONFIRMED | P✓ C✓ X✓ | Kept and extended into §2.1, with allowances, contractor payments, honey and the claims boundary. | Calculator modal; infographic; P.U.(B) 152/1999 |
| Z11 | PZB is the WP scheme, Skim Berkat is Selangor; take-home formula; TP1/BE recovery | CONFIRMED | X✓ C✓ P✗ | Kept the naming, recovery path and regular-month result. **Adopted the P vote's bonus-month and RM10-order point**, since it matches Z8 and the spec table. Marked as a 2–1 split. Skim Berkat as Selangor rests on secondary press. | LHDN MTD specs; zakat.com.my PZB page |
| Z12 | Fitrah 2025 RM7/15/22 with inferred mapping; 2026 RM8/15/25; 2027 none; s.6A(3) covers fitrah | CONFIRMED | X✓ C✓ P✓ | Kept. **Mapping upgraded from medium to high:** I found and read the gazette the votes did not reach. RM7 also covers regular imported rice. Tiers optional. JSON keys unified across years. | P.U.(B) 523/2024; RTM |

**Research tasks merged**

| Id | Question | Status | Where it went |
|---|---|---|---|
| T1 | PZB rounding | Partial: no rule exists; only PPZ could confirm | §3.1, §3.2, §5, question 3 |
| T2 | Gazette text of P.U.(B) 316/2021 | Resolved | §2, §10, questions 13–14 |
| T3 | Husband, OKU, 18+ not studying | Partial: none published; counter practice unknown | §2, §5, §7, §10, §6.4 |
| T4 | s.6A text, rebate order, Z carry, 2025 spec | Resolved | §4, §6.5, §8, question 4 |
| G1 | Part-year, job change, state move, bonus | Partial: no published rule | §3.8, §3.9, §5, §6.2, §6.3, questions 7, 8, 15 |
| G2 | Non-residents, non-citizens, government staff, self-employed | Partial: (a) resolved; (b), (c), (d) partly | §2.2, §5, §6.3, §6.5, §8.3, questions 16–18 |
| G3 | Child age, dual-income couples, wage definition | Partial: settled where WP sources speak | §2, §2.1, §5, §6.3, §7, questions 9, 11, 12 |

**Corrections beyond the votes, made during this revision**

- **E7b's nisab.** Haul 2018's nisab is 14,772 (archive and `tahun_nisab`), not 13,968, which is haul 2019's. The result is the same.
- **T3's English booklet vector.** The booklet's printed 32,800 is a typo for 33,800, and 26,200 is below the current nisab (§6.4).
- **T1 vs T3 on rounding.** T1 called 29.90 a single data point and T3 added two more, so §3.1 uses all three.
- **The fitrah gazette** P.U.(B) 523/2024 was not in any earlier result. It was fetched on 2026-11-05 with TLS verified.

**Not independently verified** (these were left out of the three-lens checks):

- Gold zakat (emas): uruf pakai 800 g, simpan 85 g, gold price RM349.88/g (2025) and RM399.95/g (2026); before 2017 the uruf was 150 g and only the excess was zakatable. An advanced feature, not part of take-home pay.
- Silver nisab reference values: RM2,466 (2025) and RM3,278 (2026). The Z1 primary vote and this revision did look at these against the archive page, and the 2025 arithmetic note was fixed.
- Savings zakat: 2.5% of the end-of-haul balance if ≥ nisab (111th MJPHS WP fatwa); whether accounts the bank already zakats are excluded from the amount payable is unresolved.
- Shares zakat formula and treatment of non-shariah-compliant shares (94th and 111th meeting fatwas).
- EPF withdrawal zakat rules (120th meeting fatwa, 1 Nov 2019) and the missing ruling on Akaun Fleksibel.
- Historical deduction tiers (2017: 9,000/4,000/2,000/8,000; 2011–2016: 9,000/3,000/1,000/0) and historical nisab 2020–2024 (15,762; 20,299; 20,361; 21,626; 24,198). T3 and this revision saw supporting Wayback pages and archive rows.
- The full list of 43 zakat-paying agencies for the Caruman Berzakat offset. The Z5 votes did match it against the live bundle.
- API endpoint semantics: haul Y uses `/nisab-value?year=Y-1` (`tahun_nisab` vs `nisab` fields), and the `/nisab-value/emas?year=haul-2` lookup.
- Derivation of the gold-price series behind the nisab (which average and window); medium confidence, store published figures only.
- MAIWP had kifayah (asnaf distribution thresholds): figures not retrievable and not used in the income-zakat calculation.
- The full list of discrepancies against the old app (`zakat.ts`), e.g. the `DEFAULT_NISAB` extrapolation and the missing Kaedah 1.

---

## 11. Sources

**Accessed 2026-11-04** unless marked otherwise.

Primary, PPZ-MAIWP:
- Official calculator page: https://zakat2u.com.my/kiraan/zakat/pendapatan
- Calculator bundle (`Pendapatan.vue`, `Simpanan.vue`, `Kwsp.vue`, `Emas.vue`, `Saham.vue`, `Fitrah.vue`): https://zakat2u.com.my/js/app.js?v=20260326 (re-fetched 2026-11-05, unchanged)
- Nisab API: https://zakat2u.com.my/nisab-list ; https://zakat2u.com.my/nisab-value?year=2024|2025|2026|2027 ; https://zakat2u.com.my/nisab-value/emas?year=2023|2024|2025 (re-fetched 2026-11-05)
- Fitrah calculator (`kadar="8"`): https://zakat2u.com.my/kiraan/zakat/fitrah (re-fetched 2026-11-05)
- Nisab archive: https://www.zakat.com.my/info-zakat/arkib-nisab-tahunan/ (page dated 2026-02-26; re-fetched 2026-11-05). Wayback snapshots: https://web.archive.org/web/20241207002637/https://www.zakat.com.my/info-zakat/arkib-nisab-tahunan/ , …/20250318034857/…, …/20250616094423/…, …/20251015050839/…, …/20260120055742/…, …/20260421010549/…
- Zakat pendapatan page and method infographic: https://www.zakat.com.my/info-zakat/jenis-jenis-zakat/zakat-pendapatan/ ; https://www.zakat.com.my/wp-content/uploads/2023/07/cara-kiraan-zakat-pendapatan.jpeg
- Savings: https://www.zakat.com.my/info-zakat/jenis-jenis-zakat/zakat-wang-simpanan/
- EPF (fatwa from the 120th meeting): https://www.zakat.com.my/info-zakat/jenis-jenis-zakat/zakat-kwsp/
- Gold: https://www.zakat.com.my/info-zakat/jenis-jenis-zakat/zakat-emas/
- Shares (fatwas from the 94th and 111th meetings): https://www.zakat.com.my/info-zakat/jenis-jenis-zakat/zakat-saham/
- Conditions (haul): https://www.zakat.com.my/info-zakat/syarat-wajib/
- Zakat and tax: https://www.zakat.com.my/zakat-cukai/
- PZB: https://www.zakat.com.my/perkhidmatan/saluran-bayaran/skim-potongan-zakat-bulanan-pzb/
- AZJAF Vol. 4 No. 3 (2023), Mohd Mukhlis Mohd Nasri, "Analisis Perbezaan Pengiraan Nisab…": https://azjaf.zakat.com.my/index.php/azjaf/article/download/148/110/304

Mufti WP and fatwas:
- Al-Kafi #1811 (nisab method), 30 Jun 2021: https://muftiwp.gov.my/en/artikel/al-kafi-li-al-fatawi/4850-al-kafi-1811-nisab-for-zakat-on-gold-in-accordance-with-the-zakat-institution-or-current-value
- Workplace fatwa P.U.(B) 316/2021 (secondary summary): https://www.legal500.com/intelligence/malaysia/employment-and-hr/federal-territories-fatwa-zakat-pendapatan-to-be-paid-based-on-workplace

LHDN:
- MTD computerised calculation specification 2026: https://www.hasil.gov.my/wp-content/uploads/spesifikasi-kaedah-pengiraan-berkomputer-pcb-2026.pdf
- Public Ruling 3/2023 (6 Nov 2023), zakat rebate examples: https://www.hasil.gov.my/wp-content/uploads/ku-3-2023-pencukaian-individu-bermastatutin-bahagian-iii-pengiraan-cukai-pendapatan-dan-cukai-kena-dibayar.pdf

News (fitrah, had kifayah, context):
- MAIWP fitrah 2026 RM8/15/25 (RTM, 10 Feb 2026): https://berita.rtm.gov.my/?p=437858
- MAIWP fitrah 2025 RM7/15/22 (RTM, 26 Feb 2025): https://berita.rtm.gov.my/?p=141579
- Fitrah 2024 rice categories (Utusan, Mar 2024): https://www.utusan.com.my/berita/2024/03/zakat-fitrah-tetap-sah-dibayar-rm7-walaupun-makan-beras-import/
- MAIWP had kifayah raised in 2022 (Bernama via SiakapKeli, 30 Jun 2022): https://siakapkeli.my/articles/maiwp-naikkan-kadar-had-kifayah-bantu-golongan-asnaf-terkesan
- RinggitPlus, 15 May 2026 (WP 2026 nisab RM33,996; "twice a year" claim is generic): https://ringgitplus.com/ms/blog/sudut-pakar/anda-sudah-wajib-bayar-zakat-pendapatan-ini-cara-kira-nisab-dan-had-kifayah-mengikut-negeri.html
- Sinar Harian (savings zakat applies to children too): https://www.sinarharian.com.my/article/650416/edisi/selangor-kl/lebih-rm24198-perlu-bayar-zakat-simpanan-2-5-peratus

### Added in the deep pass (all accessed 2026-11-05)

Gazettes and statutes:
- P.U.(B) 316/2021, gazette text: https://efatwa.muftiwp.gov.my/fatwa/PUB316%20%20WARTA%202021%20-%20FATWA%20BERKENAAN%20KEWAJIPAN%20MEMBAYAR%20ZAKAT%20PENDAPATAN%20DI%20TEMPAT%20BEKERJA
- P.U.(B) 152/1999, Zakat Penggajian: https://efatwa.muftiwp.gov.my/fatwa/WARTA%20-%20FATWA%20BERKENAAN%20ZAKAT%20PENGGAJIAN ; gazette scan: https://efatwa.muftiwp.gov.my/fatwa/74ac553720cf61c8946e58f979e52586
- P.U.(B) 523/2024, fitrah 1446H/2025M: https://efatwa.muftiwp.gov.my/fatwa/KADAR%20%7BENETAPAN%20ZAKAT%20FITRAH%20BAGI%20WILAYAH-WILAYAH%20PERSEKUTUAN%20UNTUK%20TAHUN%201446H2025M
- e-Fatwa zakat and fitrah listings: https://efatwa.muftiwp.gov.my/?search=zakat ; https://efatwa.muftiwp.gov.my/?search=fitrah
- Act 505, Administration of Islamic Law (Federal Territories) Act 1993, Reprint 2006: https://www.muftiwp.gov.my/images/archive/akta_pekeliling/Act_505-Admistration_of_Islamic_Law__Federal_Territories_Act_1993.pdf
- ITA 1967, online version as at 1 Jan 2026, s.6A, s.44(11A), s.107B: https://www.hasil.gov.my/wp-content/uploads/Income-Tax-Act-1967-online-version-as-at-1-January-2026.pdf
- ITA 1967, 2006 reprint (s.6A, s.48): https://dezshira.com/library/file/1116/download

LHDN:
- MTD specification 2025, via Wayback: https://web.archive.org/web/20260118131226/https://www.hasil.gov.my/media/mdahzjwi/spesifikasi-kaedah-pengiraan-berkomputer-pcb-2025.pdf
- Payroll spec page snapshot: https://web.archive.org/web/20250804154435/https://www.hasil.gov.my/majikan/majikan-payroll-spesifikasi-data/
- Public rulings index: https://www.hasil.gov.my/perundangan/ketetapan-umum/ ; https://www.hasil.gov.my/undang-undang/ketetapan-umum/
- TP1 forms: https://web.archive.org/web/20260107161011/https://www.hasil.gov.my/media/gs2pt520/tp1-2025.pdf ; https://www.hasil.gov.my/wp-content/uploads/bm-borang-tp1-2026.pdf
- Residents and non-residents decks: https://www.hasil.gov.my/wp-content/uploads/T2025_tax-treatment-residents-non-residents.pdf ; https://www.hasil.gov.my/wp-content/uploads/Tax-Treatment-Residents-Non-Residents.pdf
- e-BE YA2025 explanatory notes: https://www.hasil.gov.my/wp-content/uploads/explanatorynotes_b2025_1.pdf
- Payroll page: https://www.hasil.gov.my/majikan/pembayaran-pcb/
- Garis Panduan Operasi 1/2024 (PCB): https://www.hasil.gov.my/wp-content/uploads/20240102-gpo-1-2024-potongan-cukai-bulanan-di-bawah-kaedah-kaedah-cukai-pendapatan-potongan-daripada-saraan-1994.pdf
- Budget 2027 speech, tabled 9 Oct 2026 (EPF Simpanan Shariah zakat; no s.6A change): https://belanjawan.mof.gov.my/pdf/belanjawan2027/ucapan/ub27.pdf
- Child relief, tax analogy only: https://www.hasil.gov.my/pelepasan-cukai
- Form M YA2020, third-party copies: https://ccs-co.com/wp-content/uploads/4.1-Form-M-2020-Non-Resident-Individual.pdf ; https://ccs-co.com/wp-content/uploads/4.2-Form-M-2020-Explanatory-Notes.pdf

PPZ-MAIWP forms, booklets and pages:
- Downloads page, with forms PPZ 052 and 052E: https://www.zakat.com.my/muat-turun/ ; https://drive.google.com/open?id=1UJbwuWktwsgzOw-zdhEZXERVFn4kj9TP ; https://drive.google.com/file/d/1iXFQjGpzZE-decgqUZqG1oT1xL8s-fbt/view
- Online PZB form: https://ptg.zakat.com.my/ ; sign-up link: https://zakat2u.com.my/potongan-gaji/daftar?amaun=29.83
- Booklet page (posted 2025-03-04): https://www.zakat.com.my/bookletkirazakat/ ; BM pages: https://online.flipbuilder.com/tkyk/jhbm/files/mobile/8.jpg , https://online.flipbuilder.com/tkyk/jhbm/files/mobile/9.jpg ; EN page: https://online.flipbuilder.com/tkyk/inqp/files/mobile/9.jpg
- English e-booklet "Obligatory Zakat Made Easy": https://drive.google.com/file/d/1bn_JqIqVo7bfxYGzwZ3YpojB24Q0vSdT/view
- FAQ: https://www.zakat.com.my/khidmat-pelanggan/soalan-lazim/ ; API copy: https://www.zakat.com.my/wp-json/wp/v2/pages/2545
- Site search API: https://www.zakat.com.my/wp-json/wp/v2/search?search=suami (and other deduction terms) ; Labuan counter: https://www.zakat.com.my/?s=labuan
- Business zakat: https://www.zakat.com.my/info-zakat/jenis-jenis-zakat/zakat-perniagaan/
- AZKA Siri Kajian 1, cross-border collection: https://azka.zakat.com.my/wp-content/uploads/2021/12/Siri-Kajian-1-Kutipan-Zakat-Rentas-Sempadan-Teori-Fiqh-dan-Realiti-Di-Malaysia.pdf
- AZKA Research Series 4/2020, foreign workers: https://azka.zakat.com.my/wp-content/uploads/2021/12/Siri-Kajian-4-The-Potential-and-Strategy-of-Zakat-Collection-From-Foreign-Workers.pdf
- AZKA note on the UMP project: https://azka.zakat.com.my/?p=7387
- AZJAF articles: https://azjaf.zakat.com.my/index.php/azjaf/article/download/176/114/316 ; https://azjaf.zakat.com.my/index.php/azjaf/article/download/65/45/96
- PPZ Threads post on bonus, 9 Feb 2026: https://www.threads.com/@pusatpungutanzakat/post/DUh6vweD2Ev/sebagai-contoh-bonus-dua-bulan-gaji-berjumlah-rm-jika-zakat-maka-amaunnya-rm?hl=en-gb

Wayback copies of PPZ pages:
- Calculator 2007: https://web.archive.org/web/20070418082501/http://www.zakat.com.my:80/engcalculator/incomecalc.html
- Old income FAQ: https://web.archive.org/web/20090212210926/http://zakat.com.my/faq/pendapatan.htm ; https://web.archive.org/web/20091220073355/http://zakat.com.my/en/faq/zakat-pendapatan ; https://web.archive.org/web/20110308011349/http://zakat.com.my/faq/zakat-pendapatan ; https://web.archive.org/web/20120902190208/http://www.zakat.com.my/en/zakat-pendapatan.html
- FAQ with the bonus answer: https://web.archive.org/web/20161210003210/http://www.zakat.com.my/info-zakat/soalan-lazim ; CDX listing: https://web.archive.org/cdx/search/cdx?url=zakat.com.my/info-zakat/soalan-lazim
- Income page history: https://web.archive.org/web/20161221172333/http://www.zakat.com.my:80/info-zakat/jenis-jenis-zakat/zakat-pendapatan/ ; https://web.archive.org/web/20170421183053/http://www.zakat.com.my:80/info-zakat/jenis-jenis-zakat/zakat-pendapatan/ ; …/20171219192214/… ; …/20180211145157/… ; …/20180316170849/…
- 2018 infographic: https://web.archive.org/web/2018/http://www.zakat.com.my/wp-content/uploads/2018/03/zakatpendapatan.jpg
- Archive-page listing and the 18 Feb 2026 snapshot: https://web.archive.org/cdx/search/cdx?url=zakat.com.my/info-zakat/arkib-nisab-tahunan/ ; https://web.archive.org/web/20260218220130/https://www.zakat.com.my/info-zakat/arkib-nisab-tahunan/
- Calculator builds: https://web.archive.org/web/20250210042922id_/https://www.zakat2u.com.my/js/app.js?1739161761 ; https://web.archive.org/web/20250406160741id_/https://www.zakat2u.com.my/js/app.js?1741173525 ; https://web.archive.org/web/20250808045957id_/https://www.zakat2u.com.my/js/app.js?1754628984 ; https://web.archive.org/web/20260216185951id_/https://zakat2u.com.my/js/app.js ; listing: https://web.archive.org/cdx/search/cdx?url=zakat2u.com.my/js/app.js*
- Fitrah calculator, Ramadan 2025: http://web.archive.org/web/20250315042633/https://zakat2u.com.my/kiraan/zakat/fitrah

Mufti WP and other states:
- Al-Kafi #1076, nisab and haul for workers: https://muftiwp.gov.my/ms/artikel/al-kafi-li-al-fatawi/3075-al-kafi-adakah-setiap-orang-bekerja-wajib-keluar-zakat
- Al-Kafi Soalan 201, where to pay: https://www.muftiwp.gov.my/ms/artikel/al-kafi-li-al-fatawi/1785-di-mana-bayar-zakat-pendapatan
- Selangor Mufti e-Musykil 3830 (does not bind WP): https://emusykil.muftiselangor.gov.my/index.php/site/jawapan?id=3830
- Pahang FAQ on shared children (analogy only): https://zakatpahang.my/bagi-pasangan-yang-bekerja-jika-suami-telah-membayar-zakat-dengan-menolak-pengiraan-bagi-anak-0-6-tahun-dalam-pengiraan-zakatnya-adakah-zakat-isteri-masih-boleh-menolak-bagi-anak-0-6-tahun-juga-atau/ ; Pahang income zakat: https://zakatpahang.my/zakat-pendapatan/
- Selangor half-yearly nisab (secondary): https://tunaizakat.my/en/?p=710

Secondary and academic:
- Workplace fatwa summary: https://www.mondaq.com/employee-benefits-compensation/1087532/federal-territories-fatwa-zakat-pendapatan-to-be-paid-based-on-workplace ; https://mondaq.co.uk/employee-benefits--compensation/1087532/federal-territories-fatwa-zakat-pendapatan-to-be-paid-based-on-workplace
- Selangor 2001 fatwa, search-result summaries only: https://www.scitepress.org/Papers/2017/70860/ ; https://ir.uitm.edu.my/101634/1/101634.pdf ; https://jurcon.ums.edu.my/ojums/index.php/LJMS/article/download/719/472
- Mufti (WP) Bill status, not confirmed: https://bernama.com/en/news.php?id=2351014 ; https://thesun.my/local-news/second-third-readings-of-mufti-bill-in-parliament-on-oct-16-or-17-HH13053884
- Mansor & Hasan, IJHTC: https://journal.ump.edu.my/ijhtc/article/download/8780/2591/32324 ; https://journal.ump.edu.my/ijhtc/article/download/6977/version/8706/1563/25600
- BIK at MAIK Kelantan, IJARBSS 2024: https://hrmars.com/papers_submitted/21926/zakah-for-benefit-in-kind-at-the-kelantan-islamic-religious-and-customs-council-maik-an-exploratory-analysis.pdf
- Hamat et al. 2017, BIK (abstract only): https://uijournal.usim.edu.my/index.php/uij/article/view/2
- KWAP Q&A bulletin: https://registrar.utm.my/bsm/wp-content/uploads/sites/420/2020/12/Edisi-Khas-Soal-Jawab-Berkaitan-Pengurusan-Caruman.pdf
- LTAT annual report 2023 (search excerpt only; download returned 404): https://ltat.gov.my/wp-content/uploads/2024/12/LTAT_AR2023.pdf
- Non-pensionable civil servants (search excerpt only; fetch returned 403): https://www.bharian.com.my/amp/berita/nasional/2024/01/1204228/penjawat-awam-tetap-baharu-tidak-berpencen-tpm

News:
- Fitrah 2024 mapping: https://berita.rtm.gov.my/?p=87387 ; https://www.bharian.com.my/amp/berita/nasional/2024/03/1224271/umat-islam-makan-beras-import-hanya-perlu-tunai-kadar-asas-rm7-zakat
- Fitrah 2026 listing: https://ecentral.my/kadar-zakat-fitrah-2026/wilayah-persekutuan/ ; Kedah rate review (not WP): https://www.thestar.com.my/news/nation/2025/03/06/rice-mixing-sparks-review-of-zakat-fitrah-rates
- Tabung Haji zakat dispute, Aug 2026: https://www.thestar.com.my/news/nation/2026/08/11/th-zakat-payments-in-line-with-shariah-law-dewan-rakyat-told ; https://www.businesstoday.com.my/2026/08/11/tabung-haji-depositors-need-not-worry-over-zakat-payments-says-minister/ ; https://www.thevibes.com/articles/news/125778/rafizi-tabung-haji-zakat-status-raises-questions-after-rci-findings-on-depositors-obligations ; https://bernama.com/en/general/news.php?id=2590401
- Skim Berkat is LZS: https://selangorjournal.my/?p=125677 ; https://www.sinarharian.com.my/article/765273/edisi/selangor-kl/lzs-sasar-polis-selangor-sumbang-kutipan-zakat-rm22-juta
- PPZ PZB and monthly payment: https://www.sinarharian.com.my/article/268729/edisi/selangor-kl/ppz-maiwp-sasar-kutipan-zakat-rm45-juta-menerusi-skim-pzb ; https://www.sinarharian.com.my/article/268762/edisi/selangor-kl/ppz-maiwp-galak-bayar-zakat-pendapatan-secara-bulanan ; https://berita.rtm.gov.my/?p=19453
- Year End Zakat campaign: https://www.kosmo.com.my/2021/11/15/ppz-maiwp-lancar-kempen-year-end-zakat-2021/
- 2024 nisab published in February: https://www.kosmo.com.my/2024/02/16/simpanan-peribadi-lebih-rm24198-wajib-bayar-zakat-simpanan
- PPZ collections, Nov 2025: https://www.utusan.com.my/nasional/2025/11/kutipan-zakat-ppz-maiwp-meningkat-13-07-peratus-cecah-rm491-juta/
- Budget 2027 coverage (no zakat rebate change): https://www.bharian.com.my/amp/berita/nasional/2026/10/1662260/had-pelepasan-cukai-individu-dinaikkan-kepada-rm12000 ; https://ringgitplus.com/ms/blog/berita-kewangan-peribadi/belanjawan-2027-pelepasan-cukai-individu-dinaikkan-buat-kali-pertama-sejak-2010.html ; https://berita.rtm.gov.my/?p=710939
- Rebate unchanged in 2026 (secondary): https://www.imoney.my/articles/zakat-income-2026-tax-rebate
- CP500 penalties, Jan 2026: https://www.thestar.com.my/news/nation/2026/01/06/no-penalties-for-cp500-taxpayers-this-year
- Johor's position on foreign workers (fitrah): https://www.thestar.com.my/metro/community/2017/05/24/muslim-foreigners-working-in-johor-not-exempted-from-paying-zakat-religious-affairs-exco-says-it-is

Not usable: lom.agc.gov.my's P.U.(B) listing uses an encrypted JSON API; majikan.zakat.com.my did not respond; MyMajikan needs a login.

Downloaded copies are in `.research-cache/zakat/` (not in the repo), including `verify/`, the extracted component code, the transcription harness `scripts/examples.mjs` and the T4 simulation `scripts/zsim_t4.py`.

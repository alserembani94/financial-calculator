# Malaysian personal-finance benchmarks and data reuse terms

All URLs accessed 2026-11-06 unless stated. "API (verified)" means the figure was pulled live from `api.data.gov.my` on 2026-11-06 by this researcher, not copied from a news summary. kwsp.gov.my returned HTTP 403 to automated fetches, so EPF figures come from EPF data republished on data.gov.my, or from news coverage of EPF announcements (marked).

## 1. Debt service ratio (DSR): definitions and thresholds

### Takeaway
No regulator publishes an official "healthy household DSR" figure for consumers. BNM's binding rule (Guidelines on Responsible Financing, effective 1 Jan 2012) is about method: lenders must assess income after statutory deductions (tax, EPF) against all debt obligations at a "prudent" DSR, with no number. The 60% figure is BNM's financial-stability marker for "highly leveraged" borrowers. 30–40% is a commonly repeated advice range that is attributed to AKPK only second-hand. 60–70%+ figures are lenders' own internal ceilings, which vary by bank and income band.

### Cited Findings
**BNM (lending policy, the official rule)**
- BNM measures announced 18 Nov 2011, effective 1 Jan 2012: financial institutions must make "appropriate enquiries into a prospective borrower's income after statutory deductions for tax and EPF", assess affordability against a "prudent debt service ratio", and consider all debt obligations. No percentage is given. The same page caps vehicle financing tenure at 9 years. — [BNM, Measures to promote responsible financing practices](https://www.bnm.gov.my/-/measures-to-promote-responsible-financing-practices)
- Press at the time reported this as a move from gross-income to net-income loan approval. — [EdgeProp](https://www.edgeprop.my/content/zeti-no-intention-review-new-guidelines-responsible-lending-now)
- BNM (June 2018) said banks have flexibility to set borrowers' DSR, and may count variable income if it is documented. There is no single regulatory DSR cap. — [NST, 2018](https://www.nst.com.my/amp/business/2018/06/381711/banks-have-flexibility-decide-borrowers-debt-service-ratio-bank-negara); [FMT, 2018](https://www.freemalaysiatoday.com/category/nation/2018/06/19/up-to-banks-to-fix-borrowers-debt-service-ratio-says-bnm)
- A study-guide site says the responsible-financing policy was reissued on 30 Sep 2025 and requires DSR on verified income after statutory deductions. This is single-source, secondary and **low confidence**. — [open-exam-prep](https://open-exam-prep.com/study-guides/my-ibfim-aqif/tcf-vbi-and-professional-standards/tcf-and-responsible-financing)

**BNM (financial stability analysis): the 60% marker**
- BNM's FSR 2H2022 (reported March 2023): up to a quarter of household borrowers had DSR above 60% as of Dec 2022, but BNM judged their default risk low. This group held 33.9% of banking-system household loans. — [Malay Mail, 29 Mar 2023](https://www.malaymail.com/news/malaysia/2023/03/29/bnm-risk-of-default-low-but-25pc-of-household-borrowers-have-high-service-ratio/62125); [EdgeProp](https://www.edgeprop.my/content/1905684/bnm-household-debt-continued-be-driven-residential-loans-debt-servicing-capability-remained-sound-2022)
- A BIS paper using BNM's borrower-level data found borrowers of every income group more likely to have a negative financial margin when DSR > 60% before a shock, or DSR > 40% after a shock. It used 2014 data. — [BIS Papers No. 91](https://www.bis.org/publ/bppdf/bispap91k.pdf)
- A Feb 2026 Star analysis said BNM macroprudential guidance and banks' underwriting "typically keep borrower DSRs below the 60% threshold in practice". — [The Star, 16 Feb 2026](https://www.thestar.com.my/business/business-news/2026/02/16/msian-households-walk-the-debt-tightrope)
- System statistics: in a June/July 2026 parliamentary reply, the median DSR for aggregate household loans was 33%. For 2024, the median for newly approved loans was 41% and for outstanding loans 34%. Household debt was RM1.73 trillion (84.4% of GDP). — [The Star, 1 Jul 2026](https://www.thestar.com.my/news/nation/2026/07/01/household-debt-at-rm173-trillion-844-of-gdp-but-loan-defaults-remain-low-says-anwar); [The Sun](https://thesun.my/?p=149727)

**AKPK (household advice)**
- A 2013 Malay Mail column attributes a "recommended DSR between 30 per cent and 40 per cent of income" to AKPK. **Low confidence**: this is a second-hand attribution, and no current AKPK page confirming it was found. — [Malay Mail, 4 Jul 2013](https://www.malaymail.com/news/what-you-think/2013/07/04/household-debt-not-worrying-eh-sobry-ahmad/490469)
- AKPK's Debt Management Programme reportedly cut participants' average DSR from 84% to 40%. Many entered above 80%. This is an outcome statistic, not a recommended cap. — [NST, Apr 2025](https://www.nst.com.my/amp/news/nation/2025/04/1201599/akpk-helped-113000-escape-debt); [FMT, 14 Apr 2025](https://www.freemalaysiatoday.com/category/nation/2025/04/14/more-than-112000-debt-management-cases-in-last-2-years)

**Banks and aggregators (lending practice and folk wisdom)**
- CIMB says banks compute DSR on net monthly income, meaning take-home pay after EPF, SOCSO and tax. — [CIMB](https://www.cimb.com.my/en/personal/life-goals/credit-and-debt/how-much-debt-is-too-much-understanding-dsr-debt-service-ratio-in-malaysia.html)
- iProperty: keep DSR at or below 30–40% "to stay on the safe side". It says some banks use gross income and others net. — [iProperty](https://www.iproperty.com.my/guides/how-to-calculate-debt-service-ratio-dsr-loan-approval)
- Aggregators say most banks cap DSR at 60–70%, and some allow 80–90% for high earners. The tiers are not published by the banks and are **low confidence**. — [EdgeProp guide](https://www.edgeprop.my/guides/home-financing/debt-service-ratio-dsr-malaysia-complete-guide-homebuyers); [RinggitPlus](https://ringgitplus.com/en/guides/debt-service-ratio-dsr-explained/)
- Civil servants have a separate rule: net take-home pay must stay at least 40% of gross pay. This is a payroll-deduction cap, not a DSR limit. — [Malay Mail, 13 Aug 2025](https://www.malaymail.com/news/malaysia/2025/08/13/over-4100-malaysian-civil-servants-declared-bankrupt-since-2020-says-deputy-finance-minister/187439)

### Inferences
- A defensible design for the app: compute DSR on net income (after EPF, SOCSO/EIS and PCB), counting all monthly debt repayments, matching BNM's GRF method. Show bands labelled by provenance:
  - "Commonly advised ≤ 30–40%" (folk wisdom, attributed to AKPK in some sources)
  - "BNM treats > 60% as highly leveraged" (BNM FSR analysis)
  - "Typical lending ceilings 60–70%" (bank practice)
- Do not label any band "BNM limit".
- The 2024 median DSR of 41% for new loans is a usable "how you compare" statistic, but it comes from a parliamentary reply, not a dataset.

### Gaps
- I could not retrieve the current BNM Policy Document on Responsible Financing (or a 2025 reissue) to quote its exact DSR income definition and which debts count.
- I found no AKPK-published DSR threshold on akpk.org.my. The 30–40% "AKPK" figure rests on one 2013 column.
- I could not open the latest FSR (1H2026) text. The latest verified share of borrowers above 60% DSR is the Dec 2022 figure.

## 2. Savings and retirement adequacy (EPF Basic Savings, Belanjawanku, EPF and ASB returns)

### Takeaway
EPF's Retirement Income Adequacy (RIA) framework, announced 12 Dec 2024 and effective Jan 2026, replaced the old benchmark of RM240,000 at age 55 with three tiers anchored at age 60: Basic RM390,000, Adequate, and Enhanced RM1.3m. The Basic Savings phase-in is **reported inconsistently**. Dec 2024 coverage gave RM290k (2026) → RM340k (2027) → RM390k (2028). Sept–Oct 2026 coverage gives RM270k in 2026, rising RM30k a year to RM390k by 2030. EPF dividend history is machine-readable on data.gov.my (CC BY 4.0) back to 1952. ASB history is not.

### Cited Findings
**EPF Basic Savings (Simpanan Asas) and the RIA framework**
- RIA framework and Belanjawanku 2024/2025 launched 12 Dec 2024. The Basic Savings benchmark rose 62%, from RM240,000 at age 55 (2008 framework) to RM390,000 at age 60. The framework takes effect Jan 2026 and is to be updated annually. — [NST, Dec 2024](https://www.nst.com.my/amp/business/corporate/2024/12/1147195/epf-raises-basic-retirement-income-benchmark-62pct-rm390k-bttv); [Malay Mail, 13 Dec 2024](https://www.malaymail.com/news/malaysia/2024/12/13/how-much-to-spend-monthly-and-save-for-later-day-your-guide-to-understanding-epfs-new-belanjawanku-and-retirement-framework/159667)
- Tiers: Basic RM390,000 and Enhanced RM1.3 million. Members can transfer 30% of savings above Basic to an approved fund (i-Invest). — [SAYS](https://says.com/my/news/epf-retirees-rm390-000-basic-retirement-rm1-3-million-luxury-lifestyle); [Malay Mail, 13 Dec 2024](https://www.malaymail.com/news/malaysia/2024/12/13/how-much-to-spend-monthly-and-save-for-later-day-your-guide-to-understanding-epfs-new-belanjawanku-and-retirement-framework/159667)
- Phase-in version A (Dec 2024): RM290,000 by 1 Jan 2026, RM340,000 by 1 Jan 2027, RM390,000 by 1 Jan 2028. — [Utusan Malaysia, Dec 2024](https://www.utusan.com.my/ekonomi/2024/12/kwsp-naikkan-penanda-aras-simpanan-asas-kepada-rm390000/); [SAYS](https://says.com/my/lifestyle/how-much-epf-should-you-have)
- Phase-in version B (2026 coverage, citing the KWSP i-Invest page): RM270,000 at age 60 in 2026, rising RM30,000 a year to RM390,000 in 2030. 2026 reference points by age are RM26,300 at 30, RM74,000 at 40, RM150,000 at 50 and RM270,000 at 60. RinggitPlus states this was accurate as of 23 Oct 2026. — [RinggitPlus (BM), 30 Sep 2026](https://ringgitplus.com/ms/blog/berita-kewangan-peribadi/hampir-4-daripada-10-ahli-aktif-kwsp-di-landasan-capai-simpanan-asas-rm390000.html); [KWSP i-Invest page (cited; 403 to fetch)](https://www.kwsp.gov.my/ms/ahli/simpanan/i-invest)
  - Derived from the RM30k/yr statement (not separately confirmed): 2027 RM300k, 2028 RM330k, 2029 RM360k.
- Government target (PM, 29 Sep 2026): 6 in 10 members at RM390,000 by age 60 by 2030. Nearly 4 in 10 are on track now. July 2026 figures were 3.04m members, or 38.3% of 7.94m active formal members. — [MOF press excerpt, 30 Sep 2026](https://mof.gov.my/portal/ms/berita/akhbar/malaysia-sasar-enam-daripada-10-ahli-kwsp-capai-simpanan-asas-rm390-000-menjelang-2030-pm-anwar); [Bernama](https://bernama.com/lite/news.php?id=2530601)
- EPF illustration: RM390,000 supports withdrawals of about RM1,625/month in the first retirement year, rising to RM4,434 by year 20. Single source, **lower confidence**. — [SAYS](https://says.com/my/news/epf-retirees-rm390-000-basic-retirement-rm1-3-million-luxury-lifestyle)

**Belanjawanku 2024/2025 (EPF + Universiti Malaya SWRC expenditure guide, latest edition found)**
- Released 12 Dec 2024. It is based on spending in 12 major cities and is free to download from kwsp.gov.my and swrc.um.edu.my. No 2025/2026 edition was found as of Nov 2026. — [Malay Mail, 13 Dec 2024](https://www.malaymail.com/news/malaysia/2024/12/13/how-much-to-spend-monthly-and-save-for-later-day-your-guide-to-understanding-epfs-new-belanjawanku-and-retirement-framework/159667); [SWRC UM](https://swrc.um.edu.my/news/5-december-2026-agenda-awani-belanjawanku-guide-2024-2025-and-ria-framework)
- Klang Valley monthly budgets, 2024/2025 vs 2022/2023:

  | Household | 2024/2025 | 2022/2023 | Change |
  |---|---|---|---|
  | Single, owns a car | RM2,800 | RM2,600 | +7.7% |
  | Couple with 2 children | RM7,440 | RM6,890 | +8% |
  | Senior couple | RM3,390 | RM3,210 | +5.6% |
  | Single senior | RM2,690 | RM2,520 | not stated |

  Childcare component: RM1,210 (2 children), RM670 (1 child). Average Klang Valley increase 6.7%, with a range of 2.1–8% across nine household types. — [NST, 13 Dec 2024](https://www.nst.com.my/amp/news/nation/2024/12/1147614/klang-valley-living-costs-climb-67pct-epf-report-reveals)
- Single on public transport, Klang Valley: RM1,970 ([iMoney](https://www.imoney.my/articles/?p=68824); [WeirdKaya](https://weirdkaya.com/kwsp-single-msians-need-rm1970-monthly-while-family-with-one-child-needs-rm6420)). SAYS headlines RM1,930, possibly from a different edition, so this is a conflict ([SAYS](https://pre.says.com/my/amp/news/belanjawanku-single-person-needs-rm1930-a-month-in-klang-valley)).
- Couple with 1 child RM6,420 and couple with no children RM4,970. WeirdKaya only, **low confidence**. — [WeirdKaya](https://weirdkaya.com/kwsp-single-msians-need-rm1970-monthly-while-family-with-one-child-needs-rm6420)
- Moving from single to married raises Klang Valley expenses by 78%. — [Malay Mail, 17 Dec 2024](https://www.malaymail.com/news/malaysia/2024/12/17/belanjawanku-guide-from-alor-setar-to-klang-valley-how-much-do-malaysians-need-monthly-to-manage-expenses/159799)

**EPF dividend history (API verified, data.gov.my `epf_dividend`, last updated 28 Feb 2026)**

| Year | Conventional % | Shariah % |
|---|---|---|
| 2014 | 6.75 | – |
| 2015 | 6.40 | – |
| 2016 | 5.70 | – |
| 2017 | 6.90 | 6.40 |
| 2018 | 6.15 | 5.90 |
| 2019 | 5.45 | 5.00 |
| 2020 | 5.20 | 4.90 |
| 2021 | 6.10 | 5.65 |
| 2022 | 5.35 | 4.75 |
| 2023 | 5.50 | 5.40 |
| 2024 | 6.30 | 6.30 |
| 2025 | 6.15 | 6.15 |

- Source: [data.gov.my epf_dividend](https://data.gov.my/data-catalogue/epf_dividend); API `https://api.data.gov.my/data-catalogue/?id=epf_dividend`. The series starts in 1952 at 2.5%, and Shariah starts in 2017.
- 2025 rate announced 28 Feb 2026. Total payout RM79.6bn (RM67.1bn conventional, RM12.5bn Shariah). — [Malay Mail, 28 Feb 2026](https://www.malaymail.com/news/malaysia/2026/02/28/epf-announces-615pc-dividend-for-both-conventional-shariah-savings-for-2025/210707)
- The EPF Act guarantees a minimum 2.5% for conventional savings, with no statutory minimum for Shariah. — [RinggitPlus](https://ringgitplus.com/en/guides/historical-epf-dividend-rates/)
- The next dataset update is scheduled for 15 Mar 2027. — [data.gov.my](https://data.gov.my/data-catalogue/epf_dividend)

**ASB / ASNB distributions**
- ASB FY2025 (announced 19 Dec 2025): 5.75 sen/unit, made up of a 5.20 sen dividend and a 0.55 sen bonus. Payout RM10.4bn (a record) to about 11.4m unitholders. FY2024 was also 5.75 sen. — [Business Today, 19 Dec 2025](https://www.businesstoday.com.my/2025/12/19/pnb-declares-5-75-asb-dividend-for-2025-payout-hits-record-rm10-4-billion/); [RinggitPlus](https://ringgitplus.com/en/blog/personal-finance-news/asb-fy2025-distribution-what-the-5-75-sen-payout-means-for-unitholders.html)
- ASB 2 (FYE 31 Mar 2025) paid 5.50 sen and ASM paid 5.00 sen. — [PNB press release PDF](https://www.pnb.com.my/sites/default/files/2025-03/PRESS%20RELEASE_INCOME%20DISTRIBUTION%20ANNOUNCEMENT%20ASB%202%20ASM%20FYE%20310325%20Website.pdf)
- Older ASB years from a blog (**low confidence**):
  - 2015: 7.25 + 0.50 = 7.75 sen
  - 2016: 6.75 + 0.50 = 7.25 sen
  - 2017: 7.00 + 0.25 + 1.00 special bonus = 8.25 sen (special bonus capped at the first 30,000 units)

  — [MaherSaham](https://mahersaham.com/blogs/how-asb-dividends-calculated-formula-examples)

### Inferences
- For "am I on track?" the app should use EPF's age-indexed Basic Savings table, but **must store the effective year**, because the target moves every year to 2030 and the reported schedules conflict. Prefer reading the current figure from KWSP's i-Invest page manually each January.
- EPF dividend is the only return series here with a clean, CC BY 4.0, API-accessible source. ASB history would have to be hand-compiled from PNB press releases.

### Gaps
- I could not fetch kwsp.gov.my (HTTP 403), so the official age-by-age Basic Savings table and the reason the schedule changed from 2028 to 2030 are unconfirmed. The Adequate-tier amount is commonly cited as RM650,000, but this was not confirmed in any source retrieved here.
- I could not retrieve the full Belanjawanku 2024/2025 tables for other cities (for example Alor Setar, Kota Kinabalu) or all nine household types.
- I found no official ASNB machine-readable distribution history. ASB FY2018–FY2023 were not verified.

## 3. Emergency fund and household budgeting guidance

### Takeaway
The only published Malaysian figure tied to an official body is "3 to 6 months of living costs" attributed to AKPK, and it is weakly sourced. BNM publishes outcome survey data rather than a target: its FCI Demand Side Survey 2024 found 61% would struggle to raise RM1,000, with a national target of ≤ 45% by 2030. No SC/InvestSmart or EPF emergency-fund ratio was found. 50/30/20 is imported folk wisdom with no Malaysian official endorsement found.

### Cited Findings
- AKPK "always encourage[s] the public to… separate a part of their income for emergency fund which should consist of 3 to 6 months of our cost of living". Single news source, **lower confidence**. — [Ipoh Echo](https://www.ipohecho.com.my/?p=15774)
- AKPK hosts financial-education modules at power.akpk.org.my (POWER programme). AKPK counselling is free. — [The Star, Jan 2026](https://www.thestar.com.my/lifestyle/living/2026/01/18/saving-for-lifes-surprises-how-to-build-an-emergency-financial-fund)
- BNM FCI Demand Side Survey 2024, fielded Q3 2024:
  - 61% of Malaysians would have difficulty raising RM1,000 for an emergency.
  - Only 58% actively save for the future.
  - National Strategy target: ≤ 45% unable to raise RM1,000 by 2030.

  — [Malay Mail, 17 Nov 2024](https://www.malaymail.com/news/money/2024/11/17/malaysians-financial-literacy-surpasses-global-average-but-61pc-still-lack-emergency-savings-says-bnm-deputy-governor/157181); [The Star, 25 Mar 2025](https://www.thestar.com.my/business/business-news/2025/03/25/saving-remains-a-struggle-despite-financial-awareness)
- Only 37% could cover living expenses for more than 3 months after losing income (FCI 2024, cited in an academic op-ed). — [Malay Mail, 29 Sep 2026](https://www.malaymail.com/news/what-you-think/2026/09/29/are-malaysian-households-truly-financially-resilient-mohamad-fazli-sabri-and-amirah-shazana-magli/236923)
- Earlier BNM survey (2015): 76% had difficulty raising RM1,000, and only 6% of salaried Malaysians could last beyond 6 months without income. — [Malay Mail, 26 Nov 2015](https://www.malaymail.com/news/malaysia/2015/11/26/only-6pc-working-malaysians-can-survive-beyond-six-months-without-income-bn/1012373)
- BNM survey (Feb 2023): about 30% feel their debts are burdensome. — [FMT, 13 Feb 2023](https://fmtv5.freemalaysiatoday.com/category/business/2023/02/13/30-of-malaysians-feel-burdened-by-their-debts-says-bnm-survey)
- BNM's 2024 Annual Report box on the survey is cited as `ar2024_en_box4.pdf` on bnm.gov.my (not retrieved). — [ThinkLeft](https://thinkleft.net/?p=4906)
- Media and financial-expert framing of 3–6 months of basic expenses (for example RM3,000/month gives RM9,000–18,000) is folk wisdom, not attributed to an institution. — [Utusan](https://www.utusan.com.my/?p=1240703)

### Inferences
- The app can present "3–6 months of essential expenses" as the common guideline (also echoed by AKPK). It can use BNM's RM1,000 emergency-cash benchmark plus the 61% and 37% statistics as published comparison points. Belanjawanku household budgets (section 2) are the best official proxy for "essential expenses".

### Gaps
- I found no primary AKPK, SC (InvestSmart), EPF or BNM web page stating an emergency-fund ratio or a budgeting split (for example 50/30/20). The SC InvestSmart site was not reached.
- I did not retrieve the BNM FCI 2024 survey report itself.

## 4. Household income, expenditure, poverty line and inflation (DOSM / OpenDOSM)

### Takeaway
DOSM's Household Income & Expenditure Survey (HIES) 2024, released 8 Oct 2025, is the latest. Median gross household income is RM7,017 and mean RM9,155. B40 ends at about RM5,859 and T20 starts at about RM12,680. The PLI averages RM2,705 and the relative poverty line is RM3,509. CPI inflation was 1.8% YoY in Sept 2026. Most of these figures are available as CC BY 4.0 CSV/Parquet/API on data.gov.my and OpenDOSM.

### Cited Findings
**Income (API verified, `hh_income`)**
- Median and mean monthly gross household income, Malaysia:

  | Year | Median | Mean |
  |---|---|---|
  | 2024 | RM7,017 | RM9,155 |
  | 2022 | RM6,338 | RM8,479 |
  | 2020 | RM5,209 | RM7,089 |
  | 2019 | RM5,873 | RM7,901 |
  | 2016 | RM5,228 | RM6,958 |
  | 2014 | RM4,585 | RM6,141 |

  — [OpenDOSM hh_income](https://open.dosm.gov.my/data-catalogue/hh_income)
- 2024 state medians (API verified, `hh_income_state`):
  - Selangor RM10,726, KL RM10,802, Putrajaya RM10,769
  - Johor RM7,712, Penang RM7,386, Labuan RM7,383, Melaka RM6,891, Terengganu RM6,627
  - Negeri Sembilan RM5,591, Sarawak RM5,504
  - Pahang RM4,975, Perlis RM4,950, Kedah RM4,895, Sabah RM4,890, Perak RM4,687, Kelantan RM4,083

  — [data.gov.my](https://data.gov.my/data-catalogue/hh_income_state)
  - The DOSM release gives KL as RM10,805 vs RM10,802 in the API and news. This is a minor conflict. — [DOSM release](https://www.dosm.gov.my/portal-main/release-content/household-income-survey-report--malaysia--states-2024)

**Income-group thresholds, 2024**
- From the percentile dataset (API verified, `hies_malaysia_percentile`, 2024):
  - P40 range RM5,760–5,858, so B40 ≤ about RM5,858
  - P80 range RM12,400–12,681
  - P81 minimum RM12,682
- News and ministerial figures: B40 < RM5,860, M40 RM5,860–12,679, T20 ≥ RM12,680. The previous T20 start was RM11,820 and the previous B40 ceiling RM5,249 (HIES 2022).
- Sources: [data.gov.my percentile](https://data.gov.my/data-catalogue/hies_malaysia_percentile); [The Vibes](https://www.thevibes.com/articles/news/122981/income-of-rm7000-in-kelantan-kedah-makes-one-part-of-t20-group); [RinggitPlus (BM)](https://ringgitplus.com/ms/blog/berita-kewangan-peribadi/bantuan-kerajaan-selepas-ini-mungkin-ikut-baki-pendapatan-anda.html)
- Older or inconsistent bands still circulate on some commercial sites. Avoid them.
- Government is considering replacing B40/M40/T20 with a net disposable income measure. — [Berita Harian, Jul 2026](https://www.bharian.com.my/amp/berita/nasional/2026/07/1587649/bhplus)

**Poverty (DOSM, Poverty in Malaysia 2024)**
- Average PLI RM2,705 (2022: RM2,589). Food PLI RM1,236 (2022: RM1,198). Relative poverty line, half the median, RM3,509 (2022: RM3,169). — [DOSM poverty release](https://v2.dosm.gov.my/portal-main/release-content/poverty-in-malaysia-2024)
- Poverty rates (API verified, `hh_poverty`):

  | Year | Absolute | Hardcore | Relative |
  |---|---|---|---|
  | 2024 | 5.1% | 0.09% | 16.7% |
  | 2022 | 6.2% | 0.2% | 16.6% |

  — [data.gov.my hh_poverty](https://data.gov.my/data-catalogue/hh_poverty)

**Expenditure**
- Mean monthly household consumption expenditure 2024: RM5,566. — [Malay Mail, 8 Oct 2025](https://www.malaymail.com/amp/news/malaysia/2025/10/08/dosm-malaysians-spent-rm5566-a-month-on-average-in-2024-with-dining-out-on-the-rise/193909)
- The full HIES report PDF is at storage.dosm.gov.my/hies/household_income_2024.pdf (not parsed). — [DOSM PDF](https://storage.dosm.gov.my/hies/household_income_2024.pdf)

**Inflation (API verified, `cpi_headline_inflation`)**
- September 2026 headline CPI: +1.8% YoY and +0.1% MoM (Aug 2026: 1.9% YoY). Index 137.6 (2010=100). Food & beverages +1.8% YoY. — [data.gov.my](https://data.gov.my/data-catalogue/cpi_headline_inflation); [Bernama](https://www.bernama.com/tv/news.php?id=2622347)

**Machine-readable access**
- data.gov.my and OpenDOSM publish each dataset as CSV and Parquet with an API id. The base URL is `https://api.data.gov.my/data-catalogue/?id=<id>`. The OpenDOSM API is `/opendosm`.
- Rate limit is 4 requests per minute per API, and excess returns HTTP 429. Unauthenticated calls worked in testing. A tokenised tier may exist, per the quickstart page.
- Sources: [developer.data.gov.my](https://developer.data.gov.my/); [rate-limit page](https://developer.data.gov.my/rate-limit)
- Note: `api.data.gov.my/data-catalogue?id=…` returns a 301 redirect to `/data-catalogue/?id=…`. Clients must follow redirects.

### Inferences
- An app can show "your household income vs the national and state median and the B40/M40/T20 cutoffs" entirely from CC BY 4.0 API data, refreshed after each biennial HIES. The next HIES would cover 2026, likely released in 2027.
- The percentile dataset gives exact boundaries. Use it rather than news-rounded thresholds, and note the RM2 difference in the T20 start.

### Gaps
- Mean expenditure by state and income group, and the expenditure dataset id on data.gov.my, were not confirmed. `hh_expenditure` returned 404.
- State-level PLI figures were not retrieved.

## 5. Licences and terms of use for each source (including AI reuse)

### Takeaway
Reuse risk varies by publisher:
- **data.gov.my / OpenDOSM** (CC BY 4.0) and **BNM datasets** (BNM Dataset Terms, Nov 2023) explicitly allow commercial and non-commercial reuse, with attribution. They are safe to ingest and feed to AI tools.
- **BNM website content** (reports, articles) is "personal use only" and needs written permission to republish.
- **EPF, AKPK, ASNB/PNB and SC** terms could not be retrieved. Their publications (Belanjawanku PDF, press releases) should be treated as all-rights-reserved: cite and paraphrase the facts, and do not redistribute the documents.
- None of the retrieved terms mention AI, machine learning or text/data mining.

### Cited Findings
- **data.gov.my / OpenDOSM:** "This data is made open under the Creative Commons Attribution 4.0 International License (CC BY 4.0)." This appears on each dataset page, for example `hh_income` and `epf_dividend`, and the developer portal also states "License: CC BY 4.0". — [OpenDOSM hh_income](https://open.dosm.gov.my/data-catalogue/hh_income); [data.gov.my epf_dividend](https://data.gov.my/data-catalogue/epf_dividend); [developer.data.gov.my](https://developer.data.gov.my/)
  - CC BY 4.0 permits commercial use, adaptation and redistribution. It requires attribution, a licence link and an indication of changes. This is general CC BY 4.0 knowledge; see [creativecommons.org/licenses/by/4.0](https://creativecommons.org/licenses/by/4.0/).
- **Older Malaysian government open-data terms:** "Terms of Use Government Open Data 1.0" (amended 30 Sep 2015) require a link to the terms and a prescribed attribution statement when the owner gives none. These may still apply to older agency-hosted files. — [DSD open data page](https://www.dsd.gov.my/en/open-data)
- **BNM Datasets** (data labelled "Source: Bank Negara Malaysia", updated Nov 2023) — [BNM Terms of Use for BNM Datasets](https://www.bnm.gov.my/terms-of-use-bnm-datasets):
  - Free use to copy, publish, distribute and adopt, for "commercial and non-commercial purposes", including combining with other data and embedding in products or apps.
  - Must credit "Source: Bank Negara Malaysia" and link to the terms. Where BNM gives no ownership statement, include "Data and information are subject to Terms of Use for BNM Datasets."
  - Must not imply endorsement or reproduce BNM's name or emblem beyond attribution.
  - Provided as-is, with no warranty. Malaysian law governs.
  - Data solely sourced from third parties falls under the website terms instead.
- **BNM website** (updated Nov 2023) — [BNM Terms of Use for BNM Website](https://www.bnm.gov.my/terms-of-use)
  - Content is copyright "as a collective work". Downloads are for "User's personal use only", not for "private or commercial gain".
  - "No copying, redistribution, retransmission, publication or commercial exploitation of downloaded material" without BNM's express written permission.
  - No AI or scraping clause. The disclaimer page was last updated June 2021. — [BNM disclaimer](https://www.bnm.gov.my/disclaimer)
- **BNM OpenAPI:** rates and statistics are available at api.bnm.gov.my (2019 notice). — [BNM OpenAPI](https://www.bnm.gov.my/-/bnm-openapi)
- **DOSM main portal (dosm.gov.my) and storage PDFs:** no terms retrieved. The release page timed out.
- **EPF (kwsp.gov.my):** no terms page could be retrieved, because the site returned 403 to automated fetches and searches surfaced no terms text. However, EPF's own dividend series is republished under CC BY 4.0 on data.gov.my, with EPF credited as the source. — [data.gov.my epf_dividend](https://data.gov.my/data-catalogue/epf_dividend)
- **AKPK, ASNB/PNB, SC (InvestSmart):** no terms of use retrieved. **Gap.**

### Inferences
- **Safe path for the app:** build benchmarks from data.gov.my/OpenDOSM (CC BY 4.0) and BNM-labelled datasets.
  - Show a credit line such as "Source: DOSM / EPF via data.gov.my, CC BY 4.0", plus "Source: Bank Negara Malaysia" with a link to the BNM terms.
  - Do not use BNM, EPF, or other agency logos.
  - Avoid any wording that implies endorsement, which BNM explicitly forbids and which matters for a "neutral education" app.
- **Facts vs documents:** individual facts such as "EPF Basic Savings is RM390,000 at 60" or "Belanjawanku says RM2,800 for a single car-owner in the Klang Valley" can be cited with attribution as factual statements. Republishing Belanjawanku tables wholesale, or bundling EPF or BNM PDFs (including into an AI retrieval corpus), is the riskier act under all-rights-reserved terms.
- **AI tools:** CC BY 4.0 and BNM Dataset Terms impose no AI-specific restriction. Feeding them to AI is a reuse like any other, as long as attribution is preserved in outputs. For BNM website and EPF content, sending the text to a third-party AI provider is arguably "transmission/redistribution", so link and summarise instead. This is an interpretation, not legal advice.

### Gaps
- EPF/KWSP website terms (copyright, reuse of Belanjawanku), AKPK, ASNB/PNB, SC InvestSmart and the dosm.gov.my portal terms were not retrieved. A human should read the footer "Terms/Penafian/Hak Cipta" pages directly. kwsp.gov.my blocks bots.
- Whether data.gov.my's CC BY 4.0 overrides older agency terms for the same data (for example a PDF on dosm.gov.my vs the dataset on OpenDOSM) is unconfirmed. Using the CC BY dataset copy avoids the question.

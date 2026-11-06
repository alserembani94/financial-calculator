# Show the benchmark, never the plan

A neutral, account-free Malaysian tool that runs from gross salary through statutory deductions, commitments and savings to a wealth projection does not exist today, so the app has a real gap to fill. Government tools are free and neutral, but each covers only its own agency's area: EPF covers retirement, LHDN covers tax, AKPK covers debt. Almost every free salary calculator exists to bring in leads for payroll software, an investment platform or a recruiter. Malaysians' financial knowledge is improving but their behaviour is not: **61% could not raise RM1,000 in an emergency in 2024** and only about **38% of active EPF members meet their age-based Basic Savings level**. The benchmarks the app can use are uneven. DOSM and EPF data on data.gov.my (household income, poverty lines, CPI, EPF dividends back to 1952) are official, machine-readable and licensed **CC BY 4.0**. EPF's Retirement Income Adequacy tiers are official, but news reports give conflicting phase-in schedules. The popular DSR and "3–6 months" emergency-fund thresholds are lender practice or folk wisdom, not regulatory health lines. On the legal side, Malaysian licensing law regulates two things: a **plan** built for a person and a **recommendation about a class, sector or instrument**. It does not regulate arithmetic. The CMSA defines "financial planning" as analysing another person's circumstances and giving them a plan, "whether or not a fee is charged", and the SC states that a disclaimer alone does not turn advice into education. The practical rule follows from that. The app can describe each of a user's numbers against a named, dated public benchmark. It should never produce a plan, a product pick or an asset-class tilt. It should take no money linked to products, keep financial inputs on the device, and keep any AI feature limited to explaining concepts. Indicators should be shown metric by metric as descriptive bands rather than as a single "good shape / bad shape" verdict. Projections should be shown as several scenarios in today's ringgit.

*This is research, not legal advice. It summarises statutes and regulator guidance where they could be read, and law-firm and press commentary where they could not. The final section lists what a Malaysian lawyer should confirm before launch.*

## Every neutral tool covers one agency's slice; every joined-up tool sells something

Malaysia's personal-finance market falls into three kinds of provider: statutory bodies that are neutral but limited to their own mandate, commercial sites that are broad but paid by financial institutions, and foreign budgeting apps that depend on manual entry.

**The neutral providers are statutory.** EPF's Retirement Goal Calculator sits inside the logged-in i-Akaun app and projects EPF savings against the new retirement tiers. It does not cover take-home pay, debt or savings outside EPF ([RinggitPlus](https://ringgitplus.com/en/guides/find-out-how-much-you-need-to-retire-with-this-calculator/)). EPF and Universiti Malaya's **Belanjawanku** guide publishes minimum monthly budgets for 12 cities as a free PDF and app ([The Star](https://www.thestar.com.my/business/business-news/2024/12/12/retirees-need-rm2690-a-month-for-reasonable-standard-of-living)). AKPK offers free counselling, a Debt Management Programme and the POWER! programme for young people ([BNM](https://www.bnm.gov.my/financial-capability-and-empowerment)). LHDN's PCB calculator is built around payroll scenarios, and guides stress that PCB is only an estimate of final tax ([BrioHR](https://support.briohr.com/knowledge/how-to-calculate-pcb-using-lhdn-calculator)). The Financial Education Network launched the **National Strategy for Financial Literacy 2026–2030** in October 2025. Its target groups include retirement planners, vulnerable households and rural micro-entrepreneurs, and **young adults and first-jobbers are not named** ([BNM](https://www.bnm.gov.my/-/flmns2pr)).

**The joined-up providers are commercial.** Free take-home-pay calculators are run by an investment platform, by payroll vendors and by recruiters ([StashAway](https://www.stashaway.my/salary-calculator); [PayrollPanda](https://www.payrollpanda.my/salary-calculator/)). There is also a long tail of small independent calculators, some still showing "YA 2024" rates or admitting to a "simplified PCB formula" ([SmartCalc MY](https://smartcalc-my.vercel.app/salary-calculator-malaysia); [sorted-my](https://hlteoh37.github.io/sorted-my/pcb-calculator.html)).

The largest comparison site is the clearest example of education sitting next to sales. Its owner bought the second-largest in 2024, and a regional comparison group took a stake in the owner. The business earns referral fees from banks and insurers ([MoneyHero](https://moneyherogroup.com/media/press-release-jun-28-2024)). Around that referral business, the site runs a literacy survey, a comparison quiz, workshops with a bank's foundation, and a free **Financial Health Check** whose scoring was designed by its licensed planners. The free tool feeds a paid planning service delivered by SC-licensed, FPAM-member planners ([RinggitPlus Financial Planner](https://ringgitplus.com/en/blog/financial-planning/ringgitplus-launches-first-fully-digital-one-to-one-financial-planning-service-ringgitplus-financial-planner.html); [RinggitPlus Health Check](https://ringgitplus.com/en/blog/ringgitplus/ringgitplus-launches-free-financial-health-check-tool-for-all-malaysians.html)).

Bank apps track only their own bank's transactions ([RinggitPlus on MAE](https://ringgitplus.com/en/blog/e-wallet/maybank-launches-new-mae-by-maybank2u-app-offers-new-features-for-better-financial-management.html)). Third-party budgeting apps are mostly foreign freemium products. One small 2026 guide states that Malaysian bank-feed integration "remains limited", so manual or CSV entry is the norm ([SmartCalc MY guide](https://smartcalc-my.vercel.app/guides/best-budgeting-apps-malaysia)). That is a single, low-confidence source, but if it holds, an app that never links accounts gives up nothing against local competitors.

| Category | Examples | How it makes money | Neutral? | What it leaves out |
|---|---|---|---|---|
| Statutory tools | EPF i-Akaun calculator, Belanjawanku, AKPK POWER!/DMP, LHDN PCB calculator, FEN | Public funding | Yes | Each covers only its own mandate. Nothing connects pay, debt and projection. |
| Salary/PCB calculators | An investment platform, payroll vendors, recruiters, small independent sites | Lead generation for payroll SaaS, investments or hiring | Partly | Totals without explanation. Some use outdated or simplified PCB. |
| Comparison sites | The main comparison sites, including a loan-comparison site | Referral fees from banks and insurers. Paid planning. | No | Education leads to a product pitch. |
| Budgeting apps | Foreign freemium apps and a few small local ones | Freemium subscriptions | Yes, but generic | Not Malaysia-specific: no EPF, PCB or official benchmarks. |
| Bank and e-wallet tools | Bank savings pots, digital-bank pockets, e-wallet investments | The provider's own products | No | One provider's transactions only. |
| "Financial health" scores | A credit bureau's score, comparison-site health checks and credit scores, AKPK's Financial Insight (~2017), an advisory firm's app | Credit data, leads, advisory | Mostly no | Usually a credit score or a lead-generating questionnaire. |

The "health score" category matters most for this app. In Malaysia, "financial health score" usually means a credit score (from a credit bureau, or a comparison site's 2018 bureau-backed score) or a questionnaire run by a firm that sells products or advice ([CTOS](https://ctoscredit.com.my/download-ctos-app/); [The Star, 2018](https://www.thestar.com.my/business/business-news/2018/08/23/intelligent-money-launches-financial-health-online-tool)). Several launched between 2017 and 2020 and have little visible follow-up coverage, and **no published data on how users received any of them was found**. A transparent, formula-based indicator that shows its inputs and its benchmarks, with no product step afterwards, would be unusual in this market.

One caveat applies to the gap analysis: it is inferred from what features exist, not from interviews or reviews by first-jobbers, which were not found.

## Malaysians know more than they act on, and young earners start thin

National data says knowledge is no longer the main problem; behaviour is.

Literacy is flat to slightly rising. BNM's MYFLIC index went from **57.1 (2018) to 59.0 (2021) to 59.1 (2024)** ([Bernama](https://www.bernama.com/en/news.php?id=2405611)), and financial knowledge rose from 60.2% to 62.9% between the 2021 and 2024 surveys. BNM's Deputy Governor said in October 2025 that "behaviours are not shifting" and that only 58% actively save ([BNM speech](https://www.bnm.gov.my/-/dgaz-nfls4)).

Resilience has worsened. **61% of Malaysians would struggle to raise RM1,000 in an emergency** in the 2024 survey ([Malay Mail](https://www.malaymail.com/news/money/2024/11/17/malaysians-financial-literacy-surpasses-global-average-but-61pc-still-lack-emergency-savings-says-bnm-deputy-governor/157181)). The comparable 2021 figure was 47% ([Malay Mail op-ed](https://www.malaymail.com/news/what-you-think/2026/09/29/are-malaysian-households-truly-financially-resilient-mohamad-fazli-sabri-and-amirah-shazana-magli/236923); [Bernama](https://www.bernama.com/en/news.php?id=2513957)). Only about **37% could cover more than three months** of expenses if their income stopped. That figure comes from academic commentary on the survey, and the survey's exact wording is unconfirmed ([Malay Mail op-ed](https://www.malaymail.com/news/what-you-think/2026/09/29/are-malaysian-households-truly-financially-resilient-mohamad-fazli-sabri-and-amirah-shazana-magli/236923)).

Internationally, only **34% of adults across 39 economies** reached the OECD/INFE minimum literacy target of 70 ([OECD](https://www.oecd.org/en/publications/2023/12/oecd-infe-2023-international-survey-of-adult-financial-literacy_8ce94e2c.html)). Malaysia's own score was not obtained; BNM says only that it is above the global average.

Young earners start from low pay. DOSM's 2024 median monthly salary was **RM2,793** ([DOSM](https://www.dosm.gov.my/portal-main/release-content/salaries-and-wages-survey-report-2024)). A secondary report of DOSM data puts the formal-sector median for 20–24-year-olds at about **RM2,045** ([WeirdKaya](https://weirdkaya.com/how-does-your-salary-compare-heres-what-msians-earn-at-different-ages-based-on-dosm-stats)). Belanjawanku's reasonable-living budget for a single person using public transport in the Klang Valley is about **RM1,970** ([iMoney](https://www.imoney.my/articles/?p=68824)), although SAYS reports RM1,930 ([SAYS](https://pre.says.com/my/amp/news/belanjawanku-single-person-needs-rm1930-a-month-in-klang-valley)).

Roughly, after 11% EPF and about 0.7% SOCSO and EIS, a RM2,045 gross salary leaves about **RM1,800** take-home (my arithmetic, approximate). That is below the budget. **For the median young earner in the Klang Valley, the salary breakdown alone answers whether they can afford a basic standard of living.** That is a strong argument for v1's focus on take-home pay.

Debt and retirement data point the same way:

- **Household debt.** RM1.73 trillion (84.4% of GDP), with a median household DSR of 33%, per a July 2026 parliamentary reply ([The Star](https://www.thestar.com.my/news/nation/2026/07/01/household-debt-at-rm173-trillion-844-of-gdp-but-loan-defaults-remain-low-says-anwar)).
- **BNPL.** Outstanding BNPL grew from RM3.8bn to **RM4.9bn** in the second half of 2025 ([Malay Mail](https://www.malaymail.com/news/malaysia/2026/03/31/bnm-says-new-consumer-credit-commission-will-oversee-bnpl-sector-amid-rising-debt-and-rapid-expansion/214493)). About 40% of first-half 2025 transactions were attributed to youths ([The Vibes](https://www.thevibes.com/articles/news/111314/bnpl-transactions-surge-past-rm9-billion-in-h1-2025-with-40-attributed-to-youths)). BNPL sits outside traditional debt measures, so a commitments screen will miss it unless it asks for it explicitly.
- **Youth bankruptcy.** Bankruptcies among people aged 34 and under rose to **877 in 2024**, and 46.4% of them were caused by personal loans ([Malay Mail](https://www.malaymail.com/news/malaysia/2025/03/13/bankruptcy-among-youths-on-the-rise-877-cases-recorded-in-2024-more-than-5000-since-2020-says-hannah-yeoh/169459)).
- **EPF adequacy.** About **38.3% of 7.94 million active members** aged 18–60 had met their age-based Basic Savings level as of mid-2026 ([Newswav/WeirdKaya](https://newswav.com/article/malaysians-need-around-rm390k-in-epf-by-60-but-many-still-below-basic-savin-A2603_gMQ3fq)). Only **18.6% of 18–30-year-olds** met theirs in August 2025, under the old benchmark ([Business Today](https://www.businesstoday.com.my/2025/10/08/only-one-quarter-of-epf-members-meet-basic-retirement-savings-says-mof/)). The adequacy figures in circulation (23.9%, 36%, 38.3%, 41.2%) use different denominators, age bands and benchmarks, and the press rarely says which. That confusion is something the app can resolve.

Malaysians also learn about money in places the regulator is only now policing. RinggitPlus's 2025 survey, a commercial survey with no stated sample size, found **68% use social media as their main source of financial learning** and 26% do not know what a credit score is ([RinggitPlus RMFLS 2025](https://ringgitplus.com/en/blog/featured/rmfls-2025-middle-income-malaysians-hit-by-financial-squeeze-as-youth-build-stronger-habits.html)). A Monash, Versa and AHAM study (June 2026) found high literacy scores among digitally active investors but continued insecurity, which it calls a "knowledge-action gap" ([The Star](https://www.thestar.com.my/business/business-news/2026/06/10/study-finds-gap-between-financial-literacy-and-financial-security-among-malaysians)).

**This audience data directly shapes the health indicator.** If the indicator used a "3–6 months emergency fund" or "on track for Basic Savings" pass mark, most users would see a failing result on day one. That is the condition under which people stop looking at their finances (see the section on indicators).

## Only a handful of benchmarks are both official and reusable

The benchmarks fall into three groups:

- **Official, machine-readable and openly licensed:** DOSM and EPF data on data.gov.my.
- **Official but not machine-readable, with unknown reuse terms:** EPF's RIA tiers and Belanjawanku.
- **Widely repeated but not set by any authority:** most DSR and emergency-fund thresholds.

The table rates each benchmark and gives its terms.

| Benchmark | Current figure | Who publishes it, and how solid it is | Reuse terms and machine-readable access | How the app should use it |
|---|---|---|---|---|
| DSR method | Net income after tax and EPF, counting all debts | BNM responsible-financing measures (2012). Solid on method; **no percentage given** ([BNM](https://www.bnm.gov.my/-/measures-to-promote-responsible-financing-practices)) | BNM website: personal use only. Paraphrase and link. | Compute DSR on net pay, as BNM requires lenders to |
| DSR "high leverage" marker | >60% | BNM Financial Stability Review analysis, not a household rule ([Malay Mail](https://www.malaymail.com/news/malaysia/2023/03/29/bnm-risk-of-default-low-but-25pc-of-household-borrowers-have-high-service-ratio/62125)). PIDM: banks generally accept below 60% ([PIDM](https://www.pidm.gov.my/finlit/manage-your-financial-commitments/what-is-debt-service-ratio)) | Cite as a fact | "BNM analysis treats >60% as highly leveraged" |
| DSR advice range | 30–40% | **Weak**: attributed to AKPK in one 2013 column ([Malay Mail](https://www.malaymail.com/news/what-you-think/2013/07/04/household-debt-not-worrying-eh-sobry-ahmad/490469)) | n/a | Label as a "commonly advised" range, never as an AKPK rule |
| DSR peer comparison | Median 33% (all household loans); 41% (new loans, 2024) | Parliamentary reply ([The Star](https://www.thestar.com.my/news/nation/2026/07/01/household-debt-at-rm173-trillion-844-of-gdp-but-loan-defaults-remain-low-says-anwar)) | No dataset | "How you compare", dated |
| EPF RIA tiers at age 60 | Basic RM390k, Adequate RM650k, Enhanced RM1.3m | EPF, official; in force Jan 2026 ([The Star](https://www.thestar.com.my/business/business-news/2024/12/12/epf-launches-three-tier-savings-framework-for-different-retirement-lifestyles); [MAICSA](https://www.maicsa.org.my/media/9802/technical_announcements_241213_1_1.pdf)) | kwsp.gov.my terms not retrieved (site blocks bots). Cite facts only. | Reference points for projections, with the as-of year |
| Basic Savings by age (phase-in) | 2026: RM26.3k at 30, RM74k at 40, RM150k at 50, RM270k at 60 | **Conflicting schedules**, see below ([RinggitPlus](https://ringgitplus.com/ms/blog/berita-kewangan-peribadi/hampir-4-daripada-10-ahli-aktif-kwsp-di-landasan-capai-simpanan-asas-rm390000.html)) | Not machine-readable | Store the effective year. Check manually each January. |
| Belanjawanku 2024/2025 | Klang Valley: single with car RM2,800; couple with 2 children RM7,440; single senior RM2,690 | EPF and UM SWRC; latest edition; no 2025/26 update found ([NST](https://www.nst.com.my/amp/news/nation/2024/12/1147614/klang-valley-living-costs-climb-67pct-epf-report-reveals)) | PDF, all rights reserved by default | Cite individual figures. Do not republish tables. |
| Emergency resilience | Can you raise RM1,000? National target: ≤45% unable by 2030 | FEN National Strategy, official ([FEN NS2.0](https://www.fenetwork.my/wp-content/uploads/2025/10/FEN_NS2_ENG_Interactive_FA_LowRes.pdf)) | PDF | Use as the official first rung |
| Emergency fund size | 3–6 months of living costs | **Weak**: AKPK attribution in one news item ([Ipoh Echo](https://www.ipohecho.com.my/?p=15774)) | n/a | Label as a common guideline |
| EPF dividends | 2025: 6.15% conventional and Shariah; series back to 1952 | Official ([data.gov.my](https://data.gov.my/data-catalogue/epf_dividend)) | **CC BY 4.0, API** | Context for projection scenarios |
| ASB distribution | FY2025: 5.75 sen (5.20 dividend + 0.55 bonus) | PNB press releases ([Business Today](https://www.businesstoday.com.my/2025/12/19/pnb-declares-5-75-asb-dividend-for-2025-payout-hits-record-rm10-4-billion/)) | No machine-readable history; terms unknown | Factual mention only; never a default return |
| Household income (HIES 2024) | Median RM7,017; B40 ≤ ~RM5,858; T20 ≥ RM12,682 | DOSM, official ([OpenDOSM](https://open.dosm.gov.my/data-catalogue/hh_income); [percentiles](https://data.gov.my/data-catalogue/hies_malaysia_percentile)) | **CC BY 4.0, API**, state-level too | "Your household vs national/state median" |
| Poverty lines | Average PLI RM2,705; relative poverty line RM3,509 | DOSM ([DOSM](https://v2.dosm.gov.my/portal-main/release-content/poverty-in-malaysia-2024)); rates on [data.gov.my](https://data.gov.my/data-catalogue/hh_poverty) | CC BY 4.0 for the rate data | Context, used sparingly |
| Inflation | CPI +1.8% YoY (Sept 2026) | DOSM ([data.gov.my](https://data.gov.my/data-catalogue/cpi_headline_inflation)) | **CC BY 4.0, API** | Deflator for projections |

### DSR has a regulatory method but no regulatory threshold

BNM's binding rule is about **how** lenders assess affordability: income after statutory deductions, all debt obligations counted, assessed at a "prudent" DSR. It gives no number ([BNM](https://www.bnm.gov.my/-/measures-to-promote-responsible-financing-practices)). In 2018 BNM confirmed that banks set their own DSR limits ([NST](https://www.nst.com.my/amp/business/2018/06/381711/banks-have-flexibility-decide-borrowers-debt-service-ratio-bank-negara)).

The 60–70% ceilings quoted by aggregators are unpublished bank practice ([RinggitPlus](https://ringgitplus.com/en/guides/debt-service-ratio-dsr-explained/)). A BIS paper using BNM borrower data found that households at every income level were more likely to run a negative financial margin above **60% DSR before a shock, or 40% after one** ([BIS](https://www.bis.org/publ/bppdf/bispap91k.pdf)). That paper is the most evidence-based reason for treating 40% as a meaningful line, but it uses 2014 data.

**The app should never label any band a "BNM limit".** Each band should show where it comes from.

### Retirement benchmarks moved in 2026 and are still moving

The RIA framework replaced the single RM240,000-at-55 target used from 2008 to 2025 ([NST](https://www.nst.com.my/amp/business/corporate/2024/12/1147195/epf-raises-basic-retirement-income-benchmark-62pct-rm390k-bttv)). Its Adequate tier is 240 months × Belanjawanku's RM2,690 retiree budget, rounded down, and Basic is 60% of Adequate ([MAICSA](https://www.maicsa.org.my/media/9802/technical_announcements_241213_1_1.pdf)).

**The Basic Savings phase-in is reported two ways:**

- **Version A (December 2024 coverage):** RM290k (2026), RM340k (2027), RM390k (2028) ([Utusan](https://www.utusan.com.my/ekonomi/2024/12/kwsp-naikkan-penanda-aras-simpanan-asas-kepada-rm390000/)).
- **Version B (2026 coverage citing KWSP's i-Invest page):** RM270k in 2026, rising RM30k a year to RM390k in 2030 ([RinggitPlus](https://ringgitplus.com/ms/blog/berita-kewangan-peribadi/hampir-4-daripada-10-ahli-aktif-kwsp-di-landasan-capai-simpanan-asas-rm390000.html)).

Version B is newer, cites the official page, and fits the government's own 2030 target ([MOF](https://mof.gov.my/portal/ms/berita/akhbar/malaysia-sasar-enam-daripada-10-ahli-kwsp-capai-simpanan-asas-rm390-000-menjelang-2030-pm-anwar)), so it is the better working assumption. It still needs a human to read kwsp.gov.my, which blocked automated fetches.

Sources also disagree on how often the framework is reviewed: annually ([NST](https://www.nst.com.my/amp/business/corporate/2024/12/1147195/epf-raises-basic-retirement-income-benchmark-62pct-rm390k-bttv)) or every three years from 2029 ([MAICSA](https://www.maicsa.org.my/media/9802/technical_announcements_241213_1_1.pdf)). Either way, every RIA figure the app shows needs an as-of date.

### EPF dividends are the only clean return series

The data.gov.my series shows conventional EPF dividends between **5.20% (2020) and 6.90% (2017)** over 2016–2025. By my arithmetic the decade averaged about **5.9%**. The EPF Act guarantees a 2.5% minimum for conventional savings ([data.gov.my](https://data.gov.my/data-catalogue/epf_dividend); [RinggitPlus](https://ringgitplus.com/en/guides/historical-epf-dividend-rates/)). ASB's history would have to be compiled by hand from PNB press releases, and older years exist only on blogs.

### Reuse rights split cleanly by publisher, and that decides what can go into AI

**data.gov.my and OpenDOSM** publish every dataset under **CC BY 4.0**. That licence permits commercial use, adaptation and redistribution, provided the source is credited and changes are indicated ([developer.data.gov.my](https://developer.data.gov.my/); [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)).

**BNM's Dataset Terms** also allow commercial reuse and embedding data in apps. They require the credit "Source: Bank Negara Malaysia" and forbid implying endorsement or using BNM's emblem ([BNM Dataset Terms](https://www.bnm.gov.my/terms-of-use-bnm-datasets)).

**BNM's website content** is different. Reports and articles are licensed for "personal use only", and there is "no copying, redistribution, retransmission, publication or commercial exploitation" without written permission ([BNM website terms](https://www.bnm.gov.my/terms-of-use)).

**EPF, AKPK, PNB/ASNB and SC** terms could not be retrieved. Until they are, treat Belanjawanku PDFs, EPF press material and similar documents as all rights reserved: state the facts with attribution, and do not redistribute the documents.

**None of the terms that were retrieved mention AI, machine learning or text-and-data mining.** Two practical consequences follow:

- **What is safe to feed to an AI.** CC BY and BNM-dataset numbers can go into prompts, retrieval indexes or a published JSON file, provided attribution travels with them. Bundling BNM reports or EPF PDFs into an AI retrieval corpus is the riskier act. Sending them to a third-party model provider is arguably "retransmission". That is an interpretation, not settled law.
- **How to fetch the data.** The data.gov.my API is unauthenticated but rate-limited to **4 requests per minute**, and it redirects the bare `?id=` URL ([rate limits](https://developer.data.gov.my/rate-limit)). The app should keep a versioned snapshot, not call the API live.

The natural result is a **benchmark registry**: a structured file in which every value carries its source, as-of date, licence and confidence level. That registry is what makes scattered public information usable alongside AI. It can be published openly because each entry records what may be redistributed.

## Malaysian law regulates the plan and the product, not the arithmetic

### Two CMSA definitions set the boundary

Schedule 2 of the Capital Markets and Services Act 2007 lists the regulated activities. Two matter here.

**"Investment advice"** means "carrying on a business of advising others concerning securities or derivatives", or issuing analyses or reports on them "as part of a business".

**"Financial planning"** means "analysing the financial circumstances of another person and providing a plan to meet that other person's financial needs and objectives, including any investment plan in securities, **whether or not a fee is charged**" ([CMSA Schedules 2 & 3](https://www.sc.com.my/api/documentms/download.ashx?id=090e71ab-fa25-4c23-8bc0-cfcaee0da913)).

The second definition is the one a personal-finance app is closest to. A salary-to-wealth tool necessarily "analyses the financial circumstances of another person". What it must not do is supply the second half of the definition: "a plan to meet that person's needs and objectives".

Two other activities can be triggered without giving advice at all. "Dealing in securities" and "dealing in private retirement schemes" both include **"inducing or attempting to induce"** someone to buy or contribute ([CMSA Schedule 2](https://www.sc.com.my/api/documentms/download.ashx?id=090e71ab-fa25-4c23-8bc0-cfcaee0da913)). A neutral-looking "open a PRS account" button could therefore engage the CMSA even with no advice attached.

Carrying on a regulated activity without a licence carries a maximum fine of **RM10 million, 10 years' imprisonment, or both** ([SC Guidance Note para 3.8](https://www.sc.com.my/api/documentms/download.ashx?id=d22c8909-06e8-40bf-a8da-4fc31b4606c0)).

Section 58 still appears to require the activity to be carried on **as a business**. Whether a free, non-monetised app is "carrying on a business" is the single most important unresolved question, because the s 58 text itself could not be read.

The statutory exclusions do not obviously help. The newspaper and "information service" carve-outs in Schedule 3 apply only to publications distributed to subscribers and purchasers "for value", where no commission is received. **A free web app does not fit them** ([CMSA Schedule 3](https://www.sc.com.my/api/documentms/download.ashx?id=090e71ab-fa25-4c23-8bc0-cfcaee0da913)).

### Insurance advice and financial planners sit under separate regimes

Under the Financial Services Act 2013, "financial advisory business" is **limited to insurance**. It covers analysing a person's "financial planning needs ... relating to an insurance product", recommending such a product, and arranging it. It requires BNM approval under s 11, and doing it without approval carries penalties of up to **RM50 million or 10 years** ([Low & Partners](https://www.lowpartners.com/financial-services-act-2013-part-1/)). The IFSA has a parallel regime for takaful ([IFSA 2013](https://www.investmalaysia.gov.my/media/drcdqgbk/islamic-financial-services-act-2013.pdf)).

**A "how much cover do I need" calculator sits on the first limb of that definition.** It is the feature most likely to drift into insurance advice.

Malaysia has no single statutory "registered financial planner" licence. Practitioners typically hold an SC Capital Markets Services Representative's Licence in financial planning (CMSRL-FP), BNM financial-adviser's-representative status, or both. They qualify through FPAM credentials (CFP, IFP) or MFPC credentials (RFP). **Those credentials are prerequisites for licences, not licences themselves** ([FPAM](https://fpam.org.my/membership/be-a-ifp-professional/); [RinggitPlus Financial Planner](https://ringgitplus.com/en/blog/financial-planning/ringgitplus-launches-first-fully-digital-one-to-one-financial-planning-service-ringgitplus-financial-planner.html)). MFPC publicly backs tougher action on unlicensed advice ([The Star](https://www.thestar.com.my/news/nation/2026/01/17/calls-to-regulatefinfluencers)).

### The SC's guidance note is the operative test, and it rejects disclaimers as a cure

The SC's **Guidance Note on Provision of Investment Advice** (revised July 2024) asks two questions.

**First, is it advice?** Any "recommendations or opinions which are likely to induce a person to take any action or position (e.g. buy, sell or hold) regarding a **particular class, sector, or instrument**" is likely to be advice.

**Second, is it a business?** The SC looks for regularity, pay-for-advice, paid subscriptions, or any "expectation of benefits or gratification, direct or indirectly". That last factor expressly includes view income, referral rewards and affiliate marketing ([SC Guidance Note paras 2.2, 3.7, 3.9](https://www.sc.com.my/api/documentms/download.ashx?id=d22c8909-06e8-40bf-a8da-4fc31b4606c0)).

The note says two things that matter most for this app:

- "Talking or sharing factual information ... or towards educating" is "**not likely**" to require a licence.
- "Having a disclaimer that states that you are not providing an investment advice, in itself, **does not relieve you** from the requirement of holding a licence."

The note also creates an offence that applies to everyone, licensed or not: recklessly making a "statement, promise or forecast that is misleading, false or deceptive" to induce dealing in securities. The penalty is up to 10 years' imprisonment and a minimum fine of RM1 million ([SC Guidance Note para 3.5](https://www.sc.com.my/api/documentms/download.ashx?id=d22c8909-06e8-40bf-a8da-4fc31b4606c0)).

The wider regulatory direction is tightening:

- **Advertising.** The SC's revised **Advertising Guidelines**, in force since **1 November 2025**, treat independent finfluencers who promote capital-market products "on their own accord" as advertisers ([SC](https://www.sc.com.my/resources/media/media-release/sc-issues-revised-guidelines-on-advertising-for-capital-market-products-and-related-services)).
- **Enforcement.** Press reports say unlicensed-advice cases rose from **22 in 2023 to 77 in 2024**. That figure was not checked against the SC's own data ([The Star](https://www.thestar.com.my/tech/tech-news/2025/04/14/money-talks---but-should-you-listen-when-finfluencers-offer-investment-tips)).
- **Automation.** The SC has treated automated advice as licensed activity since its 2017 digital investment management framework. Its December 2022 Technical Note covers advice through "automated, algorithm-based tools" ([SC](https://www.sc.com.my/resources/media/media-release/sc-issues-new-guidelines-and-technical-note-to-enhance-the-quality-and-diversity-of-investment-advisory)). **Being software is no defence.** An app that maps a user's profile to an asset allocation is a robo-adviser in the SC's eyes.

### Features climb a five-step risk ladder

Applying these tests to features gives a ladder of rising risk:

1. **Generic arithmetic** (salary, DSR, compound interest) is the lowest risk.
2. **Comparing the user's own numbers with published third-party benchmarks** is information.
3. **A personalised verdict or score** completes the first half of "financial planning".
4. **A plan or "what you should do"** completes the second half.
5. **Naming, ranking or matching products, instruments or asset classes** reaches investment advice, PRS dealing or insurance advisory business.

No SC or BNM guidance addresses calculators or health scores specifically, so this ladder is inferred from the definitions, not stated by a regulator.

**AI chat is the feature that can climb the ladder unaided.** Ask a model with the user's numbers "should I put my bonus into ASB or pay off my car?" and it will naturally produce a personal recommendation about a named instrument.

### PDPA obligations scale with what leaves the device

The Personal Data Protection Act 2010 applies to personal data processed "in respect of commercial transactions" ([DLA Piper](https://www.dlapiperdataprotection.com/?t=law&c=MY)). The 2024 amendments, phased in during 2025, made these changes ([DLA Piper Privacy Matters](https://privacymatters.dlapiper.com/2025/03/malaysia-guidelines-issued-on-data-breach-notification-and-data-protection-officer-appointment/)):

- data processors are directly bound by the Security Principle;
- breaches must be notified to the Commissioner **within 72 hours** and to affected individuals **within 7 days** after that;
- a data protection officer is mandatory above set thresholds;
- cross-border transfers need a transfer impact assessment;
- a data-portability right was added.

**Financial information is not "sensitive personal data" under the Act.** However, the DPO guideline counts "sensitive personal data, including financial information" of **more than 10,000 data subjects** as a trigger ([DLA Piper Privacy Matters](https://privacymatters.dlapiper.com/2025/03/malaysia-guidelines-issued-on-data-breach-notification-and-data-protection-officer-appointment/)). A successful app that stores salaries on a server could therefore cross that line.

If inputs stay in the user's browser and are never sent to the operator, the operator arguably never "collects, records, holds or stores" them. PDPA duties would then attach only to server logs, analytics identifiers and feedback emails. That reading needs a lawyer's confirmation.

**Sending a user's figures to an LLM API brings in the processor and cross-border rules, even if the app stores nothing itself.**

The Consumer Protection Act 1999 adds misleading-conduct risk for wrong or overclaimed outputs. It may not apply to a free service supplied outside "trade". Even so, disclaimers help here and with negligent-misstatement risk, while doing nothing about licensing risk ([LawPlayer, Act 599](https://lawplayer.com/my/act/act-599)).

## Describe each number against its source; never grade the person

### Composite scores exist, but their makers avoid pass/fail

The two best-known composite measures both come from the US.

The **FinHealth Score** averages eight indicators across Spend, Save, Borrow and Plan into a 0–100 score. It sorts households into Vulnerable (0–39), Coping (40–79) and Healthy (80–100) ([FHN](https://finhealthnetwork.org/tools/financial-health-score/finhealth-score-methodology/); [FHN Pulse 2025](https://finhealthnetwork.org/wp-content/uploads/2025/09/Financial-Health-Pulse-2025-U.S.-Trends-Report.pdf)). Its indicators are self-reported outcomes, not exact ratios. A ratio-based Malaysian tool would be a different instrument and should not borrow those tier names as if they were validated for it. The Score is also licensed for non-commercial use only ([FHN](https://finhealthnetwork.org/tools/financial-health-score/finhealth-score-methodology/)).

The **CFPB Financial Well-Being Scale** states that "there is not a specific cut-off for a 'good' or 'bad' score" ([CFPB Quick Guide](https://files.consumerfinance.gov/f/documents/201701_cfpb_FinancialWell-Being_Quick-Guide.pdf)). It uses six descriptive bands derived from population data, which it has revised over time. It warns practitioners that seeing a score can make people "anxious or upset" and that they should consider "whether, and how, to share the score" ([CFPB](https://www.consumerfinance.gov/consumer-tools/educator-tool/financial-well-being-resources/measure-and-score/)).

Malaysia has no consumer-facing composite score from any regulator. BNM's MYFLIC index measures the population, not individuals. The only personal-level official benchmarks found are **EPF's RIA tiers** and **FEN's RM1,000 emergency indicator** ([FEN NS2.0](https://www.fenetwork.my/wp-content/uploads/2025/10/FEN_NS2_ENG_Interactive_FA_LowRes.pdf)).

### Behavioural evidence argues against a "bad shape" verdict

Olafsson and Pagel found that people **check their accounts less when their finances look worse**, and attention keeps falling as overdraft debt grows ([NBER w23945](https://www.nber.org/papers/w23945)). Their data also associates one extra login a month with about a 17% fall in consumer debt over 24 months. That is a correlation, not proof of cause ([VoxEU](https://cepr.org/voxeu/columns/ostrich-us-selective-attention-personal-finances)).

Combine that with Malaysian base rates: 61% cannot raise RM1,000, 63% cannot cover three months, and 62% are below Basic Savings. A headline "bad shape" verdict would land on most users and push away exactly the people the app most wants to keep.

**This matches the legal analysis.** A single personal verdict is step 3 on the risk ladder. Attaching "here's what to do" to it is step 4.

### What a defensible indicator looks like

The defensible design keeps the idea of "where do I stand" but breaks it into separate metrics. Each metric is shown on its own with these parts:

- **The number**, for example DSR 38% or 1.4 months of expenses.
- **A named, dated benchmark**, for example "BNM analysis treats DSR above 60% as highly leveraged", or "EPF Basic Savings for age 30 in 2026: RM26,300".
- **A descriptive band** ("within / above / below the cited range") instead of good/bad.
- **A neutral sequential palette with text labels**, not red/green traffic lights.
- **A plain-language meaning and a "how this is calculated" panel**, with next steps written as questions to explore or links to AKPK and FEN material, never as instructions.

If the product keeps a summary line, the most defensible form is a count against the published references, such as "3 of 5 measures are within their published reference ranges". It should not be a grade. Whether even that is too close to "analysing circumstances" is a question for the lawyer.

### Projections should follow regulator practice: deterministic, multi-rate, in today's money

Regulated consumer projections in the UK and Australia are deterministic compound-growth calculations, not Monte Carlo simulations:

- **UK.** The FCA prescribes **2% / 5% / 8%** nominal lower, middle and higher rates for pension projections. These were cut from 5/7/9% in 2012 ([FCA COBS 13 Annex 2](https://handbook.fca.org.uk/handbook/COBS/13/Annex2.html); [FCA PS12/17](https://www.fca.org.uk/publication/policy/ps12-17.pdf)). Annual pension statements are shown **in today's money using 2.5% inflation** ([Railpen SMPI guide](https://cdn3.railpen.com/mp-sitefinity-prod/docs/librariesprovider2/read-as-you-needs/a-guide-to-statutory-money-purchase-illustration-(smpi)apr26.pdf?sfvrsn=4420eba1_3)).
- **Australia.** ASIC requires superannuation forecasts in present values, using 3.7% wage inflation before retirement and 2.5% CPI after ([ASIC](https://www.asic.gov.au/about-asic/news-centre/news-items/asic-updates-superannuation-forecasts-relief-instrument)). Moneysmart's calculators warn that returns "will vary significantly from year to year and could be negative" ([Moneysmart](https://moneysmart.gov.au/how-super-works/superannuation-calculator)).

Malaysian third-party EPF calculators apply one user-chosen dividend rate with no inflation adjustment ([dividen.my](https://dividen.my/kwsp); [calculatormalaysia.com](https://calculatormalaysia.com/tax/epf-retirement-calculator-malaysia/)). EPF's own assumptions could not be retrieved.

That approach creates a quiet error when the result is compared with RIA. The RIA targets are built from 2024/2025 budgets × 240 months, so they are in roughly 2024/25 ringgit. A projected balance at age 60 is in future ringgit. At 2% inflation, RM390,000 today is about **RM780,000** in nominal terms 35 years from now (my arithmetic). So **a nominal projection compared with RIA flatters the user by roughly half** for a 25-year-old.

The app should therefore:

- deflate projections to today's ringgit, using CPI from data.gov.my as the documented default;
- show three return scenarios, framed against EPF's 5.2–6.9% historical range and its 2.5% statutory floor, with the user able to edit them;
- convert lump sums into monthly income, as EPF does (RM390,000 ≈ RM1,625 a month in the first year of retirement ([SAYS](https://says.com/my/news/epf-retirees-rm390-000-basic-retirement-rm1-3-million-luxury-lifestyle))).

For investments outside EPF, the default scenarios should be generic rates, never "ASB has paid about 5.75 sen". Tying an assumption to a named product moves the projection from illustration towards inducement.

## Feature-by-feature risk table

Risk levels are my judgement from the sources above, not a legal opinion.

| Feature | Regime most engaged | Risk | What keeps it on the education side |
|---|---|---|---|
| Salary breakdown (EPF, SOCSO, EIS, PCB) | None of the licensing regimes; misstatement or CPA if wrong | Low | Statutory arithmetic with as-of rates. Label PCB as an estimate of final tax. |
| Commitments list and DSR calculation | None; it is a calculator | Low | Net-income method as BNM requires of lenders. Prompt explicitly for BNPL. |
| DSR compared with lending thresholds | Misleading representation more than licensing | Low–medium | State where each band comes from. Never say "you will / won't be approved". Name no lender. |
| Emergency-fund months and RM1,000 test | None | Low | Cite the FEN indicator. Label 3–6 months as a common guideline. |
| Income vs DOSM medians and B40/M40/T20 | CC BY attribution only | Low | Use the percentile dataset and credit DOSM via data.gov.my. |
| Spending vs Belanjawanku | EPF copyright (terms unknown) | Low for licensing, medium for reuse | Cite individual figures. Do not republish the tables. |
| Per-metric indicator with cited benchmarks | CMSA "financial planning", first half only | Low–medium | Descriptive bands, named and dated sources, no instructions. |
| Composite "good / bad shape" verdict | CMSA "financial planning", first half; shaming and disengagement | Medium | Replace with per-metric bands, or at most a count against references. |
| Indicator plus "what you should do next" | CMSA "financial planning", both halves | Medium–high | Questions to explore and links to AKPK/FEN instead of instructions. |
| EPF projection vs RIA tiers | Misleading-forecast risk; lawyer to confirm the dividend default | Low–medium | Three editable scenarios, today's ringgit, RIA as-of year, "not guaranteed". |
| Wealth projection with user-set returns | CMSA forecast offence only if it induces dealing | Low–medium | User sets the rate or sees generic scenarios. Inflation-adjusted. |
| Default return tied to a named product (ASB, a fund) | Investment advice; misleading forecast | High | Do not build it. |
| Asset-allocation suggestions | Investment advice on a "particular class"; digital-advice Technical Note | High | Do not build it. Explain diversification only in general terms. |
| Factual pages on ASB, PRS, unit trusts, takaful | CMSA advice and PRS "inducing"; FSA/IFSA | Medium | Facts, sources and links to official pages. No ranking, matching or "open account" calls to action. |
| Product comparison, "best", "suitable for you" | Investment advice, dealing, FSA advisory | High | Out of scope. |
| Insurance or takaful "cover needed" calculator | FSA/IFSA financial advisory business, first limb | High | Leave it out, or offer only a generic explainer. |
| AI explainer with no user figures | Digital investment advice if it drifts | Medium | Concepts only. Hard refusals on "should I" and product questions. Logged red-team tests. |
| AI chat using the user's numbers | Financial planning and investment advice; PDPA processor and cross-border rules | High | Leave out of v1. |
| User-initiated "copy my summary for my own AI" | Minimal PDPA exposure (inference) | Low–medium | Export runs on the device and includes sources and caveats. The app never calls a model. |
| Public benchmark registry (JSON) for people and AI | CC BY and BNM dataset terms; EPF terms unknown | Low (DOSM/BNM), medium (EPF/Belanjawanku) | Source, licence, as-of date and confidence on every value. Facts, not documents. |
| Accounts, sync, server storage | PDPA data-controller duties; DPO above 10,000 users' financial data | Medium | Store data on the device by default. |
| Analytics and error logging | PDPA | Low–medium | Never capture inputs. |
| Ads, affiliates, referrals, sponsorship | SC "benefit or gratification" business test | High; changes the whole analysis | Take no revenue linked to products. |

## The app's practical rules

| Area | Rule | Why |
|---|---|---|
| Wording | Say "illustration", "estimate from your inputs", "commonly cited range". Never say "you should", "we recommend", "best", "suitable for you", "your plan", or "buy / sell / hold / switch". | These words mark recommendations and plans (SC note para 2.2; CMSA Sch 2 para 6) |
| Indicators | One metric at a time. Each gets a named, dated benchmark and a descriptive band. No single pass/fail grade. Text labels with a neutral palette. | CFPB "no cut-off" practice; ostrich effect; avoids a personal verdict |
| Benchmarks | Record source, as-of date, licence and confidence for every figure. Never call a band a "BNM limit". Re-check RIA and Basic Savings each January. | DSR has no official threshold; RIA phase-in conflicts and is reviewed |
| Projections | Deterministic and shown in today's ringgit. Three editable scenarios. Lump sums shown as monthly income. "Not guaranteed; returns vary." | FCA/ASIC precedent; prevents the RIA price-basis error |
| Products | General categories only, described factually, linked to official pages. No ranking, matching, filtering by profile, or "open account" buttons. | Investment advice; PRS and securities "inducing" |
| Insurance | No personalised cover calculations. | FSA/IFSA financial advisory business, first limb |
| Money | No affiliate links, referral fees, sponsored placements or product ads. Re-assess before adding any revenue. | SC business indicators include "benefits or gratification" |
| AI | v1: no chat that sees user figures. Any AI explains concepts only, refuses product and "should I" questions, and is red-teamed. Users can export their own summary to their own tools. | Automated advice is still advice; PDPA processor and cross-border rules |
| Data reuse | Build from data.gov.my/OpenDOSM (CC BY 4.0) and BNM datasets with the required credits. Cite EPF and Belanjawanku figures as facts. Do not bundle agency PDFs into an AI corpus. No agency logos and no implied endorsement. | BNM website terms; EPF terms unknown |
| Personal data | Inputs stay on the device. No input values in analytics or error logs. Bilingual privacy note. "Clear my data" control. | Keeps PDPA exposure to a minimum |
| Disclaimer | State the purpose, not a shield: general education only; not investment, financial-planning, insurance or tax advice; not licensed by the SC or BNM; sells nothing; check the SC Investment Checker before acting. | Disclaimers do not cure advice (SC note para 2.2) but help with misstatement and CPA risk |
| Self-description | "Free financial education and calculators". Never "adviser", "planner", "robo-adviser" or "personalised plan". | Avoids holding out as a licensee |

## Questions a Malaysian lawyer should confirm

These are open because the primary text could not be read, or because no guidance exists. None of this report is legal advice.

| # | Question | Why it matters |
|---|---|---|
| 1 | Is a free, non-monetised app "carrying on a business" under CMSA s 58 and FSA s 8/s 11? Would donations, ads or a paid tier change that? | Decides whether the licensing regimes apply at all |
| 2 | Does a personalised health indicator, with or without suggested next steps or a count summary, amount to "analysing ... and providing a plan" under CMSA Sch 2 para 6? Does "plan" require a formal plan? | Sets the limit for the health indicator |
| 3 | Is showing scenarios by asset class (equities vs fixed income) a recommendation regarding a "particular class"? | Limits the investments module |
| 4 | Are factual pages on ASB, ASM, PRS and Tabung Haji safe? Is using EPF's historical dividend as the default projection rate safe? | Product information and projection defaults |
| 5 | Does an insurance or takaful "coverage needs" calculator engage the first limb of FSA/IFSA "financial advisory business"? What is in the FSA Sch 1 exemption list? | Insurance features |
| 6 | Would a guardrailed AI explainer count as "digital investment advice" under SC Technical Note 1/2022? | AI roadmap |
| 7 | Does the PDPA apply if financial inputs never leave the device, and does a free service involve "commercial transactions"? What notices are needed for logs and analytics? What do the s 45 and extraterritorial provisions cover? | Data architecture |
| 8 | Does the CPA reach a free service? What negligent-misstatement exposure does a calculator error create? | Accuracy liability |
| 9 | Could the SC Advertising Guidelines R1-2025 catch the app's own social content if it mentions products neutrally? | Marketing |
| 10 | What are EPF's and AKPK's reuse terms for Belanjawanku, RIA tables and press material? Can they go into a public benchmark file or an AI retrieval index? | Benchmark registry and AI reuse |
| 11 | What are the current CMSA, FSA and PDPA penalty and section texts, including amendments after 2024, read from the official Acts? | Several figures here come from secondary sources |

## Conclusion

The app does not need to choose between being useful and staying on the education side. In Malaysia the same design choices serve both. Showing each metric against a named, dated public source keeps the tool on the "factual information" side of the SC's line. The same choice also avoids the disengagement that a verdict causes in a population where most people would fail it. The new insight is that the legal risk and the behavioural risk sit in the same place. The step from "here is where your number sits" to "you are in bad shape, do this" is where the CMSA's financial-planning definition is completed, and where the ostrich effect starts. The roadmap's "good shape / bad shape" wording should be reframed before it is built, not defended afterwards.

The app's lasting asset is less any single calculator than a **provenance-tagged benchmark registry**. Most of what the app needs is already open (DOSM and EPF data under CC BY 4.0, BNM datasets). The weak points are the figures people care most about: RIA phase-in, Belanjawanku and DSR thresholds. These are scattered, conflicting, or locked in all-rights-reserved PDFs. Recording each value with its source, date, licence and confidence makes the app honest for people. It also makes the data safe to hand to AI tools without the app itself becoming the adviser. A user who copies their own summary into their own assistant is in a very different legal position from an app that runs that conversation for them.

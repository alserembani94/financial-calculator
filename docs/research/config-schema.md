# Unified statutory config schema (proposal)

Drafted 2026-11-05 from each report's §4–§5 and the data files. A proposal for the implementer; nothing here is built yet. This is the full, long-term schema. The first iteration uses only the small part listed in [v1-baseline.md](v1-baseline.md). IDs such as D3 or X1 refer to [owner-questions.md](owner-questions.md), and I-numbers to [cross-check.md](cross-check.md).

**Principles**

- One config per year: `config2025`, `config2026`, `config2027Template`.
- Periods within a year handle mid-year changes.
- Full tables stay in `data/*.json` and are referenced, never copied.
- Rules that don't change by year live once, in `sharedRules`.
- A value the owner hasn't decided is a `Pending`, citing its question id. A `suggestion` is never a decision.
- Every field that isn't plain enacted law says so, with a confidence.

## 1. Status legend

| `status` | Meaning |
|---|---|
| `law` | Gazetted law in force, read directly or via the agency's own PDF |
| `agency` | The agency's own published rule or tool, with no statute saying it in those words |
| `reading` | Our reading of a statute. No agency statement |
| `inferred` | Inferred from practice, code or absence of a rule |
| `conflict` | Sources disagree. The value is a labelled default |
| `gazetted-future` | Law, but not in force yet |
| `announced` | Announced, not gazetted |
| `proposed` | Budget proposal, no Act yet |
| `carried-forward` | Copied from the prior year. Nothing announced either way |
| `unpublished` | Not published. Must stay `null` |

Confidence: `high`, `medium-high`, `medium`, `medium-low`, `low-medium`, `low`.

`agcListing: true` marks a fact resting on the saved AGC listings. The owner decided on 2026-11-06 not to rely on them (D1), so treat any confidence shown for these facts as low until a manual check (M7).

## 2. How the reports' schemas were reconciled

| Difference | EPF | SOCSO | EIS | PCB | Zakat | **Chosen** |
|---|---|---|---|---|---|---|
| Period key | `YYYY-MM` wage month | ISO date | ISO date, `contributionMonth` input | YA | ISO date | **`WageMonth` `YYYY-MM`.** All are monthly. Exact dates go in `keyDates`. EIS benefits keep a job-loss date |
| Term | Contribution month = wage + 1 | Contribution month = wage month | Same as SOCSO | Current month | Haul year | **`wageMonth` in code.** Labels are display text (I5) |
| Money | Whole RM | RM with 5-sen steps | Integer sen | RM + truncate | RM + `toFixed` | **Integer sen** at the boundary. PCB and zakat keep their own rounding helpers |
| Year status | `confirmed`, `inferred`, `announced`, `template` | `confirmed`, `template-unconfirmed` | `confirmed`, `announced`, `unconfirmed-carried-forward` | `confirmed`, `reconstructed`, `unconfirmed-template` | `final`, `provisional`, `template` | **§1 per field.** A year's `status` is derived, never typed |
| Table reference | `tableFile` | Table `id`, `phase` | `contributionTableId` | Inline | Inline | **`TableRef`:** file and path, plus a stable id |
| Year-independent rules | Mixed into period | `SocsoRules` | `eligibilityRulesId` | In `YearConfig` | `structuralRules` | **`sharedRules`**, with an explicit `validFrom` |
| Worker type | `Category` mixes citizenship and job | `employment` + `residency` | `employmentType` + `residency` | Flags | `workerCategory` | **`Employment` + `Residency`** (§7) |
| Wage classification values | `subject`, `notSubject`, `userChoice`, `unverified` | `counted`, `excluded`, `ownerDecision` | `counted`, `excluded`, `pending-owner-decision`, `unresolved` | Y1, Yt | Included, excluded, unresolved | **One table, one column per scheme** (§6) |
| "Category" | — | 1, 2 | — | 1, 2, 3 | — | **`socsoCategory`, `pcbCategory`** |
| Age | `ageForWageMonth` | Age at month end | Completed years | Via EPF | — | **Per-scheme boundary rule**, input pending D3 |
| Pending decisions | `status` strings | `owner-decision` | `pending-owner-decision` | Prose | Prose | **`Pending<T>`** with a question id |

## 3. Core types

```ts
type WageMonth = `${number}-${number}`;     // 'YYYY-MM', the month the wages are for
type IsoDate = `${number}-${number}-${number}`;
type Sen = number;                          // integer
type Rm = number;                           // whole-ringgit thresholds in law, such as 5000

type Status = 'law' | 'agency' | 'reading' | 'inferred' | 'conflict' | 'gazetted-future'
            | 'announced' | 'proposed' | 'carried-forward' | 'unpublished';
type Confidence = 'high' | 'medium-high' | 'medium' | 'medium-low' | 'low-medium' | 'low';

/** A value with its evidence. */
interface Fact<T> {
  value: T | null;           // null only with status 'unpublished'
  status: Status;
  confidence: Confidence;
  basis: string;             // short citation; full sources are in the report
  agcListing?: true;         // rests on saved AGC listings; see D1
}

type QuestionId = string;    // 'D3', 'X1', 'PCB1' ... from owner-questions.md

/** An owner decision that hasn't been made. The engine needs some value to run,
 *  so it uses `suggestion`, and the UI labels it. It doesn't become a decision by being used. */
interface Pending<T> {
  pending: QuestionId;
  options: T[];
  suggestion?: T;            // absent where no report suggests one
  suggestedBy?: string;      // 'epf.md Q4', 'cross-check'
}
const isPending = <T>(x: T | Pending<T>): x is Pending<T> => typeof x === 'object' && x !== null && 'pending' in x;

/** A pointer to a table in docs/research/data/. Tables are never copied into config. */
interface TableRef {
  id: string;                // stable id, independent of the file name (I22)
  file: string;              // 'socso-act4-2026.json'
  path: string;              // 'phases[0].bands'
}

interface Period<T> {
  from: WageMonth;           // inclusive
  to: WageMonth | null;      // inclusive; null only on an open template period
  rules: T;
  keyDates?: Record<string, IsoDate>;   // events inside a month, for labels only
}

type PeriodList<T> = Period<T>[];       // contiguous, non-overlapping, must cover the year
```

## 4. Year config and engine order

```ts
interface YearConfig {
  year: number;
  /** Derived: 'final' if nothing is proposed, carried-forward or unpublished. */
  readonly status: 'final' | 'partly-unconfirmed' | 'template';
  sharedRulesVersion: string;
  epf: EpfYear;
  socso: SocsoYear;
  eis: EisYear;
  pcb: PcbYear;
  zakat: ZakatYear;
}
```

**Engine order for one month:** EPF → SOCSO → EIS → zakat → PCB. Zakat Kaedah 2 needs annual EPF. PCB needs EPF (K1, Kt), the zakat amount, and the SOCSO + EIS amounts if TP1 C14 is on. There is no cycle: PCB's output feeds nothing back. Each scheme picks its own period from `wageMonth` independently.

**Assumption:** wages are paid in the wage month, unless an arrears entry says otherwise (I15).

**Take-home, replacing `pcb.md` line 975 and `zakat.md` line 581:**

```
payslipNet = gross − epf.employee − socso.invalidity − socso.nei − eis.employee
             − pcb.payable − zakat.ifThroughPayroll
afterZakat = payslipNet − zakat.ifPaidDirectly
```

## 5. Scheme sections

### 5.1 EPF

```ts
type EpfPartId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

interface BandedPart { kind: 'banded'; id: 'A' | 'C' | 'E'; table: TableRef; bonusNote: boolean; }
interface FlatEmployerPart { kind: 'flatEmployer'; id: 'B' | 'D'; table: TableRef; }
interface PercentPart {                      // Part F: a formula, no table (epf.md §3)
  kind: 'percent'; id: 'F'; employeeRate: number; employerRate: number;
  rounding: Fact<'ceilPerShare' | 'ceilTotal'> | Pending<'ceilPerShare' | 'ceilTotal'>;   // EPF3
  alsoStops: string;
}

interface EpfRules {
  parts: Partial<Record<EpfPartId, BandedPart | FlatEmployerPart | PercentPart>>;
  selection: TableRef;                       // epf-config.json: residency + age → part
  domesticWorkers: 'notMandatoryMayElect';
}

interface MinWagePeriodRules {
  monthly: Fact<Rm>;
  hourly: Fact<number> | null;
  daily: Fact<Record<4 | 5 | 6, number>> | null;
  pieceRateMonthly: Fact<Rm> | null;
  smallEmployer?: { monthly: Fact<Rm>; appliesWhen: string };  // Feb to Jul 2025
  exemptMsme?: { monthly: Fact<Rm>; basis: string };           // from Jun 2027, assumed
}

interface EpfYear {
  periods: PeriodList<EpfRules>;
  minimumWageFloor: PeriodList<MinWagePeriodRules>;  // cuts across `periods`
  above20000: {
    rounding: Fact<'ceilTotal' | 'ceilPerShare'> | Pending<'ceilTotal' | 'ceilPerShare'>;  // EPF4
    split: Fact<'employeeCeilEmployerRemainder'>;                                          // low
  };
  bonusNote: { employer: Fact<string>; employee: Fact<string>;
               commissionTriggers: Fact<boolean>; above20000: Fact<string> };
  topUp: {
    method: Fact<'tablePlusWholeRinggit' | 'combinedRateOnActualWage'>
          | Pending<'tablePlusWholeRinggit' | 'combinedRateOnActualWage'>;                 // EPF5
    voluntaryAnnualCap: Fact<Rm>;
    countsTowardCap: Fact<'conflicting'>;
  };
  matching: TableRef;                        // epf-config.json#matchSchemes; outside take-home
  dividend: Fact<{ conventional: number; syariah: number }> | null;
}
```

### 5.2 SOCSO, including SKBBK

```ts
type NeiLocal = 'none' | 'mandatory' | 'default-in-window-open' | 'default-in-window-closed';

interface SocsoRules {
  table: TableRef;
  phase?: 1 | 2 | 3;
  wageCeiling: Fact<Rm>;
  nei: { local: Fact<NeiLocal>; foreign: Fact<'none' | 'mandatory'> };
}

interface SocsoYear {
  periods: PeriodList<SocsoRules>;
  /** Act 789 and Act 872. Year-specific figures only. */
  selfEmployed: {
    plans: TableRef;                         // socso-config.json#selfEmployedActs789
    platformDeduction?: Fact<string>;        // 1.25% per job from 2026-03-31
    matching: Fact<object> | null;           // null amounts for 2027; never compute
  };
}
```

### 5.3 EIS

```ts
interface EisRules { table: TableRef; wageCeiling: Fact<Rm>; benefitParamsDefault: string; }

interface EisYear {
  periods: PeriodList<EisRules>;
  /** Explainer only, chosen by job-loss date, never by wage month. */
  benefitParams: { id: string; appliesToJobLoss: { before?: IsoDate; onOrAfter?: IsoDate }; table: TableRef }[];
}
```

### 5.4 PCB and income tax

```ts
interface PcbYear {
  /** Tracked apart: the Act drives annual tax, the spec drives monthly PCB. */
  taxStatus: 'proposed' | 'bill-tabled' | 'enacted';
  specStatus: 'not-published' | 'spec-published';
  brackets: TableRef;                        // tax-ya2026.json#residentBrackets
  table1: TableRef;                          // pcb-spec-2026.json#table1
  table1BSource: 'lhdn' | 'derived';
  deductions: { D: Fact<Rm>; S: Fact<Rm>; Du: Fact<Rm>; Su: Fact<Rm>; Q: Fact<Rm> };
  childUnits: TableRef;
  epfAnnualCap: Fact<Rm>;
  rebates: TableRef;                         // self, spouse, levy, zakat: pooled, s.6A(4)
  nonResidentRate: Fact<number>;
  reliefs: TableRef;                         // tax-ya2026.json#reliefs: caps and TP1 items
  socsoEisRelief: {
    capRm: Fact<Rm>;
    additionalCapRm: Fact<Rm> | null;        // YA2027: 150, proposed
    pooling: Fact<'separate' | 'pooled'> | null;
    skbbkCounts: Fact<boolean> | Pending<boolean>;   // X7
  };
  rounding: TableRef;                        // pcb-spec-2026.json#rounding: pcb.md order (§3.1 of cross-check)
  specialRegimes?: TableRef;                 // scope pending PCB3
  giftDeductions: TableRef;
  terminationPayments: TableRef;             // scope pending PCB6
}
```

### 5.5 Zakat (WP)

```ts
type ZakatMethod = 'TANPA_TOLAKAN' /* Kaedah 1 */ | 'DENGAN_TOLAKAN' /* Kaedah 2 */;

interface ZakatYear {
  nisab: PeriodList<{ amountRm: Fact<Rm>; goldPricePerGramRm: Fact<number> }>;  // one period a year in WP
  rate: Fact<number>;
  deductions: {
    selfRm: Fact<Rm>; perWifeRm: Fact<Rm>; maxWives: Fact<number>;
    perChildUnder18Rm: Fact<Rm>; perChild18PlusStudyingRm: Fact<Rm>;
    selfEducationCapRm: Fact<Rm>;
  };
  zakatPayingOffsetRate: Fact<number>;       // Caruman Berzakat, off the zakat amount
  zakatPayingAgencies: TableRef;
  fitrah: TableRef;                          // not in monthly take-home
  emas: TableRef;                            // advanced only
}
```

## 6. Shared rules (one version, not year-keyed)

```ts
type WageTreatment = 'counted' | 'excluded' | 'pending' | 'unresolved';
type TaxRoute = 'Y1' | 'Yt' | 'Y1IfMonthlyElseYt' | 'exempt' | 'BIK';
type ZakatRoute = 'income' | 'excluded' | 'unresolved';

interface WageComponentRule {
  id: string;
  label: string;
  epf: Fact<WageTreatment>;
  socso: Fact<WageTreatment>;
  eis: Fact<WageTreatment>;
  pcb: TaxRoute;
  zakat: ZakatRoute;
  pendingQuestion?: QuestionId;              // X1 for fixed transport, D4 for bonus inputs
}

type AgeTiming = 'birthdayMonth' | 'monthAfterBirthMonth';

interface SharedRules {
  version: string;
  validFrom: WageMonth;
  /** Merges epf-wage-components.json, socso-config.json#wageRules, eis-2025.json#wageComponents,
   *  pcb-spec-2026.json#remunerationClassification and zakat-wp.json#structuralRules.income.
   *  Table with confidences: cross-check.md §4.1. */
  wageComponents: WageComponentRule[];
  ageBoundaries: {
    epf: { rateSwitchAge: 60; stopAge: 75;
           rateSwitchTiming: Pending<AgeTiming>;   // D3; suggestion: monthAfterBirthMonth (epf.md, medium)
           stopTiming: Pending<AgeTiming> };       // D3; suggestion: monthAfterBirthMonth (low)
    socso: { category2Age: 60; lateEntryAge: 55;
             timing: Pending<AgeTiming> };         // D3; suggestion: birthdayMonth (socso.md, medium)
    eis: { minAge: 18; stopAge: 60; lateEntryAge: 57;
           timing: Pending<AgeTiming> };           // D3; no report picks one (low)
  };
  coverage: CoverageMatrix;                        // §7
  arrears: { epf: 'earnedMonth'; socso: 'earnedMonth'; eis: 'earnedMonth'; pcb: 'paidMonthYt'; zakat: 'yearReceived' };
}
```

## 7. Inputs and user-selectable options

**Shared inputs.** Which `Employment` values appear in v1 is D2. The table of what each value does is `cross-check.md` §3.3.

```ts
type Employment =
  | 'private' | 'domestic'
  | 'gov-contract' | 'gov-permanent-epf' | 'gov-permanent-pre-ptb' | 'gov-pensionable'
  | 'statutory-new-scheme' | 'statutory-other' | 'armed-forces-police'
  | 'self-employed' | 'platform-gig' | 'director-fees-only';

type Residency = 'citizen' | 'pr' | 'mykas-resident' | 'non-citizen';

interface Profile {
  employment: Employment;                 // default 'private'
  residency: Residency;                   // default 'citizen'
  /** D3: which of these the app collects is undecided. */
  birth: { year: number; month: number } | { completedYears: number; asAtEndOfMonth: boolean };

  epfElectionBefore1998?: boolean;        // non-citizen → Parts A and C
  domesticEmployerCloseRelative?: boolean;// SOCSO and EIS 0/0
  foreignEmployerOfForeignDomestic?: boolean;
  noValidPass?: boolean;                  // SOCSO 0/0
  firstSocsoPayableBefore55?: boolean;    // default true; ask if 55 ≤ age < 60. Separate from the next
  firstEisPayableBefore57?: boolean;      // default true; ask if 57 ≤ age < 60
  receivingInvalidityPension?: boolean;   // SOC3 decides whether this shows

  muslim: boolean;
  workplaceState: string;                 // gate for WP zakat: KUL, PJY, LBN. Not home state
  taxResident: boolean;                   // physical presence, not citizenship
  pcbCategory: 1 | 2 | 3;
  disabledSelf?: boolean; disabledSpouse?: boolean;
  childUnits?: number;                    // may be fractional, s.48(4)
}
```

**Mapping from the reports' old values**

| Old value | Report | New |
|---|---|---|
| `private`, `private-employee` | SOCSO, EIS | `private` |
| `domestic`, `domestic-worker`, `domesticWorker` | All | `domestic` |
| `govTempContract`, `public-sector-contract`, `govContract` | SOCSO, EIS, EPF | `gov-contract`. EIS's `public-sector-contract` also covers statutory contract staff: use `statutory-other` for those |
| `govPermanent`, `civil-servant` | SOCSO, EIS | One of the three `gov-permanent…` values |
| `govEpfOption` / `govPensionPrePTB` / `govPensionable` | EPF | `gov-permanent-epf` / `gov-permanent-pre-ptb` / `gov-pensionable` |
| `statutoryLocalAuthority` + `statutoryNewScheme`, `statutory-or-local-authority` | SOCSO, EIS | `statutory-new-scheme` or `statutory-other` |
| `armedForcesPolice`, `armed_forces_ltat` | SOCSO, zakat | `armed-forces-police` |
| `selfEmployed`, `self-employed`, `sole-proprietor-or-partner`, `self_employed` | All | `self-employed`, or `platform-gig` for Act 872 |
| `director-fees-only` | EIS, also SOCSO's `exempt` | `director-fees-only` |
| `citizen`, `pr` | EPF | `Residency` |
| `nonCitizenPre1998` | EPF | `non-citizen` + `epfElectionBefore1998: true` |
| `nonCitizenPost1998Elected`, `foreignWorker` | EPF | `non-citizen`. Before Oct 2025 the election matters (EPF1) |
| `local` / `foreign` | SOCSO | `citizen`, `pr`, `mykas-resident` / `non-citizen`. PR and MyKAS as local is an assumption (I10) |
| `mykas-resident`, `permanent-resident`, `foreign-worker` | EIS | Same in `Residency` |
| `retiree`, `retireeOptOut` | Zakat, EPF | Separate flag, in `EpfOptions` |

**Monthly pay.** D4 decides how much of this a beginner sees.

```ts
interface MonthPay {
  wageMonth: WageMonth;
  basic: Sen;
  allowances: Sen;                  // non-travel, fixed or variable
  overtime: Sen;
  commission: { amount: Sen; paidMonthly: boolean };
  serviceCharge: Sen;
  bonus: { amount: Sen; frequency: 'annual' | 'more-often'; label?: 'bonus' | 'incentive' | 'festive' };
  fixedTransport: Sen;              // X1
  claims: Sen;                      // not wages in any scheme
  benefitsInKind: Sen;              // PCB Y1 only; zakat pending ZAK7
  arrears: { earnedMonth: WageMonth; amount: Sen }[];        // X2 decides whether v1 shows this
  terminationPayment?: { kind: 'compensation' | 'gratuity' | 'leave'; amount: Sen; completedYears: number };  // PCB6
}
```

**Options**

```ts
interface SocsoOptions {
  neiOptedOut: boolean;               // Default false. Shown for local, from 2026-07. Label: "I have a recorded opt-out".
                                      // Ignored for foreign and before 2026-07. June 2026 is always charged.
                                      // Join date doesn't block it: SOC2 pending.
  neiPaidByThisEmployer: boolean;     // Default true. Only with several employers: D7
  augustFilerJulyNei: Pending<'none' | 'charged'>;      // SOC1
  june2026Display: Pending<'legal' | 'payslip'>;        // SOC4
  selfEmployedPlan?: 1 | 2 | 3 | 4;   // X3
}

interface EpfOptions {
  /** There is no reduced-rate election in 2025 or 2026: law, high. */
  topUpEmployee?: { input: 'percent' | 'ringgit'; value: number };   // i-Topup, on top of statutory; EPF5
  topUpEmployer?: { input: 'percent' | 'ringgit'; value: number };
  electedDomestic?: boolean;          // KWSP 16 / 16B; no floor
  retireeOptOut?: boolean;            // Rehired pensioner aged 55+: JPA and KWSP differ
  nonCitizenJanSep2025: Pending<'none' | 'partsBD'>;    // EPF1
  payBasis: { kind: 'monthly' | 'daily' | 'hourly' | 'noBasicPieceOrCommission';
              daysEligible?: number; daysInWagePeriod?: number; daysWorked?: number; hoursWorked?: number };  // EPF2
  smallEmployerFebJul2025?: boolean;  // EPF2
  msmeBelowRm50mFromJun2027?: boolean;
}

interface ZakatOptions {
  pays: boolean;                      // default false; shown only if Muslim and workplace in WP
  method: Pending<ZakatMethod>;       // ZAK1; suggestion 'DENGAN_TOLAKAN' (zakat.md §7)
  channel: Pending<'PZB' | 'DIRECT_WITH_TP1' | 'DIRECT_NO_TP1'>;   // X6; no suggestion
  schedule: Pending<'EVEN_12' | 'REMAINING_MONTHS' | 'BONUS_ON_RECEIPT' | 'YEAR_END_TOPUP'>;  // ZAK6; suggestion EVEN_12
  monthlyRounding: Pending<'sen' | 'ceil-10sen' | 'user-amount'>;  // ZAK2
  actualMonthlyPzbRm?: number;
  wives?: 0 | 1 | 2 | 3 | 4;          // ZAK8 for female payers
  childrenUnder18?: number; children18PlusStudying?: number;       // user's own classification: ZAK9, ZAK10
  parentsSupportAnnualRm?: number; selfEducationAnnualRm?: number;
  retirementSource: 'epf' | 'none' | Pending<'ltat' | 'none'>;     // ZAK14
  zakatPayingContributionsAnnualRm?: number;
  otherIncomeAnnualRm?: number;
  paidOutsidePayrollYtdRm?: number;   // tracking only, never in the assessment
}

interface PcbOptions {
  /** One entry per relief id in tax-yaYYYY.json#reliefs. Caps are applied before LP1. */
  tp1Reliefs: Record<string, {
    annualAmountRm: number;
    declaredToEmployer: boolean | Pending<boolean>;     // PCB2; no suggestion
    spread: 'even' | { month: number };
  }>;
  socsoEisInMonthlyPcb: Pending<boolean>;   // PCB1; suggestion false for monthly, with the annual estimate on
  voluntaryEpfViaTp1Rm?: number;
  simulate: Pending<'januaryOnly' | 'twelveMonths' | 'twelveWhenNeeded'>;  // D5
  overtimeRoute: Pending<'Y1' | 'Y1OrYtToggle'>;  // PCB5; suggestion 'Y1'
  midYearTp3?: object;                      // PCB3
  specialRegime?: 'REP' | 'KW' | 'CSUITE';  // PCB3
  childcareTaskaOver6: Pending<'act' | 'tp1Notes'>;  // PCB4; suggestion 'act'
  gifts?: { approvedCappedRm: number; governmentUncappedRm: number };  // PCB8
}
```

## 8. Year configs

Helpers `law()`, `agency()`, `reading()`, `conflict()`, `proposed()` and so on build a `Fact` with that status.

### 8.1 `config2026`

```ts
const T = {
  epfA:  { id: 'epf-3rd-sched-2025-10-A', file: 'epf-third-schedule-2025-10-partA.json', path: 'rows' },
  epfC:  { id: 'epf-3rd-sched-2025-10-C', file: 'epf-third-schedule-2025-10-partC.json', path: 'rows' },
  epfE:  { id: 'epf-3rd-sched-2025-10-E', file: 'epf-third-schedule-2025-10-partE.json', path: 'rows' },
  socsoOld: { id: 'socso-act4-2024-10', file: 'socso-act4-2025.json', path: 'bands' },
  socsoP1:  { id: 'socso-act4-a1788', file: 'socso-act4-2026.json', path: 'phases[0].bands' },
  eis:   { id: 'eis-act800-sched2-2024-10', file: 'eis-2025.json', path: 'bands' },
};

const ceiling6000 = law(6000, 'high', 'Act A1724 s.2; Act A1725; Circular 3/2024');
const partF: PercentPart = { kind: 'percent', id: 'F', employeeRate: 0.02, employerRate: 0.02,
  rounding: { pending: 'EPF3', options: ['ceilPerShare', 'ceilTotal'], suggestion: 'ceilPerShare', suggestedBy: 'epf.md Q8' },
  alsoStops: 'Two months before an unrenewed work pass expires (s.70G)' };

export const config2026: YearConfig = {
  year: 2026,
  status: 'final',                          // derived; PCB rounding order and others carry their own labels
  sharedRulesVersion: 'v1',

  epf: {
    periods: [{ from: '2026-01', to: '2026-12', rules: {
      parts: { A: { kind: 'banded', id: 'A', table: T.epfA, bonusNote: true },
               C: { kind: 'banded', id: 'C', table: T.epfC, bonusNote: true },
               E: { kind: 'banded', id: 'E', table: T.epfE, bonusNote: false },
               F: partF },
      selection: { id: 'epf-selection-2025-10', file: 'epf-config.json', path: 'years.2025.periods[1].selection' },
      domesticWorkers: 'notMandatoryMayElect',
    }}],
    minimumWageFloor: [{ from: '2026-01', to: '2026-12', rules: {
      monthly: law(1700, 'high', 'P.U.(A) 376/2024; s.43(1A)'),
      hourly: agency(8.72, 'medium', 'Rate is law; hours-based floor from KWSP 2018 FAQ'),
      daily: agency({ 6: 65.38, 5: 78.46, 4: 98.08 }, 'medium', 'As above'),
      pieceRateMonthly: law(1700, 'high', 'P.U.(A) 376/2024'),
    }}],
    above20000: {
      rounding: { pending: 'EPF4', options: ['ceilTotal', 'ceilPerShare'], suggestion: 'ceilTotal', suggestedBy: 'epf.md Q9' },
      split: inferred('employeeCeilEmployerRemainder', 'low', 'Not stated anywhere. Inference'),
    },
    bonusNote: {
      employer: law('13% or 6.5% of actual wages, rounded up', 'high', 'Third Schedule Parts A, C'),
      employee: agency('Table on total wages', 'medium-high', 'Vendors; no official example'),
      commissionTriggers: reading(false, 'medium', 'Note says "bonus"; s.2 lists them apart'),
      above20000: reading('Note has no ceiling', 'low-medium', 'Specific note over closing sentence'),
    },
    topUp: {
      method: { pending: 'EPF5', options: ['tablePlusWholeRinggit', 'combinedRateOnActualWage'], suggestion: 'tablePlusWholeRinggit', suggestedBy: 'epf.md Q10' },
      voluntaryAnnualCap: agency(100000, 'medium', 'Single source for the start date'),
      countsTowardCap: conflict('conflicting', 'low', 'KWSP T&C vs product pages'),
    },
    matching: { id: 'epf-match', file: 'epf-config.json', path: 'matchSchemes' },
    dividend: null,                          // 2026 dividend not declared
  },

  socso: {
    periods: [
      { from: '2026-01', to: '2026-05', rules: { table: T.socsoOld, wageCeiling: ceiling6000,
        nei: { local: law('none', 'high', 'A1788 starts 2026-06-01'), foreign: law('none', 'high', 'Same') } } },
      { from: '2026-06', to: '2026-06', rules: { table: T.socsoP1, phase: 1, wageCeiling: ceiling6000,
        nei: { local: law('mandatory', 'high', 'P.U.(B) 196/2026; FAQ v2.3 Q11, Q12, Q22'),
               foreign: law('mandatory', 'high', 'Same') } } },
      { from: '2026-07', to: '2026-08', rules: { table: T.socsoP1, phase: 1, wageCeiling: ceiling6000,
        nei: { local: agency('default-in-window-open', 'high', 'Cabinet 8 Jul; PERKESO release 10 Jul; FAQ v2.3. No gazetted instrument found [AGC listing, partly]'),
               foreign: agency('mandatory', 'high', 'KESUMA 9 Jul; FAQ v2.3 Q18-19') } },
        keyDates: { voluntaryDecision: '2026-07-08', optOutOpens: '2026-07-13', optOutCloses: '2026-08-31' } },
      { from: '2026-09', to: '2026-12', rules: { table: T.socsoP1, phase: 1, wageCeiling: ceiling6000,
        nei: { local: agency('default-in-window-closed', 'high', 'FAQ v2.3 Q25-26'),
               foreign: agency('mandatory', 'high', 'Same') } },
        keyDates: { optBackInOpens: '2026-09-02' } },
    ],
    selfEmployed: {
      plans: { id: 'act789-plans', file: 'socso-config.json', path: 'selfEmployedActs789' },
      platformDeduction: law('1.25% of each completed job', 'high', 'P.U.(A) 143/2026, from 2026-03-31'),
      matching: agency({ padanan70: true, padanan50: true }, 'high', 'FAQ Bil. 1/2026'),
    },
  },

  eis: {
    periods: [
      { from: '2026-01', to: '2026-09', rules: { table: T.eis, wageCeiling: ceiling6000, benefitParamsDefault: 'eis-benefits-2018' } },
      { from: '2026-10', to: '2026-12', rules: { table: T.eis, wageCeiling: ceiling6000, benefitParamsDefault: 'eis-benefits-2026-10' },
        keyDates: { actRenamedAndBenefitsChange: '2026-10-01' } },   // no contribution change
    ],
    benefitParams: [
      { id: 'eis-benefits-2018', appliesToJobLoss: { before: '2026-10-01' }, table: { id: 'eis-b18', file: 'eis-2025.json', path: 'benefitParams.eis-benefits-2018' } },
      { id: 'eis-benefits-2026-10', appliesToJobLoss: { onOrAfter: '2026-10-01' }, table: { id: 'eis-b26', file: 'eis-2025.json', path: 'benefitParams.eis-benefits-2026-10' } },
    ],
  },

  pcb: {
    taxStatus: 'enacted', specStatus: 'spec-published',
    brackets: { id: 'tax-2026', file: 'tax-ya2026.json', path: 'residentBrackets' },
    table1: { id: 'pcb-2026-t1', file: 'pcb-spec-2026.json', path: 'table1' },
    table1BSource: 'lhdn',
    deductions: {
      D: law(9000, 'high', 'Spec 2026; ITA s.46(1)(a)'), S: law(4000, 'high', 'Spec 2026'),
      Du: law(7000, 'high', 'Spec 2026'), Su: law(6000, 'high', 'Spec 2026; Category 2 only'),
      Q: law(2000, 'high', 'Spec 2026'),
    },
    childUnits: { id: 'pcb-2026-c', file: 'pcb-spec-2026.json', path: 'childUnits' },
    epfAnnualCap: law(4000, 'high', 's.49(1)(b)'),
    rebates: { id: 'tax-2026-r', file: 'tax-ya2026.json', path: 'rebates' },
    nonResidentRate: law(0.30, 'high', 'ITA Sch.1 para 1A; spec §D(a)'),
    reliefs: { id: 'tax-2026-rel', file: 'tax-ya2026.json', path: 'reliefs' },
    socsoEisRelief: {
      capRm: law(350, 'high', 's.46(1)(n)'), additionalCapRm: null, pooling: null,
      skbbkCounts: { pending: 'X7', options: [true, false], suggestion: true, suggestedBy: 'socso.md Q13. pcb.md gives no default' },
    },
    rounding: { id: 'pcb-2026-round', file: 'pcb-spec-2026.json', path: 'rounding' },
    specialRegimes: { id: 'pcb-2026-15', file: 'pcb-spec-2026.json', path: 'formula.specialRegimes15pct' },
    giftDeductions: { id: 'tax-2026-g', file: 'tax-ya2026.json', path: 'giftDeductions' },
    terminationPayments: { id: 'tax-2026-t', file: 'tax-ya2026.json', path: 'terminationPayments' },
  },

  zakat: {
    nisab: [{ from: '2026-01', to: '2026-12', rules: {
      amountRm: agency(33996, 'high', 'PPZ archive page and API; published Feb 2026'),
      goldPricePerGramRm: agency(399.95, 'high', 'Same'),
    }}],
    rate: agency(0.025, 'high', 'PPZ calculator; fatwa'),
    deductions: {
      selfRm: agency(12000, 'high', 'Pendapatan.vue setValues'), perWifeRm: agency(5000, 'high', 'Same'),
      maxWives: agency(4, 'high', 'Same'), perChildUnder18Rm: agency(2000, 'high', 'Same'),
      perChild18PlusStudyingRm: agency(5000, 'high', 'Same'), selfEducationCapRm: agency(2000, 'high', 'Same'),
    },
    zakatPayingOffsetRate: agency(0.025, 'high', 'Pendapatan.vue'),
    zakatPayingAgencies: { id: 'zak-agencies', file: 'zakat-wp.json', path: 'zakatPayingAgencies' },
    fitrah: { id: 'zak-fitrah-2026', file: 'zakat-wp.json', path: 'years.2026.fitrah' },
    emas: { id: 'zak-emas-2026', file: 'zakat-wp.json', path: 'years.2026.emas' },
  },
};
```

### 8.2 `config2025`: only what differs from 2026

```ts
export const config2025: YearConfig = {
  ...config2026, year: 2025,
  epf: { ...config2026.epf,
    periods: [
      { from: '2025-01', to: '2025-09', rules: {
        parts: { A: partA, C: partC, E: partE,
                 B: { kind: 'flatEmployer', id: 'B', table: { id: 'epf-2022-07-B', file: 'epf-third-schedule-2022-07-partB.json', path: 'rows' } },
                 D: { kind: 'flatEmployer', id: 'D', table: { id: 'epf-2022-07-D', file: 'epf-third-schedule-2022-07-partD.json', path: 'rows' } } },
        selection: { id: 'epf-selection-2025-01', file: 'epf-config.json', path: 'years.2025.periods[0].selection' },
        domesticWorkers: 'notMandatoryMayElect' } },
      { from: '2025-10', to: '2025-12', rules: { parts: { A: partA, C: partC, E: partE, F: partF },   // Act A1760
        selection: { id: 'epf-selection-2025-10', file: 'epf-config.json', path: 'years.2025.periods[1].selection' },
        domesticWorkers: 'notMandatoryMayElect' } },
    ],
    minimumWageFloor: [
      { from: '2025-01', to: '2025-01', rules: { monthly: law(1500, 'high', 'P.U.(A) 140/2022'), /* hourly 7.21 etc. */ } },
      { from: '2025-02', to: '2025-07', rules: { monthly: law(1700, 'high', 'P.U.(A) 376/2024 para 3'),
        smallEmployer: { monthly: reading(1500, 'medium-high', 'Para 4; no KWSP statement on the EPF floor'), appliesWhen: 'Fewer than 5, not MASCO professional' } } },
      { from: '2025-08', to: '2025-12', rules: { monthly: law(1700, 'high', 'P.U.(A) 376/2024') } },
    ],
    dividend: agency({ conventional: 6.15, syariah: 6.15 }, 'medium-high', 'First-pass; not verified in the deep pass'),
  },
  socso: { periods: [{ from: '2025-01', to: '2025-12', rules: { table: T.socsoOld, wageCeiling: ceiling6000,
    nei: { local: law('none', 'high', 'Not in force'), foreign: law('none', 'high', 'Not in force') } } }],
    selfEmployed: { plans: config2026.socso.selfEmployed.plans,
      matching: agency({ spsPadananCaruman3: true }, 'high', 'FAQ Bil. 1/2025') } },
  eis: { periods: [{ from: '2025-01', to: '2025-12', rules: { table: T.eis, wageCeiling: ceiling6000, benefitParamsDefault: 'eis-benefits-2018' } }],
    benefitParams: config2026.eis.benefitParams.slice(0, 1) },
  pcb: { ...config2026.pcb,
    brackets: { id: 'tax-2025', file: 'tax-ya2025.json', path: 'residentBrackets' },
    table1: { id: 'pcb-2025-t1', file: 'pcb-spec-2025.json', path: 'table1' },
    reliefs: { id: 'tax-2025-rel', file: 'tax-ya2025.json', path: 'reliefs' },
    rebates: { id: 'tax-2025-r', file: 'tax-ya2025.json', path: 'rebates' },
    socsoEisRelief: { capRm: law(350, 'high', 's.46(1)(n)'), additionalCapRm: null, pooling: null,
                      skbbkCounts: law(false, 'high', 'SKBBK did not exist') },
    /* childUnits, rounding, gifts, termination: same in the 2025 spec files */ },
  zakat: { ...config2026.zakat,
    nisab: [{ from: '2025-01', to: '2025-12', rules: {
      amountRm: agency(29740, 'high', 'PPZ archive page; Wayback'), goldPricePerGramRm: agency(349.88, 'high', 'Same') } }],
    fitrah: { id: 'zak-fitrah-2025', file: 'zakat-wp.json', path: 'years.2025.fitrah' },
    emas: { id: 'zak-emas-2025', file: 'zakat-wp.json', path: 'years.2025.emas' } },
};
```

### 8.3 Blank 2027 template

**Every `FILL` must be replaced with a sourced value before the year stops being a template.** Nothing is carried over silently. The `candidate` comment is what exists today. It isn't a value to use without the status shown. How a template year displays is D6.

```ts
const FILL = null;   // the validator in §10 rejects a non-template year containing this

export const config2027Template: YearConfig = {
  year: 2027,
  status: 'template',
  sharedRulesVersion: 'v1',                 // FILL if any Act amends a wage definition or age limit

  epf: {
    periods: [
      { from: '2027-01', to: FILL,          // FILL: candidate to 2027-05, if the RM2,000 Order starts in June
        rules: { parts: FILL,               // candidate: A, C, E, F as 2026. Status 'carried-forward'
                 selection: FILL, domesticWorkers: FILL } },
      // FILL: a second period, only if a new Third Schedule or rate takes effect mid-year
    ],
    minimumWageFloor: [
      { from: '2027-01', to: FILL, rules: { monthly: FILL, hourly: FILL, daily: FILL, pieceRateMonthly: FILL } },
                                            // candidate: 1,700, 'carried-forward'
      { from: FILL, to: null, rules: { monthly: FILL, hourly: FILL, daily: FILL, pieceRateMonthly: FILL,
                                       exemptMsme: FILL } },
                                            // candidate: 2,000 from 2027-06, 'announced', not gazetted.
                                            // Never ship the derived RM10.26/hour
    ],
    above20000: { rounding: FILL, split: FILL },   // pending EPF4 unless KWSP answers
    bonusNote: FILL,                        // candidate: as 2026
    topUp: FILL,                            // candidate: as 2026, pending EPF5
    matching: FILL,                         // annex says RM600/RM6,000 for all; speech and KWSP differ. Unconfirmed
    dividend: FILL,                         // declared about Feb to Mar 2028
  },

  socso: {
    periods: [
      { from: '2027-01', to: FILL,          // FILL if the year-end review or an Act 4 Bill changes anything
        rules: { table: FILL,               // candidate: socso-act4-a1788 phase 1. Phase date is law to 2028-05-31
                 phase: 1,
                 wageCeiling: FILL,         // candidate: 6,000, 'carried-forward'; only an amending Act moves it
                 nei: { local: FILL,        // candidate: default-in-window-closed. Legal basis open
                        foreign: FILL } } },// candidate: mandatory
    ],
    selfEmployed: {
      plans: FILL,                          // candidate: same 4 plans, 'carried-forward'
      platformDeduction: FILL,              // candidate: 1.25% per job
      matching: FILL,                       // 70% / 35% / 50% announced. RM amounts unpublished: keep null
    },
  },

  eis: {
    periods: [
      { from: '2027-01', to: FILL,          // eis-2025.json has open-ended to: null
        rules: { table: FILL,               // candidate: eis-act800-sched2-2024-10, 'carried-forward'
                 wageCeiling: FILL, benefitParamsDefault: FILL } },
    ],
    benefitParams: FILL,                    // candidate: as 2026. 2 Jan 2027 vacancy duty has no payroll effect
  },

  pcb: {
    taxStatus: 'proposed',                  // FILL: 'bill-tabled', then 'enacted'
    specStatus: 'not-published',            // FILL: 'spec-published'
    brackets: FILL,                         // candidate: tax-ya2027-proposed.json#residentBrackets, 'proposed'
    table1: FILL,                           // candidate: pcb-spec-2027-template.json#table1. B values derived by us
    table1BSource: 'derived',               // FILL: 'lhdn' from the spec
    deductions: { D: FILL,                  // candidate: 12,000, 'proposed', Lampiran 2
                  S: FILL, Du: FILL, Su: FILL, Q: FILL },  // candidates: as 2026, 'carried-forward'
    childUnits: FILL, epfAnnualCap: FILL, rebates: FILL, nonResidentRate: FILL,   // candidates: as 2026, 'carried-forward'
    reliefs: FILL,                          // candidate: tax-ya2027-proposed.json#reliefs. Map by relief id: TP1 2027 not out
    socsoEisRelief: {
      capRm: FILL,                          // candidate: 350, 'proposed', scope adds mandatory Kendiri
      additionalCapRm: FILL,                // candidate: 150, 'proposed'
      pooling: FILL,                        // candidate: 'separate', 'proposed'. Only the Finance Bill text settles it
      skbbkCounts: FILL,                    // X7 for YA2026 does not decide this; depends on the Act
    },
    rounding: FILL, specialRegimes: FILL, giftDeductions: FILL, terminationPayments: FILL,  // candidates: as 2026, 'carried-forward'
  },

  zakat: {
    nisab: [{ from: '2027-01', to: '2027-12', rules: {
      amountRm: unpublished(),              // FILL. NEVER copy 33,996: the API's 2027 row is a placeholder. D6
      goldPricePerGramRm: unpublished(),    // FILL
    }}],
    rate: FILL,                             // candidate: 0.025, structural
    deductions: { selfRm: FILL, perWifeRm: FILL, maxWives: FILL, perChildUnder18Rm: FILL,
                  perChild18PlusStudyingRm: FILL, selfEducationCapRm: FILL },
                                            // re-check setValues() in the calculator before filling. zakat-wp.json has null
    zakatPayingOffsetRate: FILL, zakatPayingAgencies: FILL,   // list is stored per year
    fitrah: FILL,                           // 1448H not announced; check e-Fatwa around Dec 2026 to Feb 2027
    emas: FILL,
  },
};
```

**Where each 2027 value comes from**

| Field | Source to wait for | Expected | Today's state |
|---|---|---|---|
| EPF parts, rates | KWSP Third Schedule page | Any time; no change announced | Copy of 2026, `carried-forward` |
| Floor RM2,000, day in June, exemption | Minimum Wages Order in the Gazette; MOHR | Before Jun 2027 | `announced` |
| SOCSO table, ceiling | Act 4 Bill list; P.U.(B) 196/2026 fixes Phase 1 to 31 May 2028 | Check Jan 2027 | Phase is `law`; ceiling `carried-forward` |
| SKBBK participation | PERKESO/KESUMA year-end review | Around Jan 2027 | `carried-forward`; no gazetted basis found [AGC listing, partly] |
| Act 789 matching | PERKESO FAQ | Unknown | Rates `announced`; RM amounts `unpublished` |
| EIS table | s.18(3) order; s.83 or s.84 order; retirement-age change | Check Q1 2027 | `carried-forward` |
| Tax rates, D, reliefs | Finance Bill, then Act | From about 18 Nov 2026 (inferred) | `proposed` |
| Table 1, TP1 | LHDN 2027 spec | Dec 2026 to Jan 2027 (inferred) | B values `derived` |
| RM150, pooling | Finance Bill text | As above | `proposed`; Reading A assumed |
| Nisab, fitrah, deductions | PPZ archive page, `setValues()`, e-Fatwa | About Feb 2027 | `unpublished` (`null`) |

## 9. Field status

Same in 2025 and 2026 unless shown. `P` = pending owner question.

**EPF**

| Field | Value | Status | Confidence | 2027 |
|---|---|---|---|---|
| Parts A, C, E tables | `epf-third-schedule-2025-10-part*.json` | law | high | carried-forward |
| Parts B, D tables (to 2025-09) | `epf-third-schedule-2022-07-part*.json` | law | high | n/a |
| Part F rates, start, no age split | 2% + 2% from 2025-10 wages | law | high | carried-forward; rate under public discussion |
| Part F rounding | Per share (`P` EPF3) | conflict | KWSP publishes both | — |
| Floor, full month | 1,500 / 1,700 | law | high | 2,000 `announced`, low |
| Floor, small employer Feb–Jul 2025 | 1,500 | reading | medium-high | n/a |
| Floor, hourly, daily, part-month arithmetic | Rates are law; method from 2018 FAQ | agency | medium | hourly and daily unset |
| Above RM20,000, rates | | law | high | carried-forward |
| Above RM20,000, total rounded (`P` EPF4) | | agency | medium | — |
| Above RM20,000, split | Employee ceil, employer remainder | inferred | low | — |
| Bonus note, employer | 13% on actual wages | law | high | carried-forward |
| Bonus note, employee | Table | agency | medium-high | carried-forward |
| Commission doesn't trigger | | reading | medium | — |
| Note above RM20,000 | No ceiling | reading | low-medium | — |
| Switch at 60; stop at 75, as ages | | law | high | carried-forward |
| Switch month 60 / 75 (`P` D3) | Month after | agency (client code) | medium / low | — |
| i-Topup method (`P` EPF5) | | conflict | — | — |
| Voluntary cap | RM100,000 | agency | medium | carried-forward |
| Fixed transport (`P` X1) | | conflict | unsettled | — |
| Government by status | | reading | medium-high to high, per row | interim contracts end around Jan 2027 |

**SOCSO, SKBBK**

| Field | Value | Status | Confidence | 2027 |
|---|---|---|---|---|
| Table to 2026-05 | `socso-act4-2025.json` | law | high | n/a |
| Table from 2026-06 | `socso-act4-2026.json` phase 1 | law | high | Phase is law to 2028-05-31 |
| English A1788 text | Malay text parsed; English authoritative, not retrieved | — | high on amounts | — |
| Ceiling RM6,000 | | law | high | carried-forward, medium-high |
| Phase dates | P.U.(B) 196/2026 | gazetted-future | high | law |
| SKBBK June 2026 mandatory | | law | high | n/a |
| Voluntary for locals from July | Cabinet, PERKESO | agency | high as fact; no instrument found, medium-high [AGC listing, partly] | carried-forward |
| PR and MyKAS may opt out | Assumed | inferred | medium-low (I10) | — |
| Opt-out effect: July filer | | agency | medium-high | n/a |
| Opt-out effect: August filer's July (`P` SOC1) | | inferred | open | n/a |
| New hire opt-out (`P` SOC2) | | conflict | medium | — |
| Category 2 at 60 and at 55 as rules | | law | high | carried-forward |
| Switch month (`P` D3) | Birthday month | reading | medium (55: medium-low) | — |
| Invalidity pensioner limb (`P` SOC3) | | reading | medium | — |
| Foreign age-55 test | | agency | medium | — |
| Wage definition | s.2(24) | law | high | carried-forward |
| Wage items below PERKESO's list | | reading | per row | — |
| Arrears to the month earned | | reading | medium-high | — |
| Coverage: government, statutory | P.U.(B) 240, 239/2013 | law | high (no-revocation check [AGC listing]) | watch item |
| Directors, interns, overseas (`P` X4, X5) | | inferred | medium, students low [AGC listing, title check] | — |
| Act 789 plans | | agency | high | carried-forward, medium |
| Act 872 deduction | | law | high on rule | carried-forward |

**EIS**

| Field | Value | Status | Confidence | 2027 |
|---|---|---|---|---|
| Table, RM6,000 ceiling, RM11.90 | `eis-2025.json` | law | high | carried-forward |
| No later order | | law, checked by title | high [AGC listing] | watch |
| Ages 18, 57, 60 as rules | First Sched. paras 8, 9 | law | high | carried-forward |
| Switch month (`P` D3) | Unconfirmed | — | low | — |
| Coverage: Act's list | First Sched. | law | high | carried-forward |
| Armed forces, police | Para 6 assumed | inferred | not stated in `eis.md` | — |
| Directors, posted staff, universities (`P` X5) | | inferred | low to medium | — |
| Wage definition | s.3 | law | high | carried-forward |
| PERKESO's item list | Via Circular 3/2017 | agency | high | carried-forward |
| Fixed travel (`P` X1) | | conflict | medium | — |
| Arrears to the month earned | | reading | medium-high | — |
| Benefit params | By job-loss date | law, agency | high; boundary at 100 km unsettled | carried-forward |

**PCB**

| Field | Value | Status | Confidence | 2027 |
|---|---|---|---|---|
| Brackets | `tax-ya2025.json`, `tax-ya2026.json` | law | high | proposed |
| Table 1 | `pcb-spec-*.json` | law | high | B derived, low to medium |
| Formula | Spec §D | agency | high | assumed unchanged |
| D, S, Du, Su, Q | | law | high | D 12,000 proposed; rest carried-forward |
| Truncate, 5-sen up, RM10 thresholds | Spec §E | agency | high | carried-forward |
| RM10 before rounding; one round-up; unrounded Step 1[E]; floor(P) row | Calculator, 2024 page | agency, by proxy | medium-high | low-medium |
| Unfloored net in a bonus month; Z full | Spec §E.5 | agency | high | carried-forward |
| Pooled rebate cap | s.6A(4) | law | high | carried-forward |
| Relief caps | `tax-ya*.json` | law | high | proposed or carried-forward, per row |
| SOCSO + EIS RM350 | s.46(1)(n) | law | high | proposed scope |
| SKBBK in RM350 (`P` X7) | | reading | medium to medium-high (I16) | — |
| RM150, RM500, pooling | | proposed | medium | — |
| Relief in monthly PCB (`P` PCB1) | Optional | law on optionality | medium on practice | — |
| Overtime in Y1 (`P` PCB5) | | agency | high; one-off medium-high | — |
| Termination exemption, taxable excess in Yt (`P` PCB6) | | law, reading | medium-high | carried-forward |
| Non-resident 30%; no zakat offset | | law | high | carried-forward |
| Kt for arrears | Not defined (I8) | — | — | — |

**Zakat**

| Field | Value | Status | Confidence | 2027 |
|---|---|---|---|---|
| Nisab | 29,740; 33,996 | agency | high | unpublished |
| 2.5%, two methods, `>=` test | Calculator code | agency | high | structural, re-check |
| Deductions | 12,000, 5,000, 2,000, 5,000, 2,000 | agency | high | `null` until re-checked |
| Offset for zakat-paying bodies | | agency | high | list per year |
| Workplace jurisdiction | P.U.(B) 316/2021 | law | high | carried-forward |
| Rebate, s.6A | | law | high | re-check at Finance Bill |
| Actual Gregorian year, no pro-rating (`P` ZAK5) | | inferred | medium | — |
| Bonus with income | Old PPZ FAQ | agency | medium | — |
| PZB rounding (`P` ZAK2) | No rule | — | high that none exists | — |
| Child age, IPT, shared child (`P` ZAK9, ZAK10) | Not published | — | — | — |
| Benefits in kind (`P` ZAK7) | | inferred | low | — |
| Fitrah | 2025 gazette; 2026 RTM and calculator | law; agency | high; medium-high | unpublished |

## 10. Validator rules

Run these in CI over every year file:

1. Periods within a section are contiguous, don't overlap, and cover all 12 months, except an open template period.
2. Every `TableRef` resolves: the file exists and the path gives a non-empty array or object. SOCSO and EIS tables have 65 bands.
3. A year's `status` is derived. It can't be `final` if any `Fact` is `proposed`, `announced`, `carried-forward` or `unpublished`, or if any value is `FILL`.
4. `status: 'unpublished'` requires `value: null`. Any other status requires a value and a non-empty `basis`.
5. Every `Pending.pending` exists in `owner-questions.md`, and `suggestion`, if present, is one of `options`.
6. A `Fact` with `agcListing: true` can't be promoted past its label until D1 is recorded.
7. NEI columns are read only from periods with `nei` not `none`. Tables before 2026-06 have no NEI column.
8. No `Fact` for `zakat.nisab` in a year can equal the prior year's value unless its `basis` names a published source for that year.

## 11. Not covered

- The EPF `Fact`s for 2025 `hourly` and `daily` are abbreviated above; the values are in `epf-config.json#minimumWageFloor`.
- The `CoverageMatrix` type in §6 is the table in `cross-check.md` §3.3. It isn't spelled out twice here.
- Other states' zakat isn't in scope. `zakat.md` §5 notes a new policy decision is needed if a state with several nisab periods is added.
- Concurrent employers (D7) would turn one `MonthPay` into one per employer. EPF and PCB rules for that aren't researched (I13).

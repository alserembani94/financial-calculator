// Reference implementation of the v1 calculator, ported from docs/research/data/v1-baseline.py.
// It exists so the tests run before the app is built. See tests/README.md.

import {
	CONFIG,
	EIS_BANDS,
	EPF_PART_A,
	EPF_PART_E,
	type SocsoBand,
	type Year,
} from "./data";
import { ceilToRinggit, divHalfUp, type Sen } from "./money";

export type MaritalStatus =
	| "single"
	| "married-spouse-not-working"
	| "married-spouse-working"
	| "divorced-or-widowed";

export const CATEGORY: Record<MaritalStatus, 1 | 2 | 3> = {
	single: 1,
	"married-spouse-not-working": 2,
	"married-spouse-working": 3,
	"divorced-or-widowed": 3,
};

export interface Contribution {
	employee: Sen;
	employer: Sen;
}

export interface BreakdownInput {
	salary: Sen;
	age: number;
	year: Year;
	status?: MaritalStatus;
	/** Children under 18. Ignored for "single". */
	children?: number;
	/** Opted out of LINDUNG 24 Jam (SKBBK). Has no effect in 2025. */
	skbbkOptedOut?: boolean;
	/** Adds the zakat section (information only, never deducted). */
	zakat?: { wifeDeduction?: boolean };
}

export interface ZakatInfo {
	annual: Sen;
	monthly: Sen;
	/** Take-home less the monthly zakat, for someone paying it themselves. */
	leftAfterZakat: Sen;
	/** Claimed back as a tax rebate when e-filing. */
	rebateAtFiling: Sen;
	/** Zakat above the year's tax: not refunded. */
	notRecoverable: Sen;
}

export interface Breakdown {
	epf: Contribution;
	socso: Contribution;
	eis: Contribution;
	annualTax: Sen;
	pcb: Sen;
	takeHome: Sen;
	employerCost: Sen;
	intoEpf: Sen;
	zakat?: ZakatInfo;
}

const RM10: Sen = 1000;
const RM20000: Sen = 2_000_000;

/** EPF: Third Schedule lookup on max(salary, wage floor); formula above RM20,000. */
export function epf(salary: Sen, age: number, year: Year = 2026): Contribution {
	if (salary <= RM10 || age >= 75) return { employee: 0, employer: 0 };
	const base = Math.max(salary, CONFIG[year].epfWageFloor);
	const under60 = age < 60;
	if (base <= RM20000) {
		const table = under60 ? EPF_PART_A : EPF_PART_E;
		const row = table.find((r) => r.from <= base && base <= r.to);
		if (!row) throw new Error(`No EPF row for ${base} sen`);
		return { employee: row.employee, employer: row.employer };
	}
	// Above RM20,000: the total is rounded up, and the employee/employer split is provisional (EPF4).
	const [eeBp, erBp] = under60 ? [1100, 1200] : [0, 400];
	const total = ceilToRinggit(base, eeBp + erBp);
	const employee = ceilToRinggit(base, eeBp);
	return { employee, employer: total - employee };
}

function band<T extends { above: Sen; upTo: Sen | null }>(
	bands: T[],
	wage: Sen,
): T | undefined {
	return bands.find(
		(b) => b.above < wage && (b.upTo === null || wage <= b.upTo),
	);
}

/** SOCSO: table lookup. Category 2 from 60. 2026 on adds SKBBK unless opted out. */
export function socso(
	salary: Sen,
	age: number,
	year: Year,
	optedOut = false,
): Contribution {
	const cfg = CONFIG[year];
	const b: SocsoBand | undefined = band(cfg.socso, salary);
	if (!b) return { employee: 0, employer: 0 };
	const cat = age >= 60 ? b.second : b.first;
	const employeeRm = cfg.hasSkbbk
		? cat[optedOut ? "employeeWithoutNEI" : "employeeWithNEI"]
		: (cat.employee ?? cat.employeeInvalidity ?? 0);
	return {
		employee: Math.round(employeeRm * 100),
		employer: Math.round(cat.employer * 100),
	};
}

/** EIS: table lookup, ages 18 to 59. */
export function eis(salary: Sen, age: number): Contribution {
	if (age < 18 || age >= 60) return { employee: 0, employer: 0 };
	const b = band(EIS_BANDS, salary);
	if (!b) return { employee: 0, employer: 0 };
	return { employee: b.employee, employer: b.employer };
}

export interface TaxInput {
	salary: Sen;
	employeeEpf: Sen;
	year: Year;
	status?: MaritalStatus;
	children?: number;
	/** Extra relief in sen, e.g. the RM350 SOCSO + EIS relief (left out of v1, V3). */
	extraRelief?: Sen;
}

export function reliefs({
	employeeEpf,
	year,
	status = "single",
	children = 0,
	extraRelief = 0,
}: TaxInput): Sen {
	const cfg = CONFIG[year];
	const cat = CATEGORY[status];
	const kids = cat === 1 ? 0 : children;
	return (
		Math.min(employeeEpf * 12, cfg.epfRelief) +
		cfg.selfRelief +
		(cat === 2 ? cfg.spouseRelief : 0) +
		cfg.childRelief * kids +
		extraRelief
	);
}

/** Annual tax for a resident: (P - M) x R + B, row chosen on the whole-ringgit part of P. */
export function annualTax(input: TaxInput): Sen {
	const { salary, year, status = "single" } = input;
	const P = salary * 12 - reliefs(input);
	const whole = Math.trunc(P / 100) * 100;
	let row: (typeof CONFIG)[Year]["taxTable"][number] | undefined;
	for (const r of CONFIG[year].taxTable) if (whole > r.M) row = r;
	if (!row) return 0;
	const onTop = Math.floor(((P - row.M) * row.rateBp) / 10000);
	return Math.max(0, onTop + row.B[CATEGORY[status]]);
}

export function zakatAnnual(
	salary: Sen,
	employeeEpf: Sen,
	year: Year,
	children = 0,
	wifeDeduction = false,
): Sen {
	const cfg = CONFIG[year];
	const base =
		salary * 12 -
		cfg.zakatSelf -
		employeeEpf * 12 -
		cfg.zakatChild * children -
		(wifeDeduction ? cfg.zakatWife : 0);
	return base >= cfg.zakatNisab ? divHalfUp(base, 40) : 0; // 2.5% = 1/40
}

export function breakdown(input: BreakdownInput): Breakdown {
	const {
		salary,
		age,
		year,
		status = "single",
		children = 0,
		skbbkOptedOut = false,
	} = input;
	const e = epf(salary, age, year);
	const s = socso(salary, age, year, skbbkOptedOut);
	const i = eis(salary, age);
	const tax = annualTax({
		salary,
		employeeEpf: e.employee,
		year,
		status,
		children,
	});
	const pcb = divHalfUp(tax, 12);
	const takeHome = salary - e.employee - s.employee - i.employee - pcb;
	const result: Breakdown = {
		epf: e,
		socso: s,
		eis: i,
		annualTax: tax,
		pcb,
		takeHome,
		employerCost: salary + e.employer + s.employer + i.employer,
		intoEpf: e.employee + e.employer,
	};
	if (input.zakat) {
		const kids = CATEGORY[status] === 1 ? 0 : children;
		const annual = zakatAnnual(
			salary,
			e.employee,
			year,
			kids,
			input.zakat.wifeDeduction ?? false,
		);
		const monthly = divHalfUp(annual, 12);
		const rebate = Math.min(annual, tax);
		result.zakat = {
			annual,
			monthly,
			leftAfterZakat: takeHome - monthly,
			rebateAtFiling: rebate,
			notRecoverable: annual - rebate,
		};
	}
	return result;
}

export const referenceCalculator = {
	epf,
	socso,
	eis,
	reliefs,
	annualTax,
	zakatAnnual,
	breakdown,
};

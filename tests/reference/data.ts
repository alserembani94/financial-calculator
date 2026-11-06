// Loads the research data files (docs/research/data) and shapes them into per-year config.
// The data files are the source; nothing here restates a table.

import eisFile from "../../docs/research/data/eis-2025.json";
import partAFile from "../../docs/research/data/epf-third-schedule-2025-10-partA.json";
import partEFile from "../../docs/research/data/epf-third-schedule-2025-10-partE.json";
import pcb2025File from "../../docs/research/data/pcb-spec-2025.json";
import pcb2026File from "../../docs/research/data/pcb-spec-2026.json";
import socso2025File from "../../docs/research/data/socso-act4-2025.json";
import socso2026File from "../../docs/research/data/socso-act4-2026.json";
import tax2025File from "../../docs/research/data/tax-ya2025.json";
import tax2026File from "../../docs/research/data/tax-ya2026.json";
import zakatFile from "../../docs/research/data/zakat-wp.json";
import { rm, type Sen } from "./money";

export type Year = 2025 | 2026 | 2027;
export const YEARS: Year[] = [2025, 2026, 2027];

/** One EPF Third Schedule row, in sen: [from, to, employer, employee]. */
export interface EpfRow {
	from: Sen;
	to: Sen;
	employer: Sen;
	employee: Sen;
}

function epfRows(rows: (number | null)[][]): EpfRow[] {
	return rows.map(([from, to, employer, employee]) => ({
		from: rm(from ?? 0),
		to: rm(to ?? 0),
		employer: rm(employer ?? 0),
		employee: rm(employee ?? 0),
	}));
}

export const EPF_PART_A = epfRows(partAFile.rows as (number | null)[][]);
export const EPF_PART_E = epfRows(partEFile.rows as (number | null)[][]);

export interface SocsoBand {
	above: Sen;
	upTo: Sen | null;
	assumedWage: Sen;
	first: Record<string, number>;
	second: Record<string, number>;
}

interface RawSocsoBand {
	wageAbove: number | null;
	wageUpTo: number | null;
	assumedMonthlyWage: number;
	firstCategory: Record<string, number>;
	secondCategory: Record<string, number>;
}

function socsoBands(bands: RawSocsoBand[]): SocsoBand[] {
	return bands.map((b) => ({
		above: rm(b.wageAbove ?? 0),
		upTo: b.wageUpTo === null ? null : rm(b.wageUpTo),
		assumedWage: rm(b.assumedMonthlyWage),
		first: b.firstCategory,
		second: b.secondCategory,
	}));
}

export const SOCSO_2025 = socsoBands(socso2025File.bands as RawSocsoBand[]);
// 2026 Phase 1 of LINDUNG 24 Jam (SKBBK). Under N1 it applies to all of 2026.
export const SOCSO_2026 = socsoBands(
	socso2026File.phases[0].bands as RawSocsoBand[],
);

export interface EisBand {
	above: Sen;
	upTo: Sen | null;
	assumedWage: Sen;
	employee: Sen;
	employer: Sen;
}

export const EIS_BANDS: EisBand[] = eisFile.bands.map((b) => ({
	above: rm(b.wageExceedsRm),
	upTo: b.wageNotExceedsRm === null ? null : rm(b.wageNotExceedsRm),
	assumedWage: rm(b.assumedMonthlyWageRm),
	employee: b.employeeSen,
	employer: b.employerSen,
}));

export interface TaxRow {
	M: Sen;
	rateBp: number;
	B: { 1: Sen; 2: Sen; 3: Sen };
}

interface RawTaxRow {
	M: number;
	R: number;
	B: { category1: number; category2: number; category3: number };
}

function taxRows(rows: RawTaxRow[]): TaxRow[] {
	return rows.map((r) => ({
		M: rm(r.M),
		rateBp: Math.round(r.R * 10000),
		B: { 1: rm(r.B.category1), 2: rm(r.B.category2), 3: rm(r.B.category3) },
	}));
}

export const PCB_TABLE_1 = {
	2025: taxRows(pcb2025File.table1 as RawTaxRow[]),
	2026: taxRows(pcb2026File.table1 as RawTaxRow[]),
};

export interface Bracket {
	from: Sen;
	to: Sen | null;
	rateBp: number;
	taxAtFrom: Sen;
}

interface RawBracket {
	fromExclusive: number;
	to: number | null;
	rate: number;
	taxAtLowerBound: number;
}

function brackets(rows: RawBracket[]): Bracket[] {
	return rows.map((r) => ({
		from: rm(r.fromExclusive),
		to: r.to === null ? null : rm(r.to),
		rateBp: Math.round(r.rate * 10000),
		taxAtFrom: rm(r.taxAtLowerBound),
	}));
}

export const RESIDENT_BRACKETS = {
	2025: brackets(tax2025File.residentBrackets as RawBracket[]),
	2026: brackets(tax2026File.residentBrackets as RawBracket[]),
};

// Published nisab per haul year (the object also holds a "$comment" string).
const nisab = zakatFile.historicalNisabRM as unknown as Record<string, number>;

export interface YearConfig {
	year: Year;
	/** Values carried from the year before because none is official yet (D6). */
	carriedForward: boolean;
	epfWageFloor: Sen;
	epfRelief: Sen;
	selfRelief: Sen;
	spouseRelief: Sen;
	childRelief: Sen;
	socso: SocsoBand[];
	/** Whether this year's SOCSO table includes LINDUNG 24 Jam (SKBBK). */
	hasSkbbk: boolean;
	taxTable: TaxRow[];
	zakatNisab: Sen;
	zakatSelf: Sen;
	zakatWife: Sen;
	zakatChild: Sen;
}

const BASE = {
	epfWageFloor: rm(1700),
	epfRelief: rm(4000),
	selfRelief: rm(9000),
	spouseRelief: rm(4000),
	childRelief: rm(2000),
	zakatSelf: rm(12000),
	zakatWife: rm(5000),
	zakatChild: rm(2000),
};

export const CONFIG: Record<Year, YearConfig> = {
	2025: {
		year: 2025,
		carriedForward: false,
		...BASE,
		socso: SOCSO_2025,
		hasSkbbk: false,
		taxTable: PCB_TABLE_1[2025],
		zakatNisab: rm(nisab["2025"]),
	},
	2026: {
		year: 2026,
		carriedForward: false,
		...BASE,
		socso: SOCSO_2026,
		hasSkbbk: true,
		taxTable: PCB_TABLE_1[2026],
		zakatNisab: rm(nisab["2026"]),
	},
	// D6: no official 2027 values yet, so 2026's are used with a note. Budget 2027 is not law (not included).
	2027: {
		year: 2027,
		carriedForward: true,
		...BASE,
		socso: SOCSO_2026,
		hasSkbbk: true,
		taxTable: PCB_TABLE_1[2026],
		zakatNisab: rm(nisab["2026"]),
	},
};

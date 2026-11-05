// PCB / income tax, v1 method (annual tax / 12). Research: docs/research/pcb.md, formulas.md §4, v1-baseline.md §4.

import { describe, expect, it } from "vitest";
import { calculator, type MaritalStatus, rm } from "./calculator";
import { CONFIG, PCB_TABLE_1, RESIDENT_BRACKETS } from "./reference/data";

const tax = (
	salary: number,
	status: MaritalStatus = "single",
	children = 0,
	extraRelief = 0,
) => {
	const employeeEpf = calculator.epf(rm(salary), 30).employee;
	return calculator.annualTax({
		salary: rm(salary),
		employeeEpf,
		year: 2026,
		status,
		children,
		extraRelief,
	});
};
const pcb = (salary: number, status: MaritalStatus = "single", children = 0) =>
	calculator.breakdown({
		salary: rm(salary),
		age: 30,
		year: 2026,
		status,
		children,
	}).pcb;

describe("PCB: LHDN's monthly table is built from the tax brackets", () => {
	for (const year of [2025, 2026] as const) {
		it(`${year}: M is a bracket's lower limit, R its rate, and B the tax at M less the rebate below RM35,000`, () => {
			const brackets = RESIDENT_BRACKETS[year];
			for (const row of PCB_TABLE_1[year]) {
				const b = brackets.find((x) => x.from === row.M);
				expect(b, `bracket starting at ${row.M}`).toBeDefined();
				if (!b) continue;
				const below = row.M < rm(35000);
				expect(row.rateBp).toBe(b.rateBp);
				expect(row.B[1]).toBe(b.taxAtFrom - (below ? rm(400) : 0));
				expect(row.B[3]).toBe(row.B[1]);
				expect(row.B[2]).toBe(b.taxAtFrom - (below ? rm(800) : 0));
			}
		});
	}

	it("the 2025 and 2026 tables are identical", () => {
		expect(PCB_TABLE_1[2025]).toEqual(PCB_TABLE_1[2026]);
		expect(RESIDENT_BRACKETS[2025]).toEqual(RESIDENT_BRACKETS[2026]);
	});

	it("each bracket's starting tax is the sum of the bands below it", () => {
		const brackets = RESIDENT_BRACKETS[2026];
		for (let i = 1; i < brackets.length; i++) {
			const prev = brackets[i - 1];
			const width = brackets[i].from - prev.from;
			expect(brackets[i].taxAtFrom).toBe(
				prev.taxAtFrom + (width * prev.rateBp) / 10000,
			);
		}
	});
});

describe("PCB: reliefs", () => {
	it("2026: self RM9,000, EPF up to RM4,000, spouse RM4,000, child RM2,000; 2027 carries 2026 (D6)", () => {
		for (const year of [2025, 2026, 2027] as const) {
			const c = CONFIG[year];
			expect([
				c.selfRelief,
				c.epfRelief,
				c.spouseRelief,
				c.childRelief,
			]).toEqual([rm(9000), rm(4000), rm(4000), rm(2000)]);
		}
		expect(CONFIG[2027].carriedForward).toBe(true);
	});

	it("EPF relief is capped at RM4,000 a year", () => {
		const r = (employeeEpf: number) =>
			calculator.reliefs({
				salary: 0,
				employeeEpf: rm(employeeEpf),
				year: 2026,
			});
		expect(r(220)).toBe(rm(9000 + 2640));
		expect(r(550)).toBe(rm(9000 + 4000));
	});

	it("children count only outside Category 1; spouse relief only in Category 2", () => {
		const r = (status: MaritalStatus, children: number) =>
			calculator.reliefs({
				salary: 0,
				employeeEpf: 0,
				year: 2026,
				status,
				children,
			});
		expect(r("single", 3)).toBe(rm(9000));
		expect(r("married-spouse-working", 2)).toBe(rm(13000));
		expect(r("divorced-or-widowed", 2)).toBe(rm(13000));
		expect(r("married-spouse-not-working", 2)).toBe(rm(17000));
	});

	it("the RM350 SOCSO + EIS relief is left out of v1 (V3): RM5,000 PCB is RM110.00, or RM108.25 with it", () => {
		expect(pcb(5000)).toBe(rm(110));
		expect(Math.round(tax(5000, "single", 0, rm(350)) / 12)).toBe(rm(108.25));
	});
});

describe("PCB: annual tax and the monthly figure", () => {
	it.each([
		[2000, "0", "0"],
		[3500, "20", "1.67"],
		[4000, "200", "16.67"],
		[4001, "600.72", "50.06"],
		[5000, "1320", "110.00"],
		[9000, "8450", "704.17"],
		[15000, "26150", "2179.17"],
		[25000, "56150", "4679.17"],
	])("single RM%s: tax RM%s a year, PCB RM%s a month", (salary, annual, monthly) => {
		expect(tax(salary)).toBe(rm(annual));
		expect(pcb(salary)).toBe(rm(monthly));
	});

	it("the row is chosen on the whole-ringgit part of P (P = 35,000.99 stays in the 3% row)", () => {
		// RM5,000 gives P = 47,000; extra relief moves P to the boundary.
		expect(tax(5000, "single", 0, rm(11999.01))).toBe(rm(200.02));
		expect(tax(5000, "single", 0, rm(11999))).toBe(rm(600.06));
	});

	it("the RM400 rebate ends at RM35,000 chargeable income: RM4,000 is the last salary with it", () => {
		expect(tax(4000)).toBe(rm(200));
		expect(tax(4001) - tax(4000)).toBe(rm(400.72));
	});
});

describe("PCB: marital status and children (v1-baseline.md §6)", () => {
	const table: [number, string, string[], string[]][] = [
		[3500, "1.67", ["1.67", "0", "0", "0"], ["0", "0", "0", "0"]],
		[4000, "16.67", ["16.67", "11.67", "6.67", "1.67"], ["0", "0", "0", "0"]],
		[
			4500,
			"80.00",
			["80.00", "70.00", "60.00", "16.67"],
			["60.00", "0", "0", "0"],
		],
		[
			5000,
			"110.00",
			["110.00", "100.00", "90.00", "80.00"],
			["90.00", "80.00", "70.00", "60.00"],
		],
		[
			6000,
			"207.50",
			["207.50", "189.17", "170.83", "152.50"],
			["170.83", "152.50", "134.17", "120.00"],
		],
		[
			8000,
			"514.17",
			["514.17", "482.50", "450.83", "419.17"],
			["450.83", "419.17", "387.50", "355.83"],
		],
		[
			10000,
			"929.17",
			["929.17", "887.50", "845.83", "804.17"],
			["845.83", "804.17", "767.50", "735.83"],
		],
		[
			15000,
			"2179.17",
			["2179.17", "2137.50", "2095.83", "2054.17"],
			["2095.83", "2054.17", "2012.50", "1970.83"],
		],
	];
	it.each(table)("RM%s", (salary, single, working, notWorking) => {
		expect(pcb(salary)).toBe(rm(single));
		working.forEach((v, kids) => {
			expect(pcb(salary, "married-spouse-working", kids)).toBe(rm(v));
			expect(pcb(salary, "divorced-or-widowed", kids)).toBe(rm(v));
		});
		notWorking.forEach((v, kids) => {
			expect(pcb(salary, "married-spouse-not-working", kids)).toBe(rm(v));
		});
	});

	it("single ignores children; Category 3 with no children equals single", () => {
		for (const salary of [3500, 5000, 9000]) {
			expect(pcb(salary, "single", 3)).toBe(pcb(salary));
			expect(pcb(salary, "married-spouse-working", 0)).toBe(pcb(salary));
		}
	});

	const firstWithPcb = (status: MaritalStatus, kids: number) => {
		for (let s = 1700; s <= 30000; s++) if (pcb(s, status, kids) > 0) return s;
		return null;
	};
	it.each([
		["single", 0, 3445],
		["married-spouse-working", 1, 3612],
		["married-spouse-working", 2, 3778],
		["married-spouse-working", 3, 3945],
		["married-spouse-not-working", 0, 4334],
		["married-spouse-not-working", 1, 4501],
		["married-spouse-not-working", 2, 4667],
		["married-spouse-not-working", 3, 4834],
	] as [
		MaritalStatus,
		number,
		number,
	][])("%s with %s children: PCB starts at RM%s", (status, kids, start) => {
		expect(firstWithPcb(status, kids)).toBe(start);
	});
});

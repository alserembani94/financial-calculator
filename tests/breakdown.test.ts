// The whole breakdown: take-home, employer cost and EPF total. Research: docs/research/v1-baseline.md §4, §6, §7.

import { describe, expect, it } from "vitest";
import {
	type BreakdownInput,
	calculator,
	type MaritalStatus,
	rm,
	type Year,
} from "./calculator";

const b = (
	salary: number,
	opts: Partial<Omit<BreakdownInput, "salary">> = {},
) => calculator.breakdown({ salary: rm(salary), age: 30, year: 2026, ...opts });

describe("Breakdown: how the totals are made", () => {
	const statuses: MaritalStatus[] = [
		"single",
		"married-spouse-not-working",
		"married-spouse-working",
		"divorced-or-widowed",
	];
	const cases: [number, number, Year, MaritalStatus, boolean][] = [];
	for (const salary of [
		5, 1000, 1700, 3445, 4000, 4001, 5000, 5000.01, 5900.01, 6000, 9000,
		20000.01, 50000,
	]) {
		for (const age of [17, 30, 60, 75]) {
			for (const year of [2025, 2026, 2027] as Year[]) {
				for (const status of statuses) {
					for (const optedOut of [false, true])
						cases.push([salary, age, year, status, optedOut]);
				}
			}
		}
	}

	it("take-home = salary - your EPF - SOCSO - EIS - PCB", () => {
		for (const [salary, age, year, status, skbbkOptedOut] of cases) {
			const r = b(salary, { age, year, status, children: 2, skbbkOptedOut });
			expect(r.takeHome).toBe(
				rm(salary) - r.epf.employee - r.socso.employee - r.eis.employee - r.pcb,
			);
		}
	});

	it("employer cost = salary + employer EPF + SOCSO + EIS; into EPF = both EPF shares", () => {
		for (const [salary, age, year, status, skbbkOptedOut] of cases) {
			const r = b(salary, { age, year, status, skbbkOptedOut });
			expect(r.employerCost).toBe(
				rm(salary) + r.epf.employer + r.socso.employer + r.eis.employer,
			);
			expect(r.intoEpf).toBe(r.epf.employee + r.epf.employer);
		}
	});

	it("PCB is the year's tax / 12, to the sen (N2)", () => {
		for (const [salary, age, year, status] of cases) {
			const r = b(salary, { age, year, status, children: 1 });
			expect(r.pcb).toBe(Math.floor((2 * r.annualTax + 12) / 24));
		}
	});

	it("2027 gives exactly 2026's figures (D6)", () => {
		for (const [salary, age, , status, skbbkOptedOut] of cases) {
			const opts = {
				age,
				status,
				children: 2,
				skbbkOptedOut,
				zakat: { wifeDeduction: true },
			};
			expect(b(salary, { ...opts, year: 2027 })).toEqual(
				b(salary, { ...opts, year: 2026 }),
			);
		}
	});

	it("opting out of SKBBK in 2026 gives 2025's figures, apart from the zakat nisab", () => {
		for (const [salary, age, , status] of cases) {
			expect(
				b(salary, { age, status, year: 2026, skbbkOptedOut: true }),
			).toEqual(b(salary, { age, status, year: 2025 }));
		}
	});
});

describe("Breakdown: v1-baseline.md worked figures (age 30, single, 2026)", () => {
	it.each([
		[1700, "187", "20.60", "3.30", "0", "1489.10", "1953.15"],
		[2000, "220", "24.40", "3.90", "0", "1751.70", "2298.05"],
		[2500, "275", "30.60", "4.90", "0", "2189.50", "2872.75"],
		[3000, "330", "36.90", "5.90", "0", "2627.20", "3447.55"],
		[3500, "385", "43.10", "6.90", "1.67", "3063.33", "4022.25"],
		[4000, "440", "49.40", "7.90", "16.67", "3486.03", "4597.05"],
		[4500, "495", "55.60", "8.90", "80.00", "3860.50", "5171.75"],
		[5000, "550", "61.90", "9.90", "110.00", "4268.20", "5746.55"],
		[5500, "605", "68.10", "10.90", "152.50", "4663.50", "6266.25"],
		[6000, "660", "74.40", "11.90", "207.50", "5046.20", "6836.05"],
		[7000, "770", "74.40", "11.90", "324.17", "5819.53", "7956.05"],
		[8000, "880", "74.40", "11.90", "514.17", "6519.53", "9076.05"],
		[10000, "1100", "74.40", "11.90", "929.17", "7884.53", "11316.05"],
		[15000, "1650", "74.40", "11.90", "2179.17", "11084.53", "16916.05"],
		[20000, "2200", "74.40", "11.90", "3429.17", "14284.53", "22516.05"],
		[25000, "2750", "74.40", "11.90", "4679.17", "17484.53", "28116.05"],
	])("RM%s: EPF %s, SOCSO %s, EIS %s, PCB %s, take-home %s, employer cost %s", (salary, epf, socso, eis, pcb, takeHome, cost) => {
		const r = b(salary);
		expect([
			r.epf.employee,
			r.socso.employee,
			r.eis.employee,
			r.pcb,
			r.takeHome,
			r.employerCost,
		]).toEqual([epf, socso, eis, pcb, takeHome, cost].map((x) => rm(x)));
	});

	it.each([
		[1700, "1501.45"],
		[2000, "1766.35"],
		[3000, "2649.35"],
		[4000, "3515.68"],
		[5000, "4305.35"],
		[6000, "5090.85"],
		[10000, "7929.18"],
		[25000, "17529.18"],
	])("2025 (no SKBBK), RM%s: take-home %s", (salary, takeHome) => {
		expect(b(salary, { year: 2025 }).takeHome).toBe(rm(takeHome));
		expect(b(salary, { skbbkOptedOut: true }).takeHome).toBe(rm(takeHome));
	});

	it.each([
		[17, "550", "61.90", "0", "110.00", "4278.10", "650", "86.65", "0"],
		[30, "550", "61.90", "9.90", "110.00", "4268.20", "650", "86.65", "9.90"],
		[60, "0", "37.15", "0", "134.17", "4828.68", "200", "61.90", "0"],
		[75, "0", "37.15", "0", "134.17", "4828.68", "0", "61.90", "0"],
	])("RM5,000 at age %s", (age, epf, socso, eis, pcb, takeHome, erEpf, erSocso, erEis) => {
		const r = b(5000, { age });
		expect([
			r.epf.employee,
			r.socso.employee,
			r.eis.employee,
			r.pcb,
			r.takeHome,
			r.epf.employer,
			r.socso.employer,
			r.eis.employer,
		]).toEqual(
			[epf, socso, eis, pcb, takeHome, erEpf, erSocso, erEis].map((x) => rm(x)),
		);
	});

	it.each([
		[2000, "1751.70", "2298.05", "480"],
		[4000, "3486.03", "4597.05", "960"],
		[9000, "7219.53", "10196.05", "2070"],
		[15000, "11084.53", "16916.05", "3450"],
	])("salary breakdown dashboard, RM%s: take-home %s, employer cost %s, into EPF %s", (salary, takeHome, cost, intoEpf) => {
		const r = b(salary);
		expect([r.takeHome, r.employerCost, r.intoEpf]).toEqual(
			[takeHome, cost, intoEpf].map((x) => rm(x)),
		);
	});
});

describe("Breakdown: findings for a salary negotiation (v1-baseline.md §7)", () => {
	const takeHome = (
		salary: number,
		status: MaritalStatus = "single",
		children = 0,
	) => b(salary, { status, children }).takeHome;

	it("take-home falls at 1,415 of the 28,300 RM1 steps from RM1,700 to RM30,000", () => {
		let falls = 0;
		let prev = takeHome(1700);
		for (let s = 1701; s <= 30000; s++) {
			const now = takeHome(s);
			if (now < prev) falls++;
			prev = now;
		}
		expect(falls).toBe(1415);
	});

	it("RM4,000 -> RM4,001 loses RM36.79 (the rebate ends) and recovers at RM4,045", () => {
		expect(takeHome(4000) - takeHome(4001)).toBe(rm(36.79));
		expect(takeHome(4044)).toBeLessThan(takeHome(4000));
		expect(takeHome(4045)).toBeGreaterThanOrEqual(takeHome(4000));
	});

	it("RM5,000 -> RM5,001 loses RM11.46 and recovers at RM5,014; employer cost falls RM35.10", () => {
		expect(takeHome(5000) - takeHome(5001)).toBe(rm(11.46));
		expect(takeHome(5013)).toBeLessThan(takeHome(5000));
		expect(takeHome(5014)).toBeGreaterThanOrEqual(takeHome(5000));
		expect(b(5000).employerCost - b(5001).employerCost).toBe(rm(35.1));
	});

	it.each([
		["married-spouse-working", 1, 4166, "32.37", 4209],
		["married-spouse-working", 2, 4333, "32.38", 4373],
		["married-spouse-working", 3, 4500, "36.89", 4545],
		["married-spouse-not-working", 0, 4333, "49.04", 4393],
		["married-spouse-not-working", 1, 4500, "53.56", 4565],
		["married-spouse-not-working", 2, 4666, "49.02", 4729],
		["married-spouse-not-working", 3, 4833, "49.04", 4893],
	] as [
		MaritalStatus,
		number,
		number,
		string,
		number,
	][])("%s, %s children: the rebate line at RM%s costs RM%s; recovers at RM%s", (status, children, at, loss, recover) => {
		expect(
			takeHome(at, status, children) - takeHome(at + 1, status, children),
		).toBe(rm(loss));
		expect(takeHome(recover - 1, status, children)).toBeLessThan(
			takeHome(at, status, children),
		);
		expect(takeHome(recover, status, children)).toBeGreaterThanOrEqual(
			takeHome(at, status, children),
		);
	});
});

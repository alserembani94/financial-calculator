// Zakat (PPZ-MAIWP, Wilayah Persekutuan), information only (V1, V6, V7).
// Research: docs/research/zakat.md, formulas.md §5, v1-baseline.md §4.

import { describe, expect, it } from "vitest";
import {
	type Breakdown,
	calculator,
	type MaritalStatus,
	rm,
	type Year,
} from "./calculator";
import { CONFIG } from "./reference/data";

const withZakat = (
	salary: number,
	opts: {
		status?: MaritalStatus;
		children?: number;
		wife?: boolean;
		year?: Year;
		age?: number;
	} = {},
) =>
	calculator.breakdown({
		salary: rm(salary),
		age: opts.age ?? 30,
		year: opts.year ?? 2026,
		status: opts.status ?? "single",
		children: opts.children ?? 0,
		zakat: { wifeDeduction: opts.wife ?? false },
	}).zakat as NonNullable<Breakdown["zakat"]>;

describe("Zakat: the formula", () => {
	it("nisab by year: 2025 RM29,740, 2026 RM33,996, 2027 carries 2026 (D6)", () => {
		expect([
			CONFIG[2025].zakatNisab,
			CONFIG[2026].zakatNisab,
			CONFIG[2027].zakatNisab,
		]).toEqual([rm(29740), rm(33996), rm(33996)]);
	});

	it("deductions: self RM12,000, wife RM5,000, child under 18 RM2,000, plus your EPF", () => {
		const c = CONFIG[2026];
		expect([c.zakatSelf, c.zakatWife, c.zakatChild]).toEqual([
			rm(12000),
			rm(5000),
			rm(2000),
		]);
	});

	it("is 2.5% of income after deductions, once that reaches the nisab", () => {
		// RM5,000: 60,000 - 12,000 - 6,600 EPF = 41,400; x 2.5% = 1,035.
		expect(withZakat(5000).annual).toBe(rm(1035));
		expect(withZakat(5000).monthly).toBe(rm(86.25));
	});
});

describe("Zakat: PPZ test vectors (zakat-wp.json)", () => {
	it("RM4,500 single: RM901.50", () => {
		expect(withZakat(4500).annual).toBe(rm(901.5));
	});
	it("RM4,500 with a wife: RM0, because the wife deduction takes it below the nisab", () => {
		expect(
			withZakat(4500, { status: "married-spouse-not-working", wife: true })
				.annual,
		).toBe(0);
	});
	it("RM4,500 with one child under 18: RM851.50", () => {
		expect(
			withZakat(4500, { status: "divorced-or-widowed", children: 1 }).annual,
		).toBe(rm(851.5));
	});
	it("RM4,310 with Third Schedule EPF of RM476: RM850.20", () => {
		expect(calculator.epf(rm(4310), 30).employee).toBe(rm(476));
		expect(withZakat(4310).annual).toBe(rm(850.2));
	});
});

describe("Zakat: where it starts", () => {
	const firstWithZakat = (opts: Parameters<typeof withZakat>[1]) => {
		for (let s = 1700; s <= 30000; s++)
			if (withZakat(s, opts).annual > 0) return s;
		return null;
	};
	it.each([
		["single, 2026", {}, 4309],
		["single, 2025", { year: 2025 as Year }, 3911],
		["single, 2026, age 60 (no EPF)", { age: 60 }, 3833],
		[
			"married with wife deduction",
			{ status: "married-spouse-working" as MaritalStatus, wife: true },
			4776,
		],
		[
			"one child",
			{ status: "married-spouse-working" as MaritalStatus, children: 1 },
			4495,
		],
		[
			"two children",
			{ status: "married-spouse-working" as MaritalStatus, children: 2 },
			4684,
		],
	])("%s: from RM%s... ", (_label, opts, start) => {
		expect(firstWithZakat(opts)).toBe(start);
	});
});

describe("Zakat: information, not a deduction (V6)", () => {
	it("take-home, PCB and the other lines are the same with zakat on or off", () => {
		for (const salary of [3000, 5000, 9000, 15000]) {
			const off = calculator.breakdown({
				salary: rm(salary),
				age: 30,
				year: 2026,
			});
			const { zakat: _z, ...on } = calculator.breakdown({
				salary: rm(salary),
				age: 30,
				year: 2026,
				zakat: {},
			});
			expect(on).toEqual(off);
		}
	});

	it.each([
		[4000, {}, "0", "0", "3486.03", "0", "0"],
		[4309, {}, "849.90", "70.83", "3630.53", "822.48", "27.42"],
		[5000, {}, "1035.00", "86.25", "4181.95", "1035.00", "0"],
		[
			6000,
			{ status: "married-spouse-working", children: 2 },
			"1202.00",
			"100.17",
			"4982.70",
			"1202.00",
			"0",
		],
		[
			6000,
			{ status: "married-spouse-not-working", children: 2, wife: true },
			"1077.00",
			"89.75",
			"5029.78",
			"1077.00",
			"0",
		],
		[8000, {}, "1836.00", "153.00", "6366.53", "1836.00", "0"],
	] as [
		number,
		Parameters<typeof withZakat>[1],
		string,
		string,
		string,
		string,
		string,
	][])("RM%s %o: zakat RM%s a year (RM%s a month), left after zakat RM%s, rebate RM%s, not recoverable RM%s", (salary, opts, annual, monthly, left, rebate, lost) => {
		const z = withZakat(salary, opts);
		expect(z).toEqual({
			annual: rm(annual),
			monthly: rm(monthly),
			leftAfterZakat: rm(left),
			rebateAtFiling: rm(rebate),
			notRecoverable: rm(lost),
		});
	});

	it("children are ignored for single, as for tax", () => {
		expect(withZakat(6000, { children: 2 })).toEqual(withZakat(6000));
	});

	it("the wife deduction applies only when chosen (V7)", () => {
		const married = { status: "married-spouse-working" as MaritalStatus };
		expect(
			withZakat(6000, married).annual -
				withZakat(6000, { ...married, wife: true }).annual,
		).toBe(rm(125));
	});
});

describe("Zakat above the year's tax is not recoverable", () => {
	const lostRange = (opts: Parameters<typeof withZakat>[1]) => {
		const hit: number[] = [];
		let worst = { lost: 0, salary: 0 };
		for (let s = 1700; s <= 30000; s++) {
			const z = withZakat(s, opts);
			if (z.notRecoverable > 0) {
				hit.push(s);
				if (z.notRecoverable > worst.lost)
					worst = { lost: z.notRecoverable, salary: s };
			}
		}
		return { from: hit[0], to: hit[hit.length - 1], count: hit.length, worst };
	};

	it("2026 single: RM4,309 to RM4,369, at most RM27.42 a year", () => {
		expect(lostRange({})).toEqual({
			from: 4309,
			to: 4369,
			count: 61,
			worst: { lost: rm(27.42), salary: 4309 },
		});
	});

	it("2026, spouse doesn't work, no children, no wife deduction: up to RM856.50", () => {
		const r = lostRange({ status: "married-spouse-not-working" });
		expect([r.from, r.to, r.worst]).toEqual([
			4309,
			4900,
			{ lost: rm(856.5), salary: 4333 },
		]);
	});

	it("2026 with the wife deduction and a non-working spouse: never", () => {
		for (const children of [0, 1, 2, 3, 6]) {
			expect(
				lostRange({
					status: "married-spouse-not-working",
					wife: true,
					children,
				}).count,
			).toBe(0);
		}
	});

	it("2025 single: RM3,911 to RM4,369, at most RM575.74", () => {
		const r = lostRange({ year: 2025 });
		expect([r.from, r.to, r.worst]).toEqual([
			3911,
			4369,
			{ lost: rm(575.74), salary: 3911 },
		]);
	});
});

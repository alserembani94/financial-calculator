// EIS (SIP, Act 800). Research: docs/research/eis.md, formulas.md §3.

import { describe, expect, it } from "vitest";
import { calculator, rm } from "./calculator";
import { EIS_BANDS } from "./reference/data";
import { ceilTo5Sen } from "./reference/money";

const eis = (salary: number, age = 30) => calculator.eis(rm(salary), age);

describe("EIS: the formula behind the table", () => {
	it("every band: each side = assumed wage x 0.2%, rounded up to the next 5 sen", () => {
		expect(EIS_BANDS).toHaveLength(65);
		for (const b of EIS_BANDS) {
			expect(b.employee).toBe(ceilTo5Sen(b.assumedWage, 20));
			expect(b.employer).toBe(b.employee);
		}
	});

	it("rounding up (not to the nearest) matters only in the six lowest bands", () => {
		const rounded = EIS_BANDS.filter(
			(b) => (b.assumedWage * 20) % 50_000 !== 0,
		);
		expect(rounded.map((b) => b.upTo)).toEqual(
			[30, 50, 70, 100, 140, 200].map((x) => rm(x)),
		);
	});

	it("has a RM6,000 ceiling with an assumed wage of RM5,950", () => {
		const top = EIS_BANDS[EIS_BANDS.length - 1];
		expect([top.above, top.upTo, top.assumedWage]).toEqual([
			rm(6000),
			null,
			rm(5950),
		]);
	});
});

describe("EIS: worked figures", () => {
	it.each([
		[1000, "1.90"],
		[2000, "3.90"],
		[5000, "9.90"],
		[5800, "11.50"],
		[5800.01, "11.70"],
		[6000, "11.90"],
		[6000.01, "11.90"],
		[20000, "11.90"],
	])("RM%s: RM%s each side", (salary, amount) => {
		expect(eis(salary)).toEqual({ employee: rm(amount), employer: rm(amount) });
	});

	it("the lowest band rounds 4 sen up to 5 sen", () => {
		expect(eis(30)).toEqual({ employee: 5, employer: 5 });
	});
});

describe("EIS: age", () => {
	it("pays from 18 to 59; nothing at 17 or from 60", () => {
		expect(eis(5000, 17)).toEqual({ employee: 0, employer: 0 });
		expect(eis(5000, 18)).toEqual({ employee: rm(9.9), employer: rm(9.9) });
		expect(eis(5000, 59)).toEqual({ employee: rm(9.9), employer: rm(9.9) });
		expect(eis(5000, 60)).toEqual({ employee: 0, employer: 0 });
	});
});

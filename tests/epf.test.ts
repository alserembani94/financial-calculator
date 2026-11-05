// EPF (KWSP). Research: docs/research/epf.md, docs/research/formulas.md §1.

import { describe, expect, it } from "vitest";
import { calculator, rm } from "./calculator";
import { EPF_PART_A, EPF_PART_E, YEARS } from "./reference/data";
import { ceilToRinggit } from "./reference/money";

const epf = (salary: number, age = 30) => calculator.epf(rm(salary), age);

describe("EPF: the formula behind the Third Schedule", () => {
	it("Part A: every row is the band top x 11% (employee) and x 13% or 12% (employer), rounded up to the ringgit", () => {
		const rows = EPF_PART_A.filter((r) => r.employee > 0);
		expect(rows).toHaveLength(400);
		for (const r of rows) {
			const employerBp = r.to <= rm(5000) ? 1300 : 1200;
			expect({ to: r.to, employee: r.employee, employer: r.employer }).toEqual({
				to: r.to,
				employee: ceilToRinggit(r.to, 1100),
				employer: ceilToRinggit(r.to, employerBp),
			});
		}
	});

	it("Part E (age 60 to 74): employee pays nothing; employer pays the band top x 4%, rounded up", () => {
		for (const r of EPF_PART_E.filter((x) => x.employer > 0)) {
			expect(r.employee).toBe(0);
			expect(r.employer).toBe(ceilToRinggit(r.to, 400));
		}
	});

	it("the calculator returns the row for any salary inside a band at or above the RM1,700 floor", () => {
		for (const r of EPF_PART_A.filter(
			(x) => x.employee > 0 && x.from >= rm(1700),
		)) {
			for (const salary of [r.from, r.to]) {
				expect(calculator.epf(salary, 30)).toEqual({
					employee: r.employee,
					employer: r.employer,
				});
			}
		}
	});
});

describe("EPF: worked figures", () => {
	it.each([
		[2000, "220", "260"],
		[4000, "440", "520"],
		[5000, "550", "650"],
		[9000, "990", "1080"],
		[15000, "1650", "1800"],
		[20000, "2200", "2400"],
	])("RM%s: employee RM%s, employer RM%s", (salary, employee, employer) => {
		expect(epf(salary)).toEqual({
			employee: rm(employee),
			employer: rm(employer),
		});
	});

	it("the employer rate drops from 13% to 12% just above RM5,000", () => {
		expect(epf(5000)).toEqual({ employee: rm(550), employer: rm(650) });
		expect(epf(5000.01)).toEqual({ employee: rm(561), employer: rm(612) });
	});

	it("above RM20,000: total = 23% rounded up, employee = 11% rounded up (split provisional, EPF4)", () => {
		expect(epf(20000.01)).toEqual({ employee: rm(2201), employer: rm(2400) });
		expect(epf(25000)).toEqual({ employee: rm(2750), employer: rm(3000) });
		expect(epf(100000)).toEqual({ employee: rm(11000), employer: rm(12000) });
	});
});

describe("EPF: minimum-wage floor", () => {
	it("is charged on RM1,700 for any salary above RM10 and below RM1,700", () => {
		const atFloor = epf(1700);
		expect(atFloor).toEqual({ employee: rm(187), employer: rm(221) });
		for (const salary of [10.01, 500, 1000, 1699.99])
			expect(epf(salary)).toEqual(atFloor);
	});

	it("is RM1,700 in every year, including 2027 (RM2,000 isn't gazetted, D6)", () => {
		for (const year of YEARS) {
			expect(calculator.epf(rm(1000), 30, year)).toEqual({
				employee: rm(187),
				employer: rm(221),
			});
		}
	});

	it("RM10 and below pays nothing", () => {
		expect(epf(10)).toEqual({ employee: 0, employer: 0 });
		expect(epf(5)).toEqual({ employee: 0, employer: 0 });
	});
});

describe("EPF: age", () => {
	it("59 pays Part A; 60 to 74 pays Part E; 75 and over pays nothing", () => {
		expect(epf(5000, 59)).toEqual({ employee: rm(550), employer: rm(650) });
		expect(epf(5000, 60)).toEqual({ employee: 0, employer: rm(200) });
		expect(epf(5000, 74)).toEqual({ employee: 0, employer: rm(200) });
		expect(epf(5000, 75)).toEqual({ employee: 0, employer: 0 });
	});

	it("60 and over above RM20,000: employer 4% rounded up", () => {
		expect(epf(20000.01, 60)).toEqual({ employee: 0, employer: rm(801) });
	});
});

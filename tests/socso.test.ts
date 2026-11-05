// SOCSO (PERKESO, Act 4) with LINDUNG 24 Jam (SKBBK). Research: docs/research/socso.md, formulas.md §2.

import { describe, expect, it } from "vitest";
import pcbCases from "../docs/research/data/pcb-verification-cases.json";
import { calculator, rm } from "./calculator";
import { SOCSO_2025, SOCSO_2026, type SocsoBand } from "./reference/data";
import { nearest5SenTiesEven } from "./reference/money";

const socso = (
	salary: number,
	year: 2025 | 2026 | 2027 = 2026,
	age = 30,
	optedOut = false,
) => calculator.socso(rm(salary), age, year, optedOut);
const sen = (x: number | undefined) => rm(x ?? 0);

// socso.md: three low bands carry 5 sen more employment injury than the rule gives (legacy rounding).
const LEGACY_EI_BANDS = [rm(30), rm(70), rm(100)];
const isLegacy = (b: SocsoBand) =>
	b.upTo !== null && LEGACY_EI_BANDS.includes(b.upTo);

describe("SOCSO: the formula behind the table", () => {
	it("has 65 bands, a RM6,000 ceiling, and the top band uses an assumed wage of RM5,950", () => {
		for (const table of [SOCSO_2025, SOCSO_2026]) {
			expect(table).toHaveLength(65);
			const top = table[table.length - 1];
			expect(top.above).toBe(rm(6000));
			expect(top.upTo).toBeNull();
			expect(top.assumedWage).toBe(rm(5950));
		}
	});

	it("invalidity = assumed wage x 0.5%, nearest 5 sen, ties to even, for every band (both sides)", () => {
		for (const b of [...SOCSO_2025, ...SOCSO_2026]) {
			expect(sen(b.first.employeeInvalidity)).toBe(
				nearest5SenTiesEven(b.assumedWage, 50),
			);
			expect(sen(b.first.employerInvalidity)).toBe(
				sen(b.first.employeeInvalidity),
			);
		}
	});

	it("employment injury (employer) = assumed wage x 1.25%, nearest 5 sen, ties to even, except 3 legacy bands at +5 sen", () => {
		for (const b of SOCSO_2026) {
			const rule = nearest5SenTiesEven(b.assumedWage, 125);
			expect(sen(b.first.employerEmploymentInjury)).toBe(
				isLegacy(b) ? rule + 5 : rule,
			);
		}
	});

	it("LINDUNG 24 Jam Phase 1 = employment injury - invalidity, except the RM70-100 band", () => {
		for (const b of SOCSO_2026) {
			const nei = sen(b.first.employeeNonEmploymentInjury);
			const derived =
				sen(b.first.employerEmploymentInjury) - sen(b.first.employeeInvalidity);
			if (b.upTo === rm(100)) expect(nei).toBe(derived - 5);
			else expect(nei).toBe(derived);
		}
	});

	it("each share is the sum of its parts", () => {
		for (const b of SOCSO_2026) {
			const f = b.first;
			expect(sen(f.employer)).toBe(
				sen(f.employerEmploymentInjury) + sen(f.employerInvalidity),
			);
			expect(sen(f.employeeWithNEI)).toBe(
				sen(f.employeeInvalidity) + sen(f.employeeNonEmploymentInjury),
			);
			expect(sen(f.employeeWithoutNEI)).toBe(sen(f.employeeInvalidity));
			const s = b.second;
			expect(sen(s.employer)).toBe(sen(s.employerEmploymentInjury));
			expect(sen(s.employeeWithNEI)).toBe(sen(s.employeeNonEmploymentInjury));
			expect(sen(s.employeeWithoutNEI)).toBe(0);
		}
	});

	it("2025 is the 2026 table without LINDUNG 24 Jam", () => {
		SOCSO_2025.forEach((b25, i) => {
			const b26 = SOCSO_2026[i];
			expect([b25.above, b25.upTo, b25.assumedWage]).toEqual([
				b26.above,
				b26.upTo,
				b26.assumedWage,
			]);
			expect(sen(b25.first.employee)).toBe(sen(b26.first.employeeWithoutNEI));
			expect(sen(b25.first.employer)).toBe(sen(b26.first.employer));
		});
	});
});

describe("SOCSO: worked figures", () => {
	it("RM5,000: 2026 with LINDUNG 24 Jam, opted out, and 2025", () => {
		expect(socso(5000, 2026)).toEqual({
			employee: rm(61.9),
			employer: rm(86.65),
		});
		expect(socso(5000, 2026, 30, true)).toEqual({
			employee: rm(24.75),
			employer: rm(86.65),
		});
		expect(socso(5000, 2025)).toEqual({
			employee: rm(24.75),
			employer: rm(86.65),
		});
	});

	it("matches the research's per-wage figures (pcb-verification-cases.json, socsoEis)", () => {
		const byWage = pcbCases.socsoEis.byWage as Record<
			string,
			{ socso: string; nei: string }
		>;
		for (const [wage, v] of Object.entries(byWage)) {
			expect(socso(Number(wage), 2025).employee).toBe(rm(v.socso));
			expect(socso(Number(wage), 2026).employee).toBe(rm(v.socso) + rm(v.nei));
		}
	});

	it("the ceiling: RM74.40 / RM104.15 from just above RM5,900, the same at RM6,000 and above", () => {
		expect(socso(5900)).toEqual({ employee: rm(73.1), employer: rm(102.35) });
		for (const salary of [5900.01, 6000, 6000.01, 10000, 100000]) {
			expect(socso(salary)).toEqual({
				employee: rm(74.4),
				employer: rm(104.15),
			});
		}
	});

	it("band edges: a wage on a band's top stays in that band", () => {
		expect(socso(5800)).toEqual({ employee: rm(71.9), employer: rm(100.65) });
		expect(socso(5800.01)).toEqual({
			employee: rm(73.1),
			employer: rm(102.35),
		});
		expect(socso(30)).toEqual({ employee: rm(0.3), employer: rm(0.4) });
		expect(socso(30.01)).toEqual({ employee: rm(0.5), employer: rm(0.7) });
	});

	it("SKBBK costs at most RM44.65 a month", () => {
		const gap = (salary: number) =>
			socso(salary).employee - socso(salary, 2026, 30, true).employee;
		expect(gap(5000)).toBe(rm(37.15));
		expect(gap(6000)).toBe(rm(44.65));
		expect(gap(20000)).toBe(rm(44.65));
	});
});

describe("SOCSO: age 60 and over (Second Category)", () => {
	it("2026: employer pays injury only; employee pays LINDUNG 24 Jam only, or nothing if opted out", () => {
		expect(socso(5000, 2026, 60)).toEqual({
			employee: rm(37.15),
			employer: rm(61.9),
		});
		expect(socso(5000, 2026, 60, true)).toEqual({
			employee: 0,
			employer: rm(61.9),
		});
		expect(socso(6000, 2026, 60)).toEqual({
			employee: rm(44.65),
			employer: rm(74.4),
		});
	});

	it("2025: employee pays nothing", () => {
		expect(socso(5000, 2025, 60)).toEqual({ employee: 0, employer: rm(61.9) });
	});

	it("59 is still First Category", () => {
		expect(socso(5000, 2026, 59)).toEqual(socso(5000, 2026, 30));
	});
});

describe("SOCSO: years", () => {
	it("2027 uses 2026's table (D6)", () => {
		for (const salary of [1700, 3000, 5000, 6000, 9000]) {
			for (const optedOut of [false, true]) {
				expect(socso(salary, 2027, 30, optedOut)).toEqual(
					socso(salary, 2026, 30, optedOut),
				);
			}
		}
	});

	it("opting out has no effect in 2025", () => {
		expect(socso(5000, 2025, 30, true)).toEqual(socso(5000, 2025, 30, false));
	});
});

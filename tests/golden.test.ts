// Locks every component to the research script: each case in fixtures/golden.json was produced by
// docs/research/data/v1-baseline.py (see fixtures/generate_golden.py) and must match to the sen.

import { describe, expect, it } from "vitest";
import { calculator, type MaritalStatus, type Year } from "./calculator";
import golden from "./fixtures/golden.json";

type Case = [number[], number[]];
const cases = golden.cases as Case[];
const statuses = golden.statuses as MaritalStatus[];

function run([salary, age, year, status, children, optedOut, wife]: number[]) {
	const r = calculator.breakdown({
		salary,
		age,
		year: year as Year,
		status: statuses[status],
		children,
		skbbkOptedOut: optedOut === 1,
		zakat: { wifeDeduction: wife === 1 },
	});
	const z = r.zakat ?? {
		annual: NaN,
		monthly: NaN,
		rebateAtFiling: NaN,
		notRecoverable: NaN,
	};
	return [
		r.epf.employee,
		r.epf.employer,
		r.socso.employee,
		r.socso.employer,
		r.eis.employee,
		r.eis.employer,
		r.annualTax,
		r.pcb,
		r.takeHome,
		r.employerCost,
		z.annual,
		z.monthly,
		z.rebateAtFiling,
		z.notRecoverable,
	];
}

describe("Golden cases from the research script", () => {
	it("has the expected fields", () => {
		expect(golden.inputs).toEqual([
			"salary",
			"age",
			"year",
			"status",
			"children",
			"skbbkOptedOut",
			"wifeDeduction",
		]);
		expect(golden.outputs).toHaveLength(14);
		expect(cases.length).toBeGreaterThan(6000);
	});

	golden.outputs.forEach((field, i) => {
		it(`${field} matches in every case`, () => {
			const mismatches: string[] = [];
			for (const [input, expected] of cases) {
				const actual = run(input)[i];
				if (actual !== expected[i])
					mismatches.push(
						`input ${JSON.stringify(input)}: expected ${expected[i]}, got ${actual}`,
					);
			}
			expect(mismatches.slice(0, 10)).toEqual([]);
		});
	});
});

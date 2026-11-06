// The one place the tests choose what to test.
// Today it is the reference implementation in ./reference. When the app's calculator exists,
// export it here instead (it must match the Calculator type), and every test runs against it.

import { referenceCalculator } from "./reference";

export type Calculator = typeof referenceCalculator;

export const calculator: Calculator = referenceCalculator;

export type { Breakdown, BreakdownInput, MaritalStatus } from "./reference";
export type { Year } from "./reference/data";
export { rm, toRm } from "./reference/money";

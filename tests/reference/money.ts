// Money is held as whole sen (integers) so no step loses a cent to floating point.

export type Sen = number;

/** Ringgit to sen: rm(4268.2) === 426820. Accepts "4,268.20" too. */
export function rm(value: number | string): Sen {
	const n =
		typeof value === "string" ? Number(value.replaceAll(",", "")) : value;
	return Math.round(n * 100);
}

/** Sen to a ringgit string with 2 decimals, for messages. */
export function toRm(sen: Sen): string {
	return (sen / 100).toFixed(2);
}

/** Rates are held in basis points: 11% = 1100. */
export function bp(rate: number): number {
	return Math.round(rate * 10000);
}

/** amount x rate, in sen, rounded up to the next whole ringgit (EPF's rule). */
export function ceilToRinggit(amount: Sen, rateBp: number): Sen {
	return Math.ceil((amount * rateBp) / 1_000_000) * 100;
}

/** amount x rate, in sen, rounded up to the next 5 sen (EIS's rule). */
export function ceilTo5Sen(amount: Sen, rateBp: number): Sen {
	return Math.ceil((amount * rateBp) / 50_000) * 5;
}

/** amount x rate, in sen, to the nearest 5 sen with ties to even (SOCSO's table). */
export function nearest5SenTiesEven(amount: Sen, rateBp: number): Sen {
	const units = (amount * rateBp) / 50_000; // in 5-sen units
	const floor = Math.floor(units);
	const diff = units - floor;
	if (Math.abs(diff - 0.5) < 1e-9)
		return (floor % 2 === 0 ? floor : floor + 1) * 5;
	return Math.round(units) * 5;
}

/** a / b, half-up to the sen, for a >= 0. */
export function divHalfUp(a: Sen, b: number): Sen {
	return Math.floor((2 * a + b) / (2 * b));
}

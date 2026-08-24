/**
 * Bounded-concurrency gate for heavy local work such as image transforms or
 * native tool batches. When the limit is reached an operation waits in a
 * bounded queue; when the queue is also full it rejects with `busyMessage` so
 * callers can degrade instead of piling up work.
 */
export function createConcurrencyGate(
	limit: number,
	maxQueue: number,
	busyMessage: string
): <T>(operation: () => Promise<T>) => Promise<T> {
	let activeOperations = 0;
	const waiters: Array<() => void> = [];

	return async <T>(operation: () => Promise<T>): Promise<T> => {
		if (activeOperations >= limit) {
			if (waiters.length >= maxQueue) {
				throw new Error(busyMessage);
			}
			await new Promise<void>((resolveWaiter) => waiters.push(resolveWaiter));
		} else {
			activeOperations += 1;
		}

		try {
			return await operation();
		} finally {
			const nextWaiter = waiters.shift();
			if (nextWaiter) {
				nextWaiter();
			} else {
				activeOperations -= 1;
			}
		}
	};
}

/** Reads a strictly positive integer from an environment value, with a fallback. */
export function readPositiveInteger(
	value: string | undefined,
	fallback: number
): number {
	const parsed = Number(value);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const FIRST_LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

/**
 * Up to `max` uppercase initials from the words of `name`, skipping
 * punctuation ("Ada Lovelace" → "AL", "(Ada) Love" → "AL"); empty or
 * missing names return "". Locale-independent, so SSR and hydration agree.
 */
export function getInitials(name: string | null | undefined, max = 2): string {
	let initials = '';
	for (const word of (name ?? '').split(/\s+/)) {
		if (initials.length >= max) break;
		const letter = FIRST_LETTER_OR_DIGIT.exec(word)?.[0];
		if (letter) initials += letter;
	}
	return initials.toUpperCase();
}

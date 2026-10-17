// Shared Svelte markup helpers for Lumi codemods (no dependencies).
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const SKIP = new Set([
	'node_modules',
	'.svelte-kit',
	'build',
	'dist',
	'vendor',
	'.git',
	'public'
]);
export function sourceFiles(dir, extensions = ['.svelte'], out = []) {
	for (const name of readdirSync(dir)) {
		if (SKIP.has(name)) continue;
		const path = join(dir, name);
		if (statSync(path).isDirectory()) sourceFiles(path, extensions, out);
		else if (extensions.some((ext) => name.endsWith(ext))) out.push(path);
	}
	return out;
}

// Index of the closing `}` that matches the `{` at `start`, skipping strings.
export function closeBrace(text, start) {
	let depth = 0;
	let quote = null;
	for (let i = start; i < text.length; i++) {
		const c = text[i];
		if (quote) {
			if (c === '\\') i++;
			else if (c === quote) quote = null;
		} else if (c === '"' || c === "'" || c === '`') quote = c;
		else if (c === '{') depth++;
		else if (c === '}' && --depth === 0) return i;
	}
	return -1;
}

// Index of the `>` closing the tag opened at `start`.
export function tagEnd(src, start) {
	let quote = null;
	for (let i = start; i < src.length; i++) {
		const c = src[i];
		if (quote) {
			if (c === quote) quote = null;
		} else if (c === '"' || c === "'") quote = c;
		else if (c === '{') i = closeBrace(src, i);
		else if (c === '>') return i;
	}
	return -1;
}

// Attributes with their span (including leading whitespace) and expression.
export function attributes(tag) {
	const list = [];
	let i = /^<[\w.]+/.exec(tag)[0].length;
	for (;;) {
		const space = /^\s+/.exec(tag.slice(i));
		if (!space) break;
		const start = i;
		i += space[0].length;
		if (tag[i] === '{') {
			const end = closeBrace(tag, i);
			const expr = tag.slice(i + 1, end).trim();
			list.push({ name: expr, start, end: end + 1, expr, indent: space[0] });
			i = end + 1;
			continue;
		}
		const name = /^[\w:-]+/.exec(tag.slice(i))?.[0];
		if (!name) break;
		i += name.length;
		let expr = null;
		let literal = null;
		if (tag[i] === '=') {
			i++;
			if (tag[i] === '{') {
				const end = closeBrace(tag, i);
				expr = tag.slice(i + 1, end).trim();
				i = end + 1;
			} else {
				const end = tag.indexOf(tag[i], i + 1);
				literal = tag.slice(i, end + 1);
				i = end + 1;
			}
		}
		list.push({ name, start, end: i, expr, literal, indent: space[0] });
	}
	return list;
}

// Apply `[{ start, end }, text]` edits to `text`, last first.
export function applyEdits(text, edits) {
	return edits
		.sort((a, b) => b[0].start - a[0].start)
		.reduce(
			(next, [span, value]) =>
				next.slice(0, span.start) + value + next.slice(span.end),
			text
		);
}

#!/usr/bin/env node
// Lumi UI 0.5 → 0.6 field migration (see docs/UPGRADE.md).
//   node migrate-0.6.mjs <app-dir>          report the tags it would change
//   node migrate-0.6.mjs <app-dir> --write  rewrite them in place
// Input:  danger + dangerText → error, descriptionText → hint.
// Select: error + errorMessage → error (the message carries the invalid state).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const [root, flag] = process.argv.slice(2);
if (!root) {
	console.error('usage: node migrate-0.6.mjs <app-dir> [--write]');
	process.exit(1);
}
const write = flag === '--write';
const SKIP = new Set([
	'node_modules',
	'.svelte-kit',
	'build',
	'dist',
	'vendor',
	'.git',
	'public'
]);
const REMOVED = [
	'success',
	'warning',
	'successText',
	'warningText',
	'valIconSuccess',
	'valIconDanger',
	'valIconWarning',
	'iconNoBorder'
];

function svelteFiles(dir, out = []) {
	for (const name of readdirSync(dir)) {
		if (SKIP.has(name)) continue;
		const path = join(dir, name);
		if (statSync(path).isDirectory()) svelteFiles(path, out);
		else if (name.endsWith('.svelte')) out.push(path);
	}
	return out;
}

// Index of the closing `}` that matches the `{` at `start`, skipping strings.
function closeBrace(text, start) {
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
function tagEnd(src, start) {
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
function attributes(tag) {
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

// `x ?? undefined` and friends are redundant: every falsy error clears the field.
const message = (attr) =>
	attr.expr.replace(/\s*\?\?\s*(undefined|null|'')\s*$/, '');

function migrateTag(component, tag, file) {
	const attrs = Object.fromEntries(attributes(tag).map((a) => [a.name, a]));
	const edits = [];
	if (component === 'Input') {
		const { danger, dangerText, descriptionText } = attrs;
		if (dangerText) {
			edits.push([
				dangerText,
				`${dangerText.indent}error={${message(dangerText)}}`
			]);
			if (danger) edits.push([danger, '']);
		} else if (danger) {
			edits.push([danger, `${danger.indent}error={${message(danger)}}`]);
		}
		if (descriptionText) {
			const value = descriptionText.literal ?? `{${descriptionText.expr}}`;
			edits.push([descriptionText, `${descriptionText.indent}hint=${value}`]);
		}
		for (const name of REMOVED) {
			if (attrs[name])
				console.warn(`  manual: ${file} <Input> uses removed \`${name}\``);
		}
	} else if (attrs.errorMessage) {
		const { error, errorMessage } = attrs;
		const replacement = `error={${message(errorMessage)}}`;
		if (error) {
			edits.push([error, `${error.indent}${replacement}`], [errorMessage, '']);
		} else {
			edits.push([errorMessage, `${errorMessage.indent}${replacement}`]);
		}
	}
	return edits
		.sort((a, b) => b[0].start - a[0].start)
		.reduce(
			(next, [attr, text]) =>
				next.slice(0, attr.start) + text + next.slice(attr.end),
			tag
		);
}

let total = 0;
for (const file of svelteFiles(root)) {
	const src = readFileSync(file, 'utf8');
	const name = relative(root, file);
	const changes = [];
	for (const match of src.matchAll(/<(Input|Select)(?=[\s/>])/g)) {
		const end = tagEnd(src, match.index + 1);
		const tag = src.slice(match.index, end);
		const next = migrateTag(match[1], tag, name);
		if (next !== tag) changes.push({ start: match.index, end, next });
	}
	if (!changes.length) continue;
	total += changes.length;
	const lines = changes.map((c) => src.slice(0, c.start).split('\n').length);
	console.log(`${name}: ${changes.length} (lines ${lines.join(', ')})`);
	if (write) {
		const out = changes.reduceRight(
			(text, c) => text.slice(0, c.start) + c.next + text.slice(c.end),
			src
		);
		writeFileSync(file, out);
	}
}
console.log(`${write ? 'migrated' : 'would migrate'} ${total} tags in ${root}`);

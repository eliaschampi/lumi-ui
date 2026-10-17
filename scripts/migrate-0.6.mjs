#!/usr/bin/env node
// Lumi UI 0.5 → 0.6 field migration (see docs/UPGRADE.md).
//   node migrate-0.6.mjs <app-dir>          report the tags it would change
//   node migrate-0.6.mjs <app-dir> --write  rewrite them in place
// Input:  danger + dangerText → error, descriptionText → hint.
// Select: error + errorMessage → error (the message carries the invalid state).
import { readFileSync, writeFileSync } from 'node:fs';
import { relative } from 'node:path';
import { applyEdits, attributes, sourceFiles, tagEnd } from './svelte-tags.mjs';

const [root, flag] = process.argv.slice(2);
if (!root) {
	console.error('usage: node migrate-0.6.mjs <app-dir> [--write]');
	process.exit(1);
}
const write = flag === '--write';
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
	return applyEdits(tag, edits);
}

let total = 0;
for (const file of sourceFiles(root)) {
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

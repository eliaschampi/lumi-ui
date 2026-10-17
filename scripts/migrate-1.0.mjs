#!/usr/bin/env node
// Lumi UI 0.6 → 1.0 migration (see docs/UPGRADE.md).
//   node migrate-1.0.mjs <app-dir>                  report what would change
//   node migrate-1.0.mjs <app-dir> --write          rewrite renamed props in place
//   node migrate-1.0.mjs <app-dir> --write --icons  also turn literal icon names
//                                                   into deep Lucide imports
// Apps on 0.4/0.5 run migrate-0.6.mjs first. Run `svelte-check` afterwards
// and resolve every `manual:` line.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { applyEdits, attributes, sourceFiles, tagEnd } from './svelte-tags.mjs';
import {
	ENSURE,
	ICONS,
	MANUAL,
	PROPS,
	REMOVED_CLASSES,
	REPLACE,
	SNIPPETS
} from './migrate-1.0.rules.mjs';

const [root, ...flags] = process.argv.slice(2);
if (!root) {
	console.error('usage: node migrate-1.0.mjs <app-dir> [--write] [--icons]');
	process.exit(1);
}
const write = flags.includes('--write');
const convertIcons = flags.includes('--icons');
const removedClass = new RegExp(
	`(?<![\\w-])(${REMOVED_CLASSES.join('|')})(?![\\w-])`,
	'g'
);
// Components exported by Lumi: only their icon props are converted, because an
// app's own wrapper may still type its icon prop as a registered name.
const LUMI_TAGS = new Set(
	[
		...readFileSync(
			new URL('../src/lib/index.ts', import.meta.url),
			'utf8'
		).matchAll(/export \{([^}]*)\} from '\.\/components\//g)
	].flatMap((m) =>
		m[1]
			.split(',')
			.map((name) => name.trim())
			.filter((name) => /^[A-Z]/.test(name))
	)
);

// Classes that now need the opt-in '@lumi-ui/svelte/styles/patterns.css'.
const patternClasses = new Set(
	readFileSync(
		new URL('../src/lib/styles/patterns.css', import.meta.url),
		'utf8'
	)
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.match(/(?<=\.)lumi-[\w-]+/g)
);
const STYLES_IMPORT =
	/^(\s*)(@?import\s+)(['"])@lumi-ui\/svelte\/styles\3;?\s*$/m;
const PATTERNS = '@lumi-ui/svelte/styles/patterns.css';

let changed = 0;
let manual = 0;
let stringIcons = 0;
let dynamicIcons = 0;
let iconsRegistered = false;
let localeSet = false;
let usesPatterns = false;
const styleEntries = [];

const noted = new Set();
function note(file, line, text) {
	const key = `${file}:${line}:${text}`;
	if (noted.has(key)) return;
	noted.add(key);
	manual++;
	console.warn(`  manual: ${file}:${line} ${text}`);
}

const lineOf = (src, index) => src.slice(0, index).split('\n').length;
const iconName = (literal) => literal.slice(1, -1);
const iconImport = (name) => `${ICONS[name].component}Icon`;

// Props renamed, removed or added on one component tag.
function migrateTag(component, tag, report) {
	const rules = PROPS[component] ?? {};
	const attrs = attributes(tag);
	const edits = [];
	for (const attr of attrs) {
		const rule = rules[attr.name];
		if (!rule) continue;
		if (rule.drop && !attrs.some((a) => a.name === rule.unless)) {
			edits.push([attr, '']);
			continue;
		}
		if (rule.removed) {
			report(`<${component}> \`${attr.name}\` was removed: ${rule.removed}`);
			continue;
		}
		if (rule.mergeInto) {
			const target = attrs.find((a) => a.name === rule.mergeInto);
			const part = (a) =>
				a.literal ? a.literal.replace(/^'|'$/g, '"') : a.expr;
			if (
				target &&
				(target.literal || target.expr) &&
				(attr.literal || attr.expr)
			) {
				edits.push([attr, '']);
				edits.push([
					target,
					`${target.indent}${target.name}={[${part(target)}, ${part(attr)}].filter(Boolean).join(' ')}`
				]);
			} else {
				report(
					`<${component}> \`${attr.name}\` was removed: pass the full name in \`${rule.mergeInto}\``
				);
			}
			continue;
		}
		if (rule.note) report(`<${component}> ${rule.note}`);
		if (rule.to === attr.name) continue;
		const literal = attr.literal
			? iconName(attr.literal)
			: attr.expr !== null && `{${attr.expr}}`;
		if (rule.only && !rule.only.includes(literal)) {
			if (!attr.literal)
				report(
					`<${component}> \`${attr.name}\`: check the expression (${rule.to} for ${rule.only.join('/')})`
				);
			continue;
		}
		if (rules[rule.to] === undefined && attrs.some((a) => a.name === rule.to)) {
			report(
				`<${component}> has both \`${attr.name}\` and \`${rule.to}\` — keep one`
			);
			continue;
		}
		let value = attr.literal ?? (attr.expr === null ? '' : `{${attr.expr}}`);
		if (rule.values && literal && rule.values[literal]) {
			value = `"${rule.values[literal]}"`;
		} else if (rule.values && attr.expr !== null && !rule.values[literal]) {
			report(
				`<${component}> \`${attr.name}\` values changed: check the expression`
			);
		}
		edits.push([attr, `${attr.indent}${rule.to}${value ? `=${value}` : ''}`]);
	}
	const head = /^<[\w.]+/.exec(tag)[0].length;
	for (const [prop, value] of Object.entries(ENSURE[component] ?? {})) {
		if (attrs.some((a) => a.name === prop || a.expr === prop)) continue;
		if (attrs.some((a) => a.name.startsWith('...'))) {
			report(
				`<${component}> spreads props: ensure \`${prop}=${value}\` keeps 0.6 behaviour`
			);
			continue;
		}
		edits.push([{ start: head, end: head }, ` ${prop}=${value}`]);
	}
	return applyEdits(tag, edits);
}

// `icon="search"` → `icon={SearchIcon}` on any component tag.
function migrateIcons(tag, used, report) {
	const edits = [];
	if (!LUMI_TAGS.has(/^<([\w.]+)/.exec(tag)[1])) return tag;
	for (const attr of attributes(tag)) {
		if (!/^(icon|\w+Icon)$/.test(attr.name)) continue;
		if (attr.expr !== null && !/^[A-Z]\w*$/.test(attr.expr)) {
			// `cond ? 'eye' : 'eyeOff'` → `cond ? EyeIcon : EyeOffIcon`
			const names = [...attr.expr.matchAll(/(['"])(\w+)\1/g)].map((m) => m[2]);
			if (convertIcons && names.length && names.every((n) => ICONS[n])) {
				names.forEach((n) => used.add(n));
				const expr = attr.expr.replace(/(['"])(\w+)\1/g, (_, q, n) =>
					iconImport(n)
				);
				edits.push([attr, `${attr.indent}${attr.name}={${expr}}`]);
				stringIcons += names.length;
			} else {
				dynamicIcons++;
			}
			continue;
		}
		if (!attr.literal) continue;
		const name = iconName(attr.literal);
		if (!ICONS[name]) {
			report(`unknown icon name "${name}" — pass a Lucide component`);
			continue;
		}
		stringIcons++;
		if (!convertIcons) continue;
		used.add(name);
		edits.push([attr, `${attr.indent}${attr.name}={${iconImport(name)}}`]);
	}
	return applyEdits(tag, edits);
}

function addIconImports(src, used, report) {
	if (!used.size) return src;
	const lines = [...used]
		.sort()
		.map(
			(name) =>
				`\timport ${iconImport(name)} from '@lucide/svelte/icons/${ICONS[name].path}';`
		)
		.filter((line) => !src.includes(line));
	const script = /<script(?![^>]*\bmodule\b)[^>]*>\n?/.exec(src);
	if (!script) {
		report('add a <script> block for the converted icon imports');
		return src;
	}
	const at = script.index + script[0].length;
	return `${src.slice(0, at)}${lines.join('\n')}\n${src.slice(at)}`;
}

// Index range of the `</Name>` closing the element whose open tag ends at `from`.
function closeTag(src, name, from) {
	const pattern = new RegExp(`<(/?)${name}(?=[\\s/>])`, 'g');
	pattern.lastIndex = from;
	let depth = 1;
	for (let m; (m = pattern.exec(src));) {
		if (m[1]) {
			if (--depth === 0) return { start: m.index };
		} else if (src[tagEnd(src, m.index + 1) - 1] !== '/') depth++;
	}
	return null;
}

const SNIPPET_BLOCK = /\{#snippet\s[\s\S]*?\{\/snippet\}/g;

// New body for one element: renamed snippets, loose children moved into a
// snippet. Returns null when nothing changes.
function migrateBody(component, body, at) {
	const renames = SNIPPETS[component];
	let next = body;
	for (const [from, to] of Object.entries(renames)) {
		if (from === 'children') continue;
		const pattern = new RegExp(`\\{#snippet\\s+${from}\\(`, 'g');
		if (to === null) {
			if (pattern.test(next))
				at(
					`<${component}> snippet \`${from}\` was removed — use the matching text prop`
				);
			continue;
		}
		next = next.replace(pattern, `{#snippet ${to}(`);
	}
	const wrap = renames.children;
	const loose = wrap ? next.replace(SNIPPET_BLOCK, '').trim() : '';
	if (loose && !new RegExp(`\\{#snippet\\s+${wrap}\\(`).test(next)) {
		const blocks = next.match(SNIPPET_BLOCK) ?? [];
		const balanced =
			(next.match(/\{#snippet\s/g) ?? []).length === blocks.length &&
			blocks.every((block) => block.indexOf('{#snippet', 1) === -1);
		if (balanced) {
			next = `\n${blocks.map((block) => `${block}\n`).join('')}{#snippet ${wrap}()}\n${loose}\n{/snippet}\n`;
		} else {
			at(
				`<${component}> children become the \`${wrap}\` snippet — wrap the loose content`
			);
		}
	}
	return next === body ? null : next;
}

// One element at a time, re-scanning after each edit, so nested elements
// (a UserInfo inside a ListItem) never receive overlapping edits.
function migrateSnippets(src, report) {
	const pattern = new RegExp(
		`<(${Object.keys(SNIPPETS).join('|')})(?=[\\s/>])`,
		'g'
	);
	const seen = new Set();
	for (let pass = 0; pass < 500; pass++) {
		let edited = false;
		for (const match of src.matchAll(pattern)) {
			const open = tagEnd(src, match.index + 1);
			if (src[open - 1] === '/') continue;
			const close = closeTag(src, match[1], open + 1);
			if (!close) continue;
			const key = `${match.index}:${src.length}`;
			if (seen.has(key)) continue;
			seen.add(key);
			const next = migrateBody(
				match[1],
				src.slice(open + 1, close.start),
				(text) => report(text, match.index)
			);
			if (next === null) continue;
			src = src.slice(0, open + 1) + next + src.slice(close.start);
			changed++;
			edited = true;
			break;
		}
		if (!edited) return src;
	}
	return src;
}

function migrateSvelte(src, report) {
	const used = new Set();
	const changes = [];
	for (const match of src.matchAll(/<[A-Z][\w.]*(?=[\s/>])/g)) {
		const end = tagEnd(src, match.index + 1);
		const tag = src.slice(match.index, end);
		const at = (text) => report(text, match.index);
		const component = match[0].slice(1);
		let next =
			PROPS[component] || ENSURE[component]
				? migrateTag(component, tag, at)
				: tag;
		next = migrateIcons(next, used, at);
		if (next !== tag) changes.push({ start: match.index, end, next });
	}
	const out = changes.reduceRight(
		(text, c) => text.slice(0, c.start) + c.next + text.slice(c.end),
		src
	);
	changed += changes.length;
	return addIconImports(migrateSnippets(out, report), used, report);
}

for (const file of sourceFiles(root, ['.svelte', '.ts', '.js', '.css'])) {
	const src = readFileSync(file, 'utf8');
	const name = relative(root, file);
	const report = (text, index = 0) => note(name, lineOf(src, index), text);

	if (src.includes('setLumiLocale')) localeSet = true;
	if (src.includes('registerIcons')) iconsRegistered = true;
	if (src.includes(PATTERNS)) usesPatterns = null; // already imported
	if (usesPatterns === false) {
		usesPatterns = (src.match(/lumi-[\w-]+/g) ?? []).some((c) =>
			patternClasses.has(c)
		);
	}
	if (STYLES_IMPORT.test(src)) styleEntries.push(file);
	for (const match of src.matchAll(removedClass)) {
		report(`class \`${match[1]}\` was removed from Lumi CSS`, match.index);
	}
	for (const match of src.matchAll(/\bgetAvailableIcons\b/g)) {
		report(
			"`getAvailableIcons` was removed: use `Object.keys(lumiIcons)` from '@lumi-ui/svelte/icons'",
			match.index
		);
	}
	for (const match of src.matchAll(
		/^(?!\s*import).*\b(TAG_OPTIONS|DRIVE_MENU_OPTIONS|DRIVE_SCOPE_OPTIONS|DRIVE_SCOPE_SEGMENT_OPTIONS)\b/gm
	)) {
		report(
			`\`${match[1]}\` → get*() (rewritten): pass lumiDriveEs for Spanish labels`,
			match.index
		);
	}
	for (const [pattern, text] of MANUAL) {
		for (const match of src.matchAll(pattern)) report(text, match.index);
	}
	for (const match of src.matchAll(/\bvalidateDriveName\(/g)) {
		report(
			'validateDriveName returns English by default: pass lumiDriveEs as its dictionary (server code has no locale context)',
			match.index
		);
	}
	let text = src;
	for (const [from, to] of REPLACE) text = text.replaceAll(from, to);
	if (!file.endsWith('.svelte')) {
		if (text !== src) {
			console.log(`${name}: updated`);
			if (write) writeFileSync(file, text);
		}
		continue;
	}

	const next = migrateSvelte(text, report);
	if (next === src) continue;
	console.log(`${name}: updated`);
	if (write) writeFileSync(file, next);
}

// '@lumi-ui/svelte/styles' no longer includes patterns.css.
if (usesPatterns) {
	for (const file of styleEntries) {
		const src = readFileSync(file, 'utf8');
		const next = src.replace(
			STYLES_IMPORT,
			(line, indent, keyword, quote) =>
				`${line}\n${indent}${keyword}${quote}${PATTERNS}${quote};`
		);
		console.log(`${relative(root, file)}: adds ${PATTERNS}`);
		if (write) writeFileSync(file, next);
	}
	if (!styleEntries.length) {
		manual++;
		console.warn(`  manual: pattern classes are used — import '${PATTERNS}'`);
	}
}

if (!localeSet) {
	manual++;
	console.warn(
		"  manual: no setLumiLocale() found — built-in copy and formatting are English (en-US, USD) now; for Spanish call setLumiLocale({ locale: 'es-PE', currency: 'PEN', timeZone: 'America/Lima', messages: { ...lumiEs, ...lumiDriveEs } }) in the root layout"
	);
}
if (convertIcons && stringIcons) {
	const pkg = (() => {
		for (let dir = resolve(root); ; dir = dirname(dir)) {
			if (existsSync(join(dir, 'package.json')))
				return join(dir, 'package.json');
			if (dirname(dir) === dir) return null;
		}
	})();
	const deps = pkg ? JSON.parse(readFileSync(pkg, 'utf8')) : {};
	if (!{ ...deps.dependencies, ...deps.devDependencies }['@lucide/svelte']) {
		manual++;
		console.warn(
			'  manual: icons are imported from @lucide/svelte now — run `pnpm add @lucide/svelte`'
		);
	}
}
if (stringIcons && !convertIcons) {
	console.warn(
		`  manual: ${stringIcons} literal icon names — run with --icons to import them, or call registerIcons(lumiIcons) once (from '@lumi-ui/svelte/icons')`
	);
}
if (dynamicIcons && !iconsRegistered) {
	console.warn(
		`  manual: ${dynamicIcons} icon props take expressions — string values render nothing until registerIcons(lumiIcons) (or your own map) runs in the root layout`
	);
}
console.log(
	`${write ? 'migrated' : 'would migrate'} ${changed} tags; ${manual} manual notes in ${root}`
);

// Re-measures the Lightweight Contract in README.md and fails over budget:
//   pnpm run package && pnpm run size
// Fully minified Vite production ES bundles (Rolldown + Lightning CSS) with
// Svelte external; JavaScript and CSS gzip (level 9) separately, then sum.
import {
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { build } from 'vite';

const dist = resolve('dist');
const named = (...names) =>
	`export { ${names.join(', ')} } from '@lumi-ui/svelte';`;

const CSS = [
	['Global CSS (`/styles`)', ['index.css'], 7_800],
	['Lean CSS (`tokens.base` + `base`)', ['tokens.base.css', 'base.css'], 5_100]
];

const BUNDLES = [
	['Button', named('Button'), 3_000],
	['Divider', named('Divider'), 1_000],
	['Tooltip', named('Tooltip'), 4_300],
	['Dropdown', named('Dropdown', 'DropdownItem'), 5_800],
	['Select', named('Select'), 9_000],
	['Tabs', named('Tabs'), 3_500],
	['SegmentedControl', named('SegmentedControl'), 3_500],
	['ToggleGroup', named('ToggleGroup'), 3_500],
	['Skeleton', named('Skeleton'), 3_500],
	['Message', named('Message'), 3_500],
	['MessageList', named('MessageList'), 3_500],
	[
		'Form and table set',
		named(
			'Switch',
			'Radio',
			'Textarea',
			'Checkbox',
			'SegmentedControl',
			'Input',
			'Table'
		),
		15_500
	],
	[
		'Storefront set',
		named('Button', 'Card', 'Image', 'Chip', 'Input', 'Icon', 'Divider'),
		10_000
	],
	['All exports', `export * from '@lumi-ui/svelte';`, Infinity]
];

const gzip = (path) => gzipSync(readFileSync(path), { level: 9 }).length;

async function bundle(source) {
	const root = mkdtempSync(join(tmpdir(), 'lumi-size-'));
	const input = join(root, 'entry.js');
	const outDir = join(root, 'out');
	writeFileSync(input, source);
	await build({
		root,
		configFile: false,
		logLevel: 'silent',
		plugins: [svelte({ configFile: false })],
		resolve: {
			alias: { '@lumi-ui/svelte': join(dist, 'index.js') },
			conditions: ['svelte', 'browser', 'production', 'module', 'import']
		},
		build: {
			outDir,
			minify: true,
			cssMinify: 'lightningcss',
			cssCodeSplit: false,
			rollupOptions: {
				input,
				preserveEntrySignatures: 'strict',
				output: { format: 'es', entryFileNames: 'bundle.js' },
				external: (id) => id === 'svelte' || id.startsWith('svelte/')
			}
		}
	});
	const sizes = { js: 0, css: 0 };
	for (const { name, parentPath } of readdirSync(outDir, {
		recursive: true,
		withFileTypes: true
	})) {
		if (name.endsWith('.js')) sizes.js += gzip(join(parentPath, name));
		if (name.endsWith('.css')) sizes.css += gzip(join(parentPath, name));
	}
	rmSync(root, { recursive: true, force: true });
	return sizes;
}

const number = (value) => value.toLocaleString('en-US').padStart(8);
let over = 0;

function report(name, total, budget) {
	const exceeded = total > budget;
	if (exceeded) over++;
	const limit = budget === Infinity ? '' : ` / ${number(budget)}`;
	console.log(
		`${exceeded ? '✗' : ' '} ${name.padEnd(36)}${number(total)}${limit}`
	);
}

for (const [name, files, budget] of CSS) {
	const imports = files.map(
		(file) => `import ${JSON.stringify(join(dist, 'styles', file))};`
	);
	report(name, (await bundle(imports.join('\n'))).css, budget);
}

for (const [name, source, budget] of BUNDLES) {
	const { js, css } = await bundle(source);
	report(name, js + css, budget);
}

if (over) {
	console.error(`\n${over} surface(s) over budget.`);
	process.exit(1);
}

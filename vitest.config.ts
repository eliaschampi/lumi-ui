import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [svelte()],
	resolve: { conditions: ['browser'] },
	test: {
		include: ['tests/**/*.test.ts'],
		environment: 'jsdom',
		// Vitest empties stylesheets; source tests read them through `?raw`.
		css: { include: [/\.css\?raw/] },
		setupFiles: ['tests/setup.ts']
	}
});

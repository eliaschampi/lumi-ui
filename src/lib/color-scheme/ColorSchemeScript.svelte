<script lang="ts">
	import { createColorSchemeBootScript } from './boot';
	import type { ColorSchemeScriptProps } from './types';

	let {
		storageKey,
		defaultPreference
	}: ColorSchemeScriptProps = $props();

	const script = $derived(
		createColorSchemeBootScript({ storageKey, defaultPreference })
	);
</script>

<svelte:head>
	{@html `<script>${script}</script>`}
</svelte:head>

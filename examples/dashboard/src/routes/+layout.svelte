<script lang="ts">
	import { onMount } from 'svelte';
	import { ColorSchemeScript } from '@lumi-ui/svelte/color-scheme';
	import { colorScheme, colorSchemeOptions } from '$lib/color-scheme.svelte';
	import '@lumi-ui/svelte/styles';

	const { children } = $props();

	onMount(colorScheme.start);
</script>

<ColorSchemeScript {...colorSchemeOptions} />
{@render children?.()}

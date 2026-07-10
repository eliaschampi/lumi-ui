<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { FieldsetProps } from './types';

	interface Props extends FieldsetProps {
		children?: Snippet;
	}

	const { legend = '', class: className = '', children }: Props = $props();

	const classes = $derived.by(() => ['lumi-fieldset', className].filter(Boolean).join(' '));
</script>

<fieldset class={classes}>
	{#if legend}
		<legend class="lumi-fieldset__legend">{legend}</legend>
	{/if}
	<div class="lumi-fieldset__content">
		{#if children}
			{@render children()}
		{/if}
	</div>
</fieldset>

<style>
	.lumi-fieldset {
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border);
		border-radius: var(--lumi-radius-2xl);
		padding: var(--lumi-space-md);
		margin: 0;
		background:
			var(--lumi-gradient-subtle),
			color-mix(in srgb, var(--lumi-color-surface-inset) 22%, var(--lumi-color-surface-card));
		position: relative;
	}

	.lumi-fieldset__legend {
		background: color-mix(
			in srgb,
			var(--lumi-color-surface-inset) 22%,
			var(--lumi-color-surface-card)
		);
		color: var(--lumi-color-text-muted);
		padding: 0 var(--lumi-space-sm);
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		margin-left: var(--lumi-space-md);
		border-radius: var(--lumi-radius-base);
		position: relative;
		z-index: 1;
	}

	.lumi-fieldset__content {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-md);
	}
</style>

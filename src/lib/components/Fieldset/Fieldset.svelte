<script lang="ts">
	import type { FieldsetProps } from './types';

	const {
		legend = '',
		class: className = '',
		children
	}: FieldsetProps = $props();
</script>

<fieldset class={['lumi-fieldset', className]}>
	{#if legend}
		<legend class="lumi-fieldset__legend">{legend}</legend>
	{/if}
	<div class="lumi-fieldset__content">
		{@render children?.()}
	</div>
</fieldset>

<style>
	.lumi-fieldset {
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border);
		border-radius: var(--lumi-surface-radius);
		padding: var(--lumi-space-md);
		margin: 0;
		min-width: 0;
		background:
			var(--lumi-gradient-subtle),
			color-mix(
				in srgb,
				var(--lumi-color-surface-inset) 22%,
				var(--lumi-color-surface-card)
			);
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
		margin-inline-start: var(--lumi-space-md);
		border-radius: var(--lumi-radius-base);
	}

	.lumi-fieldset__content {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-md);
	}
</style>

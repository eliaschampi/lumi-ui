<script lang="ts">
	// Imported by a component, not the barrel: bundlers drop CSS imported by a
	// side-effect-free re-export module.
	import './field.css';
	import type { FieldLabelProps } from './types';

	const { for: htmlFor, label, required = false }: FieldLabelProps = $props();
</script>

<label for={htmlFor} class="lumi-field-label">
	{label}
	{#if required}
		<span class="lumi-field-label__required" aria-hidden="true">*</span>
	{/if}
</label>

<style>
	.lumi-field-label {
		margin-block-end: var(--lumi-space-xs);
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-semibold);
		color: var(--lumi-color-text);
		cursor: pointer;
		transition: color var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	/* The field root owns the accent, including the danger accent when invalid. */
	:global(:focus-within) > .lumi-field-label {
		color: var(--lumi-control-accent, var(--lumi-color-primary));
	}

	.lumi-field-label__required {
		margin-inline-start: var(--lumi-space-2xs);
		color: var(--lumi-color-danger);
	}
</style>

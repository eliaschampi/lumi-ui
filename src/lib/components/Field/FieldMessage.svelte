<script lang="ts">
	// Imported by a component, not the barrel: bundlers drop CSS imported by a
	// side-effect-free re-export module.
	import './field.css';
	import type { FieldMessageProps } from './types';

	const { id, error = '', hint = '' }: FieldMessageProps = $props();

	const text = $derived(error || hint);
</script>

<!-- Always mounted so the live region announces messages as they appear. -->
<div
	class="lumi-field-message"
	class:lumi-field-message--visible={!!text}
	aria-live="polite"
>
	{#if text}
		<span
			{id}
			class="lumi-field-message__text"
			class:lumi-field-message__text--error={!!error}
		>
			{text}
		</span>
	{/if}
</div>

<style>
	.lumi-field-message {
		display: grid;
		grid-template-rows: 0fr;
		margin-block-start: 0;
		overflow: hidden;
		transition:
			grid-template-rows var(--lumi-duration-base) var(--lumi-easing-default),
			margin-block-start var(--lumi-duration-base) var(--lumi-easing-default);
	}

	.lumi-field-message--visible {
		grid-template-rows: 1fr;
		margin-block-start: var(--lumi-space-xs);
	}

	.lumi-field-message__text {
		min-height: 0;
		overflow: hidden;
		padding-block-start: var(--lumi-space-2xs);
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
	}

	.lumi-field-message__text--error {
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-danger);
	}
</style>

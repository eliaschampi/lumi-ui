<script lang="ts">
	import { Button } from '../Button';
	import { Input } from '../Input';

	interface Props {
		fromValue?: string;
		toValue?: string;
		fromLabel?: string;
		toLabel?: string;
		applyLabel?: string;
		resetLabel?: string | null;
		disabled?: boolean;
		/** Smaller inputs; tighter gaps (toolbars, dense panels). */
		compact?: boolean;
		/** Omit the primary action; bind changes apply immediately (client-side filters). */
		hideApply?: boolean;
		onapply?: () => void;
		onreset?: () => void;
	}

	let {
		fromValue = $bindable(''),
		toValue = $bindable(''),
		fromLabel = 'Desde',
		toLabel = 'Hasta',
		applyLabel = 'Aplicar',
		resetLabel = null,
		disabled = false,
		compact = false,
		hideApply = false,
		onapply,
		onreset
	}: Props = $props();

	const inputSize = $derived(compact ? 'sm' : 'md');
	const buttonSize = $derived(compact ? 'sm' : 'md');

	const filtersClass = $derived(
		['lumi-inline-filters', compact && 'lumi-inline-filters--compact'].filter(Boolean).join(' ')
	);

	const showReset = $derived(Boolean(resetLabel && onreset));
	const showApply = $derived(!hideApply && Boolean(onapply));
</script>

<div class={filtersClass}>
	<div class="lumi-toolbar-field">
		<Input type="date" bind:value={fromValue} label={fromLabel} {disabled} size={inputSize} />
	</div>
	<div class="lumi-toolbar-field">
		<Input type="date" bind:value={toValue} label={toLabel} {disabled} size={inputSize} />
	</div>
	{#if showReset || showApply}
		<div class="lumi-inline-filters__actions">
			{#if showReset}
				<Button type="border" size={buttonSize} onclick={onreset} {disabled}>
					{resetLabel}
				</Button>
			{/if}
			{#if showApply}
				<Button
					type="filled"
					color="primary"
					icon="search"
					size={buttonSize}
					onclick={onapply}
					{disabled}
				>
					{applyLabel}
				</Button>
			{/if}
		</div>
	{/if}
</div>

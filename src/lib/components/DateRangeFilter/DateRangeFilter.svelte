<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { dateFrom: en.dateFrom, dateTo: en.dateTo, apply: en.apply };
</script>

<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import { useLumiLocale } from '../../i18n';
	import Button from '../Button/Button.svelte';
	import Input from '../Input/Input.svelte';
	import type { DateRangeFilterProps } from './types';

	let {
		fromValue = $bindable(''),
		toValue = $bindable(''),
		fromLabel,
		toLabel,
		applyLabel,
		disabled = false,
		compact = false,
		class: className = '',
		onapply
	}: DateRangeFilterProps = $props();

	const i18n = useLumiLocale(COPY);
	const size = $derived(compact ? 'sm' : 'md');
</script>

<div class={['lumi-date-range', className]}>
	<Input
		type="date"
		bind:value={fromValue}
		label={fromLabel ?? i18n.t.dateFrom}
		max={toValue || undefined}
		{disabled}
		{size}
		class="lumi-date-range__field"
	/>
	<Input
		type="date"
		bind:value={toValue}
		label={toLabel ?? i18n.t.dateTo}
		min={fromValue || undefined}
		{disabled}
		{size}
		class="lumi-date-range__field"
	/>
	{#if onapply}
		<Button
			variant="flat"
			color="info"
			icon={Search}
			{size}
			aria-label={applyLabel ?? i18n.t.apply}
			{disabled}
			onclick={onapply}
		/>
	{/if}
</div>

<style>
	/* Fields share the row and wrap below the minimum width; no media query. */
	.lumi-date-range {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: var(--lumi-space-sm);
	}

	.lumi-date-range :global(.lumi-date-range__field) {
		flex: 1 1 var(--lumi-min-width-md);
		inline-size: auto;
	}
</style>

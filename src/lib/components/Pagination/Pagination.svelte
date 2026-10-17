<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		pagination: en.pagination,
		paginationPrevious: en.paginationPrevious,
		paginationNext: en.paginationNext,
		paginationPage: en.paginationPage,
		paginationStatus: en.paginationStatus
	};

	/** Page numbers with `0` marking a gap: 1 … 4 5 6 … 10. */
	function pageItems(page: number, pages: number, siblings: number): number[] {
		if (pages <= siblings * 2 + 5) {
			return Array.from({ length: pages }, (_, i) => i + 1);
		}
		const start = Math.max(
			Math.min(page - siblings, pages - siblings * 2 - 2),
			3
		);
		const end = Math.min(
			Math.max(page + siblings, siblings * 2 + 3),
			pages - 2
		);
		const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
		return [
			1,
			start > 3 ? 0 : 2,
			...middle,
			end < pages - 2 ? 0 : pages - 1,
			pages
		];
	}
</script>

<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { useLumiLocale } from '../../i18n';
	import Button from '../Button/Button.svelte';
	import type { PaginationProps } from './types';

	let {
		page = $bindable(1),
		pages,
		siblings = 1,
		compact = false,
		size = 'sm',
		disabled = false,
		href,
		'aria-label': ariaLabel,
		class: className = '',
		onpagechange
	}: PaginationProps = $props();

	const i18n = useLumiLocale(COPY);
	const total = $derived(Math.max(1, Math.floor(pages) || 1));
	const current = $derived(Math.min(Math.max(1, Math.floor(page) || 1), total));
	const items = $derived(
		pageItems(current, total, Math.max(0, Math.floor(siblings)))
	);

	function go(event: MouseEvent, target: number): void {
		// Modified clicks open links elsewhere; leave them to the browser.
		if (
			href &&
			(event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey ||
				event.button)
		) {
			return;
		}
		page = target;
		onpagechange?.(target);
	}
</script>

{#snippet step(target: number, rel: 'prev' | 'next')}
	{@const outside = target < 1 || target > total}
	<Button
		variant="border"
		{size}
		icon={rel === 'prev' ? ChevronLeft : ChevronRight}
		iconAfter={rel === 'next'}
		disabled={disabled || outside}
		href={href && (outside ? '' : href(target))}
		rel={href && rel}
		onclick={(event) => go(event, target)}
	>
		{rel === 'prev' ? i18n.t.paginationPrevious : i18n.t.paginationNext}
	</Button>
{/snippet}

<nav
	class={[
		'lumi-pagination',
		size === 'md' && 'lumi-pagination--md',
		compact && 'lumi-pagination--compact',
		className
	]}
	aria-label={ariaLabel ?? i18n.t.pagination}
>
	{@render step(current - 1, 'prev')}

	<ol class="lumi-pagination__pages">
		{#each items as item, index (item || `gap-${index}`)}
			<li>
				{#if item}
					<Button
						variant={item === current ? 'flat' : 'ghost'}
						{size}
						{disabled}
						href={href?.(item)}
						class="lumi-pagination__page"
						aria-label={i18n.t.paginationPage(item)}
						aria-current={item === current ? 'page' : undefined}
						onclick={(event) => go(event, item)}
					>
						{item}
					</Button>
				{:else}
					<span class="lumi-pagination__gap" aria-hidden="true">…</span>
				{/if}
			</li>
		{/each}
	</ol>

	<span class="lumi-pagination__status" aria-live="polite">
		<span aria-hidden="true">{current} / {total}</span>
		<span class="lumi-sr-only">{i18n.t.paginationStatus(current, total)}</span>
	</span>

	{@render step(current + 1, 'next')}
</nav>

<style>
	/* Numbers collapse to a "2 / 5" status in narrow containers. */
	.lumi-pagination {
		container-type: inline-size;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-xs);
		inline-size: 100%;
		font-variant-numeric: tabular-nums;
	}

	.lumi-pagination--md {
		--lumi-pagination-size: var(--lumi-control-height-md);
	}

	.lumi-pagination__pages {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-2xs);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.lumi-pagination :global(.lumi-pagination__page) {
		min-inline-size: var(--lumi-pagination-size, var(--lumi-control-height-sm));
		padding-inline: var(--lumi-space-xs);
	}

	.lumi-pagination__gap {
		display: inline-grid;
		place-items: center;
		min-inline-size: var(--lumi-space-lg);
		color: var(--lumi-color-text-muted);
	}

	/* Announces page changes only in compact or narrow layouts, where shown. */
	.lumi-pagination__status {
		display: none;
		padding-inline: var(--lumi-space-sm);
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-text-muted);
	}

	.lumi-pagination--compact .lumi-pagination__pages {
		display: none;
	}

	.lumi-pagination--compact .lumi-pagination__status {
		display: inline;
	}

	@container (max-width: 30rem) {
		.lumi-pagination__pages {
			display: none;
		}

		.lumi-pagination__status {
			display: inline;
		}
	}
</style>

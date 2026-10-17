<script lang="ts">
	import type { SkeletonProps } from './types';

	const {
		shape = 'text',
		width,
		height,
		lines = 1,
		class: className = ''
	}: SkeletonProps = $props();

	const count = $derived(
		shape === 'text' ? Math.max(1, Math.floor(lines) || 1) : 1
	);
</script>

<!-- Decorative: the region being loaded carries aria-busy="true". -->
{#if count > 1}
	<span
		class={['lumi-skeleton-lines', className]}
		style:inline-size={width}
		aria-hidden="true"
	>
		{#each { length: count }, index (index)}
			<span class="lumi-skeleton lumi-skeleton--text" style:block-size={height}
			></span>
		{/each}
	</span>
{:else}
	<span
		class={['lumi-skeleton', `lumi-skeleton--${shape}`, className]}
		style:inline-size={width ?? (shape === 'circle' ? height : undefined)}
		style:block-size={shape === 'circle' ? undefined : height}
		aria-hidden="true"
	></span>
{/if}

<style>
	/* Shimmer and shapes come from the shared .lumi-skeleton recipe. */
	.lumi-skeleton-lines {
		display: flex;
		flex-direction: column;
		/* Gaps match the leading of real text at the same font size. */
		gap: calc((var(--lumi-line-height-normal) - 1) * 1em);
	}

	.lumi-skeleton-lines > :last-child {
		inline-size: 60%;
	}
</style>

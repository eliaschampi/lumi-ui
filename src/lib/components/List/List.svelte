<script lang="ts">
	import type { ListProps } from './types';

	const {
		size = 'md',
		color,
		disabled = false,
		maxHeight,
		class: className,
		children
	}: ListProps = $props();
</script>

<!-- role="list" keeps list semantics in Safari once list-style is removed. -->
<ul
	class={[
		'lumi-list',
		size === 'sm' && 'lumi-list--sm',
		maxHeight && `lumi-list--max-${maxHeight}`,
		className
	]}
	style:--lumi-control-accent={color && `var(--lumi-color-${color})`}
	role="list"
	inert={disabled || undefined}
>
	{@render children?.()}
</ul>

<style>
	.lumi-list {
		--lumi-list-item-padding: var(--lumi-space-sm) var(--lumi-space-md);
		--lumi-list-icon-size: var(--lumi-icon-sm);
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		inline-size: 100%;
		padding: var(--lumi-space-xs);
		list-style: none;
		background: color-mix(
			in srgb,
			var(--lumi-color-surface-glass-strong) 78%,
			var(--lumi-color-background-hover) 22%
		);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
		border-radius: var(--lumi-surface-radius);
	}

	.lumi-list--sm {
		--lumi-list-item-padding: var(--lumi-space-xs) var(--lumi-space-sm);
		--lumi-list-icon-size: var(--lumi-icon-xs);
	}

	/* Inner scroller only when capped; unbounded lists stay in the parent. */
	.lumi-list--max-sm,
	.lumi-list--max-md,
	.lumi-list--max-lg {
		overflow: hidden auto;
		overscroll-behavior: contain;
	}

	.lumi-list--max-sm {
		max-block-size: calc(var(--lumi-space-3xl) * 3);
	}

	.lumi-list--max-md {
		max-block-size: calc(var(--lumi-space-3xl) * 4);
	}

	.lumi-list--max-lg {
		max-block-size: calc(var(--lumi-space-3xl) * 5);
	}

	.lumi-list[inert] {
		opacity: var(--lumi-opacity-disabled);
	}
</style>

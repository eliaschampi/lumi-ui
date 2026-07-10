<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ListProps } from './types';

	interface Props extends ListProps {
		children?: Snippet;
	}

	const {
		size = 'md',
		color,
		disabled = false,
		maxHeight,
		class: className = '',
		children
	}: Props = $props();

	const classes = $derived(
		[
			'lumi-list',
			`lumi-list--${size}`,
			color && `lumi-list--${color}`,
			disabled && 'lumi-list--disabled',
			maxHeight && `lumi-list--max-${maxHeight}`,
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={classes} role="list">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.lumi-list {
		--list-accent: var(--lumi-color-primary);
		--list-border: color-mix(
			in srgb,
			var(--list-accent) 6%,
			var(--lumi-color-border-glass)
		);
		--list-shell-bg: color-mix(
			in srgb,
			var(--lumi-color-surface-glass-strong) 78%,
			var(--lumi-color-background-hover) 22%
		);
		--list-item-padding: var(--lumi-space-sm) var(--lumi-space-md);
		--list-item-title-size: var(--lumi-font-size-sm);
		--list-item-subtitle-size: var(--lumi-font-size-xs);
		--list-icon-size: var(--lumi-icon-sm);
		--list-scroll-track: var(--lumi-color-background);
		--list-scroll-thumb: var(--lumi-color-border-strong);
		width: 100%;
		font-family: var(--lumi-font-family-sans);
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		padding: var(--lumi-space-xs);
		background: var(--list-shell-bg);
		border: var(--lumi-border-width-thin) solid var(--list-border);
		border-radius: var(--lumi-radius-2xl);
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		scrollbar-color: var(--list-scroll-thumb) var(--list-scroll-track);
	}

	/* Size variants */
	.lumi-list--sm {
		--list-item-padding: var(--lumi-space-xs) var(--lumi-space-sm);
		--list-item-title-size: var(--lumi-font-size-sm);
		--list-item-subtitle-size: var(--lumi-font-size-xs);
		--list-icon-size: var(--lumi-icon-xs);
	}

	.lumi-list--md {
		--list-item-padding: var(--lumi-space-sm) var(--lumi-space-md);
		--list-item-title-size: var(--lumi-font-size-sm);
		--list-item-subtitle-size: var(--lumi-font-size-xs);
		--list-icon-size: var(--lumi-icon-sm);
	}

	.lumi-list--primary {
		--list-accent: var(--lumi-color-primary);
	}

	.lumi-list--secondary {
		--list-accent: var(--lumi-color-secondary);
	}

	.lumi-list--success {
		--list-accent: var(--lumi-color-success);
	}

	.lumi-list--warning {
		--list-accent: var(--lumi-color-warning);
	}

	.lumi-list--danger {
		--list-accent: var(--lumi-color-danger);
	}

	.lumi-list--info {
		--list-accent: var(--lumi-color-info);
	}

	/* Bounded scroll area presets (token-based, no hardcode) */
	.lumi-list--max-sm {
		max-block-size: calc(var(--lumi-space-3xl) * 3);
	}

	.lumi-list--max-md {
		max-block-size: calc(var(--lumi-space-3xl) * 4);
	}

	.lumi-list--max-lg {
		max-block-size: calc(var(--lumi-space-3xl) * 5);
	}

	.lumi-list::-webkit-scrollbar {
		width: var(--lumi-space-2xs);
	}

	.lumi-list::-webkit-scrollbar-track {
		background: var(--list-scroll-track);
		border-radius: var(--lumi-radius-full);
	}

	.lumi-list::-webkit-scrollbar-thumb {
		background: var(--list-scroll-thumb);
		border-radius: var(--lumi-radius-full);
	}

	.lumi-list::-webkit-scrollbar-thumb:hover {
		background: var(--lumi-color-text-muted);
	}

	/* Disabled state */
	.lumi-list--disabled {
		opacity: var(--lumi-opacity-disabled);
		filter: saturate(0.8);
		pointer-events: none;
	}
</style>

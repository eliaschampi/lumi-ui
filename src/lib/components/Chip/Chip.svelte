<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Icon } from '../Icon';
	import type { ChipProps } from './types';

	interface Props extends ChipProps {
		children?: Snippet;
	}

	const {
		color = 'primary',
		size = 'md',
		icon = '',
		closable = false,
		class: className = '',
		children,
		onclose,
		onclick
	}: Props = $props();

	// Computed classes
	const classes = $derived(
		[
			'lumi-chip',
			`lumi-chip--${color}`,
			`lumi-chip--${size}`,
			onclick && 'lumi-chip--interactive',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	const iconSize = $derived(size === 'sm' ? 'xs' : 'sm');

	// Event handlers
	const handleClose = (event: MouseEvent) => {
		event.stopPropagation();
		if (onclose) onclose(event);
	};

	const handleClick = (event: MouseEvent) => {
		if (onclick) onclick(event);
	};
</script>

{#snippet content()}
	{#if icon}
		<span class="lumi-chip__icon">
			<Icon {icon} size={iconSize} />
		</span>
	{/if}

	<span class="lumi-chip__text">
		{#if children}
			{@render children()}
		{/if}
	</span>
{/snippet}

<div
	class={classes}
	style:--chip-color="var(--lumi-color-{color})"
	style:--chip-bg="var(--lumi-color-{color}-bg)"
>
	{#if onclick}
		<button type="button" class="lumi-chip__action" onclick={handleClick}>
			{@render content()}
		</button>
	{:else}
		{@render content()}
	{/if}

	{#if closable}
		<!-- Close button -->
		<button
			type="button"
			class="lumi-chip__close"
			aria-label="Cerrar chip"
			onclick={handleClose}
		>
			<Icon icon="x" size="sm" />
		</button>
	{/if}
</div>

<style>
	/* ============================================================================
	 * CHIP COMPONENT - Beautiful & Consistent
	 * ============================================================================ */

	.lumi-chip {
		--lumi-chip-padding-block: var(--lumi-space-xs);
		--lumi-chip-padding-inline: var(--lumi-space-sm);
		--lumi-chip-gap: var(--lumi-space-xs);
		--lumi-chip-font-size: var(--lumi-font-size-sm);
		--lumi-chip-min-height: var(--lumi-control-height-sm);
		--lumi-chip-close-size: var(--lumi-space-md);
		--chip-color: var(--lumi-color-primary);
		--chip-bg: var(--lumi-color-primary-bg);
		--lumi-control-accent: var(--chip-color);
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		gap: var(--lumi-chip-gap);
		inline-size: fit-content;
		max-inline-size: 100%;
		min-height: var(--lumi-chip-min-height);
		padding: var(--lumi-chip-padding-block) var(--lumi-chip-padding-inline);
		border-radius: var(--lumi-radius-full);
		font-size: var(--lumi-chip-font-size);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-tight);
		transition:
			background-color var(--lumi-duration-fast) var(--lumi-easing-default),
			color var(--lumi-duration-fast) var(--lumi-easing-default),
			border-color var(--lumi-duration-fast) var(--lumi-easing-default);
		white-space: nowrap;
		cursor: default;
		user-select: none;
		background: var(--chip-bg);
		color: var(--chip-color);
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--chip-color) 24%, transparent);
		box-shadow: inset 0 var(--lumi-border-width-thin) 0
			color-mix(in srgb, var(--lumi-color-white) 18%, transparent);
	}

	/* Size variants */
	.lumi-chip--sm {
		--lumi-chip-padding-block: var(--lumi-space-2xs);
		--lumi-chip-padding-inline: var(--lumi-space-xs);
		--lumi-chip-gap: var(--lumi-space-2xs);
		--lumi-chip-font-size: var(--lumi-font-size-xs);
		--lumi-chip-min-height: var(--lumi-control-height-xs);
		--lumi-chip-close-size: var(--lumi-space-sm);
	}

	.lumi-chip__action {
		display: inline-flex;
		align-items: center;
		gap: var(--lumi-chip-gap);
		min-width: 0;
		padding: 0;
		background: transparent;
		border: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	/* Icon styling */
	.lumi-chip__icon {
		flex-shrink: 0;
		color: currentColor;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Text styling */
	.lumi-chip__text {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: inherit;
	}

	/* Close button styling */
	.lumi-chip__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--lumi-chip-close-size);
		height: var(--lumi-chip-close-size);
		padding: 0;
		margin-left: var(--lumi-space-2xs);
		background: transparent;
		border: none;
		border-radius: var(--lumi-radius-full);
		color: currentColor;
		cursor: pointer;
		transition: background-color var(--lumi-duration-fast)
			var(--lumi-easing-default);
		flex-shrink: 0;
	}

	.lumi-chip__close:hover {
		background: color-mix(in srgb, currentColor 15%, transparent);
	}

	.lumi-chip__close:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-chip--interactive:hover {
		background: color-mix(
			in srgb,
			var(--chip-color) 16%,
			var(--lumi-color-surface-card)
		);
		border-color: color-mix(in srgb, var(--chip-color) 34%, transparent);
	}

	.lumi-chip__action:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
		border-radius: var(--lumi-radius-full);
	}
</style>

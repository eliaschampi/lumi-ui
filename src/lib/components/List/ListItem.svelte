<script lang="ts">
	import { Icon } from '../Icon';
	import type { ListItemProps, ListText } from './types';

	const {
		title,
		description,
		icon,
		leading,
		trailing,
		href,
		onclick,
		selected = false,
		disabled = false,
		class: className
	}: ListItemProps = $props();

	const interactive = $derived(!disabled && Boolean(href || onclick));
</script>

{#snippet text(value: ListText)}
	{#if typeof value === 'function'}{@render value()}{:else}{value}{/if}
{/snippet}

<li
	class={[
		'lumi-list-item',
		interactive && 'lumi-list-item--interactive',
		selected && 'lumi-list-item--selected',
		disabled && 'lumi-list-item--disabled',
		className
	]}
>
	{#if leading}
		<span class="lumi-list-item__leading">{@render leading()}</span>
	{:else if icon}
		<Icon {icon} size="var(--lumi-list-icon-size, var(--lumi-icon-sm))" />
	{/if}

	<span class="lumi-list-item__content">
		<!-- The title is the single target; ::after stretches it over the row. -->
		{#if href && !disabled}
			<a
				{href}
				class="lumi-list-item__title lumi-list-item__target"
				aria-current={selected || undefined}
				{onclick}
			>
				{@render text(title ?? '')}
			</a>
		{:else if onclick}
			<button
				type="button"
				class="lumi-list-item__title lumi-list-item__target"
				aria-current={selected || undefined}
				{disabled}
				{onclick}
			>
				{@render text(title ?? '')}
			</button>
		{:else if title}
			<span class="lumi-list-item__title">{@render text(title)}</span>
		{/if}
		{#if description}
			<span class="lumi-list-item__description">
				{@render text(description)}
			</span>
		{/if}
	</span>

	{#if trailing}
		<span class="lumi-list-item__trailing">{@render trailing()}</span>
	{/if}
</li>

<style>
	.lumi-list-item {
		--lumi-list-item-accent: var(
			--lumi-control-accent,
			var(--lumi-color-primary)
		);
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--lumi-space-md);
		min-block-size: calc(var(--lumi-space-xxl) + var(--lumi-space-2xs));
		padding: var(
			--lumi-list-item-padding,
			var(--lumi-space-sm) var(--lumi-space-md)
		);
		border-radius: var(--lumi-radius-control);
		color: var(--lumi-color-text);
		line-height: var(--lumi-line-height-normal);
		transition: var(--lumi-transition-interactive);
	}

	.lumi-list-item > :global(.lumi-icon) {
		color: var(--lumi-color-text-muted);
	}

	.lumi-list-item__leading {
		display: inline-flex;
		flex-shrink: 0;
	}

	.lumi-list-item__content {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		min-inline-size: 0;
	}

	.lumi-list-item__title {
		overflow: hidden;
		color: inherit;
		font: inherit;
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-tight);
		text-align: start;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	button.lumi-list-item__title {
		padding: 0;
		background: none;
		border: 0;
		cursor: pointer;
	}

	.lumi-list-item__target::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}

	.lumi-list-item__target:focus-visible {
		outline: none;
	}

	.lumi-list-item__target:focus-visible::after {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-list-item__description {
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-xs);
	}

	/* Above the stretched target so actions stay independently clickable. */
	.lumi-list-item__trailing {
		position: relative;
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--lumi-space-sm);
		margin-inline-start: auto;
	}

	.lumi-list-item--interactive:hover {
		background: color-mix(
			in srgb,
			var(--lumi-list-item-accent) 5%,
			transparent
		);
		transform: translateY(var(--lumi-interactive-lift));
	}

	.lumi-list-item--interactive:hover > :global(.lumi-icon) {
		color: inherit;
	}

	.lumi-list-item--interactive:active {
		transform: none;
	}

	.lumi-list-item--selected,
	.lumi-list-item--selected:hover {
		background: color-mix(
			in srgb,
			var(--lumi-list-item-accent) 9%,
			transparent
		);
		box-shadow: var(--lumi-shadow-sm);
		transform: none;
	}

	.lumi-list-item--selected::before {
		content: '';
		position: absolute;
		inset-block: var(--lumi-space-xs);
		inset-inline-start: var(--lumi-space-2xs);
		inline-size: var(--lumi-border-width-thick);
		border-radius: var(--lumi-radius-full);
		background: var(--lumi-list-item-accent);
	}

	.lumi-list-item--selected .lumi-list-item__title {
		font-weight: var(--lumi-font-weight-semibold);
	}

	.lumi-list-item--selected > :global(.lumi-icon) {
		color: var(--lumi-list-item-accent);
	}

	.lumi-list-item--disabled {
		opacity: var(--lumi-opacity-disabled);
	}
</style>

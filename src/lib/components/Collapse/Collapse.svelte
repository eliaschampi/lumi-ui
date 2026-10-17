<script lang="ts">
	import type { CollapseProps } from './types';

	let {
		title = '',
		open = $bindable(false),
		color = 'primary',
		size = 'md',
		disabled = false,
		class: className,
		children,
		ontoggle
	}: CollapseProps = $props();

	const instanceId = $props.id();
	const panelId = `lumi-collapse-panel-${instanceId}`;

	function toggle(): void {
		open = !open;
		ontoggle?.(open);
	}
</script>

<div
	class={[
		'lumi-collapse',
		size !== 'md' && `lumi-collapse--${size}`,
		open && 'lumi-collapse--open',
		disabled && 'lumi-collapse--disabled',
		className
	]}
	style:--lumi-control-accent="var(--lumi-color-{color})"
>
	<button
		type="button"
		class="lumi-collapse__trigger"
		aria-expanded={open}
		aria-controls={panelId}
		{disabled}
		onclick={toggle}
	>
		<span class="lumi-collapse__title">{title}</span>
		<svg
			class="lumi-collapse__icon"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
	</button>

	<!-- Always rendered: the grid row animates open in CSS and `inert` keeps
	     the closed panel out of the tab order. -->
	<div id={panelId} class="lumi-collapse__content" inert={!open}>
		<div class="lumi-collapse__clip">
			<div class="lumi-collapse__body">{@render children?.()}</div>
		</div>
	</div>
</div>

<style>
	.lumi-collapse {
		--collapse-padding: var(--lumi-space-md) var(--lumi-space-lg);
		--collapse-min-height: var(--lumi-control-height-lg);
		--collapse-title-size: var(--lumi-font-size-base);
		--collapse-body-padding: var(--lumi-space-lg);
		position: relative;
		isolation: isolate;
		margin-block-end: var(--lumi-space-sm);
		overflow: hidden;
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
		border-radius: var(--lumi-surface-radius);
		background:
			var(--lumi-gradient-subtle), var(--lumi-color-surface-glass-strong);
		box-shadow: var(--lumi-shadow-sm);
		transition: var(--lumi-transition-control);
	}

	.lumi-collapse--sm {
		--collapse-padding: var(--lumi-space-sm) var(--lumi-space-md);
		--collapse-min-height: var(--lumi-control-height-md);
		--collapse-title-size: var(--lumi-font-size-sm);
		--collapse-body-padding: var(--lumi-space-md);
	}

	.lumi-collapse--lg {
		--collapse-padding: var(--lumi-space-lg) var(--lumi-space-xl);
		--collapse-min-height: var(--lumi-control-height-xl);
		--collapse-title-size: var(--lumi-font-size-lg);
		--collapse-body-padding: var(--lumi-space-xl);
	}

	.lumi-collapse::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		background: var(--lumi-gradient-card-sheen);
		opacity: var(--lumi-card-sheen-opacity);
		pointer-events: none;
	}

	.lumi-collapse:hover:not(.lumi-collapse--disabled, .lumi-collapse--open) {
		border-color: var(--lumi-color-border-strong);
	}

	.lumi-collapse--open {
		border-color: var(--lumi-color-border-interactive);
		box-shadow: var(--lumi-shadow-md);
	}

	.lumi-collapse--disabled {
		opacity: var(--lumi-opacity-disabled);
	}

	.lumi-collapse__trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--lumi-space-md);
		inline-size: 100%;
		min-block-size: var(--collapse-min-height);
		padding: var(--collapse-padding);
		background: transparent;
		border: 0;
		color: var(--lumi-color-text);
		font: inherit;
		text-align: start;
		cursor: pointer;
		transition: var(--lumi-transition-control);
	}

	.lumi-collapse__trigger:disabled {
		cursor: not-allowed;
	}

	.lumi-collapse__trigger:hover:enabled,
	.lumi-collapse__trigger:focus-visible {
		background: color-mix(
			in srgb,
			var(--lumi-color-surface-glass) 55%,
			transparent
		);
	}

	.lumi-collapse__trigger:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-collapse__title {
		font-size: var(--collapse-title-size);
		font-weight: var(--lumi-font-weight-medium);
	}

	.lumi-collapse__icon {
		flex-shrink: 0;
		inline-size: var(--lumi-icon-md);
		block-size: var(--lumi-icon-md);
		color: var(--lumi-color-text-muted);
		transition:
			transform var(--lumi-duration-slow) var(--lumi-easing-default),
			color var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-collapse--open .lumi-collapse__icon {
		color: var(--lumi-control-accent);
		transform: rotate(180deg);
	}

	/* 0fr → 1fr animates to the content's real height without measuring. */
	.lumi-collapse__content {
		display: grid;
		grid-template-rows: 0fr;
		border-block-start: var(--lumi-border-width-thin) solid transparent;
		transition:
			grid-template-rows var(--lumi-duration-slow) var(--lumi-easing-default),
			border-color var(--lumi-duration-slow) var(--lumi-easing-default);
	}

	.lumi-collapse--open .lumi-collapse__content {
		grid-template-rows: 1fr;
		border-block-start-color: var(--lumi-color-border-glass);
	}

	.lumi-collapse__clip {
		min-block-size: 0;
		overflow: hidden;
	}

	.lumi-collapse__body {
		padding: var(--collapse-body-padding);
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-sm);
		line-height: var(--lumi-line-height-relaxed);
	}
</style>

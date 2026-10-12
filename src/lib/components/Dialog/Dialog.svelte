<script lang="ts">
	import { onDestroy, untrack, type Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { portal } from '../../actions/portal';
	import { registerModal } from '../../utils/modal';
	import Icon from '../Icon/Icon.svelte';
	import { LUMI_CONFIG } from '../config';
	import type { DialogProps } from './types';

	interface Props extends DialogProps {
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		title = '',
		size = 'md',
		persistent = false,
		scrollable = false,
		fullScreen = false,
		hideClose = false,
		closeLabel = 'Cerrar diálogo',
		closeOnEscape = true,
		class: className = '',
		onclose,
		onopen,
		onafteropen,
		onafterclose,
		children,
		header,
		footer
	}: Props = $props();

	let dialogElement: HTMLDivElement | undefined = $state();
	let afterCloseTimer: number | undefined;
	let destroyed = false;
	let pointerDownOnOverlay = false;

	const uniqueId = $props.id();
	const titleId = `lumi-dialog-title-${uniqueId}`;
	const contentId = `lumi-dialog-content-${uniqueId}`;
	const transitionDuration = LUMI_CONFIG.transitions.base;

	const dialogClasses = $derived.by(() =>
		[
			'lumi-dialog',
			!fullScreen && `lumi-dialog--${size}`,
			scrollable && 'lumi-dialog--scrollable',
			fullScreen && 'lumi-dialog--full-screen',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	const overlayClasses = $derived.by(() =>
		[
			'lumi-dialog-overlay',
			persistent && 'lumi-dialog-overlay--persistent',
			fullScreen && 'lumi-dialog-overlay--full-screen'
		]
			.filter(Boolean)
			.join(' ')
	);

	function handleClose(): void {
		if (!open) return;
		open = false;
		onclose?.();
	}

	function handleOverlayPointerDown(event: PointerEvent): void {
		pointerDownOnOverlay = !persistent && event.target === event.currentTarget;
	}

	function handleOverlayClick(event: MouseEvent): void {
		const wasPointerDownOnOverlay = pointerDownOnOverlay;
		pointerDownOnOverlay = false;

		if (persistent) return;
		if (!wasPointerDownOnOverlay) return;
		if (event.target !== event.currentTarget) return;

		handleClose();
	}

	$effect(() => {
		if (!open || !dialogElement) return;
		window.clearTimeout(afterCloseTimer);
		const release = registerModal(dialogElement, () => {
			if (!closeOnEscape) return false;
			handleClose();
		});
		untrack(() => onopen?.());
		const duration = untrack(() => transitionDuration);

		const afterOpenTimer = window.setTimeout(() => {
			onafteropen?.();
		}, duration);

		return () => {
			window.clearTimeout(afterOpenTimer);
			release();
			window.clearTimeout(afterCloseTimer);
			if (!destroyed) {
				afterCloseTimer = window.setTimeout(() => onafterclose?.(), duration);
			}
		};
	});

	onDestroy(() => {
		destroyed = true;
		clearTimeout(afterCloseTimer);
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events (Backdrop dismissal is pointer-only; keyboard users close with Escape or the close button.) -->
	<div
		bind:this={dialogElement}
		use:portal
		class={overlayClasses}
		transition:fade={{ duration: transitionDuration }}
		onpointerdown={handleOverlayPointerDown}
		onclick={handleOverlayClick}
		role="dialog"
		aria-labelledby={title && !header ? titleId : undefined}
		aria-label={header || !title ? title || 'Dialog' : undefined}
		aria-describedby={contentId}
		tabindex="-1"
	>
		<div
			class={dialogClasses}
			transition:scale={{ duration: transitionDuration, start: 0.96 }}
		>
			{#if header || title || !hideClose}
				<header class="lumi-dialog__header">
					<div class="lumi-dialog__header-content">
						{#if header}
							{@render header()}
						{:else if title}
							<h2 id={titleId} class="lumi-dialog__title">
								{title}
							</h2>
						{/if}
					</div>

					{#if !hideClose}
						<button
							class="lumi-dialog__close"
							type="button"
							aria-label={closeLabel}
							onclick={handleClose}
						>
							<Icon icon="x" size="md" />
						</button>
					{/if}
				</header>
			{/if}

			<div id={contentId} class="lumi-dialog__content">
				{#if children}
					{@render children()}
				{/if}
			</div>

			{#if footer}
				<footer class="lumi-dialog__footer">
					{@render footer()}
				</footer>
			{/if}
		</div>
	</div>
{/if}

<style>
	/*
	 * Layout contract on the portal root. Children inherit.
	 * Tokens must not live only on `.lumi-dialog` — overlay padding and
	 * size vars are consumed by the parent and would resolve as invalid.
	 */
	.lumi-dialog-overlay {
		--lumi-dialog-width-sm: 25rem;
		--lumi-dialog-width-md: 31.25rem;
		--lumi-dialog-width-lg: 43.75rem;
		--lumi-dialog-width-xl: 56.25rem;
		--lumi-dialog-max-height: 90dvh;
		--lumi-dialog-content-max-height: 60dvh;
		--lumi-dialog-full-width: 100vw;
		--lumi-dialog-full-height: 100dvh;
		--lumi-dialog-overlay-padding: var(--lumi-space-lg);
		--lumi-dialog-overlay-padding-mobile: var(--lumi-space-sm);
		--lumi-dialog-mobile-max-width: calc(
			100vw - (var(--lumi-dialog-overlay-padding-mobile) * 2)
		);
		--lumi-dialog-mobile-max-height: calc(
			100dvh -
				max(
					var(--lumi-dialog-overlay-padding-mobile),
					var(--lumi-safe-area-top)
				) -
				max(
					var(--lumi-dialog-overlay-padding-mobile),
					var(--lumi-safe-area-bottom)
				)
		);
		position: fixed;
		inset: 0;
		background: var(--lumi-color-overlay);
		z-index: var(--lumi-z-modal-backdrop);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: max(var(--lumi-dialog-overlay-padding), var(--lumi-safe-area-top))
			max(var(--lumi-dialog-overlay-padding), var(--lumi-safe-area-right))
			max(var(--lumi-dialog-overlay-padding), var(--lumi-safe-area-bottom))
			max(var(--lumi-dialog-overlay-padding), var(--lumi-safe-area-left));
		cursor: pointer;
		overflow-y: auto;
		overscroll-behavior: contain;
		outline: none;
	}

	.lumi-dialog-overlay--full-screen {
		padding: 0;
	}

	.lumi-dialog-overlay--persistent {
		cursor: default;
	}

	.lumi-dialog {
		--lumi-surface-bg: var(--lumi-color-surface-overlay);
		--lumi-surface-radius-local: var(--lumi-layout-floating-radius);
		--lumi-surface-shadow: var(--lumi-shadow-xl);
		position: relative;
		max-height: var(--lumi-dialog-max-height);
		width: 100%;
		display: flex;
		flex-direction: column;
		cursor: default;
		z-index: var(--lumi-z-modal);
		overflow: hidden;
	}

	.lumi-dialog--sm {
		max-width: var(--lumi-dialog-width-sm);
		width: 100%;
	}

	.lumi-dialog--md {
		max-width: var(--lumi-dialog-width-md);
		width: 100%;
	}

	.lumi-dialog--lg {
		max-width: var(--lumi-dialog-width-lg);
		width: 100%;
	}

	.lumi-dialog--xl {
		max-width: var(--lumi-dialog-width-xl);
		width: 100%;
	}

	.lumi-dialog--scrollable .lumi-dialog__content {
		overflow-y: auto;
		max-height: var(--lumi-dialog-content-max-height);
	}

	.lumi-dialog--full-screen {
		max-width: none;
		max-height: none;
		width: var(--lumi-dialog-full-width);
		height: var(--lumi-dialog-full-height);
		padding: var(--lumi-safe-area-top) var(--lumi-safe-area-right)
			var(--lumi-safe-area-bottom) var(--lumi-safe-area-left);
		--lumi-surface-radius-local: var(--lumi-radius-none);
	}

	.lumi-dialog--full-screen .lumi-dialog__content {
		flex: 1;
		overflow-y: auto;
	}

	.lumi-dialog__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--lumi-space-lg);
		border-bottom: var(--lumi-border-width-thin) solid var(--lumi-color-border);
		background: var(--lumi-color-surface-raised);
		border-top-left-radius: var(--lumi-layout-floating-radius);
		border-top-right-radius: var(--lumi-layout-floating-radius);
		flex-shrink: 0;
	}

	.lumi-dialog__header-content {
		flex: 1;
		min-width: 0;
	}

	.lumi-dialog__title {
		margin: 0;
		font-size: var(--lumi-font-size-lg);
		font-weight: var(--lumi-font-weight-bold);
		color: var(--lumi-color-text);
		line-height: var(--lumi-line-height-tight);
	}

	.lumi-dialog__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--lumi-space-xl);
		height: var(--lumi-space-xl);
		margin-left: var(--lumi-space-md);
		background: transparent;
		border: var(--lumi-border-width-thin) solid transparent;
		border-radius: var(--lumi-radius-full);
		color: var(--lumi-color-text-muted);
		cursor: pointer;
		transition: var(--lumi-transition-interactive);
		flex-shrink: 0;
	}

	.lumi-dialog__close:hover {
		background: color-mix(
			in srgb,
			var(--lumi-color-primary-bg) 45%,
			transparent
		);
		color: var(--lumi-color-text);
		border-color: color-mix(
			in srgb,
			var(--lumi-color-primary) 20%,
			var(--lumi-color-border)
		);
		transform: scale(var(--lumi-interactive-hover-scale));
	}

	.lumi-dialog__close:active {
		transform: scale(var(--lumi-interactive-press-scale));
	}

	.lumi-dialog__close:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-dialog__content {
		flex: 1;
		padding: var(--lumi-space-lg);
		color: var(--lumi-color-text);
		line-height: var(--lumi-line-height-normal);
		background: var(--lumi-color-surface);
		overflow-x: hidden;
		overflow-y: auto;
		min-width: 0;
		min-height: 0;
		overscroll-behavior: contain;
	}

	.lumi-dialog__content::-webkit-scrollbar {
		width: var(--lumi-space-2xs);
	}

	.lumi-dialog__content::-webkit-scrollbar-track {
		background: transparent;
	}

	.lumi-dialog__content::-webkit-scrollbar-thumb {
		background: var(--lumi-color-border);
		border-radius: var(--lumi-radius-full);
	}

	.lumi-dialog__footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--lumi-space-md);
		padding: var(--lumi-space-lg);
		border-top: var(--lumi-border-width-thin) solid var(--lumi-color-border);
		flex-shrink: 0;
		background: var(--lumi-color-surface-raised);
		border-bottom-left-radius: var(--lumi-layout-floating-radius);
		border-bottom-right-radius: var(--lumi-layout-floating-radius);
	}

	@media (max-width: 48rem) {
		.lumi-dialog-overlay {
			--lumi-dialog-overlay-padding: var(--lumi-dialog-overlay-padding-mobile);
			align-items: center;
		}

		.lumi-dialog {
			max-width: var(--lumi-dialog-mobile-max-width);
			max-height: var(--lumi-dialog-mobile-max-height);
			--lumi-surface-radius-local: var(--lumi-layout-floating-radius-mobile);
		}

		.lumi-dialog--full-screen {
			height: var(--lumi-dialog-full-height);
			max-height: var(--lumi-dialog-full-height);
			--lumi-surface-radius-local: var(--lumi-radius-none);
		}

		.lumi-dialog__header {
			padding: var(--lumi-space-md);
			border-top-left-radius: var(--lumi-layout-floating-radius-mobile);
			border-top-right-radius: var(--lumi-layout-floating-radius-mobile);
		}

		.lumi-dialog__content {
			padding: var(--lumi-space-md);
		}

		.lumi-dialog__footer {
			padding: var(--lumi-space-md);
			flex-direction: column-reverse;
			gap: var(--lumi-space-sm);
			border-bottom-left-radius: var(--lumi-layout-floating-radius-mobile);
			border-bottom-right-radius: var(--lumi-layout-floating-radius-mobile);
		}

		.lumi-dialog__footer :global(.lumi-button) {
			width: 100%;
		}
	}
</style>

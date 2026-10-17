<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		messages: en.messages,
		messagesLatest: en.messagesLatest,
		messagesLoadingEarlier: en.messagesLoadingEarlier
	};

	// Distance (px) from the end that still counts as reading the latest message.
	const EDGE = 24;
</script>

<script lang="ts">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import { useLumiLocale } from '../../i18n';
	import type { MessageListProps } from './types';

	const {
		'aria-label': ariaLabel,
		busy = false,
		loading = false,
		onloadmore,
		class: className = '',
		children
	}: MessageListProps = $props();

	const i18n = useLumiLocale(COPY);

	let viewport: HTMLDivElement | undefined = $state();
	let content: HTMLDivElement | undefined = $state();
	let sentinel: HTMLDivElement | undefined = $state();
	let atEnd = $state(true);

	// Plain fields: scroll bookkeeping must not re-run effects.
	let follow = true;
	let lastTop = 0;
	let anchor: { el: Element; top: number } | null = null;

	const offsetIn = (el: Element, box: HTMLElement) =>
		el.getBoundingClientRect().top - box.getBoundingClientRect().top;

	function measure(box: HTMLElement): void {
		atEnd = box.scrollHeight - box.scrollTop - box.clientHeight <= EDGE;
		if (atEnd) follow = true;
		else if (box.scrollTop < lastTop) follow = false; // the reader scrolled up
		lastTop = box.scrollTop;
	}

	/** Scroll to the newest message and keep following new ones. */
	export function scrollToEnd(behavior: ScrollBehavior = 'auto'): void {
		if (!viewport) return;
		follow = true;
		viewport.scrollTo({ top: viewport.scrollHeight, behavior });
	}

	function jumpToLatest(): void {
		const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
		scrollToEnd(still ? 'auto' : 'smooth');
		// The button goes inert at the end; keep focus inside the transcript.
		viewport?.focus({ preventScroll: true });
	}

	// Keep the live edge in view while following; otherwise hold the reader's
	// place when earlier messages are prepended (native anchoring may already
	// have done it, in which case the measured shift is zero).
	$effect(() => {
		const box = viewport;
		if (!box || !content) return;
		box.scrollTop = box.scrollHeight;
		const observer = new ResizeObserver(() => {
			if (follow) {
				box.scrollTop = box.scrollHeight;
			} else if (anchor?.el.isConnected) {
				const shift = offsetIn(anchor.el, box) - anchor.top;
				if (Math.abs(shift) >= 1) box.scrollTop += shift;
			}
			measure(box);
		});
		observer.observe(box);
		observer.observe(content);

		// Direct input ends prepend anchoring; later shifts are the reader's own.
		const release = () => (anchor = null);
		const onScroll = () => measure(box);
		const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
		box.addEventListener('scroll', onScroll, { passive: true });
		for (const type of inputs) {
			box.addEventListener(type, release, { passive: true });
		}
		return () => {
			observer.disconnect();
			box.removeEventListener('scroll', onScroll);
			for (const type of inputs) box.removeEventListener(type, release);
		};
	});

	// Ask for history half a viewport before the reader reaches the top.
	$effect(() => {
		// Re-created when loading ends, so a still-visible top asks again.
		const box = viewport;
		if (!box || !sentinel || !content || loading) return;
		const list = content;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				const first = list.firstElementChild;
				anchor = first ? { el: first, top: offsetIn(first, box) } : null;
				onloadmore?.();
			},
			{ root: box, rootMargin: '50% 0px 0px 0px' }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});
</script>

<div class={['lumi-message-list', className]}>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (A scrollable region must be keyboard reachable.) -->
	<div
		bind:this={viewport}
		class="lumi-message-list__viewport lumi-scrollbar"
		role="region"
		aria-label={ariaLabel || i18n.t.messages}
		tabindex="0"
	>
		{#if onloadmore}
			<div bind:this={sentinel} class="lumi-message-list__sentinel"></div>
		{/if}
		<div
			bind:this={content}
			class="lumi-message-list__content"
			role="log"
			aria-live="polite"
			aria-relevant="additions"
			aria-busy={busy || undefined}
		>
			{@render children?.()}
		</div>
	</div>

	<!-- Floats over the transcript so loading never shifts the reader's place. -->
	<div class="lumi-message-list__status" role="status">
		{#if loading}
			<span class="lumi-surface lumi-message-list__pill">
				<span class="lumi-spinner" aria-hidden="true"></span>
				{i18n.t.messagesLoadingEarlier}
			</span>
		{/if}
	</div>

	<button
		type="button"
		class="lumi-surface lumi-message-list__latest"
		class:lumi-message-list__latest--visible={!atEnd}
		aria-label={i18n.t.messagesLatest}
		title={i18n.t.messagesLatest}
		inert={atEnd}
		onclick={jumpToLatest}
	>
		<ArrowDown />
	</button>
</div>

<style>
	/* Give the list a height (or a flex/grid track); it scrolls inside. */
	.lumi-message-list {
		position: relative;
		display: flex;
		flex-direction: column;
		block-size: 100%;
		min-block-size: 0;
	}

	.lumi-message-list__viewport {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-block-size: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		border-radius: inherit;
	}

	.lumi-message-list__viewport:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-message-list__sentinel {
		flex: none;
		block-size: var(--lumi-border-width-thin);
	}

	/* Short conversations rest at the bottom, like a chat. */
	.lumi-message-list__content {
		display: flex;
		flex-direction: column;
		margin-block-start: auto;
		padding: var(--lumi-space-md);
	}

	.lumi-message-list__status {
		position: absolute;
		inset-block-start: var(--lumi-space-sm);
		inset-inline: 0;
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	.lumi-message-list__pill {
		--lumi-surface-radius-local: var(--lumi-radius-full);
		display: inline-flex;
		align-items: center;
		gap: var(--lumi-space-xs);
		padding: var(--lumi-space-2xs) var(--lumi-space-sm);
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
	}

	.lumi-message-list__latest {
		--lumi-surface-radius-local: var(--lumi-radius-full);
		position: absolute;
		inset-block-end: var(--lumi-space-md);
		inset-inline: 0;
		display: grid;
		place-items: center;
		inline-size: var(--lumi-control-height-sm);
		block-size: var(--lumi-control-height-sm);
		margin-inline: auto;
		padding: 0;
		color: var(--lumi-color-text);
		cursor: pointer;
		opacity: 0;
		scale: 0.9;
		pointer-events: none;
		transition:
			var(--lumi-transition-control),
			opacity var(--lumi-duration-fast) var(--lumi-easing-default),
			scale var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-message-list__latest--visible {
		opacity: 1;
		scale: 1;
		pointer-events: auto;
	}

	.lumi-message-list__latest:hover {
		color: var(--lumi-color-primary);
	}

	.lumi-message-list__latest:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-space-2xs);
	}

	.lumi-message-list__latest :global(svg) {
		inline-size: var(--lumi-icon-sm);
		block-size: var(--lumi-icon-sm);
	}
</style>

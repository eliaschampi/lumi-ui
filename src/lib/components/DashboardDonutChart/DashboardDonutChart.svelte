<script lang="ts">
	import { portal } from '../../actions/portal';
	import {
		CHART_COLOR_VARS,
		CHART_PADDING
	} from '../../utils/chartCoordinates';
	import { formatChartValue } from '../../utils/chartFormat';
	import {
		MIN_CHART_WIDTH,
		placeChartTooltip,
		useChartWidth
	} from '../../utils/chartLayout.svelte';
	import type { DashboardDonutChartProps } from './types';

	const {
		data,
		height = 220,
		centerLabel = '',
		centerValue = '',
		valueFormat = 'number',
		emptyMessage = 'No hay datos suficientes para mostrar este gráfico.',
		'aria-label': ariaLabel = 'Gráfico circular del dashboard',
		class: className = ''
	}: DashboardDonutChartProps = $props();

	const INNER_RADIUS_RATIO = 0.62;
	const FULL_TURN = Math.PI * 2;
	const START_ANGLE = -Math.PI / 2;

	const percentFormatter = new Intl.NumberFormat('es-PE', {
		style: 'percent',
		maximumFractionDigits: 0
	});

	const layout = useChartWidth(MIN_CHART_WIDTH);

	let hoveredKey = $state<string | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipEl = $state<HTMLDivElement | undefined>();

	const classes = $derived(
		['lumi-donut-chart', className].filter(Boolean).join(' ')
	);
	const chartW = $derived(layout.chartW);
	const chartH = $derived(height);
	const centerX = $derived(chartW / 2);
	const centerY = $derived(chartH / 2);
	const outerRadius = $derived(
		Math.max(24, Math.min(chartW, chartH) / 2 - CHART_PADDING.top)
	);
	const innerRadius = $derived(outerRadius * INNER_RADIUS_RATIO);

	const entries = $derived(
		data.map((slice) => ({
			...slice,
			value: Number.isFinite(slice.value) ? Math.max(0, slice.value) : 0
		}))
	);
	const total = $derived(entries.reduce((sum, slice) => sum + slice.value, 0));
	const hasValues = $derived(total > 0);

	const legend = $derived(
		entries.map((slice) => ({
			key: slice.key,
			label: slice.label,
			color: CHART_COLOR_VARS[slice.color],
			value: formatChartValue(slice.value, valueFormat, 'tooltip'),
			share: total > 0 ? percentFormatter.format(slice.value / total) : ''
		}))
	);

	const arcs = $derived.by(() => {
		if (!hasValues) return [];

		const positive = entries.filter((slice) => slice.value > 0);
		let angle = START_ANGLE;

		return positive.map((slice) => {
			const sweep = (slice.value / total) * FULL_TURN;
			const start = angle;
			angle += sweep;

			return {
				key: slice.key,
				label: slice.label,
				fill: CHART_COLOR_VARS[slice.color],
				value: formatChartValue(slice.value, valueFormat, 'tooltip'),
				share: percentFormatter.format(slice.value / total),
				full: positive.length === 1,
				path: ringPath(start, angle)
			};
		});
	});

	const hovered = $derived(arcs.find((arc) => arc.key === hoveredKey) ?? null);

	function pointOnCircle(radius: number, angle: number): string {
		return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
	}

	function ringPath(start: number, end: number): string {
		const largeArc = end - start > Math.PI ? 1 : 0;

		return [
			`M${pointOnCircle(outerRadius, start)}`,
			`A${outerRadius},${outerRadius} 0 ${largeArc} 1 ${pointOnCircle(outerRadius, end)}`,
			`L${pointOnCircle(innerRadius, end)}`,
			`A${innerRadius},${innerRadius} 0 ${largeArc} 0 ${pointOnCircle(innerRadius, start)}`,
			'Z'
		].join('');
	}

	function setHover(key: string, event: PointerEvent): void {
		hoveredKey = key;
		const position = placeChartTooltip(event, tooltipEl);
		tooltipX = position.x;
		tooltipY = position.y;
	}

	function clearHover(): void {
		hoveredKey = null;
	}
</script>

<div bind:this={layout.root} class={classes}>
	<div class="lumi-donut-chart__plot" style:height="{chartH}px">
		{#if !hasValues}
			<div class="lumi-donut-chart__empty">
				<p class="lumi-margin--none lumi-text--sm lumi-text--muted">
					{emptyMessage}
				</p>
			</div>
		{:else}
			<svg
				viewBox="0 0 {chartW} {chartH}"
				preserveAspectRatio="xMidYMid meet"
				class="lumi-donut-chart__svg"
				role="img"
				aria-label={ariaLabel}
				onpointerleave={clearHover}
			>
				{#each arcs as arc (arc.key)}
					{#if arc.full}
						<circle
							cx={centerX}
							cy={centerY}
							r={(outerRadius + innerRadius) / 2}
							fill="none"
							stroke={arc.fill}
							stroke-width={outerRadius - innerRadius}
							class="lumi-donut-chart__slice"
							role="presentation"
							aria-hidden="true"
							onpointerenter={(event) => setHover(arc.key, event)}
							onpointermove={(event) => setHover(arc.key, event)}
						/>
					{:else}
						<path
							d={arc.path}
							fill={arc.fill}
							class="lumi-donut-chart__slice"
							class:lumi-donut-chart__slice--muted={hoveredKey !== null &&
								hoveredKey !== arc.key}
							role="presentation"
							aria-hidden="true"
							onpointerenter={(event) => setHover(arc.key, event)}
							onpointermove={(event) => setHover(arc.key, event)}
						/>
					{/if}
				{/each}

				{#if centerLabel}
					<text
						x={centerX}
						y={centerY - (centerValue ? 6 : -4)}
						text-anchor="middle"
						class="lumi-donut-chart__center-label"
					>
						{centerLabel}
					</text>
				{/if}
				{#if centerValue}
					<text
						x={centerX}
						y={centerY + (centerLabel ? 16 : 6)}
						text-anchor="middle"
						class="lumi-donut-chart__center-value"
					>
						{centerValue}
					</text>
				{/if}
			</svg>
		{/if}
	</div>

	{#if hasValues && legend.length > 0}
		<ul class="lumi-donut-chart__legend">
			{#each legend as item (item.key)}
				<li class="lumi-donut-chart__legend-item">
					<span
						class="lumi-donut-chart__legend-dot"
						style:background={item.color}
					></span>
					<span class="lumi-donut-chart__legend-label">{item.label}</span>
					<span class="lumi-donut-chart__legend-value">
						{item.value}{item.share ? ` · ${item.share}` : ''}
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>

{#if hovered}
	<div
		bind:this={tooltipEl}
		class="lumi-chart-tooltip"
		use:portal
		style:left="{tooltipX}px"
		style:top="{tooltipY}px"
	>
		<span class="lumi-chart-tooltip__title">{hovered.label}</span>
		<div class="lumi-chart-tooltip__row">
			<span class="lumi-chart-tooltip__dot" style:background={hovered.fill}
			></span>
			<span class="lumi-chart-tooltip__value">
				{hovered.value} · {hovered.share}
			</span>
		</div>
	</div>
{/if}

<style>
	.lumi-donut-chart {
		width: 100%;
		min-width: 0;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-sm);
	}

	.lumi-donut-chart__plot {
		width: 100%;
		min-width: 0;
		position: relative;
	}

	.lumi-donut-chart__empty {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--lumi-space-lg);
		border: var(--lumi-border-width-thin) dashed var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-panel);
	}

	.lumi-donut-chart__svg {
		width: 100%;
		height: 100%;
		display: block;
		touch-action: pan-y;
	}

	.lumi-donut-chart__slice {
		cursor: pointer;
		stroke: var(--lumi-color-surface);
		stroke-width: var(--lumi-border-width-thick);
		transition: opacity var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-donut-chart__slice--muted {
		opacity: 0.42;
	}

	.lumi-donut-chart__center-label {
		font-size: var(--lumi-font-size-xs);
		fill: var(--lumi-color-text-muted);
	}

	.lumi-donut-chart__center-value {
		font-size: var(--lumi-font-size-lg);
		font-weight: var(--lumi-font-weight-semibold);
		fill: var(--lumi-color-text);
	}

	.lumi-donut-chart__legend {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		margin: 0;
		padding: 0;
		list-style: none;
		min-width: 0;
	}

	.lumi-donut-chart__legend-item {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-xs);
		min-width: 0;
	}

	.lumi-donut-chart__legend-dot {
		width: var(--lumi-space-xs);
		min-width: var(--lumi-space-xs);
		height: var(--lumi-space-xs);
		border-radius: var(--lumi-radius-full);
	}

	.lumi-donut-chart__legend-label {
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
		flex: 1 1 auto;
	}

	.lumi-donut-chart__legend-value {
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-text);
		white-space: nowrap;
	}
</style>

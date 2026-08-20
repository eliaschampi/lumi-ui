<script lang="ts">
	import { portal } from '../../actions/portal';
	import {
		CHART_COLOR_VARS,
		CHART_PADDING,
		CHART_Y_TICKS,
		ceilNice,
		chartGradientId,
		computeSparseXLabels,
		truncateAxisLabel
	} from '../../utils/chartCoordinates';
	import { formatChartValue } from '../../utils/chartFormat';
	import {
		MIN_CHART_WIDTH,
		placeChartTooltip,
		useChartWidth
	} from '../../utils/chartLayout.svelte';
	import type { DashboardBarChartProps } from './types';

	const {
		data,
		color = 'primary',
		height = 260,
		valueFormat = 'number',
		xLabelMaxLength = 12,
		emptyMessage = 'No hay datos suficientes para mostrar este gráfico.',
		'aria-label': ariaLabel = 'Gráfico de barras del dashboard',
		class: className = ''
	}: DashboardBarChartProps = $props();

	const layout = useChartWidth(MIN_CHART_WIDTH);

	let hoveredIndex = $state<number | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipEl = $state<HTMLDivElement | undefined>();

	const fillColor = $derived(CHART_COLOR_VARS[color]);
	const values = $derived(
		data.map((point) => point.value).filter(Number.isFinite)
	);
	const hasValues = $derived(
		valueFormat === 'score'
			? values.length > 0
			: values.some((value) => value > 0)
	);
	const classes = $derived(
		['lumi-bar-chart', className].filter(Boolean).join(' ')
	);
	const chartW = $derived(layout.chartW);
	const chartH = $derived(height);
	const plotW = $derived(
		Math.max(1, chartW - CHART_PADDING.left - CHART_PADDING.right)
	);
	const plotH = $derived(
		Math.max(1, chartH - CHART_PADDING.top - CHART_PADDING.bottom)
	);
	const bandW = $derived(plotW / Math.max(data.length, 1));
	const barW = $derived(Math.max(4, Math.min(bandW * 0.58, plotH * 0.18)));
	const maxValue = $derived(Math.max(...values, 1));
	const niceMax = $derived(
		valueFormat === 'score'
			? Math.max(20, ceilNice(maxValue))
			: ceilNice(maxValue)
	);
	const yTicks = $derived(
		Array.from(
			{ length: CHART_Y_TICKS + 1 },
			(_, i) => (niceMax / CHART_Y_TICKS) * i
		)
	);
	const xLabels = $derived(
		computeSparseXLabels(data, (index) => barCenter(index))
	);
	const gradientId = $derived(
		chartGradientId(
			'bar',
			color,
			data.map((point) => point.key)
		)
	);

	const hoveredPoint = $derived(
		hoveredIndex !== null ? data[hoveredIndex] : null
	);

	function scaleY(value: number): number {
		return CHART_PADDING.top + plotH - (value / niceMax) * plotH;
	}

	function barX(index: number): number {
		return CHART_PADDING.left + index * bandW + (bandW - barW) / 2;
	}

	function barHeight(value: number): number {
		if (!Number.isFinite(value) || value <= 0) return 0;
		return Math.max(0, CHART_PADDING.top + plotH - scaleY(value));
	}

	function barCenter(index: number): number {
		return barX(index) + barW / 2;
	}

	function formatValue(value: number): string {
		return formatChartValue(value, valueFormat, 'axis');
	}

	function formatTooltipValue(value: number): string {
		return formatChartValue(value, valueFormat, 'tooltip');
	}

	function setHover(index: number, event: PointerEvent): void {
		hoveredIndex = index;
		const position = placeChartTooltip(event, tooltipEl);
		tooltipX = position.x;
		tooltipY = position.y;
	}

	function clearHover(): void {
		hoveredIndex = null;
	}
</script>

<div bind:this={layout.root} class={classes} style:height="{height}px">
	{#if !hasValues}
		<div class="lumi-bar-chart__empty">
			<p class="lumi-margin--none lumi-text--sm lumi-text--muted">
				{emptyMessage}
			</p>
		</div>
	{:else}
		<svg
			viewBox="0 0 {chartW} {chartH}"
			preserveAspectRatio="xMidYMid meet"
			class="lumi-bar-chart__svg"
			role="img"
			aria-label={ariaLabel}
			onpointerleave={clearHover}
		>
			<defs>
				<linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color={fillColor} stop-opacity="0.86" />
					<stop offset="100%" stop-color={fillColor} stop-opacity="0.38" />
				</linearGradient>
			</defs>

			{#each yTicks as tick (tick)}
				<line
					x1={CHART_PADDING.left}
					y1={scaleY(tick)}
					x2={chartW - CHART_PADDING.right}
					y2={scaleY(tick)}
					class="lumi-bar-chart__grid"
				/>
				<text
					x={CHART_PADDING.left - 8}
					y={scaleY(tick) + 3}
					text-anchor="end"
					class="lumi-bar-chart__label"
				>
					{formatValue(tick)}
				</text>
			{/each}

			{#each data as point, index (point.key)}
				<rect
					x={barX(index)}
					y={scaleY(Math.max(0, point.value))}
					width={barW}
					height={barHeight(point.value)}
					fill="url(#{gradientId})"
					class="lumi-bar-chart__bar"
					class:lumi-bar-chart__bar--muted={hoveredIndex !== null &&
						hoveredIndex !== index}
				/>
			{/each}

			{#if hoveredIndex !== null}
				<line
					x1={barCenter(hoveredIndex)}
					y1={CHART_PADDING.top}
					x2={barCenter(hoveredIndex)}
					y2={CHART_PADDING.top + plotH}
					class="lumi-bar-chart__crosshair"
				/>
			{/if}

			{#each data as point, index (point.key)}
				<rect
					x={CHART_PADDING.left + index * bandW}
					y={CHART_PADDING.top}
					width={bandW}
					height={plotH}
					fill="transparent"
					class="lumi-bar-chart__hit"
					aria-hidden="true"
					onpointerenter={(event) => setHover(index, event)}
					onpointermove={(event) => setHover(index, event)}
				/>
			{/each}

			{#each xLabels as xLabel (xLabel.key)}
				<text
					x={xLabel.x}
					y={chartH - 8}
					text-anchor="middle"
					class="lumi-bar-chart__label"
				>
					{truncateAxisLabel(xLabel.label, xLabelMaxLength)}
				</text>
			{/each}
		</svg>
	{/if}
</div>

{#if hoveredPoint}
	<div
		bind:this={tooltipEl}
		class="lumi-chart-tooltip"
		use:portal
		style:left="{tooltipX}px"
		style:top="{tooltipY}px"
	>
		<span class="lumi-chart-tooltip__title">{hoveredPoint.label}</span>
		<div class="lumi-chart-tooltip__row">
			<span class="lumi-chart-tooltip__dot" style:background={fillColor}></span>
			<span class="lumi-chart-tooltip__value"
				>{formatTooltipValue(hoveredPoint.value)}</span
			>
		</div>
	</div>
{/if}

<style>
	.lumi-bar-chart {
		position: relative;
		width: 100%;
		min-width: 0;
	}

	.lumi-bar-chart__empty {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--lumi-space-lg);
		border: var(--lumi-border-width-thin) dashed var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-panel);
	}

	.lumi-bar-chart__svg {
		width: 100%;
		height: 100%;
		display: block;
		touch-action: pan-y;
	}

	.lumi-bar-chart__grid {
		stroke: var(--lumi-color-border-light);
		stroke-width: var(--lumi-border-width-thin);
	}

	.lumi-bar-chart__label {
		font-size: var(--lumi-font-size-xs);
		fill: var(--lumi-color-text-muted);
	}

	.lumi-bar-chart__bar {
		pointer-events: none;
		rx: var(--lumi-radius-xs);
		transition: opacity var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-bar-chart__bar--muted {
		opacity: 0.42;
	}

	.lumi-bar-chart__crosshair {
		stroke: var(--lumi-color-border);
		stroke-width: var(--lumi-border-width-thin);
		stroke-dasharray: 4 3;
		pointer-events: none;
	}

	.lumi-bar-chart__hit {
		cursor: crosshair;
	}
</style>

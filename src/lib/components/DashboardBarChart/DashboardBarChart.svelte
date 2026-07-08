<script lang="ts">
	import { portal } from '../../actions/portal';
	import type { ChartColor } from '../../types/charts';
	import { chartGradientId, computeSparseXLabels } from '../../utils/chartCoordinates';
	import { formatChartValue } from '../../utils/chartFormat';
	import { MIN_CHART_WIDTH, useChartWidth } from '../../utils/chartLayout.svelte';
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

	const colorMap: Record<ChartColor, string> = {
		primary: 'var(--lumi-color-primary)',
		secondary: 'var(--lumi-color-secondary)',
		success: 'var(--lumi-color-success)',
		warning: 'var(--lumi-color-warning)',
		danger: 'var(--lumi-color-danger)',
		info: 'var(--lumi-color-info)'
	};

	const PADDING = { top: 18, right: 12, bottom: 36, left: 48 };
	const Y_TICKS = 4;

	const layout = useChartWidth(MIN_CHART_WIDTH);

	let hoveredIndex = $state<number | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	const fillColor = $derived(colorMap[color]);
	const hasValues = $derived(data.some((point) => point.value > 0));
	const classes = $derived(['lumi-bar-chart', className].filter(Boolean).join(' '));
	const chartW = $derived(layout.chartW);
	const chartH = $derived(height);
	const plotW = $derived(chartW - PADDING.left - PADDING.right);
	const plotH = $derived(chartH - PADDING.top - PADDING.bottom);
	const bandW = $derived(plotW / Math.max(data.length, 1));
	const barW = $derived(Math.max(4, Math.min(bandW * 0.58, plotH * 0.18)));
	const maxValue = $derived(Math.max(...data.map((point) => point.value), 1));
	const niceMax = $derived(
		valueFormat === 'score' ? Math.max(20, ceilNice(maxValue)) : ceilNice(maxValue)
	);
	const yTicks = $derived(Array.from({ length: Y_TICKS + 1 }, (_, i) => (niceMax / Y_TICKS) * i));
	const xLabels = $derived(computeSparseXLabels(data, (index) => barCenter(index), 7));
	const gradientId = $derived(
		chartGradientId(
			'bar',
			color,
			data.map((point) => point.key)
		)
	);

	const hoveredPoint = $derived(hoveredIndex !== null ? data[hoveredIndex] : null);

	function ceilNice(value: number): number {
		if (value <= 0) return 10;
		const magnitude = 10 ** Math.floor(Math.log10(value));
		const normalized = value / magnitude;
		const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
		return nice * magnitude;
	}

	function scaleY(value: number): number {
		return PADDING.top + plotH - (value / niceMax) * plotH;
	}

	function barX(index: number): number {
		return PADDING.left + index * bandW + (bandW - barW) / 2;
	}

	function barHeight(value: number): number {
		return Math.max(0, PADDING.top + plotH - scaleY(value));
	}

	function barCenter(index: number): number {
		return barX(index) + barW / 2;
	}

	function formatAxisLabel(label: string): string {
		if (label.length <= xLabelMaxLength) {
			return label;
		}

		return `${label.slice(0, Math.max(1, xLabelMaxLength - 3))}...`;
	}

	function formatValue(value: number): string {
		return formatChartValue(value, valueFormat, 'axis', { scoreAxisFractionDigits: 2 });
	}

	function formatTooltipValue(value: number): string {
		return formatChartValue(value, valueFormat, 'tooltip');
	}

	function setHover(index: number, event: PointerEvent): void {
		hoveredIndex = index;
		tooltipX = event.clientX;
		tooltipY = event.clientY;
	}

	function clearHover(): void {
		hoveredIndex = null;
	}
</script>

<div bind:this={layout.root} class={classes} style:height="{height}px">
	{#if !hasValues}
		<div class="lumi-bar-chart__empty">
			<p class="lumi-margin--none lumi-text--sm lumi-text--muted">{emptyMessage}</p>
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
					x1={PADDING.left}
					y1={scaleY(tick)}
					x2={chartW - PADDING.right}
					y2={scaleY(tick)}
					class="lumi-bar-chart__grid"
				/>
				<text
					x={PADDING.left - 8}
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
					y={scaleY(point.value)}
					width={barW}
					height={barHeight(point.value)}
					rx="6"
					fill="url(#{gradientId})"
					class="lumi-bar-chart__bar"
					class:lumi-bar-chart__bar--muted={hoveredIndex !== null && hoveredIndex !== index}
				/>
			{/each}

			{#if hoveredIndex !== null}
				<line
					x1={barCenter(hoveredIndex)}
					y1={PADDING.top}
					x2={barCenter(hoveredIndex)}
					y2={PADDING.top + plotH}
					class="lumi-bar-chart__crosshair"
				/>
			{/if}

			{#each data as point, index (point.key)}
				<rect
					x={PADDING.left + index * bandW}
					y={PADDING.top}
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
				<text x={xLabel.x} y={chartH - 8} text-anchor="middle" class="lumi-bar-chart__label">
					{formatAxisLabel(xLabel.label)}
				</text>
			{/each}
		</svg>
	{/if}
</div>

{#if hoveredPoint}
	<div
		class="lumi-chart-tooltip lumi-bar-chart__tooltip"
		use:portal
		style:left="{tooltipX + 14}px"
		style:top="{tooltipY - 10}px"
	>
		<span class="lumi-bar-chart__tooltip-dot" style:background={fillColor}></span>
		<div class="lumi-bar-chart__tooltip-body">
			<span class="lumi-text--xs lumi-font--semibold">{formatTooltipValue(hoveredPoint.value)}</span
			>
			<span class="lumi-text--xs lumi-text--muted">{hoveredPoint.label}</span>
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
		border-radius: var(--lumi-radius-xl);
	}

	.lumi-bar-chart__svg {
		width: 100%;
		height: 100%;
		display: block;
		touch-action: pan-y;
	}

	.lumi-bar-chart__grid {
		stroke: var(--lumi-color-border-light);
		stroke-width: 1;
	}

	.lumi-bar-chart__label {
		font-size: var(--lumi-font-size-xs);
		fill: var(--lumi-color-text-muted);
	}

	.lumi-bar-chart__bar {
		pointer-events: none;
		transition: opacity var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-bar-chart__bar--muted {
		opacity: 0.42;
	}

	.lumi-bar-chart__crosshair {
		stroke: var(--lumi-color-border);
		stroke-width: 1;
		stroke-dasharray: 4 3;
		pointer-events: none;
	}

	.lumi-bar-chart__hit {
		cursor: crosshair;
	}

	.lumi-bar-chart__tooltip {
		align-items: center;
		gap: var(--lumi-space-xs);
	}

	.lumi-bar-chart__tooltip-dot {
		width: var(--lumi-space-xs);
		min-width: var(--lumi-space-xs);
		height: var(--lumi-space-xs);
		border-radius: var(--lumi-radius-full);
	}

	.lumi-bar-chart__tooltip-body {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
	}
</style>

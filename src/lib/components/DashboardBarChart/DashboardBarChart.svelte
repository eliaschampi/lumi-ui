<script lang="ts">
	import {
		CHART_COLOR_VARS,
		CHART_PADDING,
		CHART_Y_TICKS,
		ceilNice,
		computeSparseXLabels,
		truncateAxisLabel
	} from '../../utils/chartCoordinates';
	import { chartAxis } from '../../utils/chartAxis';
	import { formatChartValue } from '../../utils/chartFormat';
	import {
		MIN_CHART_WIDTH,
		chartTooltip,
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

	const instanceId = $props.id();
	const gradientId = `lumi-bar-gradient-${instanceId}`;
	const layout = useChartWidth(MIN_CHART_WIDTH);

	let hoveredIndex = $state<number | null>(null);
	let tooltipAnchor = $state({ clientX: 0, clientY: 0 });

	const fillColor = $derived(CHART_COLOR_VARS[color]);
	const values = $derived(
		data.map((point) =>
			Number.isFinite(point.value) ? Math.max(0, point.value) : 0
		)
	);
	const hasValues = $derived(
		valueFormat === 'score'
			? data.some((point) => Number.isFinite(point.value))
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
	const barW = $derived(
		Math.min(bandW, Math.max(4, Math.min(bandW * 0.58, plotH * 0.18)))
	);
	const maxValue = $derived(
		values.reduce((max, value) => Math.max(max, value), 1)
	);
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
	const hoveredPoint = $derived(
		hoveredIndex !== null ? (data[hoveredIndex] ?? null) : null
	);

	function scaleY(value: number): number {
		return CHART_PADDING.top + plotH - (value / niceMax) * plotH;
	}

	function barCenter(index: number): number {
		return CHART_PADDING.left + (index + 0.5) * bandW;
	}

	function setHover(
		index: number,
		anchor: Pick<PointerEvent, 'clientX' | 'clientY'>
	): void {
		hoveredIndex = index;
		tooltipAnchor = { clientX: anchor.clientX, clientY: anchor.clientY };
	}

	function handlePointer(event: PointerEvent): void {
		const bounds = (
			event.currentTarget as SVGRectElement
		).getBoundingClientRect();
		const index = Math.min(
			data.length - 1,
			Math.max(
				0,
				Math.floor(((event.clientX - bounds.left) / bounds.width) * data.length)
			)
		);
		setHover(index, event);
	}

	function clearHover(): void {
		hoveredIndex = null;
	}
</script>

<div bind:this={layout.root} class={classes} style:height="{height}px">
	{#if !hasValues}
		<div class="lumi-chart-empty">
			<p class="lumi-margin--none lumi-text--sm lumi-text--muted">
				{emptyMessage}
			</p>
		</div>
	{:else}
		<svg
			viewBox="0 0 {chartW} {chartH}"
			preserveAspectRatio="xMidYMid meet"
			class="lumi-chart-svg"
			role="img"
			aria-label={ariaLabel}
			onpointerleave={clearHover}
			onpointercancel={clearHover}
		>
			<defs>
				<linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color={fillColor} stop-opacity="0.86" />
					<stop offset="100%" stop-color={fillColor} stop-opacity="0.38" />
				</linearGradient>
			</defs>

			{#each yTicks as tick}
				<line
					x1={CHART_PADDING.left}
					y1={scaleY(tick)}
					x2={chartW - CHART_PADDING.right}
					y2={scaleY(tick)}
					class="lumi-chart-grid"
				/>
				<text
					x={CHART_PADDING.left - 8}
					y={scaleY(tick) + 3}
					text-anchor="end"
					class="lumi-chart-label"
				>
					{formatChartValue(tick, valueFormat, 'axis')}
				</text>
			{/each}

			{#each data as _, index}
				{@const value = values[index] ?? 0}
				<rect
					x={barCenter(index) - barW / 2}
					y={scaleY(value)}
					width={barW}
					height={(value / niceMax) * plotH}
					fill="url(#{gradientId})"
					class="lumi-bar-chart__bar"
					class:lumi-bar-chart__bar--muted={hoveredPoint !== null &&
						hoveredIndex !== index}
				/>
			{/each}

			{#if hoveredPoint && hoveredIndex !== null}
				<line
					x1={barCenter(hoveredIndex)}
					y1={CHART_PADDING.top}
					x2={barCenter(hoveredIndex)}
					y2={CHART_PADDING.top + plotH}
					class="lumi-chart-crosshair"
				/>
			{/if}

			<rect
				x={CHART_PADDING.left}
				y={CHART_PADDING.top}
				width={plotW}
				height={plotH}
				fill="transparent"
				class="lumi-chart-hit"
				aria-hidden="true"
				onpointerenter={handlePointer}
				onpointermove={handlePointer}
				onpointerleave={clearHover}
			/>

			<g
				use:chartAxis={{
					labels: xLabels,
					width: chartW,
					maxLength: xLabelMaxLength
				}}
			>
				{#each xLabels as xLabel}
					<text
						x={xLabel.x}
						y={chartH - 8}
						text-anchor="middle"
						class="lumi-chart-label"
					>
						{truncateAxisLabel(xLabel.label, xLabelMaxLength)}
					</text>
				{/each}
			</g>
		</svg>
	{/if}
</div>

{#if hoveredPoint}
	<div
		class="lumi-chart-tooltip"
		role="tooltip"
		use:chartTooltip={tooltipAnchor}
	>
		<span class="lumi-chart-tooltip__title">{hoveredPoint.label}</span>
		<div class="lumi-chart-tooltip__row">
			<span class="lumi-chart-tooltip__dot" style:background={fillColor}></span>
			<span class="lumi-chart-tooltip__value"
				>{formatChartValue(
					Number.isFinite(hoveredPoint.value) ? hoveredPoint.value : 0,
					valueFormat,
					'tooltip'
				)}</span
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

	.lumi-bar-chart__bar {
		pointer-events: none;
		rx: var(--lumi-radius-xs);
		transition: opacity var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-bar-chart__bar--muted {
		opacity: var(--lumi-opacity-muted);
	}
</style>

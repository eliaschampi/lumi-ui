<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		chartBar: en.chartBar,
		chartEmpty: en.chartEmpty
	};
</script>

<script lang="ts">
	import {
		CHART_COLOR_VARS,
		CHART_LABEL_GAP,
		CHART_PADDING,
		chartScale,
		computeSparseXLabels,
		truncateAxisLabel
	} from '../../utils/chartCoordinates';
	import { chartAxis } from '../../utils/chartAxis';
	import { formatChartValue } from '../../utils/chartFormat';
	import {
		chartTooltip,
		useChartGutter,
		useChartInteraction,
		useChartWidth
	} from '../../utils/chartLayout.svelte';
	import '../../styles/charts.css';
	import { useLumiLocale } from '../../i18n';
	import type { DashboardBarChartProps } from './types';

	const {
		data,
		color = 'primary',
		height = 260,
		valueFormat = 'number',
		xLabelMaxLength,
		emptyMessage,
		'aria-label': ariaLabel,
		class: className
	}: DashboardBarChartProps = $props();

	const i18n = useLumiLocale(COPY);

	const instanceId = $props.id();
	const gradientId = `lumi-bar-gradient-${instanceId}`;
	const layout = useChartWidth();
	const gutter = useChartGutter(() => layout.chartW);

	const hover = useChartInteraction();

	const fillColor = $derived(CHART_COLOR_VARS[color]);
	const scale = $derived(chartScale([{ data }], valueFormat));
	const zeroY = $derived(scaleY(0));
	const chartW = $derived(layout.chartW);
	const chartH = $derived(height);
	const plotW = $derived(
		Math.max(1, chartW - gutter.left - CHART_PADDING.right)
	);
	const plotH = $derived(
		Math.max(1, chartH - CHART_PADDING.top - CHART_PADDING.bottom)
	);
	const bandW = $derived(plotW / Math.max(data.length, 1));
	const barW = $derived(
		Math.min(bandW, Math.max(4, Math.min(bandW * 0.58, plotH * 0.18)))
	);
	const yTicks = $derived(
		scale.ticks.map((tick) => ({
			y: CHART_PADDING.top + tick.ratio * plotH,
			label: formatChartValue(tick.value, valueFormat, 'axis', i18n)
		}))
	);
	const xLabels = $derived(
		computeSparseXLabels(data, (index) => barCenter(index))
	);
	const hoveredPoint = $derived(
		hover.index !== null &&
			scale.hasValues &&
			Number.isFinite(data[hover.index]?.value)
			? data[hover.index]
			: null
	);

	function scaleY(value: number): number {
		return CHART_PADDING.top + scale.ratio(value) * plotH;
	}

	function barCenter(index: number): number {
		return gutter.left + (index + 0.5) * bandW;
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
		hover.set(index, event);
	}
</script>

<div
	bind:this={layout.root}
	class={['lumi-bar-chart', className]}
	style:height="{height}px"
>
	{#if !scale.hasValues}
		<div class="lumi-chart-empty">
			<p class="lumi-chart-empty__text">{emptyMessage ?? i18n.t.chartEmpty}</p>
		</div>
	{:else}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard exploration keeps the chart image semantics.) -->
		<svg
			viewBox="0 0 {chartW} {chartH}"
			preserveAspectRatio="xMidYMid meet"
			class="lumi-chart-svg"
			role="img"
			aria-label={ariaLabel ?? i18n.t.chartBar}
			aria-describedby={hoveredPoint ? `${instanceId}-tooltip` : undefined}
			tabindex="0"
			use:hover.keyboard={data.length}
			onpointerleave={hover.clear}
			onpointercancel={hover.clear}
		>
			<defs>
				<linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color={fillColor} stop-opacity="0.86" />
					<stop offset="100%" stop-color={fillColor} stop-opacity="0.38" />
				</linearGradient>
			</defs>

			{#each yTicks as tick}
				<line
					x1={gutter.left}
					y1={tick.y}
					x2={chartW - CHART_PADDING.right}
					y2={tick.y}
					class="lumi-chart-grid"
				/>
			{/each}
			<g use:gutter.measure>
				{#each yTicks as tick}
					<text
						x={gutter.left - CHART_LABEL_GAP}
						y={tick.y + 3}
						text-anchor="end"
						class="lumi-chart-label"
					>
						{tick.label}
					</text>
				{/each}
			</g>

			{#each data as point, index}
				{@const y = Number.isFinite(point.value) ? scaleY(point.value) : zeroY}
				<rect
					x={barCenter(index) - barW / 2}
					y={Math.min(y, zeroY)}
					width={barW}
					height={Math.abs(y - zeroY)}
					fill="url(#{gradientId})"
					class="lumi-bar-chart__bar"
					class:lumi-bar-chart__bar--muted={hoveredPoint !== null &&
						hover.index !== index}
				/>
			{/each}

			{#if hoveredPoint && hover.index !== null}
				<line
					x1={barCenter(hover.index)}
					y1={CHART_PADDING.top}
					x2={barCenter(hover.index)}
					y2={CHART_PADDING.top + plotH}
					class="lumi-chart-crosshair"
				/>
			{/if}

			<rect
				x={gutter.left}
				y={CHART_PADDING.top}
				width={plotW}
				height={plotH}
				fill="transparent"
				class="lumi-chart-hit"
				aria-hidden="true"
				onpointerenter={handlePointer}
				onpointermove={handlePointer}
				onpointerleave={hover.clear}
			/>

			<g
				use:chartAxis={{
					labels: xLabels,
					left: gutter.left,
					width: chartW,
					maxLength: xLabelMaxLength
				}}
			>
				{#each xLabels as xLabel}
					<text
						x={xLabel.x}
						y={chartH - 8}
						text-anchor="middle"
						visibility="hidden"
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
		id={`${instanceId}-tooltip`}
		use:chartTooltip={hover.anchor}
	>
		<span class="lumi-chart-tooltip__title">{hoveredPoint.label}</span>
		<div class="lumi-chart-tooltip__row">
			<span class="lumi-chart-tooltip__dot" style:background={fillColor}></span>
			<span class="lumi-chart-tooltip__value"
				>{formatChartValue(
					hoveredPoint.value,
					valueFormat,
					'tooltip',
					i18n
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

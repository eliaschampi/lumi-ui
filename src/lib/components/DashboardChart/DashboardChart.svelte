<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		chart: en.chart,
		chartEmpty: en.chartEmpty,
		chartSeries: en.chartSeries
	};
</script>

<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
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
	import type { DashboardChartProps } from './types';

	const {
		series,
		data = [],
		color = 'primary',
		height = 220,
		valueFormat = 'number',
		xLabelMaxLength,
		emptyMessage,
		'aria-label': ariaLabel,
		class: className
	}: DashboardChartProps = $props();

	const i18n = useLumiLocale(COPY);

	const layout = useChartWidth();
	const gutter = useChartGutter(() => layout.chartW);
	const instanceId = $props.id();

	const hover = useChartInteraction();
	const hiddenSeries = new SvelteSet<string>();

	const normalizedSeries = $derived(
		series?.length
			? series
			: [
					{
						key: 'default',
						label: ariaLabel ?? i18n.t.chart,
						color,
						data
					}
				]
	);
	const xAxisData = $derived(normalizedSeries[0]?.data ?? []);
	const visibleSeries = $derived(
		normalizedSeries.length === 1
			? normalizedSeries
			: normalizedSeries.filter((s) => !hiddenSeries.has(s.key))
	);
	const chartW = $derived(layout.chartW);
	const chartH = $derived(height);
	const plotW = $derived(
		Math.max(1, chartW - gutter.left - CHART_PADDING.right)
	);
	const plotH = $derived(
		Math.max(1, chartH - CHART_PADDING.top - CHART_PADDING.bottom)
	);

	const scale = $derived(
		chartScale(visibleSeries, valueFormat, xAxisData.length)
	);

	const yTicks = $derived(
		scale.ticks.map((tick) => ({
			y: CHART_PADDING.top + tick.ratio * plotH,
			label: formatChartValue(tick.value, valueFormat, 'axis', i18n)
		}))
	);
	const zeroY = $derived(scaleY(0));
	const activeIndex = $derived(
		hover.index !== null && hover.index < xAxisData.length && scale.hasValues
			? hover.index
			: null
	);

	const seriesPaths = $derived(
		visibleSeries.map((s, seriesIndex) => {
			let linePath = '';
			let areaPath = '';
			let segment: { x: number; y: number }[] = [];
			const lonePoints: { x: number; y: number }[] = [];
			function flushSegment() {
				if (segment.length === 0) return;
				const path = monotonePath(segment);
				linePath += path;
				areaPath += `${path}L${svgPoint(segment[segment.length - 1].x, zeroY)}L${svgPoint(segment[0].x, zeroY)}Z`;
				if (segment.length === 1) lonePoints.push(segment[0]);
				segment = [];
			}
			for (let index = 0; index < xAxisData.length; index++) {
				const point = s.data[index];
				if (point && Number.isFinite(point.value)) {
					segment.push({ x: scaleX(index), y: scaleY(point.value) });
				} else {
					flushSegment();
				}
			}
			flushSegment();
			return {
				key: s.key,
				strokeColor: CHART_COLOR_VARS[s.color],
				gradientId: `line-${instanceId}-${seriesIndex}`,
				linePath,
				areaPath,
				lonePoints
			};
		})
	);

	const xLabels = $derived(
		computeSparseXLabels(xAxisData, (index) => scaleX(index))
	);

	const hoveredEntries = $derived.by(() => {
		if (activeIndex === null) return [];
		const index = activeIndex;
		return visibleSeries
			.map((s) => ({
				key: s.key,
				label: s.label,
				color: s.color,
				point: s.data[index]
			}))
			.filter(
				(entry) =>
					entry.point !== undefined && Number.isFinite(entry.point.value)
			);
	});

	function scaleX(i: number): number {
		return (
			gutter.left +
			(xAxisData.length > 1 ? (i / (xAxisData.length - 1)) * plotW : plotW / 2)
		);
	}

	function scaleY(v: number): number {
		return CHART_PADDING.top + scale.ratio(v) * plotH;
	}

	function monotonePath(pts: { x: number; y: number }[]): string {
		if (pts.length === 0) return '';
		const start = `M${svgPoint(pts[0].x, pts[0].y)}`;
		if (pts.length === 1) return start;
		if (pts.length === 2) return `${start}L${svgPoint(pts[1].x, pts[1].y)}`;

		const firstDx = pts[1].x - pts[0].x;
		let slope = firstDx === 0 ? 0 : (pts[1].y - pts[0].y) / firstDx;
		let tangent = slope;
		let d = start;
		for (let i = 0; i < pts.length - 1; i++) {
			const last = i === pts.length - 2;
			const nextDx = last ? 0 : pts[i + 2].x - pts[i + 1].x;
			const nextSlope =
				nextDx === 0 ? 0 : (pts[i + 2].y - pts[i + 1].y) / nextDx;
			// Harmonic slopes keep each cubic inside its adjacent data values.
			const nextTangent = last
				? slope
				: slope * nextSlope <= 0
					? 0
					: 2 / (1 / slope + 1 / nextSlope);
			const dx = (pts[i + 1].x - pts[i].x) / 3;
			const cp1x = pts[i].x + dx;
			const cp1y = pts[i].y + tangent * dx;
			const cp2x = pts[i + 1].x - dx;
			const cp2y = pts[i + 1].y - nextTangent * dx;
			d += `C${svgPoint(cp1x, cp1y)},${svgPoint(cp2x, cp2y)},${svgPoint(pts[i + 1].x, pts[i + 1].y)}`;
			slope = nextSlope;
			tangent = nextTangent;
		}
		return d;
	}

	function svgPoint(x: number, y: number): string {
		// Subpixel serialization only; curve calculations retain full precision.
		return `${Math.round(x * 1000) / 1000},${Math.round(y * 1000) / 1000}`;
	}

	function setHover(event: PointerEvent): void {
		const bounds = (
			event.currentTarget as SVGRectElement
		).getBoundingClientRect();
		const ratio =
			bounds.width > 0 ? (event.clientX - bounds.left) / bounds.width : 0;
		hover.set(
			Math.max(
				0,
				Math.min(
					xAxisData.length - 1,
					Math.round(ratio * (xAxisData.length - 1))
				)
			),
			event
		);
	}

	function toggleSeries(key: string): void {
		if (hiddenSeries.has(key)) {
			hiddenSeries.delete(key);
		} else {
			if (visibleSeries.length <= 1) return;
			hiddenSeries.add(key);
		}
	}
</script>

<div bind:this={layout.root} class={['lumi-line-chart', className]}>
	{#if normalizedSeries.length > 1}
		<div
			class="lumi-line-chart__legend"
			role="group"
			aria-label={i18n.t.chartSeries}
		>
			{#each normalizedSeries as s (s.key)}
				<button
					type="button"
					class="lumi-line-chart__legend-item"
					class:lumi-line-chart__legend-item--hidden={hiddenSeries.has(s.key)}
					aria-pressed={!hiddenSeries.has(s.key)}
					aria-label={s.label}
					onclick={() => toggleSeries(s.key)}
				>
					<span
						class="lumi-line-chart__legend-dot"
						style:background={CHART_COLOR_VARS[s.color]}
					></span>
					<span class="lumi-line-chart__legend-label">{s.label}</span>
				</button>
			{/each}
		</div>
	{/if}

	<div class="lumi-line-chart__plot" style:height="{height}px">
		{#if !scale.hasValues}
			<div class="lumi-chart-empty">
				<p class="lumi-chart-empty__text">
					{emptyMessage ?? i18n.t.chartEmpty}
				</p>
			</div>
		{:else}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard exploration keeps the chart image semantics.) -->
			<svg
				viewBox="0 0 {chartW} {chartH}"
				preserveAspectRatio="xMidYMid meet"
				class="lumi-chart-svg"
				role="img"
				aria-label={ariaLabel ?? i18n.t.chart}
				aria-describedby={hoveredEntries.length > 0
					? `${instanceId}-tooltip`
					: undefined}
				tabindex="0"
				use:hover.keyboard={xAxisData.length}
				onpointerleave={hover.clear}
				onpointercancel={hover.clear}
			>
				<defs>
					{#each seriesPaths as sp (sp.key)}
						<linearGradient id={sp.gradientId} x1="0" x2="0" y1="0" y2="1">
							<stop
								offset="0%"
								stop-color={sp.strokeColor}
								stop-opacity="0.15"
							/>
							<stop
								offset="100%"
								stop-color={sp.strokeColor}
								stop-opacity="0"
							/>
						</linearGradient>
					{/each}
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

				<g
					use:chartAxis={{
						labels: xLabels,
						left: gutter.left,
						width: chartW,
						maxLength: xLabelMaxLength
					}}
				>
					{#each xLabels as xl}
						<text
							x={xl.x}
							y={chartH - 8}
							text-anchor="middle"
							visibility="hidden"
							class="lumi-chart-label"
						>
							{truncateAxisLabel(xl.label, xLabelMaxLength)}
						</text>
					{/each}
				</g>

				{#each seriesPaths as sp (sp.key)}
					{#if sp.areaPath}
						<path
							d={sp.areaPath}
							fill="url(#{sp.gradientId})"
							pointer-events="none"
						/>
					{/if}
					<path
						d={sp.linePath}
						fill="none"
						stroke={sp.strokeColor}
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lumi-line-chart__line"
					/>
					{#each sp.lonePoints as point, index (`${sp.key}-${index}`)}
						<circle
							cx={point.x}
							cy={point.y}
							r="4"
							fill={sp.strokeColor}
							class="lumi-line-chart__dot"
						/>
					{/each}
				{/each}

				{#if activeIndex !== null}
					<line
						x1={scaleX(activeIndex)}
						y1={CHART_PADDING.top}
						x2={scaleX(activeIndex)}
						y2={CHART_PADDING.top + plotH}
						class="lumi-chart-crosshair"
					/>
					{#each hoveredEntries as entry (entry.key)}
						<circle
							cx={scaleX(activeIndex)}
							cy={scaleY(entry.point.value)}
							r="4"
							fill={CHART_COLOR_VARS[entry.color]}
							class="lumi-line-chart__dot"
						/>
					{/each}
				{/if}

				<rect
					x={gutter.left}
					y={CHART_PADDING.top}
					width={plotW}
					height={plotH}
					fill="transparent"
					class="lumi-chart-hit"
					aria-hidden="true"
					onpointerenter={setHover}
					onpointermove={setHover}
				/>
			</svg>
		{/if}
	</div>
</div>

{#if hoveredEntries.length > 0}
	<div
		role="tooltip"
		id={`${instanceId}-tooltip`}
		class="lumi-chart-tooltip"
		use:chartTooltip={hover.anchor}
	>
		<span class="lumi-chart-tooltip__title"
			>{hoveredEntries[0].point.label}</span
		>
		{#each hoveredEntries as entry (entry.key)}
			<div class="lumi-chart-tooltip__row">
				<span
					class="lumi-chart-tooltip__dot"
					style:background={CHART_COLOR_VARS[entry.color]}
				></span>
				<span class="lumi-chart-tooltip__label">{entry.label}</span>
				<span class="lumi-chart-tooltip__value"
					>{formatChartValue(
						entry.point.value,
						valueFormat,
						'tooltip',
						i18n
					)}</span
				>
			</div>
		{/each}
	</div>
{/if}

<style>
	.lumi-line-chart {
		width: 100%;
		min-width: 0;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-sm);
	}

	.lumi-line-chart__legend {
		display: flex;
		flex-wrap: wrap;
		gap: var(--lumi-space-2xs) var(--lumi-space-xs);
		min-width: 0;
	}

	.lumi-line-chart__legend-item {
		display: inline-flex;
		min-width: 0;
		align-items: center;
		gap: var(--lumi-space-2xs);
		padding: var(--lumi-space-2xs) var(--lumi-space-xs);
		background: transparent;
		border: var(--lumi-border-width-thin) solid transparent;
		border-radius: var(--lumi-radius-full);
		cursor: pointer;
		transition: var(--lumi-transition-control);
		user-select: none;
	}

	.lumi-line-chart__legend-item:hover {
		background: var(--lumi-color-surface-glass);
	}

	.lumi-line-chart__legend-item:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-line-chart__legend-item--hidden {
		opacity: var(--lumi-opacity-muted);
	}

	.lumi-line-chart__legend-dot {
		width: var(--lumi-space-xs);
		min-width: var(--lumi-space-xs);
		height: var(--lumi-space-xs);
		border-radius: var(--lumi-radius-full);
	}

	.lumi-line-chart__legend-label {
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lumi-line-chart__plot {
		width: 100%;
		min-width: 0;
		position: relative;
	}

	.lumi-line-chart__line {
		pointer-events: none;
		vector-effect: non-scaling-stroke;
		stroke-width: var(--lumi-border-width-thick);
	}

	.lumi-line-chart__dot {
		stroke: var(--lumi-color-surface);
		stroke-width: var(--lumi-border-width-thick);
		pointer-events: none;
	}
</style>

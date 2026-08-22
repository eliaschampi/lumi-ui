<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
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
	import type { DashboardChartProps } from './types';

	const {
		series,
		data = [],
		color = 'primary',
		height = 220,
		valueFormat = 'number',
		xLabelMaxLength = 12,
		emptyMessage = 'No hay datos suficientes para mostrar este gráfico.',
		'aria-label': ariaLabel = 'Gráfico del dashboard',
		class: className = ''
	}: DashboardChartProps = $props();

	const layout = useChartWidth(MIN_CHART_WIDTH);

	let hoveredIndex = $state<number | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipEl = $state<HTMLDivElement | undefined>();
	const hiddenSeries = new SvelteSet<string>();

	const normalizedSeries = $derived(
		series?.length
			? series
			: [
					{
						key: 'default',
						label: ariaLabel,
						color,
						data
					}
				]
	);
	const xAxisData = $derived(normalizedSeries[0]?.data ?? []);
	const visibleSeries = $derived(
		normalizedSeries.filter((s) => !hiddenSeries.has(s.key))
	);
	const classes = $derived(
		['lumi-line-chart', className].filter(Boolean).join(' ')
	);
	const chartW = $derived(layout.chartW);
	const chartH = $derived(height);
	const plotW = $derived(
		Math.max(1, chartW - CHART_PADDING.left - CHART_PADDING.right)
	);
	const plotH = $derived(
		Math.max(1, chartH - CHART_PADDING.top - CHART_PADDING.bottom)
	);

	const allVisibleValues = $derived(
		visibleSeries
			.flatMap((s) => s.data)
			.map((p) => p.value)
			.filter(Number.isFinite)
	);
	const maxValue = $derived(Math.max(...allVisibleValues, 0));
	const minValue = $derived(Math.min(...allVisibleValues, 0));
	const niceMax = $derived(
		valueFormat === 'score'
			? Math.max(20, ceilNice(maxValue))
			: maxValue > 0
				? ceilNice(maxValue)
				: 0
	);
	const niceMin = $derived(minValue < 0 ? -ceilNice(Math.abs(minValue)) : 0);
	const valueRange = $derived(Math.max(niceMax - niceMin, Number.EPSILON));
	const hasValues = $derived(
		valueFormat === 'score'
			? allVisibleValues.length > 0
			: allVisibleValues.some((v) => v !== 0)
	);

	const xPoints = $derived(xAxisData.map((_, i) => ({ x: scaleX(i) })));
	const zeroY = $derived(scaleY(0));

	const seriesPaths = $derived(
		visibleSeries.map((s) => {
			const pts = xAxisData.map((_, i) => {
				const point = s.data[i];
				if (!point || !Number.isFinite(point.value)) return null;
				return { x: scaleX(i), y: scaleY(point.value) };
			});
			const segments = finiteSegments(pts);
			const line = segments.map((segment) => monotonePath(segment)).join('');
			const area = segments
				.map((segment) => {
					const path = monotonePath(segment);
					return path
						? `${path}L${segment[segment.length - 1].x},${zeroY}L${segment[0].x},${zeroY}Z`
						: '';
				})
				.join('');
			return {
				key: s.key,
				label: s.label,
				strokeColor: CHART_COLOR_VARS[s.color],
				gradientId: chartGradientId('line', s.color, [
					s.key,
					...s.data.map((p) => p.key)
				]),
				linePath: line,
				areaPath: area,
				points: pts,
				lonePoints: segments
					.filter((segment) => segment.length === 1)
					.map((segment) => segment[0])
			};
		})
	);

	const yTicks = $derived(
		Array.from(
			{ length: CHART_Y_TICKS + 1 },
			(_, i) => niceMin + (valueRange / CHART_Y_TICKS) * i
		)
	);
	const xLabels = $derived(
		computeSparseXLabels(xAxisData, (index) => scaleX(index))
	);

	const hoveredEntries = $derived.by(() => {
		if (hoveredIndex === null) return [];
		const index = hoveredIndex;
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

	function finiteSegments(
		pts: Array<{ x: number; y: number } | null>
	): Array<Array<{ x: number; y: number }>> {
		const segments: Array<Array<{ x: number; y: number }>> = [];
		let current: Array<{ x: number; y: number }> = [];

		for (const point of pts) {
			if (point) {
				current.push(point);
				continue;
			}

			if (current.length > 0) {
				segments.push(current);
				current = [];
			}
		}

		if (current.length > 0) segments.push(current);

		return segments;
	}

	function scaleX(i: number): number {
		return (
			CHART_PADDING.left +
			(xAxisData.length > 1 ? (i / (xAxisData.length - 1)) * plotW : plotW / 2)
		);
	}

	function scaleY(v: number): number {
		return CHART_PADDING.top + ((niceMax - v) / valueRange) * plotH;
	}

	function monotonePath(pts: { x: number; y: number }[]): string {
		if (pts.length === 0) return '';
		if (pts.length === 1) return `M${pts[0].x},${pts[0].y}`;
		if (pts.length === 2)
			return `M${pts[0].x},${pts[0].y}L${pts[1].x},${pts[1].y}`;

		const tangents = monotoneTangents(pts);
		let d = `M${pts[0].x},${pts[0].y}`;
		for (let i = 0; i < pts.length - 1; i++) {
			const dx = (pts[i + 1].x - pts[i].x) / 3;
			const cp1x = pts[i].x + dx;
			const cp1y = pts[i].y + tangents[i] * dx;
			const cp2x = pts[i + 1].x - dx;
			const cp2y = pts[i + 1].y - tangents[i + 1] * dx;
			d += `C${cp1x},${cp1y},${cp2x},${cp2y},${pts[i + 1].x},${pts[i + 1].y}`;
		}
		return d;
	}

	function monotoneTangents(pts: { x: number; y: number }[]): number[] {
		const n = pts.length;
		const slopes: number[] = [];
		for (let i = 0; i < n - 1; i++) {
			const dx = pts[i + 1].x - pts[i].x;
			slopes.push(dx === 0 ? 0 : (pts[i + 1].y - pts[i].y) / dx);
		}
		const tangents: number[] = [slopes[0]];
		for (let i = 1; i < n - 1; i++) {
			if (slopes[i - 1] * slopes[i] <= 0) {
				tangents.push(0);
			} else {
				tangents.push((slopes[i - 1] + slopes[i]) / 2);
			}
		}
		tangents.push(slopes[n - 2]);
		return tangents;
	}

	function formatYTick(v: number): string {
		return formatChartValue(v, valueFormat, 'axis');
	}

	function formatTooltipValue(v: number): string {
		return formatChartValue(v, valueFormat, 'tooltip');
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

	function hitBand(index: number): { x: number; width: number } {
		if (xPoints.length === 1) {
			return { x: CHART_PADDING.left, width: plotW };
		}

		const center = xPoints[index].x;
		const left =
			index === 0 ? CHART_PADDING.left : (xPoints[index - 1].x + center) / 2;
		const right =
			index === xPoints.length - 1
				? chartW - CHART_PADDING.right
				: (center + xPoints[index + 1].x) / 2;
		return { x: left, width: right - left };
	}

	function toggleSeries(key: string): void {
		if (hiddenSeries.has(key)) {
			hiddenSeries.delete(key);
		} else {
			if (hiddenSeries.size + 1 >= normalizedSeries.length) return;
			hiddenSeries.add(key);
		}
	}
</script>

<div bind:this={layout.root} class={classes}>
	{#if normalizedSeries.length > 1}
		<div
			class="lumi-line-chart__legend"
			role="group"
			aria-label="Series del gráfico"
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
		{#if !hasValues}
			<div class="lumi-line-chart__empty">
				<p class="lumi-margin--none lumi-text--sm lumi-text--muted">
					{emptyMessage}
				</p>
			</div>
		{:else}
			<svg
				viewBox="0 0 {chartW} {chartH}"
				preserveAspectRatio="xMidYMid meet"
				class="lumi-line-chart__svg"
				role="img"
				aria-label={ariaLabel}
				onpointerleave={clearHover}
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

				{#each yTicks as tick (tick)}
					<line
						x1={CHART_PADDING.left}
						y1={scaleY(tick)}
						x2={chartW - CHART_PADDING.right}
						y2={scaleY(tick)}
						class="lumi-line-chart__grid"
					/>
				{/each}

				{#each yTicks as tick (tick)}
					<text
						x={CHART_PADDING.left - 8}
						y={scaleY(tick) + 3}
						text-anchor="end"
						class="lumi-line-chart__label"
					>
						{formatYTick(tick)}
					</text>
				{/each}

				{#each xLabels as xl (xl.key)}
					<text
						x={xl.x}
						y={chartH - 8}
						text-anchor="middle"
						class="lumi-line-chart__label"
					>
						{truncateAxisLabel(xl.label, xLabelMaxLength)}
					</text>
				{/each}

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

				{#if hoveredIndex !== null}
					<line
						x1={xPoints[hoveredIndex].x}
						y1={CHART_PADDING.top}
						x2={xPoints[hoveredIndex].x}
						y2={CHART_PADDING.top + plotH}
						class="lumi-line-chart__crosshair"
					/>
					{#each seriesPaths as sp (sp.key)}
						{@const hoverPoint = sp.points[hoveredIndex]}
						{#if hoverPoint}
							<circle
								cx={hoverPoint.x}
								cy={hoverPoint.y}
								r="4"
								fill={sp.strokeColor}
								class="lumi-line-chart__dot"
							/>
						{/if}
					{/each}
				{/if}

				{#each xAxisData as point, index (point.key)}
					{@const band = hitBand(index)}
					<rect
						x={band.x}
						y={CHART_PADDING.top}
						width={band.width}
						height={plotH}
						fill="transparent"
						class="lumi-line-chart__hit"
						aria-hidden="true"
						onpointerenter={(event) => setHover(index, event)}
						onpointermove={(event) => setHover(index, event)}
					/>
				{/each}
			</svg>
		{/if}
	</div>
</div>

{#if hoveredEntries.length > 0}
	<div
		bind:this={tooltipEl}
		class="lumi-chart-tooltip"
		use:portal
		style:left="{tooltipX}px"
		style:top="{tooltipY}px"
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
					>{formatTooltipValue(entry.point.value)}</span
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
		outline-offset: calc(var(--lumi-space-2xs) * -0.5);
	}

	.lumi-line-chart__legend-item--hidden {
		opacity: 0.4;
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
		max-width: 12ch;
	}

	.lumi-line-chart__plot {
		width: 100%;
		min-width: 0;
		position: relative;
	}

	.lumi-line-chart__empty {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--lumi-space-lg);
		border: var(--lumi-border-width-thin) dashed var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-panel);
	}

	.lumi-line-chart__svg {
		width: 100%;
		height: 100%;
		display: block;
		touch-action: pan-y;
	}

	.lumi-line-chart__grid {
		stroke: var(--lumi-color-border-light);
		stroke-width: var(--lumi-border-width-thin);
	}

	.lumi-line-chart__label {
		font-size: var(--lumi-font-size-xs);
		fill: var(--lumi-color-text-muted);
	}

	.lumi-line-chart__line {
		pointer-events: none;
		vector-effect: non-scaling-stroke;
		stroke-width: var(--lumi-border-width-thick);
	}

	.lumi-line-chart__crosshair {
		stroke: var(--lumi-color-border);
		stroke-width: var(--lumi-border-width-thin);
		stroke-dasharray: 4 3;
		pointer-events: none;
	}

	.lumi-line-chart__dot {
		stroke: var(--lumi-color-surface);
		stroke-width: var(--lumi-border-width-thick);
		pointer-events: none;
	}

	.lumi-line-chart__hit {
		cursor: crosshair;
	}
</style>

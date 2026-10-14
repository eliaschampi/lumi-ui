import {
	CHART_PADDING,
	ellipsize,
	truncateAxisLabel
} from './chartCoordinates';

interface ChartAxisLayout {
	labels: readonly { label: string }[];
	/** Plot start; follows the measured value-axis gutter. */
	left: number;
	width: number;
	/** Optional consumer cap; measured fitting applies either way. */
	maxLength?: number;
}

// Keep the Text node retained by Svelte while measuring fitted content.
function setAxisText(node: SVGTextElement, value: string) {
	if (node.firstChild && node.firstChild.nodeValue !== value)
		node.firstChild.nodeValue = value;
}

/** Longest code-point prefix whose ellipsized form fits; none hides the text. */
function shortenAxisText(text: SVGTextElement, budget: number) {
	const characters = Array.from(text.textContent ?? '');
	let low = 0;
	let high = characters.length - 1;
	while (low < high) {
		const mid = Math.ceil((low + high) / 2);
		setAxisText(text, ellipsize(characters, mid));
		if (text.getBBox().width <= budget) low = mid;
		else high = mid - 1;
	}
	setAxisText(text, ellipsize(characters, low));
}

/**
 * Fits only the bounded axis candidates; the chart's data stays untouched.
 * Full labels win over label count: fewer evenly spaced labels are shown
 * before any is shortened, and only a label wider than half the plot is.
 */
function layoutAxis(
	node: SVGGElement,
	{ labels, left, width, maxLength }: ChartAxisLayout
) {
	const texts = Array.from(node.querySelectorAll('text'));
	if (!texts.length) return;
	for (const [index, text] of texts.entries()) {
		setAxisText(text, truncateAxisLabel(labels[index].label, maxLength));
	}
	if (!node.ownerSVGElement?.getBoundingClientRect().width) return;
	const gap = node.getBBox().height / 2;
	const right = width - CHART_PADDING.right;
	const minVisible = Math.min(2, texts.length);
	const budget = (right - left - gap * (minVisible - 1)) / minVisible;
	const boxes = texts.map((text) => {
		let box = text.getBBox();
		if (box.width > budget) {
			shortenAxisText(text, budget);
			box = text.getBBox();
		}
		const start = Math.max(left, Math.min(box.x, right - box.width));
		return { left: start, right: start + box.width, shift: start - box.x };
	});
	let visible: number[] = [];
	for (let count = texts.length; count > 0; count--) {
		const indices = Array.from({ length: count }, (_, i) =>
			count === 1 ? 0 : Math.round((i * (texts.length - 1)) / (count - 1))
		);
		if (
			indices.every(
				(index, i) =>
					i === 0 || boxes[index].left >= boxes[indices[i - 1]].right + gap
			)
		) {
			visible = indices;
			break;
		}
	}
	texts.forEach((text, index) => {
		// Svelte owns x; getBBox ignores this translation.
		const transform = `translate(${boxes[index].shift})`;
		if (text.getAttribute('transform') !== transform)
			text.setAttribute('transform', transform);
		// Labels render hidden so unfitted text never paints.
		text.style.visibility = visible.includes(index) ? 'visible' : 'hidden';
	});
}

/** Measures real SVG text, including font changes, without observing data points. */
export function chartAxis(node: SVGGElement, params: ChartAxisLayout) {
	let frame = 0;
	// Text fitting changes the observed bounds; write outside the observer delivery.
	const schedule = () => {
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			layoutAxis(node, params);
		});
	};
	const observer = new ResizeObserver(schedule);
	observer.observe(node);
	schedule();
	return {
		update(next: ChartAxisLayout) {
			params = next;
			schedule();
		},
		destroy() {
			observer.disconnect();
			cancelAnimationFrame(frame);
		}
	};
}

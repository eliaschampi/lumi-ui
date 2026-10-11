import { CHART_PADDING, truncateAxisLabel } from './chartCoordinates';

interface ChartAxisLayout {
	labels: readonly { label: string }[];
	width: number;
	maxLength: number;
}

// Keep the Text node retained by Svelte while measuring fitted content.
function setAxisText(node: SVGTextElement, value: string) {
	if (node.firstChild && node.firstChild.nodeValue !== value)
		node.firstChild.nodeValue = value;
}

/** Fits only the bounded axis candidates; the chart's data stays untouched. */
function layoutAxis(
	node: SVGGElement,
	{ labels, width, maxLength }: ChartAxisLayout
) {
	const texts = Array.from(node.querySelectorAll('text'));
	if (!texts.length) return;
	for (const [index, text] of texts.entries()) {
		setAxisText(text, truncateAxisLabel(labels[index].label, maxLength));
	}
	if (!node.ownerSVGElement?.getBoundingClientRect().width) return;
	const gap = node.getBBox().height / 2;
	const available = width - CHART_PADDING.left - CHART_PADDING.right;
	const minVisible = Math.min(2, texts.length);
	const budget = (available - gap * (minVisible - 1)) / minVisible;
	const boxes = texts.map((text) => {
		let box = text.getBBox();
		if (box.width > budget) {
			const characters = Array.from(text.textContent ?? '');
			const suffix = '...'.slice(0, characters.length);
			let low = 0;
			let high = characters.length - suffix.length;
			setAxisText(text, suffix);
			if (text.getBBox().width > budget) setAxisText(text, '');
			else {
				while (low < high) {
					const mid = Math.ceil((low + high) / 2);
					setAxisText(text, characters.slice(0, mid).join('') + suffix);
					if (text.getBBox().width <= budget) low = mid;
					else high = mid - 1;
				}
				setAxisText(text, characters.slice(0, low).join('') + suffix);
			}
			box = text.getBBox();
		}
		const left = Math.max(
			CHART_PADDING.left,
			Math.min(box.x, width - CHART_PADDING.right - box.width)
		);
		return { left, right: left + box.width, shift: left - box.x };
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
		text.style.visibility = visible.includes(index) ? '' : 'hidden';
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

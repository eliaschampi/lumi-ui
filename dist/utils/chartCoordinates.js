/** Stable SVG defs id (SSR-safe); unique per series and color on a page. */
export function chartGradientId(prefix, color, keys) {
    const seed = keys.join('\0');
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
        hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${color}-${hash.toString(36)}`;
}
export function computeSparseXLabels(data, xAtIndex, maxLabels = 7) {
    if (data.length === 0)
        return [];
    if (data.length <= maxLabels) {
        return data.map((point, index) => ({
            x: xAtIndex(index),
            label: point.label,
            key: point.key
        }));
    }
    const step = Math.ceil(data.length / (maxLabels - 1));
    return data
        .map((point, index) => ({ point, index }))
        .filter(({ index }) => index % step === 0 || index === data.length - 1)
        .map(({ point, index }) => ({
        x: xAtIndex(index),
        label: point.label,
        key: point.key
    }));
}

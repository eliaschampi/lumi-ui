/** Stable SVG defs id (SSR-safe); unique per series and color on a page. */
export declare function chartGradientId(prefix: string, color: string, keys: readonly string[]): string;
export declare function computeSparseXLabels<T extends {
    key: string;
    label: string;
}>(data: readonly T[], xAtIndex: (index: number) => number, maxLabels?: number): {
    x: number;
    label: string;
    key: string;
}[];
//# sourceMappingURL=chartCoordinates.d.ts.map
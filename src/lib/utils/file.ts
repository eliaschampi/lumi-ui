/** Format a finite byte count using binary units and one decimal place. */
export function formatFileSize(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	const index = Math.min(
		units.length - 1,
		Math.max(0, Math.floor(Math.log2(bytes) / 10))
	);
	return `${Number((bytes / 1024 ** index).toFixed(1))} ${units[index]}`;
}

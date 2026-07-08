import type { Snippet } from 'svelte';
import type { EmptyStateProps } from './types';
interface Props extends EmptyStateProps {
    visual?: Snippet;
    titleSlot?: Snippet;
    descriptionSlot?: Snippet;
    actions?: Snippet;
}
declare const EmptyState: import("svelte").Component<Props, {}, "">;
type EmptyState = ReturnType<typeof EmptyState>;
export default EmptyState;
//# sourceMappingURL=EmptyState.svelte.d.ts.map
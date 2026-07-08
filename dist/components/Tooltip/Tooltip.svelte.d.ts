import type { Snippet } from 'svelte';
import type { TooltipProps } from './types';
interface Props extends TooltipProps {
    children?: Snippet;
    content?: Snippet;
}
declare const Tooltip: import("svelte").Component<Props, {}, "">;
type Tooltip = ReturnType<typeof Tooltip>;
export default Tooltip;
//# sourceMappingURL=Tooltip.svelte.d.ts.map
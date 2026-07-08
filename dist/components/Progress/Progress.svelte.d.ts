import type { Snippet } from 'svelte';
import type { ProgressProps } from './types';
interface Props extends ProgressProps {
    labelSnippet?: Snippet<[{
        value: number;
        max: number;
    }]>;
}
declare const Progress: import("svelte").Component<Props, {}, "value">;
type Progress = ReturnType<typeof Progress>;
export default Progress;
//# sourceMappingURL=Progress.svelte.d.ts.map
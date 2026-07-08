import type { Snippet } from 'svelte';
import type { DialogProps } from './types';
interface Props extends DialogProps {
    children?: Snippet;
    header?: Snippet;
    footer?: Snippet;
}
declare const Dialog: import("svelte").Component<Props, {}, "open">;
type Dialog = ReturnType<typeof Dialog>;
export default Dialog;
//# sourceMappingURL=Dialog.svelte.d.ts.map
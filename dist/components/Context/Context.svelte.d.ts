import type { Snippet } from 'svelte';
import type { ContextProps } from './types';
interface Props extends ContextProps {
    children?: Snippet<[{
        data: unknown;
    }]>;
}
declare const Context: import("svelte").Component<Props, {
    open: (event: MouseEvent, data?: unknown) => void;
    close: () => void;
}, "">;
type Context = ReturnType<typeof Context>;
export default Context;
//# sourceMappingURL=Context.svelte.d.ts.map
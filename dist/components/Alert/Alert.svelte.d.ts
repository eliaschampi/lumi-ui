import type { Snippet } from 'svelte';
import type { AlertProps } from './types';
type Props = AlertProps & {
    children?: Snippet;
    onclose?: (event: MouseEvent) => void;
};
declare const Alert: import("svelte").Component<Props, {}, "active">;
type Alert = ReturnType<typeof Alert>;
export default Alert;
//# sourceMappingURL=Alert.svelte.d.ts.map
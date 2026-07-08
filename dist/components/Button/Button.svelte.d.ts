import type { Snippet } from 'svelte';
import type { ButtonProps } from './types';
interface Props extends ButtonProps {
    children?: Snippet;
    onclick?: (event: MouseEvent) => void;
    'aria-label'?: string;
}
declare const Button: import("svelte").Component<Props, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
//# sourceMappingURL=Button.svelte.d.ts.map
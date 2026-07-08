import type { Snippet } from 'svelte';
import type { DropdownProps } from './types';
interface Props {
    open?: boolean;
    position?: DropdownProps['position'];
    size?: DropdownProps['size'];
    disabled?: boolean;
    trigger?: DropdownProps['trigger'];
    closeOnClickOutside?: boolean;
    maxHeight?: number;
    offset?: number;
    viewportPadding?: number;
    'aria-label'?: string;
    class?: string;
    onshow?: () => void;
    onhide?: () => void;
    children?: Snippet;
    content?: Snippet;
    triggerContent?: Snippet;
}
declare const Dropdown: import("svelte").Component<Props, {}, "open">;
type Dropdown = ReturnType<typeof Dropdown>;
export default Dropdown;
//# sourceMappingURL=Dropdown.svelte.d.ts.map
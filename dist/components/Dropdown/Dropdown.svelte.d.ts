import type { Snippet } from 'svelte';
import type { DropdownPlacement, DropdownTrigger } from './types';
interface Props {
    open?: boolean;
    placement?: DropdownPlacement;
    position?: DropdownPlacement;
    size?: 'sm' | 'md';
    disabled?: boolean;
    trigger?: DropdownTrigger;
    closeOnClickOutside?: boolean;
    maxHeight?: number;
    offset?: number;
    viewportPadding?: number;
    'aria-label'?: string;
    class?: string;
    onopen?: () => void;
    onclose?: () => void;
    children?: Snippet;
    content?: Snippet;
    triggerContent?: Snippet;
}
declare const Dropdown: import("svelte").Component<Props, {}, "open">;
type Dropdown = ReturnType<typeof Dropdown>;
export default Dropdown;
//# sourceMappingURL=Dropdown.svelte.d.ts.map
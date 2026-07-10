import type { Snippet } from 'svelte';
import type { DropdownProps } from './types';
interface Props extends DropdownProps {
    children?: Snippet;
    content?: Snippet;
    triggerContent?: Snippet;
}
declare const Dropdown: import("svelte").Component<Props, {}, "open">;
type Dropdown = ReturnType<typeof Dropdown>;
export default Dropdown;
//# sourceMappingURL=Dropdown.svelte.d.ts.map
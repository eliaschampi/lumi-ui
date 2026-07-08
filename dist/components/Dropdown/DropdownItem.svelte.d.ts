import type { Snippet } from 'svelte';
import type { LumiColor } from '../config';
interface Props {
    children?: Snippet;
    icon?: string;
    href?: string;
    color?: LumiColor;
    disabled?: boolean;
    submit?: boolean;
    selected?: boolean;
    class?: string;
    onclick?: () => void;
}
declare const DropdownItem: import("svelte").Component<Props, {}, "">;
type DropdownItem = ReturnType<typeof DropdownItem>;
export default DropdownItem;
//# sourceMappingURL=DropdownItem.svelte.d.ts.map
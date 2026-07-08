import type { Snippet } from 'svelte';
import type { SidebarItemProps } from './types';
interface Props extends SidebarItemProps {
    children?: Snippet;
    icon?: Snippet;
}
declare const SidebarItem: import("svelte").Component<Props, {}, "">;
type SidebarItem = ReturnType<typeof SidebarItem>;
export default SidebarItem;
//# sourceMappingURL=SidebarItem.svelte.d.ts.map
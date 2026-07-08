import type { Snippet } from 'svelte';
import type { SidebarProps } from './types';
interface Props extends SidebarProps {
    children?: Snippet;
    header?: Snippet;
}
declare const Sidebar: import("svelte").Component<Props, {}, "">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
//# sourceMappingURL=Sidebar.svelte.d.ts.map
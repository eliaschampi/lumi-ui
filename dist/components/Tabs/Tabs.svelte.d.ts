import type { Snippet } from 'svelte';
import type { TabsProps } from './types';
interface Props extends TabsProps {
    children?: Snippet;
}
declare const Tabs: import("svelte").Component<Props, {}, "value">;
type Tabs = ReturnType<typeof Tabs>;
export default Tabs;
//# sourceMappingURL=Tabs.svelte.d.ts.map
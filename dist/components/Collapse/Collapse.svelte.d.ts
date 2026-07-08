import type { Snippet } from 'svelte';
import type { CollapseProps } from './types';
interface Props extends CollapseProps {
    children?: Snippet;
    titleSnippet?: Snippet;
}
declare const Collapse: import("svelte").Component<Props, {}, "">;
type Collapse = ReturnType<typeof Collapse>;
export default Collapse;
//# sourceMappingURL=Collapse.svelte.d.ts.map
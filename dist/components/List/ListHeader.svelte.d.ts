import type { Snippet } from 'svelte';
import type { ListHeaderProps } from './types';
interface Props extends ListHeaderProps {
    children?: Snippet;
    actions?: Snippet;
}
declare const ListHeader: import("svelte").Component<Props, {}, "">;
type ListHeader = ReturnType<typeof ListHeader>;
export default ListHeader;
//# sourceMappingURL=ListHeader.svelte.d.ts.map
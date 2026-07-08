import type { Snippet } from 'svelte';
import type { TableProps, TableRow } from './types';
interface Props extends TableProps {
    children?: Snippet;
    header?: Snippet;
    thead?: Snippet;
    row?: Snippet<[{
        row: TableRow;
        index: number;
    }]>;
    paginationSlot?: Snippet<[
        {
            currentPage: number;
            totalPages: number;
            itemsPerPage: number;
            totalItems: number;
        }
    ]>;
}
declare const Table: import("svelte").Component<Props, {}, "selected">;
type Table = ReturnType<typeof Table>;
export default Table;
//# sourceMappingURL=Table.svelte.d.ts.map
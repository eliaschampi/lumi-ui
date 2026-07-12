import type { TableProps } from './types';
declare function $$render<TRow extends object>(): {
    props: TableProps<TRow>;
    exports: {};
    bindings: "selected";
    slots: {};
    events: {};
};
declare class __sveltets_Render<TRow extends object> {
    props(): ReturnType<typeof $$render<TRow>>['props'];
    events(): ReturnType<typeof $$render<TRow>>['events'];
    slots(): ReturnType<typeof $$render<TRow>>['slots'];
    bindings(): "selected";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <TRow extends object>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TRow>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TRow>['props']>, ReturnType<__sveltets_Render<TRow>['events']>, ReturnType<__sveltets_Render<TRow>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TRow>['bindings']>;
    } & ReturnType<__sveltets_Render<TRow>['exports']>;
    <TRow extends object>(internal: unknown, props: ReturnType<__sveltets_Render<TRow>['props']> & {}): ReturnType<__sveltets_Render<TRow>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const Table: $$IsomorphicComponent;
type Table<TRow extends object> = InstanceType<typeof Table<TRow>>;
export default Table;
//# sourceMappingURL=Table.svelte.d.ts.map
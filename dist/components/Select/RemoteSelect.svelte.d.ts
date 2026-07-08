export type RemoteSelectSearchParamValue = string | number | boolean | null | undefined;
export type RemoteSelectSearchParams = Record<string, RemoteSelectSearchParamValue>;
export interface RemoteSelectProps<TItem> {
    value?: string;
    selected?: TItem | null;
    endpoint: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    minQueryLength: number;
    debounceMs: number;
    limit: number;
    noResultsText?: string;
    searchParam?: string;
    errorMessageFallback: string;
    getOptionValue: (item: TItem) => string;
    getOptionLabel: (item: TItem) => string;
    getOptionDisabled?: (item: TItem) => boolean;
    getSearchParams?: () => RemoteSelectSearchParams;
    onchange?: (item: TItem | null) => void;
}
declare function $$render<TItem>(): {
    props: RemoteSelectProps<TItem>;
    exports: {};
    bindings: "selected" | "value";
    slots: {};
    events: {};
};
declare class __sveltets_Render<TItem> {
    props(): ReturnType<typeof $$render<TItem>>['props'];
    events(): ReturnType<typeof $$render<TItem>>['events'];
    slots(): ReturnType<typeof $$render<TItem>>['slots'];
    bindings(): "selected" | "value";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <TItem>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TItem>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TItem>['props']>, ReturnType<__sveltets_Render<TItem>['events']>, ReturnType<__sveltets_Render<TItem>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TItem>['bindings']>;
    } & ReturnType<__sveltets_Render<TItem>['exports']>;
    <TItem>(internal: unknown, props: ReturnType<__sveltets_Render<TItem>['props']> & {}): ReturnType<__sveltets_Render<TItem>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const RemoteSelect: $$IsomorphicComponent;
type RemoteSelect<TItem> = InstanceType<typeof RemoteSelect<TItem>>;
export default RemoteSelect;
//# sourceMappingURL=RemoteSelect.svelte.d.ts.map
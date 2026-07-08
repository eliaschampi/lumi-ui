import type { Snippet } from 'svelte';
import type { InfoItemProps } from './types';
interface Props extends InfoItemProps {
    children?: Snippet;
    iconSlot?: Snippet;
    labelSlot?: Snippet;
}
declare const InfoItem: import("svelte").Component<Props, {}, "">;
type InfoItem = ReturnType<typeof InfoItem>;
export default InfoItem;
//# sourceMappingURL=InfoItem.svelte.d.ts.map
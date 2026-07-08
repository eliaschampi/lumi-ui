import type { Snippet } from 'svelte';
import type { CardProps } from './types';
interface Props extends CardProps {
    children?: Snippet;
    header?: Snippet;
    footer?: Snippet;
    onclick?: (event: MouseEvent) => void;
    'aria-label'?: string;
}
declare const Card: import("svelte").Component<Props, {}, "">;
type Card = ReturnType<typeof Card>;
export default Card;
//# sourceMappingURL=Card.svelte.d.ts.map
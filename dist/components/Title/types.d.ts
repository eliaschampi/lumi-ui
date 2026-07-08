import type { LumiColor, LumiDisplaySize } from '../config';
export type TitleColor = LumiColor | 'text';
export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TitleSize = LumiDisplaySize;
export interface TitleProps {
    /** Heading id for accessible labelling */
    id?: string;
    /** Semantic heading level */
    level?: TitleLevel;
    /** Title size */
    size?: TitleSize;
    /** Title text color */
    color?: TitleColor;
    /** Icon name */
    icon?: string;
    /** Icon color */
    iconColor?: TitleColor;
    /** Main title text */
    title?: string;
    /** Subtitle text */
    subtitle?: string;
    /** Custom class */
    class?: string;
}
//# sourceMappingURL=types.d.ts.map
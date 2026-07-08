import type { Snippet } from 'svelte';
import type { NavbarProps } from './types';
interface Props extends NavbarProps {
    title?: Snippet;
    actions?: Snippet;
    user?: Snippet;
}
declare const Navbar: import("svelte").Component<Props, {}, "">;
type Navbar = ReturnType<typeof Navbar>;
export default Navbar;
//# sourceMappingURL=Navbar.svelte.d.ts.map
# Lumi UI — Soft-Depth Redesign Plan (0.3.0)

Working document. Delete before release, or keep until the last step lands.

**Hard constraint: zero consumer API change.** No prop added, removed, or renamed. No
public token _name_ changed. No BEM class renamed. Only token _values_, recipe
composition, and internal CSS change. Consumer override surface
(`--lumi-brand-*`, `--lumi-status-*`, `--lumi-color-neutral`, `--lumi-color-canvas`,
`--lumi-dark-accent-mix`) stays byte-identical in shape.

## Why refactor rather than accept

The token architecture (seed → derived) is sound and stays. The audit found the
problem is one layer up: **there is no recipe layer**, so every component
re-derives the same visual decision by hand. Measured:

| Finding                                   | Count                                                 | Consequence                                          |
| ----------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| Seeds clipped outside sRGB gamut          | 4 of 6                                                | rendered color ≠ declared token; hue/lightness drift |
| Accent lightness planes                   | 5 different (52–56%)                                  | accents read at unequal weight                       |
| Hand-written `box-shadow`                 | 32 sites                                              | no single elevation language                         |
| `transition:` bypassing a composite token | 45 sites                                              | 12 are the _same_ recipe verbatim                    |
| Ad-hoc hover/press `scale()` literals     | 5 magnitudes, 12 sites                                | press grows in Slider, shrinks in Button             |
| `prefers-reduced-motion` blocks           | 27 scattered, 17 components uncovered                 | inconsistent and unmaintainable                      |
| Duplicate `@keyframes`                    | 4× spin, 2× pulse                                     |                                                      |
| Radius role collisions                    | option rows md↔lg, panels xl↔2xl, focus rings 4 radii |                                                      |

Fixing this at the token/recipe layer changes the whole library's look from a
handful of declarations — which is simultaneously the redesign, the consistency
work, and the byte reduction.

## Design direction

Soft-depth (neumorphic light logic) inside a glass shell. Concretely:

- Elevation = **three stacked layers**, never one hard drop shadow:
  `rim` (inset top highlight = light source) + `contact` (tight, ~0 blur) +
  `ambient` (wide, very low alpha, negative spread).
- Recessed controls invert it: `inset` shadow instead of `rim`.
- Borders are hairlines derived from ink alpha, never a palette gray.
- Radius is chosen by **role**, not by t-shirt size, at every call site.
- One easing (`--lumi-easing-default`) for everything that is not a spinner.
- One motion dial (`--lumi-motion-scale`) gates every transition and transform.

## Verified palette (do not re-derive by eye)

Unified lightness `L = 54%`, chroma `min(sRGB gamut max × 0.96, 0.21)`.
Warning keeps its own plane (amber below L≈70% is brown).

| Role      | Seed                   | Renders   | white fg           | on light surface | dark accent on dark surface |
| --------- | ---------------------- | --------- | ------------------ | ---------------- | --------------------------- |
| primary   | `oklch(54% 0.184 257)` | `#0e6ad6` | 5.17               | 5.06             | 5.91                        |
| secondary | `oklch(54% 0.21 310)`  | `#933cc7` | 5.66               | 5.53             | 5.58                        |
| success   | `oklch(54% 0.121 158)` | `#128353` | 4.77               | 4.66             | 6.17                        |
| warning   | `oklch(80% 0.162 82)`  | `#f1b112` | — (black fg 11.08) | ink mix 4.93     | 11.18                       |
| danger    | `oklch(54% 0.21 24)`   | `#cd142a` | 5.65               | 5.53             | 5.55                        |
| info      | `oklch(54% 0.09 210)`  | `#107c8b` | 4.88               | 4.77             | 6.08                        |

All ≥ 4.5:1. All in sRGB gamut (previously primary, success, warning, info were
clipped — info requested chroma 0.150 against a 0.090 ceiling, a 67% overshoot).
Hues are unchanged, so brand identity is preserved; only the clipping and the
lightness spread are corrected.

## Step 1 — Token foundation (`tokens.base.css`)

- [x] 1.1 Palette: apply the verified table above to the six seeds, light + dark.
- [x] 1.2 Elevation engine: `--lumi-elevation-rim`, `-contact`, `-ambient-*`,
      `--lumi-elevation-key-*` alpha ladder. Recompose `--lumi-shadow-sm|md|lg|xl`
      and `--lumi-floating-surface-shadow` from them.
- [x] 1.3 Recessed: `--lumi-shadow-inset`; rebuild `--lumi-control-shadow` on it.
- [x] 1.4 Focus: `--lumi-focus-ring` recipe token (halo + accent ring).
- [x] 1.5 Radius roles: `--lumi-radius-option`, `--lumi-radius-panel`,
      `--lumi-radius-tooltip`, `--lumi-radius-pill`.
- [x] 1.6 Motion: `--lumi-motion-scale` gating all durations, lift, and scales;
      `--lumi-transition-interactive`; `--lumi-duration-spin`;
      `--lumi-interactive-hover-scale`; `--lumi-interactive-zoom-scale`.

## Step 2 — Recipe layer (`core.css`, `patterns.css`)

- [x] 2.1 Extend the `:where()` primitive layer: accent-aware `--lumi-focus-ring`
      on interactive roots, elevation roles on surfaces.
- [x] 2.2 Single global `prefers-reduced-motion` block driving `--lumi-motion-scale`
      plus an animation guard, replacing the 27 scattered blocks.
- [x] 2.3 `patterns.css`: literal lift → `--lumi-interactive-lift`; radius roles;
      routed transitions through composites; inline focus ring → `--lumi-focus-ring`.
      The two `--lumi-surface-blur-filter` recipes stay duplicated on purpose — a
      `:root` recipe cannot resolve `--lumi-surface-blur`, which is declared on the
      consuming element, so sharing it would need a new public class for two lines.
- [x] 2.4 Performance: `Progress` indeterminate `left` → `translateX`
      (compositor-only), drop `will-change: left`; `Navbar` `transition-all` →
      explicit property list.

## Step 3 — Component alignment (64 components)

- [x] 3.1 Replace the 12× verbatim hybrid transition with `--lumi-transition-interactive`.
- [x] 3.2 Replace scale literals (1.01/1.02/1.05/1.08/1.1) with hover/zoom/press tokens.
- [x] 3.3 Normalize radii by role: option rows, inner panels, tooltips, close buttons,
      focus-ring radii.
- [x] 3.4 Replace the 3 duplicated inline focus-ring shadows with `--lumi-focus-ring`.
- [x] 3.5 Delete per-component reduced-motion blocks now covered globally; keep only
      animation-specific resets.
- [x] 3.6 Fix concrete violations: `Collapse` literal `border-radius: 0` and the
      `radius="full"` → `2xl` mapping bug; `border-radius: 50%` ×2;
      `border-inline-start` width taken from the spacing scale ×2; `border: 0`;
      redundant `border-width` override; `filter: saturate(0.8)` literal. Button
      intentionally reuses core's global `lumi-spin`; duplicating it locally would
      add bytes, and the documented component contract imports Lumi styles globally.

## Verification gate

```bash
pnpm run lint
pnpm run check
pnpm run package
git diff --check
```

Plus a manual grep gate — these must return nothing outside `tokens.base.css`:

```bash
grep -rn "box-shadow: 0 0 0 var(--lumi-border-width-thick)" src/lib   # inline focus rings
grep -rnE "scale\(1\.(0[1-9]|1)" src/lib                             # scale literals
grep -rn "prefers-reduced-motion" src/lib/components                 # only Progress fallback remains
```

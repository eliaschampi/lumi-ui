# Color contract refactor

Estado: implementado y validado en la librería.

## Objetivo

Actualizar la identidad visual por defecto a cobalt, oliva y papel cálido sin
acoplar componentes a una paleta concreta. El contrato mantiene seis roles
semánticos (`primary`, `secondary`, `success`, `warning`, `danger`, `info`) y
separa el color de interacción del fondo lleno y de su contenido.

## Contrato público

Cada rol expone la misma familia:

| Token                            | Responsabilidad                       |
| -------------------------------- | ------------------------------------- |
| `--lumi-color-{role}`            | Texto, icono, borde, foco e indicador |
| `--lumi-color-{role}-bg`         | Superficie cromática suave            |
| `--lumi-color-{role}-solid`      | Superficie cromática llena            |
| `--lumi-color-{role}-foreground` | Contenido sobre `solid`               |

Las aplicaciones deben personalizar los seeds propietarios, no los tokens
derivados:

- marca: `--lumi-brand-primary`, `--lumi-brand-secondary`;
- estados: `--lumi-status-success`, `warning`, `danger`, `info`;
- superficie y tinta: `--lumi-color-canvas`, `--lumi-color-neutral`.

Los solids por defecto heredan su accent correspondiente. Una marca más
brillante puede separar `accent + solid + foreground`, pero debe validar la
tupla completa.

## Decisiones implementadas

1. Los seeds light por defecto cumplen contraste como tinta sobre superficies
   neutrales y sobre sus fondos suaves.
2. Los solids permanecen estables entre temas; el foreground se resuelve contra
   el fondo efectivo, no contra el nombre del tema.
3. Los accents dark se derivan mediante `--lumi-dark-accent-mix`, con escape
   explícito en `--lumi-brand-*-dark`.
4. `Button`, `Switch`, `Chip` y `Progress` consumen los roles semánticos sin
   colores de producto ni selectores correctivos.
5. Las utilidades neutrales de fondo restauran tinta neutral con especificidad
   baja, de modo que una utilidad explícita como `.lumi-text--muted` conserva
   prioridad.
6. La identidad visual vive en `tokens.base.css`; `core.css` y los componentes
   solo consumen el contrato.

## Compatibilidad

No cambian props, tipos, exports ni rutas de importación. Sí cambia la identidad
visual por defecto, por lo que los consumidores que no sobrescriben seeds
heredan la nueva paleta.

Un consumidor con una marca clara debe cargar su tema después de Lumi:

```css
:root {
	--lumi-brand-secondary: #68a418;
	--lumi-brand-secondary-solid: #497311;
	--lumi-brand-secondary-foreground: #fff;
}
```

No se deben asignar directamente `--lumi-color-secondary`,
`--lumi-color-secondary-solid` ni otros tokens derivados.

## Criterios de aceptación

- texto normal: contraste mínimo `4.5:1`;
- iconos, checks, thumbs, foco y bordes funcionales: mínimo `3:1`;
- cada superficie llena usa su foreground pareado;
- light y dark conservan la jerarquía neutral de superficies;
- no hay hex, RGB ni nombres de producto dentro de componentes;
- no hay cambios en la API Svelte/TypeScript;
- el crecimiento combinado gzip de `tokens.base.css` y `core.css` permanece
  dentro del presupuesto de 350 bytes;
- lint, checks de librería y ejemplo, package y `git diff --check` pasan.

## Migración de consumidores

1. Cargar `@lumi-ui/svelte/styles` antes del tema del producto.
2. Mover overrides desde tokens derivados hacia seeds.
3. Si un accent claro no admite contenido blanco, definir un solid más profundo
   y mantener el foreground pareado.
4. Revisar estados filled, soft, hover, focus y disabled en light y dark.
5. Validar visualmente los anchos responsive usados por la aplicación.

Faztore, Coedula y Aeduca pueden adoptar el contrato sin forks de componentes.
Cada producto conserva la responsabilidad de calibrar sus propios seeds y de
publicar la versión de Lumi que contiene estos tokens.

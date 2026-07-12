# Theming

Theming allows for the customization of specific visual attributes across the product interface.

[Design tokens](design-tokens.md) | [Motion](motion.md)

## Key UX concepts

Theming here means exactly one thing: **changing the value behind a token**. The token sheet (`@cloud/ui/globals.css`) is the only surface a theme can touch, and it is the only surface it needs to touch — because `@theme` emits the CSS variables _and_ generates the Tailwind utilities from the same declaration, a component that wrote `bg-surface-2` has already opted into every theme that will ever exist.

The corollary is the rule that makes theming work at all: **consume the key, never the value**. `bg-surface-2` survives a theme change; `bg-[oklch(100%_0_0)]` freezes a decision that was never yours to freeze, and the arbitrary-value lint blocks it for that reason.

There is no runtime theme builder, no per-tenant palette, and no theme object passed through React. A theme is a set of CSS variable values applied by a selector on the root element. That is the whole model.

## What can I change through theming?

**Supported** — the values of existing tokens, under a root selector:

- Colours: the palette ramps, the surfaces, the content steps, the lines, the chart palettes.
- Shadows: the elevation ladder, the focus ring, the table accents.
- Radii, the type scale, the font stacks, the durations and easings.

Everything in the `@theme` block is fair game _as a value_.

**Not supported**, and deliberately:

- **Adding a token.** New `--color-*`, `--spacing-*`, `--radius-*` entries are refused by default. A missing token is a conversation with the operator, not a commit — see the `@cloud/ui` README.
- **Changing a token's meaning.** Repointing `--color-error-500` at a green would theme the system into incoherence, because a hundred call sites have already decided that token means _error_.
- **Per-component overrides.** There is no theme slot for "the Button in this app". A component's look comes from tokens; if two apps need different buttons, they need a different token value, not a component fork.
- **Structure.** Theming changes values, not layout, not spacing rules, not which component you use.

## Accessibility

Contrast is a property of the token pair, not of a token. `content-primary` on `surface-2` is a contract; changing either side breaks it, and changing both can break it while each looks fine in isolation.

The system's ramps are built in OKLCH precisely so that lightness is perceptually meaningful — a step's `L` value is an actual claim about how light it looks, which is what makes a contrast check on a ramp step trustworthy. A theme that swaps in sRGB hex values loses that property silently.

Two rules follow, and they are not optional:

- Re-check contrast for **both** modes after any colour change. A dark-mode override that only touched the surface can break every text pair on it.
- Colour is never the only carrier of meaning. A theme cannot make an interface accessible that relied on hue alone, and it can easily make one that got away with it stop getting away with it.

## Dark mode

Dark mode is a cascade, not a second theme file. `[data-theme="dark"]` (and `.dark`) redefines **only the values that change**; a token absent from that block keeps its light value. Tokens defined as `var()` or `color-mix()` of other tokens follow automatically and must never be given a dark override — doing so freezes them out of the cascade.

The dark theme is not the light theme inverted. Three of its decisions are worth knowing before you touch it:

- **The primary ramp inverts and desaturates.** In dark mode `primary-700` is a near-white neutral gray, not a dark blue. A `bg-primary` button renders near-white on the dark canvas. Numeric steps are positions on a ramp, not brightness promises.
- **`shadow-1` stops being a shadow.** It becomes a 1px ring, because a dark canvas separates surfaces with a light edge, not a cast shadow. A component that consumed the token gets this for free; one that hardcoded a `box-shadow` value gets a smudge.
- **Chart hues lift rather than repeat.** Same hues, higher lightness, tuned for the dark canvas.

The stylesheet also sets `color-scheme: dark`, so native form controls, scrollbars, and the caret follow.

## Visual contexts

**The system does not have visual contexts.** Cloudscape's notion — a region of the page (a dark header, a hero band) that flips a component's palette while the rest of the page stays light — has no equivalent here, and nothing in the token sheet supports one. The only theme switch is light/dark, at the root, for the whole document.

If you need a locally inverted surface, the supported way is the tokens that already exist for it: `--color-content-inverse` for text on an inverted surface (this is what the tooltip and the chart tooltip use), and `--color-surface-overlay` for scrims. That is a token pair, not a context — nesting it does not re-theme the components inside it.

Do not invent a context by putting a `.dark` class on a subtree. It will work, in the sense that the variables cascade, and it will then be a region whose theme cannot be reasoned about from the root — including for the chart palette, which resolves its dark selector explicitly.

## General guidelines

### Do

- Consume tokens by key, and pick the key whose **name** matches what the value means in the interface.
- Override values in a root-level selector, in one place.
- Let `var()`-derived tokens inherit; give a dark override only to a token whose value is literal.
- Re-check contrast in both modes after any colour change.
- Take the closest existing token when you think one is missing, and raise it with the operator if there genuinely isn't one.

### Don't

- Don't add a token, or change what one means, without the operator's sign-off.
- Don't write a literal colour, radius, or shadow at a call site. Lint blocks it, and it is invisible to every theme.
- Don't write a `dark:` variant for something the tokens already switch. If you consumed tokens by role, the dark theme needs no branch from you.
- Don't apply a theme selector to a subtree to fake a local context.
- Don't hardcode a light-mode value into a chart. The dark palette is a different set of values, not a filter.

## Implementation

### Defining a theme

```css
/* The light values — @theme both emits :root vars AND generates utilities. */
@theme {
  --color-surface-2: oklch(100% 0 0);
  --color-content-primary: oklch(18% 0.01 270);
}

/* The dark values — only what changes. Specificity (0,1,0) beats :root. */
[data-theme="dark"],
.dark {
  --color-surface-2: oklch(17% 0.004 260);
  --color-content-primary: oklch(94% 0.003 260);
}
```

Defining `--color-surface-2` is what makes `bg-surface-2` exist. There is no separate build step and no second place to register it.

### Applying a theme

The theme is a `data-theme` attribute plus a `.dark` class on `<html>`. **In this app, the app owns that mechanism, not the package.**

`apps/web/app/(dashboard)/_components/use-theme-pref.ts` is the live implementation, and it is the one to copy: three preferences (`light` / `dark` / `system`), persisted to `localStorage`, applied to `document.documentElement`, with a `matchMedia` listener so that _system_ keeps following the OS after mount.

The package also exports `ThemeProvider`, `useTheme`, and `ThemeToggle`, and **they are not wired into this app**. Know what they currently are before reaching for them:

- `ThemeProvider` holds `light | dark` in React state. It has **no `system` option, no persistence, and it never writes `data-theme` or `.dark` to the DOM** — so mounting it alone changes no pixels.
- `useTheme` called outside a provider returns a silent no-op fallback rather than throwing. A `ThemeToggle` dropped into a tree with no provider therefore renders a button that does nothing, quietly.

So: for a new surface in `apps/web`, use `useThemePref`. Treat the package's theme trio as an unfinished API, not as the supported path — using it is how you end up with a toggle that renders and does nothing.

### Consuming a theme

```tsx
// Correct — survives both themes with no branch.
<div className="bg-surface-2 text-content-primary border border-line-default shadow-1" />

// Also fine — every token is a CSS variable, for the cases a utility can't reach.
<span style={{ color: `var(--color-chart-${index + 1})` }} />
```


# Iconography

Icons are a visual language for features, functionality, and state. They are recognised before they are read — which is exactly why an icon that means two things, or that carries meaning no text repeats, costs the user more than it saves.

[Semantic tone](../components/semantic-tone.md) | [Colors](colors.md) | [Spacing](spacing.md)

## Icon set

**The set is [lucide](https://lucide.dev), through `lucide-react`.** There is no in-house icon component and no icon registry — you import the glyph you need and render it.

```tsx
import { Plus, Trash2 } from "lucide-react";
```

One set. Mixing a second icon library into a screen is visible immediately: the stroke weights disagree, the optical sizes disagree, and the page reads as two products stitched together. If lucide has no glyph for the thing, **stop and raise it** rather than importing one from somewhere else.

The library itself has exactly one exception, and it is not a licence: `ThemeToggle` hand-draws its sun and moon as inline `<svg>` rather than importing them. A hand-drawn glyph is a maintenance liability — it does not follow the set when the set changes — so it needs a reason you can state out loud, not a preference.

## Sizing

### Inside a control, the stylesheet sizes the icon — not you

This is the rule most likely to surprise you, and the one worth reading twice.

`@cloud/ui/component-defaults.css` carries a single source of truth: **any `svg` without an explicit `size-*` class, inside any of the 24 interactive slots, is 14px.** The slots are the ones you would expect — `button`, `select-trigger`, `select-item`, `dropdown-menu-item`, `context-menu-item`, `command-item`, `tabs-trigger`, `accordion-trigger`, `menubar-item`, and the rest of that family.

```tsx
<Button>
  <Plus /> {/* 14px. You wrote no size, and you should not. */}
  Create role
</Button>
```

So inside a control you write **no size at all**. An explicit `size-*` overrides the default, which is the escape hatch — but reach for it only when you can say why this icon is not 14px.

This is also **why the stylesheet import order matters**. `component-defaults.css` must load **before** `globals.css`. Get it backwards and the default never applies: lucide ships icons at **24px**, and every button on the page inflates. See [API surface](../api-surface.md).

### Outside a control, 16px is the default

A standalone icon — in an `Empty` state, a `KeyValue` row, a meta line, a `Timeline` entry — is **`size-4` (16px)**, and you write it. `size-3.5` (14px) is the dense variant, and `size-3` (12px) is for genuinely tiny chrome.

| Class      | Size | Where                                                                           |
| ---------- | ---- | ------------------------------------------------------------------------------- |
| _none_     | 14px | Inside any of the 24 interactive slots. **The stylesheet does this.**           |
| `size-4`   | 16px | The default for a standalone icon: empty states, meta lines, list rows, alerts. |
| `size-3.5` | 14px | A dense standalone icon, matching the in-control size.                          |
| `size-3`   | 12px | Small chrome — a chevron in a breadcrumb, a badge's affordance.                 |

### Pair the icon with its text, not with a number

An icon beside text should read as one object with it. Match the icon's size to the text's, and let the [half-step gap](spacing.md#the-half-steps-and-what-they-mean) do the rest: `gap-1.5` between a `Button`'s icon and its label, `gap-1` between a `Badge`'s icon and its text. That gap is not decoration — it is what says the two are one thing.

## Stroke width

There is **no stroke-width token**. Icons render at lucide's default, and you should leave it alone — with one exception that is worth understanding, because it will bite you the day you shrink a glyph.

### Shrinking an icon thins its stroke

`stroke-width` is expressed in **viewBox units**, not pixels. So the same glyph rendered smaller draws a **lighter** line — the stroke scales down with everything else. At 14px and 16px the difference is invisible, which is why nothing in the system compensates.

It stops being invisible when the glyph gets genuinely small. `Checkbox`'s `sm` size draws its checkmark inside an 8px glyph, and at that size the mark goes soft and reads as a smudge. So `Checkbox` scales `strokeWidth` **by the inverse of the glyph ratio**, holding the rendered weight constant across its sizes.

The rule to take away: **if a small icon looks weak, it is the stroke going optically light — not the colour.** Do not fix it by darkening the icon. Either use a larger size, or scale the stroke back the way `Checkbox` does, and say why in a comment.

Charts are the other place a stroke is deliberate: `ChartSparkline` draws at `1.5`, because a data line is not an icon. See [Chart sparkline](../components/chart-sparkline.md).

## Action icons

An action icon represents something the user can do.

### In a button with a label

Put the glyph beside the label and write no size. The button owns the gap, the size, and the alignment.

```tsx
<Button variant="primary">
  <Plus />
  Create role
</Button>
```

### Icon-only buttons

An icon-only `Button` takes an `icon` size, and it **must** carry an `aria-label`. Nothing enforces this — there is no lint rule — so it is on you, and it is the single most common accessibility defect in an operational UI.

| Size      | Box  | Where                                             |
| --------- | ---- | ------------------------------------------------- |
| `icon-xs` | 24px | A row-level action in a dense table.              |
| `icon-sm` | 28px | A toolbar action; the detail page's back button.  |
| `icon`    | 32px | The default icon button.                          |
| `icon-lg` | 36px | A prominent standalone action, and touch targets. |

```tsx
<Button variant="ghost" size="icon-sm" aria-label="Delete role Regional Admin">
  <Trash2 />
</Button>
```

**Name the record, not the verb alone.** `aria-label="Delete"` on twelve table rows gives a screen-reader user twelve identical buttons and no way to tell them apart. See [Delete patterns](../patterns/delete-patterns.md).

An icon-only action in a row or a toolbar is `ghost` or `ghost-danger` — never a fill, never a brand colour. The row is the content; the icon is a tool. See [Action weight](../patterns/action-weight.md).

## Status icons

A status icon communicates state. **Its colour is not yours to set.**

`Alert` detects a direct `svg` child and switches to an icon-plus-content grid on its own — and the icon inherits the tone's foreground colour automatically:

```tsx
<Alert tone="error">
  <CircleAlert /> {/* coloured by the tone. Do not add a text-* class. */}
  <AlertTitle>Settlement failed</AlertTitle>
</Alert>
```

`Badge`'s `dot` follows the same principle: the dot takes the badge's own text colour, so a tone change moves both together.

The rule underneath both: **the tone owns the colour, and the icon inherits it.** Hand-colouring a status icon breaks the light/dark pairing and, the day the tone changes, leaves an icon saying something the text does not. See [Semantic tone](../components/semantic-tone.md).

**Colour is never the only signal.** A red icon is invisible to a colour-blind user and to anyone reading a greyscale screenshot. Every status icon is paired with text that says the same thing.

## Symbol icons

A symbol icon represents a thing rather than an action or a state — a resource type in a list, a file kind in a `Dropzone`, a channel in a legend.

- **One glyph, one meaning, across the whole product.** If a gear means "settings" on one screen, it cannot mean "processing" on another. The moment a glyph carries two meanings it carries neither.
- **A symbol icon is decorative unless it is the only label.** If the row already says "API key", the key glyph adds recognition, not information: give it `aria-hidden`, and let the text be the accessible name.

## General guidelines

### Do

- Import from `lucide-react`. One set.
- Write **no size** on an icon inside a control. The stylesheet makes it 14px.
- Write `size-4` on a standalone icon, and match it to the text beside it.
- Give every icon-only button an `aria-label` that names the record, not just the verb.
- Let the tone colour a status icon.
- Mark a decorative icon `aria-hidden` when the text beside it already says the same thing.

### Don't

- Don't mix in a second icon library. The stroke weights will not agree.
- Don't set a size on an icon inside a button. You are overriding a default that already agrees with every other control.
- Don't adjust an icon's `strokeWidth` to make it sit better. Change the size instead.
- Don't hand-colour a status icon with a `text-*` class. The tone owns it.
- Don't use an icon alone to carry a status. Colour and shape are not enough; the text carries it.
- Don't reuse a glyph for a second meaning. Raise it instead.
- Don't ship an icon-only button without a label. Nothing will catch it for you.

## Known conflicts

Two things in the source do not do what they look like they do:

- **`data-icon` is dead.** `Button` declares six rules of the form `has-data-[icon=inline-end]:pr-2`, which tighten the padding on the side an edge icon sits — but **nothing in the library or the application ever sets `data-icon`**, so the adjustment never fires. Either the attribute should be wired up or the rules should go; today they are a comment that looks like behaviour.
- **`--spacing-control-xs` (22px) vs `Button`'s `xs` (a raw `h-6`, 24px).** The token and the button disagree by 2px. See [Spacing](spacing.md#control-sizing).

## Related pages

- [Semantic tone](../components/semantic-tone.md) — the vocabulary a status icon's colour comes from.
- [Action weight](../patterns/action-weight.md) — which variant an icon action takes, and why an icon button is never filled.
- [Colors](colors.md) — the tokens behind the tones.
- [Spacing](spacing.md) — the gaps that bind an icon to its label, and the control sizes an icon button snaps to.
- [Accessibility](accessibility.md) — labels, focus, and the rules an icon-only control lives under.
- Components: `Button`, `Alert`, `Badge`, `Empty`, `Dropzone`, `Timeline`.

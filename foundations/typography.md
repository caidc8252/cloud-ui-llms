# Typography

With typography, you can organize and style information with purpose. It provides hierarchy and structure, serves as guidance, and has a fundamental impact on the user experience.

[Design tokens](design-tokens.md) | [Spacing](spacing.md)

## Typeface

### Geist

The product face is **Geist Variable**, loaded through `@fontsource-variable/geist` and applied to `html` by the base layer. Nothing needs to opt into it.

### Monospace font

**Nothing in this system renders monospace out of the box, and that is a deliberate design.**

There are two _semantic faces_, and both currently resolve to the sans stack:

- `--font-family-code` → identifiers, permission codes, log lines, keyboard shortcuts, OTP input.
- `--font-family-chart` → chart ticks, legends, tooltip readouts.

Repointing **one** of them at `--font-family-mono` (Geist Mono, which is loaded and ready) brings a mono face back for that bucket alone. This is why the call site must name the _bucket_ rather than the _face_: `font-code` says "this is an identifier", which is a durable claim about the content; `font-mono` says "this is monospace", which is a claim about the rendering that the system is not willing to let a call site make.

**Writing `font-mono` in a component is a lint error** (`type-boundary/no-hardcoded-mono`). Text that belongs to no bucket takes no face at all.

And the one that catches people: **digit alignment is not a font family.** If you want figures to line up in a column, you want `tabular-nums` — a font _feature_, orthogonal to the face. Reaching for a monospace face to align numbers is the single most common reason `font-mono` shows up in a diff.

## Type styles

Even-number steps only. There is no 11px and no 13px in the scale.

| Token      | Size | Use                                                                                                                                                            |
| ---------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text-2xs` | 12px | **Deprecated — it is not 10px.** The 10px step was dropped, so `2xs` now aliases `xs` exactly, on both size and line-height. Kept defined only so a stray reference resolves instead of breaking. Write `text-xs`. |
| `text-xs`  | 12px | Caption, hint, meta, helper text. **The smallest rung there is.**                                                                                              |
| `text-sm`  | 14px | **Deprecated.** The 13px step was dropped, so `sm` now aliases `md`. It exists only so a stray reference resolves to 14px instead of breaking. Don't write it. |
| `text-md`  | 14px | Body. The default, and by a wide margin the most-used size in the codebase.                                                                                    |
| `text-lg`  | 16px | Emphasized body, small headings.                                                                                                                               |
| `text-xl`  | 18px | Section heading.                                                                                                                                               |
| `text-2xl` | 24px | Page and detail title.                                                                                                                                         |
| `text-3xl` | 28px | KPI value. Not a page title and not a heading — the figure a stat tile reports.                                                                                |
| `text-4xl` | 36px | Large KPI — the same figure when it is the dashboard's headline number.                                                                                        |
| `text-5xl` | 48px | Largest display.                                                                                                                                               |

**Three rungs are off the ladder and the lint errors on them** (`type-boundary/no-deprecated-text-scale`): `text-sm` and `text-2xs` — the deprecated aliases above, exact duplicates of `text-md` and `text-xs` — and `text-base`, which is Tailwind's own rung and was never ours. Each rung declares its own line-height, so a call site writes `text-md` and nothing else; a `leading-*` marks a deliberate departure, never a repair.

### Heading styles

- **Page / detail title** — `text-2xl font-semibold tracking-tight`.
- **Block card title** — `text-md`, which is `CardTitle`'s default. A card title is not a heading in the type scale; it is body-sized and carries its weight from `font-semibold`.
- **Body / row title** — the body size, with `font-medium`.
- **Sub / overline** — `text-xs`, optionally with `tracking-overline` (0.06em). Not `text-2xs`; it is the same 12px and it is deprecated.

### Body styles

Body is `text-md`. Supporting text is `text-xs`. There is nothing between them, and that is the point: two sizes force you to decide whether a line is content or commentary.

### Weights

`400` / `500` / `600` only. `700` is rare; `300`, `800`, and `900` are avoided. In practice the codebase is `font-medium` and `font-semibold`, with a handful of `font-normal` — if you find yourself wanting a weight outside that set, the hierarchy problem is not a weight problem.

### Code styles

`font-code`, for the bucket described above. It currently renders as sans.

## Fallback fonts

```
--font-family-sans: "Geist Variable", "Inter", -apple-system, BlinkMacSystemFont,
                    "Segoe UI", system-ui, sans-serif;
--font-family-mono: "Geist Mono Variable", "JetBrains Mono", ui-monospace,
                    "SF Mono", Menlo, monospace;
```

The stacks fall back to Inter, then to the platform UI face, so a failed webfont load degrades to something with similar metrics rather than to Times.

## List styles

The system has no list component and no list token. Lists are Tailwind: `list-disc` / `list-decimal` with a `space-y-*` for rhythm, at the body size.

### Guidelines

- Use a list when the items are peers. If they are steps, use a `Stepper` or a `StepIndicator`; if they are records, use a `Table`; if they are key-value pairs, use `KvGrid`. A bulleted list of key-value pairs is a grid that lost its alignment.
- Keep items to one line where possible. A list whose items are paragraphs is prose that wants headings.

## General guidelines

**Within one block, size carries the hierarchy and tone only refines it.** This is the rule that most often gets inverted, and the failure mode is specific: stacked lines that share a size read as unexplained greys no matter how carefully you split them across `content-primary` / `-secondary` / `-tertiary`. The reader sees three lines of the same size in three shades and concludes the shades are decorative. `Timeline` gets this right — the title is `text-md` and the description and meta drop to `text-xs`, so the tone difference lands on top of a size difference that already established the order.

**A number that reports rather than headlines keeps its slot's size and takes emphasis from weight.** `ListSummaryBar`'s count is `text-xs font-semibold`, not `text-3xl` — it is a count, not a KPI. It is the most important value in the bar, and it is still small — because it lives in a low-chrome strip, and blowing it up would make the bar compete with the table it describes. Weight promotes it within its slot; size would promote it out of its slot.

**Never remove a focus ring, and never encode meaning in colour alone** — including in type. A red word is not an error message.

## Implementation

### Sizes and weights

```tsx
<h1 className="text-2xl font-semibold tracking-tight">Users</h1>

<CardTitle>Password state</CardTitle>            {/* text-md font-semibold, built in */}

<p className="text-xs text-content-tertiary">
  Enforcement is governed by the platform-wide password policy.
</p>
```

### Numbers

```tsx
<span className="tabular-nums">{count}</span>   {/* aligns figures — not a face */}
```

In a `Table`, don't write this at all: set `numeric: true` on the column config and the component right-aligns the header and the body and applies `tabular-nums` for you.

### Semantic faces

```tsx
<code className="font-code">system.users.user.view</code>   {/* identifier bucket */}
```

Never `font-mono`. Lint errors on it.


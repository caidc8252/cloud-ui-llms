# Separator

Horizontal or vertical divider line, with optional centered label text.

`Separator` is a client component built on `@base-ui/react`'s `Separator`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Separator` draws a hairline in the subtle line token to divide content. Leave `orientation` at `horizontal` for a full-width rule, or set `vertical` to divide items in a row; a vertical separator stretches to the height of its flex row.

Passing `label` (any `ReactNode`, though it is meant for a word or two) switches to a labeled divider: centered text between two rules, for cases such as an "or" between two sign-in options.

> **The labeled form is a different component in disguise.** It renders plain `div`s — not the Base UI separator — and it **ignores `orientation`, `className`, and every other prop you pass**. `<Separator label="or" className="my-6" />` compiles, and the margin is silently dropped. Put the spacing on a wrapper instead, and only reach for `label` when you actually want the text.

Use the component props before adding custom classes. Set `orientation`, then use `className` only for local spacing — on the plain form, where it is applied.

## General guidelines

### Do

- Use a horizontal separator to divide stacked sections or list groups.
- Use a vertical separator to divide inline items, such as actions in a toolbar.
- Use `label` for a divider that carries a short word, such as `or`.

### Don't

- Don't use a separator to fake spacing. Use layout gap utilities for spacing.
- Don't stack multiple separators to create a heavier line. Use the `line-strong` boundary where a stronger divide is needed.
- Don't put long text in `label`; it is for a word or two.
- Don't pass `className`, `orientation`, or ARIA props alongside `label` — the labeled branch drops them. Wrap it instead.

## Features

- #### Orientation

  `orientation` is `horizontal` (default) or `vertical`. A horizontal separator is a full-width 1px rule; a vertical one is a 1px line that stretches to the row height.

  ```tsx
  import { Separator } from "@cloud/ui";

  <div className="flex h-5 items-center gap-3">
    <span>Draft</span>
    <Separator orientation="vertical" />
    <span>Edited 2h ago</span>
  </div>;
  ```

- #### Labeled separator

  Passing `label` renders centered text between two rules. It is always horizontal, and it takes no other props — put any spacing on a wrapper.

  ```tsx
  <div className="my-6">
    <Separator label="or" />
  </div>
  ```

## Writing guidelines

### General writing guidelines

- Use sentence case and keep the label to a word or short phrase.
- Avoid terminal punctuation in the label.

### Component-specific guidelines

- Use `label` for connective words such as `or`, not for section titles. A section title belongs in a heading.

## Accessibility guidelines

### General accessibility guidelines

- A plain separator exposes the Base UI separator role, so assistive technology can announce the division.
- Don't rely on a separator to convey grouping that also needs a programmatic relationship; use headings or landmarks for structure.

### Component-specific guidelines

#### Labeled separator

- The labeled form renders visible text inside plain `div`s and is **not** exposed as a separator to assistive technology. When the label carries meaning (such as `or` between two choices), the visible text conveys it; no extra ARIA is required — and none can be added, since the labeled branch does not forward props.

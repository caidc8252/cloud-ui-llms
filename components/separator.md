# Separator

Horizontal or vertical divider line, with optional centered label text.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/separator.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Separator` is a client component built on `@base-ui/react`'s `Separator`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Separator` draws a hairline in the subtle line token to divide content. Leave `orientation` at `horizontal` for a full-width rule, or set `vertical` to divide items in a row; a vertical separator stretches to the height of its flex row.

Passing `label` switches to a labeled divider: a centered piece of text between two rules, for cases such as an "or" between two sign-in options. The plain and labeled forms render different markup, so choose `label` only when you want the text.

Use the component props before adding custom classes. Set `orientation` and `label`, then use `className` only for local spacing.

## General guidelines

### Do

- Use a horizontal separator to divide stacked sections or list groups.
- Use a vertical separator to divide inline items, such as actions in a toolbar.
- Use `label` for a divider that carries a short word, such as `or`.

### Don't

- Don't use a separator to fake spacing. Use layout gap utilities for spacing.
- Don't stack multiple separators to create a heavier line. Use the `line-strong` boundary where a stronger divide is needed.
- Don't put long text in `label`; it is for a word or two.

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

  Passing `label` renders centered text between two rules.

  ```tsx
  <Separator label="or" />
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

- The labeled form renders visible text inside plain elements. When the label carries meaning (such as `or` between two choices), the visible text conveys it; no extra ARIA is required.

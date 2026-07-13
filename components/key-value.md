# KvGrid

Read-only key-value fields for detail and overview pages.

`KvGrid` is the container and `KeyValue` is the cell. Both are plain markup — a `<dl>` and its rows — so they work in a server component. Import them, and the `KvGridProps` / `KeyValueProps` types, from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`KvGrid` lays out `KeyValue` cells as a definition list. Each cell puts a fixed 10rem label column on the **left** and the value on the right, and the value keeps its own minimum width so long content wraps inside the column instead of overflowing the grid.

The columns are **container-responsive**, with no breakpoints: the grid auto-fits at a 22rem minimum column, so the column count follows the grid's _own_ width and collapses to one column in anything narrower. Drop it in a narrow card, a split pane, or a full-width page and it does the right thing without a prop — neither part takes a `columns` prop, because there isn't one.

`KeyValue` takes `label` and `value`, plus `wide` and `className`; that is the whole surface. An empty value — `undefined`, `null`, or `""` — renders an em dash in tertiary text, so a missing field reads as "nothing here" rather than as a broken layout. Don't pre-substitute your own placeholder. Note that `0` and `false` are values, not emptiness, and render as themselves.

**Emptiness is decided from the value you pass, not from what it renders.** A React element is always a non-empty value, even when the component it names renders `null` — so `value={<Chips items={[]} />}` silently loses the em dash and leaves the row blank, with no type error and no lint warning. When the value is computed, call a plain function that returns `ReactNode | undefined` and let `undefined` reach the prop:

```tsx
const chips = (values: string[]) =>
  values.length ? <div className="flex gap-1">{values.map(v => <Badge key={v}>{v}</Badge>)}</div> : undefined

<KeyValue label="Network" value={chips(model.networks)} />   // empty list → em dash
```

`wide` makes a cell span the whole grid row. Use it for long free text — an address, a note — so the value gets the full container width instead of wrapping inside a narrow column.

This is **display only**. The data fetch and any edit affordances live in the consuming page; `KvGrid` renders no inputs and no buttons.

## General guidelines

### Do

- Use `KvGrid` for the read-only field list on a detail or overview page.
- Let an empty `value` fall through to the em dash.
- Mark long free-text fields `wide`.
- Order the fields the way a person would read them, most identifying first.

### Don't

- Don't put form controls in a `KeyValue`; it is not an editable field. Use `Field`.
- Don't substitute your own `—` or `N/A` for an empty value; the component does it.
- Don't use it as a two-column layout primitive; it is a definition list, and screen readers read it as one.

## Features

- #### Fields

  ```tsx
  import { KvGrid, KeyValue } from "@cloud/ui";

  <KvGrid>
    <KeyValue label={t("merchant.name")} value={merchant.name} />
    <KeyValue label={t("merchant.mid")} value={merchant.mid} />
    <KeyValue
      label={t("merchant.status")}
      value={<Badge tone="success">{merchant.status}</Badge>}
    />
    <KeyValue label={t("merchant.contact")} value={merchant.contact} />
  </KvGrid>;
  ```

- #### Wide cells

  `wide` spans the full grid row, for values that need the width.

  ```tsx
  <KvGrid>
    <KeyValue label={t("merchant.name")} value={merchant.name} />
    <KeyValue label={t("merchant.mid")} value={merchant.mid} />
    <KeyValue label={t("merchant.address")} value={merchant.address} wide />
    <KeyValue label={t("merchant.notes")} value={merchant.notes} wide />
  </KvGrid>
  ```

- #### Rich values

  The `value` is a node, so a `Badge`, a link, or a copy button belongs there as readily as text.

### States

- **Empty** — a missing value renders an em dash in tertiary text.

## Writing guidelines

### General writing guidelines

- Use sentence case for labels, and no terminal punctuation or trailing colon — the layout already separates label from value.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Label: name the field as the user would, such as `Merchant ID`, not `mid`.
- Value: format for the locale — dates, currency, and numbers all go through the app's formatters.

## Accessibility guidelines

### General accessibility guidelines

- The grid renders a real `<dl>`, so each label is associated with its value and the pairing is announced.
- The em dash placeholder means a field is genuinely announced as empty rather than skipped.
- Don't rely on the visual columns to convey the pairing; the markup does that, so don't fake it with plain `<div>`s elsewhere.

### Component-specific guidelines

- If a value contains an interactive element — a link, a copy button — it must have its own accessible name. The label is the field's name, not the control's.

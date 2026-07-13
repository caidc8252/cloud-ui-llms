# Checkbox

Binary form control for independent options. Supports an indeterminate state.

`Checkbox` is a client component built on `@base-ui/react`'s `Checkbox`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Checkbox` is a bare box. **Which wrapper it takes depends on where it sits, and the two do not mix:**

- **A standalone setting** — an inline label sitting beside the box, no hint and no validation — takes the `ToggleCheckbox` recipe, which pairs the box with its label and hit area for you.
- **A form control** — a label above, a hint, a required mark, an error — takes a `Field` wrapping the bare `Checkbox`. **Do not put a `ToggleCheckbox` inside a `Field`**; the recipe brings its own label and the two fight.

Reach for `Checkbox` directly in custom layouts and in the selection gutter of a data table.

Pass Base UI's `indeterminate` prop for a tri-state "select all" header: the box fills with the primary color and shows a minus dash instead of the check.

`size` is `md` everywhere by default. Use `size="sm"` (12px) only in a data table's select column — including its header "select all" — where a 16px box would out-weigh the small row text beside it. The enlarged hit target is preserved at both sizes.

## General guidelines

### Do

- Use a checkbox for an independent on/off choice, or several that can be selected at once.
- Use `ToggleCheckbox` for a standalone setting with an inline label; use `Field` + a bare `Checkbox` inside a form. Never nest the two.
- Use `indeterminate` for a "select all" header that reflects a partial selection.
- Use `size="sm"` only in a dense data-table select column.

### Don't

- Don't use a checkbox for mutually exclusive choices. Use `RadioGroup`.
- Don't use `size="sm"` in ordinary form rows.
- Don't rely on the fill color alone; keep the box next to its label.

## Features

- #### Size

  There are two sizes: `md` (default, 16px) and `sm` (12px). Use `sm` only in a data-table select column.

  ```tsx
  import { Checkbox } from "@cloud/ui";

  <Checkbox size="sm" aria-label="Select row" />;
  ```

- #### Indeterminate

  Pass `indeterminate` for the tri-state header case. The box fills and shows a minus dash rather than a check.

  ```tsx
  <Checkbox indeterminate checked={someSelected} onCheckedChange={toggleAll} />
  ```

### States

- #### Checked

  The checked box fills with the primary color and shows the check glyph.

- #### Indeterminate

  Fills with the primary color and shows a minus dash. Reflects a partial "select all".

- #### Invalid

  A passed `aria-invalid` applies the destructive border and ring.

- #### Disabled

  The native `disabled` attribute applies a not-allowed cursor and reduced opacity, and a disabled field group dims the box too.

## Writing guidelines

### General writing guidelines

- Use sentence case for the option label.
- Write the label as a positive statement of what selecting it does.

### Component-specific guidelines

- Give a bare `Checkbox` an accessible name (`aria-label`) when it has no visible label, such as a row selector.
- Keep "select all" labels explicit, such as `Select all rows`.

## Accessibility guidelines

### General accessibility guidelines

- Every checkbox needs an accessible name, from a linked label or `aria-label`.
- Preserve keyboard behavior from the Base UI primitive: the box is reachable by tab and toggled with space.
- Don't rely on color alone to show the checked state; the glyph and native state carry it.

### Component-specific guidelines

#### Keyboard interaction

- Tab focuses the box; space toggles it.
- For a "select all" checkbox, keep the `indeterminate` state in sync with the row selection so its announced state is accurate.

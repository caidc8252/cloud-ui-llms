# RadioGroup

Mutually exclusive option group. A standalone setting with inline labels takes `ToggleRadioGroup`; a form control takes `Field` + a bare `RadioGroup`.

`RadioGroup` is a client component built on `@base-ui/react`'s `RadioGroup` and `Radio`. It is a pair of components — `RadioGroup` (the group) and `RadioGroupItem` (each option). Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`RadioGroup` lays its items in a full-width grid (`grid w-full gap-2`), one item per row unless you override the columns. Each `RadioGroupItem` is a bare 16px radio dot — a real `<button>` from the Base UI `Radio` primitive, so a `Label` with `htmlFor` pointing at its `id` associates correctly.

**Which wrapper it takes depends on where it sits, and the two do not mix:** a **standalone setting** — inline labels beside each dot, no hint and no validation — takes the `ToggleRadioGroup` / `ToggleRadio` recipes, which pair each dot with its label and hit area for you. A **form control** — a group label above, a hint, an error — takes a `Field` wrapping the bare `RadioGroup`. **Do not put a `ToggleRadioGroup` inside a `Field`**; the recipe brings its own labels and the two fight. Use these primitives directly in custom layouts.

Give every item a `value`, and control the selection with the Base UI `value` and `onValueChange` props on the group, or leave it uncontrolled with `defaultValue`. The group also takes `name` for form submission and `disabled` for the whole set.

The dot carries an **invisible hit area** that extends 12px horizontally and 8px vertically past its 16px box, so it is comfortably clickable at that size. Don't crowd another interactive element right up against it — the hit areas will overlap and the wrong one will win.

## General guidelines

### Do

- Use a radio group for a single choice among a small, fixed set of options.
- Use `ToggleRadioGroup` for a standalone setting with inline labels; use `Field` + a bare `RadioGroup` inside a form. Never nest the two.
- Give each item a distinct `value` and an accessible label.

### Don't

- Don't use a radio group for independent on/off choices. Use `Checkbox`.
- Don't use it for a long list of options. Use `Select` or `Combobox`.
- Don't leave items unlabeled; a bare dot needs an associated label.
- Don't butt another clickable element against a dot — its hit area reaches past the dot's edge.

## Features

- #### Structure

  ```tsx
  import { RadioGroup, RadioGroupItem, Label } from "@cloud/ui";

  <RadioGroup defaultValue="card" aria-label="Payment method">
    <div className="flex items-center gap-2">
      <RadioGroupItem id="card" value="card" />
      <Label htmlFor="card">Card</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem id="invoice" value="invoice" />
      <Label htmlFor="invoice">Invoice</Label>
    </div>
  </RadioGroup>;
  ```

- #### Controlled state

  Drive the selection with `value` and `onValueChange` on the group, or use `defaultValue` for uncontrolled use.

  ```tsx
  <RadioGroup
    value={method}
    onValueChange={(v) => setMethod(String(v))}
    name="payment-method"
    aria-label="Payment method"
  >
    …
  </RadioGroup>
  ```

- #### Labeled fields

  For a standalone setting, reach for the `ToggleRadioGroup` / `ToggleRadio` recipes rather than assembling `RadioGroupItem` + `Label` by hand: they own the label, the spacing, and the hit area. Inside a `Field`, use the bare primitives — the recipe's own labels would fight the field's.

### States

- #### Checked

  The selected item fills with the primary color and shows the center dot.

- #### Invalid

  A passed `aria-invalid` applies the destructive border and ring.

- #### Disabled

  A disabled item shows a not-allowed cursor and reduced opacity.

## Writing guidelines

### General writing guidelines

- Use sentence case for each option label.
- Keep the options parallel in phrasing.

### Component-specific guidelines

- Label the group as a whole (for example with `aria-label`) as well as each option.
- Order options logically — by frequency, magnitude, or a natural sequence.

## Accessibility guidelines

### General accessibility guidelines

- The group needs an accessible name, and each item needs an associated label.
- Preserve keyboard behavior from the Base UI primitive.
- Don't rely on the fill color alone; keep each dot beside its label.

### Component-specific guidelines

#### Keyboard interaction

- Tab moves focus into the group; the arrow keys move the selection between items.
- Selecting an item both moves focus and checks it, per the radio pattern.

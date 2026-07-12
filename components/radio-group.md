# RadioGroup

Mutually exclusive option group. Prefer `ToggleRadioGroup` for labeled radio fields.

`RadioGroup` is a client component built on `@base-ui/react`'s `RadioGroup` and `Radio`. It is a pair of components — `RadioGroup` (the group) and `RadioGroupItem` (each option). Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`RadioGroup` lays its items in a full-width grid with a small gap; each `RadioGroupItem` is a bare radio dot. For labeled radio fields, prefer the `ToggleRadioGroup` and `ToggleRadio` recipes, which pair each dot with its label and hit area. Use the primitives directly in custom layouts.

Give every item a `value`, and control the selection with the Base UI `value` and `onValueChange` props on the group, or leave it uncontrolled with `defaultValue`.

## General guidelines

### Do

- Use a radio group for a single choice among a small, fixed set of options.
- Prefer `ToggleRadioGroup` for labeled fields.
- Give each item a distinct `value` and an accessible label.

### Don't

- Don't use a radio group for independent on/off choices. Use `Checkbox`.
- Don't use it for a long list of options. Use `Select` or `Combobox`.
- Don't leave items unlabeled; a bare dot needs an associated label.

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

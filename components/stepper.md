# Stepper

Numeric input with `−` and `+` buttons.

`Stepper` is a client component driven by props. Import it, and the `StepperProps` type, from `@cloud/ui` or `@cloud/ui/components/ui`.

**Not to be confused with `StepIndicator`**, which is the wizard progress bar. Similar name, different component.

## Development guidelines

`Stepper` is a number field with a decrement button on one side and an increment button on the other. It is controlled: pass `value` and handle `onChange`.

`min`, `max`, and `step` bound and quantize it. The component **clamps the value into `[min, max]`** and disables whichever boundary button has been reached, so the user can never step out of range. `min` and `max` default to negative and positive infinity, which means an unbounded stepper simply never disables a button — set them when the value has real limits.

The `+` and `−` buttons are icon-only, so their accessible names come from `decrementLabel` and `incrementLabel`. Pass translated strings. Give the field itself a label through `id` (paired with a `FieldLabel`) or `aria-label`.

Use a stepper when the value is small, bounded, and adjusted rather than typed — a quantity, a retry count, a page size. When the user will type the number anyway, a plain `Input` with `type="number"` is less machinery.

## General guidelines

### Do

- Set `min` and `max` when the value has real limits; the component then disables the boundary buttons for you.
- Pass translated `decrementLabel` and `incrementLabel`.
- Set `step` to the increment that makes sense for the unit.
- Give the field a visible label.

### Don't

- Don't use a stepper for a large or unbounded number; the buttons are useless and the user will type it. Use `Input`.
- Don't leave the icon-only buttons unlabelled.
- Don't re-implement clamping in `onChange`; the component already clamps.

## Features

- #### Value and bounds

  ```tsx
  import { Stepper } from "@cloud/ui";

  <Stepper
    value={qty}
    onChange={setQty}
    min={1}
    max={99}
    aria-label={t("order.quantity")}
    decrementLabel={t("common.decrease")}
    incrementLabel={t("common.increase")}
  />;
  ```

- #### Step size

  `step` (default `1`) is the increment for the buttons and the arrow keys.

  ```tsx
  <Stepper value={pageSize} onChange={setPageSize} min={10} max={200} step={10} />
  ```

- #### In a form

  `id` and `name` wire it to a `FieldLabel` and to a form post.

### States

- **At the bounds** — the decrement button is disabled at `min`, the increment button at `max`.
- **Disabled** — `disabled` turns off the input and both buttons.

## Writing guidelines

### General writing guidelines

- Use sentence case.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Label the field with the unit — `Quantity`, `Rows per page` — so the number means something.
- The button labels are accessible names, not visible text: write them as what the button does, such as `Increase quantity`.

## Accessibility guidelines

### General accessibility guidelines

- The input carries the spinbutton role with `aria-valuemin` and `aria-valuemax` (set from a finite `min` / `max`), so a screen reader announces the value and its range.
- The `+` and `−` buttons are icon-only; give them names through `decrementLabel` and `incrementLabel`.
- Give the field a visible label, or an `aria-label` when the layout truly can't carry one.

### Component-specific guidelines

#### Keyboard interaction

- With the input focused: Arrow Up and Arrow Down change the value by `step`.
- Page Up and Page Down change it by ten steps.
- Home and End jump to `min` and `max`, when those are finite.

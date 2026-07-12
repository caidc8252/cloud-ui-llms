# Stepper

Numeric input with `−` and `+` buttons.

`Stepper` is a client component driven by props. Import it, and the `StepperProps` type, from `@cloud/ui` or `@cloud/ui/components/ui`.

**Not to be confused with `StepIndicator`**, which is the wizard progress bar. Similar name, different component.

## Development guidelines

`Stepper` is a number field with a decrement button on one side and an increment button on the other, composed over `InputGroup`. It is controlled: pass `value` and handle `onChange`. The field is not a native `type="number"` input — it is a text input with `inputMode="numeric"` and `role="spinbutton"`, so it carries no browser spinner of its own.

`min`, `max`, and `step` (default `1`) bound and quantize it. The component **clamps the value into `[min, max]`** on every path — button, typing, blur — and marks whichever boundary button has been reached as `aria-disabled`, dimming it and making the click a no-op. Note it is _not_ the native `disabled` attribute: that would trip `InputGroup`'s `:has(:disabled)` rule and grey out the whole control instead of one button. Native `disabled` is reserved for the whole-`Stepper` `disabled` prop, where greying everything is what you want. `min` and `max` default to negative and positive infinity, so an unbounded stepper never reaches a boundary — set them when the value has real limits.

Typing is not stomped on: the input holds its own draft string while focused, so an external `value` update doesn't overwrite the keystrokes mid-entry. An empty or unparseable draft reverts to `value` on blur.

The `+` and `−` buttons are icon-only, so their accessible names come from `decrementLabel` and `incrementLabel` (defaults: `"Decrement"` / `"Increment"` — pass translated strings). They sit **outside the tab order** (`tabIndex={-1}`) on purpose: keyboard users adjust the value from the input itself with the arrow keys, rather than tabbing through two buttons per field. Give the field a label through `id` (paired with a `FieldLabel`) or `aria-label`.

`className` styles the `InputGroup` root; `inputClassName` styles the input (which is centered by default).

Use a stepper when the value is small, bounded, and adjusted rather than typed — a quantity, a retry count, a page size. When the user will type the number anyway, a plain `Input` with `type="number"` is less machinery.

## General guidelines

### Do

- Set `min` and `max` when the value has real limits; the component then dims the boundary buttons for you.
- Pass translated `decrementLabel` and `incrementLabel`; the defaults are English.
- Set `step` to the increment that makes sense for the unit.
- Give the field a visible label.

### Don't

- Don't use a stepper for a large or unbounded number; the buttons are useless and the user will type it. Use `Input`.
- Don't leave the icon-only buttons unlabelled.
- Don't re-implement clamping in `onChange`; the component already clamps.
- Don't expect the `+` / `−` buttons in the tab order — they're deliberately skipped. The keyboard path is the arrow keys on the input.

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

- **At the bounds** — at `min` the decrement button goes `aria-disabled` and dims (the click is a no-op); at `max`, the increment button does. The rest of the control stays live.
- **Disabled** — `disabled` natively disables the input and both buttons, greying the whole group.

## Writing guidelines

### General writing guidelines

- Use sentence case.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Label the field with the unit — `Quantity`, `Rows per page` — so the number means something.
- The button labels are accessible names, not visible text: write them as what the button does, such as `Increase quantity`.

## Accessibility guidelines

### General accessibility guidelines

- The input carries `role="spinbutton"` with `aria-valuenow`, and `aria-valuemin` / `aria-valuemax` (set only from a _finite_ `min` / `max`), so a screen reader announces the value and its range.
- The `+` and `−` buttons are icon-only; give them names through `decrementLabel` and `incrementLabel`.
- Give the field a visible label, or an `aria-label` when the layout truly can't carry one.

### Component-specific guidelines

#### Keyboard interaction

The buttons are not tab stops. Everything is done from the input:

- With the input focused: Arrow Up and Arrow Down change the value by `step`.
- Page Up and Page Down change it by ten steps (`step * 10`).
- Home and End jump to `min` and `max`, when those are finite.

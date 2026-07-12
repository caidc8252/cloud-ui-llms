# Label

Accessible form field label. Link it to a control with `htmlFor` to enable click-to-focus.

`Label` is a plain `<label>` element — it carries no `"use client"`, so it renders in a server component. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Label` is a styled native `<label>`. Associate it with its control through `htmlFor` matching the control's `id`, so clicking the label focuses the control. In most forms you do not use `Label` directly — `Field` renders and wires it for you, and the `Toggles` recipes provide labeled selection controls. Reach for `Label` on its own only when composing a custom field layout.

The label dims and shows a not-allowed cursor when its control is disabled, reading `group-data-[disabled=true]` and `peer-disabled` from the surrounding structure.

## General guidelines

### Do

- Give every form control a label, and link it with `htmlFor`.
- Prefer `Field` for standard form rows; it renders the label, control, and hint together.
- Prefer the `Toggles` recipes (`ToggleCheckbox`, `ToggleRadioGroup`, `ToggleSwitch`) for labeled selection controls.

### Don't

- Don't use a `Label` with no associated control. Use plain text for non-label copy.
- Don't rely on placeholder text in place of a label.
- Don't hide the label entirely; if space is tight, keep it available to assistive technology.

## Features

- #### Association

  Set `htmlFor` to the control's `id` to create the label-control link.

  ```tsx
  import { Label, Input } from "@cloud/ui";

  <div className="grid gap-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>;
  ```

- #### Disabled reflection

  When the control is disabled, the label dims and shows a not-allowed cursor via the surrounding `data-disabled` or `peer-disabled` state. You do not set this on the label directly.

## Writing guidelines

### General writing guidelines

- Use sentence case, but continue to capitalize proper nouns and brand names correctly in context.
- Keep labels short and specific.
- Avoid terminal punctuation.

### Component-specific guidelines

- Name the field with a noun or short noun phrase, such as `Email` or `Company name`.
- Don't include instructions in the label; put those in the field hint.
- Mark required or optional state consistently with the rest of the form, not with punctuation alone.

## Accessibility guidelines

### General accessibility guidelines

- `htmlFor` must match the control's `id`; this is what lets assistive technology announce the label with the control and lets a click focus the control.
- Don't substitute placeholder text for a label. Placeholders disappear on input and are not reliably announced.

### Component-specific guidelines

- When a control cannot take a visible label, keep the `Label` present but visually hidden rather than removing it, so the control still has an accessible name.

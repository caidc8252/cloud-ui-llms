# Field

Form field wrapper that stacks the label, the control, and the hint or error message.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/field.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Field` is a plain component — it carries no `"use client"`, so it renders in a server component as long as its control does. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Field` is the standard form row. It stacks a `Label`, the control you pass as `children`, and a single message line — a `hint` in muted text, or an `error` in red with `role="alert"`. `error` replaces `hint` when both are present.

Pass `htmlFor` matching the control's `id` so the label focuses the control. Omit `htmlFor` for a radio or checkbox group, which has no single target element; label the group itself instead.

`required` appends a decorative asterisk to the label. Reach for `label`, `hint`, `error`, and `required` before adding custom classes.

## General guidelines

### Do

- Use `Field` for standard labeled form rows.
- Set `htmlFor` to the control's `id` for single-control fields.
- Use `error` for the blocking validation message and `hint` for guidance.
- Omit `htmlFor` for radio and checkbox groups, and label the group directly.

### Don't

- Don't show `hint` and `error` at once expecting both; `error` replaces `hint`.
- Don't put the error text somewhere else; `Field`'s `error` already carries `role="alert"`.
- Don't rely on the asterisk alone to convey "required" if the form is long; reinforce it in copy where needed.

## Features

- #### Label, hint, and error
  - `label` — the field label, rendered through `Label`.
  - `hint` — muted guidance below the control; hidden when `error` is present.
  - `error` — the validation message, rendered red with `role="alert"`; takes precedence over `hint`.

  ```tsx
  import { Field, Input } from "@cloud/ui";

  <Field label="Email" htmlFor="email" hint="Use your work email" error={errors.email}>
    <Input id="email" type="email" invalid={!!errors.email} />
  </Field>;
  ```

- #### Required

  `required` appends a decorative asterisk to the label.

  ```tsx
  <Field label="Company name" htmlFor="co" required>
    <Input id="co" />
  </Field>
  ```

- #### Group fields

  Omit `htmlFor` when wrapping a radio or checkbox group, and give the group its own accessible name.

  ```tsx
  <Field label="Plan">
    <RadioGroup aria-label="Plan">…</RadioGroup>
  </Field>
  ```

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep the label to a noun phrase and the hint to a short sentence.

### Component-specific guidelines

- Label: name the field, such as `Email` or `Company name`.
- Hint: give format or context guidance without repeating the label.
- Error: state the problem and the fix, such as `Enter a valid email`.

## Accessibility guidelines

### General accessibility guidelines

- For a single-control field, `htmlFor` links the label to the control; keep the control `id` in sync.
- The `error` line uses `role="alert"`, so it is announced when it appears. Also set `aria-invalid` (and, where useful, `aria-describedby`) on the control.
- Don't convey "required" with the asterisk alone for critical fields; the control's `required` attribute and copy reinforce it.

### Component-specific guidelines

- For group fields, the label is not tied to one control, so give the group an accessible name and rely on that rather than `htmlFor`.

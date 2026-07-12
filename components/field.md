# Field

Form field wrapper that stacks the label, the control, and the hint or error message.

`Field` is a plain component — it carries no `"use client"`, so it renders in a server component as long as its control does. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Field` is the standard form row. It stacks a `Label`, the control you pass as `children`, and a single message line — a `hint` in muted text, or an `error` in red with `role="alert"`. `error` replaces `hint` when both are present.

Pass `htmlFor` matching the control's `id` so the label focuses the control. Omit `htmlFor` for a radio or checkbox group, which has no single target element; label the group itself instead.

`required` appends a decorative asterisk to the label. Reach for `label`, `hint`, `error`, and `required` before adding custom classes; `className` lands on the field wrapper. The props type is exported as `FieldProps`.

**`error` is a display prop, not a validity prop — passing it too early makes the form shout at the user before they have typed a character.** "Is this valid" and "should we show it" are two different questions. Compute validity whenever you like, but only feed it to `error` after the field has been touched (`onChange` / `onBlur`) or the user has attempted to submit — and disable the submit button on *validity*, never on *display*. A required field that is red the instant the form opens has mistaken **not yet filled in** for **filled in wrong**.

`Field` also carries `data-slot="field"`, which content-sized controls key off to fill the field instead of hugging their value. In practice that means a `Select` — whose `SelectTrigger` is `w-fit` on its own — stretches to the full field width once it is inside a `Field`. Every other form control (`Input`, `Textarea`, `Combobox`, `DatePicker`) is already `w-full`.

## General guidelines

### Do

- Use `Field` for standard labeled form rows.
- Set `htmlFor` to the control's `id` for single-control fields.
- Use `error` for the blocking validation message and `hint` for guidance.
- Gate `error` behind a `touched` flag (or a submit attempt), and keep the raw validity value for disabling the submit button.
- Omit `htmlFor` for radio and checkbox groups, and label the group directly.

### Don't

- Don't show `hint` and `error` at once expecting both; `error` replaces `hint`.
- Don't pass `error` before the field has been touched. An empty required field is *not yet filled in*, not *filled in wrong*.
- Don't disable the submit button on the *displayed* error; disable it on the computed validity, so an untouched, incomplete form still blocks submission without turning red.
- Don't put the error text somewhere else; `Field`'s `error` already carries `role="alert"`.
- Don't rely on the asterisk alone to convey "required" if the form is long; reinforce it in copy where needed.

## Features

- #### Label, hint, and error
  - `label` — the field label, rendered through `Label`.
  - `hint` — muted guidance below the control; hidden when `error` is present.
  - `error` — the validation message, rendered red with `role="alert"`; takes precedence over `hint`.

  Separate validity from display: compute the error freely, but only hand it to `Field` once the user has touched the field.

  ```tsx
  import { Field, Input, Button } from "@cloud/ui";

  const [email, setEmail] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const error = email.includes("@") ? null : "Enter a valid email"; // validity: compute any time
  const shown = touched ? error : null; // display: wait for a touch

  <Field label="Email" htmlFor="email" hint="Use your work email" error={shown}>
    <Input
      id="email"
      type="email"
      value={email}
      invalid={!!shown}
      onChange={(e) => setEmail(e.target.value)}
      onBlur={() => setTouched(true)}
    />
  </Field>;
  <Button disabled={!!error}>Save</Button>; // disabled follows validity, not display
  ```

- #### Control width

  `Field` sets `data-slot="field"`, and controls that would otherwise size to their content fill the field instead. A `Select` is `w-fit` when used bare and full-width inside a `Field`; you do not have to widen it yourself.

  ```tsx
  <Field label="Region" htmlFor="region">
    <Select items={REGIONS} value={region} onValueChange={setRegion}>
      <SelectTrigger id="region">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>…</SelectContent>
    </Select>
  </Field>
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
- Because `error` renders with `role="alert"`, an error passed on first render is announced immediately. Another reason to wait until the field is touched: an alert on an untouched field is noise, not help.

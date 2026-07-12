# Input

Single-line text input, with validation tones beyond the invalid state.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/input.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Input` is a client component built on `@base-ui/react`'s `Input`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Input` is a single-line text field with the standard native `<input>` props plus a small set of styling props. In most forms you wrap it in a `Field`, which supplies the label, hint, and error copy; `Input` itself carries only the control's own visual state.

Use the component props before adding custom classes. Reach for `inputSize`, `variant`, `validation`, `invalid`, and `prefix`/`suffix` first, then use `className` only for local layout.

`inputSize` controls height and padding and is distinct from the native HTML `size` attribute — do not confuse the two. `invalid` takes priority over `validation`: a field that is both invalid and "warn" renders as invalid.

There is one sharp edge with adornments. When you pass `prefix` or `suffix`, `Input` wraps itself in a flex container and your `className` lands on the inner `<input>`, not the wrapper. Layout classes (`w-full`, `mb-*`, `self-*`) then silently no-op. To control the outer width or spacing, wrap the input in your own element, or use `InputGroup`, whose `className` targets the outer container.

## General guidelines

### Do

- Wrap `Input` in a `Field` for the label, hint, and error message.
- Use `inputSize` to match the surrounding control density.
- Use `validation="warn"` or `validation="ok"` for non-blocking inline feedback, and `invalid` for a blocking error.
- Use `prefix`/`suffix` for non-interactive adornments such as a currency symbol or a unit.
- Use `variant="filled"` for dense toolbars and nested forms where a bordered field would be too heavy.

### Don't

- Don't confuse `inputSize` with the HTML `size` attribute.
- Don't put layout classes on `className` when using `prefix`/`suffix`; they land on the inner input. Wrap the input or use `InputGroup`.
- Don't set both `invalid` and a `validation` tone expecting the tone to show. Invalid wins.
- Don't put interactive controls in `prefix`/`suffix`. Use `InputGroup` for buttons and add-ons.

## Features

- #### Input size

  `inputSize` is `sm`, `md`, or `lg`, controlling height and padding.

  ```tsx
  import { Input } from "@cloud/ui";

  <Input inputSize="sm" placeholder="Search" />;
  ```

- #### Variant

  `variant="filled"` uses a tonal `surface-3` fill for dense toolbars and nested forms; the border appears only on focus. The default variant is a bordered field on `surface-2`.

- #### Validation and invalid
  - `validation="warn"` — amber border and focus ring for a non-blocking caution.
  - `validation="ok"` — green border and focus ring for confirmed input.
  - `invalid` — red border and ring, and it sets `aria-invalid`. It takes priority over `validation`.

  ```tsx
  <Input invalid aria-describedby="pw-error" />
  ```

- #### Prefix and suffix

  `prefix` and `suffix` accept a node and render as non-interactive adornments inside the field border. The field's focus and invalid styling move to the wrapper.

  ```tsx
  <Input prefix="$" suffix="USD" inputMode="decimal" />
  ```

### States

- #### Focus

  Focus-visible styling is built in through the semantic border and shadow tokens. Preserve it when adding custom classes.

- #### Invalid

  `invalid` (or a passed `aria-invalid`) applies the error border and ring and exposes `aria-invalid` to assistive technology.

- #### Read-only

  The native `readOnly` attribute renders a `surface-3` fill with secondary text automatically.

- #### Disabled

  The native `disabled` attribute applies a not-allowed cursor, a muted fill, and reduced opacity.

## Writing guidelines

### General writing guidelines

- Use sentence case for labels and placeholders.
- Keep placeholder text as an example or format hint, not as the label.

### Component-specific guidelines

- Put the field name in the `Field` label, not the placeholder.
- Use the field hint for format guidance, such as `Use your work email`.
- Keep error copy specific and about the fix, such as `Enter a valid email`.

## Accessibility guidelines

### General accessibility guidelines

- Every input needs an associated label. `Field` wires this for you; on a bare `Input`, associate a `Label` with `htmlFor`.
- Don't use a placeholder as the only label. It disappears on input.
- When `invalid` is set, reference the error message with `aria-describedby` so it is announced.

### Component-specific guidelines

- `prefix`/`suffix` are decorative and non-interactive; if a symbol carries meaning not in the label, make sure it is also conveyed in the label or hint.

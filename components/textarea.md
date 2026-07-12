# Textarea

Multi-line text input, with an optional character counter when `maxLength` is set.

`Textarea` is a client component (it tracks the character count with local state). Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Textarea` is a multi-line field with the standard native `<textarea>` props plus `showCount`. It auto-grows to its content (`field-sizing-content`) and can also be resized vertically. As with `Input`, wrap it in a `Field` for the label, hint, and error copy.

Set `showCount` together with `maxLength` to show a live character counter. The counter turns amber as the value nears the limit and red at the limit. Without `maxLength`, `showCount` shows a plain count.

`showCount` works in both controlled and uncontrolled use; the component reads `value` when controlled and tracks its own count otherwise.

## General guidelines

### Do

- Wrap `Textarea` in a `Field` for its label and messaging.
- Pair `showCount` with `maxLength` when there is a real length limit.
- Let the field grow with content; use `className` only to cap height when needed.

### Don't

- Don't use a textarea for a single line of input. Use `Input`.
- Don't set `showCount` without a `maxLength` unless a bare running count is genuinely useful.
- Don't rely on the counter color alone to signal the limit; it is reinforced by the number.

## Features

- #### Character counter

  With `showCount` and `maxLength`, a `count / maxLength` counter renders under the field. It shifts to the warning color near the limit and the error color at the limit.

  ```tsx
  import { Textarea } from "@cloud/ui";

  <Textarea showCount maxLength={280} placeholder="Add a note" />;
  ```

- #### Auto-size and resize

  The field sizes to its content and can be dragged taller. Cap the height with a `max-h-*` class if the layout needs it.

### States

- #### Focus

  Focus-visible styling is built in through the semantic border and shadow tokens.

- #### Invalid

  A passed `aria-invalid` applies the error border and ring.

- #### Disabled

  The native `disabled` attribute applies a not-allowed cursor, a muted fill, and reduced opacity.

## Writing guidelines

### General writing guidelines

- Use sentence case for labels and placeholders.
- Keep placeholder text as an example, not as the label.

### Component-specific guidelines

- Put the field name in the `Field` label.
- When a limit exists, state it in the hint as well as the counter, such as `Up to 280 characters`.

## Accessibility guidelines

### General accessibility guidelines

- Associate a label with the textarea; `Field` does this for you.
- When `aria-invalid` is set, reference the error message with `aria-describedby`.

### Component-specific guidelines

- The character counter is visual. For a hard limit, keep the `maxLength` attribute set so the constraint is enforced natively, and state the limit in text for users who do not see the counter.

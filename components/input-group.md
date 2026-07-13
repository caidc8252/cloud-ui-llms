# InputGroup

Composite input container with one unified border — for addons, buttons, and units around a field.

`InputGroup` is a client component. It is a set of composable parts — `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, and `InputGroupTextarea`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`InputGroup` draws **one** border around a control and everything sitting next to it, and it owns the focus, invalid, and disabled treatment for the whole group. That is the point of the component: a search input with a leading magnifier and a trailing clear button reads as a single field, not as a field with two things glued to it.

The border belongs to the group, so the control inside must not draw its own. Use `InputGroupInput` and `InputGroupTextarea` — they are `Input` and `Textarea` with the border, the ring, and the focus shadow stripped, and they tag themselves `data-slot="input-group-control"`. Dropping a plain `Input` in fails twice: you get two borders, **and** the group never lights up, because the group's focus rule keys off that `data-slot` on the control. (This is the same trap as `Input`'s `prefix` / `suffix` className gotcha: whichever layer owns the border, only one may draw it.)

The group is a single control height (`h-control-md`, the same as a default `Input`) and is `w-full`, so the field owns its width — there is no `size` prop. It grows to fit automatically when it holds a textarea or a block addon.

`InputGroupAddon` is the slot for the extra content, and `align` decides where it goes and how the group lays out:

- `inline-start` (default) — leading, on the left.
- `inline-end` — trailing, on the right.
- `block-start` / `block-end` — above or below, which switches the group to a **column** layout and lets it grow.

Clicking an addon focuses the group's input, unless the click landed on a button inside it — so a leading icon behaves like part of the field rather than dead space.

Inside an addon, `InputGroupText` is non-interactive content — a currency symbol, a unit suffix, an icon — and `InputGroupButton` is an action, defaulting to `size="xs"`, `variant="ghost"`, `type="button"`. Its `size` set is its own: `xs` (default), `sm`, `icon-xs`, `icon-sm` — the icon sizes are the square ones for an icon-only button.

**All three states live on the group, and only on the group.** Focus keys off `:focus-visible` on the `input-group-control` inside; invalid keys off `aria-invalid="true"` on that control, so set it on the control and never on the group; disabled keys off any disabled descendant. The inner control deliberately zeroes its own focus shadow, ring, and invalid ring — that is what keeps the group from painting a ring around a control that is already painting one. Re-add a `focus-visible:` or `aria-invalid:` ring on the inner control and you get the double ring straight back.

## General guidelines

### Do

- Use `InputGroupInput` / `InputGroupTextarea` inside the group, never a bare `Input`.
- Put a unit, a currency symbol, or an icon in an `InputGroupText`, and an action in an `InputGroupButton`.
- Set `aria-invalid` on the control; the group draws the error treatment for you.
- Use `block-start` / `block-end` when the addon is a row of its own, such as a toolbar over a textarea.

### Don't

- Don't put a bordered control inside the group; you'll get a double border.
- Don't style the focus or error ring on the inner control; the group owns them.
- Don't use an input group to jam two separate fields together — that's a `Field` layout problem, not one control.

## Features

- #### Leading and trailing addons

  ```tsx
  import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@cloud/ui";

  <InputGroup>
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
    <InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} />
    <InputGroupAddon align="inline-end">
      <InputGroupButton aria-label="Clear" onClick={clear}>
        <XIcon />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>;
  ```

- #### Units and symbols

  `InputGroupText` is non-interactive — a currency symbol, a unit, a domain suffix.

  ```tsx
  <InputGroup>
    <InputGroupAddon>
      <InputGroupText>$</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput inputMode="decimal" value={amount} onChange={onChange} />
    <InputGroupAddon align="inline-end">
      <InputGroupText>USD</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
  ```

- #### Block addons

  `align="block-start"` or `block-end` puts the addon on its own row and switches the group to a column — a toolbar above a textarea, a counter below it.

  ```tsx
  <InputGroup>
    <InputGroupTextarea value={note} onChange={onChange} />
    <InputGroupAddon align="block-end">
      <InputGroupText>{note.length} / 500</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
  ```

### States

- **Focused** — the group takes the focus border and ring when the `input-group-control` inside it is `:focus-visible`. The control itself draws nothing; one ring, drawn once, by the group.
- **Invalid** — `aria-invalid="true"` on the control gives the whole group the destructive border and ring.
- **Disabled** — a disabled control inside dims the whole group.
- **Inside a combobox popover** — a group rendered within `combobox-content` gives up its own border and focus ring on purpose, so the search field doesn't draw a second frame inside the popover that already has one.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.

### Component-specific guidelines

- Addon text: keep it to a symbol or a short unit — `$`, `USD`, `%`, `.com`. Anything longer belongs in the label or in helper text.
- Give every `InputGroupButton` an `aria-label`; they are icon-only by default.

## Accessibility guidelines

### General accessibility guidelines

- The group is a `role="group"` around a real control, so the addons don't come between the label and the field.
- Give the control a visible label. Inside a `Field`, pass `htmlFor` matching the control's `id` and `Field` renders the `Label` for you. (There is no `FieldLabel` export.)
- Set `aria-invalid` on the control so the error is announced, and pair it with a `FieldError` — the red border is not a message.

### Component-specific guidelines

- An addon is not a label. A `$` symbol tells a sighted user the unit; the accessible name still has to say it.
- Every `InputGroupButton` must be reachable by Tab and have an accessible name.

# Toggle

Press-toggle button with an on/off state.

`Toggle` is a client component built on `@base-ui/react`'s `Toggle`. It is one component, plus the `toggleVariants` helper for styling a custom element like a toggle. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Toggle` is a button that stays pressed. Control it with `pressed` / `defaultPressed` / `onPressedChange`, following the Base UI contract. Use it standalone for a single on/off affordance — bold in a text toolbar, a "show archived" filter — or as a child of `ToggleGroup` for a set.

`variant` is `default` (a filled surface) or `outline` (transparent). `size` is `sm`, `md` (default), or `auto`. `sm` and `md` are fixed-height controls that line up with `Button` and `Input`; `auto` is content-driven, for a toggle whose child is a card or tile rather than a label. Reach for `size="auto"` rather than passing `className="h-auto"` — a custom height class does not reliably beat the variant's `h-control-*`.

Inside a `ToggleGroup`, a toggle restyles itself from the group's `variant` through a `data-variant` attribute on the root — no props to thread. So don't set `variant` on the items of a group; set it once on the group.

`Toggle` does not accept `render`: it always renders its own button. To make some other element look like a toggle, apply `toggleVariants({ variant, size })` to it directly.

`Toggle` is a _button that stays down_. When the thing being toggled is a setting that takes effect immediately, use `Switch`. When it's a value in a form, use `Checkbox`.

## General guidelines

### Do

- Use a toggle for a state the user turns on and off in place, such as a formatting mark or a view mode.
- Set the visual style once on the `ToggleGroup` when the toggle is part of a set.
- Give an icon-only toggle an `aria-label`.
- Use `size="auto"` for a content-driven toggle.

### Don't

- Don't use a toggle for a form field. Use `Checkbox`.
- Don't use one for a settings switch. Use `Switch`.
- Don't set `variant` on the items inside a group; it is the group's job.

## Features

- #### Pressed state

  ```tsx
  import { Toggle } from "@cloud/ui";

  <Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">
    <BoldIcon className="size-4" />
  </Toggle>;
  ```

- #### Variant and size

  `variant` is `default` (filled) or `outline` (transparent). `size` is `sm`, `md` (default), or `auto`.

  ```tsx
  <Toggle variant="outline" size="sm">
    Archived
  </Toggle>
  ```

- #### Inside a group

  In a `ToggleGroup`, the item's look comes from the group's `variant`. Give each `Toggle` a `value` so the group can match it.

  ```tsx
  <ToggleGroup type="single" variant="segmented" value={mode} onValueChange={setMode}>
    <Toggle value="list">List</Toggle>
    <Toggle value="grid">Grid</Toggle>
  </ToggleGroup>
  ```

### States

- **Pressed** — `data-pressed` gives the toggle the active surface (and, in a group, the group's active look).
- **Hover** — the surface lifts to the hover token.
- **Disabled** — dimmed, with a not-allowed cursor.
- **Focused** — a focus ring on keyboard focus.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.

### Component-specific guidelines

- Label the toggle with the state it turns on, not with the current state — `Show archived`, not `Hide archived`, which reads as the action's opposite once it's pressed.
- For an icon-only toggle, put that same wording in `aria-label`.

## Accessibility guidelines

### General accessibility guidelines

- The toggle carries its pressed state through the Base UI primitive, so screen readers announce it as a toggle button, not a plain button.
- Give an icon-only toggle an `aria-label`.
- Don't rely on the pressed color alone; in a group, the pressed item also changes weight and surface.

### Component-specific guidelines

#### Keyboard interaction

- Tab moves focus to the toggle.
- Enter or Space flips it.

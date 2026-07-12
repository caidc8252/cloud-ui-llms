# ToggleGroup

Group of `Toggle` items — a segmented control, a mode picker, or a set of filter chips.

`ToggleGroup` is a client component built on `@base-ui/react`'s `ToggleGroup`. It is one container component whose children are `Toggle`s. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`ToggleGroup` binds a set of `Toggle`s to one value. `type` decides the selection model, and it also decides the shape of `value`:

- `type="single"` — at most one item pressed. `value` / `defaultValue` are `string | null`, and `onValueChange` receives `string | null`.
- `type="multiple"` — items toggle independently. `value` / `defaultValue` are `string[]`, and `onValueChange` receives `string[]`.

Each child `Toggle` needs a `value`; the group matches items by it.

`variant` sets the look, and the child toggles pick it up from a `data-variant` attribute on the root — you set it once on the group, never on the items:

- `outline` (default) — connected segments sharing one outer border.
- `segmented` — a tinted track of borderless items, with the selected one lifting into a pill. Use with `type="single"` for a mode or view picker.
- `cloud` — free-wrapping standalone pill chips, not a connected track. Each item is its own rounded chip, and the selected ones tint primary. Works with either `type`; use it for tag and category pickers.
- `plain` — no styling of the children at all. Use it when the items are custom option cards that own their selected look (pair with `Toggle size="auto"`).

Use a toggle group when the options are few and worth keeping visible. When there are many, use `Select` (one) or a `Checkbox` list (many). When the group _navigates_ between panels rather than setting a value, use `Tabs`.

## General guidelines

### Do

- Use `type="single"` for a mode picker and `type="multiple"` for independent filters.
- Set `variant` once on the group.
- Give every child `Toggle` a `value`.
- Keep the set small enough to stay visible without wrapping — except in `cloud`, where wrapping is the point.

### Don't

- Don't use a toggle group to switch page panels. Use `Tabs`.
- Don't use it for a long list of options. Use `Select` or a checkbox list.
- Don't mix variants, and don't override an item's look with `className` when a group `variant` already covers it.

## Features

- #### Single vs. multiple

  ```tsx
  import { ToggleGroup, Toggle } from "@cloud/ui";

  // single → string | null
  <ToggleGroup type="single" value={view} onValueChange={setView}>
    <Toggle value="list">List</Toggle>
    <Toggle value="grid">Grid</Toggle>
  </ToggleGroup>

  // multiple → string[]
  <ToggleGroup type="multiple" value={tags} onValueChange={setTags} variant="cloud">
    <Toggle value="pos">POS</Toggle>
    <Toggle value="ecom">E-commerce</Toggle>
    <Toggle value="mobile">Mobile</Toggle>
  </ToggleGroup>;
  ```

- #### Variants

  `outline` (default) connects the items into one bordered track. `segmented` floats them as pills on a tinted track. `cloud` drops the track and lets standalone chips wrap. `plain` leaves the children entirely to you.

  ```tsx
  <ToggleGroup type="single" variant="segmented" value={os} onValueChange={setOs}>
    <Toggle value="android">Android</Toggle>
    <Toggle value="ios">iOS</Toggle>
  </ToggleGroup>
  ```

- #### Custom option cards

  With `variant="plain"` and `Toggle size="auto"`, each item is a content-driven card that owns its own selected styling.

### States

- **Selected** — the pressed item takes the group variant's active look: an active surface in `outline`, a lifted pill in `segmented`, a primary tint in `cloud`.
- **Disabled** — `disabled` on the group disables every item.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.

### Component-specific guidelines

- Keep item labels short, parallel, and mutually exclusive in meaning.
- In a `single` group, the labels are the options, not the actions — `List`, `Grid`, not `Show as list`.

## Accessibility guidelines

### General accessibility guidelines

- The group and its items carry the correct roles and pressed state through the Base UI primitive.
- Give the group an accessible name with `aria-label` — for example `View`, so a screen-reader user hears what the options set.
- Give each icon-only item its own `aria-label`.

### Component-specific guidelines

#### Keyboard interaction

- Tab moves focus into the group, and the arrow keys move between items.
- Enter or Space toggles the focused item.

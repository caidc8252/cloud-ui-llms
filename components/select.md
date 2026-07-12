# Select

Dropdown for choosing one value from a list of options.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/select.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Select` is a client component built on `@base-ui/react`'s `Select`. It is a set of composable parts — `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, and the `SelectScrollUpButton` / `SelectScrollDownButton` affordances. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Select` is for picking a single value from a known, closed list. Put the current value in `SelectValue` (which renders the placeholder when nothing is chosen), and list the options as `SelectItem`s inside `SelectContent`. Each item shows a check indicator when selected, and the trigger shows a chevron.

`SelectTrigger` takes `size` — `md` (default, matching `Button` and `Input` at the same size) or `sm`. It supports `aria-invalid`, so a select inside a `Field` picks up the error styling like any other control.

Use `Select` when the options are few enough to scan and the user picks exactly one. When the user needs to type to narrow a long list, use `Combobox`. When there are only two or three mutually exclusive options that benefit from being visible at once, use `RadioGroup` or `ToggleGroup`. For multiple selection, use a set of `Checkbox`es or a filter component.

## General guidelines

### Do

- Use a select for a single choice from a closed list.
- Give the trigger a placeholder through `SelectValue` so an empty state reads clearly.
- Group long lists with `SelectGroup` and `SelectLabel`, and divide sections with `SelectSeparator`.
- Match the trigger `size` to the surrounding inputs and buttons.

### Don't

- Don't use a select for a long list the user would rather search. Use `Combobox`.
- Don't use a select for two or three options that should stay visible. Use `RadioGroup`.
- Don't put actions in a select. It sets a value; use `DropdownMenu` for commands.

## Features

- #### Basic select

  ```tsx
  import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@cloud/ui";

  <Select value={status} onValueChange={setStatus}>
    <SelectTrigger>
      <SelectValue placeholder="Select a status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="suspended">Suspended</SelectItem>
      <SelectItem value="closed">Closed</SelectItem>
    </SelectContent>
  </Select>;
  ```

- #### Size

  `SelectTrigger` takes `size="md"` (default) or `size="sm"`. Use the same size as the inputs and buttons on the row.

  ```tsx
  <SelectTrigger size="sm">
    <SelectValue placeholder="Any" />
  </SelectTrigger>
  ```

- #### Groups and separators

  Wrap related options in a `SelectGroup` with a `SelectLabel`, and separate sections with `SelectSeparator`.

  ```tsx
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Americas</SelectLabel>
      <SelectItem value="us-east-1">us-east-1</SelectItem>
      <SelectItem value="us-west-2">us-west-2</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="eu-west-1">eu-west-1</SelectItem>
    </SelectGroup>
  </SelectContent>
  ```

- #### Long lists

  When the list overflows, `SelectScrollUpButton` and `SelectScrollDownButton` appear as scroll affordances at the edges of the popup.

### States

- **Placeholder** — with no value chosen, the trigger renders the `SelectValue` placeholder in muted text (`data-placeholder`).
- **Invalid** — `aria-invalid` on the trigger gives it the destructive border and ring, the same as `Input`.
- **Disabled** — a disabled trigger or a disabled `SelectItem` is dimmed and not interactive.

## Writing guidelines

### General writing guidelines

- Use sentence case.
- Avoid terminal punctuation in option labels.

### Component-specific guidelines

- Placeholder: name the choice, such as `Select a status` or `Choose a region`. Don't use it to carry an instruction the label should carry.
- Option labels: keep them short, parallel, and in a predictable order — alphabetical, or by frequency of use.
- Group labels: name the category, such as `Americas`. They are labels, not options, and are not selectable.

## Accessibility guidelines

### General accessibility guidelines

- The trigger, popup, and options carry the correct roles and relationships through the Base UI primitive.
- Give the select a visible label. Inside a `Field`, `FieldLabel` is associated for you; otherwise use `Label` with the trigger, or an `aria-label`.
- Don't rely on the check indicator's color alone; the selected value is also reflected in the trigger.

### Component-specific guidelines

#### Keyboard interaction

- Enter, Space, or the arrow keys open the popup from the trigger.
- The arrow keys move between options, and type-ahead jumps to a matching option.
- Enter selects the highlighted option; Escape closes the popup without changing the value.

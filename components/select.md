# Select

Dropdown for choosing one value from a list of options.

`Select` is a client component built on `@base-ui/react`'s `Select`. It is a set of composable parts — `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, and the `SelectScrollUpButton` / `SelectScrollDownButton` affordances. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Select` is for picking a single value from a known, closed list. Put the current value in `SelectValue` (which renders the placeholder when nothing is chosen), and list the options as `SelectItem`s inside `SelectContent`. Each item shows a check indicator when selected, and the trigger shows a chevron.

> ### Silent trap: no `items` on the root, and the trigger prints the raw value
>
> **The trigger's text is resolved from an `items` map (value → label) passed to the root `Select`, not from the `SelectItem` children.** Omit `items` and `SelectValue` degrades to printing the **raw value**: the filter shows `all` instead of `All contracts`, and a category filter puts `cat-mpos` in front of the user. There is **zero type error** — `tsc` and lint stay green and the UI is wrong.
>
> ```tsx
> const ITEMS = { all: "All contracts", "US-ISO": "US-ISO", "US-ISV": "US-ISV" };
>
> <Select items={ITEMS} value={value} onValueChange={(v) => setValue(String(v))}>
>   <SelectTrigger className="w-56">
>     <SelectValue />
>   </SelectTrigger>
>   <SelectContent>
>     {Object.entries(ITEMS).map(([value, label]) => (
>       <SelectItem key={value} value={value}>
>         {label}
>       </SelectItem>
>     ))}
>   </SelectContent>
> </Select>;
> ```
>
> It "accidentally works" whenever a label happens to equal its value — which merely buries the bug until the first option whose label differs.
>
> **And you cannot find this by reading the source.** `select.tsx` defines `Select` as a one-liner re-export of the Base UI root (`const Select = SelectPrimitive.Root`), so the `items` contract lives in Base UI's `.d.ts`, not in the component file. "Just read the component" fails on `Select`, which is why it is written down here.

`items` accepts a `Record<string, ReactNode>` map, an array of `{ value, label }`, or an array of groups. The alternative is to format the value yourself: `SelectValue` also takes a **function child**, `<SelectValue>{(v) => …}</SelectValue>`, which is the right tool when the trigger text is not simply the option's label — a `Status: Active` prefix, a rows-per-page number. Use one or the other. Using neither is the bug above.

`SelectTrigger` takes `size` — `md` (default, matching `Button` and `Input` at the same size) or `sm`. It supports `aria-invalid`, so a select inside a `Field` picks up the error styling like any other control.

> ### `SelectTrigger` is `w-fit` — the caller owns the width
>
> Every other form control in this system is `w-full`. `SelectTrigger` is not: it is `w-fit`, so a bare `Select` is **content-sized**, and its box grows and shrinks with whatever value is currently selected. That default is intentional — a compact select (rows-per-page, a unit picker) is a real use — but it means **an unwidthed `Select` is always a decision someone forgot to make, not a default that works**.
>
> - **Inside a `Field`**, the trigger fills the column automatically (`in-data-[slot=field]:w-full`); you don't have to do anything.
> - **In a filter band**, give it an explicit `w-*` sized to the longest plausible option (`className="w-64"`). Not `min-w-*` — the band supplies its own bounds and they override the floor.
>
> A width that moves with the value hides exactly the errors you most need to see: mis-wire `items` as well, and the box collapses to the width of an id, so a **data** bug arrives disguised as a **layout** bug.

Use `Select` when the options are few enough to scan and the user picks exactly one. When the user needs to type to narrow a long list, use `Combobox`. When there are only two or three mutually exclusive options that benefit from being visible at once, use `RadioGroup` or `ToggleGroup`.

**`Select` does not do multiple selection — `Combobox` does.** Pass `multiple` and its `value` becomes a `string[]`, the picked options render as removable chips in the trigger, and `maxChips` caps how many show. Reach for a set of `Checkbox`es only when every option must stay visible at once.

## General guidelines

### Do

- Use a select for a single choice from a closed list.
- Pass `items` (value → label) to the root, so the trigger shows the label and not the raw value.
- Give the trigger a placeholder through `SelectValue` so an empty state reads clearly.
- Give a bare select an explicit width; inside a `Field` it fills the column for you.
- Group long lists with `SelectGroup` and `SelectLabel`, and divide sections with `SelectSeparator`.
- Match the trigger `size` to the surrounding inputs and buttons.

### Don't

- Don't ship a select whose root has no `items` and whose `SelectValue` has no function child — the trigger will print the raw value.
- Don't leave a bare select unwidthed. `SelectTrigger` is `w-fit`, so the box would resize with the chosen value.
- Don't reach for `min-w-*` in a filter band; the band's own bounds override it. Pass a `w-*`.
- Don't use a select for a long list the user would rather search. Use `Combobox`.
- Don't use a select for two or three options that should stay visible. Use `RadioGroup`.
- Don't try to make a select multi-select. Use `Combobox multiple`, which gives you the chips and the `string[]`.
- Don't put actions in a select. It sets a value; use `DropdownMenu` for commands.

## Features

- #### Basic select

  `items` is what makes the trigger show `Active` rather than `active`. Keep it as the single source for both the map and the rendered options.

  ```tsx
  import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@cloud/ui";

  const STATUSES = { active: "Active", suspended: "Suspended", closed: "Closed" };

  <Select items={STATUSES} value={status} onValueChange={(v) => setStatus(String(v))}>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Select a status" />
    </SelectTrigger>
    <SelectContent>
      {Object.entries(STATUSES).map(([value, label]) => (
        <SelectItem key={value} value={value}>
          {label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>;
  ```

- #### Width

  `SelectTrigger` is `w-fit` — the only form control in the system that is not `w-full`. Inside a `Field` it switches to full width on its own; anywhere else the caller sets it.

  ```tsx
  {/* Form: the Field makes it fill the column. */}
  <Field label="Category" required>
    <Select items={CATEGORIES} value={categoryId} onValueChange={selectCategory}>
      <SelectTrigger>
        <SelectValue placeholder="Select a leaf category…" />
      </SelectTrigger>
      <SelectContent>{…}</SelectContent>
    </Select>
  </Field>

  {/* Filter band: a width, not a floor — sized to the longest option. */}
  <SelectTrigger size="md" className="w-64">
    <SelectValue />
  </SelectTrigger>
  ```

- #### Formatting the trigger text

  When the trigger should not simply echo the option label, give `SelectValue` a function child instead of relying on `items`.

  ```tsx
  <SelectTrigger size="sm" className="w-20" aria-label="Rows per page">
    <SelectValue>{(v: string) => String(v)}</SelectValue>
  </SelectTrigger>
  ```

- #### Size

  `SelectTrigger` takes `size="md"` (default, `h-control-md`) or `size="sm"` (`h-control-sm`). Use the same size as the inputs and buttons on the row.

  ```tsx
  <SelectTrigger size="sm">
    <SelectValue placeholder="Any" />
  </SelectTrigger>
  ```

- #### Positioning

  `SelectContent` takes `side` (default `bottom`), `sideOffset` (default `4`), `align` (default `start`), `alignOffset` (default `0`), and `alignItemWithTrigger` (default `false`, which keeps the popup below the trigger instead of pulling the selected item over it). The popup takes the trigger's width (`--anchor-width`) with a `min-w-36` floor, so a wide trigger gets a wide list.

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
- Give the select a visible label. Inside a `Field`, pass `htmlFor` matching the trigger's `id` and `Field` renders the `Label` for you (there is no `FieldLabel` export); otherwise use `Label` with the trigger, or an `aria-label`.
- Don't rely on the check indicator's color alone; the selected value is also reflected in the trigger.

### Component-specific guidelines

#### Keyboard interaction

- Enter, Space, or the arrow keys open the popup from the trigger.
- The arrow keys move between options, and type-ahead jumps to a matching option.
- Enter selects the highlighted option; Escape closes the popup without changing the value.

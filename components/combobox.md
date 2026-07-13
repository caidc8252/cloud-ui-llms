# Combobox

Searchable dropdown for choosing one option — or several — from a long list.

`Combobox` is a client component built on `@base-ui/react`'s `Combobox`. It is a single component driven by props, not a set of parts. Import it, and the `ComboboxOption` / `ComboboxProps` types, from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Combobox` takes an `options` array of `{ value, label, disabled? }` and filters it by the `label` text as the user types. Prefer it over `Select` as soon as the list is long enough that scanning it is work — a country, a merchant, a region.

Selection mode follows `multiple`, and so does the shape of `value`:

- Single (default) — `value` is a `string`, and `onValueChange` gives you a `string`.
- `multiple` — `value` is a `string[]`, `onValueChange` gives you a `string[]`, and picking an option toggles it and keeps the popover open.

In multi-select, the chosen options render as removable chips in the trigger. `maxChips` caps how many chips show: past that count you get the first `maxChips` chips plus a trailing, non-removable `+N` pill. Leave it undefined and every chip renders, wrapping the trigger to as many lines as it takes.

`size` is `sm` or `md` (default), matching `Input` and `Select` at the same size. In single-select it fixes the trigger height; in multi-select it sets a **minimum** height instead, and the trigger grows taller as the chips wrap. `invalid` gives the trigger the destructive border and ring, and sets `aria-invalid`, so a combobox inside a `Field` errors like any other control. `disabled` disables the whole control; a single option opts out with `disabled` on its `ComboboxOption`.

The trigger is `w-full`, so the field owns the width and it holds still whatever is selected. `className` lands on the trigger — that is where you bound the width, not on a wrapper.

`placeholder`, `searchPlaceholder`, and `emptyText` are all user-facing — pass translated strings. `placeholder` falls back to `Select…` and `searchPlaceholder` to `Search…`, both untranslated, so pass your own. `emptyText` defaults to an empty string, and an empty `emptyText` renders **no** "no results" line at all — if a fruitless search should say so, you must supply it.

## General guidelines

### Do

- Use a combobox when the option list is long enough to benefit from a search box.
- Pass translated `placeholder`, `searchPlaceholder`, and `emptyText`.
- Set `maxChips` in multi-select when an unbounded chip list would break the layout.
- Match the `size` to the surrounding inputs.

### Don't

- Don't use a combobox for a handful of options. Use `Select`, or `RadioGroup` if they should stay visible.
- Don't leave `emptyText` unset if a fruitless search should say so.
- Don't pass a `string` as `value` when `multiple` is on, or a `string[]` when it is off; the shape follows the mode.

## Features

- #### Single select

  ```tsx
  import { Combobox, type ComboboxOption } from "@cloud/ui";

  const regions: ComboboxOption[] = [
    { value: "us-east-1", label: "us-east-1" },
    { value: "eu-west-1", label: "eu-west-1" },
    { value: "ap-south-1", label: "ap-south-1", disabled: true },
  ];

  <Combobox
    options={regions}
    value={region}
    onValueChange={(v) => setRegion(v as string)}
    placeholder={t("region.placeholder")}
    searchPlaceholder={t("common.search")}
    emptyText={t("common.noResults")}
  />;
  ```

- #### Multi select and chips

  With `multiple`, the value is an array and the trigger fills with removable chips. `maxChips` caps the visible chips and adds a `+N` pill.

  ```tsx
  <Combobox
    multiple
    maxChips={3}
    options={merchants}
    value={selected}
    onValueChange={(v) => setSelected(v as string[])}
    placeholder={t("merchant.placeholder")}
  />
  ```

- #### Size and invalid

  `size` is `sm` or `md` (default). `invalid` turns the trigger destructive and sets `aria-invalid`.

  ```tsx
  <Combobox options={regions} value={region} onValueChange={onChange} size="sm" invalid={!!error} />
  ```

### States

- **Empty** — the trigger shows the `placeholder` in muted text.
- **No results** — the popover shows `emptyText`.
- **Invalid** — destructive border and ring on the trigger.
- **Disabled** — the whole control, or a single option through `disabled` on its `ComboboxOption`.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings — pass translated copy in.

### Component-specific guidelines

- `placeholder`: name the choice, such as `Select a region`.
- `searchPlaceholder`: `Search` is usually enough; say what is being searched only when it isn't obvious.
- `emptyText`: say that nothing matched, such as `No regions match that search`.

## Accessibility guidelines

### General accessibility guidelines

- The trigger, search input, listbox, and options carry the correct roles and relationships through the Base UI primitive.
- Give the combobox a visible label. Inside a `Field`, pass `htmlFor` matching the combobox's `id` and `Field` renders the `Label` for you. (There is no `FieldLabel` export.)
- `invalid` sets `aria-invalid`, but the red border is not a message — pair it with a `FieldError`.

### Component-specific guidelines

#### Keyboard interaction

- Enter, Space, or the down arrow key opens the popover and focuses the search box.
- Typing filters the list; the arrow keys move between options.
- Enter selects the highlighted option — in multi-select it toggles it and the popover stays open.
- Escape closes the popover.

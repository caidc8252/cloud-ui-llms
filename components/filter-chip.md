# FilterChip

A single applied filter, with a remove button.

`FilterChip` is a client component in the list-filter family. It takes a `label` and an `onRemove`. Import it from `@cloud/ui`.

## Development guidelines

`FilterChip` is one applied filter in the chip row. It is style plus a single remove action, nothing more: it does not know what the filter is or how to clear it — you pass a `label` (a string) and an `onRemove`, and own the state yourself. Those two props are the whole API.

On a list page the state is `useListFilters`: render the chip from `filters.applied.<key>`, and make `onRemove` call `filters.clearField("<key>")`, which resets that one condition in both the draft and the applied state and re-runs the list. A chip must mean "this is filtering the list right now" — never a pending draft value.

The label truncates at a maximum width (`max-w-[16rem]`) and carries a `title` attribute, so a long value stays readable on hover without stretching the row.

The remove button's accessible name comes from the `ui.listFilter.removeFilter` message — **it is localized inside the component**, so you don't pass it. That does mean the name is generic ("Remove filter"), the same for every chip, which is why the label should carry the field as well as the value.

Chips go in the `applied` row of an `AppliedFilters`, which itself goes into `ListConditionBand`'s `applied` slot.

## General guidelines

### Do

- Write the label as field plus value, so a chip is self-explanatory.
- Render chips inside `AppliedFilters`, which adds the row's caption and the "Clear all" button.
- Make `onRemove` clear exactly that one filter — `filters.clearField(key)`, not a reset of everything.

### Don't

- Don't render a chip for a filter that isn't applied; the row reflects `filters.applied`, not `filters.draft`.
- Don't put a bare value in the label — `Live` tells the user nothing about which field it filters.
- Don't use `FilterChip` as a general-purpose tag. It means "an applied filter you can remove". For a status or a label, use `Badge`.

## Features

- #### A chip

  ```tsx
  import { AppliedFilters, FilterChip, useListFilters } from "@cloud/ui";

  const filters = useListFilters({ initial: { q: "", status: "all" } });

  <AppliedFilters onClearAll={filters.clearAll}>
    {filters.applied.status !== "all" ? (
      <FilterChip
        label={`${t("merchants.status")}: ${t(`status.${filters.applied.status}`)}`}
        onRemove={() => filters.clearField("status")}
      />
    ) : null}
    {filters.applied.q ? (
      <FilterChip
        label={`${t("common.search")}: ${filters.applied.q}`}
        onRemove={() => filters.clearField("q")}
      />
    ) : null}
  </AppliedFilters>;
  ```

### States

- **Truncated** — a long label truncates at `max-w-[16rem]`, with the full text in the `title`.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Label: `Field: value` — `Status: live`, `Search: acme`. The remove button's accessible name is generic, so the label is what tells the user _which_ filter they're removing.
- Keep the value short. A date range chip reads better as `Date: last 7 days` than as two ISO timestamps.

## Accessibility guidelines

### General accessibility guidelines

- The remove control is a real button with a localized accessible name from `ui.listFilter.removeFilter`.
- Because every chip's button has the same name, the chip's own label must carry the distinguishing information — a row of buttons all announcing `Remove filter` is unusable by screen reader.
- Removing a chip changes the results. Announce the new count, or the removal is silent.

### Component-specific guidelines

- The `title` attribute is a hover affordance and not a substitute for a readable label. Keep labels short enough to read in place.

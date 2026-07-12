# AppliedFilters

The row of applied filter chips, with a "clear all" button.

`AppliedFilters` is a client component in the list-filter family. It takes `children` (the chips) and an `onClearAll`. Import it from `@cloud/ui`.

## Development guidelines

`AppliedFilters` wraps the `FilterChip`s in a row, prefixes it with a caption (`Active filters:`), and appends a ghost "Clear all" button. Both strings are localized inside the component through the `ui.listFilter` namespace, so you pass only the chips and the handler. Its API is exactly `children` and `onClearAll` — nothing else.

It **renders nothing when it has no chips** — it returns `null`, so it never reserves vertical space on a list with no filters applied. That's what makes the conditional-children idiom safe: write `{cond ? <FilterChip … /> : null}` and let `Children.toArray` drop the nulls and falses. You don't need to check whether any filter is set before rendering the row.

The row reports the **applied** filters, never the draft. With `useListFilters`, a chip is rendered from `filters.applied.<key>`, its `onRemove` is `filters.clearField("<key>")`, and `onClearAll` is `filters.clearAll` — both of which reset the draft _and_ the applied value to the baseline and re-run the list, so the quick bar can't keep showing a term the list is no longer filtering on.

Put it in `ListConditionBand`'s `applied` slot.

## General guidelines

### Do

- Render each chip conditionally off `filters.applied`; nulls are dropped and an empty row disappears.
- Wire `onClearAll` to `filters.clearAll`, and each chip's `onRemove` to `filters.clearField`.
- Keep the chips in a stable order, so removing one doesn't reshuffle the rest.

### Don't

- Don't render the row from the draft; a chip must mean "this is filtering the list right now".
- Don't guard the whole row yourself — the component already hides when empty.
- Don't put anything but chips in it; it is the applied-filter row, not a toolbar.
- Don't let `onClearAll` clear only some filters. It says "clear all"; it must — including the search box.

## Features

- #### The chip row

  ```tsx
  import { AppliedFilters, FilterChip, ListConditionBand, useListFilters } from "@cloud/ui";

  const filters = useListFilters({
    initial: { q: "", status: "all", region: "all" },
    onApply: () => setPage(1),
  });

  <ListConditionBand
    toolbar={toolbar}
    applied={
      <AppliedFilters onClearAll={filters.clearAll}>
        {filters.applied.status !== "all" ? (
          <FilterChip
            label={`${t("merchants.status")}: ${t(`status.${filters.applied.status}`)}`}
            onRemove={() => filters.clearField("status")}
          />
        ) : null}
        {filters.applied.region !== "all" ? (
          <FilterChip
            label={`${t("merchants.region")}: ${filters.applied.region}`}
            onRemove={() => filters.clearField("region")}
          />
        ) : null}
      </AppliedFilters>
    }
  />;
  ```

  `filters.hasApplied` tells you whether anything is applied at all — useful for the `ListSummaryBar`'s "matching filters" copy. You don't need it here: the row hides itself.

### States

- **Empty** — no chips: the component renders `null` and takes no space.
- **With chips** — the caption, the chips, and the "Clear all" button.

## Writing guidelines

The row's own copy — the caption and the "clear all" label — is localized inside the component, through the `ui.listFilter` namespace. You supply only the chip labels.

## Accessibility guidelines

### General accessibility guidelines

- The "clear all" control is a real button with a localized label.
- The row appearing and disappearing changes the page's layout and the results beneath it. Announce the new result count when filters change; a silently reflowing list is disorienting.
- The chips are the visible record of what's filtering the list. Don't hide the row behind a disclosure — it is the answer to "why am I seeing only these rows?"

### Component-specific guidelines

- Removing every chip one at a time and pressing "clear all" must land on the same state. If they diverge, the row is lying about what's applied.

# AppliedFilters

The row of applied filter chips, with a "clear all" button.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/list-filter/applied-filters.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/list-filter/index.ts)

`AppliedFilters` is a client component in the list-filter family. It takes `children` (the chips) and an `onClearAll`. Import it from `@cloud/ui`.

## Development guidelines

`AppliedFilters` wraps the `FilterChip`s in a row, prefixes it with a caption, and appends a "clear all" button. Both strings are localized inside the component through the `ui.listFilter` namespace, so you pass only the chips and the handler.

It **renders nothing when it has no chips** — it returns `null`, so it never reserves vertical space on a list with no filters applied. That's what makes the conditional-children idiom safe: write `{cond ? <FilterChip … /> : null}` and let `Children.toArray` drop the nulls and falses. You don't need to check whether any filter is set before rendering the row.

Put it in `ListConditionBand`'s `applied` slot.

## General guidelines

### Do

- Render each chip conditionally; nulls are dropped and an empty row disappears.
- Make `onClearAll` reset every filter, including the search box.
- Keep the chips in a stable order, so removing one doesn't reshuffle the rest.

### Don't

- Don't guard the whole row yourself — the component already hides when empty.
- Don't put anything but chips in it; it is the applied-filter row, not a toolbar.
- Don't let `onClearAll` clear only some filters. It says "clear all"; it must.

## Features

- #### The chip row

  ```tsx
  import { AppliedFilters, FilterChip, ListConditionBand } from "@cloud/ui";

  <ListConditionBand
    toolbar={toolbar}
    applied={
      <AppliedFilters onClearAll={clearAll}>
        {status ? (
          <FilterChip
            label={`${t("merchants.status")}: ${t(`status.${status}`)}`}
            onRemove={() => setStatus(null)}
          />
        ) : null}
        {region ? (
          <FilterChip
            label={`${t("merchants.region")}: ${region}`}
            onRemove={() => setRegion(null)}
          />
        ) : null}
      </AppliedFilters>
    }
  />;
  ```

### States

- **Empty** — no chips: the component renders `null` and takes no space.
- **With chips** — the caption, the chips, and the "clear all" button.

## Writing guidelines

The row's own copy — the caption and the "clear all" label — is localized inside the component, through the `ui.listFilter` namespace. You supply only the chip labels.

## Accessibility guidelines

### General accessibility guidelines

- The "clear all" control is a real button with a localized label.
- The row appearing and disappearing changes the page's layout and the results beneath it. Announce the new result count when filters change; a silently reflowing list is disorienting.
- The chips are the visible record of what's filtering the list. Don't hide the row behind a disclosure — it is the answer to "why am I seeing only these rows?"

### Component-specific guidelines

- Removing every chip one at a time and pressing "clear all" must land on the same state. If they diverge, the row is lying about what's applied.

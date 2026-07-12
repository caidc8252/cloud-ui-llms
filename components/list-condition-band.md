# ListConditionBand

The list page's filter band — a quick-bar toolbar over the applied-chip row.

`ListConditionBand` is a client component in the list-filter family. It fills two slots — `toolbar` and `applied` — and takes a `sticky` flag. Import it from `@cloud/ui`.

## Development guidelines

`ListConditionBand` is the shell of the filter area on a list page. `toolbar` holds the quick-bar controls (a `SearchInput`, a couple of quick `Select`s, the `AdvancedFilterButton`); `applied` holds the `AppliedFilters` chip row, which may be `null` and which hides itself when there are no chips.

`sticky` defaults to **`false`**, and that is the right default. On the standard list page it is the **`ListSummaryBar` and the table's sticky header that dock**, not the filter band — the band scrolls away, because once the user has set their filters, the thing they need pinned is the result count and the column headers. Pass `sticky` only when the filter band itself must stay in view; it then docks under the app header, with the full-bleed negative-margin math applied for you.

Pair the whole family with the `useListFilters` hook, which holds the draft and applied filter state.

## General guidelines

### Do

- Put the quick-bar controls in `toolbar` and the chip row in `applied`.
- Leave `sticky` off on a standard list page; dock the `ListSummaryBar` and the table header instead.
- Let `AppliedFilters` decide whether the chip row shows.

### Don't

- Don't stick the filter band _and_ the summary bar and the table header; three docked strips leave no room for the list.
- Don't put the result count or an Export button in the toolbar — those belong in `ListSummaryBar`.
- Don't hand-roll the sticky offsets; pass `sticky` and let the component do the math.

## Features

- #### Toolbar and applied row

  ```tsx
  import {
    ListConditionBand,
    SearchInput,
    AdvancedFilterButton,
    AppliedFilters,
    FilterChip,
  } from "@cloud/ui";

  <ListConditionBand
    toolbar={
      <>
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={apply}
          placeholder={t("merchants.search")}
        />
        <AdvancedFilterButton open={sheetOpen} onToggle={toggleSheet} count={advancedCount} />
      </>
    }
    applied={
      <AppliedFilters onClearAll={clearAll}>
        {status ? (
          <FilterChip
            label={`${t("merchants.status")}: ${status}`}
            onRemove={() => setStatus(null)}
          />
        ) : null}
      </AppliedFilters>
    }
  />;
  ```

- #### Sticky

  `sticky` docks the band under the app header. Off by default — the standard list page docks the summary bar and the table header instead.

### States

- **In flow** (default) — the band scrolls away with the content.
- **Sticky** — the band docks under the app header, full-bleed.

## Writing guidelines

`ListConditionBand` renders no text of its own; the copy lives in the controls you pass it.

## Accessibility guidelines

### General accessibility guidelines

- The band is a layout shell. Its accessibility comes from the controls inside it, so every quick-bar control needs its own accessible name.
- When filters change the results, announce the new count. The chip row shows _what_ is applied; the count tells the user what it _did_.
- Keep the docked strips to a minimum. Every sticky bar is viewport a keyboard user doesn't get, and a focused row can end up hidden behind one.

### Component-specific guidelines

- The applied-chip row is the only visible record of the active filters. Don't collapse it behind a disclosure to save space.

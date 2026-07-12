# ListConditionBand

The list page's filter band — a quick-bar toolbar over the applied-chip row.

`ListConditionBand` is a client component in the list-filter family. It fills two slots — `toolbar` and `applied` — and takes a `sticky` flag. Import it from `@cloud/ui`.

## Development guidelines

`ListConditionBand` is the shell of the filter area on a list page. `toolbar` holds the quick-bar controls (a `SearchInput`, a couple of quick `Select`s, the mandatory secondary **Search** button, and — when the page has more conditions than fit a row — the `AdvancedFilterButton`); `applied` holds the `AppliedFilters` chip row, which may be `null` and which hides itself when there are no chips.

**The search / filter interaction on a list page is not a free choice.** Use the list-filter family plus `useListFilters` — a hand-rolled flex row of bare `Select`s is not an acceptable substitute. The hook holds the **draft / applied** state machine: the quick-bar controls mutate `draft` (through `setDraft`), and **only the Search button or Enter inside `SearchInput` calls `apply()`**, which commits `draft` → `applied`. Your filtering logic reads `filters.applied`; the chip row reflects `filters.applied`; a chip's `×` calls `clearField`, and "clear all" calls `clearAll`.

The Search button has one shape, and it is not yours to redesign — **the icon is mandatory**:

```tsx
<Button variant="secondary" iconLeft={<Search className="size-4" />} onClick={filters.apply}>
  Search
</Button>
```

(`Search` from `lucide-react`.) The magnifier inside `SearchInput` is a prefix marker; the one on the button is the commit action. Both exist, and neither replaces the other.

Everything in the band sizes at **`md`** — `SearchInput` is an `md` `Input`, the quick `Select`s take `size="md"`, the Search button and `AdvancedFilterButton` are `md` buttons. A `sm` control in the quick bar breaks the row's baseline.

`sticky` defaults to **`false`**, and that is the right default. On the standard list page it is the **`ListSummaryBar` and the table's sticky header that dock**, not the filter band — the band scrolls away, because once the user has set their filters, the thing they need pinned is the result count and the column headers. Pass `sticky` only when the filter band itself must stay in view; it then docks under the app header, with the full-bleed negative-margin math applied for you.

The band is followed by the results region, which has a fixed composition: `Card overflow-clip` > `ListSummaryBar` > `Table stickyHeader stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}` > `RichPagination`.

## General guidelines

### Do

- Put the quick-bar controls in `toolbar` and the chip row in `applied`.
- Drive the whole band from `useListFilters`: `draft` into the controls, `apply` on Search and on Enter, `applied` into the query and the chips.
- End the toolbar with the mandated secondary Search button, icon included.
- Size every control in the band `md`.
- Leave `sticky` off on a standard list page; dock the `ListSummaryBar` and the table header instead.
- Let `AppliedFilters` decide whether the chip row shows.

### Don't

- Don't filter on `draft`. A quick-bar control that re-queries the list as it changes has skipped the commit step the band exists to provide.
- Don't hand-roll the filter row out of a `flex` div and bare `Select`s. This band _is_ the paradigm.
- Don't give a filter a `min-w-*`. The band already sets the floor, and yours collides with it and loses — pass a width (`w-56`) instead.
- Don't stick the filter band _and_ the summary bar and the table header; three docked strips leave no room for the list.
- Don't put the result count or an Export button in the toolbar — those belong in `ListSummaryBar`.
- Don't hand-roll the sticky offsets; pass `sticky` and let the component do the math.

## Features

- #### Toolbar and applied row

  ```tsx
  import { Search } from "lucide-react";
  import {
    AppliedFilters,
    Button,
    FilterChip,
    ListConditionBand,
    SearchInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useListFilters,
  } from "@cloud/ui";

  const filters = useListFilters({
    initial: { q: "", status: "all" },
    onApply: () => setPage(1),
  });

  <ListConditionBand
    toolbar={
      <>
        <SearchInput
          value={filters.draft.q}
          onChange={(v) => filters.setDraft("q", v)}
          onSearch={filters.apply}
          placeholder={t("merchants.search")}
        />
        <Select
          value={filters.draft.status}
          onValueChange={(v) => filters.setDraft("status", String(v ?? "all"))}
        >
          <SelectTrigger size="md">
            <SelectValue placeholder={t("common.any")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("status.all")}</SelectItem>
            <SelectItem value="live">{t("status.live")}</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="secondary"
          size="md"
          iconLeft={<Search className="size-4" />}
          onClick={filters.apply}
        >
          {t("common.search")}
        </Button>
      </>
    }
    applied={
      <AppliedFilters onClearAll={filters.clearAll}>
        {filters.applied.status !== "all" ? (
          <FilterChip
            label={`${t("merchants.status")}: ${filters.applied.status}`}
            onRemove={() => filters.clearField("status")}
          />
        ) : null}
      </AppliedFilters>
    }
  />;
  ```

- #### Filter widths

  The band owns its filters' **bounds**, not their widths: it clamps every `SelectTrigger` inside it between a floor and a ceiling (`min-w-40` / `max-w-72`), so a short label like `All` can't collapse the box and `Payment terminals / Smart POS` can't run away with the row. Between those bounds each filter still sizes to its own content — filters are peers, not clones.

  When a filter's options vary a lot in length, give it a width of its own, sized to the **longest plausible** option so the box holds still as the user picks:

  ```tsx
  // A width, not a floor: `min-w-*` collides with the band's floor and loses.
  <SelectTrigger size="md" className="w-64">…</SelectTrigger>
  ```

  An explicit width is honoured — the band merely clamps it into range.

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

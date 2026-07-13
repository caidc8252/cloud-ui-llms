# ListSummaryBar

Result-count and actions strip between the list card's top edge and the table.

`ListSummaryBar` is a client component in the list-filter family. It exports the `LIST_SUMMARY_BAR_HEIGHT` constant alongside it. Import them from `@cloud/ui`.

## Development guidelines

`ListSummaryBar` is the low-chrome strip inside the results frame: the result count and its label on the left at `text-xs` (the bar _reports_ a total, it doesn't headline it), an actions slot (Export, bulk operations) on the right. Its props are `total` (required), `label`, `actions` and `sticky`. `total` and `label` are **nodes**, not strings — the count label and any "matching filters" copy carry i18n on the page side, the same way `ListConditionBand` takes its slots as nodes. That's also where `useListFilters`' `hasApplied` lands: append "matching filters" to the label when filters are applied, so the number explains itself.

The bar is one member of a **fixed results-region composition**, and it only works as part of it:

```
PageBody                      ← the page's scroll root
  └ Card overflow-clip
      └ ListSummaryBar
      └ Table stickyHeader stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}
      └ RichPagination
```

**`sticky` defaults to `true`.** The bar docks at the top of the page scroll root — `PageBody` — flush under the page header band, so it stays pinned together with the table's sticky column header. That only works if the host cooperates, in two ways — get either wrong and the sticky is silently trapped and scrolls away:

1. The surrounding `Card` must use **`overflow-clip`**, not its default `overflow-hidden`. Clip still rounds the corners but does not establish a scroll container, so the bar can dock to `PageBody` instead of to the card.
2. The `Table` must run `stickyHeader` with **`stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}`**, so the column header tiles flush beneath the bar. That's what the exported constant is for — it is `48`, matching the bar's `h-12`, and you should never type that number yourself.

Pass `sticky={false}` for a short or embedded list that keeps the bar in flow.

### The actions ladder

The button weight in `actions` is a ladder, and the component can't enforce it — `actions` is a caller-supplied node, so this is on you:

1. **Ghost** for every tool verb (Export, Import, Refresh) and every neutral bulk verb. A destructive bulk verb takes ghost-danger, its peer at the same weight, so the bulk group reads as one carrier.
2. **Primary** only where this bar holds the surface's single commit verb _and_ no `PageHeader` above it does — a detail page's rich collection section. A list page always has a `PageHeader`, so never there.
3. **Secondary** last, and only with a named reason.

The point: this is a low-chrome strip inside the results frame, so an outlined button here draws a box inside a box and competes with the count. **The variant follows the slot, not the verb** — the same verb landing in the `PageHeader` instead stays secondary there.

## General guidelines

### Do

- Use ghost buttons in `actions` on a list page.
- Set the `Table`'s `stickyHeaderTop` to `LIST_SUMMARY_BAR_HEIGHT`, and give the host `Card` `overflow-clip`.
- Pass `total` and `label` as translated nodes, and say "matching filters" in the label when `filters.hasApplied`.
- Close the results `Card` with a `RichPagination` under the `Table` — numbered pagination is the list-page default.
- Pass `sticky={false}` for a short, embedded list.

### Don't

- Don't put a primary button here on a list page; the page's commit verb lives in the `PageHeader`.
- Don't hardcode the bar's height; import `LIST_SUMMARY_BAR_HEIGHT`.
- Don't leave the host `Card` on `overflow-hidden` — the sticky will be trapped, and it fails silently.
- Don't put the bar outside the results `Card`, or the filter controls inside it — the quick bar and the chip row belong to `ListConditionBand`, above the card.

## Features

- #### Count and actions

  ```tsx
  import {
    Button,
    Card,
    LIST_SUMMARY_BAR_HEIGHT,
    ListSummaryBar,
    RichPagination,
    Table,
  } from "@cloud/ui";

  <Card elevation={1} className="overflow-clip">
    <ListSummaryBar
      total={total}
      label={
        <>
          {t("merchants.unit", { count: total })}
          {filters.hasApplied ? (
            <span className="text-content-tertiary"> {t("common.matchingFilters")}</span>
          ) : null}
        </>
      }
      actions={
        <Button variant="ghost" size="sm" onClick={exportCsv}>
          {t("common.export")}
        </Button>
      }
    />
    <Table
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      onRowClick={(row) => navigate(`/merchants/${row.id}`)}
      stickyHeader
      stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}
    />
    <RichPagination
      page={safePage}
      pageCount={pageCount}
      onPageChange={setPage}
      total={total}
      pageSize={pageSize}
      onPageSizeChange={(n) => {
        setPageSize(n);
        setPage(1);
      }}
    />
  </Card>;
  ```

- #### Non-sticky

  `sticky={false}` keeps the bar in normal flow — for a short list, or one embedded in a detail page.

### States

- **Sticky** (default) — docked at the top of the page scroll root (`PageBody`), under the page header band, with the table header beneath it.
- **In flow** — scrolls with the content.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- The count is the number; the label says what it counts and whether filters are applied — `results matching your filters` reads very differently from `merchants`. Say which one it is.
- The bar reports a total, it doesn't headline it: keep the type small and the wording plain.

## Accessibility guidelines

### General accessibility guidelines

- The count is the page's answer to "did my filter do anything?". Announce it when the results change, not just render it.
- The action buttons are real buttons; give an icon-only one an `aria-label`.
- The bar is sticky and eats 48px of the scroll viewport, on top of the page header band that never scrolls away either. Keep it to one row.

### Component-specific guidelines

- A bulk-action group that acts on a selection must say what it will act on. `Delete` next to a count of 200 is a different promise from `Delete` next to 3 selected rows.

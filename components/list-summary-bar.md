# ListSummaryBar

Result-count and actions strip between the list card's top edge and the table.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/list-filter/list-summary-bar.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/list-filter/index.ts)

`ListSummaryBar` is a client component in the list-filter family. It exports the `LIST_SUMMARY_BAR_HEIGHT` constant alongside it. Import them from `@cloud/ui`.

## Development guidelines

`ListSummaryBar` is the low-chrome strip inside the results frame: the result count and its label on the left, an actions slot (Export, bulk operations) on the right. `total` and `label` are **nodes**, not strings — the count label and any "matching filters" copy carry i18n on the page side, the same way `ListConditionBand` takes its slots as nodes.

**`sticky` defaults to `true`.** The bar docks at the top of the scroll root so it stays pinned together with the table's sticky column header. That only works if the host cooperates, in two ways — get either wrong and the sticky is silently trapped and scrolls away:

1. The surrounding `Card` must use **`overflow-clip`**, not its default `overflow-hidden`. Clip still rounds the corners but does not establish a scroll container, so the bar can dock to the page scroll root.
2. The `Table` must run `stickyHeader` with **`stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}`**, so the column header tiles flush beneath the bar. That's what the exported constant is for — don't hardcode `48`.

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
- Pass `total` and `label` as translated nodes.
- Pass `sticky={false}` for a short, embedded list.

### Don't

- Don't put a primary button here on a list page; the page's commit verb lives in the `PageHeader`.
- Don't hardcode the bar's height; import `LIST_SUMMARY_BAR_HEIGHT`.
- Don't leave the host `Card` on `overflow-hidden` — the sticky will be trapped, and it fails silently.

## Features

- #### Count and actions

  ```tsx
  import { ListSummaryBar, LIST_SUMMARY_BAR_HEIGHT, Table, Card, Button } from "@cloud/ui";

  <Card className="overflow-clip">
    <ListSummaryBar
      total={total}
      label={t("merchants.matching")}
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
      stickyHeader
      stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}
    />
  </Card>;
  ```

- #### Non-sticky

  `sticky={false}` keeps the bar in normal flow — for a short list, or one embedded in a detail page.

### States

- **Sticky** (default) — docked at the top of the scroll root, with the table header beneath it.
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
- The bar is sticky and eats 48px of the viewport. Keep it to one row.

### Component-specific guidelines

- A bulk-action group that acts on a selection must say what it will act on. `Delete` next to a count of 200 is a different promise from `Delete` next to 3 selected rows.

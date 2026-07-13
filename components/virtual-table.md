# VirtualTable

Windowed data table for large row counts, with optional scroll loading.

`VirtualTable` is a generic component: `VirtualTable<R>`. It shares the `columns` / `rows` / `rowKey` / `sort` contract with `Table`, so the same `TableColumn<R>[]` drives both. It exports `VirtualTableProps` alongside it; the column type comes from `Table` as `TableColumn`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

**Reach for it only when you have a reason to.** Numbered pagination (`RichPagination` under a plain `Table`) is the default for a result region. `VirtualTable`'s scroll loading — like `LoadMore` — is licensed only by one of these, and the reason belongs in a code comment at the call site:

- **Feed or stream browsing** — activity, notifications, logs, search-as-you-scroll: there is no "page N" for the user to want.
- **Unknown or unbounded total** — you have no `total` or `pageCount` to render.
- **Realtime append** — rows keep arriving at the tail.
- **Cursor-only backend** — offset paging is too expensive or simply isn't offered.
- **Touch or narrow container as the primary form** — scrolling is how the user browses.

None of those? Use `Table` + `RichPagination`. Note that plain virtualization (a big array, no scroll loading) is a separate question from paging: a windowed viewport is a rendering optimization, and it does **not** license dropping the pager.

`VirtualTable` bundles two independent features. Turn on whichever you need.

**Virtual scrolling (always on).** Only the rows inside the scroll viewport are mounted, through `@tanstack/react-virtual`, so a ten-thousand-row array stays smooth. Pass the **full** array as `rows` — all of it — and give the table a fixed-height viewport through `height` (default `480`). That's all windowing needs. Tune it with `estimateRowHeight` (the guess used before rows are measured; variable heights are measured automatically) and `overscan` (how many extra rows render above and below the viewport, default `8`).

**Scroll loading (opt-in).** To append the next page as the user nears the bottom, pass all three of `hasMore`, `isLoadingMore`, and `onReachEnd`. `onReachEnd` fires once when the bottom sentinel scrolls into view — and again once you've grown `rows` — and it is guarded so it won't re-fire while a load is in flight. Omit `onReachEnd` and scroll loading is off. `loadingFooter` is shown while the next page loads, defaulting to a centered `Spinner`.

`footer` is different from `loadingFooter`: it is a persistent node rendered inside the scroll viewport below the rows — a `LoadMore` button, say, revealed only when the user has scrolled to the bottom.

Need scroll loading on a list that isn't a table? Use the standalone `useInfiniteScroll` hook instead.

Use plain `Table` when the row count is small — virtualization costs a fixed-height viewport and complicates printing and in-page search, and it buys nothing at fifty rows.

**It is not a drop-in for every `Table` prop.** `VirtualTable` renders a CSS grid of `div`s with ARIA roles, not a real `<table>`, and it accepts only the shared contract plus its own windowing and scroll-loading props. It has **no** `density`, `striped`, `bordered`, `stickyFirstColumn`, `rowState`, `rowNav`, or `rowActions` — in particular `onRowClick` here makes the row clickable but appends **no** passive chevron, so a navigable windowed row has no trailing affordance. Its header is always sticky to its **own** fixed-height scroll viewport — not to the page scroll root (`PageBody`) the way `Table stickyHeader` docks — so `stickyHeader` / `stickyHeaderTop` have no counterpart either. Column layout comes from the grid: a column with no `width` takes a `minmax(0, 1fr)` track, and a `width` (number of px, or a CSS length) becomes a fixed track.

## General guidelines

### Do

- Pass the whole `rows` array; the component windows it for you.
- Give it a `height` — windowing needs a bounded viewport.
- Set `estimateRowHeight` close to your real row height, for a stable scrollbar.
- Pass `hasMore`, `isLoadingMore`, and `onReachEnd` together, or not at all.
- Name the reason for scroll loading in a comment at the call site.
- Set an explicit `width` on the columns that need one; the rest split the row as `1fr` tracks.

### Don't

- Don't pre-slice `rows` to the visible window; that's the component's job.
- Don't use it for a short list. Use `Table`.
- Don't reach for scroll loading as the default footer. Unless one of the reasons above holds, the result region wants `Table` + `RichPagination`.
- Don't expect `Table`'s row extras here — `density`, `rowState`, `rowNav`, and `rowActions` don't exist on `VirtualTable`, and `onRowClick` appends no chevron.
- Don't flip `hasMore` to `false` while a load is still in flight; guard on `isLoadingMore` instead.

## Features

- #### Virtual scrolling

  ```tsx
  import { VirtualTable } from "@cloud/ui";

  <VirtualTable
    columns={columns}
    rows={rows} // the full array, even 10k+
    rowKey={(row) => row.id}
    height={520}
    estimateRowHeight={44}
  />;
  ```

- #### Scroll loading

  All three of `hasMore`, `isLoadingMore`, and `onReachEnd` together enable infinite scroll.

  ```tsx
  const [rows, setRows] = React.useState<Row[]>(firstPage);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const hasMore = rows.length < total;

  // Scroll loading, not RichPagination: this is an append-only activity stream
  // with no "page N" for the user to jump to.
  async function loadNextPage() {
    setIsLoadingMore(true);
    const next = await request.get<Row[]>("/api/things", { query: { page, limit } });
    setRows((prev) => [...prev, ...next.data]);
    setIsLoadingMore(false);
  }

  <VirtualTable
    columns={columns}
    rows={rows}
    rowKey={(r) => r.id}
    height={520}
    hasMore={hasMore}
    isLoadingMore={isLoadingMore}
    onReachEnd={loadNextPage}
  />;
  ```

- #### Footers

  `loadingFooter` shows while the next page loads (a centered `Spinner` by default). `footer` is a persistent node below the rows inside the viewport — for instance a `LoadMore` button.

- #### Sorting and rows

  `sort`, `onSortChange`, and `empty` behave as in `Table`, including the third click on a sortable header reporting `null`. `onRowClick` makes the row clickable, but — unlike `Table` — it appends **no** passive chevron, and there is no `rowNav` or `rowActions` here. If a windowed row navigates, put a real link in a content cell.

### States

- **Loading more** — `isLoadingMore` shows the `loadingFooter` and blocks `onReachEnd` from re-firing.
- **Exhausted** — `hasMore` is `false`, so `onReachEnd` stops firing.
- **Empty** — the `empty` node.

## Writing guidelines

Follows `Table`. Column titles are sentence case; give the empty state a message that says what's missing and what to do.

## Accessibility guidelines

### General accessibility guidelines

- This is **not** a real `<table>`. Rows and cells are `div`s carrying `role="row"`, `role="columnheader"`, and `role="cell"`, so the structure a screen reader gets is weaker than `Table`'s. When a table's semantics matter more than its row count, use `Table`.
- Only the windowed rows exist in the DOM, so the browser's find-in-page and a screen reader's "read all" cannot see rows outside the viewport. Don't put anything essential only in a far-off row — give the user search, filters, and sort.
- Keyboard focus lives inside a scrollable viewport; make sure a row's interactive content is reachable by Tab as it scrolls into view.
- Prefer an explicit `LoadMore` button in `footer` over pure infinite scroll when the list has a footer or an end state the user must reach — an endlessly growing list is a keyboard trap.

### Component-specific guidelines

- Announce that more rows loaded. A silent append leaves a screen-reader user with no idea the list grew.

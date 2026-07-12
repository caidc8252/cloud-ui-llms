# VirtualTable

Windowed data table for large row counts, with optional scroll loading.

`VirtualTable` is a generic component: `VirtualTable<R>`. It shares the `columns` / `rows` / `rowKey` / `sort` contract with `Table`, so the same `TableColumn<R>[]` drives both. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`VirtualTable` bundles two independent features. Turn on whichever you need.

**Virtual scrolling (always on).** Only the rows inside the scroll viewport are mounted, through `@tanstack/react-virtual`, so a ten-thousand-row array stays smooth. Pass the **full** array as `rows` — all of it — and give the table a fixed-height viewport through `height` (default `480`). That's all windowing needs. Tune it with `estimateRowHeight` (the guess used before rows are measured; variable heights are measured automatically) and `overscan` (how many extra rows render above and below the viewport, default `8`).

**Scroll loading (opt-in).** To append the next page as the user nears the bottom, pass all three of `hasMore`, `isLoadingMore`, and `onReachEnd`. `onReachEnd` fires once when the bottom sentinel scrolls into view — and again once you've grown `rows` — and it is guarded so it won't re-fire while a load is in flight. Omit `onReachEnd` and scroll loading is off. `loadingFooter` is shown while the next page loads, defaulting to a centered `Spinner`.

`footer` is different from `loadingFooter`: it is a persistent node rendered inside the scroll viewport below the rows — a `LoadMore` button, say, revealed only when the user has scrolled to the bottom.

Need scroll loading on a list that isn't a table? Use the standalone `useInfiniteScroll` hook instead.

Use plain `Table` when the row count is small — virtualization costs a fixed-height viewport and complicates printing and in-page search, and it buys nothing at fifty rows.

## General guidelines

### Do

- Pass the whole `rows` array; the component windows it for you.
- Give it a `height` — windowing needs a bounded viewport.
- Set `estimateRowHeight` close to your real row height, for a stable scrollbar.
- Pass `hasMore`, `isLoadingMore`, and `onReachEnd` together, or not at all.

### Don't

- Don't pre-slice `rows` to the visible window; that's the component's job.
- Don't use it for a short list. Use `Table`.
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

  `sort`, `onSortChange`, `onRowClick`, and `empty` behave exactly as in `Table`, including the third click on a sortable header reporting `null`.

### States

- **Loading more** — `isLoadingMore` shows the `loadingFooter` and blocks `onReachEnd` from re-firing.
- **Exhausted** — `hasMore` is `false`, so `onReachEnd` stops firing.
- **Empty** — the `empty` node.

## Writing guidelines

Follows `Table`. Column titles are sentence case; give the empty state a message that says what's missing and what to do.

## Accessibility guidelines

### General accessibility guidelines

- Only the windowed rows exist in the DOM, so the browser's find-in-page and a screen reader's "read all" cannot see rows outside the viewport. Don't put anything essential only in a far-off row — give the user search, filters, and sort.
- Keyboard focus lives inside a scrollable viewport; make sure a row's interactive content is reachable by Tab as it scrolls into view.
- Prefer an explicit `LoadMore` button in `footer` over pure infinite scroll when the list has a footer or an end state the user must reach — an endlessly growing list is a keyboard trap.

### Component-specific guidelines

- Announce that more rows loaded. A silent append leaves a screen-reader user with no idea the list grew.

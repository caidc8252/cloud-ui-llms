# RichPagination

Full list/table footer bar — rows-per-page selector, range summary, and page navigation.

`RichPagination` is a client component driven by props, built on `Pagination`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`RichPagination` is the footer bar for a list or a table: on the left, an optional rows-per-page selector and a "showing X–Y of Z" range summary; on the right, the page-number navigation.

**It is the default pagination for a result region.** Put it inside the results `Card`, directly under the `Table` — it draws its own top border and padding, so it needs no wrapper. Numbered paging is what an ops or admin list wants: jump to page N, see the total, control the page size, keep a predictable position. Scroll loading (`LoadMore`, or `VirtualTable`'s `onReachEnd`) is **not** the default and needs a specific reason — a feed, an unknown total, realtime append, a cursor-only backend, or a touch-first narrow container.

It is controlled. Pass `page` (1-based), `pageCount`, `total` (the item count across all pages, which drives the summary), `pageSize`, and `onPageChange`. Pass `onPageSizeChange` to get the rows-per-page selector — **omit it and the selector disappears entirely**, which is what you want for a list with a fixed page size. `pageSizeOptions` defaults to `[10, 25, 50, 100]`. `siblingCount` and `showFirstLast` (default `false`) are forwarded to the underlying `Pagination`, and apply only to the wide numbered pager. `className` is merged onto the bar.

The state around it is two values, `page` and `pageSize`. Derive `pageCount = Math.ceil(total / pageSize)`, reset to page 1 whenever a filter or the page size changes, and clamp what you render with `safePage = Math.min(page, pageCount)` — otherwise a filter that shrinks the result set strands the user on an empty page.

All of its text is **localized internally**, through the `ui.pagination` message namespace — the same convention `DatePicker` uses for `ui.datePicker`. Callers pass data, not copy: the keys are `rowsPerPage`, `showing` (a rich message with `from`, `to`, `total`, and a `b` bold chunk), `pageOf`, and the `first` / `prev` / `next` / `last` arrow labels it hands down to `Pagination`. The defaults ship in `@cloud/ui/messages` and host apps merge them into their request config, so there is nothing to translate at the call site.

It is **responsive with no prop to set**. The bar is its own `@container`, so when _its own_ width — not the viewport's — drops below the `@lg` breakpoint, it collapses the page-size selector and the numbered pager into a compact `‹ Page X of Y ›` cluster. The range summary stays. A narrow card, a split pane, or a phone all get the right layout without the caller doing anything.

## General guidelines

### Do

- Use `RichPagination` as the standard footer for a paginated table or list — inside the results `Card`, under the `Table`.
- Reset `page` to 1 when a filter changes or the page size changes, and clamp with `safePage = Math.min(page, pageCount)`.
- Omit `onPageSizeChange` when the page size is fixed; the selector then doesn't render.
- Keep `page` and `pageSize` in the URL, so a paginated view can be linked and refreshed.
- Pass a `total` that is the real count across all pages — the range summary is only as honest as it is.

### Don't

- Don't hand it translated strings; it localizes its own text through `ui.pagination`.
- Don't add your own media queries around it; it collapses on its own container width.
- Don't wrap it in a bordered or padded container; it brings its own top border and padding.
- Don't swap it for scroll loading without one of the reasons that licenses it (feed, unknown total, realtime append, cursor-only backend, touch-first container).
- Don't use it when you only need the page buttons. Use `Pagination`.

## Features

- #### Full footer

  ```tsx
  import { RichPagination } from "@cloud/ui";

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount); // a shrinking result set can't strand us
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  <RichPagination
    page={safePage}
    pageCount={pageCount}
    total={filtered.length}
    pageSize={pageSize}
    onPageChange={setPage}
    onPageSizeChange={(n) => {
      setPageSize(n);
      setPage(1);
    }}
  />;
  ```

- #### Fixed page size

  Omit `onPageSizeChange` and the rows-per-page selector is not rendered.

  ```tsx
  <RichPagination
    page={page}
    pageCount={pageCount}
    total={total}
    pageSize={25}
    onPageChange={setPage}
  />
  ```

- #### Page-size options

  `pageSizeOptions` defaults to `[10, 25, 50, 100]`.

  ```tsx
  <RichPagination … pageSizeOptions={[20, 50, 200]} onPageSizeChange={setPageSize} />
  ```

- #### Responsive collapse

  Below the bar's own `@lg` container width, the selector and numbered pager collapse into a compact `‹ Page X of Y ›` cluster. The range summary stays put. `siblingCount` and `showFirstLast` shape only the wide numbered pager — the compact cluster is prev and next, nothing else.

### States

- **Wide** — page-size selector and range summary on the left, numbered pager on the right.
- **Narrow** — the selector and numbered pager give way to the compact prev / page-of / next cluster; the range summary remains.
- **At the bounds** — previous and next are disabled on the first and last page, in both layouts.
- **Empty** — with `total` at `0` the summary reads a `0–0 of 0` range rather than disappearing.

## Writing guidelines

`RichPagination` renders no caller-supplied text. Its copy comes from the `ui.pagination` message namespace; override it there, in your locale files, not at the call site.

## Accessibility guidelines

### General accessibility guidelines

- The page buttons, arrows, and the rows-per-page select are real controls, reachable by Tab.
- The arrow buttons carry localized accessible names from the `ui.pagination` namespace.
- The range summary tells a screen-reader user where they are in the list; don't remove it in favour of the page number alone.

### Component-specific guidelines

- Changing the page size changes what page 1 contains. Reset `page` to 1 in `onPageSizeChange`, or the user lands on a page that no longer exists.

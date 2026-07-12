# RichPagination

Full list/table footer bar — rows-per-page selector, range summary, and page navigation.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/recipes/rich-pagination.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`RichPagination` is a client component driven by props, built on `Pagination`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`RichPagination` is the footer bar for a list or a table: on the left, an optional rows-per-page selector and a "showing X–Y of Z" range summary; on the right, the page-number navigation.

It is controlled. Pass `page` (1-based), `pageCount`, `total` (the item count across all pages, which drives the summary), `pageSize`, and `onPageChange`. Pass `onPageSizeChange` to get the rows-per-page selector — **omit it and the selector disappears entirely**, which is what you want for a list with a fixed page size. `pageSizeOptions` defaults to `[10, 25, 50, 100]`. `siblingCount` and `showFirstLast` are forwarded to the underlying `Pagination`.

All of its text is **localized internally**, through the `ui.pagination` message namespace — the same convention `DatePicker` uses for `ui.datePicker`. Callers pass data, not copy. The defaults ship in `@cloud/ui/messages` and host apps merge them into their request config, so there is nothing to translate at the call site.

It is **responsive with no prop to set**. The bar is its own `@container`, so when _its own_ width — not the viewport's — drops below the `@lg` breakpoint, it collapses the page-size selector and the numbered pager into a compact `‹ Page X of Y ›` cluster. A narrow card, a split pane, or a phone all get the right layout without the caller doing anything.

## General guidelines

### Do

- Use `RichPagination` as the standard footer for a paginated table or list.
- Omit `onPageSizeChange` when the page size is fixed; the selector then doesn't render.
- Keep `page` and `pageSize` in the URL, so a paginated view can be linked and refreshed.
- Pass a `total` that is the real count across all pages — the range summary is only as honest as it is.

### Don't

- Don't hand it translated strings; it localizes its own text through `ui.pagination`.
- Don't add your own media queries around it; it collapses on its own container width.
- Don't use it when you only need the page buttons. Use `Pagination`.

## Features

- #### Full footer

  ```tsx
  import { RichPagination } from "@cloud/ui";

  <RichPagination
    page={page}
    pageCount={Math.ceil(total / pageSize)}
    total={total}
    pageSize={pageSize}
    onPageChange={setPage}
    onPageSizeChange={setPageSize}
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

  Below the bar's own `@lg` container width, the selector and numbered pager collapse into a compact `‹ Page X of Y ›` cluster.

### States

- **Wide** — page-size selector and range summary on the left, numbered pager on the right.
- **Narrow** — collapsed to the compact prev / page-of / next cluster.
- **At the bounds** — previous and next are disabled on the first and last page.

## Writing guidelines

`RichPagination` renders no caller-supplied text. Its copy comes from the `ui.pagination` message namespace; override it there, in your locale files, not at the call site.

## Accessibility guidelines

### General accessibility guidelines

- The page buttons, arrows, and the rows-per-page select are real controls, reachable by Tab.
- The arrow buttons carry localized accessible names from the `ui.pagination` namespace.
- The range summary tells a screen-reader user where they are in the list; don't remove it in favour of the page number alone.

### Component-specific guidelines

- Changing the page size changes what page 1 contains. Reset `page` to 1 in `onPageSizeChange`, or the user lands on a page that no longer exists.

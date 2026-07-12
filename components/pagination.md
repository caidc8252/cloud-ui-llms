# Pagination

Page-number navigation for a paginated list or table.

`Pagination` is a client component driven by props. Import it, and the `PaginationProps` type, from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Pagination` is the bare pager: previous, the page numbers, next. It is fully controlled — `page` is 1-based, `pageCount` is the total, and `onChange` receives the new page number. It renders a `<nav aria-label="Pagination">` wrapping plain buttons; first and last page are always shown, and the gap collapses into an ellipsis.

`siblingCount` (default `1`) sets how many page buttons show on each side of the current page; the rest collapse into ellipses. `showFirstLast` (default `false`) adds the « and » jump buttons flanking previous and next — turn it on when `pageCount` is large enough that walking there one page at a time is painful.

The arrow buttons are icon-only, so their accessible names come from props: `firstLabel`, `prevLabel`, `nextLabel`, and `lastLabel`. They default to the English `First page`, `Previous page`, `Next page`, and `Last page` — **pass translated strings**, or a non-English user hears English.

**A result region's footer is `RichPagination`, not this.** `RichPagination` wraps this pager with a rows-per-page selector and a "showing X–Y of Z" summary, localizes its own text, and collapses responsively — it is the default footer under a `Table`, inside the results `Card`. Reach for bare `Pagination` only when you genuinely need nothing but the page buttons, somewhere that isn't a table footer.

## General guidelines

### Do

- Pass translated `prevLabel`, `nextLabel`, and — when shown — `firstLabel` and `lastLabel`.
- Turn on `showFirstLast` when there are many pages.
- Keep `page` in the URL, so a paginated view can be linked and refreshed.

### Don't

- Don't use bare `Pagination` for a table or list footer; `RichPagination` is the default there, and gives you the range summary and page-size selector for free.
- Don't leave the icon-only buttons with their default English labels in a localized app.
- Don't paginate a list short enough to show at once.

## Features

- #### Page navigation

  ```tsx
  import { Pagination } from "@cloud/ui";

  <Pagination
    page={page}
    pageCount={pageCount}
    onChange={setPage}
    prevLabel={t("pagination.prev")}
    nextLabel={t("pagination.next")}
  />;
  ```

- #### Siblings

  `siblingCount` (default `1`) is how many page buttons flank the current page. The gap collapses into an ellipsis.

- #### First and last

  `showFirstLast` adds « and » jump buttons.

  ```tsx
  <Pagination
    page={page}
    pageCount={120}
    onChange={setPage}
    showFirstLast
    firstLabel={t("pagination.first")}
    lastLabel={t("pagination.last")}
    prevLabel={t("pagination.prev")}
    nextLabel={t("pagination.next")}
  />
  ```

### States

- **Current** — the active page button is filled.
- **At the bounds** — previous and first are disabled on page 1; next and last are disabled on the final page.

## Writing guidelines

### General writing guidelines

- Use sentence case.
- Never hardcode user-facing strings.

### Component-specific guidelines

- The button labels are accessible names, not visible text — write them as what the button does: `Next page`, not `Next`.

## Accessibility guidelines

### General accessibility guidelines

- The page numbers and arrows are real buttons, reachable by Tab and activated with Enter or Space.
- The arrow buttons are icon-only and get their accessible names from `firstLabel` / `prevLabel` / `nextLabel` / `lastLabel`. Translate them.
- The current page is not conveyed by its fill alone; it carries `aria-current="page"` and is announced as the current item.
- The collapsed ellipsis is `aria-hidden` and is not announced, so nothing is lost to a screen-reader user.

### Component-specific guidelines

- The wrapping `<nav>` has a fixed English `aria-label` of `Pagination`, and there is no prop to change it. In a fully localized app, note the gap — the four button labels are the ones you can and must translate.
- Disable the bound buttons rather than hiding them, so the pager doesn't reflow and shift the focus target as the user pages.

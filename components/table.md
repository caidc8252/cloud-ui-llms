# Table

Typed data table driven by a columns config. No hand-written `thead` / `tbody`.

`Table` is a generic component: `Table<R>` takes your row type. The package exports the `TableColumn`, `TableProps`, and `SortDir` types alongside it. Import them from `@cloud/ui` or `@cloud/ui/components/ui`. (`TableDensity` and `TableRowState` are not re-exported — write `density="compact"` and return a plain `{ selected, disabled, expanded }` object instead of naming those types.)

## Development guidelines

`Table` renders itself from a `columns` config and a `rows` array. You never write table markup.

Each `TableColumn<R>` is `{ key, title }` plus:

- `render(row)` — the cell node. It **takes priority over `field`** when both are given.
- `field` — a simple `keyof R` accessor, used only when there is no `render`.
- `sortable`, `width`, `align` — the usual.
- `numeric` — right-aligns the header and cell (unless `align` overrides it) and renders the body cell in `tabular-nums`, so digits line up column-wise. Use it for every money and count column.

`rowKey(row, index)` is **required**, so React can identify rows across re-renders.

Sorting is controlled: pass `sort` as `{ key, dir }` and handle `onSortChange`. Clicking a sortable header cycles **unsorted → asc → desc → unsorted**, and that third click reports `null`. Treat `null` as "restore the natural order" — don't ignore it, or the header sticks on `desc` and the user can never get back.

`sortable` on its own does nothing: a column marked `sortable` with no `onSortChange` on the table renders as plain header text, not as a control. Sorting is opt-in on both ends, so marking columns while forgetting the handler can't leave a clickable-looking header that never sorts.

`density` is `compact`, `comfortable` (default), or `spacious` — compact for ops and data-dense screens, spacious for reports. `striped`, `bordered`, and `stickyFirstColumn` are the other visual variants. `rowState(row, index)` returns `{ selected, disabled, expanded }` for per-row treatment; a selected row gets a left accent bar, and a `disabled` row is dimmed, inert, and does not fire `onRowClick`.

**Row navigation is whole-row click plus a passive chevron, and the chevron is not yours to write.** Pass `onRowClick` and `Table` **automatically appends** a right-aligned trailing column holding a decorative `ChevronRight` — the whole row is the click target, and there are no inline buttons. Never hand-write that trailing actions column; you will get two chevrons. `rowNav={false}` suppresses the appended chevron for the case where the row click is a selection toggle rather than navigation.

**The row tail is one cell, not two.** When a navigable row also needs inline verbs, pass `rowActions={(row, index) => …}`: the verbs and the chevron **coexist in the single trailing cell — verbs first, chevron last**. It is not a choice between them. Use `size="sm"` buttons for the verbs; `Table` already wraps them so their clicks `stopPropagation` and don't fire the row's `onRowClick`. Pass `rowActions` without `onRowClick` and you get the verbs alone, no chevron.

`stickyHeader` docks the header to the **page** scroll root rather than the wrapper. That comes with a real trade-off: it drops the wrapper's own horizontal scrollbar (an `overflow-x: auto` would clip the sticky header), so a wide table overflows the page instead. Leave it off for wide tables. The host `Card` must also use `overflow-clip` — its default `overflow-hidden` traps the sticky. When a sticky bar sits above the table, set `stickyHeaderTop` to that bar's height (for example `LIST_SUMMARY_BAR_HEIGHT`, which is `48`) so the header tiles flush beneath it.

The standard result region is `Card overflow-clip` > `ListSummaryBar` > `Table stickyHeader stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}` > `RichPagination`. Numbered pagination is the default footer for a table; scroll loading is not.

For thousands of rows, use `VirtualTable`, which shares this columns/sort/rowKey contract — but not `density`, `rowState`, `rowNav`, or `rowActions`.

## General guidelines

### Do

- Mark money and count columns `numeric` so the digits align.
- Handle a `null` from `onSortChange` as "clear the sort".
- Use `density="compact"` on ops screens and `spacious` on reports.
- Give the table an `empty` node that says what's missing and what to do.
- Navigate a row with `onRowClick` alone and let `Table` append the chevron.
- Put inline row verbs in `rowActions` with `size="sm"`, so they share the one trailing cell with the chevron.
- Set `rowNav={false}` when the row click selects rather than navigates.
- Follow the table with a `RichPagination` inside the same `Card`.

### Don't

- Don't pass both `render` and `field` expecting `field` to win — `render` takes priority.
- Don't hand-write a trailing actions or chevron column. `onRowClick` already appends one; a hand-written one duplicates it.
- Don't make row verbs an alternative to the chevron — with `rowActions` **and** `onRowClick` they coexist, verbs first, chevron last.
- Don't add your own `stopPropagation` around `rowActions` verbs; the component already does it.
- Don't turn on `stickyHeader` for a wide table; you lose the horizontal scrollbar.
- Don't render thousands of rows here. Use `VirtualTable`.

## Features

- #### Columns and rows

  ```tsx
  import { Table, type TableColumn } from "@cloud/ui";

  const columns: TableColumn<Merchant>[] = [
    { key: "name", title: "Name", field: "name", sortable: true },
    { key: "mid", title: "MID", field: "mid" },
    {
      key: "volume",
      title: "Volume",
      numeric: true,
      render: (row) => formatCurrency(row.volume),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => <Badge tone={toneOf(row.status)}>{row.status}</Badge>,
    },
  ];

  // No trailing actions column here on purpose — onRowClick appends the chevron.
  <Table
    columns={columns}
    rows={merchants}
    rowKey={(row) => row.id}
    sort={sort}
    onSortChange={setSort}
    onRowClick={(row) => router.push(`/merchants/${row.id}`)}
    empty={<Empty title={t("merchants.empty")} />}
  />;
  ```

- #### Sorting

  `sort` is `{ key, dir }` with `dir` as `asc` or `desc`. The header cycles through unsorted, ascending, descending, and back — the last step gives `onSortChange` a `null`.

  ```tsx
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  <Table
    columns={columns}
    rows={rows}
    rowKey={(r) => r.id}
    sort={sort ?? undefined}
    onSortChange={setSort}
  />;
  ```

- #### Row navigation (the automatic chevron)

  `onRowClick` makes the whole row the click target and appends a right-aligned column with a passive `ChevronRight`. You write no column for it. `rowNav={false}` drops the chevron when the click is a selection toggle rather than navigation.

  ```tsx
  <Table
    columns={columns}
    rows={rows}
    rowKey={(r) => r.id}
    onRowClick={(row) => navigate(`/products/${row.id}`)}
  />

  // Selection, not navigation — no chevron.
  <Table
    columns={columns}
    rows={rows}
    rowKey={(r) => r.id}
    rowNav={false}
    onRowClick={(row) => toggle(row.id)}
    rowState={(row) => ({ selected: selectedIds.has(row.id) })}
  />
  ```

- #### Row actions (verbs and chevron in one tail)

  `rowActions` renders inline verbs in the **same** trailing cell as the chevron — verbs first, chevron last. Their clicks are already stopped from propagating to `onRowClick`.

  ```tsx
  <Table
    columns={columns}
    rows={rows}
    rowKey={(r) => r.id}
    onRowClick={(row) => navigate(`/products/${row.id}`)}
    rowActions={(row) => (
      <>
        <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
          {t("actions.edit")}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onArchive(row)}>
          {t("actions.archive")}
        </Button>
      </>
    )}
  />
  ```

  Drop `onRowClick` and the same call renders the verbs with no chevron.

- #### Density and variants

  `density` is `compact` / `comfortable` / `spacious`. `striped` zebra-stripes even rows, `bordered` adds an outer border and column separators, and `stickyFirstColumn` pins the first column during horizontal scroll.

- #### Row state

  `rowState` returns `{ selected, disabled, expanded }` per row. A selected row takes a left accent bar.

  ```tsx
  <Table
    columns={columns}
    rows={rows}
    rowKey={(r) => r.id}
    rowState={(row) => ({ selected: selectedIds.has(row.id) })}
  />
  ```

- #### Sticky header

  `stickyHeader` docks the header to the page scroll root; `stickyHeaderTop` offsets it below any sticky bar above the table. The host `Card` must use `overflow-clip`.

  ```tsx
  <Card elevation={1} className="overflow-clip">
    <ListSummaryBar total={filtered.length} label={t("products.count")} />
    <Table
      columns={columns}
      rows={rows}
      rowKey={(p) => p.id}
      onRowClick={(p) => navigate(`/products/${p.id}`)}
      stickyHeader
      stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}
    />
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
    />
  </Card>
  ```

### States

- **Empty** — the `empty` node, defaulting to `No data`.
- **Sorted** — the active header shows its direction.
- **Row: selected / disabled / expanded** — driven by `rowState`. A disabled row is dimmed, inert, and won't fire `onRowClick`.
- **Navigable rows** — `onRowClick` gives the rows a pointer cursor and appends the passive trailing chevron.

## Writing guidelines

### General writing guidelines

- Use sentence case for column titles, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Column titles: name the value, not its type — `Volume`, not `Volume (number)`. Put the unit in the header when every cell shares one — `Volume (USD)`.
- Empty state: say why the table is empty and what to do next. `No data` tells the user nothing.

## Accessibility guidelines

### General accessibility guidelines

- The component renders a real `<table>` with header cells, so the row and column structure is conveyed.
- A sortable header is a real button and announces its sort direction.
- Don't rely on the row's accent bar alone to convey selection; the row's checkbox or control carries the state.

### Component-specific guidelines

- `onRowClick` makes a row _look_ clickable but does not make it a button, and the chevron it appends is **decorative** — not a focusable control. So the row itself is not keyboard-reachable. When the row navigates somewhere, also put a real link in a content cell (the name, typically), so keyboard and screen-reader users have a way in. Don't answer this by hand-writing a button into the trailing cell; that column belongs to `Table`.
- `rowActions` verbs are real buttons and are reachable by Tab. Give an icon-only verb an accessible name.

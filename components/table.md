# Table

Typed data table driven by a columns config. No hand-written `thead` / `tbody`.

`Table` is a generic component: `Table<R>` takes your row type. It exports the `TableColumn`, `TableProps`, `TableRowState`, `TableDensity`, and `SortDir` types alongside it. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Table` renders itself from a `columns` config and a `rows` array. You never write table markup.

Each `TableColumn<R>` is `{ key, title }` plus:

- `render(row)` — the cell node. It **takes priority over `field`** when both are given.
- `field` — a simple `keyof R` accessor, used only when there is no `render`.
- `sortable`, `width`, `align` — the usual.
- `numeric` — right-aligns the header and cell (unless `align` overrides it) and renders the body cell in `tabular-nums`, so digits line up column-wise. Use it for every money and count column.

`rowKey(row, index)` is **required**, so React can identify rows across re-renders.

Sorting is controlled: pass `sort` as `{ key, dir }` and handle `onSortChange`. Clicking a sortable header cycles **unsorted → asc → desc → unsorted**, and that third click reports `null`. Treat `null` as "restore the natural order" — don't ignore it, or the header sticks on `desc` and the user can never get back.

`density` is `compact`, `comfortable` (default), or `spacious` — compact for ops and data-dense screens, spacious for reports. `striped`, `bordered`, and `stickyFirstColumn` are the other visual variants. `rowState(row, index)` returns `{ selected, disabled, expanded }` for per-row treatment; a selected row gets a left accent bar.

`stickyHeader` docks the header to the **page** scroll root rather than the wrapper. That comes with a real trade-off: it drops the wrapper's own horizontal scrollbar (an `overflow-x: auto` would clip the sticky header), so a wide table overflows the page instead. Leave it off for wide tables. The host `Card` must also use `overflow-clip` — its default `overflow-hidden` traps the sticky. When a sticky bar sits above the table, set `stickyHeaderTop` to that bar's height (for example `LIST_SUMMARY_BAR_HEIGHT`) so the header tiles flush beneath it.

For thousands of rows, use `VirtualTable`, which shares this columns/sort/rowKey contract.

## General guidelines

### Do

- Mark money and count columns `numeric` so the digits align.
- Handle a `null` from `onSortChange` as "clear the sort".
- Use `density="compact"` on ops screens and `spacious` on reports.
- Give the table an `empty` node that says what's missing and what to do.

### Don't

- Don't pass both `render` and `field` expecting `field` to win — `render` takes priority.
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

  `stickyHeader` docks the header to the page scroll root; `stickyHeaderTop` offsets it below any sticky bar above the table.

### States

- **Empty** — the `empty` node, defaulting to `No data`.
- **Sorted** — the active header shows its direction.
- **Row: selected / disabled / expanded** — driven by `rowState`.
- **Clickable rows** — `onRowClick` gives the rows a pointer cursor.

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

- `onRowClick` makes a row _look_ clickable but does not make it a button. When the row navigates somewhere, also put a real link in a cell, so keyboard and screen-reader users have a way in.

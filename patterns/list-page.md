# List page

A collection of resources in a tabular format, with a filter band above it and pagination below. The default view for any resource-management module.

[Style template](../examples/list-page.tsx) | [Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### Default

The page is three stacked regions: a `PageHeader` band carrying the title and the single create action, a condition band carrying the filters, and a results `Card` holding the count bar, the table, and the pager. Nothing else belongs at this level.

### The sticky model

This is the part most implementations get wrong. The condition band **scrolls away** — it is `sticky={false}` by default and it should stay that way. What stays docked to the top of the scroll root is the summary bar plus the table's own column header. The table is told where to dock with `stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}`, which is why that constant is exported rather than being an internal detail: the two numbers must agree or the header will overlap the bar.

The results `Card` must run `overflow-clip` (or `overflow-visible`), not `overflow-hidden`, or it traps the sticky children and nothing docks at all.

### Draft state versus applied state

Filters are a two-phase state machine, owned by `useListFilters`. Typing in the search box mutates `draft`; pressing Search calls `apply()`, which promotes `draft` to `applied` and fires `onApply`. The chips row and the result count read `applied`, never `draft`. This is what makes the page feel deliberate rather than twitchy, and it is what lets the request fire once instead of on every keystroke.

### Completeness-dependent computation is server-side

Any result that is only correct when computed against the **whole** collection — search, filter, sort, pagination, total count, uniqueness — MUST execute on the server. Applied filters and the page number map to the list API's query parameters; the pager reads the server's total. Never filter or slice a fetched page on the client: it silently produces a wrong count and a wrong page 2.

### Empty versus no match

The table's `empty` slot has to distinguish two situations. No data at all is a first-run state and should offer the create action. No rows _after filtering_ is a zero-results state and should offer to clear the filters. Same slot, different copy, different action. See [Empty states](empty-states.md).

## Building blocks

#### A. Page header

`PageHeader` from `@cloud/ui/components/layout` — title, description, and the `actions` slot. The single `variant="primary"` CTA of the screen lives here, normally _Create <resource>_.

#### B. Condition band

`ListConditionBand` with two slots. The toolbar slot holds `SearchInput`, any quick `Select` filters, and the Search button (`variant="secondary"`). The chips slot holds `AppliedFilters` wrapping one `FilterChip` per applied filter.

#### C. Filter state

`useListFilters({ initial, onApply })` supplies `draft`, `setDraft`, `apply`, `applied`, `clearField`, and `clearAll`. The page provides only the field shape and the fetch; the hook owns the state machine.

#### D. Results container

`Card elevation={1}` with `overflow-clip`. It wraps the count bar, the table, and the pager as one surface.

#### E. Summary bar

`ListSummaryBar` — the result count (`tabular-nums`, `text-xs font-semibold`) plus the tool actions. Its `label` appends _matching filters_ when filters are applied. Every action here is `ghost` (see [Action weight](action-weight.md)).

#### F. Table

A typed `Table<R>` driven by a `TableColumn<R>[]` config. Never hand-write `thead` / `tbody`. Set `stickyHeader` with `stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}`.

#### G. Pagination

`RichPagination` — page, page count, total, page size. Never hand-roll the page/size/range controls.

#### H. Empty state

The `Empty` component, passed to the table's `empty` prop.

## General guidelines

### Do

- Use the shared list-filter family. The page supplies fields and predicates; the family owns the band, the chip row, the deferred apply, and the three-state trigger.
- Send every filter, sort, and page to the server, and read the total from the server's pager.
- Set `numeric: true` on numeric, ID, and date columns and then write no classes — `Table` right-aligns the header and the body and applies `tabular-nums` for you.
- Render an empty cell as `—`, not as blank.
- Give the whole row to `onRowClick` when the row is navigational, and put a passive `ChevronRight` in a trailing right-aligned column as the affordance.
- Keep row action buttons to `ghost` or `ghost-danger` only.
- Use a two-line text column for a name plus a subtitle: `text-sm font-medium` over `text-2xs text-content-tertiary`, with `min-w-0` on the wrapper.

### Don't

- Don't make the condition band sticky. It is meant to scroll away; the summary bar and the column header are what dock.
- Don't put `overflow-hidden` on the results card. It traps the sticky header and the bar.
- Don't filter, sort, or count a fetched page on the client.
- Don't put a `secondary` or `primary` button in the summary bar. It draws a box inside a box and competes with the count.
- Don't fire the request on every keystroke. Search commits on `apply()`.
- Don't let an inline row action trigger the row's navigation.

## Writing guidelines

### General writing guidelines

- Use sentence case, and keep proper nouns and brand names capitalized in context.
- Use present-tense verbs and active voice.
- Avoid device-specific language such as "click". Prefer "choose" or "select".

### Component-specific guidelines

#### Page title

- Use the plural noun for the collection: _Users_, _Roles_, _Contracts_.

#### Result count

- Show the count with the noun: _128 users_. When filters are applied, the label appends _matching filters_.
- Don't show a selected count when nothing is selected.

#### Column headers

- Use a short noun phrase in sentence case. No end punctuation.

#### Empty state copy

- No data: name what would be there and how to make one. _No users yet. Invite a user to get started._
- No match: name the filter as the cause, not the data. _No users match these filters._

## Accessibility guidelines

### General accessibility guidelines

- Every action must be reachable by keyboard, in the reading order of the page.
- Never remove the focus ring.

### Component-specific guidelines

- A row that navigates on click needs a real focusable target inside it. `onRowClick` alone is a mouse-only affordance.
- Icon-only actions in the action column need an `aria-label`, and the label must be unique per row (_Delete Admin role_, not _Delete_).
- The sticky column header must not hide the first row when a keyboard user tabs into the table; that is what the `stickyHeaderTop` offset exists to guarantee.

## Related patterns and components

- [Advanced filtering](advanced-filtering.md) — the sheet-based filter for more fields than a quick bar can hold.
- [Detail page](detail-page.md) — where a row click lands.
- [Action weight](action-weight.md) — why the same Export button is `secondary` in the header and `ghost` in the summary bar.
- [Empty states](empty-states.md), [Interactive surfaces](interactive-surfaces.md), [Permission gating](permission-gating.md).
- Components: `Table`, `VirtualTable`, `RichPagination`, `ListSummaryBar`, `ListConditionBand`, `SearchInput`, `AppliedFilters`, `FilterChip`, `Empty`, `PageHeader`, `PageBody`.

# List page

A collection of resources in a tabular format, with a filter band above it and pagination below. The default view for any resource-management module.

[Style template](../demos/list-page.md) | Binding rules (app repo: `.claude/team-rule/coding-rules/ui_ui-and-pages.md`)

## Key UX concepts

### Default

The page is three stacked regions: a `PageHeader` band carrying the title and the single create action, a condition band carrying the filters, and a results `Card` holding the count bar, the table, and the pager. Nothing else belongs at this level.

A list is a level-1 page, and level-1 is the **only** tier that takes `PageHeader`. Every page a row leads to — the detail, the create form, a sub-page — is level-2 or deeper and takes `PageHeaderBand`, which carries a built-in back button. `ContentHeader` is never a page header on its own; it is the title block the header components compose internally, or a section heading inside `PageBody`.

### The sticky model

This is the part most implementations get wrong. The page's one scroll root is `PageBody`; the `PageHeader` band is its non-scrolling sibling above it, so the band stays in view for free and takes no `sticky` of its own. Everything below it scrolls inside `PageBody`, and that is what the page's sticky children dock to.

The condition band **scrolls away** — it is `sticky={false}` by default and it should stay that way. What stays docked at the top of `PageBody`, flush under the header band, is the summary bar plus the table's own column header. The table is told where to dock with `stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}`, which is why that constant is exported rather than being an internal detail: the two numbers must agree or the header will overlap the bar.

The results `Card` must run `overflow-clip` (or `overflow-visible`), not `overflow-hidden`, or the card is itself a scroll container: it traps the sticky children and nothing docks to `PageBody` at all.

### Draft state versus applied state

Filters are a two-phase state machine, owned by `useListFilters`. Typing in the search box mutates `draft`; pressing Search calls `apply()`, which promotes `draft` to `applied` and fires `onApply`. The chips row and the result count read `applied`, never `draft`. This is what makes the page feel deliberate rather than twitchy, and it is what lets the request fire once instead of on every keystroke.

This interaction is mandatory, not a suggestion: a list page's retrieval is the list-filter family plus `useListFilters`. A hand-rolled flex row of bare `Select`s that filters on change is not a lighter version of this — it is a different, wrong page.

### Completeness-dependent computation is server-side

Any result that is only correct when computed against the **whole** collection — search, filter, sort, pagination, total count, uniqueness — MUST execute on the server. Applied filters and the page number map to the list API's query parameters; the pager reads the server's total. Never filter or slice a fetched page on the client: it silently produces a wrong count and a wrong page 2.

### Empty versus no match

The table's `empty` slot has to distinguish two situations. No data at all is a first-run state and should offer the create action. No rows _after filtering_ is a zero-results state and should offer to clear the filters. Same slot, different copy, different action. See [Empty states](empty-states.md).

## Building blocks

#### A. Page header

`PageHeader` from `@cloud/ui/components/layout` — `title`, `description`, and `actions`. `actions` is not a node slot: it takes `HeaderAction[]` descriptors — `{label, icon, to?/onClick?, variant?, disabled?}`. `icon` is **required**, and there is no `size` field, so the header's md buttons are locked at compile time. The single `variant="primary"` CTA of the screen lives here, normally _Create <resource>_.

#### B. Condition band

`ListConditionBand` with two slots. The toolbar slot holds `SearchInput`, any quick `Select` filters, and the Search button. The chips slot holds `AppliedFilters` wrapping one `FilterChip` per applied filter.

The Search button has one form, and it is not a free choice:

`<Button variant="secondary" iconLeft={<Search className="size-4" />} onClick={filters.apply}>Search</Button>`

The icon is part of it. The magnifier inside `SearchInput` is a prefix mark on a field; this one is the commit action, and the page needs both.

Every quick `Select` needs an `items` map (value → label) on its **root**, or the trigger prints the raw value and the user reads `cat-mpos` instead of _Payment terminals_. Nothing type-checks this. Widths belong to the field, never to the current value: the band bounds its filters with a floor and a ceiling, and a filter whose options vary a lot takes an explicit `w-*` sized to the longest one — never a `min-w-*`, which collides with the band's floor and loses.

#### C. Filter state

`useListFilters({ initial, onApply })` supplies `draft`, `setDraft`, `apply`, `applied`, `clearField`, `clearAll`, `reset`, `countActive`, and `hasApplied`. The page provides only the field shape and the fetch; the hook owns the state machine. **Full signature and semantics: [useListFilters](../components/use-list-filters.md)** — read it before wiring the band. Two things it is easy to get wrong from the member list alone: `setDraft` is `(key, value)`, one field at a time, not a patch object; and `initial` is the unfiltered baseline that everything else is measured against, captured on the first render and never re-read.

#### D. Results container

`Card elevation={1}` with `overflow-clip`. It wraps the count bar, the table, and the pager as one surface.

#### E. Summary bar

`ListSummaryBar` — the result count (`tabular-nums`, `text-xs font-semibold`) plus the tool actions. Its `label` appends _matching filters_ when filters are applied. Every action here is `ghost` (see [Action weight](action-weight.md)).

#### F. Table

A typed `Table<R>` driven by a `TableColumn<R>[]` config. Never hand-write `thead` / `tbody`. Set `stickyHeader` with `stickyHeaderTop={LIST_SUMMARY_BAR_HEIGHT}`.

Row navigation is `onRowClick`, and setting it is the whole job: `Table` **appends the trailing passive-chevron cell itself**. Do not write that column into your `columns` config — you will get two. `rowNav={false}` suppresses it when the row click is a selection toggle rather than navigation.

Inline row verbs go through `rowActions={(row) => …}`. They **coexist** with the chevron in one trailing cell — verbs first at `size="sm"`, chevron last — and the component stops their propagation for you, so a verb click does not also navigate the row. Without `onRowClick`, the cell shows the verbs alone.

#### G. Pagination

`RichPagination` — `page`, `pageCount`, `onPageChange`, `total`, `pageSize`, `onPageSizeChange`. This is the **default** footer of a results region, not one of two equal options. Never hand-roll the page/size/range controls.

Hold `page` and `pageSize` as state, derive `pageCount = ceil(total / pageSize)`, reset to page 1 whenever a filter or the page size changes, and clamp with `safePage = min(page, pageCount)` so a shrinking result set cannot strand the user on an empty page.

Scroll-loading (`LoadMore`, `VirtualTable`'s `onReachEnd`) is the exception. Reach for it only when one of these holds, and name which one in a comment: a feed-like stream with no _page N_ semantics; an unknown or unbounded total; data that appends at the tail in real time; a cursor-only backend where offset paging is too expensive; or a touch-first, narrow-container surface. An ordinary back-office collection is none of those.

#### H. Empty state

The `Empty` component, passed to the table's `empty` prop.

## General guidelines

### Do

- Use the shared list-filter family. The page supplies fields and predicates; the family owns the band, the chip row, the deferred apply, and the three-state trigger.
- Send every filter, sort, and page to the server, and read the total from the server's pager.
- Give every quick `Select` an `items` map on its root, and a width sized to its longest option when the options vary.
- Set `numeric: true` on numeric, ID, and date columns and then write no classes — `Table` right-aligns the header and the body and applies `tabular-nums` for you.
- Render an empty cell as `—`, not as blank.
- Give the whole row to `onRowClick` when the row is navigational, and let `Table` append the trailing chevron. That is the affordance; you do not build it.
- Put inline row verbs in `rowActions` at `size="sm"`, and keep them to `ghost` or `ghost-danger`.
- Use a two-line text column for a name plus a subtitle: `text-md font-medium` over `text-xs text-content-tertiary`, with `min-w-0` on the wrapper.

### Don't

- Don't make the condition band sticky. It is meant to scroll away; the summary bar and the column header are what dock.
- Don't put `overflow-hidden` on the results card. It makes the card a scroll container, which traps the sticky header and the bar.
- Don't filter, sort, or count a fetched page on the client.
- Don't put a `secondary` or `primary` button in the summary bar. It draws a box inside a box and competes with the count.
- Don't fire the request on every keystroke. Search commits on `apply()`.
- Don't hand-write the trailing chevron column. `Table` appends it whenever `onRowClick` is set, and a hand-written one lands beside it.
- Don't make row verbs and the chevron an either/or. They share one trailing cell — verbs first, chevron last.
- Don't build a filter row out of a bare flex container and unwrapped `Select`s.
- Don't reach for scroll-loading because it feels modern. `RichPagination` is the default; the exception needs a reason.

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

- A row that navigates on click needs a real focusable target inside it. `onRowClick` alone is a mouse-only affordance, and the appended chevron is passive decoration, not a button.
- Icon-only verbs in `rowActions` need an `aria-label`, and the label must be unique per row (_Delete Admin role_, not _Delete_).
- The sticky column header must not hide the first row when a keyboard user tabs into the table; that is what the `stickyHeaderTop` offset exists to guarantee.

## Related patterns and components

- [Advanced filtering](advanced-filtering.md) — the sheet-based filter for more fields than a quick bar can hold.
- [Detail page](detail-page.md) — where a row click lands.
- [Action weight](action-weight.md) — why the same Export button is `secondary` in the header and `ghost` in the summary bar.
- [Empty states](empty-states.md), [Interactive surfaces](interactive-surfaces.md), [Permission gating](permission-gating.md).
- Components: `Table`, `VirtualTable`, `RichPagination`, `ListSummaryBar`, `ListConditionBand`, `SearchInput`, `AppliedFilters`, `FilterChip`, `Empty`, `PageHeader`, `PageBody`.

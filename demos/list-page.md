# List page demo

A collection of resources in a table, with quick filters above the results and pagination below. Use this demo as the default starting point for resource-management pages.

[View pattern](../patterns/list-page.md)

## On this page

1. Key UX concepts
2. Building blocks
3. General guidelines
4. Writing guidelines
5. Accessibility guidelines
6. Related patterns

## Key UX concepts

### Default

The page has three regions: a header with the primary create action, a filter band, and a results card. The results card contains the count, table, empty state, and pagination.

### Deferred filters

Search and quick filters update draft state first. They affect the request and the result count only after the user chooses Search. Applied filters remain visible as removable chips.

### Sticky results context

The filter band scrolls with the page. The result summary and table header stay available at the top of the scroll region, so users retain the result context while reading a long list.

### Empty and zero-results states

No resources and no matching resources are different states. The former guides the user to create a resource; the latter gives the user a way to clear or change the filters.

## Building blocks

#### A. Page header

Use `PageHeader` in an application page for the plural resource name, a concise description, and the only primary page action. A list is a level-1 page, and level-1 is the only tier that uses `PageHeader`; every page it drills into uses `PageHeaderBand`. Pass actions as `HeaderAction` descriptors — `{label, icon, to or onClick, variant}` — where the icon is required and the size is fixed at `md`.

#### B. Condition band

Use `ListConditionBand` to group `SearchInput`, quick `Select` filters, and the secondary Search action. Give the Search action a leading `Search` icon and wire it to the filter hook's `apply`. Give every `Select` an `items` map of value to label on its root, or the trigger shows the raw value. Keep this band non-sticky.

#### C. Applied filters

Use `AppliedFilters` and `FilterChip` to show the query that actually produced the current results. Removing a chip clears the corresponding applied condition.

#### D. Results card

Use one `Card` with `overflow-clip` around the summary, table, and pager so they read as one collection surface without trapping sticky content.

#### E. Result summary

Use `ListSummaryBar` for the result count and low-emphasis collection actions such as export. Its height defines the table header's sticky offset.

#### F. Table and pagination

Use a typed `Table` with `stickyHeader` and `RichPagination`. The page supplies columns and server results; the components provide the shared presentation and interaction model.

Set `onRowClick` for a navigable row and `Table` appends the trailing chevron itself — do not add that column to the config. Inline row verbs go in `rowActions`, at `size="sm"`, sharing the trailing cell with the chevron. `RichPagination` is the default footer for a results region; scroll-loading is an exception that needs a stated reason.

## General guidelines

### Do

- Use this shape for structured resources that users need to scan, compare, and act on.
- Keep filtering, sorting, pagination, and total counts on the server.
- Keep the header action primary and summary-bar actions ghost-weight.
- Use a distinct empty state for an unpopulated collection and a zero-results state for active filters.

### Don't

- Don't filter or count only the currently fetched page in the browser.
- Don't make the condition band sticky or use `overflow-hidden` on the results card.
- Don't add competing primary actions to the result summary.
- Don't hand-write the row's trailing chevron column, and don't treat row verbs and the chevron as an either/or.
- Don't assemble the filter bar out of bare controls. The list-filter family and `useListFilters` own that interaction.
- Don't make a row navigational without a keyboard-reachable link or control.

## Writing guidelines

### General writing guidelines

- Use sentence case, active voice, and present-tense verbs.
- Use full sentences and end punctuation in explanatory copy, but not in headers or button labels.
- Use device-independent verbs such as choose, select, and enter.

### Component-specific guidelines

#### Page title

Use the plural resource noun, such as `Users`, `Roles`, or `Contracts`.

#### Filter labels

Use the field name and selected value in an applied chip, such as `Contract: ISO`.

#### Empty-state copy

Name the state and its recovery action. For example, use `No users yet` with `Create user`, or `No users match these filters` with `Clear filters`.

## Accessibility guidelines

### General accessibility guidelines

- Keep every action available by keyboard in reading order.
- Preserve the visible focus indicator and do not rely on color alone for status.
- Use real table semantics and clear labels for controls.

### Component-specific guidelines

#### Table rows

Give navigational rows a focusable destination and label row-level icon actions with the resource name.

#### Sticky header

Set the sticky header offset to the summary-bar height so focused cells are not obscured while users navigate with a keyboard.

## Related patterns

- [Advanced filtering](../patterns/advanced-filtering.md)
- [Empty states](../patterns/empty-states.md)
- [Interactive surfaces](../patterns/interactive-surfaces.md)
- [Permission gating](../patterns/permission-gating.md)

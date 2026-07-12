# Advanced filtering

A right-side sheet holding the filters that don't fit in the quick bar, with a deferred apply and a chip row that reflects what is actually in effect.

[Style template](../demos/advanced-filter-list.md) | [Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### When the quick bar is not enough

The quick bar holds search plus one or two high-traffic selects. Once a resource has more filterable properties than that — a category, a reference code, a date window, a status set — they move into the sheet. The quick bar stays; the sheet is an extension of it, not a replacement.

### Deferred apply

The sheet edits `draft`. Nothing happens to the list while the sheet is open. Applying promotes `draft` to `applied` in one move, fires the fetch once, and closes the sheet. This is the same state machine the quick bar uses (`useListFilters`), which is why a search term typed in the bar and a category picked in the sheet commit together rather than racing each other.

### The trigger carries the state

`AdvancedFilterButton` has three states: at rest it is a plain button; with active advanced filters it shows a count badge; the count is the number of _applied_ advanced fields, not draft ones. The page computes that count — the component does not guess which of your fields are advanced — but it does not count by hand: `useListFilters` supplies `countActive(keys, source?)`, which compares each key against its initial value and defaults to the applied set. Declare an `ADVANCED_KEYS` tuple and pass it in.

### Chips are the source of truth for the user

Whatever is in effect appears as a `FilterChip` in `AppliedFilters`, whether it was set in the bar or in the sheet. A user must never have to open the sheet to find out what is filtering the list. Each chip removes exactly its own field; _Clear all_ removes everything, bar and sheet alike.

## Building blocks

#### A. Quick bar

`ListConditionBand`'s toolbar slot, unchanged from the [list page](list-page.md): `SearchInput`, the Search button in its one fixed form (`variant="secondary"`, a `Search` icon on the left, `onClick={filters.apply}`), and now the advanced trigger.

#### B. Advanced trigger

`AdvancedFilterButton` — `open`, `onToggle`, and `count`. The page owns the open state and derives `count` with the hook's `countActive(ADVANCED_KEYS)`.

#### C. Sheet shell

`AdvancedFilterSheet` — `open`, `onOpenChange`, `onApply`, `onReset`, `resetDisabled`, and the fields as children. It supplies the right-side sheet with the funnel header, and Reset (left) and Apply & Search (right) in its footer.

#### D. Field groups

`AdvancedFilterGroup` wraps a labeled section of the sheet. `AdvancedFilterField` wraps one labeled control. The controls themselves are ordinary primitives — `Select` (with its `items` map on the root, or the trigger prints raw values), `Input`, `DateRangePicker`.

#### E. Shared filter state

The same `useListFilters` instance that drives the quick bar. The sheet writes to `draft` through `setDraft`; the footer's apply calls `apply()`; its reset calls `reset(ADVANCED_KEYS)`, which rolls back the draft without touching what is currently applied.

#### F. Chip row

`AppliedFilters` + `FilterChip`, reading `applied`.

## General guidelines

### Do

- Drive the sheet from the same `useListFilters` instance as the quick bar, so one apply commits both.
- Declare which keys are advanced (an `ADVANCED_KEYS` tuple in the page) and derive the trigger count with `countActive(ADVANCED_KEYS)` rather than counting by hand.
- Group the sheet's fields under `AdvancedFilterGroup` headings when there is more than a handful.
- Render a chip for every applied filter, including the ones set in the sheet.
- Reset selection and go back to page 1 when filters change. A user acting on a selection they can no longer see is a data-integrity bug, not a UX wrinkle.

### Don't

- Don't fetch on change while the sheet is open. The sheet is a draft surface.
- Don't keep a second copy of the filter state inside the sheet. There is one `draft`.
- Don't hide an applied filter from the chip row because it was set in the sheet.
- Don't put the primary search field in the sheet. Search stays in the bar.
- Don't use the sheet as a settings panel. It filters the collection and nothing else.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Field labels

- Use a noun phrase naming the property being filtered: _Category_, _Reference code_, _Created between_.

#### Chip labels

- Use `Property: value` so a chip is legible out of context: _Contract: ISO_.
- For a range, show both bounds or say _since <date>_. A chip that reads only _Date_ tells the user nothing.

#### Empty option

- Name the "no filter" option _Any_, not _All_ or an empty string, so it reads as an absence of constraint rather than a selection of everything.

## Accessibility guidelines

### General accessibility guidelines

- The sheet is a dialog: focus moves into it on open and returns to the trigger on close.
- Every control in the sheet is reachable and operable by keyboard.

### Component-specific guidelines

- The trigger's count must be part of its accessible name, not colour alone, so a screen-reader user knows filters are active without opening the sheet.
- Each `FilterChip`'s remove control needs an `aria-label` naming what it removes (_Remove contract filter_), not a bare _Remove_.
- Applying filters changes the row count; announce the new count in a live region so it is not a silent change.

## Related patterns and components

- [List page](list-page.md) — the surface this filters.
- [Empty states](empty-states.md) — the zero-results state that filtering produces.
- Components: `AdvancedFilterButton`, `AdvancedFilterSheet`, `AdvancedFilterGroup`, `AdvancedFilterField`, `ListConditionBand`, `SearchInput`, `AppliedFilters`, `FilterChip`, `Sheet`, and the `useListFilters` hook.

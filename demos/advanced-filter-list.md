# Advanced-filter list demo

A resource collection that combines a compact quick-filter band with a sheet for secondary conditions. Use it when filtering needs exceed the space and frequency of a standard list toolbar.

[View pattern](../patterns/advanced-filtering.md)

## On this page

1. Key UX concepts
2. Building blocks
3. General guidelines
4. Writing guidelines
5. Accessibility guidelines
6. Related patterns

## Key UX concepts

### Quick conditions and advanced conditions

Keep the most frequent search and filter controls in the condition band. Move less frequent, higher-density, or grouped conditions into the advanced filter sheet.

### Deferred apply

The sheet edits draft values. Results, count, and chips change only after the user chooses Apply, which keeps the collection stable while a condition is being composed.

### Filter state is visible

The trigger shows the number of active advanced conditions. Applied chips show the full query after it has been committed, regardless of where the condition was entered.

### One collection model

The advanced filter does not create a second list experience. The result summary, sticky table header, empty state, and pagination remain the same as a standard list page.

## Building blocks

#### A. Quick filter bar

Use `ListConditionBand` with `SearchInput`, the most common quick filters, a Search action, and `AdvancedFilterButton`.

#### B. Advanced trigger

Use `AdvancedFilterButton` with `open`, `onToggle`, and `count` to open the sheet and show the current count of advanced values.

#### C. Advanced filter sheet

Use `AdvancedFilterSheet` — `open`, `onOpenChange`, `onApply`, `onReset`, `resetDisabled` — as the shell for secondary controls. It owns the apply and reset affordances and should not contain unrelated page actions.

#### D. Field groups

Use `AdvancedFilterGroup` and `AdvancedFilterField` to organize related conditions. The consuming feature supplies domain field labels and values. A `Select` in the sheet needs an `items` map of value to label on its root, or its trigger shows the raw value.

#### E. Shared filter state

Use one `useListFilters` instance for quick and advanced controls. It supplies draft state, applied state, `apply`, `clearField`, `clearAll`, `reset` for rolling back the sheet's draft, and `countActive` for the trigger's badge.

#### F. Results collection

Use `AppliedFilters`, `ListSummaryBar`, `Table`, and `RichPagination` to show the applied result set after the user commits filters.

## General guidelines

### Do

- Place only the highest-frequency controls in the quick bar.
- Group advanced fields by the task or data area they refine.
- Keep applied-filter chips as the visible representation of the active query.
- Send the complete applied filter set to the server with sort and pagination parameters.

### Don't

- Don't execute a request for every draft change in the sheet.
- Don't duplicate a quick filter in the advanced sheet unless the relationship is unambiguous.
- Don't hide applied conditions inside the sheet after it closes.
- Don't make the sheet a substitute for a dedicated search page when the task needs broad discovery.

## Writing guidelines

### General writing guidelines

- Use sentence case, active voice, and present-tense verbs.
- Use concise noun phrases for filter labels and sentence case for actions.
- Use device-independent language such as choose and select.

### Component-specific guidelines

#### Field labels

Name the resource attribute, not the implementation or query parameter. Mark optionality only when it helps users understand the task.

#### Group labels

Use a short category name that explains why the fields belong together, such as `Status and ownership`.

#### Applied chips

Show both the field and the selected value, such as `Window: 7 days`.

## Accessibility guidelines

### General accessibility guidelines

- Keep the sheet's focus contained while it is open and return focus to its trigger when it closes.
- Preserve visible focus and make all filters operable without a pointer.
- Associate every form control with a visible or programmatic label.

### Component-specific guidelines

#### Advanced trigger

Give the trigger an accessible name that includes its purpose. Its active count supplements, rather than replaces, the visible label.

#### Filter chips

Give each remove control an accessible name that identifies the condition it removes.

## Related patterns

- [List page](../patterns/list-page.md)
- [Empty states](../patterns/empty-states.md)
- [Errors and validation](../patterns/errors-and-validation.md)
- [Permission gating](../patterns/permission-gating.md)

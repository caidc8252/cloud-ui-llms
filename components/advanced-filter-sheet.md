# AdvancedFilterSheet

Right-side sheet holding the advanced filters, with Reset and Apply in the footer.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/list-filter/advanced-filter-sheet.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/list-filter/index.ts)

`AdvancedFilterSheet` is a client component in the list-filter family. It exports three parts — `AdvancedFilterSheet`, `AdvancedFilterGroup`, and `AdvancedFilterField`. Import them from `@cloud/ui`.

## Development guidelines

`AdvancedFilterSheet` is the shell of the advanced-filter panel: a funnel header, a scrollable body, and a footer with Reset on the left and "Apply & search" on the right. It is full-width on mobile and capped near 560px on desktop. Its own copy — the title, the hint, Reset, Apply — is localized inside the component through the `ui.listFilter` namespace.

The **fields and the deferred-apply wiring come from you**, through `children` and the callbacks. That deferral is the point of the sheet: the user edits a _draft_ of the filters, and nothing is applied until they press Apply. Hold the draft (the `useListFilters` hook does this), commit it in `onApply`, clear it in `onReset`, and pass `resetDisabled` when there is nothing to reset.

Structure the body with the two helpers:

- `AdvancedFilterGroup` — an overline heading over a two-column grid of fields.
- `AdvancedFilterField` — one field cell: an uppercase label above a control (a `Select`, an `Input`, a `ToggleGroup`). Pass `className="sm:col-span-2"` to span both columns, for a date range or a long text field.

## General guidelines

### Do

- Hold a draft in the sheet, and commit it only in `onApply`.
- Group the fields, and label the groups.
- Span a wide control across both columns with `className="sm:col-span-2"`.
- Pass `resetDisabled` when no filters are set, so Reset isn't a live button that does nothing.

### Don't

- Don't apply a filter as the user changes it; the sheet is deferred by design, and a list re-querying behind an open panel is disorienting.
- Don't duplicate a quick-bar filter in the sheet; each filter belongs in exactly one place.
- Don't put an action that isn't a filter in the footer. It applies filters; that's all.

## Features

- #### The sheet

  ```tsx
  import {
    AdvancedFilterSheet,
    AdvancedFilterGroup,
    AdvancedFilterField,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    DateRangePicker,
  } from "@cloud/ui";

  <AdvancedFilterSheet
    open={open}
    onOpenChange={setOpen}
    onApply={applyDraft}
    onReset={resetDraft}
    resetDisabled={!hasDraftFilters}
  >
    <AdvancedFilterGroup label={t("filters.identity")}>
      <AdvancedFilterField label={t("merchants.status")}>
        <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
          <SelectTrigger size="sm">
            <SelectValue placeholder={t("common.any")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="live">{t("status.live")}</SelectItem>
            <SelectItem value="pending">{t("status.pending")}</SelectItem>
          </SelectContent>
        </Select>
      </AdvancedFilterField>
      <AdvancedFilterField label={t("merchants.region")}>…</AdvancedFilterField>
    </AdvancedFilterGroup>

    <AdvancedFilterGroup label={t("filters.activity")}>
      <AdvancedFilterField label={t("filters.dateRange")} className="sm:col-span-2">
        <DateRangePicker
          value={draft.range}
          onValueChange={(r) => setDraft({ ...draft, range: r })}
        />
      </AdvancedFilterField>
    </AdvancedFilterGroup>
  </AdvancedFilterSheet>;
  ```

- #### Groups and fields

  `AdvancedFilterGroup` is an overline heading plus a two-column grid. `AdvancedFilterField` is one label-and-control cell; `sm:col-span-2` makes it span the grid.

### States

- **Open / closed** — driven by `open` and `onOpenChange`.
- **Reset disabled** — `resetDisabled` grays the Reset button when there is nothing to clear.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Group labels: name the category of filters, such as `Identity` or `Activity`.
- Field labels: name the field as the user knows it. These render uppercase; write them in sentence case anyway and let the CSS do the shouting.
- The sheet's own copy — title, hint, Reset, Apply — is not yours to pass; it comes from `ui.listFilter`.

## Accessibility guidelines

### General accessibility guidelines

- The sheet is a `Sheet`, so focus moves into it on open and returns to the trigger on close, and Escape dismisses it.
- `AdvancedFilterField` renders a real `<label>`, but it is **not associated with the control by `htmlFor`** — so give the control its own accessible name too, with an `aria-label` or an `id` you wire up yourself. Don't assume the visible label is enough.
- The close button carries a localized `aria-label` from `ui.listFilter.close`.

### Component-specific guidelines

- Because the sheet applies on commit, tell the user what changed: after Apply, announce the new result count. Otherwise the panel closes and nothing appears to have happened.

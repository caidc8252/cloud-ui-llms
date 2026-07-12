# AdvancedFilterSheet

Right-side sheet holding the advanced filters, with Reset and Apply in the footer.

`AdvancedFilterSheet` is a client component in the list-filter family. It exports three parts — `AdvancedFilterSheet`, `AdvancedFilterGroup`, and `AdvancedFilterField`. Import them from `@cloud/ui`.

## Development guidelines

`AdvancedFilterSheet` is the shell of the advanced-filter panel: a funnel header, a scrollable body, and a footer with a ghost **Reset** on the left and a primary **Apply & Search** on the right (both `md`). It is full-width on mobile and capped at `sm:max-w-xl` — 576px — on desktop. Its own copy — the title, the hint, Reset, Apply & Search, the close button's label — is localized inside the component through the `ui.listFilter` namespace.

Its props are `open`, `onOpenChange`, `onApply`, `onReset`, `children` (all required) and the optional `resetDisabled`.

The **fields and the deferred-apply wiring come from you**, through `children` and the callbacks. That deferral is the point of the sheet, and it is the same draft / applied machine the quick bar runs on: the user edits a _draft_ of the filters, and nothing reaches the list until a commit. With `useListFilters`, `onApply` is `filters.apply()` (draft → applied), `onReset` is `filters.reset(sheetKeys)` — which resets the **draft only**, and does _not_ commit — and `resetDisabled` is `filters.countActive(sheetKeys, "draft") === 0`. Closing the sheet without applying keeps the draft; it doesn't discard it.

Structure the body with the two helpers:

- `AdvancedFilterGroup` — an overline heading (`label`) over a two-column grid of fields.
- `AdvancedFilterField` — one field cell: an uppercase `label` above a control (a `Select`, an `Input`, a `DateRangePicker`). Pass `className="sm:col-span-2"` to span both columns, for a date range or a long text field.

**The width trap.** `AdvancedFilterField` is a plain label-and-control cell, not a `Field` — so a `SelectTrigger` inside it does **not** pick up the `w-full` that a real `Field` grants it, and stays `w-fit`. Left alone it sizes to whatever value it currently holds, which is exactly what a control must never do — a control's width belongs to its field, never to its current value. Give every `Select` in the sheet `className="w-full"` so it fills its grid column and holds still. Controls here stay at the family's `md` size.

## General guidelines

### Do

- Commit only in `onApply`, and reset only the draft in `onReset`.
- Give every `Select` in the sheet `className="w-full"` so it fills its column instead of sizing to its value.
- Group the fields, and label the groups.
- Span a wide control across both columns with `className="sm:col-span-2"`.
- Pass `resetDisabled` when nothing in the draft differs from the baseline, so Reset isn't a live button that does nothing.

### Don't

- Don't apply a filter as the user changes it; the sheet is deferred by design, and a list re-querying behind an open panel is disorienting.
- Don't treat Reset as a commit. It clears the draft; the list doesn't change until Apply & Search.
- Don't shrink the sheet's controls to `sm`; the list-filter family sizes `md` throughout.
- Don't duplicate a quick-bar filter in the sheet; each filter belongs in exactly one place.
- Don't put an action that isn't a filter in the footer. It applies filters; that's all.

## Features

- #### The sheet

  ```tsx
  import {
    AdvancedFilterField,
    AdvancedFilterGroup,
    AdvancedFilterSheet,
    DateRangePicker,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useListFilters,
  } from "@cloud/ui";

  const SHEET_KEYS = ["status", "region"] as const;
  const filters = useListFilters({
    initial: { q: "", status: "all", region: "all" },
    onApply: () => setPage(1),
  });

  <AdvancedFilterSheet
    open={open}
    onOpenChange={setOpen}
    onApply={() => {
      filters.apply();
      setOpen(false);
    }}
    onReset={() => filters.reset(SHEET_KEYS)}
    resetDisabled={filters.countActive(SHEET_KEYS, "draft") === 0}
  >
    <AdvancedFilterGroup label={t("filters.identity")}>
      <AdvancedFilterField label={t("merchants.status")}>
        <Select
          value={filters.draft.status}
          onValueChange={(v) => filters.setDraft("status", String(v ?? "all"))}
        >
          {/* w-full: the cell is not a Field, so the trigger would otherwise be w-fit. */}
          <SelectTrigger size="md" className="w-full">
            <SelectValue placeholder={t("common.any")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.any")}</SelectItem>
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
          value={range}
          onValueChange={setRange}
          size="md"
          className="w-full"
        />
      </AdvancedFilterField>
    </AdvancedFilterGroup>
  </AdvancedFilterSheet>;
  ```

  `useListFilters` decides "active" by comparing each field with its `initial` value, so it fits string / number / boolean fields. A range or a multi-select is an object: hold it in your own state, as `range` is above, and count it yourself.

- #### Groups and fields

  `AdvancedFilterGroup` is an overline heading (`label`) plus a two-column grid. `AdvancedFilterField` is one label-and-control cell (`label`, optional `className`); `sm:col-span-2` makes it span the grid.

### States

- **Open / closed** — driven by `open` and `onOpenChange`. Closing without applying **keeps the draft** — reopening shows what the user had typed.
- **Reset disabled** — `resetDisabled` grays the Reset button when the draft matches the baseline and there is nothing to clear.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Group labels: name the category of filters, such as `Identity` or `Activity`.
- Field labels: name the field as the user knows it. These render uppercase; write them in sentence case anyway and let the CSS do the shouting.
- The sheet's own copy — title, hint, Reset, **Apply & Search**, the close button's name — is not yours to pass; it comes from `ui.listFilter`. The commit verb says "Apply & Search" because it does both: it commits the draft and re-runs the list.

## Accessibility guidelines

### General accessibility guidelines

- The sheet is a `Sheet`, so focus moves into it on open and returns to the trigger on close, and Escape dismisses it.
- `AdvancedFilterField` renders a real `<label>`, but it is **not associated with the control by `htmlFor`** — so give the control its own accessible name too, with an `aria-label` or an `id` you wire up yourself. Don't assume the visible label is enough.
- The close button carries a localized `aria-label` from `ui.listFilter.close`.

### Component-specific guidelines

- Because the sheet applies on commit, tell the user what changed: after Apply, announce the new result count. Otherwise the panel closes and nothing appears to have happened.

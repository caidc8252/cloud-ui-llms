# AdvancedFilterButton

The quick bar's trigger for the advanced-filter sheet, with an applied-count badge.

`AdvancedFilterButton` is a client component in the list-filter family. It takes `open`, `onToggle`, and `count`. Import it from `@cloud/ui`.

## Development guidelines

`AdvancedFilterButton` is the funnel button that opens the `AdvancedFilterSheet`. It has three states: at rest, showing a count badge, and open (primary-tinted, with the chevron flipped). It carries `aria-expanded`, so the open state is announced and not merely colored.

`count` is **computed by the caller** — which fields count as "advanced" is the page's call, not the component's. The badge renders only when `count` is greater than zero. Keep the number honest: it is the user's only signal that filters they can't see are narrowing the list.

Its label comes from the `ui.listFilter.advanced` message, so it is localized inside the component; you pass no copy.

Put it in `ListConditionBand`'s `toolbar` slot, at the end of the quick-bar controls.

## General guidelines

### Do

- Count exactly the filters that live in the sheet, and nothing that already has a quick-bar control.
- Keep `count` in sync with the applied — not the draft — filter state.
- Put it last in the quick-bar toolbar.

### Don't

- Don't count a filter twice, once here and once as a quick-bar chip.
- Don't let the badge show a stale count; a wrong number here is worse than none.
- Don't build your own funnel button; the three states and the `aria-expanded` wiring are already here.

## Features

- #### The trigger

  ```tsx
  import { AdvancedFilterButton, AdvancedFilterSheet } from "@cloud/ui";

  <AdvancedFilterButton open={sheetOpen} onToggle={() => setSheetOpen((v) => !v)} count={advancedCount} />

  <AdvancedFilterSheet open={sheetOpen} onOpenChange={setSheetOpen} onApply={apply} onReset={reset}>
    …
  </AdvancedFilterSheet>;
  ```

### States

- **Rest** — a secondary button with a funnel glyph.
- **With filters** — an info `Badge` carrying the count.
- **Open** — primary-tinted, with the chevron rotated.

## Writing guidelines

The button's label is localized inside the component, through the `ui.listFilter` namespace. You supply only the count.

## Accessibility guidelines

### General accessibility guidelines

- The button carries `aria-expanded`, so the sheet's open state is announced, not just tinted.
- The count badge is the only signal that hidden filters are active. Make sure the applied filters also appear as chips in `AppliedFilters`, so the user can see and remove them without opening the sheet.

### Component-specific guidelines

- Don't rely on the primary tint alone to say the sheet is open; `aria-expanded` and the chevron carry it too, and both must stay accurate.

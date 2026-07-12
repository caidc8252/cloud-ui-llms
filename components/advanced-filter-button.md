# AdvancedFilterButton

The quick bar's trigger for the advanced-filter sheet, with an applied-count badge.

`AdvancedFilterButton` is a client component in the list-filter family. It takes `open`, `onToggle`, and `count`. Import it from `@cloud/ui`.

## Development guidelines

`AdvancedFilterButton` is the funnel button that opens the `AdvancedFilterSheet`. It is a `secondary`, `md` `Button` with a funnel `iconLeft` and a chevron `iconRight`, and it has three states: at rest, showing a count badge, and open (primary-tinted, with the chevron flipped). It carries `aria-expanded`, so the open state is announced and not merely colored.

Its whole API is `open`, `onToggle`, `count` — all three required. There is no `className`, no `disabled`, no label prop.

`count` is **computed by the caller** — which fields count as "advanced" is the page's call, not the component's. The badge (an info `Badge`) renders only when `count` is greater than zero. Keep the number honest: it is the user's only signal that filters they can't see are narrowing the list.

With `useListFilters`, the count is `filters.countActive(["region", "createdAt"])` — `countActive` reads the **applied** state by default, which is exactly what this badge should report. (Pass `"draft"` as the second argument only for the sheet's Reset-disabled check.)

Its label comes from the `ui.listFilter.advanced` message, so it is localized inside the component; you pass no copy.

Put it in `ListConditionBand`'s `toolbar` slot, among the quick-bar controls — before the mandated secondary **Search** button, which stays last because it is the commit.

## General guidelines

### Do

- Count exactly the filters that live in the sheet, and nothing that already has a quick-bar control.
- Derive `count` with `filters.countActive([...sheetKeys])`, which counts the applied — not the draft — state.
- Keep it in the quick-bar toolbar, ahead of the Search button.

### Don't

- Don't count a filter twice, once here and once as a quick-bar chip.
- Don't feed it a draft count; the badge would light up for filters the list isn't actually applying yet.
- Don't build your own funnel button; the three states and the `aria-expanded` wiring are already here.

## Features

- #### The trigger

  ```tsx
  import { AdvancedFilterButton, AdvancedFilterSheet, useListFilters } from "@cloud/ui";

  const SHEET_KEYS = ["region", "createdAt"] as const;
  const filters = useListFilters({ initial: { q: "", region: "all", createdAt: "any" } });

  <AdvancedFilterButton
    open={sheetOpen}
    onToggle={() => setSheetOpen((v) => !v)}
    count={filters.countActive(SHEET_KEYS)}
  />

  <AdvancedFilterSheet
    open={sheetOpen}
    onOpenChange={setSheetOpen}
    onApply={() => {
      filters.apply();
      setSheetOpen(false);
    }}
    onReset={() => filters.reset(SHEET_KEYS)}
    resetDisabled={filters.countActive(SHEET_KEYS, "draft") === 0}
  >
    …
  </AdvancedFilterSheet>;
  ```

### States

- **Rest** — a secondary `md` button with a funnel glyph.
- **With filters** — an info `Badge` carrying the count, shown only when `count > 0`.
- **Open** — primary-tinted, with the chevron rotated.

## Writing guidelines

The button's label is localized inside the component, through the `ui.listFilter` namespace. You supply only the count.

## Accessibility guidelines

### General accessibility guidelines

- The button carries `aria-expanded`, so the sheet's open state is announced, not just tinted.
- The count badge is the only signal that hidden filters are active. Make sure the applied filters also appear as chips in `AppliedFilters`, so the user can see and remove them without opening the sheet.

### Component-specific guidelines

- Don't rely on the primary tint alone to say the sheet is open; `aria-expanded` and the chevron carry it too, and both must stay accurate.

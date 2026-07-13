# useListFilters

The draft/applied state machine behind the list-filter family. The quick bar and the advanced sheet edit a **draft**; Search / Apply commits it to **applied**; the list reads only `applied`.

`useListFilters` is a client hook. Import it from `@cloud/ui`, together with its `ListFilters` and `UseListFiltersOptions` types — it is **not** exported from `@cloud/ui/components/list-filter`, which carries only the UI shells.

## Development guidelines

The page supplies the field shape and the query; the hook owns the state machine. One instance drives the whole filter area — the quick bar, the advanced sheet, and the applied-chip row all read and write the same `draft` / `applied` pair, which is why a search term typed in the bar and a category picked in the sheet commit together instead of racing each other.

The whole signature:

```ts
function useListFilters<T extends Record<string, unknown>>(options: {
  initial: T; // the unfiltered baseline — everything is defined against it
  onApply?: () => void; // after apply / clearField / clearAll — reset pagination here
}): {
  draft: T;
  applied: T;
  setDraft: <K extends keyof T>(key: K, value: T[K]) => void;
  apply: () => void; // draft → applied, fires onApply
  clearField: (key: keyof T) => void; // one field, draft + applied, fires onApply
  clearAll: () => void; // everything, draft + applied, fires onApply
  reset: (keys?: readonly (keyof T)[]) => void; // draft only, does NOT commit
  countActive: (keys: readonly (keyof T)[], source?: "applied" | "draft") => number;
  hasApplied: boolean;
};
```

**`setDraft` takes a key and a value — one field at a time.** `setDraft("status", "live")`. There is no patch form: `setDraft({ status, q })` does not exist.

**`initial` is the unfiltered baseline, and it is read exactly once.** It is captured on the first render, so passing an inline object literal is free — but changing it on a later render is silently ignored, and it will never reset the filters. Everything is defined against it: `apply`, `clearField`, and `clearAll` reset fields back to it, and `countActive` / `hasApplied` call a field "active" when it *differs* from it. Give `initial` a key for **every** filter field, holding that field's unfiltered value (`""`, `"all"`, `[]`) — `hasApplied` iterates `Object.keys(initial)`, so a field missing from it is invisible to the chip row and to the count band.

**`reset` is not `clearAll`.** `reset(keys?)` rolls back the **draft only**: it does not touch `applied`, does not commit, and does not fire `onApply`. That is the Advanced sheet's Reset — the user discards edits they have not applied, and the list keeps showing what is in effect. With no argument it resets the whole draft; with a key tuple it resets that subset. `clearAll`, by contrast, resets draft *and* applied and fires `onApply` — that is the chip row's "clear all".

**`countActive(keys, source)` defaults to `source: "applied"`** — the applied count, which is what `AdvancedFilterButton`'s badge shows. Pass `"draft"` for the sheet's `resetDisabled`, which must reflect what the user has typed but not yet applied.

Fields are compared against `initial` by identity, **except arrays, which compare by members and ignore order**. A multi-select filter can therefore hold a plain `string[]` without being flattened to a joined string — an identity check would call it "changed" the moment React rebuilt the array, and the filter would read as permanently applied. Fields holding any other object still compare by identity: keep the reference stable, or count them yourself.

## General guidelines

### Do

- Keep **one** instance per list page, shared by the quick bar and the advanced sheet.
- Put every filter field in `initial`, holding its unfiltered value.
- Reset pagination in `onApply` — it fires on every commit, including a chip's `×`.
- Read the query from `applied`, and the controls from `draft`.
- Derive the advanced badge with `countActive(ADVANCED_KEYS)` rather than counting by hand.

### Don't

- Don't call `setDraft` with an object. It is `(key, value)`.
- Don't query on `draft` — that skips the commit step the family exists to provide, and refetches on every keystroke.
- Don't rebuild `initial` conditionally and expect the filters to follow; it is captured on the first render only.
- Don't reach for `reset` to remove an applied filter — it only rolls back the draft. Use `clearField` or `clearAll`.
- Don't keep a second copy of the filter state alongside it. There is one `draft`.

## Features

- #### Draft in, applied out

  The quick-bar controls write to `draft`; only Search (or Enter inside `SearchInput`) calls `apply`. The query reads `applied`.

  ```tsx
  import { useListFilters } from "@cloud/ui";

  const filters = useListFilters({
    initial: { q: "", status: "all" },
    onApply: () => setPage(1),
  });

  <SearchInput
    value={filters.draft.q}
    onChange={(v) => filters.setDraft("q", v)}
    onSearch={filters.apply}
  />;

  const rows = useMemo(() => query(filters.applied), [filters.applied]);
  ```

- #### The applied-chip row

  `hasApplied` says whether anything is in effect. A chip's `×` is `clearField`, and the row's "clear all" is `clearAll`; both commit and fire `onApply`, so the list follows immediately.

  ```tsx
  <AppliedFilters onClearAll={filters.clearAll}>
    {filters.applied.status !== "all" ? (
      <FilterChip
        label={`Status: ${filters.applied.status}`}
        onRemove={() => filters.clearField("status")}
      />
    ) : null}
  </AppliedFilters>
  ```

- #### The advanced sheet — a badge, and a Reset that does not commit

  Declare which keys are advanced. `countActive(ADVANCED_KEYS)` badges the trigger with the **applied** count; `reset(ADVANCED_KEYS)` is the sheet's Reset, which rolls the draft back without touching the list; `countActive(ADVANCED_KEYS, "draft")` is what says whether that Reset has anything left to do.

  ```tsx
  const ADVANCED_KEYS = ["category", "tags"] as const;

  const filters = useListFilters({
    // `[] as string[]` — an inline `[]` infers as never[], and setDraft would reject a string[].
    initial: { q: "", status: "all", category: "any", tags: [] as string[] },
    onApply: () => setPage(1),
  });

  <AdvancedFilterButton
    open={sheetOpen}
    onToggle={() => setSheetOpen((o) => !o)}
    count={filters.countActive(ADVANCED_KEYS)}
  />

  <AdvancedFilterSheet
    open={sheetOpen}
    onOpenChange={setSheetOpen}
    // The sheet does not close itself — Apply calls onApply and nothing else.
    onApply={() => {
      filters.apply();
      setSheetOpen(false);
    }}
    onReset={() => filters.reset(ADVANCED_KEYS)}
    resetDisabled={filters.countActive(ADVANCED_KEYS, "draft") === 0}
  >
    <AdvancedFilterField label="Tags">
      <ToggleGroup
        type="multiple"
        variant="cloud"
        value={filters.draft.tags}
        onValueChange={(v) => filters.setDraft("tags", v)}
      >
        <Toggle value="beta">Beta</Toggle>
        <Toggle value="eol">End of life</Toggle>
      </ToggleGroup>
    </AdvancedFilterField>
  </AdvancedFilterSheet>;
  ```

## Accessibility guidelines

The hook renders nothing; the components it drives carry the semantics. Two of its values exist to keep them honest: `hasApplied` decides whether the user can see what is filtering the list, and `countActive` puts the advanced count into the trigger's accessible name rather than leaving it to a colour. See [List condition band](list-condition-band.md), [List applied filters](applied-filters.md), and [Advanced filter](advanced-filter-sheet.md).

## Related patterns and components

- [List page](../patterns/list-page.md) — the composition this hook exists for.
- [Advanced filtering](../patterns/advanced-filtering.md) — the deferred-apply sheet and the `ADVANCED_KEYS` convention.
- [Empty states](../patterns/empty-states.md) — `hasApplied` is what distinguishes filtered zero-results from a first-run empty list.
- Components: `ListConditionBand`, `SearchInput`, `AppliedFilters`, `FilterChip`, `AdvancedFilterButton`, `AdvancedFilterSheet`.

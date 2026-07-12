# SearchInput

The quick bar's search field — a search prefix, and Enter to run the search.

`SearchInput` is a client component in the list-filter family. Import it from `@cloud/ui`.

## Development guidelines

`SearchInput` is the search box in a list page's quick bar. It is an `Input` at `md` size with a magnifier prefix, wrapped in a fixed outer width (`max-w-64 flex-1`) so it sits consistently among the other quick-bar controls.

It takes exactly four props — `value`, `onChange`, `onSearch`, `placeholder` — and nothing else: there is no `className`, `id`, `disabled` or `aria-label` passthrough, so it is not a general-purpose input you can dress up.

It is fully controlled: `value` and `onChange` hold the text, and `onSearch` fires when the user presses **Enter**. Note that `onChange` does not search — typing only updates the text. That split is deliberate on a list page: the search runs when the user says so, not on every keystroke.

With `useListFilters`, that split is the draft / applied state machine: `onChange` writes the **draft** (`filters.setDraft("q", v)`), and `onSearch` is `filters.apply` — the only two things that commit a list page's filters are this Enter and the quick bar's **Search** button. Your query reads `filters.applied.q`.

The field is one half of the pair; the other is the mandated Search button that sits at the end of the toolbar — **with its icon**:

```tsx
<Button variant="secondary" iconLeft={<Search className="size-4" />} onClick={filters.apply}>
  Search
</Button>
```

The magnifier prefix inside the field is a marker for what the box is; the one on the button is the commit action. Ship both.

`placeholder` is caller-supplied business copy — pass a translated string.

Use it inside a `ListConditionBand`'s `toolbar` slot, alongside the quick filters (all at `md`) and the `AdvancedFilterButton`.

## General guidelines

### Do

- Put it in `ListConditionBand`'s `toolbar` slot, first among the quick-bar controls.
- Wire `onChange` to `setDraft` and `onSearch` to `apply` from `useListFilters`.
- Pass a translated `placeholder` that says what gets searched.
- Show the applied term as a `FilterChip`, removed with `clearField`.

### Don't

- Don't search on every keystroke; `onChange` is text, not a query. A list page commits on Search or Enter.
- Don't ship the field without the Search button beside it — Enter alone is a hidden commit.
- Don't use `SearchInput` for a field in a form. Use `Input`.
- Don't leave the placeholder generic when the search has a scope — `Search` says nothing about what will match.

## Features

- #### Search field

  ```tsx
  import { Search } from "lucide-react";
  import {
    AdvancedFilterButton,
    Button,
    ListConditionBand,
    SearchInput,
    useListFilters,
  } from "@cloud/ui";

  const filters = useListFilters({ initial: { q: "", status: "all" } });

  <ListConditionBand
    toolbar={
      <>
        <SearchInput
          value={filters.draft.q}
          onChange={(v) => filters.setDraft("q", v)}
          onSearch={filters.apply}
          placeholder={t("merchants.searchPlaceholder")}
        />
        <AdvancedFilterButton open={open} onToggle={toggle} count={advancedCount} />
        <Button
          variant="secondary"
          size="md"
          iconLeft={<Search className="size-4" />}
          onClick={filters.apply}
        >
          {t("common.search")}
        </Button>
      </>
    }
    applied={applied}
  />;
  ```

### States

- **Empty** — the placeholder shows.
- **Typed but not applied** — the text is in the **draft**; the list still shows the applied results. Enter, or the Search button, commits it.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Placeholder: name what is searched — `Search by name or MID` — so the user knows what will match and what won't.

## Accessibility guidelines

### General accessibility guidelines

- The field is a real `Input`, but `SearchInput` forwards **no** `aria-label` or `id` — its only accessible name today is the `placeholder`. So the placeholder is doing a label's job: name the scope in it (`Search by name or MID`), and keep it short enough to be read as a name.
- Enter runs the search, which is the expected behaviour for a search field. The Search button beside it is the visible, non-hidden equivalent — a keyboard user who never presses Enter still has a way to commit.
- When the results change, say so: announce the new count, or a screen-reader user has no idea the search did anything.

### Component-specific guidelines

- Because the component takes no label props, don't plan on a visually hidden label or an `aria-label` here — you'd have to reach for `Input` directly, which puts you outside the list-page paradigm. Carry the scope in the placeholder instead.

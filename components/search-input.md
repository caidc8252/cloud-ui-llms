# SearchInput

The quick bar's search field — a search prefix, and Enter to run the search.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/list-filter/search-input.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/list-filter/index.ts)

`SearchInput` is a client component in the list-filter family. Import it from `@cloud/ui`.

## Development guidelines

`SearchInput` is the search box in a list page's quick bar. It is an `Input` at `md` size with a magnifier prefix, wrapped in a fixed outer width (`max-w-64 flex-1`) so it sits consistently among the other quick-bar controls.

It is fully controlled: `value` and `onChange` hold the text, and `onSearch` fires when the user presses **Enter**. Note that `onChange` does not search — typing only updates the text. That split is deliberate on a list page: the search runs when the user says so, not on every keystroke. If you want live search, debounce and call it yourself from `onChange`.

`placeholder` is caller-supplied business copy — pass a translated string.

Use it inside a `ListConditionBand`'s `toolbar` slot, alongside the quick filters and the `AdvancedFilterButton`. Pair the whole family with the `useListFilters` hook.

## General guidelines

### Do

- Put it in `ListConditionBand`'s `toolbar` slot, first among the quick-bar controls.
- Pass a translated `placeholder` that says what gets searched.
- Run the search on `onSearch` (Enter), and show the applied term as a `FilterChip`.

### Don't

- Don't search on every keystroke unless you have debounced it; `onChange` is text, not a query.
- Don't use `SearchInput` for a field in a form. Use `Input`.
- Don't leave the placeholder generic when the search has a scope — `Search` says nothing about what will match.

## Features

- #### Search field

  ```tsx
  import { SearchInput, ListConditionBand } from "@cloud/ui";

  <ListConditionBand
    toolbar={
      <>
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={applyFilters}
          placeholder={t("merchants.searchPlaceholder")}
        />
        <AdvancedFilterButton open={open} onToggle={toggle} count={advancedCount} />
      </>
    }
    applied={…}
  />;
  ```

### States

- **Empty** — the placeholder shows.
- **Typed but not applied** — the text is in the field; nothing has been searched yet.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Placeholder: name what is searched — `Search by name or MID` — so the user knows what will match and what won't.

## Accessibility guidelines

### General accessibility guidelines

- The field is a real `Input`; give it an accessible name. A placeholder is **not** a label — it disappears the moment the user types.
- Enter runs the search, which is the expected behaviour for a search field.
- When the results change, say so: announce the new count, or a screen-reader user has no idea the search did anything.

### Component-specific guidelines

- Pair the field with an `aria-label` (or a visually hidden label) naming the search scope, since the quick bar has no visible label above it.

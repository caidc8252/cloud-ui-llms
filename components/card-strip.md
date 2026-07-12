# CardStrip

Horizontal strip of selectable entity cards — pick a store, an account, a project. Grows a toolbar when the list gets long.

`CardStrip` is a client component driven by props, composed over `Button` and `InputGroup`. It exports the `CardStripProps` and `CardStripItem` types alongside it. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`CardStrip` is the "which store / which account / which project am I looking at" switcher that sits above a detail view. **Selecting is the point.** Use `Carousel` instead when the cards are content to page through rather than a set to pick from, and a `Select` or `Combobox` when the entity has no card face worth showing.

The strip is controlled. `items` is the array of entities in display order, `selectedId` is the id of the current one, and `onSelect` is called with a card's id when it is picked — the component never holds the selection itself. When `selectedId` changes from elsewhere on the page, the strip nudges that card into view, scrolling only its own row.

A `CardStripItem` is `{ id, title, meta?, tag?, keywords?, disabled? }`. `id` is the stable identity and the value handed to `onSelect`. `title` is the headline, clamped to two lines. `meta` is the secondary line under it (`3 terminals`). `tag` is a small marker beside the title (an `HQ` badge). `keywords` is extra text the filter matches but never renders — an address, a merchant id. `disabled` makes a card unselectable and skips it during keyboard navigation.

**The strip changes shape with its length**, and that is the reason it exists as one component rather than a row of cards you assemble yourself. Above `toolbarThreshold` items (default `6`) a toolbar takes over: a filter box, a count, scroll arrows, and — the load-bearing bit — the add button, hoisted out of the card row. Below the threshold there is no toolbar, and adding is a trailing dashed card at the end of the row.

The add affordance only exists if you pass `onAdd`; omit it and the strip is selection-only. Its two forms are **exclusive** — the toolbar button and the trailing card never both render.

`renderItem` replaces a card's face. The card shell — selection, focus, keyboard, scroll-into-view — stays with the component. This is where an `ObjectTile tone="auto"` identity mark goes, since the default face has no media slot: `renderItem={(item, { selected }) => …}`.

## General guidelines

### Do

- Keep `selectedId` in state and drive it from `onSelect`; the strip is controlled.
- Give every item a stable `id` — it is the selection value and the scroll target.
- Put searchable-but-not-displayable text in `keywords` (address, merchant id) so the filter can find a store the user knows by street.
- Pass `filterPlaceholder` and `renderCount` so the toolbar reads in the user's language.
- Use `renderItem` with an `ObjectTile tone="auto"` when the entity has an identity mark, and seed it on the id so the tint survives a rename.

### Don't

- Don't use `CardStrip` to page through content. That is `Carousel`.
- Don't build your own add button next to the strip; pass `onAdd` and let the component decide which of its two forms to show.
- Don't raise `toolbarThreshold` to keep the pretty trailing add-card at 40 items — that is exactly the case the toolbar exists for.
- Don't render the strip with an empty `items` array and rely on the default empty state; it is worded as a filter miss. Render a real empty state instead, or pass `renderEmpty`.

## Features

- #### Selection

  `items` + `selectedId` + `onSelect`. Selection is the component's whole job; the selected card gets the primary-tinted, ring-outlined face.

  ```tsx
  import { CardStrip, type CardStripItem } from "@cloud/ui";

  const items: CardStripItem[] = stores.map((s) => ({
    id: s.id,
    title: s.name,
    meta: t("stores.terminalCount", { count: s.terminals }),
    keywords: s.address,
    tag: s.isHq ? <Badge shape="tag">{t("stores.hq")}</Badge> : undefined,
  }));

  <CardStrip items={items} selectedId={storeId} onSelect={setStoreId} />;
  ```

- #### Auto-morph above the threshold

  This is the property worth knowing. `toolbarThreshold` (default `6`) is the item count above which the strip raises a toolbar — filter box, `shown / total` count, scroll arrows, and the add button.

  The add button is the reason. Below the threshold, adding is a dashed card parked at the end of the row, which reads well and is one glance away. At 40 stores that same card is *behind all forty of them*: the user would have to scroll to the far end of a horizontal row to reach the primary way of creating a store. So past the threshold the add affordance is **hoisted into the toolbar**, where it is always on screen, and the trailing card is dropped. You don't opt into this — pass `onAdd` and the component picks the right form for the length it has.

  ```tsx
  <CardStrip
    items={items}                  // 20 stores → toolbar
    selectedId={storeId}
    onSelect={setStoreId}
    onAdd={() => setCreateOpen(true)}
    addLabel={t("stores.add")}
    filterPlaceholder={t("stores.filterPlaceholder")}
    renderCount={(shown, total) => t("stores.count", { shown, total })}
  />
  ```

- #### Add affordance

  `onAdd` enables it, `addLabel` names it (default `Add`) in both of its forms, and `addDisabled` greys it out without removing it. Omit `onAdd` entirely for a selection-only strip.

- #### Filter and count

  The filter appears with the toolbar and matches `title` and `keywords`, case-insensitively. It never applies below the threshold. The count defaults to `shown / total`; `renderCount(shown, total)` is the i18n hook for it.

  ```tsx
  renderCount={(shown, total) => t("stores.showing", { shown, total })}
  ```

- #### Custom card face

  `renderItem(item, { selected })` replaces the card's contents. Selection, focus, the roving tabindex and scroll-into-view all stay with the strip.

  ```tsx
  <CardStrip
    items={items}
    selectedId={storeId}
    onSelect={setStoreId}
    renderItem={(item, { selected }) => (
      <span className="flex w-full items-center gap-2">
        <ObjectTile name={item.title} tone="auto" colorSeed={item.id} size="sm" />
        <span className="flex flex-col items-start">
          <span className="line-clamp-2 text-md font-medium">{item.title}</span>
          <span className="text-xs">{item.meta}</span>
        </span>
      </span>
    )}
  />
  ```

- #### Overflow

  The row scrolls horizontally on its own. With the toolbar, the arrows nudge it by about 70% of the visible width and disable themselves at each edge. Changing `selectedId` from outside scrolls the card into the middle of the strip — and only the strip: it does not scroll the page.

- #### Custom empty state

  `renderEmpty({ query, clear })` replaces the "nothing matched the filter" state, and hands you the current query plus a `clear` callback to reset it.

  ```tsx
  renderEmpty={({ query, clear }) => (
    <Empty
      title={t("stores.noMatch", { query })}
      action={<Button variant="link" onClick={clear}>{t("common.clearFilter")}</Button>}
    />
  )}
  ```

### States

- **Short list** — `items.length <= toolbarThreshold`: no toolbar, no filter, and the add affordance is the trailing dashed card.
- **Long list** — above the threshold: the toolbar owns filtering, the count, the arrows, and adding; the trailing card is gone.
- **Selected** — the picked card carries the primary tint and ring; exactly one card at a time, keyed on `selectedId`.
- **Disabled item** — `item.disabled`: not selectable, and skipped by the arrow keys.
- **No matches** — the filter excludes everything: the row is replaced by the empty state, which offers a clear-filter action. `renderEmpty` overrides it.
- **Overflowing** — the arrows enable and disable themselves against the scroll edges; at rest at the left edge, only the right arrow is live.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings — `addLabel`, `filterPlaceholder`, `renderCount` and `renderEmpty` are the strip's translation seams.

### Component-specific guidelines

- Title: the entity's name as the user knows it — `Market Street Flagship`, not a store code.
- Meta: one short fact that helps tell two entities apart — `3 terminals`, `Opened 2019`. Not a sentence.
- Tag: one or two characters of standing, such as `HQ`. It is not a status badge.
- Add label: name the thing being created — `Add store`, not `Add`.
- Filter placeholder: say what the filter matches, including the invisible `keywords` — `Filter by name or address`.

## Accessibility guidelines

### General accessibility guidelines

- The card row is a horizontal `listbox` of `option`s, and each card reports `aria-selected`, so the current entity is announced, not just tinted.
- The strip is a **single tab stop**. Tab moves into it at the selected card (or the first enabled one), and Arrow Left / Arrow Right / Home / End move focus between cards. Moving focus does not change the selection — Enter or Space commits it.
- Disabled cards are skipped by the arrow keys, not just visually greyed.
- The scroll arrows are icon buttons with screen-reader-only labels, and are genuinely `disabled` at each edge rather than dead-but-clickable.

### Component-specific guidelines

- The add affordance sits **outside** the listbox in both of its forms. Adding a store is an action, not one of the options to choose from, and it must not be announced as one.
- Don't put meaning in `tag` that isn't also in the text — it renders inside the card's accessible name, so keep it to a short readable word.

# LoadMore

Append-on-click pagination footer — a summary line, a load-more button, and an optional progress bar.

`LoadMore` is a client component driven by props. Import it, and the `LoadMoreProps` type, from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`LoadMore` sits under a list or a table and appends the next batch when the user presses it. It draws its own top border and padding and centres its content, so it drops straight under the rows with no wrapper. It is purely presentational — **the copy is passed in**, so it stays i18n-agnostic: `children` is the button label (required; it stays visible while loading), `summary` is the optional line above the control (a localized "Showing 40 of 320"), and `endContent` is what replaces the button once everything is loaded (a localized "You've reached the end"). `onLoadMore` is the only other required prop.

`loading` disables the button and shows its spinner. `done` swaps the button for `endContent`. `progress` is a completion ratio from `0` to `1` — note it is a **ratio, not a percentage**, unlike `Progress`'s `value` — and renders a thin fixed-width `Progress` bar under the control when provided; the component clamps and converts it for you. The control itself is a fixed `Button variant="secondary" size="lg"`; there is no prop to restyle it.

**`LoadMore` is not the default footer.** Numbered pagination — `RichPagination` under a `Table`, inside the results `Card` — is what a normal table, admin screen, or ops list gets. Append-on-click is licensed only by one of these reasons, and the reason belongs in a comment at the call site:

- **Feed or stream browsing** — activity, notifications, logs: no "page N" for the user to want.
- **Unknown or unbounded total** — no `total` or `pageCount` to render.
- **Realtime append** — rows keep arriving at the tail.
- **Cursor-only backend** — offset paging is too expensive or isn't offered.
- **Touch or narrow container as the primary form.**

Given one of those, prefer an explicit `LoadMore` over pure infinite scroll whenever the list has a footer, or an end the user needs to reach. For scroll-driven loading instead, use `VirtualTable` with `onReachEnd`, or the standalone `useInfiniteScroll` hook on a non-table list. You can also combine them: pass a `LoadMore` as `VirtualTable`'s `footer` so the button is revealed at the bottom of the scroll viewport.

## General guidelines

### Do

- Pass translated copy for `children`, `summary`, and `endContent`.
- Set `loading` while the batch is in flight, so the button can't be pressed twice.
- Set `done` when there is nothing left, and give it an `endContent` that says so.
- Give `progress` as a ratio between 0 and 1.
- Name the reason you aren't using `RichPagination` in a comment at the call site.

### Don't

- Don't use it as the default footer for a table or an ops list — that's `RichPagination`.
- Don't leave the button live during a load; a double press double-appends.
- Don't hide the control when the list is exhausted with no word to the user — use `endContent`.
- Don't pass a percentage to `progress`; it is `0`–`1`.

## Features

- #### Load more

  ```tsx
  import { LoadMore } from "@cloud/ui";

  // Append-on-click, not RichPagination: the log stream has no known total.
  <LoadMore
    onLoadMore={loadNextPage}
    loading={isLoading}
    done={rows.length >= total}
    summary={t("list.showing", { shown: rows.length, total })}
    endContent={t("list.end")}
    progress={rows.length / total}
  >
    {t("list.loadMore")}
  </LoadMore>;
  ```

- #### Inside a virtual table

  Pass it as `VirtualTable`'s `footer` so the button appears below the rows, inside the scroll viewport.

  ```tsx
  <VirtualTable
    columns={columns}
    rows={rows}
    rowKey={(r) => r.id}
    height={520}
    footer={
      <LoadMore onLoadMore={loadNextPage} loading={isLoading}>
        {t("list.loadMore")}
      </LoadMore>
    }
  />
  ```

### States

- **Idle** — the button is live.
- **Loading** — the button is disabled and shows a spinner; its label stays visible.
- **Done** — `endContent` replaces the button.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Button label: name what loads, such as `Load more merchants`. A bare `Load more` works when the context is unmistakable.
- Summary: give both numbers — `Showing 40 of 320` — so the user knows how much is left.
- End content: say the list is complete, such as `That's all 320 merchants`.

## Accessibility guidelines

### General accessibility guidelines

- The control is a real button, reachable by Tab and activated with Enter or Space.
- Because the button stays in place and focus is not moved, announce that new rows arrived — a live-region summary, or moving focus to the first new row.
- The `summary` line tells a screen-reader user where they are in the list; it is not decoration.

### Component-specific guidelines

- This is the accessible alternative to infinite scroll. When a list has anything below it, use `LoadMore` rather than scroll-driven loading, which makes the footer unreachable.
- The `progress` bar carries a hardcoded English `aria-label` of `Loaded so far`, with no prop to override it — it is the one string `LoadMore` does not take from you. Don't lean on it to carry meaning in a localized app; put the numbers in `summary`, which you control.

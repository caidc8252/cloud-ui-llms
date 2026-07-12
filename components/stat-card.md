# StatCard

Single stat tile — a label, a value, and optionally a trend. Can double as a quick filter. `StatGrid` lays a row of them out.

`StatCard` and `StatGrid` are client components driven by props. `StatCard` is also exported under the alias `KpiTile` (and `StatCardProps` as `KpiTileProps`) — the same component, not a second one. The `StatCardProps`, `StatCardTone`, `StatCardTrend`, and `StatTrendDirection` types ship alongside them. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`StatCard` is a presentational leaf. The data array behind it and any linkage to the list's filters live in the consuming page; `StatGrid` is the only layout it needs.

Fill the standard slots — `label`, `value`, `description`, `icon`, and `trend` — or pass `children` for a custom inner layout, which overrides all of them.

`tone` colors the **value**: `neutral` (the default, uncolored) or `success` / `warning` / `error` / `info`. `trend` is `{ dir, label }`, with `dir` as `up` (green), `down` (red), or `flat` (muted). Note that up is _not_ automatically good — an upward trend in declined transactions is bad. The `dir` picks the color and the arrow; if that reading is wrong for your metric, say so in the `label` rather than fighting the color.

Pass `onClick` to make the card an interactive quick filter. It then renders as a keyboard-accessible `role="button"` — **not** a native `<button>`, per the apps lint rule. Omit `onClick` for a pure display card. `selected` gives it the applied-filter styling, and selected deliberately beats hover, so a chosen card doesn't flicker back to neutral under the pointer.

`sub` and `active` are `@deprecated` aliases of `description` and `selected`. Use the new names.

`StatGrid` is the row: a plain `<div>` that takes `cols` — `2`, `3`, or `4` — and lays the cards out with a `gap-3`. **`cols` defaults to `4`, and you cannot override it with `className`.** At `cols={4}` the grid expands to `grid-cols-2 sm:grid-cols-4`; passing `className="grid-cols-1"` only lets tailwind-merge eat the _base_ class, and the `sm:grid-cols-4` breakpoint survives — so a narrow side rail still crams four cards into it. **When you want fewer columns, pass `cols={2}` explicitly.** This is a silent trap: nothing errors, the layout is just wrong.

## General guidelines

### Do

- Pass `onClick` only when the card really filters the list beneath it, and keep `selected` in sync with the applied filters.
- Use `tone` for the value's meaning, not for decoration.
- Say what a trend means in its `label` — the arrow only says which way it went.
- Use `description` and `selected`; `sub` and `active` are deprecated.
- Set `StatGrid`'s column count with `cols`, and set it explicitly whenever the container is narrow.

### Don't

- Don't make a card clickable if nothing happens; a hover state on a dead tile is a lie.
- Don't put a whole chart in a stat card. Use a card with a proper chart.
- Don't rely on `dir` to imply good or bad; up is not always good.
- Don't try to change `StatGrid`'s columns with `className`. `grid-cols-1` does not win against the default's `sm:grid-cols-4`; use `cols`.

## Features

- #### Basic stat

  ```tsx
  import { StatCard } from "@cloud/ui";

  <StatCard label={t("stats.volume")} value={formatCurrency(volume)} />;
  ```

- #### Tone and trend

  `tone` colors the value; `trend` is `{ dir, label }` with `dir` as `up`, `down`, or `flat`.

  ```tsx
  <StatCard
    label={t("stats.declines")}
    value="1.8%"
    tone="warning"
    trend={{ dir: "up", label: t("stats.vsLastWeek") }}
  />
  ```

- #### Quick filter

  `onClick` makes the card interactive; `selected` marks it as the applied filter.

  ```tsx
  <StatCard
    label={t("stats.failed")}
    value={counts.failed}
    tone="error"
    selected={status === "failed"}
    onClick={() => setStatus(status === "failed" ? null : "failed")}
  />
  ```

- #### Custom content

  `children` replaces the standard slots entirely.

- #### Grid

  `StatGrid` lays the cards out. `cols` is `2`, `3`, or `4` (default `4`).

  ```tsx
  import { StatCard, StatGrid } from "@cloud/ui";

  <StatGrid cols={4}>
    <StatCard label={t("stats.total")} value={counts.total} />
    <StatCard label={t("stats.active")} value={counts.active} tone="success" />
    <StatCard label={t("stats.pending")} value={counts.pending} tone="warning" />
    <StatCard label={t("stats.failed")} value={counts.failed} tone="error" />
  </StatGrid>;
  ```

  In a narrow container — a side rail, a modal — pass `cols={2}`. Don't reach for `className`:

  ```tsx
  <StatGrid cols={2}>{/* … */}</StatGrid>
  ```

### States

- **Display** — no `onClick`: no hover, no cursor change, not focusable.
- **Interactive** — with `onClick`: hover styling, `role="button"`, `aria-pressed` reflecting `selected`, keyboard operable.
- **Selected** — the applied-filter styling, which takes precedence over hover.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Label: name the metric, such as `Settled volume`. Put the unit here or in the value, not in both.
- Value: format for the locale, and keep the precision meaningful — `1.8%`, not `1.80321%`.
- Trend label: give the comparison, such as `vs last week`. Without it, a trend arrow means nothing.

## Accessibility guidelines

### General accessibility guidelines

- An interactive card is a `role="button"` with keyboard support, so it is reachable by Tab and activated with Enter or Space.
- Don't rely on `tone` alone to say a number is bad; the label and the trend say it in words.
- A display-only card is not focusable, and should not be — there is nothing to do with it.

### Component-specific guidelines

- When a card acts as a filter, its selected state is announced through `aria-pressed`, which the component derives from `selected` — so `selected` must stay in sync with the list's applied filters, or the announcement and the list disagree.

# StatCard

Single stat tile — a label, a value, and optionally a trend. Can double as a quick filter.

`StatCard` is a client component driven by props. It exports the `StatCardProps`, `StatCardTone`, and `StatCardTrend` types alongside it. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`StatCard` is a presentational leaf. The grid it sits in, the data array behind it, and any linkage to the list's filters all live in the consuming page.

Fill the standard slots — `label`, `value`, `description`, `icon`, and `trend` — or pass `children` for a custom inner layout, which overrides all of them.

`tone` colors the **value**: `neutral` (the default, uncolored) or `success` / `warning` / `error` / `info`. `trend` is `{ dir, label }`, with `dir` as `up` (green), `down` (red), or `flat` (muted). Note that up is _not_ automatically good — an upward trend in declined transactions is bad. The `dir` picks the color and the arrow; if that reading is wrong for your metric, say so in the `label` rather than fighting the color.

Pass `onClick` to make the card an interactive quick filter. It then renders as a keyboard-accessible `role="button"` — **not** a native `<button>`, per the apps lint rule. Omit `onClick` for a pure display card. `selected` gives it the applied-filter styling, and selected deliberately beats hover, so a chosen card doesn't flicker back to neutral under the pointer.

`sub` and `active` are `@deprecated` aliases of `description` and `selected`. Use the new names.

## General guidelines

### Do

- Pass `onClick` only when the card really filters the list beneath it, and keep `selected` in sync with the applied filters.
- Use `tone` for the value's meaning, not for decoration.
- Say what a trend means in its `label` — the arrow only says which way it went.
- Use `description` and `selected`; `sub` and `active` are deprecated.

### Don't

- Don't make a card clickable if nothing happens; a hover state on a dead tile is a lie.
- Don't put a whole chart in a stat card. Use a card with a proper chart.
- Don't rely on `dir` to imply good or bad; up is not always good.

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

### States

- **Display** — no `onClick`: no hover, no cursor change, not focusable.
- **Interactive** — with `onClick`: hover styling, `role="button"`, keyboard operable.
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

- When a card acts as a filter, its selected state must be announced, not just colored. Keep it in sync with the list's applied filters so the two never disagree.

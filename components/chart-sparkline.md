# Chart sparkline

A trend with no chart chrome — no axes, no grid, no legend. **Use it where a full chart would not fit**: inside a `StatCard`, a table cell, or a list row.

[Stat card](stat-card.md) | [Chart container](chart.md) | [Data visualization](../patterns/data-visualization.md)

## Development guidelines

`ChartSparkline` takes `data` and a `dataKey`, and draws one series at a fixed `width` and `height`. `variant` is `line` or `area`; `curve` is `monotone` (default), `linear`, or `step`. `color` sets the stroke — point it at a semantic token, not a literal.

It is a **shape, not a chart**. There is no axis, so there is no scale the reader can trust, and no tooltip, so there is no value they can read. A sparkline says _"rising"_, _"flat"_, _"spiky"_ — nothing more precise than that. **Always pair it with the number it is about.** A sparkline on its own is decoration.

`curve="step"` for a value that genuinely changes in steps — a count, a tier, a state — rather than smoothing between samples that never had intermediate values. `monotone` is right for a continuous measure; `linear` when you want the samples themselves visible.

## General guidelines

### Do

- Pair it with the value it describes. The number is the fact; the sparkline is the shape of the fact.
- Use it inside a `StatCard`, a table cell, or a row — places a real chart cannot go.
- Use `curve="step"` for a value that changes in steps, so the line does not invent intermediate values.
- Colour it from a semantic token, so it follows the theme.

### Don't

- Don't use it as a small chart. It has no axis and no tooltip; nothing can be read off it.
- Don't put a sparkline anywhere a real chart fits. If there is room for axes, the reader deserves them.
- Don't smooth a step-valued series with `monotone`. You are drawing values that never existed.
- Don't rely on colour to say "good" or "bad". A red line is not a trend direction — say the direction in the label.

## Features

- #### In a stat card

  ```tsx
  import { ChartSparkline } from "@cloud/ui/components/chart";

  <StatCard label="Settled volume" value={formatCurrency(total)} dir="up">
    <ChartSparkline
      data={last30Days}
      dataKey="volume"
      variant="area"
      color="var(--color-chart-1)"
      height={32}
    />
  </StatCard>;
  ```

  The value carries the fact; the sparkline carries the shape.

## Accessibility guidelines

### General accessibility guidelines

- A sparkline is decorative to a screen reader unless the trend is stated in text. The `StatCard`'s value and trend direction are what actually get read — do not let the sparkline be the only place the trend appears.

### Component-specific guidelines

- Give the sparkline `aria-hidden` when the surrounding text already states the trend, rather than leaving an unlabelled graphic in the accessibility tree.

## Related patterns and components

- [Stat card](stat-card.md) — the usual home, and the place the number lives.
- [Chart container](chart.md) — for a real chart, with axes and a tooltip.
- [Chart bar](chart-bar.md) — when the individual values matter.
- [Data visualization](../patterns/data-visualization.md).

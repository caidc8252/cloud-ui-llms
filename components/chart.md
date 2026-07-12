# Chart container

The wrapper every chart needs — config, responsive sizing, semantic series colours, and the shared chart context. **Nothing in a chart works outside it.**

[Data visualization](../patterns/data-visualization.md) | [Colors](../foundations/colors.md)

## Development guidelines

### Import from the chart subpath, never from `recharts`

Charts live at **`@cloud/ui/components/chart`** — a deliberate subpath, not part of the root `@cloud/ui` barrel. The reason is a collision: Recharts exports its own `Tooltip` and `Legend`, which would clash with `@cloud/ui`'s `Tooltip`. The subpath re-exports the Recharts composition primitives you need (`BarChart`, `Bar`, `XAxis`, `Pie`, `ResponsiveContainer`, …) under their own names, and exposes the themed replacements as `ChartTooltip` and `ChartLegend`.

So: **compose a whole chart out of `@cloud/ui/components/chart` imports and never depend on `recharts` directly.** An `import { Tooltip } from "recharts"` is both a lint problem and an unthemed tooltip.

### `ChartConfig` is where the colour comes from

`ChartConfig` maps each series key to its `label`, an optional `icon`, and its colour. The colour is given **one** of two ways, never both:

- `color` — a single value for both themes.
- `theme: { light, dark }` — a value per theme, when the series needs different treatment in each.

`ChartContainer` turns the config into CSS variables (`--color-<key>`) that the series read. **Point them at semantic tokens, not at hex or OKLCH literals** — the chart palette and the category hues exist for exactly this, and a hardcoded colour will not follow the theme. See [Colors](../foundations/colors.md).

`useChart()` gives a descendant access to the config; `buildChartVars()` and `ChartStyle` are the plumbing behind the variables and are rarely called directly.

## General guidelines

### Do

- Import every chart part from `@cloud/ui/components/chart`.
- Give each series a `label` in the config — the tooltip and the legend read it, so a series with no label shows a raw data key to the user.
- Drive colours from semantic tokens, so light and dark both work without a second config.
- Use `theme: { light, dark }` when one colour genuinely cannot serve both, rather than compromising on a value that is legible in neither.
- Render `ChartSkeleton` while data is loading and `ChartEmpty` when there is none. A chart with no data is not an empty page.

### Don't

- Don't import from `recharts`. Everything you need is re-exported.
- Don't import charts from the root `@cloud/ui` barrel — they are not there, on purpose.
- Don't set both `color` and `theme` on a config entry. They are mutually exclusive.
- Don't hardcode a hex or OKLCH literal as a series colour. It will not follow the theme, and it will not match any other chart.
- Don't reach for `accent` to make an ordinary chart "pop". `accent` is reserved for AI affordances and chart accents — borrowing it erases the signal it carries.

## Features

- #### Config and container

  ```tsx
  import {
    ChartContainer,
    BarChart,
    Bar,
    XAxis,
    type ChartConfig,
  } from "@cloud/ui/components/chart";

  const config = {
    settled: { label: "Settled", color: "var(--color-chart-1)" },
    pending: { label: "Pending", color: "var(--color-chart-2)" },
  } satisfies ChartConfig;

  <ChartContainer config={config}>
    <BarChart data={rows}>
      <XAxis dataKey="month" />
      <Bar dataKey="settled" fill="var(--color-settled)" />
      <Bar dataKey="pending" fill="var(--color-pending)" />
    </BarChart>
  </ChartContainer>;
  ```

  The container publishes `--color-settled` and `--color-pending` from the config; the series read them back.

- #### Per-theme colour

  ```tsx
  const config = {
    load: {
      label: "Load",
      theme: { light: "var(--color-chart-3)", dark: "var(--color-chart-3)" },
    },
  } satisfies ChartConfig;
  ```

## Accessibility guidelines

### General accessibility guidelines

- A chart is not readable by colour alone. Pair it with a legend, direct labels, or an accessible summary — a colour-blind user with two similar series has nothing to go on.
- Never remove the focus ring from an interactive chart element.

### Component-specific guidelines

- The series `label` in the config is what assistive technology reads in the tooltip. A missing label leaves a raw key.

## Related patterns and components

- [Data visualization](../patterns/data-visualization.md) — which chart to reach for, and the standard states.
- [Colors](../foundations/colors.md) — the chart palette and the category hues.
- [Chart tooltip](chart-tooltip.md), [Chart legend](chart-legend.md), [Chart states](chart-states.md) — the themed parts that read this context.
- [Chart bar](chart-bar.md), [Chart sparkline](chart-sparkline.md), [Chart pie callout](chart-pie-callout.md).

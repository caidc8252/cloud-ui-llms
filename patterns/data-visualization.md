# Data visualization

Charts composed from the `@cloud/ui` chart kit — themed Recharts primitives whose colours come from the design tokens and whose look comes from the stylesheet, not from per-chart props.

[Usage reference](../examples/charts.tsx) | [Chart tokens](../design-tokens.md)

## Key UX concepts

### The kit lives on a subpath

Import from `@cloud/ui/components/chart`, **never** from the root `@cloud/ui` barrel and never from `recharts` directly. The subpath exists because Recharts' own `Tooltip` and `Legend` would collide with the barrel's `Tooltip` export; the kit re-exports the Recharts composition pieces it needs, so a chart file has one import source. Recharts is a dependency of `@cloud/ui`, so consumers never add it themselves.

### The theme is applied to Recharts' SVG, not passed as props

The dashed grid, the muted axes, the dark tooltip, the polar grid — all of it is applied to Recharts' own SVG through `component-defaults.css`. You compose primitives and supply a `config`; you do not restyle the marks. A chart that hand-styles its grid stroke has left the system.

### Colour comes from the config, through the tokens

`ChartConfig` maps each series key to a label and a colour, and `ChartStyle` injects those as CSS variables (`--color-<series>`) that the marks reference. The colour values are the chart tokens: the categorical eight, the sequential ramp, or the diverging ramp.

The categorical set is **ordinal**. Always start at `chart-1` and step in order. It is tuned for at least 3:1 distinguishability at 8px markers and 1.5px strokes; picking colours out of order because they look nicer breaks that guarantee.

### Pick the ramp by the data's shape

- **Categorical** (`chart-1` … `chart-8`) — unordered series. Products, regions, statuses.
- **Sequential** (`chart-seq-100` … `chart-seq-700`) — one ordered quantity. Heatmaps, density.
- **Diverging** (`chart-div-neg` / `-mid` / `-pos`) — variance against a target or a zero point.

Using the categorical set for ordered data throws away the ordering the reader could have seen for free.

### `accent-*` is reserved

The accent palette belongs to charts and AI surfaces. Don't spend it on ordinary portal chrome, and don't reach for the semantic status tones (`success` / `warning` / `error`) as series colours — they mean severity, and a reader will read severity into them.

### Charts have states

`ChartSkeleton` for loading, `ChartEmpty` for no data. A chart that collapses to a bare axis when the query returns nothing looks broken rather than empty.

## Building blocks

#### A. Container

`ChartContainer` with a `ChartConfig`. It supplies the responsive box and the style scope.

#### B. Style injection

`ChartStyle` — turns the config's colours into the `--color-<series>` variables the marks consume. `buildChartVars` is the escape hatch when you need the same mapping outside a container.

#### C. Marks

Recharts composition pieces re-exported by the kit, plus the kit's own: `ChartBar` (with the stacked-bar shape helpers), `ChartSparkline`, and the pie callout helpers.

#### D. Tooltip

`ChartTooltip` + `ChartTooltipContent`. Never Recharts' `Tooltip` — the alias is what carries the theme and avoids the name clash.

#### E. Legend

`ChartLegend` + `ChartLegendContent`.

#### F. States

`ChartSkeleton` while loading; `ChartEmpty` when the series are empty.

#### G. Type face

Chart text goes through the `font-chart` semantic face, never `font-mono`. Numbers align with `tabular-nums`, which is a separate concern from the face.

## General guidelines

### Do

- Import everything chart-related from `@cloud/ui/components/chart`.
- Start categorical series at `chart-1` and step in order.
- Match the ramp to the data: categorical for unordered, sequential for ordered, diverging for variance.
- Render `ChartSkeleton` while the data is loading and `ChartEmpty` when it comes back empty.
- Label the axes and give the tooltip a readable value format. A number with no unit is not a data point.
- Let the config carry the colour. The mark reads it from the injected variable.

### Don't

- Don't import `recharts` directly, and don't import chart pieces from the root `@cloud/ui`.
- Don't restyle the grid, axes, or tooltip at the call site. The look lives in `component-defaults.css`.
- Don't use the semantic status tones as series colours.
- Don't use the categorical palette for ordered data.
- Don't spend `accent-*` on non-chart chrome.
- Don't encode a distinction by colour alone — pair it with a label, a legend, or a shape.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.

### Component-specific guidelines

#### Chart title

- Name the measure and the scope: _Transactions per day_, not _Chart_.

#### Axis labels

- Give the unit once, on the axis, rather than repeating it on every tick.

#### Legend labels

- Use the series' business name, the same one the rest of the page uses for it.

#### Empty state

- Say why it is empty. _No transactions in this period_ beats _No data_.

## Accessibility guidelines

### General accessibility guidelines

- Colour is never the only carrier of meaning. Pair series colour with a legend and, where the chart supports it, a distinguishable mark.
- Provide the underlying numbers somewhere reachable — a table, a summary line, or an accessible description. A chart alone is not an accessible data presentation.

### Component-specific guidelines

- The categorical palette is tuned for contrast between series at small mark sizes; changing the colours by hand forfeits that.
- The dark theme lifts the chart hues rather than reusing the light ones. Don't hardcode a light-mode colour value into a chart.
- Tooltips are pointer-driven; ensure the same information is available without hover, for keyboard and touch users.

## Related patterns and components

- [Design tokens](../design-tokens.md) — the chart palettes, the ramps, and the structural chart tokens.
- [Empty states](empty-states.md) — the empty case in the rest of the system.
- Components: `ChartContainer`, `ChartStyle`, `ChartTooltip`, `ChartLegend`, `ChartBar`, `ChartSparkline`, `ChartSkeleton`, `ChartEmpty`, `StatCard`.

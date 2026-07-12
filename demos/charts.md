# Charts demo

A reference for composing themed operational charts from the public `@cloud/ui/components/chart` entry. It covers common chart shapes, shared series configuration, legends, tooltips, and standard chart states.

[View source template](https://github-company/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/docs/examples/charts.tsx) · [View pattern](../patterns/data-visualization.md)

## On this page

1. Key UX concepts
2. Building blocks
3. General guidelines
4. Writing guidelines
5. Accessibility guidelines
6. Related patterns

## Key UX concepts

### The chart kit has its own public entry

Import chart primitives from `@cloud/ui/components/chart`. The package provides the Recharts primitives and shared presentation so application code does not import `recharts` directly.

### Configuration carries meaning

`ChartConfig` assigns meaningful labels, optional icons, and semantic colors to series. Marks, legends, and tooltips read the same configuration so the chart speaks consistently.

### Choose the chart for the question

Bars compare categories, lines and areas show change over time, pies show a small part-to-whole relationship, radar compares profiles, and radial bars show ranked or progress-like values. Avoid using a chart when a table answers the task more directly.

### A chart has states

The loading and empty states are part of the chart region, not an afterthought. Do not render an unconfigured visualization while data is loading or absent.

## Building blocks

#### A. Chart container

Use `ChartContainer` with a `ChartConfig` and a defined height. It provides responsive sizing, series CSS variables, and the shared theme context.

#### B. Chart marks

Use `ChartBar`, `Line`, `Area`, `Pie`, `Radar`, or `RadialBar` with the Recharts chart container that matches the data relationship.

#### C. Axes and grids

Use `XAxis`, `YAxis`, `CartesianGrid`, or polar axes only when they help users read values. Keep tick labels concise and units unambiguous.

#### D. Tooltip

Use `ChartTooltip` with `ChartTooltipContent` for a themed, labeled view of the data point a user is inspecting.

#### E. Legend

Use `ChartLegend` with `ChartLegendContent` when users need to identify or toggle multiple series. Keep legend labels aligned with the series configuration.

#### F. States

Use `ChartSkeleton` while data is loading and `ChartEmpty` when the selected range contains no displayable data.

## General guidelines

### Do

- Start with the user question and choose the simplest chart that answers it.
- Define labels and colors through `ChartConfig` and semantic tokens.
- Include a descriptive title, units, and meaningful series labels near the visualization.
- Reserve enough space for axes, legends, and pie callouts so labels remain readable.

### Don't

- Don't import from `recharts` directly in application code.
- Don't assign hard-coded colors that bypass the theme or use color as the only series identifier.
- Don't show too many series, labels, or chart types in one panel.
- Don't use a pie or donut chart for numerous categories or precise value comparison.

## Writing guidelines

### General writing guidelines

- Use sentence case, active voice, and present-tense verbs.
- Use clear units and consistent naming for the same metric across the title, axes, tooltip, and legend.
- Keep labels concise and avoid unexplained abbreviations.

### Component-specific guidelines

#### Chart title

State what is measured and, when needed, the time period or population. For example, use `Monthly transaction volume`.

#### Axis labels

Name the measure and its unit. Use a tick formatter when raw values would be unclear or too long.

#### Empty state

Name the missing data and offer one recovery action when one exists, such as widening the date range.

## Accessibility guidelines

### General accessibility guidelines

- Provide a nearby text summary or data table when users need exact values or comparisons.
- Ensure the chart title, legend, and descriptions make sense without color alone.
- Keep interactive legends and tooltips keyboard reachable when they expose controls or essential data.

### Component-specific guidelines

#### Series

Use distinct text labels and, where appropriate, icons or line styles in addition to color.

#### Interactive legend

Expose each toggle as a labelled button with its pressed state so users can tell which series are visible.

## Related patterns

- [Data visualization](../patterns/data-visualization.md)
- [Empty states](../patterns/empty-states.md)
- [Design tokens](../foundations/design-tokens.md)
- [Accessibility](../foundations/accessibility.md)

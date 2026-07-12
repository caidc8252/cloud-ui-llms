# Chart pie callout

Labels and connector lines outside a pie or donut. **Use it when the slices are too thin to label inline** — which, on a pie with more than three or four slices, they always are.

[Chart container](chart.md) | [Data visualization](../patterns/data-visualization.md)

## Development guidelines

`ChartPieCalloutLabel` renders the label; `ChartPieCalloutLabelLine` renders the leader line joining it to its sector. `getPieCalloutGeometry` computes the anchor points, and `resolvePieCalloutName`, `resolvePieCalloutLineColor`, and `formatPieCalloutValue` pull the name, the colour, and the formatted value out of the chart config so the callout matches the sector it points at.

### Before reaching for this, reconsider the pie

A pie is only readable when it answers **one** question — _"how is this whole split?"_ — with **few** parts. Human eyes compare angles badly; past three or four slices, a pie becomes a legend with a decorative circle attached, and every reader is doing arithmetic. If you find yourself adding callouts to eight slices, the honest chart is a **bar chart**, sorted by value. The callouts are a fix for thin slices, not a licence to have them.

A pie also cannot show change over time, cannot show negatives, and cannot be compared against another pie. If any of those is the question, it is the wrong chart.

## General guidelines

### Do

- Use callouts when the slices are too thin to carry a label inside.
- Keep the slice count low — three or four. Group the tail into an "Other" slice rather than drawing a dozen slivers.
- Sort the slices by value, so the reader is not doing the ranking.
- Show the value as well as the name. A slice the reader cannot measure needs its number.

### Don't

- Don't reach for a pie past four or five slices. Use a sorted bar chart — the eye compares lengths far better than angles.
- Don't use a pie for a trend, for negatives, or to compare two datasets. It does none of those.
- Don't let callouts collide or overlap. If they do, the chart is telling you it has too many slices.
- Don't rely on colour alone to key the slices. The callout's name is what makes them readable.

## Features

- #### Callout labels on a donut

  ```tsx
  import {
    ChartContainer,
    PieChart,
    Pie,
    ChartPieCalloutLabel,
    ChartPieCalloutLabelLine,
  } from "@cloud/ui/components/chart";

  <ChartContainer config={config}>
    <PieChart>
      <Pie
        data={rows}
        dataKey="value"
        nameKey="channel"
        innerRadius={60}
        label={<ChartPieCalloutLabel />}
        labelLine={<ChartPieCalloutLabelLine />}
      />
    </PieChart>
  </ChartContainer>;
  ```

  The label and the line both resolve their name and colour from the chart config, so they match the sector.

## Writing guidelines

### Component-specific guidelines

#### Labels

- The series `label` from the chart config is the name the reader sees. Write it for them.
- Include the value, and format it the way the domain reads it — a percentage as a percentage, money as money.

## Accessibility guidelines

### General accessibility guidelines

- Colour alone does not distinguish sectors. The callout name is what makes the chart readable — do not drop it to "clean up" the design.

### Component-specific guidelines

- Callout text is small by nature. It still has to meet contrast against the surface it sits on, which is the page, not the sector.

## Related patterns and components

- [Chart container](chart.md) — the config the callouts resolve names and colours from.
- [Chart bar](chart-bar.md) — the chart to use instead when there are more than a few parts.
- [Data visualization](../patterns/data-visualization.md) — choosing the chart in the first place.

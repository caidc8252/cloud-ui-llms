# Chart bar

Themed bars, with the stacked-corner problem already solved. **Use a bar chart to compare a quantity across categories** — a line chart is for a trend over time, a pie for a part-to-whole with few slices.

[Chart container](chart.md) | [Data visualization](../patterns/data-visualization.md)

## Development guidelines

`ChartBar` bakes in the modern bar look: a bar rounds its **free end** (4px by default) and stays flat where it meets the axis. You do not hand-type a `radius` array.

The hard part is stacking, and it is the reason this component exists. Recharts' `radius` is per-series and static, so naively giving every segment a 4px radius paints a rounded corner on segments buried mid-stack — including ones you cannot see. The correct behaviour is to round **only the free end of the top-most _visible_ segment of each datum**, and that top-most segment changes per column: a series can be zero for one column, or hidden by a legend toggle. `ChartBar` computes it per datum; `createStackedBarShape` and `getStackedBarRadius` power the same logic when you need the shape directly.

Pass `hiddenKeys` when the legend can toggle series off, or the rounding will be applied to a segment the user cannot see.

**Negative values are treated as absent.** Diverging stacks — bars running both ways from a zero line — are deliberately out of scope. If you need one, stop and raise it rather than bending this component into it.

## General guidelines

### Do

- Use bars to compare a quantity across categories, or across time when the individual totals matter more than the shape of the trend.
- Pass `keys` in stack order, and pass `hiddenKeys` whenever the legend can hide a series.
- Let the default 4px radius stand. It is the system's bar look.
- Sort categories by value when there is no natural order — an unsorted bar chart makes the reader do the ranking.

### Don't

- Don't hand-write a `radius` array for a stack. It will round buried segments.
- Don't forget `hiddenKeys` on a chart with a toggleable legend — the rounding will land on an invisible segment.
- Don't build a diverging stack out of negative values. They are read as absent.
- Don't use bars for a continuous trend with many points. Use a line.
- Don't start the value axis anywhere but zero. A truncated bar axis exaggerates the difference it is drawing.

## Features

- #### Stacked bars

  ```tsx
  import {
    ChartContainer,
    ChartBar,
    BarChart,
    XAxis,
  } from "@cloud/ui/components/chart";

  <ChartContainer config={config}>
    <BarChart data={rows}>
      <XAxis dataKey="month" />
      <ChartBar keys={["settled", "pending", "failed"]} hiddenKeys={hidden} />
    </BarChart>
  </ChartContainer>;
  ```

  Only the top-most visible, non-zero segment of each column rounds.

- #### Per-cell colour

  A `BarCellResolver` colours individual cells — for example, painting the bar that breached a threshold with the `error` tone while its peers stay neutral.

## Accessibility guidelines

### General accessibility guidelines

- Colour alone does not distinguish series. Pair the chart with a legend or direct labels.

### Component-specific guidelines

- A per-cell colour that carries meaning (a breached threshold) needs to say so in the tooltip too. A red bar with no explanation is a puzzle.

## Related patterns and components

- [Chart container](chart.md) — the config and the colour variables the bars read.
- [Chart legend](chart-legend.md) — the toggle that produces `hiddenKeys`.
- [Chart sparkline](chart-sparkline.md) — a trend with no chrome, for a tile or a table cell.
- [Data visualization](../patterns/data-visualization.md) — choosing the chart in the first place.

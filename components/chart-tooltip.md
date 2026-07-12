# Chart tooltip

The themed hover readout for a chart. **Use `ChartTooltip` + `ChartTooltipContent`, never Recharts' `Tooltip`** — that one is unthemed, and importing it collides with `@cloud/ui`'s own `Tooltip`.

[Chart container](chart.md) | [Tooltip](tooltip.md) | [Data visualization](../patterns/data-visualization.md)

## Development guidelines

`ChartTooltip` is the Recharts hook-up; `ChartTooltipContent` is what it renders. The content reads the series `label` and colour from the chart config, so a series with no `label` shows the reader a raw data key.

`indicator` picks the swatch: `dot` (default), `line`, `dashed`, or `none`. Match it to the mark — a `line` indicator on a line series, `dot` on bars, `dashed` on a projected or estimated series, so the tooltip reads as the same object the user is pointing at.

`showTotal` adds a summed row with `totalLabel` — the right call on a stacked chart, where the height of the column _is_ the total and the user is otherwise left adding the segments by eye.

`nameKey` and `labelKey` override which field supplies the series name and the tooltip header, for the case where the data's own keys are not what should be shown. `hideLabel` and `hideIndicator` strip the header and the swatch when the context already makes them redundant — a single-series chart rarely needs either.

## General guidelines

### Do

- Import `ChartTooltip` and `ChartTooltipContent` from `@cloud/ui/components/chart`.
- Give every series a `label` in the config, or the tooltip shows a raw key.
- Set `showTotal` on a stacked chart, so the user does not add the segments themselves.
- Match `indicator` to the mark: `line` for lines, `dot` for bars, `dashed` for an estimate.
- Format the value the way the domain reads it — currency as currency, a rate as a percentage. A raw float in a tooltip is a shrug.

### Don't

- Don't import `Tooltip` from `recharts`. It is unthemed and it collides with `@cloud/ui`'s `Tooltip`.
- Don't confuse this with [`Tooltip`](tooltip.md), the hover hint on a control. Different component, different job.
- Don't leave a series unlabelled and expect the tooltip to be readable.
- Don't put an action in a tooltip. It disappears when the pointer leaves; nothing actionable may live only there.

## Features

- #### Themed tooltip on a stacked chart

  ```tsx
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    BarChart,
  } from "@cloud/ui/components/chart";

  <ChartContainer config={config}>
    <BarChart data={rows}>
      <ChartTooltip
        content={<ChartTooltipContent showTotal totalLabel="Total" />}
      />
      {/* … */}
    </BarChart>
  </ChartContainer>;
  ```

## Writing guidelines

### Component-specific guidelines

#### Series names

- The config's `label` is the name the user reads. Write it for them, not for the schema: _Settled volume_, not `settled_volume`.

#### Total row

- `totalLabel` names what is being totalled — _Total volume_ — rather than just _Total_, when the chart carries more than one kind of number.

## Accessibility guidelines

### General accessibility guidelines

- A tooltip is pointer-driven and cannot be the only way to read a value. A keyboard-only or screen-reader user needs the number somewhere else — a legend with values, a summary line, or a table beneath the chart.

## Related patterns and components

- [Chart container](chart.md) — the config the tooltip reads its labels and colours from.
- [Chart legend](chart-legend.md) — the other place series names surface.
- [Tooltip](tooltip.md) — the unrelated hover hint for a control.
- [Data visualization](../patterns/data-visualization.md).

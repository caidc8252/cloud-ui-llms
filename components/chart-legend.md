# Chart legend

The themed series key for a chart, optionally clickable to toggle series. **Use `ChartLegend` + `ChartLegendContent`, never Recharts' `Legend`.**

[Chart container](chart.md) | [Chart bar](chart-bar.md) | [Data visualization](../patterns/data-visualization.md)

## Development guidelines

`ChartLegend` is the Recharts hook-up; `ChartLegendContent` renders it, reading each series' `label` and colour from the chart config.

`verticalAlign` puts it `top` or `bottom`. `indicator` is `dot` or `line` — match it to the mark, as with the tooltip. `hideIcon` drops the swatch when the names alone carry it.

### Toggling is a controlled pair

`hidden` is a `Record<string, boolean>` of the series you are currently suppressing, and `onToggle(seriesKey)` fires when the user clicks one. **The legend does not own that state** — you do. Hold it, pass it back through `hidden`, and pass the same set to `ChartBar`'s `hiddenKeys`, or the bar rounding will land on a segment the user has just hidden. A legend whose toggle is wired to the chart but not to `ChartBar` produces a chart that looks subtly wrong and gives no clue why.

## General guidelines

### Do

- Give every series a `label` in the config. The legend has nothing else to show.
- When the legend toggles, hold `hidden` yourself and pass the same set to `ChartBar`'s `hiddenKeys`.
- Match `indicator` to the mark — `line` for lines, `dot` for bars.
- Drop the legend entirely on a single-series chart. There is nothing to key.

### Don't

- Don't import `Legend` from `recharts`. It is unthemed.
- Don't wire a toggle to the chart and forget `ChartBar`'s `hiddenKeys`. The corners will round on hidden segments.
- Don't make the legend the only way to read which series is which on a chart with many similar colours. Direct labels beat a legend the eye has to shuttle to.
- Don't keep a legend on a single-series chart to "look complete".

## Features

- #### Toggleable legend

  ```tsx
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  <ChartContainer config={config}>
    <BarChart data={rows}>
      <ChartLegend
        content={
          <ChartLegendContent
            hidden={hidden}
            onToggle={(key) => setHidden((h) => ({ ...h, [key]: !h[key] }))}
          />
        }
      />
      <ChartBar
        keys={keys}
        hiddenKeys={Object.keys(hidden).filter((k) => hidden[k])}
      />
    </BarChart>
  </ChartContainer>;
  ```

  The same hidden set feeds both the legend and the bars.

## Accessibility guidelines

### General accessibility guidelines

- A clickable legend item is a control: it takes keyboard focus, it responds to Enter and Space, and it keeps its focus ring.

### Component-specific guidelines

- A toggled-off series must be announced as such, not merely dimmed. Dimming is a visual cue, and it is the only cue a screen-reader user does not get.

## Related patterns and components

- [Chart container](chart.md) — the config the legend reads.
- [Chart bar](chart-bar.md) — the `hiddenKeys` the toggle must also feed.
- [Chart tooltip](chart-tooltip.md) — the other place series names surface.
- [Data visualization](../patterns/data-visualization.md).

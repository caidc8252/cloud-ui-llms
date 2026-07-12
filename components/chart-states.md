# Chart states

`ChartSkeleton` while the data loads, `ChartEmpty` when there is none. **A chart with no data is not an empty page** — the chrome around it is still valid, and blanking the whole region loses the user's place.

[Chart container](chart.md) | [Empty](empty.md) | [Empty states](../patterns/empty-states.md)

## Development guidelines

Both states render **inside** the chart's own box, at the chart's own size. That is the point: the card, its title, and its controls stay put, and only the plot area changes. Replacing the container itself makes the layout jump when the data arrives, and a dashboard of six charts that each jump is a dashboard that never settles.

`ChartSkeleton` mimics the plot area's shape while the request is in flight. `ChartEmpty` takes a title, a description, and an optional icon, and says **why** there is nothing to draw.

### Empty is not one state

A chart draws nothing for more than one reason, and the reasons take different words and different exits:

- **No data yet** — the resource is new, nothing has happened. Say so, and offer the action that would make something happen.
- **No data in this range** — the filters or the date range exclude everything. Say _that_, and offer to widen the range. A user who is told "no data" when they have simply picked last Tuesday will go looking for a bug.
- **Failed to load** — this is not empty. Show an error with a retry, not an empty state.

See [Empty states](../patterns/empty-states.md), which draws the same distinction for lists.

## General guidelines

### Do

- Render both states inside the chart's box, at the chart's size, so the layout does not jump.
- Say which kind of empty it is. "No data in the selected range" and "No data yet" send the user to different places.
- Offer the exit that matches: widen the range, clear the filter, or create the thing.
- Show an error with a retry when the load failed. That is not an empty state.

### Don't

- Don't replace the chart's container. Keep the card, the title, and the controls.
- Don't show a skeleton that is a different shape from the chart it stands in for. The jump is the thing you were avoiding.
- Don't write "No data" and stop. It tells the user nothing they cannot see.
- Don't leave a spinner where a skeleton belongs — a chart has a shape worth reserving.

## Features

- #### Loading and empty

  ```tsx
  import {
    ChartContainer,
    ChartSkeleton,
    ChartEmpty,
  } from "@cloud/ui/components/chart";

  <Card>
    <CardHeader>
      <CardTitle>Settlement volume</CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <ChartSkeleton />
      ) : rows.length === 0 ? (
        <ChartEmpty
          title="No settlements in this range"
          description="Widen the date range to see earlier activity."
        />
      ) : (
        <ChartContainer config={config}>{/* … */}</ChartContainer>
      )}
    </CardContent>
  </Card>;
  ```

  The card and its title never move.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.

### Component-specific guidelines

#### Titles

- Name the absence and its cause: _No settlements in this range_. Not _No data_.

#### Descriptions

- Give the user the next move: _Widen the date range to see earlier activity._

## Accessibility guidelines

### General accessibility guidelines

- A load a screen-reader user must know about needs a live-region status message. A pulsing skeleton is silent.

### Component-specific guidelines

- The empty state's title and description are the accessible content of the region. An icon alone says nothing.

## Related patterns and components

- [Chart container](chart.md) — what these stand in for.
- [Empty](empty.md) — the same job for a table, a list, or a panel.
- [Empty states](../patterns/empty-states.md) — first-run vs filtered-out vs no-access, and the exit each one takes.
- [Skeleton](skeleton.md), [Spinner](spinner.md).

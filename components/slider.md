# Slider

Draggable track and thumb for selecting a numeric value or range.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/slider.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Slider` is a client component built on `@base-ui/react`'s `Slider`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Slider` renders a track, a filled range, and one thumb per value. Pass a single number for one thumb, or an array for a range — the component renders a thumb for each value in `value` or `defaultValue`. `min` and `max` default to `0` and `100`.

Set `orientation="vertical"` for a vertical track; a vertical slider needs a height from its container. Drive the value with `value` and `onValueChange`, or leave it uncontrolled with `defaultValue`.

Use a slider for an approximate value where the exact number is not critical. When the precise number matters, pair it with a numeric input or use `Stepper`.

## General guidelines

### Do

- Use a slider for an approximate numeric value across a continuous range.
- Use an array value for a range with two thumbs.
- Provide an accessible label for the slider.
- Pair the slider with a visible value read-out when the number matters.

### Don't

- Don't use a slider when the user needs to enter an exact number. Use `Stepper` or an input.
- Don't use it for a small set of discrete choices. Use `RadioGroup` or `Select`.
- Don't omit the accessible name; a bare track is not self-describing.

## Features

- #### Single value and range

  Pass a single value for one thumb, or an array for a range.

  ```tsx
  import { Slider } from "@cloud/ui"

  <Slider defaultValue={40} min={0} max={100} aria-label="Volume" />
  <Slider defaultValue={[20, 80]} aria-label="Price range" />
  ```

- #### Min, max, and step

  `min` and `max` bound the range (default `0` and `100`); pass Base UI's `step` to quantize the value.

- #### Orientation

  Set `orientation="vertical"` for a vertical track. Give the container a height so the vertical slider has room.

### States

- #### Focus

  Each thumb takes a focus-visible ring. Preserve it when restyling.

- #### Disabled

  A disabled slider shows a not-allowed cursor and reduced opacity, and its thumbs do not move.

## Writing guidelines

`Slider` renders no text of its own. Label it through its accessible name, and format any visible value read-out consistently with the rest of the form.

## Accessibility guidelines

### General accessibility guidelines

- Give the slider an accessible name (`aria-label` or an associated label). For a range, ensure each thumb's purpose is clear.
- Preserve keyboard behavior from the Base UI primitive: the thumb moves with the arrow keys.
- Don't rely on the visual position alone; expose the current value.

### Component-specific guidelines

#### Keyboard interaction

- Tab focuses a thumb; the arrow keys move it by the step, and Home and End jump to the bounds.
- For a range, each thumb is focused and moved independently.

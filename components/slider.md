# Slider

Draggable track and thumb for selecting a numeric value or range.

`Slider` is a client component built on `@base-ui/react`'s `Slider`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Slider` renders a track, a filled range, and one thumb per value. The thumb count comes from the **array length** of `value` or `defaultValue`: pass a one-element array for a single thumb and a two-element array for a range. Pass an array even when there is only one value — a bare number falls back to two thumbs sitting at `[min, max]`. `min` and `max` default to `0` and `100`.

Set `orientation="vertical"` for a vertical track; a vertical slider carries a built-in minimum height of 160px, and grows if its container is taller. Drive the value with `value` and `onValueChange`, or leave it uncontrolled with `defaultValue`.

Use a slider for an approximate value where the exact number is not critical. When the precise number matters, pair it with a numeric input or use `Stepper`.

## General guidelines

### Do

- Use a slider for an approximate numeric value across a continuous range.
- Always pass `value` / `defaultValue` as an array — one element for a single thumb, two for a range.
- Provide an accessible label for the slider.
- Pair the slider with a visible value read-out when the number matters.

### Don't

- Don't use a slider when the user needs to enter an exact number. Use `Stepper` or an input.
- Don't use it for a small set of discrete choices. Use `RadioGroup` or `Select`.
- Don't pass a bare number as the value; it renders two thumbs at the bounds instead of one.
- Don't omit the accessible name; a bare track is not self-describing.

## Features

- #### Single value and range

  A one-element array gives one thumb; a two-element array gives a range.

  ```tsx
  import { Slider } from "@cloud/ui"

  <Slider defaultValue={[40]} min={0} max={100} aria-label="Volume" />
  <Slider defaultValue={[20, 80]} aria-label="Price range" />
  ```

- #### Min, max, and step

  `min` and `max` bound the range (default `0` and `100`); pass Base UI's `step` to quantize the value. Thumbs are edge-aligned to the track, so the ends of the track are the ends of the range.

- #### Orientation

  Set `orientation="vertical"` for a vertical track. It comes with a 160px minimum height; give the container more height for a taller track.

### States

- #### Focus

  Each thumb takes a focus-visible ring — the same ring it shows on hover and while dragging. Preserve it when restyling.

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

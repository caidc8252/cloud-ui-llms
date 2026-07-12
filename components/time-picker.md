# Time picker

A time-only field. **Use it when the date is already known or irrelevant** — a daily cutoff, a maintenance window, a business-hours row. For a date and a time together, use `DateTimePicker`.

[Date picker](date-picker.md) | [Date-time picker](date-time-picker.md) | [Timestamps](../patterns/timestamps.md)

## Development guidelines

`TimePicker` is built on the native `<input type="time">`. The value is a **24-hour string** — `"HH:mm"`, or `"HH:mm:ss"` when `withSeconds` is set — and the browser renders it as 12-hour or 24-hour **according to the user's locale**, on its own. Do not format it yourself, and do not try to force a display format: you would be overriding the one thing the platform already gets right per locale.

It follows the `DatePicker` family's shape: controlled through `value` / `onValueChange`, or uncontrolled through `defaultValue`. A leading clock icon and a clear button mirror the date fields, and the browser's own calendar-picker indicator is hidden in favour of them.

`step` sets the granularity in seconds, and `min` / `max` bound the range — both in the same `"HH:mm"` string form as the value. A cleared field reports `null`, not `""`, so an optional time reads as absent rather than as an empty string that has to be re-interpreted downstream.

`size` is `sm`, `md` (default), or `lg`, and lines up with `Input` and `Button` at the same size.

## General guidelines

### Do

- Use it when only the time-of-day matters. A date the user must also pick belongs in `DateTimePicker`.
- Bound the field with `min` / `max` when only part of the day is legal, rather than accepting a time and rejecting it on submit.
- Set `step` to the granularity the domain actually has — 15-minute slots, not seconds, unless seconds mean something.
- Treat the cleared value as `null`. It is not `""`.
- Wrap it in a `Field` so it has a label, a hint, and somewhere for its error to go.

### Don't

- Don't reformat the value for display. The browser already renders 12h or 24h per the user's locale; overriding that breaks it for everyone else.
- Don't store the string. A time-of-day is a domain value; a _timestamp_ is integer seconds — see [Timestamps](../patterns/timestamps.md).
- Don't use it for a duration. A duration is a number with a unit, not a clock face.
- Don't set `withSeconds` unless seconds carry meaning. A seconds field the user must tab through is friction with no payload.

## Features

- #### Value

  ```tsx
  import { TimePicker } from "@cloud/ui";

  <TimePicker value={cutoff} onValueChange={setCutoff} />;
  ```

  `cutoff` is `"09:30"`, or `null` when cleared.

- #### Seconds, step, and bounds

  ```tsx
  <TimePicker
    value={windowStart}
    onValueChange={setWindowStart}
    withSeconds
    step={900}
    min="08:00"
    max="20:00"
  />
  ```

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.

### Component-specific guidelines

#### Labels

- Name the time, not the control: _Daily cutoff_, _Window opens_. Not _Time_.

#### Hints

- State the timezone the value is interpreted in, when it is not obvious. A cutoff with no timezone is a bug waiting for a support ticket.

## Accessibility guidelines

### General accessibility guidelines

- The control needs a programmatic label. `Field`'s `label` supplies it; the clock icon does not.
- Never remove the focus ring.

### Component-specific guidelines

- The native input is keyboard-navigable by segment (hour, minute) on its own. Do not intercept arrow keys.
- The clear button is icon-only and needs an `aria-label`.

## Related patterns and components

- [Date picker](date-picker.md) — a date alone.
- [Date-time picker](date-time-picker.md) — a date and a time as one field.
- [Date range picker](date-range-picker.md) — an interval.
- [Timestamps](../patterns/timestamps.md) — how a moment in time is stored and rendered, which is a different question from how one is entered.
- [Field](field.md), [Input](input.md).

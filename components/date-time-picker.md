# DateTimePicker

Date-and-time field. An input-styled trigger that opens a calendar with a time entry beneath it.

`DateTimePicker` is a client component, built from `Popover` and `Calendar`. It is a single component driven by props. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`DateTimePicker`'s trigger is styled like an `Input`. Clicking it opens a popover with a `Calendar` in `single` mode on top, and an `Input` of `type="time"` plus an OK button underneath — the user picks a day, sets a time, and confirms.

The value is a single `Date | null` carrying both parts, controlled through `value` / `onValueChange` or uncontrolled through `defaultValue` (default `null`). `formatStr` applies to the **date part only**; the time is always rendered as 24-hour `HH:mm`. Like `DatePicker`, `formatStr` and `placeholder` already default to the active locale, so override them only when this field needs something more specific. The hidden form input emits the full ISO string (`value.toISOString()`), so a plain form post carries date and time together — in UTC, which is what you want on the wire.

Every change commits immediately: choosing a day emits a new `Date`, and so does editing the time. The OK button only closes the popover — it is a confirmation affordance, not a commit, and there is no cancel. The one exception is the time field before a day exists: with no value, editing the time updates the popover's own draft and emits nothing; it is applied the moment a day is picked. Until then the draft time is `00:00`, so picking a day on an empty field gives you midnight.

Once a value is set, a clear (×) button appears in the trigger and resets it to `null`, unless the field is `required` or `disabled`.

`minDate` and `maxDate` bound the calendar; both are normalized to the start and end of their day, so an intraday timestamp doesn't disable the boundary day. `size` is `sm`, `md` (default), or `lg`; `invalid` gives the trigger the destructive border and ring plus `aria-invalid`, matching `Input` and `Select`. `name`, `required`, and `id` wire it into a form and to a `Field` label (via the field's `htmlFor`).

Note there is no `disabledDays` here — if you need to block individual days as well as bound the window, that's `DatePicker`. And when the time doesn't matter, don't ask for it: use `DatePicker`. When the _date_ doesn't matter, use `TimePicker`.

## General guidelines

### Do

- Use it only when the time genuinely matters; otherwise use `DatePicker`.
- Bound the window with `minDate` and `maxDate`.
- Say which timezone the time is in, near the field — the emitted value is UTC.
- Match the `size` to the other fields on the form.

### Don't

- Don't expect `formatStr` to change the time display; the time is always 24-hour `HH:mm`.
- Don't treat OK as the commit or Escape as a cancel; every choice is already emitted.
- Don't ask for a time the user doesn't have. A required time on a date-only concept invents precision.
- Don't leave the timezone ambiguous on a scheduling field.

## Features

- #### Value

  One `Date | null` carries both the day and the time.

  ```tsx
  import { useState } from "react";
  import { DateTimePicker } from "@cloud/ui";

  const [runAt, setRunAt] = useState<Date | undefined>();

  <DateTimePicker
    value={runAt}
    onValueChange={setRunAt}
    placeholder={t("schedule.placeholder")}
  />;
  ```

- #### Format

  `formatStr` formats the date part in the trigger. The time part is always `HH:mm`, 24-hour.

- #### Bounds

  `minDate` and `maxDate` clamp the calendar.

  ```tsx
  <DateTimePicker value={runAt} onValueChange={setRunAt} minDate={new Date()} />
  ```

- #### In a form

  The hidden input emits the full ISO string, so `name`, `required`, and `id` work as they do on any field.

### States

- **Empty** — the trigger shows the `placeholder` in muted text.
- **Filled** — the formatted date followed by `HH:mm`, plus a clear (×) button unless the field is `required` or `disabled`.
- **Invalid** — destructive border and ring, and `aria-invalid` on the trigger.
- **Disabled** — the trigger is dimmed, the popover won't open, and the time input is disabled with it.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Placeholder: name what is being scheduled, such as `Pick a run time`.
- Put the timezone in the label or in helper text — `Run at (UTC)` — so the time is unambiguous.

## Accessibility guidelines

### General accessibility guidelines

- The trigger is a real button, the time entry is a native `type="time"` input, and focus moves into the popover and back out on close.
- Give the picker a visible label. Inside a `Field`, set `htmlFor` to the picker's `id` so the label points at it.
- `invalid` sets `aria-invalid`, but the red border is not a message — pair it with `Field`'s `error`.

### Component-specific guidelines

#### Keyboard interaction

- Enter or Space on the trigger opens the popover.
- The arrow keys move between days in the calendar; Tab reaches the time input and the OK button.
- The native time input takes typed digits and the arrow keys.
- OK closes the popover, and Escape closes it too — but neither cancels: the day and time already committed as they were chosen.

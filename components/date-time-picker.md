# DateTimePicker

Date-and-time field. An input-styled trigger that opens a calendar with a time entry beneath it.

`DateTimePicker` is a client component, built from `Popover` and `Calendar`. It is a single component driven by props. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`DateTimePicker`'s trigger is styled like an `Input`. Clicking it opens a popover with a `Calendar` in `single` mode on top, and a native `<input type="time">` plus an OK button underneath — the user picks a day, sets a time, and confirms.

The value is a single `Date | null` carrying both parts, controlled through `value` / `onValueChange` or uncontrolled through `defaultValue`. `formatStr` applies to the **date part only**; the time is always rendered as 24-hour `HH:mm`. The hidden form input emits the full ISO string (`value.toISOString()`), so a plain form post carries date and time together — in UTC, which is what you want on the wire.

`minDate` and `maxDate` bound the calendar. `size` is `sm`, `md`, or `lg`; `invalid` gives the trigger the destructive border and ring plus `aria-invalid`, matching `Input` and `Select`. `name`, `required`, and `id` wire it into a form and to a `FieldLabel`.

Note there is no `disabledDays` here — if you need to block individual days as well as bound the window, that's `DatePicker`. And when the time doesn't matter, don't ask for it: use `DatePicker`.

## General guidelines

### Do

- Use it only when the time genuinely matters; otherwise use `DatePicker`.
- Bound the window with `minDate` and `maxDate`.
- Say which timezone the time is in, near the field — the emitted value is UTC.
- Match the `size` to the other fields on the form.

### Don't

- Don't expect `formatStr` to change the time display; the time is always 24-hour `HH:mm`.
- Don't ask for a time the user doesn't have. A required time on a date-only concept invents precision.
- Don't leave the timezone ambiguous on a scheduling field.

## Features

- #### Value

  One `Date | null` carries both the day and the time.

  ```tsx
  import { DateTimePicker } from "@cloud/ui";

  <DateTimePicker value={runAt} onValueChange={setRunAt} placeholder={t("schedule.placeholder")} />;
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
- **Invalid** — destructive border and ring, and `aria-invalid` on the trigger.
- **Disabled** — the trigger is dimmed and the popover won't open.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Placeholder: name what is being scheduled, such as `Pick a run time`.
- Put the timezone in the label or in helper text — `Run at (UTC)` — so the time is unambiguous.

## Accessibility guidelines

### General accessibility guidelines

- The trigger is a real button, the time entry is a native time input, and focus moves into the popover and back out on close.
- Give the picker a visible label. Inside a `Field`, `FieldLabel` associates it through `id`.
- `invalid` sets `aria-invalid`, but the red border is not a message — pair it with a `FieldError`.

### Component-specific guidelines

#### Keyboard interaction

- Enter or Space on the trigger opens the popover.
- The arrow keys move between days in the calendar; Tab reaches the time input and the OK button.
- The native time input takes typed digits and the arrow keys; Enter or OK confirms and closes; Escape closes without choosing.

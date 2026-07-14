# DatePicker

Single-date field. An input-styled trigger that opens a calendar popover.

`DatePicker` is a client component. It is a single component driven by props, built from `Popover` and `Calendar`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`DatePicker` is the date _field_. Its trigger is a button styled to look exactly like an `Input`, and clicking it opens a popover holding a `Calendar` in `single` mode.

The value type is `Date | null` — controlled through `value` / `onValueChange`, or uncontrolled through `defaultValue` (default `null`). `formatStr` sets how the chosen date is rendered in the trigger; `placeholder` is what shows when there is none. Both already follow the active locale: `placeholder` falls back to the built-in translated string, and `formatStr` to that locale's default pattern (`MMM d, yyyy` in English). Override them only when this field needs something more specific — and pass a translated string when you do.

Once a date is set, a clear (×) button appears inside the trigger and resets the value to `null`. It is suppressed when the field is `required` or `disabled`.

Bound the selectable dates with `minDate` and `maxDate`, or with `disabledDays`, a predicate that receives a `Date` and returns whether it can't be picked. Blocking a date is better than accepting it and rejecting it afterwards. `minDate` and `maxDate` are normalized to the start and end of their day, so passing a timestamp doesn't accidentally disable the boundary day.

`size` is `sm`, `md` (default), or `lg`, matching `Input` and `Button`. `invalid` puts the destructive border and ring on the trigger and sets `aria-invalid`, exactly as `Input` and `Select` do. Pass `name`, `required`, and `id` to wire it into a form and to a `Field` label (via the field's `htmlFor`); `name` renders a hidden input carrying the date as `yyyy-MM-dd`.

For a range, use `DateRangePicker`. When a time comes with the date, use `DateTimePicker`. For a time on its own, use `TimePicker`. Use `Calendar` directly only when the month grid _is_ the page.

## General guidelines

### Do

- Use `minDate`, `maxDate`, or `disabledDays` to block dates that can't be chosen.
- Let `placeholder` and `formatStr` fall back to the locale defaults; if you override them, pass a translated string and a locale-appropriate pattern.
- Match the `size` to the other fields on the form.
- Set `invalid` and pair it with `Field`'s `error` message.

### Don't

- Don't use a date picker for a range. Use `DateRangePicker`.
- Don't accept a date you'll reject on submit; disable it up front.
- Don't hardcode a date format; the format is locale-dependent.

## Features

- #### Value

  The value is `Date | null`.

  ```tsx
  import { useState } from "react";
  import { DatePicker } from "@cloud/ui";

  const [date, setDate] = useState<Date | undefined>();

  <DatePicker
    value={date}
    onValueChange={setDate}
    placeholder={t("settlement.datePlaceholder")}
  />;
  ```

- #### Bounds

  `minDate` and `maxDate` clamp the range; `disabledDays` is a predicate for anything more specific, such as blocking weekends.

  ```tsx
  <DatePicker
    value={date}
    onValueChange={setDate}
    minDate={new Date()}
    disabledDays={(d) => d.getDay() === 0 || d.getDay() === 6}
  />
  ```

- #### Size and invalid

  `size` is `sm`, `md` (default), or `lg`. `invalid` gives the trigger the destructive border and ring plus `aria-invalid`.

- #### In a form

  `name`, `required`, and `id` wire the picker into a form and to its label. `name` renders a hidden input holding the date as `yyyy-MM-dd`; `required` also removes the clear button.

### States

- **Empty** — the trigger shows the `placeholder` in muted text.
- **Filled** — the formatted date, plus a clear (×) button unless the field is `required` or `disabled`.
- **Invalid** — destructive border and ring, and `aria-invalid` on the trigger.
- **Disabled** — the trigger is dimmed and the popover won't open.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Placeholder: name what the date is, such as `Pick a settlement date`.
- If some dates are blocked, say why in helper text. A calendar that silently refuses a date is a dead end.

## Accessibility guidelines

### General accessibility guidelines

- The trigger is a real button that opens the popover, and focus moves into the calendar and back out again on close.
- Give the picker a visible label. Inside a `Field`, set `htmlFor` to the picker's `id` so the label points at it.
- `invalid` sets `aria-invalid`, but the red border is not a message — pair it with `Field`'s `error`.

### Component-specific guidelines

#### Keyboard interaction

- Enter or Space on the trigger opens the calendar.
- The arrow keys move between days, and Page Up / Page Down move between months.
- Enter selects the focused day and closes the popover; Escape closes it without choosing.

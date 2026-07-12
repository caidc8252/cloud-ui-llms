# DatePicker

Single-date field. An input-styled trigger that opens a calendar popover.

`DatePicker` is a client component. It is a single component driven by props, built from `Popover` and `Calendar`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`DatePicker` is the date _field_. Its trigger is a button styled to look exactly like an `Input`, and clicking it opens a popover holding a `Calendar` in `single` mode.

The value type is `Date | null` — controlled through `value` / `onValueChange`, or uncontrolled through `defaultValue`. `formatStr` sets how the chosen date is rendered in the trigger; `placeholder` is what shows when there is none. Both are user-facing, so pass a translated `placeholder` and a `formatStr` that suits the locale.

Bound the selectable dates with `minDate` and `maxDate`, or with `disabledDays`, a predicate that receives a `Date` and returns whether it can't be picked. Blocking a date is better than accepting it and rejecting it afterwards.

`size` is `sm`, `md`, or `lg`, matching `Input` and `Button`. `invalid` puts the destructive border and ring on the trigger and sets `aria-invalid`, exactly as `Input` and `Select` do. Pass `name`, `required`, and `id` to wire it into a form and to a `FieldLabel`.

For a range, use `DateRangePicker`. When a time comes with the date, use `DateTimePicker`. Use `Calendar` directly only when the month grid _is_ the page.

## General guidelines

### Do

- Use `minDate`, `maxDate`, or `disabledDays` to block dates that can't be chosen.
- Pass a translated `placeholder` and a locale-appropriate `formatStr`.
- Match the `size` to the other fields on the form.
- Set `invalid` and pair it with a `FieldError` message.

### Don't

- Don't use a date picker for a range. Use `DateRangePicker`.
- Don't accept a date you'll reject on submit; disable it up front.
- Don't hardcode a date format; the format is locale-dependent.

## Features

- #### Value

  The value is `Date | null`.

  ```tsx
  import { DatePicker } from "@cloud/ui";

  <DatePicker value={date} onValueChange={setDate} placeholder={t("settlement.datePlaceholder")} />;
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

  `name`, `required`, and `id` wire the picker into a form and to its label.

### States

- **Empty** — the trigger shows the `placeholder` in muted text.
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
- Give the picker a visible label. Inside a `Field`, `FieldLabel` associates it through `id`.
- `invalid` sets `aria-invalid`, but the red border is not a message — pair it with a `FieldError`.

### Component-specific guidelines

#### Keyboard interaction

- Enter or Space on the trigger opens the calendar.
- The arrow keys move between days, and Page Up / Page Down move between months.
- Enter selects the focused day and closes the popover; Escape closes it without choosing.

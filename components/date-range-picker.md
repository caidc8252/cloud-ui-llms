# DateRangePicker

Date-range field. An input-styled trigger that opens presets beside a range calendar.

`DateRangePicker` is a client component, built from `Popover` and `Calendar`. It exports the component, the `DateRange` and `DateRangePreset` types, and the `DEFAULT_RANGE_PRESETS` array. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`DateRangePicker`'s trigger is styled like an `Input`; clicking it opens a popover with the presets down the left and a `Calendar` in `range` mode — two months side by side — on the right.

The value is a `DateRange` — `{ from: Date; to: Date }` — or `null`. **`onValueChange` fires only when both ends are picked.** A half-finished selection is held internally as a draft and never reaches you, so you will not see a range with a `from` and no `to`. The two clicks are normalized, so picking the later day first still yields `from` before `to`. Once a range is set, a clear (×) button appears in the trigger and resets the value to `null`, unless the field is `required` or `disabled`.

`presets` replaces the built-in list, which is `DEFAULT_RANGE_PRESETS`: today, the last 7 days, the last 30 days, this month, and last month. Each preset is `{ key, label?, getValue }`, where `getValue` is `(now?: Date) => DateRange` — it takes an optional reference date, so you can pin "now" and keep boundaries deterministic in tests. The built-in presets carry only a `key`; their labels come from the `ui.datePicker.presets` translations, so they are already localized. A custom preset with an unknown key falls back to rendering the raw key string — give it a translated `label`. Passing `presets={[]}` hides the preset column entirely.

Bound the calendar with `minDate`, `maxDate`, and `disabledDays`. `size` is `sm`, `md` (default), or `lg`; `invalid` gives the trigger the destructive border and ring plus `aria-invalid`, matching `Input` and `Select`. `formatStr` formats each end of the range in the trigger, defaulting to the active locale's date pattern; `placeholder` likewise falls back to the built-in translated string.

There is no `name` prop and no hidden input here — unlike `DatePicker` and `DateTimePicker`, the range never posts itself. Submit it from state.

## General guidelines

### Do

- Offer presets for the ranges people actually ask for; they are faster than any calendar.
- Give your custom presets translated labels.
- Bound the calendar with `minDate` / `maxDate` when only part of the timeline has data.
- Match the `size` to the other controls on the filter bar.

### Don't

- Don't expect a partial range from `onValueChange`; it fires only when both ends are set.
- Don't use a range picker for one date. Use `DatePicker`.
- Don't hardcode preset labels or the date format.

## Features

- #### Value

  The value is `{ from, to }` or `null`, and it arrives only once both ends are chosen.

  ```tsx
  import { DateRangePicker, type DateRange } from "@cloud/ui";

  const [range, setRange] = React.useState<DateRange | null>(null);

  <DateRangePicker value={range} onValueChange={setRange} placeholder={t("filters.dateRange")} />;
  ```

- #### Presets

  `DEFAULT_RANGE_PRESETS` gives today, last 7 days, last 30 days, this month, and last month, already labelled from the built-in translations. Pass your own `presets` to extend or replace the list; a custom preset needs a `label` of its own.

  ```tsx
  import { DateRangePicker, DEFAULT_RANGE_PRESETS, type DateRangePreset } from "@cloud/ui";
  import { startOfYear } from "date-fns";

  const presets: DateRangePreset[] = [
    ...DEFAULT_RANGE_PRESETS,
    {
      key: "ytd",
      label: t("range.ytd"),
      getValue: (now = new Date()) => ({ from: startOfYear(now), to: now }),
    },
  ];

  <DateRangePicker value={range} onValueChange={setRange} presets={presets} />;
  ```

- #### Bounds

  `minDate`, `maxDate`, and `disabledDays` block dates that can't be picked, at either end of the range.

- #### Size and invalid

  `size` is `sm`, `md` (default), or `lg`. `invalid` gives the trigger the destructive border and ring plus `aria-invalid`.

### States

- **Empty** — the trigger shows the `placeholder`.
- **Filled** — both ends formatted and separated by an en dash, plus a clear (×) button unless the field is `required` or `disabled`.
- **Mid-selection** — one end picked; the popover shows the partial range and `onValueChange` has not fired.
- **Invalid** — destructive border and ring, and `aria-invalid` on the trigger.
- **Disabled** — the trigger is dimmed and the popover won't open.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Placeholder: name the range, such as `Pick a date range`.
- Preset labels: name the range the way people say it — `Last 7 days`, `This month`.

## Accessibility guidelines

### General accessibility guidelines

- The trigger is a real button, the presets are real buttons, and focus moves into the popover and back out on close.
- Give the picker a visible label. Inside a `Field`, set `htmlFor` to the picker's `id` so the label points at it.
- `invalid` sets `aria-invalid`, but the red border is not a message — pair it with `Field`'s `error`.

### Component-specific guidelines

#### Keyboard interaction

- Enter or Space on the trigger opens the popover.
- Tab moves between the preset list and the calendar; Enter picks a preset.
- In the calendar, the arrow keys move between days and Enter sets each end of the range; Escape closes the popover.

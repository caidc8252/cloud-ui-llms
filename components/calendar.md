# Calendar

Month-view date picker for selecting a single date, several dates, or a range.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/calendar.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Calendar` is powered by `react-day-picker`. It exports `Calendar` and the `CalendarDayButton` it renders for each day. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Calendar` is the raw month grid. It takes every `DayPicker` prop: `mode` (`single`, `multiple`, or `range`), `selected`, `onSelect`, `disabled`, `numberOfMonths`, and so on. The design-system wrapper sets the surface, the cell size and radius, the navigation chevrons (mirrored for RTL), and the day button styling.

Its own props are `showOutsideDays` (default `true` — days from the neighbouring months are shown, greyed), `captionLayout` (default `label` — pass `dropdown` for month and year selects), `buttonVariant` (default `ghost` — the `Button` variant used for the navigation arrows), and `locale`, `formatters`, and `components` for localizing and overriding pieces of the grid.

Most of the time you should not reach for `Calendar` directly. It is the grid the higher-level recipes are built from: use `DatePicker` for one date in a field, `DateRangePicker` for a range, and `DateTimePicker` when a time comes with it. Use `Calendar` on its own only when the month grid is the page — an availability view, a schedule — rather than the popup behind an input.

Pass `locale` from your i18n setup. Without it, month and weekday names fall back to English regardless of the user's locale.

## General guidelines

### Do

- Use `DatePicker`, `DateRangePicker`, or `DateTimePicker` for a date _field_; use `Calendar` only when the grid itself is the interface.
- Pass a `locale`, so month and weekday names follow the user's language.
- Use `disabled` to block dates that can't be chosen, rather than letting the user pick one and then rejecting it.
- Use `captionLayout="dropdown"` when the user may need to jump years.

### Don't

- Don't rebuild a date field around `Calendar`; the recipes already exist.
- Don't leave the calendar unlabelled when it stands alone on the page.
- Don't rely on `showOutsideDays` to extend the range; outside days belong to the neighbouring month.

## Features

- #### Selection mode

  `mode` is `single`, `multiple`, or `range`, and `selected` / `onSelect` take the matching shape.

  ```tsx
  import { Calendar } from "@cloud/ui";

  <Calendar mode="single" selected={date} onSelect={setDate} locale={dateLocale} />;

  <Calendar
    mode="range"
    selected={range}
    onSelect={setRange}
    numberOfMonths={2}
    locale={dateLocale}
  />;
  ```

- #### Caption layout

  `captionLayout` is `label` (default — the month and year as text) or `dropdown`, which turns them into selects for jumping across months and years.

- #### Disabled dates

  `disabled` takes a date, an array, a range, or a predicate.

  ```tsx
  <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} />
  ```

- #### Navigation buttons

  `buttonVariant` (default `ghost`) sets the `Button` variant used for the previous and next arrows. The chevrons mirror automatically under RTL.

### States

- **Selected** — the day button takes the primary fill; in `range` mode the endpoints are filled and the days between are tinted.
- **Today** — marked distinctly from the selection, so "today" and "chosen" don't read as the same thing.
- **Outside** — days from the neighbouring months are muted.
- **Disabled** — dimmed and not selectable.

## Writing guidelines

### General writing guidelines

- Use the user's locale for month, weekday, and date formats — never a hardcoded `MM/DD/YYYY`.

### Component-specific guidelines

- Label the calendar by what it selects, such as `Settlement date`.
- When some dates are disabled, say why nearby — a calendar that silently refuses a date is a dead end.

## Accessibility guidelines

### General accessibility guidelines

- The grid, day buttons, and navigation carry the correct roles and relationships through `react-day-picker`.
- Give a standalone calendar an accessible name with `aria-label` or a visible heading.
- Don't rely on color alone to distinguish today from the selected day.

### Component-specific guidelines

#### Keyboard interaction

- The arrow keys move between days, and Page Up / Page Down move between months.
- Home and End jump to the start and end of the week.
- Enter or Space selects the focused day.

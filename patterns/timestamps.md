# Timestamps

How dates and times are entered, formatted, aligned, and explained in the interface.

## Key UX concepts

### Format for the viewer

Render dates and times with the viewer's locale and an explicit relevant timezone. The interface should not expose raw timestamp formats or make users infer which timezone a value represents.

When the timezone is not obvious from context, include it in the label or displayed value. A scheduled time without a timezone is incomplete.

### Classify the user's task before choosing a control

- **Calendar date** — a day without a time, such as a billing date. Use `DatePicker`.
- **Time of day** — a recurring or contextual time without a date. Use `TimePicker`.
- **Date and time** — a specific scheduled moment. Use `DateTimePicker`.
- **Date interval** — a bounded period. Use `DateRangePicker`.

Do not ask for more precision than the task needs. A date-only value should not force the user through a time picker.

### Relative or absolute

- **Relative** (_2 days ago_) for recency, where distance from now is the point: last activity or an event feed.
- **Absolute** (_Mar 12, 2024_) for the record, where the exact date is the point: created dates, validity windows, or anything a user may quote later.

When both matter, show the more important value in the flow and expose the other as supporting text or a tooltip. Never show only a relative timestamp for a contractual, billing, or audit value.

### Precision follows the decision

Show time only when it helps distinguish events or schedule an action. Show seconds only for tasks where second-level order matters. Unnecessary precision creates noise and makes columns harder to scan.

### Digits align

Timestamp columns take `numeric: true` on the `TableColumn` config, which right-aligns them and applies tabular figures. Do not reach for a monospace face; digit alignment is a font feature, not a font family.

## Building blocks

#### A. Date input

`DatePicker` for one calendar date and `DateRangePicker` for a bounded period.

#### B. Time input

`TimePicker` for a time of day and `DateTimePicker` for a date and time together.

#### C. Table column

`numeric: true`, which handles alignment and tabular figures.

#### D. Detail metadata

On a [detail page](detail-page.md), created and updated values sit in the header band's meta line as short icon-plus-text pairs.

#### E. Timeline value

`Timeline` presents chronological events with a consistent absolute or relative format across the sequence.

## General guidelines

### Do

- Format for the viewer's locale.
- Make the relevant timezone explicit when context does not already establish it.
- Choose the input control from the precision the task requires.
- Use `numeric: true` on timestamp columns and write no alignment classes.
- Show an absolute date for anything with billing, legal, or audit meaning.
- Keep one date and time format consistent within a surface.

### Don't

- Don't expose raw timestamp strings in the interface.
- Don't use an all-numeric date format when the audience may interpret day and month differently.
- Don't ask for a time when only a date matters.
- Don't show seconds unless the task depends on them.
- Don't reach for `font-mono` to align digits. Use tabular figures.
- Don't show only a relative timestamp for a contractual date.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.

### Component-specific guidelines

#### Absolute dates

- Spell the month rather than using an all-numeric format: _Mar 12, 2024_. `03/12/2024` means two different days on two continents.
- Add the year unless the surrounding context makes it unambiguous and the value is short-lived.

#### Relative times

- Round to a unit the user cares about: _2 days ago_, not _1 day 23 hours ago_.
- Under a minute is _Just now_.

#### Ranges

- Show both bounds: _Mar 12 – Apr 30, 2024_.
- An open-ended range says so: _From Mar 12, 2024_ or _Until Apr 30, 2024_.

#### Empty values

- A missing timestamp renders as `—`, never as a blank cell and never as an epoch value.

## Accessibility guidelines

### General accessibility guidelines

- Where the exact value matters, expose it in the reading flow or through a semantic `<time>` element.
- Time is text; do not encode it only as an icon or colour.

### Component-specific guidelines

- A timestamp in a tooltip is supporting information. If the absolute value is essential, put it in the flow rather than behind hover.
- Date and time controls have visible labels that name the expected value and timezone where relevant.
- Do not use placeholder text as the only format instruction.

## Related patterns and components

- [Detail page](detail-page.md) — the meta line where created and updated values appear.
- [List page](list-page.md) — numeric columns and their alignment.
- [Advanced filtering](advanced-filtering.md) — date-range filters.
- Components: `DatePicker`, `DateRangePicker`, `DateTimePicker`, `TimePicker`, `Table`, `Timeline`.

# Timestamps

Every time value in the system is an integer count of **seconds**. It stays that way from the database column to the client state, and becomes a human-readable string only at the moment it is painted.

[Binding rules](../../../../.claude/team-rule/coding-rules/cross-cutting_time.md)

## Key UX concepts

### Integer seconds, everywhere

A `BigInt` column in the database, a `number` in TypeScript (seconds fit comfortably in the safe-integer range), carried unchanged through the DTO, the API payload, and the client state. This governs every `*_at` column and every time value downstream of one.

There is no `Date` in a payload, no ISO string in a DTO, and no millisecond value anywhere. A value that arrives as milliseconds and is treated as seconds is off by a factor of a thousand, and it renders as 1970 — a bug that survives review because it _looks_ like a date.

### The render edge

Convert to a `Date` or a locale string **only where it is displayed**. That is the last possible moment, and it is deliberately late: the conversion needs a locale and a timezone, and those belong to the viewer, not to the data.

### The input edge, and the question you must answer first

The mirror of the render edge: a wall-clock value the user picked becomes seconds at the **controller**, right beside the zod parse. Before you convert it, you have to classify it, and the classification picks the timezone. Getting this wrong is not a rounding error — it is an off-by-a-day or off-by-hours defect.

- **Instant** — a definite point on the timeline: a payment time, a scheduled send. Parse the user's wall-clock pick in the **actor's browser timezone**, which the client supplies, then store epoch seconds. A server-stamped instant (`createdAt`, `lastLoginAt`) has no ambiguity at all — take `now()`.

- **Business date** — a calendar day owned by a party, not by the viewer: contract validity, a billing date, a settlement date. Resolve the day boundary in the **owning object's timezone** (`party.timezone`, UTC when null), then store epoch seconds. A contract that starts on the 1st starts on the party's 1st, not on the 1st in whatever timezone the admin happens to be sitting in.

The trap is that both look like a date picker to the user. Only the domain tells you which one you have.

### Relative or absolute

- **Relative** (_2 days ago_) for recency, where the distance is the point: a last-activity line, an audit feed.
- **Absolute** (_Mar 12, 2024_) for the record, where the exact day is the point: created dates, validity windows, anything a user might quote in a support ticket.

When both matter, show the absolute value and put the relative one in a tooltip — or the other way around. Never show only a relative timestamp for a value that has legal or billing meaning.

### Digits align

Timestamps in a column are numbers, so they take `tabular-nums` and the column takes `numeric: true` on the `TableColumn` config, which right-aligns it and applies the figures for you. Don't reach for a monospace face to line them up — digit alignment is a font _feature_, not a font _family_, and `font-mono` is banned in components anyway.

## Building blocks

#### A. The column

A `BigInt` `*_at` column in `schema.prisma`.

#### B. The DTO

A plain `number` — epoch seconds. Unchanged from the column.

#### C. The input conversion

At the controller, beside the zod parse: classify as instant or business date, resolve the timezone accordingly, convert to seconds.

#### D. The party timezone

`party.timezone` — nullable, UTC when null. Resolve business-date boundaries with an explicit `Intl.DateTimeFormat(…, { timeZone })`, never with the server's ambient zone.

#### E. The render conversion

At the component, using the viewer's locale and timezone.

#### F. The table column

`numeric: true`, which handles the alignment and the figures.

#### G. The meta line

On a [detail page](detail-page.md), the created/updated values sit in the header band's meta line as small icon-plus-text pairs.

## General guidelines

### Do

- Keep seconds all the way from the column to the component.
- Classify every user-supplied time as an instant or a business date before converting it.
- Pass an explicit timezone to every `Intl.DateTimeFormat` that resolves a business-date boundary.
- Convert at the render edge, using the viewer's locale.
- Use `numeric: true` on a timestamp column and write no alignment classes.
- Show an absolute date for anything with billing, legal, or audit meaning.

### Don't

- Don't put a `Date` or an ISO string in a DTO or a payload.
- Don't use milliseconds. `Date.now()` is milliseconds; it needs dividing.
- Don't resolve a business date in the actor's timezone. It belongs to the party.
- Don't resolve an instant in the party's timezone. It belongs to the actor.
- Don't rely on the server's ambient timezone for either.
- Don't reach for `font-mono` to align digits. Use `tabular-nums`.
- Don't show only a relative timestamp for a contractual date.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.

### Component-specific guidelines

#### Absolute dates

- Spell the month rather than using an all-numeric format: _Mar 12, 2024_. `03/12/2024` means two different days on two continents.

#### Relative times

- Round to a unit the user cares about: _2 days ago_, not _1 day 23 hours ago_.
- Under a minute is _Just now_.

#### Ranges

- Show both bounds. _Mar 12 – Apr 30, 2024_.
- An open-ended range says so: _From Mar 12, 2024_ or _Until Apr 30, 2024_.

#### Empty values

- A missing timestamp renders as `—`, never as a blank cell and never as the epoch.

## Accessibility guidelines

### General accessibility guidelines

- A relative timestamp shown alone is ambiguous to a user returning to a cached page. Where the exact value matters, expose it — a `title`, a tooltip, or a `<time>` element carrying the machine-readable value.

### Component-specific guidelines

- Don't abbreviate a date into an icon or a colour. Time is text.
- A timestamp in a tooltip is a mouse affordance; if the absolute value is the one that matters, put it in the flow rather than behind a hover.

## Related patterns and components

- [Detail page](detail-page.md) — the meta line where created and updated appear.
- [List page](list-page.md) — numeric columns and their alignment.
- [Advanced filtering](advanced-filtering.md) — date-range filters, which are the most common source of an instant-versus-business-date mistake.
- Components: `DatePicker`, `DateRangePicker`, `DateTimePicker`, `TimePicker`, `Table`, `Timeline`.

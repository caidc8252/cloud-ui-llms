# Timeline

Vertical event log — device history, audit trails, ticket activity.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/recipes/timeline.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Timeline` is a set of composable parts — `Timeline`, `TimelineItem`, `TimelineMarker`, `TimelineContent`, `TimelineHeader`, `TimelineTitle`, `TimelineTime`, `TimelineTimeRow`, `TimelineDescription`, and `TimelineActor` — plus an `items` shortcut on the root. Import them, and the `TimelineEntry` / `TimelineTone` types, from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Timeline` is display-only: no interactivity, no data fetching. One item is a marker column (the node and the rail that connects to the next item) beside a content column (title, time, description, actor).

There are **two usage levels**, and both render through the same slot components:

- The `items` prop — a shortcut for plain event lists. Pass `TimelineEntry[]` and the component builds the slots. **`children` is ignored when `items` is set.**
- Slot children — full control. Put anything in `TimelineContent`: badges, links, code.

Two root modes, combinable:

- `density` — `default` or `compact`. It changes the **vertical rhythm**, not the type size. Use `compact` for dense audit logs.
- `stacked` — where the timestamp goes. `false` (default) puts the time at the right edge of the header; `true` puts a `time · actor` row beneath the title.

The marker style is **not a prop** — `TimelineMarker` derives it from whether it has children. No children gives you the ring-dot (a hollow ring on a tinted halo). Children give you the icon node (a tinted circle wrapping your icon).

That means: **pass a bare glyph to the icon node.** `Check`, never `CircleCheck`. The node already draws the circle; a circle-wrapped glyph nests a second one inside it.

`tone` is `neutral` (default — untinted, so a routine event doesn't glow), `primary`, `success`, `warning`, `error`, or `info`. The vocabulary aligns with `Badge`'s `tone`.

For an entry's timestamp, give both `time` (the display text, rendered with tabular numerals) and `dateTime` (the machine-readable value, forwarded to the `<time dateTime>` attribute).

## General guidelines

### Do

- Use the `items` prop for a plain event list, and slot children when an entry needs rich content.
- Pass a bare glyph as the marker icon — the node draws the circle.
- Give every timestamp a `dateTime` as well as a display `time`.
- Use `density="compact"` for long audit logs.

### Don't

- Don't pass both `items` and `children`; `children` is ignored.
- Don't pass a circle-wrapped icon (`CircleCheck`) to the marker; you get two circles.
- Don't tone every entry. If everything glows, nothing does — `neutral` is the default for a reason.
- Don't put interactive controls in a timeline as the only way to reach them; it is a log, not a toolbar.

## Features

- #### Items shortcut

  ```tsx
  import { Timeline } from "@cloud/ui";

  <Timeline
    density="compact"
    stacked
    items={events.map((e) => ({
      id: e.id,
      title: e.title,
      time: formatTime(e.at),
      dateTime: e.at.toISOString(),
      actor: e.actor,
      description: e.detail,
      tone: e.failed ? "error" : "neutral",
    }))}
  />;
  ```

- #### Slot composition

  ```tsx
  import {
    Timeline,
    TimelineItem,
    TimelineMarker,
    TimelineContent,
    TimelineHeader,
    TimelineTitle,
    TimelineTime,
    TimelineDescription,
  } from "@cloud/ui";

  <Timeline>
    <TimelineItem>
      <TimelineMarker tone="success">
        <Check />
      </TimelineMarker>
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>{t("audit.approved")}</TimelineTitle>
          <TimelineTime dateTime={at.toISOString()}>{formatTime(at)}</TimelineTime>
        </TimelineHeader>
        <TimelineDescription>
          <Badge tone="success">{t("status.live")}</Badge> {note}
        </TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  </Timeline>;
  ```

- #### Density and stacking

  `density="compact"` tightens the vertical rhythm. `stacked` moves the time under the title, joined with the actor as `time · actor` (use `TimelineTimeRow` in slot mode).

- #### Markers

  A `TimelineMarker` with no children is a ring-dot; with children it is a tinted circle wrapping the glyph.

### States

- **Toned** — `neutral` / `primary` / `success` / `warning` / `error` / `info` tint the marker.
- **Last item** — the rail stops at the final node.

## Writing guidelines

### General writing guidelines

- Use sentence case, and the past tense — a timeline records what happened.
- Never hardcode user-facing strings, and format timestamps for the locale.

### Component-specific guidelines

- Title: say what happened, such as `Contract approved`.
- Actor: name who did it. In slot mode (non-stacked) write the `by ` prefix yourself if the layout needs it — the component doesn't add one.
- Description: the detail that the title can't carry. Leave it out when the title says everything.

## Accessibility guidelines

### General accessibility guidelines

- The timeline is a list, so the number of events and their order are conveyed.
- `dateTime` gives each timestamp a machine-readable value, so an assistive technology isn't left parsing `2 min ago`.
- Markers are decorative. The tone tints the dot but doesn't say anything — the title must carry the meaning in words.

### Component-specific guidelines

- Don't rely on a red marker to say an event failed. Say `Payment failed` in the title.

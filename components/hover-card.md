# HoverCard

Rich popover that opens on hover. Use it for preview cards and detail popovers.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/hover-card.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`HoverCard` is a client component built on `@base-ui/react`'s `PreviewCard`. It is a set of three parts — `HoverCard`, `HoverCardTrigger`, and `HoverCardContent`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`HoverCard` reveals a rich panel when the user hovers or focuses the trigger. Wrap the target in `HoverCardTrigger` and put the preview in `HoverCardContent`, positioned with `side` (default `bottom`), `align`, `sideOffset`, and `alignOffset`. The content is a fixed `w-[280px]` card surface.

Use it for a non-essential preview — a user summary, a link preview, a definition. Because it appears on hover, the content must be supplemental: it is not reliably reachable on touch. For a short text hint use `Tooltip`; for a click-triggered panel or actions use `Popover`.

## General guidelines

### Do

- Use a hover card for a rich, non-essential preview.
- Trigger it from meaningful content such as a name, an avatar, or a link.
- Keep the preview scannable.

### Don't

- Don't put essential-only information in a hover card; hover is not available on touch.
- Don't put primary actions in it. Use a `Popover` or `DropdownMenu`.
- Don't use a hover card where a one-line hint suffices. Use `Tooltip`.

## Features

- #### Structure and positioning

  `HoverCardContent` takes `side` (default `bottom`), `align` (default `center`), `sideOffset` (default `4`), and `alignOffset` (default `4`).

  ```tsx
  import { HoverCard, HoverCardTrigger, HoverCardContent } from "@cloud/ui";

  <HoverCard>
    <HoverCardTrigger render={<a href={`/users/${user.id}`}>{user.name}</a>} />
    <HoverCardContent>
      <div className="flex gap-3">
        <Avatar name={user.name} />
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-content-tertiary">{user.role}</p>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>;
  ```

## Writing guidelines

### General writing guidelines

- Use sentence case and present tense.
- Keep the preview concise.

### Component-specific guidelines

- Lead with the identifying content, such as a name or title, then supporting detail.
- Don't duplicate the trigger's text as the only content.

## Accessibility guidelines

### General accessibility guidelines

- The card opens on hover and on keyboard focus of the trigger through the Base UI primitive.
- Because it is hover-driven, keep the content supplemental; do not gate any essential action or information behind it.
- Ensure the trigger is a focusable element so keyboard users can reveal the preview.

### Component-specific guidelines

- If the preview repeats information already available on the destination, that is fine; it should never be the only place that information exists.

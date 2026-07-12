# ScrollArea

Overflow container with scrollbars styled to match the design system.

`ScrollArea` is a client component built on `@base-ui/react`'s `ScrollArea`. The root renders its own viewport, scrollbar, and corner, so `ScrollArea` alone is usually enough; `ScrollBar` is exported for the case where you need a second, horizontal bar. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`ScrollArea` replaces the browser's native scrollbars with thin, token-colored ones that look the same across platforms. Wrap the overflowing content and give the area a bounded size — a height, a `max-height`, or a flex context that constrains it. Without a bound, nothing overflows and the component does nothing.

The viewport is focusable and shows a focus ring, so a scrollable region is reachable by keyboard. `ScrollBar` takes `orientation`, which defaults to `vertical`.

Use `ScrollArea` for a bounded region inside the page — a menu, a sidebar, a log panel, a long list in a card. Don't wrap the page itself in one; let the document scroll natively so the browser's scroll restoration, anchoring, and mobile chrome behave normally.

## General guidelines

### Do

- Give the scroll area a bounded height, or it will never scroll.
- Use it for a bounded region — a panel, list, or menu — inside the page.
- Add a horizontal `ScrollBar` when the content is wider than the area.

### Don't

- Don't wrap the whole page or the document body in a scroll area.
- Don't nest scroll areas; a scroll region inside a scroll region is a trap for pointer and keyboard alike.
- Don't hide overflowing content behind a scrollbar with no other cue that there is more to see.

## Features

- #### Bounded region

  ```tsx
  import { ScrollArea } from "@cloud/ui";

  <ScrollArea className="h-72 rounded-md border border-line">
    <div className="p-4">{rows}</div>
  </ScrollArea>;
  ```

- #### Horizontal scrollbar

  `ScrollBar` takes `orientation="horizontal"` for content that is wider than the area. The vertical bar is rendered by the root already.

  ```tsx
  import { ScrollArea, ScrollBar } from "@cloud/ui";

  <ScrollArea className="w-full whitespace-nowrap">
    <div className="flex gap-4">{cards}</div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>;
  ```

### States

- **Idle** — the thumb is a rounded, semi-transparent bar in the strong line color.
- **Focused** — the viewport shows a focus ring when reached by keyboard, so the region can be scrolled with the arrow keys.

## Writing guidelines

`ScrollArea` renders no text of its own.

## Accessibility guidelines

### General accessibility guidelines

- The viewport is focusable and shows a focus ring, so keyboard users can reach the region and scroll it with the arrow keys, Page Up / Page Down, Home, and End.
- Give the region an accessible name with `aria-label` or `aria-labelledby` when it is a meaningful landmark, such as a log panel.
- Don't make scrolling the only way to reach an action. Keep primary actions outside the scroll area, in a fixed header or footer.

### Component-specific guidelines

#### Keyboard interaction

- Tab moves focus into the viewport.
- The arrow keys, Page Up / Page Down, Home, and End scroll the focused viewport.

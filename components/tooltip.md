# Tooltip

Short text hint shown on hover or focus.

`Tooltip` is a client component built on `@base-ui/react`'s `Tooltip`. It is a set of parts — `TooltipProvider`, `Tooltip`, `TooltipTrigger`, and `TooltipContent`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Tooltip` shows a short hint anchored to a trigger. Wrap the target in `TooltipTrigger` and put the hint text in `TooltipContent`, positioned with `side` (default `top`), `align`, `sideOffset`, and `alignOffset`. A `TooltipProvider` supplies the open delay; place one high in the tree (the package also exports it, and the app root typically mounts it).

Keep tooltips to a few words. A tooltip is supplemental — do not put essential-only information in it, since it is not always reachable. For a rich hover preview, use `HoverCard`; for actions, use `Popover` or `DropdownMenu`.

## General guidelines

### Do

- Use a tooltip for a brief hint, such as the name of an icon-only button.
- Keep it to a few words.
- Wrap a `TooltipProvider` around the app (or a region) to control the delay.

### Don't

- Don't put essential information only in a tooltip; it is not reliably reachable on touch.
- Don't put interactive content in a tooltip. Use a `Popover`.
- Don't use a tooltip as the accessible name for a control that already needs `aria-label`.

## Features

- #### Structure and positioning

  `TooltipContent` takes `side` (default `top`), `align` (default `center`), `sideOffset` (default `4`), and `alignOffset` (default `0`), and renders an arrow.

  ```tsx
  import { Tooltip, TooltipTrigger, TooltipContent, Button } from "@cloud/ui";

  <Tooltip>
    <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Refresh" />}>
      <RefreshCw className="size-4" />
    </TooltipTrigger>
    <TooltipContent>Refresh results</TooltipContent>
  </Tooltip>;
  ```

- #### Provider and delay

  `TooltipProvider` sets the open `delay` (default `0`) for the tooltips beneath it. Mount it once high in the tree.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep the hint to a few words, with no terminal punctuation.

### Component-specific guidelines

- Name the action or element the trigger represents, such as `Refresh results`.
- Don't repeat the visible label of the control the tooltip is attached to.

## Accessibility guidelines

### General accessibility guidelines

- The tooltip is shown on hover and on keyboard focus through the Base UI primitive.
- A tooltip supplements, and is not a substitute for, an accessible name. Give an icon-only control its own `aria-label`.
- Don't place essential or interactive content in a tooltip.

### Component-specific guidelines

#### Keyboard interaction

- Focusing the trigger reveals the tooltip; Escape dismisses it.
- Ensure the trigger is a focusable element so keyboard users can reach the hint.

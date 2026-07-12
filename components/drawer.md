# Drawer

Bottom-sheet style panel. Use it for mobile-friendly side panels and overlays.

`Drawer` is a client component powered by `vaul`. It is a set of composable parts — `Drawer`, `DrawerTrigger`, `DrawerClose`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, and `DrawerDescription`, plus `DrawerPortal` and `DrawerOverlay`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Drawer` is a draggable, mobile-first panel. It anchors to an edge through the vaul `direction` prop, which defaults to `bottom`; a bottom drawer shows a grab handle and can be dismissed by dragging. Compose it with `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, and `DrawerFooter`.

Because vaul is built on Radix's dialog, the trigger and close parts compose with **`asChild`**, not with Base UI's `render` prop. Wrap your `Button` as the child: `<DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>`. The open state comes from the vaul root props (`open`, `defaultOpen`, `onOpenChange`, `dismissible`, `modal`, `snapPoints`).

`DrawerContent` renders its own portal and overlay. `DrawerPortal` and `DrawerOverlay` are exported for the rare case that needs to assemble them by hand — do not add them around a `DrawerContent`, or the overlay is painted twice.

Reach for `Drawer` when the panel should feel like a native bottom sheet with drag-to-dismiss. For a standard desktop side panel built on the dialog primitive, use `Sheet`; for a centered task, use `Modal`.

## General guidelines

### Do

- Use a drawer for mobile-friendly panels and bottom sheets with drag-to-dismiss.
- Give it a `DrawerTitle`.
- Compose the trigger and close controls with `asChild`.
- Keep the content short enough to fit the panel's capped height.

### Don't

- Don't use a drawer where a desktop side panel is expected. Use `Sheet`.
- Don't put a forced decision in a drawer. Use `AlertDialog`.
- Don't pass `render` to `DrawerTrigger` or `DrawerClose`. That is the Base UI convention; the drawer is vaul, so it takes `asChild`.
- Don't wrap `DrawerContent` in `DrawerPortal` or add a `DrawerOverlay` next to it. It renders both itself.
- Don't nest drawers.

## Features

- #### Direction

  The drawer anchors to an edge via the vaul `direction` prop — `bottom` (the default), `top`, `left`, or `right`. A `bottom` drawer is the only one that shows the grab handle. Bottom and top drawers cap at 80% of the viewport height; left and right drawers take three quarters of its width.

  ```tsx
  import {
    Button,
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
  } from "@cloud/ui";

  <Drawer>
    <DrawerTrigger asChild>
      <Button variant="secondary">Open</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Quick actions</DrawerTitle>
      </DrawerHeader>
      …
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="ghost">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>;
  ```

- #### Slots

  `DrawerHeader` and `DrawerFooter` are plain layout `<div>`s: the header is a column of title and description, and the footer is a column pushed to the bottom of the panel. `DrawerTitle` and `DrawerDescription` are the dialog's title and description parts and are what give the panel its accessible name — keep them even when the design hides the description.

  ```tsx
  <DrawerHeader>
    <DrawerTitle>Quick actions</DrawerTitle>
    <DrawerDescription>Actions apply to the selected device.</DrawerDescription>
  </DrawerHeader>
  ```

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep the title short.

### Component-specific guidelines

- Title: name the panel or task.
- Footer actions: use concrete verbs, and keep one primary action.

## Accessibility guidelines

### General accessibility guidelines

- The drawer manages focus and dismissal through vaul.
- Provide a `DrawerTitle` so the panel has an accessible name.
- Ensure a keyboard-reachable close control in addition to drag-to-dismiss.

### Component-specific guidelines

#### Keyboard interaction

- The panel is reachable and dismissable by keyboard through its trigger and close controls; drag-to-dismiss is a pointer affordance and must not be the only way out.

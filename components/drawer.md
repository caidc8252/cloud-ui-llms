# Drawer

Bottom-sheet style panel. Use it for mobile-friendly side panels and overlays.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/drawer.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Drawer` is a client component powered by `vaul`. It is a set of composable parts — `Drawer`, `DrawerTrigger`, `DrawerClose`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, and `DrawerDescription`, plus `DrawerPortal` and `DrawerOverlay`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Drawer` is a draggable, mobile-first panel. It anchors to an edge through the vaul `direction` prop; a bottom drawer shows a grab handle and can be dismissed by dragging. Compose it with `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, and `DrawerFooter`.

Reach for `Drawer` when the panel should feel like a native bottom sheet with drag-to-dismiss. For a standard desktop side panel built on the dialog primitive, use `Sheet`; for a centered task, use `Modal`.

## General guidelines

### Do

- Use a drawer for mobile-friendly panels and bottom sheets with drag-to-dismiss.
- Give it a `DrawerTitle`.
- Keep the content short enough to fit the panel's capped height.

### Don't

- Don't use a drawer where a desktop side panel is expected. Use `Sheet`.
- Don't put a forced decision in a drawer. Use `AlertDialog`.
- Don't nest drawers.

## Features

- #### Direction

  The drawer anchors to an edge via the vaul `direction` prop. A bottom drawer shows a grab handle and supports drag-to-dismiss.

  ```tsx
  import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
  } from "@cloud/ui";

  <Drawer>
    <DrawerTrigger render={<Button variant="secondary">Open</Button>} />
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Quick actions</DrawerTitle>
      </DrawerHeader>
      …
      <DrawerFooter>
        <DrawerClose render={<Button variant="ghost">Close</Button>} />
      </DrawerFooter>
    </DrawerContent>
  </Drawer>;
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

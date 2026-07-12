# Sheet

Side panel that slides in from an edge. It can be anchored to any of the four sides.

`Sheet` is built on `@base-ui/react`'s `Dialog`. It is a set of composable parts — `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, and `SheetDescription`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Sheet` is an edge-anchored panel built on the dialog primitive. Set `SheetContent`'s `side` to `top`, `right` (default), `bottom`, or `left`. A left or right sheet is the "drawer" form and caps at a 560px max width while staying responsive; top and bottom sheets size to their content.

`SheetContent` renders a close button by default; set `showCloseButton={false}` to remove it. Compose the panel with `SheetHeader`, `SheetTitle`, `SheetDescription`, and `SheetFooter`.

Use a sheet for secondary flows and detail views that keep the page context, such as a filter panel or an item preview. For a centered, focused task use `Modal`; for a mobile-first draggable panel use `Drawer`.

## General guidelines

### Do

- Use a sheet for a side panel that supplements the page, such as filters, a detail view, or a form.
- Anchor filters and detail views to `right`; use `left` for navigation-style panels.
- Give the sheet a `SheetTitle` for its accessible name.

### Don't

- Don't use a sheet for a forced decision. Use `AlertDialog`.
- Don't put a full centered task in a sheet when a `Modal` fits better.
- Don't stack sheets from within a sheet.

## Features

- #### Side

  `side` is `top`, `right` (default), `bottom`, or `left`. Left and right sheets cap at 560px wide.

  ```tsx
  import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from "@cloud/ui";

  <Sheet>
    <SheetTrigger render={<Button variant="secondary">Filters</Button>} />
    <SheetContent side="right">
      <SheetHeader>
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription>Refine the results.</SheetDescription>
      </SheetHeader>
      …
    </SheetContent>
  </Sheet>;
  ```

- #### Close button

  `SheetContent` shows a ghost close button in the corner by default; set `showCloseButton={false}` to remove it and provide your own dismissal.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep the title short and the description to a sentence.

### Component-specific guidelines

- Title: name the panel, such as `Filters` or `Device details`.
- Footer actions: use concrete verbs, and keep one primary action.

## Accessibility guidelines

### General accessibility guidelines

- The panel manages focus trapping and restoration through the dialog primitive.
- Provide a `SheetTitle` so the panel has an accessible name.
- Keep a reachable close control.

### Component-specific guidelines

#### Keyboard interaction

- Escape closes the sheet, and focus returns to the trigger.
- Focus is moved into the panel on open; keep the reading order matching the visual order.

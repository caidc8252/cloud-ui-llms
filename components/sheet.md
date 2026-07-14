# Sheet

Side panel that slides in from an edge. It can be anchored to any of the four sides.

`Sheet` is built on `@base-ui/react`'s `Dialog`. It is a set of composable parts — `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, and `SheetDescription`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Sheet` is an edge-anchored panel built on the dialog primitive. Set `SheetContent`'s `side` to `top`, `right` (default), `bottom`, or `left`. A left or right sheet is the "drawer" form: it stays responsive (60% of the viewport on the right, 75% on the left) but caps at a 560px max width. Top and bottom sheets span the full width and size to their content.

`SheetContent` itself renders no close control — `SheetHeader` owns it. Compose the panel with `SheetHeader`, `SheetTitle`, `SheetDescription`, and `SheetFooter`.

`SheetHeader` takes an optional `icon` (rendered before the title/description column), `showCloseButton` (default `true`), and `closeLabel` (default `"Close"`, the close button's accessible name) — on top of the usual `children`/`className`.

Use a sheet for supplementary features or information that are relevant to the current page and aid its task without becoming the primary destination. Examples include _Advanced filters_, _Configure column preferences_, and an optional _Import summary_. The content may be interactive and scroll, but it must remain one specific use case with no sub-navigation or independent URL.

A sheet is not simply a wider modal: a side sheet caps at 560px, while `Modal` has presets up to 880px. Choose the sheet for its supplementary side-panel relationship, not its width or ability to scroll. For one compact blocking task use `Modal`; when the task itself is the destination, edits multiple properties, or needs sections, stages, deep linking, or broad layout, use a dedicated page. See [Secondary panels](../patterns/secondary-panels.md).

In Cloudscape terminology, this component is closest to a drawer, but it is implemented here as a dialog and temporarily owns focus. This system's `Drawer` is instead the mobile-first draggable panel. There is no sanctioned split-panel pattern for persistent selected-resource details.

## General guidelines

### Do

- Use a sheet for a side panel that supplements the page, such as filters, page-scoped preferences, or optional supporting information.
- Keep it to one specific supplementary use case, even when the body contains several visual groups.
- Put long content in a scrolling body between `SheetHeader` and `SheetFooter`.
- Anchor supplementary task panels to `right`; use `left` for navigation-style panels.
- Give the sheet a `SheetTitle` for its accessible name.

### Don't

- Don't use a sheet for a forced decision. Use `AlertDialog`.
- Don't put a full centered task in a sheet when a `Modal` fits better.
- Don't use a sheet as the larger version of a resource edit. Multiple or interdependent properties belong on a dedicated page.
- Don't use a sheet as a persistent master-detail panel for a selected resource. Navigate to the detail page until a split-view pattern exists.
- Don't add page sections, stages, or sub-navigation to a sheet. Move that task to a dedicated page.
- Don't choose a sheet only because the content is wide; its 560px cap is narrower than the largest modal presets.
- Don't stack sheets from within a sheet.

## Features

- #### Side

  `side` is `top`, `right` (default), `bottom`, or `left`. A right sheet is 60% of the viewport and a left sheet 75%, both capped at 560px. The cap is an inline `max-width`, so a `style` you pass to `SheetContent` overrides it — a `max-w-*` class will not.

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

  `SheetHeader` renders the close control, not `SheetContent`. It lays out an optional leading `icon`, a title/description column that takes the remaining width, and a small ghost icon button at the row's trailing edge — in-flow, next to the title, not floated over the panel's content. Pass `showCloseButton={false}` to remove it and provide your own dismissal (for example a `SheetClose` in the footer), and `closeLabel` to override the accessible name (defaults to `"Close"`).

  ```tsx
  <SheetHeader icon={<FunnelIcon className="size-4 shrink-0 text-primary-700" />}>
    <SheetTitle>Advanced filters</SheetTitle>
    <SheetDescription>All conditions AND.</SheetDescription>
  </SheetHeader>
  ```

  A `SheetHeader` with no `icon` still gets the close button, right of the title/description column — this is the default for every sheet, not something you opt into per panel.

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

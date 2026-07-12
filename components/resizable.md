# Resizable

Draggable split-pane layout.

`Resizable` is powered by `react-resizable-panels`. It is a set of three parts — `ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`ResizablePanelGroup` holds two or more `ResizablePanel`s separated by a `ResizableHandle` the user drags. Set `direction` on the group (`horizontal` or `vertical`); the group fills its container, so give it a bounded height.

Each panel takes `defaultSize`, `minSize`, and `maxSize` as percentages, and can be given an `id` and `order`. Give the group an `autoSaveId` when the user's chosen split should persist across visits.

`ResizableHandle` takes `withHandle`, which draws a visible grip bar in the middle of the divider. Use it whenever the divider is not obviously draggable — which is most of the time.

Reach for `Resizable` when the user genuinely benefits from re-proportioning two working areas: a list next to a detail pane, an editor next to a preview, a query next to its results. For a fixed sidebar, use the `Sidebar` layout components. Don't make a page resizable just because it has two columns.

## General guidelines

### Do

- Give the group a bounded height and a `direction`.
- Set `minSize` on each panel so a pane can't be dragged into uselessness.
- Pass `withHandle` so the divider looks draggable.
- Set `autoSaveId` when the split is worth remembering.

### Don't

- Don't use a resizable group for the app's main navigation column. Use `Sidebar`.
- Don't nest resizable groups more than one level deep; the drag targets get ambiguous.
- Don't rely on resizing to fit content that should simply wrap or scroll.

## Features

- #### Split panes

  ```tsx
  import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@cloud/ui";

  <ResizablePanelGroup direction="horizontal" className="h-[600px]">
    <ResizablePanel defaultSize={35} minSize={20}>
      {list}
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={65} minSize={30}>
      {detail}
    </ResizablePanel>
  </ResizablePanelGroup>;
  ```

- #### Direction

  `direction="horizontal"` splits side by side; `direction="vertical"` stacks the panels and turns the handle into a horizontal divider.

- #### Persisting the split

  Give the group an `autoSaveId` to store and restore the user's chosen sizes.

  ```tsx
  <ResizablePanelGroup direction="horizontal" autoSaveId="query-console">
    …
  </ResizablePanelGroup>
  ```

### States

- **Idle** — the divider is a one-pixel subtle line, with a wider invisible hit area around it.
- **Hover** — the line darkens to the default line color.
- **Focused** — the handle shows a focus ring and can be moved with the keyboard.

## Writing guidelines

`Resizable` renders no text of its own.

## Accessibility guidelines

### General accessibility guidelines

- The handle is a real, focusable separator control with an orientation, so it is reachable and operable by keyboard, not by drag alone.
- Give the handle an `aria-label` naming what it resizes when the panes aren't obvious from context.
- Keep a sensible `minSize` on every panel so a keyboard or pointer user cannot collapse content out of reach.

### Component-specific guidelines

#### Keyboard interaction

- Tab moves focus to the handle.
- The arrow keys move the divider; Home and End jump it to its bounds.

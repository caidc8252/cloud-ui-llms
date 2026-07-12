# Skeleton

Animated pulsing placeholder that mimics the shape of content while it loads.

`Skeleton` is a plain `<div>` — it carries no `"use client"`, so it renders in a server component. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Skeleton` is a muted, pulsing block. It has no props of its own beyond the standard `<div>` props; you shape it with utility classes for width, height, and radius so it matches the content that will replace it.

Reserve the same space the loaded content will take, so the layout does not shift when data lands. Render skeletons inside the real container — a `Card`, a table cell, a list row — rather than replacing the container itself.

## General guidelines

### Do

- Size each skeleton to the element it stands in for, such as `h-4 w-32` for a line of text or `size-10 rounded-full` for an avatar.
- Group several skeletons to mirror the shape of the loading region.
- Keep the surrounding container mounted so the surface does not jump when content arrives.

### Don't

- Don't cover a whole page with one large skeleton block. Mirror the real layout.
- Don't animate skeletons for content that loads instantly; the flash is more distracting than helpful.
- Don't leave skeletons on screen after an error. Swap to an `Empty` or error state.

## Features

- #### Shaping

  A skeleton is a blank pulsing block; its size and radius come from `className`.

  ```tsx
  import { Skeleton } from "@cloud/ui";

  <div className="flex items-center gap-3">
    <Skeleton className="size-10 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>;
  ```

### States

- #### Loading

  `Skeleton` is itself the loading state. Render it while data is in flight and replace it with the real content when the data resolves.

## Writing guidelines

`Skeleton` renders no text. It stands in for content that has not loaded, so it has no writing guidelines of its own.

## Accessibility guidelines

### General accessibility guidelines

- A skeleton is decorative. It conveys "loading" visually but exposes no text to assistive technology.
- For a load that a screen-reader user must be told about, pair the skeleton region with a live-region status message or an accessible `Spinner` (`role="status"`), rather than relying on the pulse alone.
- Remove skeletons once content loads so they are not announced or focusable.

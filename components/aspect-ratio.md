# AspectRatio

Constrains child content to a fixed width-to-height ratio, such as a video thumbnail.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/aspect-ratio.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`AspectRatio` is a plain `<div>` wrapper — it carries no `"use client"`, so it renders in a server component. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`AspectRatio` reserves space at a fixed ratio so content does not cause layout shift while it loads. Pass the required `ratio` as a number, such as `16 / 9`, and place a single child that fills the box.

The wrapper is `position: relative` and applies the ratio through a CSS variable. Make the child fill it — for example an `<Image fill>` or an element with `size-full` — rather than sizing the child independently.

Use the component prop before adding custom classes. Set `ratio`, then use `className` only for local layout such as width or rounding.

## General guidelines

### Do

- Use it to hold media at a stable shape while it loads, such as a thumbnail, cover image, or embedded video.
- Pass `ratio` as a division that reads as the aspect, such as `16 / 9`, `4 / 3`, or `1`.
- Let a single child fill the reserved box.

### Don't

- Don't put multiple independently sized children inside one `AspectRatio`.
- Don't use it to crop text content. It is for media and fixed-shape surfaces.
- Don't omit `ratio`; it is required and there is no default.

## Features

- #### Ratio

  `ratio` is a required number expressing width divided by height. The wrapper stays at that ratio at any width.

  ```tsx
  import { AspectRatio } from "@cloud/ui";
  import Image from "next/image";

  <AspectRatio ratio={16 / 9} className="w-full overflow-hidden rounded-md">
    <Image src={cover} alt="" fill className="object-cover" />
  </AspectRatio>;
  ```

## Writing guidelines

`AspectRatio` renders no text of its own. Follow the writing guidelines of whatever media or content it wraps, and provide `alt` text on images.

## Accessibility guidelines

### General accessibility guidelines

- `AspectRatio` is a layout wrapper with no semantics; it adds no role and no focus behavior.
- Give any image inside it an `alt` attribute — descriptive when the image carries meaning, or `alt=""` when it is decorative.
- Keep interactive children (a play button, a link) reachable in the normal tab order.

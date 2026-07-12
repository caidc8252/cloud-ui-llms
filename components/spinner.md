# Spinner

Circular loading indicator with `role="status"`, in four sizes.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/spinner.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Spinner` is a plain `<div>` — it carries no `"use client"`, so it renders in a server component. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Spinner` is a spinning ring with a built-in `role="status"` and an `aria-label` of "Loading". Use it for an indeterminate wait where you cannot show progress. When the wait sits inside a button, prefer the button's own `loading` prop, which supplies its spinner.

Use the component prop before adding custom classes. Set `size`, then use `className` only for color or layout adjustments.

## General guidelines

### Do

- Use a spinner for an indeterminate wait, such as a submit in flight or a panel loading.
- Match the `size` to the surrounding controls.
- Center the spinner in the space the loaded content will occupy.

### Don't

- Don't use a spinner when you can show determinate progress. Use `Progress`.
- Don't use a bare spinner for skeleton-style content loading. Use `Skeleton` to mirror the shape.
- Don't add a second spinner inside a `Button` that already has `loading`.

## Features

- #### Size

  There are four sizes: `sm` (14px), `md` (default, 16px), `lg` (20px), and `xl` (32px).

  ```tsx
  import { Spinner } from "@cloud/ui";

  <Spinner size="lg" />;
  ```

## Writing guidelines

`Spinner` shows no visible label. If a loading message is needed, place text next to the spinner and keep it short, such as `Loading results`.

## Accessibility guidelines

### General accessibility guidelines

- The spinner carries `role="status"` and an `aria-label` of "Loading", so assistive technology announces it.
- Give a more specific label when the generic one is not enough — for example set `aria-label="Loading results"` to override the default.
- Don't leave a spinner running after the wait ends; remove it so the status is not announced indefinitely.

### Component-specific guidelines

- When the spinner replaces page content, ensure focus is handled sensibly so keyboard users are not stranded on a removed element when the content loads.

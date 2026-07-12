# Toaster

Toast notifications. Mount `Toaster` once, then call `toast()` from anywhere.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/sonner.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Toaster` is powered by `sonner`. The package exports the `Toaster` container and a wrapped `toast` function. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

Mount `Toaster` once, in the root layout. It tracks the app's light/dark preference automatically and accepts every sonner `ToasterProps` — `position`, `duration`, `closeButton`, and the rest.

Then call `toast()` from anywhere: `toast.success`, `toast.info`, `toast.warning`, `toast.error`, plus sonner's `toast.loading`, `toast.promise`, `toast.dismiss`, and `toast.custom`. Each variant carries its own icon in the design system's status color.

Toasts auto-dismiss: **1500ms** by default, and **3000ms for errors**, which need longer to read. The exported `toast` wraps sonner's so that a custom `duration` also drives the countdown bar — set `duration` once and the bar follows it, instead of drifting from the global default. A non-finite duration (a `loading` toast, or `Infinity`) simply shows no countdown bar.

A toast is a transient, non-blocking confirmation. It disappears, so nothing important may live only there. Use `Alert` for a message that must stay on the page, and `AlertDialog` for something the user must acknowledge. Never report a failure the user has to act on through `toast.error` alone.

## General guidelines

### Do

- Mount `Toaster` once, in the root layout.
- Use `toast.success` to confirm an action the user just took.
- Use `toast.promise` for an operation with a pending, resolved, and rejected state.
- Set `duration` on the `toast()` call when a message needs longer; the countdown bar follows it.

### Don't

- Don't put an action the user must take in a toast; it will vanish. Use `Alert` or `AlertDialog`.
- Don't toast something the page already shows — a saved row that visibly updated needs no toast.
- Don't fire several toasts for one action.

## Features

- #### Mounting

  ```tsx
  // app/layout.tsx
  import { Toaster } from "@cloud/ui";

  <body>
    {children}
    <Toaster position="top-right" />
  </body>;
  ```

- #### Variants

  `success`, `info`, `warning`, and `error`, each with its status icon. `error` gets the longer 3000ms duration automatically.

  ```tsx
  import { toast } from "@cloud/ui";

  toast.success("Merchant created");
  toast.error("Couldn't reach the gateway. Try again.");
  ```

- #### Description and duration

  ```tsx
  toast.success("Export queued", {
    description: "We'll email you when it's ready.",
    duration: 4000,
  });
  ```

- #### Promise

  `toast.promise` shows a loading toast that resolves into a success or error one.

  ```tsx
  toast.promise(saveMerchant(values), {
    loading: "Saving…",
    success: "Merchant saved",
    error: "Couldn't save the merchant",
  });
  ```

### States

- **Countdown** — a bar tracks the toast's real duration.
- **Loading** — a spinning glyph, and no countdown bar (the duration is not finite).
- **Success / info / warning / error** — the matching status icon and color.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep the title to a few words.

### Component-specific guidelines

- Title: state the outcome, in the past tense for something done — `Merchant saved`, `Export queued`.
- Description: only when it adds something the title can't carry, such as what happens next.
- Error: say what failed and what to do, and remember the toast will disappear — if the user must act, also surface the failure somewhere permanent.

## Accessibility guidelines

### General accessibility guidelines

- Toasts are announced by sonner's live region, so a screen-reader user hears them without moving focus.
- They auto-dismiss quickly, so nothing essential may live only in a toast. Keep an on-page record of anything the user must act on.
- Don't rely on the icon color alone to convey the outcome; the message says it in words.

### Component-specific guidelines

- Don't put an interactive control in a toast that has no equivalent elsewhere. A control that disappears on a timer is not reliably reachable — least of all for someone using a screen reader or a switch device.

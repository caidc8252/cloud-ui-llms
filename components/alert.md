# Alert

Highlighted message box for status feedback, with an optional action button in the top-right corner.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/alert.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Alert` is a plain `<div>` with `role="alert"` — it carries no `"use client"`, so it renders in a server component. It is a set of four components — `Alert`, `AlertTitle`, `AlertDescription`, and `AlertAction`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Alert` is an inline, in-page message box for status feedback — not a toast and not a modal. Compose it from `AlertTitle`, `AlertDescription`, and an optional `AlertAction` pinned in the top-right corner. A leading icon is optional: place an SVG as a direct child and the layout shifts to an icon-plus-content grid automatically.

Choose the `variant` by the meaning of the message. Reach for `variant` before styling, and use `className` only for local layout.

For a transient confirmation, use `Toaster`/`toast` instead. For a blocking, forced choice, use `AlertDialog`.

## General guidelines

### Do

- Use an alert for a persistent, in-context status message.
- Match `variant` to the meaning: `info`, `success`, `warning`, or `error`.
- Pair the tone with a title and, where helpful, a leading icon.
- Use `AlertAction` for a single related action, such as retry or dismiss.

### Don't

- Don't use an alert for a transient confirmation. Use a toast.
- Don't use an alert for a forced decision. Use `AlertDialog`.
- Don't rely on the color alone; keep a clear title and description.
- Don't stack many alerts; consolidate related messages.

## Features

- #### Variant

  There are five variants: `info` (default), `success`, `warning`, `error`, and `destructive` (an error-colored alias). Each maps to the matching status tokens.

  ```tsx
  import { Alert, AlertTitle, AlertDescription } from "@cloud/ui";
  import { TriangleAlert } from "lucide-react";

  <Alert variant="warning">
    <TriangleAlert />
    <AlertTitle>Approaching quota</AlertTitle>
    <AlertDescription>You have used 90% of your storage.</AlertDescription>
  </Alert>;
  ```

- #### Leading icon

  Placing an SVG as a direct child switches the layout to a two-column grid, with the icon spanning the title and description rows. The icon inherits the variant color.

- #### Action

  `AlertAction` renders in the top-right corner. Use it for a single action related to the message.

  ```tsx
  <Alert variant="error">
    <AlertTitle>Sync failed</AlertTitle>
    <AlertDescription>The last sync did not complete.</AlertDescription>
    <AlertAction>
      <Button variant="ghost" size="sm" onClick={retry}>
        Retry
      </Button>
    </AlertAction>
  </Alert>
  ```

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep the title short and the description to a sentence or two.

### Component-specific guidelines

- Title: name the situation, such as `Sync failed` or `Approaching quota`.
- Description: explain the impact and, if relevant, what to do next.
- Action label: start with a verb, such as `Retry` or `Dismiss`.

## Accessibility guidelines

### General accessibility guidelines

- `Alert` carries `role="alert"`, so it is announced when it appears. Add an alert to the DOM at the moment it applies rather than rendering it hidden.
- Don't use color as the only signal of severity; the title text carries the meaning.
- Ensure the `AlertAction` control is keyboard reachable.

### Component-specific guidelines

- The leading icon is decorative and inherits the variant color; keep the meaning in the title and description.
- Because `role="alert"` interrupts, reserve alerts for messages worth announcing; use quieter inline text for routine hints.

# Progress

Horizontal bar showing numeric completion, with an optional label and value.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/progress.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Progress` is a client component built on `@base-ui/react`'s `Progress`. The root renders its own track and indicator, so `Progress` alone is enough; `ProgressLabel` and `ProgressValue` are optional children, and `ProgressTrack` / `ProgressIndicator` are exported for the rare case you need to compose them by hand. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Progress` shows how far along a determinate task is. Pass `value` as a number from `0` to `100`. Any children you provide — typically a `ProgressLabel` and a `ProgressValue` — render above the bar; the root then appends the track and indicator itself.

`tone` sets the indicator color: `success`, `warning`, `error`, or `info`. Omit it for the default brand color. Unlike most components, `Progress` has **no `neutral` tone** — omitting `tone` already gives you the brand-colored bar, which is the right default for an in-flight task. Reach for a tone only when the bar's _outcome_ is what carries the meaning: `success` for a completed import, `error` for a failed upload, `warning` for a quota nearing its limit.

Use `Progress` when you know the percentage. When you don't, use `Spinner` or `Skeleton` instead — an indeterminate progress bar that never advances is worse than an honest spinner.

## General guidelines

### Do

- Use a progress bar for determinate work, where a percentage is meaningful.
- Pair it with a `ProgressLabel` saying what is progressing and a `ProgressValue` showing the number.
- Use `tone` to reflect the outcome of the work, not to decorate the bar.

### Don't

- Don't use a progress bar when you can't compute a percentage. Use `Spinner`.
- Don't use it as a quota or utilization _meter_ without a label — a bar with no words reads as "in progress", not "84% of your limit".
- Don't set `tone="success"` while work is still running; save it for completion.

## Features

- #### Value

  `value` is the percentage complete, from `0` to `100`. The indicator width animates as it changes.

  ```tsx
  import { Progress } from "@cloud/ui";

  <Progress value={62} />;
  ```

- #### Label and value

  Children render on a row above the bar. `ProgressLabel` is muted small text on the left; `ProgressValue` is pushed to the right with `ml-auto` and uses tabular numerals so it doesn't jitter as the number changes.

  ```tsx
  import { Progress, ProgressLabel, ProgressValue } from "@cloud/ui";

  <Progress value={62}>
    <ProgressLabel>Importing merchants</ProgressLabel>
    <ProgressValue />
  </Progress>;
  ```

- #### Tone

  `tone` is `success`, `warning`, `error`, or `info`. Omit it for the default brand-colored indicator.

  ```tsx
  <Progress value={100} tone="success">
    <ProgressLabel>Import complete</ProgressLabel>
    <ProgressValue />
  </Progress>
  ```

### States

- **In progress** — the default brand indicator, growing with `value`.
- **Toned** — `success` / `warning` / `error` / `info` swap the indicator color to the matching status token.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.

### Component-specific guidelines

- Label: name the work in progress, such as `Importing merchants`. Use the present participle while it runs and the past tense when it finishes.
- Value: let `ProgressValue` render the number; don't hand-write a percentage into the label as well.

## Accessibility guidelines

### General accessibility guidelines

- The bar carries the correct progressbar role and value attributes through the Base UI primitive.
- Give it an accessible name — a `ProgressLabel`, or an `aria-label` on the root when the bar stands alone.
- Don't rely on the indicator color alone to convey the outcome; say it in the label.

### Component-specific guidelines

- A progress bar is not a focusable control and has no keyboard interaction. If the user needs to _set_ a value, that's a `Slider`.

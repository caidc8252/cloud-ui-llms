# StepIndicator

Horizontal progress indicator for a multi-step flow.

`StepIndicator` is a client component driven by props. It renders an `<ol>` and accepts the usual `<ol>` props. It exports the `StepIndicatorProps` and `StepIndicatorStep` types, plus the `stepDotVariants` CVA, alongside it. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

**Not to be confused with `Stepper`**, which is the numeric `+` / `−` spinbutton. Similar name, different component.

## Development guidelines

`StepIndicator` shows where the user is in a wizard. Pass `steps` — each `{ label, caption?, icon? }` — and `current`, the **0-based** index of the active step. Everything before `current` renders completed, everything after renders upcoming.

State derives entirely from `current`: earlier steps are completed (green, with a check), `current` is active (filled primary), later steps are upcoming (muted outline). Only the active step's title is emphasized.

`caption` is the small uppercase line above the title — `Step 1`, and so on. `icon` replaces the step number inside the dot, but note it **persists across every state**: a completed step with an `icon` shows that icon in success green, _not_ the check. So when you use icons, keep the ordinal readable through `caption`.

It is **display-only by default**: navigation is driven by the surrounding form's Back and Continue buttons. Pass `onStepClick` to let users jump back — the steps then render as buttons and call it with their index. `maxNavigableStep` caps how far a click may reach, and defaults to `current`, so only completed and active steps are clickable. Without `onStepClick`, `maxNavigableStep` is ignored and nothing is clickable. Track the furthest step the user has reached and pass it, so they can jump forward again to where they left off.

`framed` (default `false`) wraps the indicator in the card-style frame — border, surface, padding, shadow. Bare is the default so the row composes anywhere, but **on a wizard page you want `framed`**: the frame is built in, and hand-writing that className string on the page is how the wizards drift apart from one another.

## General guidelines

### Do

- Pass `framed` on a wizard page. The card frame is the component's job.
- Drive `current` from the wizard's Back and Continue buttons.
- Pass `maxNavigableStep` as the furthest step reached, so the user can jump back and forward again.
- Keep `caption` when you use `icon`, so the step's ordinal is still legible.
- Keep the labels to a word or two.

### Don't

- Don't hand-roll the card frame in `className` — that's what `framed` is for.
- Don't let the user click ahead to a step they haven't reached; that's what `maxNavigableStep` is for.
- Don't use `StepIndicator` for a numeric input. That's `Stepper`.
- Don't use it for a flow with two steps; it costs more than it says.

## Features

- #### Steps and current

  ```tsx
  import { StepIndicator } from "@cloud/ui";

  const [current, setCurrent] = React.useState(0);

  <StepIndicator
    framed
    current={current}
    steps={[
      { caption: t("wizard.step1"), label: t("wizard.company") },
      { caption: t("wizard.step2"), label: t("wizard.contracts") },
      { caption: t("wizard.done"), label: t("wizard.confirmation") },
    ]}
  />;
  ```

- #### Framed

  `framed` adds the built-in card frame (border, surface, padding, shadow). Default is `false` — a bare row. Use `framed` on wizard pages instead of writing the frame yourself.

  ```tsx
  <StepIndicator framed steps={steps} current={current} />
  ```

- #### Click to jump

  `onStepClick` makes the reachable steps clickable; `maxNavigableStep` is how far a click may go.

  ```tsx
  const [current, setCurrent] = React.useState(0);
  const [maxStep, setMaxStep] = React.useState(0);

  // when the wizard advances:
  // setCurrent(next); setMaxStep((m) => Math.max(m, next));

  <StepIndicator
    framed
    current={current}
    steps={steps}
    onStepClick={setCurrent}
    maxNavigableStep={maxStep}
  />;
  ```

- #### Icons

  `icon` replaces the step number in the dot. It persists through every state — a completed icon step shows the icon in green, not a check.

### States

- **Completed** — index below `current`: success green, filled-soft, with a check (or the step's own `icon`).
- **Active** — index equal to `current`: filled primary, with the title emphasized.
- **Upcoming** — index above `current`: muted outline.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Label: name the step's subject as a noun — `Company`, `Contracts`, `Confirmation`.
- Caption: the ordinal — `Step 1`. Keep the set parallel; don't mix `Step 1` with `Finally`.

## Accessibility guidelines

### General accessibility guidelines

- The indicator is an ordered list, so the sequence and the number of steps are conveyed.
- With `onStepClick`, the reachable steps are real buttons — focusable and activated with Enter or Space. Without it, nothing is focusable, which is right: there is nothing to do.
- Don't rely on color alone to say a step is done; the completed dot also carries a check.

### Component-specific guidelines

- The active step carries `aria-current="step"`, so it is announced as the current one and not merely styled. Keep `current` accurate — it is the single source of every state here.

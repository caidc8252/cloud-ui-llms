# Create wizard

A staged create flow: a step indicator, one step of fields at a time, a review step, and a persistent bottom navigation. Use it only when the flow is genuinely staged.

[Style template](../demos/create-wizard.md) | Binding rules (app repo: `.claude/team-rule/coding-rules/ui_ui-and-pages.md`)

## Key UX concepts

### The test for using a wizard at all

A wizard is justified when at least one of these is true:

- **Dependency** — a later step's fields depend on an earlier step's answer.
- **Branching** — an earlier answer changes which steps exist.
- **Review** — the commit is consequential enough to deserve a confirmation step that shows what is about to happen.
- **External processing** — something runs between steps (a validation call, an upload, a provisioning check).

"The form is long" is not on that list. Many independent fields stay a [create form](create-form.md) with more section cards. Splitting independent fields across steps makes the user pay for navigation they didn't need.

### The step indicator is a map, not a progress bar

`StepIndicator` shows where the user is in a known sequence. Each step shows its number, then a check once complete. It tells the user how much is left, which is the whole point of accepting the extra clicks.

### The exit and the navigation are different things

The header's back button **exits the entire flow** — it abandons the create. It is the one built into `PageHeaderBand`, and you point it at the collection with `backTo`. _Back_ in the footer moves one step earlier and keeps the draft. These are different actions and they live in different places for exactly that reason. Never merge them.

### The footer carries the flow

The `ActionFooter` — a sibling of `PageBody`, below the scroll region, so the navigation is always in view without being pinned — holds a `ghost` Back and a `primary` Continue, both carrying their icon: Back takes a leading `ChevronLeft`, Continue takes a **trailing** `ChevronRight` (`iconRight`) because it points forward, and on step one, where Back has nothing to go back to, the escape is _Cancel_ with a leading `X`. On the last step, Continue becomes the commit — _Create record_, with its verb's icon — and takes `loading` while the request is in flight.

### The draft lives in the page

There is one form state object for the whole flow, held by the page, not per-step state that gets stitched together at the end. Steps read and write slices of it. That is what makes Back non-destructive.

## Building blocks

#### A. Reduced header

`PageHeaderBand` with `title`, an optional `description` naming the steps, and `backTo` pointing at the collection — the built-in back button is what exits the flow. No `actions`.

#### B. Step indicator

`StepIndicator` with the step list, and `framed` — a wizard's indicator wears the card frame the component already carries, so don't hand-write that border-and-surface wrapper. It marks the current step, and completed steps carry a check. `current` is the active index; `onStepClick` plus `maxNavigableStep` make already-visited steps clickable.

#### C. Step body

One `Card` (or a small column of them) holding the current step's `Field`s. Only the current step renders.

#### D. Review step

A summary card of term/value rows showing every value the user is about to commit. Absent optional values render as `—`, not as blank.

#### E. Action footer

`ActionFooter`, a sibling of `PageBody` and never inside it — `ghost` Back (leading `ChevronLeft`, or `X` for the step-one _Cancel_), `primary` Continue (trailing `ChevronRight`). It sits below the scrolling step body, which is what keeps it in view; it takes no pinning of its own. On the final step Continue is the commit, carries its verb's icon, and takes `loading`.

#### F. Success state

A centered confirmation card with the outcome and the onward action (view the record, create another).

## General guidelines

### Do

- Apply the four-part test before choosing a wizard. If none of them holds, build a form.
- Keep one draft object for the whole flow so Back never loses input.
- Show a review step before a consequential commit, listing exactly what will be created.
- Validate each step on Continue, not at the end. Discovering a step-1 error on step 4 is the failure mode wizards are supposed to prevent.
- Use `loading` on the final commit so it disables itself.
- Render an unset optional value in the review as `—`.

### Don't

- Don't use a wizard to break up a long list of independent fields.
- Don't make the header back button and the footer Back do the same thing.
- Don't hand-write a header back button — the band has one — and don't hand-write the step indicator's frame; pass `framed`.
- Don't ship a footer button without its icon. _Continue_ with no chevron is the tell of a hand-assembled footer.
- Don't let Back discard the step's input.
- Don't hide the step count. A user who can't see how many steps remain will abandon.
- Don't allow the commit to run twice. `loading` disables the button; rely on it.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Step labels

- Use a short noun phrase naming what the step collects: _Primary information_, _Items_, _Review_.
- Don't number them in the label. The indicator already does.

#### Buttons

- The forward action is _Continue_, not _Next_.
- The final action names the commit: _Create record_.
- The backward action is _Back_.

#### Review step

- Use the same field labels the steps used. A value that changes its name between entry and review reads as a different value.

## Accessibility guidelines

### General accessibility guidelines

- Every control is keyboard reachable, and focus moves to the new step's heading on step change.
- Never remove the focus ring.

### Component-specific guidelines

- The step indicator must convey the current step to assistive technology, not only through colour or a filled circle.
- The header's icon-only exit is the band's built-in back control, and it carries its own `aria-label`. Point it at the collection with `backTo`, and make sure the copy around it does not lead a user to read it as the footer's step _Back_ — it abandons the flow.
- Announce validation failures on Continue in a live region, and move focus to the first invalid field.

## Related patterns and components

- [Create form](create-form.md) — the single-step default, and the first thing to try.
- [Errors and validation](errors-and-validation.md) — per-step validation and the commit's error path.
- Components: `StepIndicator`, `Field`, `Card`, `PageHeaderBand`, `PageBody`, `ActionFooter`, `Button`, `KvGrid`. (`Stepper` is a numeric step control, not a step indicator — it has no place in a wizard's chrome.)

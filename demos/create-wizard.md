# Create wizard demo

A staged create flow for related, branching, or review-heavy input. The demo pairs a step indicator and form area with a compact summary of the in-progress record.

[View source template](https://github-company/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/docs/examples/create-wizard.tsx) · [View pattern](../patterns/create-wizard.md)

## On this page

1. Key UX concepts
2. Building blocks
3. General guidelines
4. Writing guidelines
5. Accessibility guidelines
6. Related patterns

## Key UX concepts

### A wizard needs a reason

Use a wizard when the task has dependent stages, branching decisions, an explicit review, or a process that cannot be safely completed in one page. Otherwise, use the create form pattern.

### The step indicator is a map

The indicator names the user's location in a fixed flow. It is not a replacement for validation, completion status, or progress feedback for an asynchronous operation.

### Exit and step navigation differ

The header back action leaves the entire flow. The footer back and continue actions move between stages and should preserve the draft.

### Review before commit

Use the summary rail and final confirmation to help users verify the record before creation. The feature owns what is shown, what is editable, and when a step becomes complete.

## Building blocks

#### A. Reduced header

Use a sticky header with one explicit exit destination and the task title. Keep it free of duplicate submit actions.

#### B. Step indicator

Use `StepIndicator` with concise, task-based step labels. Keep the step list stable after the user starts the flow.

#### C. Step form

Use `Card`, `Field`, and appropriate controls for the fields required by the current step.

#### D. Summary rail

Use a compact definition list to show important draft values and missing information. It supports review; it does not replace the primary form.

#### E. Action footer

Use `ActionFooter` for back, continue, and final create actions. Show one primary action that reflects the current step.

#### F. Completion state

Use a clear confirmation panel after successful creation, with one obvious action to continue to the created resource or collection.

## General guidelines

### Do

- Use only the steps necessary to complete the task.
- Validate a step before allowing users to continue past it.
- Preserve the draft when moving between steps and clearly identify missing values in review.
- Submit the final record through the application's request layer and handle the completion state explicitly.

### Don't

- Don't turn a short form into a wizard for visual effect.
- Don't let users lose prior input when they return to a previous step.
- Don't change the meaning or order of steps midway through the flow.
- Don't show an enabled final action when required review data is incomplete.

## Writing guidelines

### General writing guidelines

- Use sentence case, active voice, and present-tense verbs.
- Write step labels as short task names, not technical implementation phases.
- Use action labels that describe the transition or outcome.

### Component-specific guidelines

#### Step labels

Use short noun phrases or action phrases such as `Primary information`, `Related items`, and `Review`.

#### Navigation actions

Use `Back` for the previous step, `Continue` for an intermediate step, and a specific final action such as `Create record` for submission.

#### Review content

Display field labels and human-readable values. Use an em dash for information that is intentionally not set.

## Accessibility guidelines

### General accessibility guidelines

- Keep all step controls, navigation actions, and review information keyboard accessible.
- Move focus to the current step heading after a step change.
- Announce validation errors and preserve their association with the relevant fields.

### Component-specific guidelines

#### Step indicator

Expose the current step and total number of steps to assistive technology. Do not rely on color alone to indicate completion.

#### Summary rail

Use definition-list semantics so labels and their values remain understandable when read linearly.

## Related patterns

- [Create form](../patterns/create-form.md)
- [Errors and validation](../patterns/errors-and-validation.md)
- [Action weight](../patterns/action-weight.md)
- [Detail page](../patterns/detail-page.md)

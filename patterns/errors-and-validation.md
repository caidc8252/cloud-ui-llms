# Errors and validation

How validation and operation failures appear in the interface. The rule is simple: put each message where the user can understand it and act on it.

## Key UX concepts

### One failure, one useful surface

Choose the surface from the user's next step:

- **Field-level** — one value needs correction. Use `Field`'s `error` prop next to the control.
- **Form-level** — the submission failed as a whole or several fields are affected. Use an `Alert` at the top of the form.
- **Action-level** — a local asynchronous action failed. Keep the error in the dialog, panel, or row where the action started.
- **Transient** — the outcome needs no follow-up. Use `toast()`.
- **Page-level** — the requested content is unavailable. Show a dedicated not-found or access-denied surface.

Do not repeat the same message in a field, an alert, and a toast. Duplication makes the interface feel less certain, not more informative.

### Actionable errors persist

An error that asks the user to fix something must remain visible until it is fixed or dismissed deliberately. Toasts disappear, so they are unsuitable for validation errors, conflicts, or failures with recovery steps.

### Validation starts after interaction

A form should not open already covered in errors. Show a field error after the field has been touched or after a submit attempt. On submit, reveal all relevant errors together and move focus to the first invalid field.

### Preserve the user's work

A failed submission leaves the entered values intact. Keep the user in the same form or dialog, show the failure in context, and leave the commit action available once the problem is corrected.

### Loading, empty, and unavailable are not errors

Use `Skeleton` or `Spinner` while the state is unknown, `Empty` when there is genuinely no content, and a dedicated unavailable surface when content cannot be shown. Do not use an error alert as a generic placeholder for every non-success state.

## Building blocks

#### A. Field error

`Field`'s `error` prop renders the message and associates it with the control.

#### B. Form alert

`Alert tone="error"` at the top of the form for a failure affecting the submission as a whole.

#### C. Local action error

An `Alert` or inline error inside the dialog, sheet, card, or row where the action began. Keep the surrounding surface open when the operation fails.

#### D. Transient feedback

`toast()` from `@cloud/ui` for success and for non-actionable failures.

#### E. Page-level state

A dedicated page or panel that names what is unavailable and gives the next useful destination.

## General guidelines

### Do

- Put a field's error next to the field and a whole-form failure at the top of the form.
- Keep user-entered values after a failed submission.
- Keep a dialog or sheet open when its action fails.
- Move focus to the first invalid field after a failed submit.
- Give an actionable failure a visible recovery step.
- Distinguish loading, empty, unavailable, and error states.

### Don't

- Don't put an actionable error in a toast.
- Don't show errors before the user has interacted or tried to submit.
- Don't clear the form after a failure.
- Don't close an action surface before its operation succeeds.
- Don't expose implementation details, stack traces, or service names.
- Don't use colour as the only indication of an error.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Don't use _please_, exclamation points, or _etc._
- State the problem before the recovery.

### Component-specific guidelines

#### Field errors

- Say what is wrong and what would be right. _Must be 8 characters or more._ beats _Invalid._
- Don't repeat the field's name in its own error. The error already sits under the label.

#### Form-level errors

- Name the cause and the next step. _That login name is taken. Choose another._
- Keep the message specific to this attempt, not a generic _Something went wrong_ when a useful explanation is available.

#### Toasts

- Confirm what happened, in the past tense: _Role created._
- Keep it to one line. A toast with two sentences is an alert wearing a disguise.

#### Unavailable pages

- Explain what is unavailable and offer a useful way forward. Avoid bare status words such as _Forbidden_ or _Error_.

## Accessibility guidelines

### General accessibility guidelines

- An error is announced, not only painted.
- Colour is never the only signal of an invalid field.
- Preserve focus context when an operation fails.

### Component-specific guidelines

- Field errors are associated with their controls so focus reads them.
- A form-level `Alert` receives focus after a failed submit when there is no more specific invalid field.
- Toasts live in a polite live region, but nothing requiring action lives only there.
- When an async dialog action fails, focus remains within the dialog and the error is reachable in reading order.

## Related patterns and components

- [Create form](create-form.md) and [Create wizard](create-wizard.md) — where validation surfaces.
- [Permission gating](permission-gating.md) — unavailable actions and access-denied surfaces.
- [Empty states](empty-states.md) — the not-an-error case often mistaken for one.
- Components: `Field`, `Alert`, `Toaster` / `toast`, `Empty`, `Skeleton`, `Spinner`.

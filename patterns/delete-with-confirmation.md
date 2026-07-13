# Delete with confirmation

One dialog, one confirm. **The default delete tier — use it unless the record is trivially recreatable (tier 1) or its reach crosses records and people (tier 3).**

[Delete patterns](delete-patterns.md) | Binding rules (app repo: `.claude/team-rule/coding-rules/ui_ui-and-pages.md`)

## Key UX concepts

### This is the default, and defaults should be boring

Tier 2 covers the long middle: the record cannot be recreated with a click, but destroying it changes nothing outside itself. Cancelling a pending invitation. Deleting a role nobody holds. Removing a webhook. The user is asked once, and the act proceeds.

Reach for tier 1 only when you can prove both of its conditions, and for tier 3 only when the blast radius genuinely leaves the record. Everything else lands here.

### `AlertDialog`, not a bare `Modal`

A confirmation is a decision, so it gets the dialog that demands one. `AlertDialog` has no close affordance and no backdrop dismiss: the user leaves through _Cancel_, through Escape, or through the act — never by fumbling a click outside it. `Modal` would hand back exactly the accidental exit you do not want on a delete.

Tier 2 and tier 3 use the same dialog. What separates them is **the gate on the confirm**, not the way out: at tier 2 the confirm is live the moment the dialog opens; at tier 3 it stays `disabled` until the user has typed the record's name. See [Delete with additional confirmation](delete-with-additional-confirmation.md).

### Drive `open` yourself, because the delete is async

`AlertDialogAction` closes the dialog on click. That makes it wrong for any confirm that waits on the server — it would close the dialog while the request is still on the wire, hiding whatever comes back. So a real delete drives `open` from state and puts a plain `Button` in the footer, which buys the three things that are easy to get wrong:

- **`loading` on the confirm**, which spins **and** disables it. A double-click cannot delete twice.
- **Close only on success.** A failure leaves the dialog open with the error visible, instead of returning the user to a list that still shows the record.
- **An inert Escape while in flight** — `onOpenChange` ignores the close request until the request settles, so the user cannot yank the dialog out from under a delete that is already running.

The code for this is in [AlertDialog → Async confirm](../components/alert-dialog.md). Do not reach for a `ConfirmModal`: no such export exists.

### The body names the record, the title names the act

The title is the verb and the type — _Delete role_. The body names the instance, in bold, and states what is lost. A user who opened the dialog from the wrong row finds out here, and only if you put the name in front of them.

### Say "cannot be undone" only when it is true

The phrase is load-bearing. If it appears on every dialog including the recoverable ones, it stops being read, and it will not be read on the one that matters. When the record **is** recoverable, say so instead, and say how.

## Building blocks

#### A. Trigger

`Button variant="danger"` on a detail page or in an editor pane; `ghost-danger` for a row action or a bulk verb in a `ListSummaryBar`. Per [Action weight](action-weight.md), the slot picks the variant.

#### B. Dialog

`AlertDialog` with `open` / `onOpenChange` driven from state, an `AlertDialogTitle` carrying the verb, and an `AlertDialogCancel` for the way out.

#### C. Body

A short paragraph naming the record in `<strong>` and stating the consequence.

#### D. Confirm

A plain `Button variant="danger"` in the `AlertDialogFooter` — **not** `AlertDialogAction`, which would close on click — carrying `loading` while the request is in flight.

#### E. Result

On success the dialog closes and a `toast.success` names what went away. On failure it stays open with the error surfaced in an `Alert`.

## General guidelines

### Do

- Use `AlertDialog`, so a stray click outside the dialog cannot dismiss a delete.
- Drive `open` from state and put a plain `Button` in the footer, so the dialog can outlive the click.
- Give the confirm `loading` while the request is in flight — it spins and disables in one prop.
- Ignore the close request from `onOpenChange` while the delete is in flight.
- Name the record in bold in the body.
- Keep the dialog open on failure so the user sees why.
- Put the destructive verb on the confirm button — _Delete role_.
- Assert the permission and the party scope on the server. The dialog is not the guard.

### Don't

- Don't reach for `ConfirmModal`. **There is no such export** — the confirm dialog is `AlertDialog`.
- Don't hand-roll the dialog from `Modal` and two buttons. `Modal` can be dismissed by an outside click, and two bare buttons lose the in-flight guard and permit a double delete.
- Don't use `AlertDialogAction` for an async confirm. It closes on click, so the dialog vanishes before the server answers.
- Don't write _Are you sure?_ as the title. Name the act.
- Don't say _This cannot be undone_ on a recoverable record. The phrase must keep its meaning.
- Don't close the dialog before the request settles. An optimistic close hides the failure.
- Don't put _OK_ or _Yes_ on the confirm button.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Dialog title

- Verb plus resource type, no article, no question mark: _Delete role_. _Cancel invitation_.

#### Dialog body

- Name the instance in bold, then the consequence: _Delete **Regional Admin**? The role is not assigned to anyone, so no permissions change._
- One short paragraph. If it needs two, the record probably belongs in tier 3.

#### Buttons

- The confirm names the act: _Delete role_, _Cancel invitation_.
- The escape is _Cancel_. When the act itself is called "cancel", rename the escape to _Keep invitation_ so the two are not both _Cancel_.

## Accessibility guidelines

### General accessibility guidelines

- Never remove the focus ring.
- Colour is never the only signal — the confirm button's verb carries the destruction too.

### Component-specific guidelines

- Focus moves into the dialog on open and returns to the trigger on close.
- The confirm button is not the initially-focused control. A stray Enter must not delete.
- The dialog is labelled by its title, so a screen reader announces the act on open.
- Escape closes the dialog and counts as cancel — never hang the destructive branch off the close path.
- While the request is in flight the confirm is disabled and announces its state in words — a spinner alone is silent.

## Related patterns and components

- [Delete patterns](delete-patterns.md) — the tier test.
- [One-click delete](one-click-delete.md) — when the record is recreatable and the delete is soft.
- [Delete with additional confirmation](delete-with-additional-confirmation.md) — when the reach crosses records or people.
- [Action weight](action-weight.md) — `danger` on a detail page, `ghost-danger` in a row.
- Components: [`AlertDialog`](../components/alert-dialog.md), `Button`, `Alert`, `Toaster`.

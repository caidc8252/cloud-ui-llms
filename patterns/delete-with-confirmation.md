# Delete with confirmation

One dialog, one confirm. **The default delete tier — use it unless the record is trivially recreatable (tier 1) or its reach crosses records and people (tier 3).**

[Delete patterns](delete-patterns.md) | [Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### This is the default, and defaults should be boring

Tier 2 covers the long middle: the record cannot be recreated with a click, but destroying it changes nothing outside itself. Cancelling a pending invitation. Deleting a role nobody holds. Removing a webhook. The user is asked once, in a dismissable dialog, and the act proceeds.

Reach for tier 1 only when you can prove both of its conditions, and for tier 3 only when the blast radius genuinely leaves the record. Everything else lands here.

### `ConfirmModal`, not a bare `Modal`

`ConfirmModal` owns the part that is easy to get wrong: it disables the confirm and shows a spinner while the request is in flight, it refuses an accidental backdrop dismiss mid-flight, and it closes **only on a successful result** — so a failed delete leaves the dialog open with the error visible instead of dumping the user back to a list that still shows the record.

A hand-rolled `Modal` with two buttons reproduces none of that, and the double-submit it permits will delete twice. `AlertDialog` is the wrong tool in the other direction: it has no close affordance at all, which is correct for tier 3 and needless friction here.

> **Where it lives.** `ConfirmModal` is an **application** component today — `@/lib/confirm-modal`, built on `@cloud/ui`'s `Modal`. It is not a `@cloud/ui` export yet; promoting it into the package is pending. Import it from the app, and do not reach for a `@cloud/ui` export that is not there.

### The body names the record, the title names the act

The title is the verb and the type — _Delete role_. The body names the instance, in bold, and states what is lost. A user who opened the dialog from the wrong row finds out here, and only if you put the name in front of them.

### Say "cannot be undone" only when it is true

The phrase is load-bearing. If it appears on every dialog including the recoverable ones, it stops being read, and it will not be read on the one that matters. When the record **is** recoverable, say so instead, and say how.

## Building blocks

#### A. Trigger

`Button variant="danger"` on a detail page or in an editor pane; `ghost-danger` for a row action or a bulk verb in a `ListSummaryBar`. Per [Action weight](action-weight.md), the slot picks the variant.

#### B. Dialog

`ConfirmModal` with `title`, `confirmLabel`, `loadingLabel`, and `confirmVariant="danger"`.

#### C. Body

A short paragraph naming the record in `<strong>` and stating the consequence.

#### D. Result

`onConfirm` resolves `true` on success — the dialog closes and a `toast.success` names what went away. It resolves `false` on failure, leaving the dialog open with the error surfaced.

## General guidelines

### Do

- Use `ConfirmModal`. It owns the in-flight state, the double-submit guard, and the close-on-success contract.
- Set `confirmVariant="danger"` and give `loadingLabel` a present participle — _Deleting…_.
- Name the record in bold in the body.
- Resolve `false` from `onConfirm` on failure so the dialog stays open and the user sees why.
- Put the destructive verb on the confirm button — _Delete role_.
- Assert the permission and the party scope on the server. The dialog is not the guard.

### Don't

- Don't hand-roll the dialog from `Modal` and two buttons. You will lose the in-flight guard and permit a double delete.
- Don't use `AlertDialog` here. Removing the escape hatch is tier 3's job, and it is friction without benefit at this tier.
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
- While the request is in flight the confirm is disabled and its `loadingLabel` is announced — a spinner alone is silent.

## Related patterns and components

- [Delete patterns](delete-patterns.md) — the tier test.
- [One-click delete](one-click-delete.md) — when the record is recreatable and the delete is soft.
- [Delete with additional confirmation](delete-with-additional-confirmation.md) — when the reach crosses records or people.
- [Action weight](action-weight.md) — `danger` on a detail page, `ghost-danger` in a row.
- Components: `ConfirmModal`, `Button`, `Toaster`.

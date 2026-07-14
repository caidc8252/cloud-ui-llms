# One-click delete

Delete without a dialog, and offer _Undo_ in the toast. **Use it only when the record is low-risk and the action can be reliably reversed.**

[Delete patterns](delete-patterns.md)

## Key UX concepts

### The two conditions, and both are required

Tier 1 applies when **the blast radius is this record alone** and **the delete is reversible**. Dismissing a notification qualifies. Deleting a saved filter set qualifies. Deleting a role does not, however trivial the role looks, because a role's reach is its holders and you cannot see them from the row.

If the record is low-risk but the action cannot be reversed, you do not have tier 1 — you have tier 2 with the confirmation skipped. Take the confirmation. See [Delete with confirmation](delete-with-confirmation.md).

### Undo is the confirmation, moved after the act

The dialog asks _are you sure_ before the fact and costs every user an extra action. Undo asks nothing and costs only the user who was wrong. That trade is correct **only** when being wrong is cheap to reverse. Undo is not a UI flourish you can add to an irreversible action to make it feel safer.

### The toast must outlive the reading of it

The default toast is 1500ms. That is not long enough to notice a mistake, read the message, and act. An undo toast sets `duration` explicitly — 5000ms is the floor — and the countdown bar follows it. When the toast expires, the undo window expires with it; do not present an action that is no longer available.

### Optimistic, but reconciled

Remove the row from the visible list immediately — the point of tier 1 is that it feels free. If the operation fails, put the row back and surface the error. A row that vanishes and silently returns later is worse than one that never left.

## Building blocks

#### A. Trigger

`Button variant="ghost-danger"` — a row action or a bulk verb in a `ListSummaryBar`. Tier 1 rarely appears on a detail page; a record worth its own page is rarely tier 1.

#### B. Optimistic removal

Remove the record from the visible list as soon as the action begins.

#### C. Undo toast

`toast.success` with an _Undo_ action and an explicit `duration` of at least 5000ms.

#### D. Reconciliation

On failure, restore the row and surface the error where the user can act on it.

## General guidelines

### Do

- Confirm both conditions before choosing this tier: single-record blast radius **and** a reliably reversible action.
- Set `duration` to at least 5000ms on the undo toast.
- Remove the row optimistically, and put it back if the operation fails.
- Name what went away in the toast: _Notification dismissed_, not _Deleted_.
- Keep the undo window and the toast duration the same. The bar is the clock.

### Don't

- Don't use this tier for anything whose reach extends past the row — a role, a permission grant, or an object with dependent records.
- Don't offer _Undo_ for an irreversible action. Drop to [Delete with confirmation](delete-with-confirmation.md).
- Don't leave the toast at the 1500ms default. The user cannot read and act in 1.5 seconds.
- Don't batch this tier behind a "Delete all" without a confirmation — a bulk verb crosses records, which is tier 2 at minimum.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Toast message

- Name the record and the act in the past tense: _Notification dismissed._ _Filter set deleted._
- Do not explain how to undo. The action button says it.

#### Undo action

- The label is _Undo_. Nothing else.

## Accessibility guidelines

### General accessibility guidelines

- Never remove the focus ring.

### Component-specific guidelines

- The toast is announced politely; the undo action must be reachable by keyboard before it expires. A 5000ms window is the floor for that reason too, not only for reading.
- An icon-only trigger requires an `aria-label` naming the record.
- After an optimistic removal, move focus somewhere deliberate — the next row, or the list — so a keyboard user is not stranded on a node that no longer exists.

## Related patterns and components

- [Delete patterns](delete-patterns.md) — the tier test.
- [Delete with confirmation](delete-with-confirmation.md) — the tier to fall back to when the delete cannot be undone.
- [Action weight](action-weight.md) — `ghost-danger` in a row, and why.
- Components: `Button`, `Toaster`.

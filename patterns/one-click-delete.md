# One-click delete

Delete without a dialog, and offer _Undo_ in the toast. **Use it only when the record is low-risk and the server soft-deletes.**

[Delete patterns](delete-patterns.md) | [Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### The two conditions, and both are required

Tier 1 applies when **the blast radius is this record alone** and **the delete is reversible**. Dismissing a notification qualifies. Deleting a saved filter set qualifies. Deleting a role does not, however trivial the role looks, because a role's reach is its holders and you cannot see them from the row.

If the record is low-risk but the server hard-deletes, you do not have tier 1 — you have tier 2 with the confirmation skipped, which is just a bug that has not fired yet. Take the confirmation. See [Delete with confirmation](delete-with-confirmation.md).

### Undo is the confirmation, moved after the act

The dialog asks _are you sure_ before the fact and costs every user a click. Undo asks nothing and costs only the user who was wrong. That trade is correct **only** when being wrong is cheap to reverse — which is exactly the soft-delete condition. Undo is not a UI flourish you can add to a hard delete to make it feel safer.

### The toast must outlive the reading of it

The default toast is 1500ms. That is not long enough to notice a mistake, read the message, and act. An undo toast sets `duration` explicitly — 5000ms is the floor — and the countdown bar follows it. When the toast expires, the undo window expires with it; do not leave an _Undo_ the server will refuse.

### Optimistic, but reconciled

Remove the row from local state immediately — the point of tier 1 is that it feels free. If the request fails, put the row back and surface the error. A row that vanishes and silently returns on the next fetch is worse than one that never left.

## Building blocks

#### A. Trigger

`Button variant="ghost-danger"` — a row action or a bulk verb in a `ListSummaryBar`. Tier 1 rarely appears on a detail page; a record worth its own page is rarely tier 1.

#### B. Optimistic removal

Filter the record out of local state on click, before the request settles.

#### C. Undo toast

`toast.success` with an action that calls the restore endpoint, and an explicit `duration` of at least 5000ms.

#### D. Reconciliation

On failure, restore the row and surface the error code.

## General guidelines

### Do

- Confirm both conditions before choosing this tier: single-record blast radius **and** a soft delete.
- Set `duration` to at least 5000ms on the undo toast.
- Remove the row optimistically, and put it back if the request fails.
- Name what went away in the toast: _Notification dismissed_, not _Deleted_.
- Keep the undo window and the toast duration the same. The bar is the clock.

### Don't

- Don't use this tier for anything whose reach extends past the row — a role, a permission grant, a party-scoped object.
- Don't offer _Undo_ on a hard delete. Drop to [Delete with confirmation](delete-with-confirmation.md).
- Don't leave the toast at the 1500ms default. The user cannot read and act in 1.5 seconds.
- Don't skip the server-side permission and party checks because there is no dialog. The dialog was never the guard.
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
- [Delete with confirmation](delete-with-confirmation.md) — the tier to fall back to when the delete is hard.
- [Action weight](action-weight.md) — `ghost-danger` in a row, and why.
- Components: `Button`, `Toaster`.

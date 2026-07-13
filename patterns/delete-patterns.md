# Delete patterns

How to choose a delete tier. The rule is one sentence: **the tier follows the blast radius, not the resource.**

[Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md) | [Errors and validation](errors-and-validation.md)

## Key UX concepts

### Blast radius, not importance

Friction is not a compliment you pay to an important resource. It is a brake you fit to a consequence. Ask what breaks when the delete lands, and how far the damage travels:

- **Only this record, and the user can make it again in seconds** — no friction. See [One-click delete](one-click-delete.md).
- **Only this record, but it cannot be recreated** — one confirmation. See [Delete with confirmation](delete-with-confirmation.md).
- **Other records, or other people, change too** — the user types the resource's name. See [Delete with additional confirmation](delete-with-additional-confirmation.md).

A role is the worked example. Deleting a role that nobody holds destroys one row and one row only — that is tier 2. Deleting a role that eleven people hold silently strips permissions from eleven sessions — same table, same button, and a completely different blast radius. That is tier 3. **The tier is a property of the instance, not of the type**, so it is computed at render time from the record, not hardcoded per module.

### The third tier is a speed bump, not a lock

Type-to-confirm exists to break autopilot. A user who has clicked _Delete_ nine times today will click it a tenth without reading; being made to type `Regional Admin` forces them to look at what they are about to destroy. It does not make the act more authorised — that is what [permission gating](permission-gating.md) and the server-side guard are for. Never use type-to-confirm as a substitute for an `assertPermissions` call.

### Un-deletable is a state, not a missing button

Some records must never be deleted — a built-in role, the last remaining administrator, a party-scoped object with live children. Do not hide the action; **show it disabled and say why**. A hidden button reads as a bug and sends the user hunting; a disabled button with _Built-in roles cannot be deleted_ ends the question. The server still refuses independently — the UI state is a courtesy, never the guard.

### The undo toast is a promise about the server

Tier 1 offers _Undo_ in the toast. That promise is only honest if the delete is **soft** on the server — a `deletedAt` stamp the undo clears. If the row is gone from the table, do not offer undo, and do not use tier 1: drop to tier 2 and take the confirmation instead. An _Undo_ that fails is worse than no undo at all.

### The party scope is the server's job

Every delete route asserts the permission and scopes the row to the current party before it touches anything. The dialog is not a security boundary — a user who never opens it can still issue the request. See [Permission gating](permission-gating.md).

## Building blocks

#### A. The trigger

A `Button` whose variant is set by the slot it sits in, per [Action weight](action-weight.md): `ghost-danger` for a table row action or a bulk verb in a `ListSummaryBar`, `danger` for the delete on a detail page or in an editor pane. Never a hand-coloured neutral button.

#### B. The tier gate

A render-time predicate on the record — `role.holderCount > 0`, `user.isLastAdmin`, `role.builtin` — that picks the tier or disables the trigger outright.

#### C. The dialog

`AlertDialog` for tier 2 **and** tier 3 — it is the only confirm dialog. Tier 1 has no dialog.

The two tiers differ in **the gate on the confirm**, not in the dialog: at tier 2 the confirm is live as soon as the dialog opens; at tier 3 it stays `disabled` until the user types the record's name. Either way, drive `open` from state and put a plain `Button` in the footer rather than `AlertDialogAction`, which closes on click and cannot survive an async delete — see [Delete with confirmation](delete-with-confirmation.md).

#### D. The feedback

`toast.success` naming what went away — _Role deleted_ — with an _Undo_ action on tier 1 only. A failure surfaces through the error code, not through `toast.error` alone when the user must act on it. See [Errors and validation](errors-and-validation.md).

## General guidelines

### Do

- Pick the tier from the record's blast radius, computed at render time.
- Name the resource in the dialog body, in bold, so the user sees what they chose.
- State the consequence when other records or people are affected: _Eleven users will lose the permissions this role grants._
- Disable an un-deletable record's trigger and say why in a tooltip or hint.
- Assert the permission and the party scope on the server, in every tier, including tier 1.
- Put the destructive verb on the confirm button — _Delete role_, never _OK_.

### Don't

- Don't tier by resource type. A role with no holders and a role with eleven holders are different tiers.
- Don't offer _Undo_ unless the server soft-deletes. Drop to tier 2 instead.
- Don't use type-to-confirm as an authorisation check. It stops autopilot, not attackers.
- Don't hide the action on an un-deletable record. Disable it and explain.
- Don't paint a neutral button red. Use `variant="danger"` or `variant="ghost-danger"`.
- Don't put a bare `Modal` around a confirmation. It can be dismissed by an outside click; use `AlertDialog`.
- Don't reach for `ConfirmModal`. **There is no such export.**

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Dialog titles

- Use the verb plus the resource, no article and no question mark: _Delete role_. Not _Delete this role?_, not _Are you sure?_.

#### Dialog body

- Name the record in bold, then state the consequence. Lead with what is lost, not with the mechanics.
- Say _This cannot be undone_ only when it is true. If the record is recoverable, say how.

#### Buttons

- The confirm names the act: _Delete role_. Never _OK_, never _Yes_.
- The escape is _Cancel_.

## Accessibility guidelines

### General accessibility guidelines

- Never remove the focus ring.
- Colour is never the only signal that an action is destructive — the verb carries it too.

### Component-specific guidelines

- On open, focus lands inside the dialog; on close, it returns to the trigger. A user who cancels must not be dumped at the top of the page.
- The destructive button is never the initially-focused control, so a stray Enter cannot delete.
- An icon-only delete trigger in a table row requires an `aria-label` naming the record — _Delete role Regional Admin_, not _Delete_.
- A disabled trigger's reason must be readable, not only hoverable. A tooltip alone is not sufficient for a keyboard user.

## Related patterns and components

- [One-click delete](one-click-delete.md) — tier 1: low-risk and recreatable.
- [Delete with confirmation](delete-with-confirmation.md) — tier 2: the default.
- [Delete with additional confirmation](delete-with-additional-confirmation.md) — tier 3: blast radius crosses records or people.
- [Action weight](action-weight.md) — which button variant the trigger takes in each slot.
- [Permission gating](permission-gating.md) — the guard the dialog is not.
- [Errors and validation](errors-and-validation.md) — where a failed delete surfaces.
- Components: [`AlertDialog`](../components/alert-dialog.md), `Button`, `Toaster`.

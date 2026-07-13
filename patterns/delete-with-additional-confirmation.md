# Delete with additional confirmation

The user types the record's name to unlock the confirm. **Use it when the delete reaches past the record — other rows change, or other people lose something.**

[Delete patterns](delete-patterns.md) | [Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### The trigger is reach, not rank

Tier 3 is not "for important things". It is for deletes whose damage **leaves the record**:

- A role **eleven people hold**. Deleting it strips permissions from eleven sessions, and none of those people are in the room.
- A party-scoped object with live children, where the cascade takes rows the user cannot see.
- The last account that can administer a party — the delete locks everyone out, including the person doing it.

The same button on the same table is tier 2 when the role has no holders. Compute the tier from the record. See [Delete patterns](delete-patterns.md).

### Typing the name is a brake on autopilot

A user deleting the ninth role today will confirm the tenth without reading. Making them type `Regional Admin` forces a look at what is actually selected — it defeats muscle memory, misclicks, and the wrong row. That is the entire mechanism, and it is a UX brake, **not** an authorisation check. The server still asserts the permission and the party scope; a user who never opens the dialog can still issue the request. See [Permission gating](permission-gating.md).

### Show the blast radius, do not merely assert it

_This cannot be undone_ is not the warning. The warning is **who or what is affected, counted**: _Eleven users will lose the permissions this role grants._ A number the user recognises as too large is the only thing that reliably stops the wrong delete. If you cannot count the affected records, you do not understand the cascade well enough to ship the button.

### The gate is what makes this tier 3 — not the dialog

Tier 2 and tier 3 are the same `AlertDialog`: no close affordance, no backdrop dismiss, the user leaving through _Cancel_, Escape, or the act. What tier 3 adds is **a confirm that stays `disabled` until the record's name is typed exactly**. That gate is the whole of the tier — do not go looking for a different dialog to express it.

The gate is a `disabled` prop on the confirm, never a hand-rolled button. `AlertDialogAction` accepts it and it lands on the real `<button>` — but that part closes the dialog on click, so it only serves a confirm that does not wait on the server. A real delete does wait, so the confirm here is a plain `Button` carrying **both** `disabled` (the gate) and `loading` (the in-flight state), with `open` driven from state exactly as at tier 2. See [AlertDialog → Gated confirm and Async confirm](../components/alert-dialog.md).

### The match is exact, and the confirm stays disabled until it is

Trim surrounding whitespace; match nothing else. No case-folding, no fuzzy match, no accepting a prefix. If the name is hard to type, that is the brake working. Keep the confirm button disabled — do not let the user press it and then tell them the name was wrong.

## Building blocks

#### A. Trigger

`Button variant="danger"` on the detail page or editor pane; `ghost-danger` in a row. The trigger looks the same as tier 2 — the tier reveals itself in the dialog, not the button.

#### B. Dialog

`AlertDialog`, which has no close affordance.

#### C. Impact statement

A counted consequence, in the body, above the input. `Alert` with `variant="warning"` when the count is worth setting apart from the prose.

#### D. Name input

A `Field` whose label states exactly what to type — _Type **Regional Admin** to confirm_ — wrapping an `Input`. The confirm button is `disabled` until the trimmed value matches exactly.

#### E. Confirm

`Button variant="danger"` naming the act, with `loading` in flight.

## General guidelines

### Do

- Compute the tier from the record's reach at render time, not from its type.
- State the blast radius as a count: _Eleven users will lose the permissions this role grants._
- Require an exact match, trimmed. Keep the confirm disabled until it matches.
- Use `AlertDialog`, and put the gate on the confirm — that is what separates this tier from tier 2.
- Assert the permission and the party scope on the server, independently of the dialog.
- Fall back to tier 2 when the same record has no reach — an unassigned role does not deserve this friction.

### Don't

- Don't use type-to-confirm as an authorisation check. It stops autopilot, not attackers.
- Don't case-fold or fuzzy-match the name. The difficulty is the feature.
- Don't let the user press a confirm that will reject the typed name. Disable it instead.
- Don't apply this tier to every delete in a module. Friction everywhere is friction nowhere — the user learns to type the name without reading it, and you are back to tier 2 with extra steps.
- Don't assert _This cannot be undone_ in place of a count. Say who is affected.
- Don't use `Modal` here. It can be dismissed by an outside click, mid-read. And don't reach for `ConfirmModal`: **there is no such export.**

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Dialog title

- Verb plus resource type: _Delete role_. The severity lives in the body, not in a shouted title.

#### Impact statement

- Lead with the count and the people: _Eleven users will lose the permissions this role grants._
- Name the cascade when rows outside the record go too: _Three sub-merchants will be detached._
- Then, and only then, _This cannot be undone._

#### Name input

- The label says exactly what to type, with the name in bold: _Type **Regional Admin** to confirm._
- Do not put the name in the placeholder. A placeholder disappears the moment the user types, taking the thing they were copying with it.

#### Buttons

- The confirm names the act: _Delete role_.
- The escape is _Cancel_.

## Accessibility guidelines

### General accessibility guidelines

- Never remove the focus ring.
- Colour is never the only signal of severity — the count and the verb carry it.

### Component-specific guidelines

- Focus lands on the name input on open, not on the confirm button.
- The confirm's disabled state must be explained, not merely rendered: associate a hint with the input so a screen-reader user knows why the button is unavailable.
- The impact statement is part of the dialog's description, so it is announced on open rather than left for the eye to find.
- The name to type must be selectable text in the label — a user copying it with the keyboard cannot copy from a placeholder or an image.

## Related patterns and components

- [Delete patterns](delete-patterns.md) — the tier test.
- [Delete with confirmation](delete-with-confirmation.md) — the tier for the same record with no reach.
- [Permission gating](permission-gating.md) — the guard this dialog is not.
- [Errors and validation](errors-and-validation.md) — where a rejected delete surfaces.
- Components: `AlertDialog`, `Field`, `Input`, `Alert`, `Button`.

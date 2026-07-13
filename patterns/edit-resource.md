# Edit resource

The same shape as the create form, pre-filled and dirty-tracked, in one of two sanctioned containers. **There is no inline edit and no split-board edit, in either container.**

### Pick the container by the form's size, not by taste

| | Use it when |
|---|---|
| **Overlay** — `Modal`, or `Sheet` when it needs room | One section of fields, no sub-navigation, and the user does not need the page behind it. **This is the default: most edits are a handful of fields, and a whole page for them is too heavy.** |
| **Dedicated page** | More than one section card, or a multi-step wizard; or the edit must be deep-linkable; or the form is long enough that the commit needs a sticky `ActionFooter` to stay reachable. |

The rule is decidable from the field list alone, so create and edit land in the same container and two authors reading this page reach the same answer. Everything below applies to both containers unless it names one.

[Create form](create-form.md) | [Style template](../demos/create-form.md) | [Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### Edit is create, pre-filled

Edit is create with the record loaded into it. Same `Field`s, same order, same hints. Share the field components between the two — one form, two entry points — so a field added to create cannot silently go missing from edit. Everything in [Create form](create-form.md) applies here unless this page says otherwise.

On a page: the reduced header, one column of section cards, and a sticky `ActionFooter`. In an overlay: the `Modal`'s own title and footer carry the title verb and the commit — do not nest an `ActionFooter` inside a `Modal`.

Three things differ, and only three: the title verb, the commit verb, and the dirty gate.

### The commit is disabled until something changed

Create always has something to submit. Edit does not: a user who opens the page and changes nothing has nothing to save, and a live _Save changes_ button invites a pointless round-trip that still writes an audit row. Track the draft against the loaded record and disable the commit while they match.

Disable it on **equality**, not on "the user has typed". A user who types a character and deletes it has changed nothing, and the button must go back to disabled — otherwise the dirty flag is a lie the rest of the page is built on.

### State transitions are actions, not fields

Locking a user, resetting their password, resending an invitation, deleting a role — none of these are properties of a form. They do not participate in the draft, they do not wait for _Save changes_, and they must not appear as a `Switch` or a `Checkbox` among the fields. Each is its own action with its own confirmation and its own permission code, and each takes effect the moment it is confirmed.

The test is reversibility of intent: a **field** is a value the user is proposing and may still abandon by cancelling. An **action** is a thing that happens. A lock toggle that only takes effect on _Save changes_ is a trap — the user believes the account is locked and walks away.

Put these on the detail page, or in the edit page's header as secondary actions — never in the card body among the fields, and never in an edit overlay at all: an overlay's footer belongs to the draft's commit and escape, and a lock that fires from beside _Save changes_ reads as part of the draft. See [Delete patterns](delete-patterns.md) for the destructive ones.

### It returns to where it came from

Create routes to the new record's detail page — there is nowhere else to go. An edit page returns to the record's detail page, which is almost always where the user started; do not dump them back on the list, because they came to look at one record and they still want to. An edit overlay simply closes onto the record it was opened from, which is the same promise kept for free — and is the main reason the overlay is the lighter choice.

### Leaving with unsaved changes is caught

A dirty form that the user navigates away from must ask first. See [Unsaved changes](unsaved-changes.md) — the dirty flag from the commit gate is the same flag that arms the guard, and if you compute it wrong, both break together.

An overlay has three ways out, not one: the escape button, the close affordance, and `Esc`. All three are "navigating away" — arm the guard on every one of them, or the cheapest container becomes the one that silently drops the user's work.

### There is no inline edit, and no split board

`@cloud/ui` ships no inline-edit affordance, and none is sanctioned. Do not build one out of a `TableColumn`'s `render` or a `KeyValue`'s `value` — a cell that becomes an input on click has no room for a label, a hint, an error, or a focus contract, and it will not survive the first validation rule.

Some existing screens edit a record in a right-hand pane beside a list of records. **That is legacy. Do not copy it into a new module.** It buries the record's identity, it has nowhere to put a page-level error, and its save button competes with the list for the user's attention.

## Building blocks

The create form's blocks, unchanged — see [Create form](create-form.md) for A through E. What is specific to edit:

#### A. Container

`Modal` (or `Sheet`) for a one-section form; a page for a multi-section one. Decide from the field list before you build either, and give create the same container — a create overlay whose edit is a page is two designs for one form.

#### B. Loaded draft

The record, fetched and copied into a draft. The pristine copy stays around so the dirty check has something to compare against.

#### C. Dirty gate

`disabled={!dirty || saving}` on the commit — the page's `ActionFooter` button, or the `Modal`'s footer button. `dirty` is a value comparison against the pristine copy, not a "has been touched" flag.

#### D. Header actions — page only

The record's state transitions — _Lock_, _Reset password_, _Delete_ — as `secondary` or `danger` buttons in the reduced header, per [Action weight](action-weight.md). Never among the fields. An edit overlay has no such header: leave its transitions on the detail page behind it.

## General guidelines

### Do

- Pick the container from the field list: one section of fields is an overlay, more than one is a page.
- Give create and edit the same container.
- Share the field components with the create page. One form, two entry points.
- Disable the commit while the draft equals the loaded record.
- Recompute `dirty` by comparing values, so an edit that is typed and untyped goes back to clean.
- Reset the dirty flag from the **response**, not from the submitted draft, or a successful save leaves the form permanently "dirty".
- Keep state transitions out of the form and give each its own confirmation.
- Return to the record's detail page on success.
- Guard navigation away from a dirty form. See [Unsaved changes](unsaved-changes.md).

### Don't

- Don't spend a whole page on a form of a handful of fields. That is what the overlay is for.
- Don't nest an `ActionFooter` inside a `Modal` — the modal's footer already carries the commit.
- Don't put state transitions in an edit overlay's footer. They are not the draft's commit.
- Don't let `Esc` or the close affordance skip the unsaved-changes guard.
- Don't build an inline editor from a table cell or a key-value row. There is no primitive, and no contract.
- Don't copy the legacy split-board edit into a new module.
- Don't put a lock, a reset, or a delete among the fields. They are not values the user is proposing.
- Don't leave the commit enabled on an untouched form.
- Don't route back to the list on success.
- Don't validate with rules the server does not have. One schema, both sides.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Title

- The verb plus the resource: _Edit role_. Not _Editing role_, not the record's name alone.
- The same wording whether it is the page title or the `Modal`'s title. The container changes; the sentence does not.

#### Buttons

- The commit is _Save changes_. Never _Save_, never _Submit_, never _Update_.
- The escape is _Cancel_.
- A state transition names its act: _Lock user_, _Reset password_.

#### Fields

- Identical to the create form's labels and hints. A field whose wording changes between create and edit reads as a different field.

## Accessibility guidelines

### General accessibility guidelines

- Every control has a programmatic label. `Field`'s `label` provides it; a placeholder does not.
- Never remove the focus ring.

### Component-specific guidelines

- The commit's disabled state is not self-explanatory on an edit page — a user who cannot see the form has no way to know nothing has changed. Do not rely on the button's appearance alone.
- On a failed save, move focus to the first invalid field.
- A state transition triggered from the header must return focus to its trigger when its dialog closes.

## Related patterns and components

- [Create form](create-form.md) — the shape this page reuses, and the source of its building blocks.
- [Unsaved changes](unsaved-changes.md) — the guard the dirty flag arms.
- [Detail page](detail-page.md) — where the user came from, and where a successful save returns them.
- [Delete patterns](delete-patterns.md) — the destructive state transitions and their tiers.
- [Action weight](action-weight.md) — the variant a header action takes.
- Components: `Field`, `Input`, `Textarea`, `Select`, `Combobox`, `Card`, `Button`; `Modal` or `Sheet` for the overlay container; `PageBody` and `ActionFooter` for the page container.

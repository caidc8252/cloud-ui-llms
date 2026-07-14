# Edit resource

The create form's fields, pre-filled and dirty-tracked. Edit several properties on a dedicated page; reserve `Modal` for one property or a small, tightly related group. **There is no inline edit and no split-board edit in this system.**

### Choose the edit pattern

| | Use it when |
|---|---|
| **Modal** | One property or a small, tightly related group that the user can understand and commit as one blocking action. |
| **Sheet** | A genuinely ancillary, page-scoped configuration. It supplements the current page; it is not the larger option for a resource edit. |
| **Dedicated page** | Several properties, especially when they are interdependent; or any edit with sections, an independent URL, a long session, recovery needs, sub-navigation, or several business regions. |

Start with page edit when the user is editing several properties of one resource. Use a modal only for a compact property-level edit, and a sheet only when the configuration is supplementary to the page rather than the user's primary edit task. Field count is a supporting signal; task scope and property dependency decide. See [Secondary panels](secondary-panels.md) for the sheet boundary.

An inline-edit pattern would suit one independent property across multiple resources, but this system has no inline-edit primitive or contract. `Modal` is not a way to simulate table-cell editing: it is a blocking property-level task with a title, validation, commit, and cancel path.

[Create form](create-form.md) | [Style template](../demos/create-form.md)

## Key UX concepts

### Edit is create, pre-filled

Edit is create with the record loaded into it. Same `Field`s, same order, same hints. Share the field components between the two — one form, two entry points — so a field added to create cannot silently go missing from edit. Everything in [Create form](create-form.md) applies here unless this page says otherwise.

On a page: the reduced header, one column of section cards in the scrolling `PageBody`, and an `ActionFooter` below it. In an overlay: `Modal` or `Sheet` owns the title, content, and footer — never nest an `ActionFooter` inside either overlay.

Three things differ, and only three: the title verb, the commit verb, and the dirty gate.

### The commit is disabled until something changed

Create always has something to submit. Edit does not: a user who opens the page and changes nothing has nothing to save, and a live _Save changes_ button invites a pointless round-trip that still writes an audit row. Track the draft against the loaded record and disable the commit while they match.

Disable it on **equality**, not on "the user has typed". A user who types a character and deletes it has changed nothing, and the button must go back to disabled — otherwise the dirty flag is a lie the rest of the page is built on.

### State transitions are actions, not fields

Locking a user, resetting their password, resending an invitation, deleting a role — none of these are properties of a form. They do not participate in the draft, they do not wait for _Save changes_, and they must not appear as a `Switch` or a `Checkbox` among the fields. Each is its own action with its own visibility, confirmation, and feedback, and each takes effect the moment it is confirmed.

The test is reversibility of intent: a **field** is a value the user is proposing and may still abandon by cancelling. An **action** is a thing that happens. A lock toggle that only takes effect on _Save changes_ is a trap — the user believes the account is locked and walks away.

Put these on the detail page, or in the edit page's header as secondary actions — never in the card body among the fields, and never in an edit overlay at all: an overlay's footer belongs to the draft's commit and escape, and a lock that fires from beside _Save changes_ reads as part of the draft. See [Delete patterns](delete-patterns.md) for the destructive ones.

### It returns to where it came from

A successful create shows the new record's detail view — there is nowhere else to go. A successful edit returns to the record's detail view, which is almost always where the user started; do not dump them back on the list, because they came to look at one record and they still want to. An edit overlay simply closes onto the record it was opened from, which is the same promise kept for free — and is the main reason the overlay is the lighter choice.

### Leaving with unsaved changes is caught

A dirty form that the user navigates away from must ask first. See [Unsaved changes](unsaved-changes.md) — the dirty flag from the commit gate is the same flag that arms the guard, and if you compute it wrong, both break together.

An overlay has three ways out, not one: the escape button, the close affordance, and `Esc`. All three are "navigating away" — arm the guard on every one of them, or the cheapest container becomes the one that silently drops the user's work.

### There is no inline edit, and no split board

`@cloud/ui` ships no inline-edit affordance, and none is sanctioned. Do not build one out of a `TableColumn`'s `render` or a `KeyValue`'s `value` — a cell that becomes an input on click has no room for a label, a hint, an error, or a focus contract, and it will not survive the first validation rule.

Some existing screens edit a record in a right-hand pane beside a list of records. **That is legacy. Do not copy it into a new module.** It buries the record's identity, it has nowhere to put a page-level error, and its save button competes with the list for the user's attention.

## Building blocks

The create form's blocks, unchanged — see [Create form](create-form.md) for A through E. What is specific to edit:

#### A. Container

Use a dedicated page for several properties or interdependent settings. Use `Modal` for one property or a small, tightly related group. Use `Sheet` only for ancillary page-scoped configuration, never because the edit is too large for a modal. Apply [Secondary panels](secondary-panels.md) before placing edit controls in a sheet.

#### B. Loaded draft

The record's initial displayed values become the pristine baseline. The editable draft is compared against that baseline to determine whether anything has changed.

#### C. Dirty gate

`disabled={!dirty || saving}` on the commit — the page's `ActionFooter` button or the overlay footer button. `dirty` is a value comparison against the pristine copy, not a "has been touched" flag.

#### D. Header actions — page only

The record's state transitions — _Lock_, _Reset password_, _Delete_ — as `secondary` or `danger` buttons in the reduced header, per [Action weight](action-weight.md). Never among the fields. An edit overlay has no such header: leave its transitions on the detail page behind it.

## General guidelines

### Do

- Use page edit for several properties, especially when their meanings or validation depend on one another.
- Use a modal for one property or a small, tightly related group.
- Use a sheet only for ancillary page-scoped configuration, not as the larger edit container.
- Share the field components with the create page. One form, two entry points.
- Disable the commit while the draft equals the loaded record.
- Recompute `dirty` by comparing values, so an edit that is typed and untyped goes back to clean.
- After a successful save, replace the pristine baseline with the values the form now displays, so the form becomes clean.
- Keep state transitions out of the form and give each its own confirmation.
- Return to the record's detail page on success.
- Guard navigation away from a dirty form. See [Unsaved changes](unsaved-changes.md).

### Don't

- Don't put a property-level edit on a whole page when one compact modal action is sufficient.
- Don't move a multi-property edit into a sheet merely because the panel scrolls.
- Don't nest an `ActionFooter` inside a `Modal` or `Sheet` — the overlay's footer already carries the commit.
- Don't put state transitions in an edit overlay's footer. They are not the draft's commit.
- Don't let `Esc` or the close affordance skip the unsaved-changes guard.
- Don't build an inline editor from a table cell or a key-value row. There is no primitive, and no contract.
- Don't copy the legacy split-board edit into a new module.
- Don't put a lock, a reset, or a delete among the fields. They are not values the user is proposing.
- Don't leave the commit enabled on an untouched form.
- Don't send the user back to the list on success.

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
- [Secondary panels](secondary-panels.md) — the authoritative boundary for ancillary page-scoped configuration.
- Components: `Field`, `Input`, `Textarea`, `Select`, `Combobox`, `Card`, `Button`; `Modal` or `Sheet` for an overlay; `PageHeaderBand`, `PageBody`, and `ActionFooter` for a page.

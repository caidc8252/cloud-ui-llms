# Create form

A single-page form for creating or editing a resource. The default create shape — use it unless the flow genuinely has stages.

[Style template](../demos/create-form.md) | [Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### Single step is the default

Many fields is not a reason to make a wizard. A wizard is for **staged** flows: a later step depends on an earlier answer, the flow branches, there is a review gate, or an external process runs between steps. Fields that are merely numerous but independent stay on one page, split into section cards. See [Create wizard](create-wizard.md) for the other side of that test.

### The exit lives in the header, the commit lives in the footer

The header is a reduced, sticky detail-style band: a back button and the title, and **no actions**. The commit pair — a ghost _Cancel_ and the primary create action — rides a sticky `ActionFooter` at the bottom. The user can always leave and can always submit, no matter how long the form is; neither scrolls out of reach.

### One column of section cards

The body is a single centered column of `Card`s, one per coherent group of fields. Grouping is semantic, not spatial: put fields together because they mean something together, not to balance the page. Two-up field rows inside a card are fine for short, paired inputs.

### Validation has one source

The zod schema that the route handler parses with is the same shape the form validates against. Field-level errors surface through `Field`'s `error` prop; a failed submit surfaces through the response's error code. Don't write a second, hand-rolled set of client rules that can drift from the server's. See [Errors and validation](errors-and-validation.md).

### Submission is a route handler

Server actions are banned. The form POSTs through `@cloud/request/client` to a route handler under `app/api/*`, then routes to the new record's detail page on success.

## Building blocks

#### A. Reduced header

A sticky header band with a `Button variant="ghost" size="icon-sm"` carrying a `ChevronLeft` (with `aria-label`) and the page title. No action buttons.

#### B. Page body

`PageBody`, which owns the page padding and the block gap. Do not hand-write page-level padding.

#### C. Section cards

`Card elevation={1}` per group, with `CardHeader` + `CardTitle` naming the group, and an optional `CardDescription` when the group needs a rationale.

#### D. Fields

`Field` (label, `required`, `hint`, `error`) wrapping the control — `Input`, `Textarea`, `Select`, `Combobox`, `DatePicker`, the labeled toggles.

#### E. Action footer

`ActionFooter` — a sticky, full-bleed band with a `ghost` Cancel and a `primary` commit. The commit takes `loading` while the request is in flight.

## General guidelines

### Do

- Group fields into section cards by meaning, and title each card.
- Mark required fields with `Field`'s `required`, and explain non-obvious ones with `hint` rather than with a tooltip.
- Put the commit in the sticky footer so it stays reachable on a long form.
- Set `loading` on the commit button while the request is in flight. It also disables the button, so you don't need a separate guard for double submits.
- Route to the new record's detail page on success.
- Keep the field components shared with the edit page — the same form usually serves create and edit.

### Don't

- Don't reach for a wizard just because the form is long.
- Don't put actions in the reduced header. The header's job is to let the user leave.
- Don't use a server action. Mutations go through a route handler.
- Don't validate with rules the server doesn't have. One schema, both sides.
- Don't disable the submit button until every field is touched. Let the user submit and show them what's wrong.
- Don't scatter unrelated fields across two cards for visual balance.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Page title

- Use the verb plus the resource: _Create user_, _Edit role_. No article.

#### Card titles

- Use a noun phrase naming the group: _Primary information_, _Options_, _Permissions_.

#### Field labels

- Use a short noun phrase in sentence case. No end punctuation, no trailing colon.

#### Hints

- State the constraint or the consequence, not the obvious. _Shown on the detail page._ beats _Enter a description._

#### Buttons

- The commit names the act: _Create record_, _Save changes_. Never _Submit_, never _OK_.
- The escape is _Cancel_.

## Accessibility guidelines

### General accessibility guidelines

- Every control has a programmatic label. `Field`'s `label` provides it; don't replace it with a placeholder.
- Never remove the focus ring.

### Component-specific guidelines

- The back button is icon-only and requires an `aria-label`.
- A field's error must be associated with its control, not merely painted red nearby, so a screen reader reads the reason when focus lands.
- Colour is never the only signal of an invalid field: `Field` pairs the tone with the error text.
- On a failed submit, move focus to the first invalid field, or the user is left guessing what changed.

## Related patterns and components

- [Create wizard](create-wizard.md) — the staged alternative, and the test for when to use it.
- [Edit resource](edit-resource.md) — this same shape, pre-filled, and the three things that differ.
- [Unsaved changes](unsaved-changes.md) — the exit guard this page needs, and the exits it does not cover.
- [Detail page](detail-page.md) — where a successful create lands.
- [Errors and validation](errors-and-validation.md) — the schema, the codes, and where each error surfaces.
- Components: `Field`, `Input`, `Textarea`, `Select`, `Combobox`, `DatePicker`, `Card`, `ActionFooter`, `PageBody`, `Button`.

# Create form

A single-page form for creating or editing a resource. The default for simple to medium-complex creation.

**Container:** for creation, use a `Modal` for about one simple primary field, this dedicated single page for about 2–15 primary fields or up to five setting groups, and a [Create wizard](create-wizard.md) for a long, complex, or interrelated flow. `Sheet` is not the middle size; [Secondary panels](secondary-panels.md) permits it only when creation is a supplementary sub-task of the current page. The blocks below describe the page shape — in an overlay, `Modal` or `Sheet` owns the title, content, and footer instead of `PageHeaderBand`, `PageBody`, and `ActionFooter`.

[Style template](../demos/create-form.md)

## Key UX concepts

### Choose the create pattern

| Pattern | Length baseline | Complexity and recovery |
|---|---|---|
| **Modal create** | About one simple primary field. | The value can be corrected after creation and errors can be resolved without leaving the trigger page. Example: create an API key when the only input is its name. |
| **Single-page create** | About 2–15 primary fields, or up to five coherent setting groups. | The form is simple to medium complexity, the values remain editable, and no concept needs its own page. |
| **Multipage create** | More than about 16 primary fields, or more than five setting groups. | The configuration is long or complex, tasks are interrelated, a concept needs its own page, or errors must be resolved step by step and checked again at review. |

These counts are design baselines, not API limits. Count required fields without a good default and fields most users need to inspect to succeed. Put less common fields under additional configuration with useful defaults. For a conditional flow, count the longest possible path.

Creating a sub-resource while a parent create remains the primary context is a supplementary task, not a fourth create size. It may use `Sheet` only when it remains one focused continuous flow; otherwise route to its own page and preserve the parent draft.

### Single page is the simple-to-medium default

Keep a create flow on one page when it has about 2–15 primary fields or up to five coherent setting groups and no concept needs a page of its own. Move to a wizard when the longest path is larger, the configuration is complex, or the tasks are interrelated. Dependency, branching, step-level validation, immutable choices, and a consequential review are strong wizard signals. See [Create wizard](create-wizard.md) for the other side of that test.

### On a page: the exit lives in the header, the commit lives in the footer

A create or edit **page** is level-2, so its header is `PageHeaderBand` — the default `variant="page"`, which is title, optional description, and a **built-in back button** you cannot omit. Give the back button its destination with `backTo`. The band carries **no actions**; its job is to let the user leave. It has no `sticky` prop and needs none: the band is a sibling of `PageBody`, the page's scroll root, so it never scrolls away.

The commit pair — a ghost _Cancel_ and the primary create action — rides an `ActionFooter` at the bottom, a sibling of `PageBody`, never nested inside it. Band, body, and footer are the three rows of the page's flex column; only `PageBody` scrolls. The user can always leave and submit, no matter how long the form is, without pinning either band.

### One column of section cards

The body is a single column of `Card`s, one per coherent group of fields, filling the width `PageBody` gives it — no `max-w-*` lock on the page or the column. Only an individual control that is meaningless when stretched (a price, a quantity) takes a narrow width, and it takes it at the field. Grouping is semantic, not spatial: put fields together because they mean something together, not to balance the page. Two-up field rows inside a card are fine for short, paired inputs.

Inside a `Field`, a control fills the field. That is automatic for `Input`, `Textarea`, `Combobox`, and `DatePicker`, and it is automatic for `Select` too once it is inside a `Field` — but a `Select` still needs an `items` map (value → label) on its root, or its trigger prints the raw value instead of the label. Nothing type-checks that.

### Validation appears where the user can act on it

Field-level errors surface through `Field`'s `error` prop. A failure affecting the whole form appears in an `Alert` at the top of the form. Do not duplicate the same message in a field, an alert, and a toast; give each failure one useful location. See [Errors and validation](errors-and-validation.md).

## Building blocks

#### A. Reduced header

`PageHeaderBand` with `title`, an optional `description`, and `backTo`. The back button is built in — you do not write it, and there is no prop that removes it. No `actions`.

#### B. Page body

`PageBody`, which owns the page padding and the block gap and is the page's one scroll root. Do not hand-write page-level padding, and do not add a width lock — the body fills the page.

#### C. Section cards

`Card elevation={1}` per group, with `CardHeader` + `CardTitle` naming the group, and an optional `CardDescription` when the group needs a rationale.

#### D. Fields

`Field` (label, `required`, `hint`, `error`) wrapping the control — `Input`, `Textarea`, `Select`, `Combobox`, `DatePicker`, the labeled toggles.

#### E. Action footer

`ActionFooter` — a full-bleed band placed as a **sibling of `PageBody`**, never inside it, with a `ghost` Cancel and a `primary` commit. It stays in view because it sits below the scrolling body, not because it is pinned. Both actions carry an icon: Cancel takes a leading `X`, and the commit takes the glyph of its verb (`Save` for _Save changes_, `Plus` for a create, `CheckCircle2` for a publish). `ActionFooter` is a children slot, so unlike a header's `HeaderAction[]` it cannot enforce that — use `Button`'s `iconLeft` / `iconRight` and don't skip it. The commit takes `loading` while submission is in progress.

## General guidelines

### Do

- Group fields into section cards by meaning, and title each card.
- Mark required fields with `Field`'s `required`, and explain non-obvious ones with `hint` rather than with a tooltip.
- Give the header's back button a real destination with `backTo`.
- Give the footer's buttons icons — the primary always, the escape by the same convention (Cancel → `X`, Back → `ChevronLeft`).
- Put the commit in the `ActionFooter`, as a sibling of `PageBody`, so it stays reachable on a long form.
- Set `loading` on the commit button while submission is in progress. It also disables the button, so you don't need a separate guard for double submits.
- After success, show the created record in the context the user expects, normally its detail view.
- Keep the field components shared with the edit page — the same form usually serves create and edit.

### Don't

- Don't keep a long or complex configuration on one page solely because its fields are independent; apply the length and complexity tests in [Create wizard](create-wizard.md).
- Don't put actions in the reduced header. The header's job is to let the user leave.
- Don't hand-build the header's back button, and don't use `ContentHeader` as the page header.
- Don't cap the form's width with a `max-w-*`. Width belongs to the field, not to the page.
- Don't repeat one failure across several feedback surfaces.
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

- The band's built-in back button is icon-only and ships with its own `aria-label`; give it a destination with `backTo` rather than leaving it on history.
- A field's error must be associated with its control, not merely painted red nearby, so a screen reader reads the reason when focus lands.
- Don't hand a `Field` an `error` before the user has touched it or submitted. A form that opens already red is reporting _not yet filled in_ as _filled in wrongly_, and nothing in the type system stops you.
- Colour is never the only signal of an invalid field: `Field` pairs the tone with the error text.
- On a failed submit, move focus to the first invalid field, or the user is left guessing what changed.

## Related patterns and components

- [Create wizard](create-wizard.md) — the multipage alternative for long, complex, or interrelated creation.
- [Edit resource](edit-resource.md) — this same shape, pre-filled, and the three things that differ.
- [Secondary panels](secondary-panels.md) — the narrow case in which creation is a supplementary page task.
- [Unsaved changes](unsaved-changes.md) — the exit behaviour this form needs.
- [Detail page](detail-page.md) — where a successful create lands.
- [Errors and validation](errors-and-validation.md) — which feedback surface each error uses.
- Components: `Field`, `Input`, `Textarea`, `Select`, `Combobox`, `DatePicker`, `Card`, `PageHeaderBand`, `ActionFooter`, `PageBody`, `Button`.

# Create form demo

A single-page create or edit flow for an independent set of fields. It uses one readable form column, section cards, a persistent exit, and a persistent action footer.

[View pattern](../patterns/create-form.md)

## On this page

1. Key UX concepts
2. Building blocks
3. General guidelines
4. Writing guidelines
5. Accessibility guidelines
6. Related patterns

## Key UX concepts

### Single step is the default

Use this flow when users can understand, complete, and validate the task without staged navigation. A wizard adds friction unless the task has genuinely related phases or a review requirement.

### Exit and commit have separate homes

The reduced header gives users a consistent way to leave the form: `PageHeaderBand`, whose back button is built in and whose `backTo` names the destination. The action footer sits below the scrolling body rather than inside it, so cancel and the primary commit stay available however long the form runs, without competing with the page title. The header stays in view for the same reason.

### Section cards create a reading order

Cards group fields that belong to the same subject. The body remains a single column so users can move through the form in one predictable sequence. It fills the page's width — a form is not width-locked, and only an individual control that is meaningless when stretched gets a narrow width, at the field.

### Validation has one owner

The template shows presentation only. The feature owns field state, validation rules, submit status, and error mapping; the server remains authoritative for final validation.

## Building blocks

#### A. Reduced header

Use `PageHeaderBand` with the task title and `backTo`. The back button is part of the band, so there is nothing to build; the destination should be explicit rather than relying on browser history. Leave `actions` empty — the header's job is the exit.

#### B. Page body

Use `PageBody` to provide the standard content padding and vertical rhythm. It is also the page's scroll region — the fields scroll here, between the header and the action footer. It does not constrain the column's width, and neither should you.

#### C. Section cards

Use `Card`, `CardHeader`, `CardTitle`, and `CardContent` to group related fields such as primary information and optional settings.

#### D. Fields

Use `Field` to connect a label, hint, required state, and error message with `Input`, `Textarea`, or another appropriate control. Inside a `Field`, the control fills the field. A `Select` still needs an `items` map of value to label on its root, or its trigger shows the raw value.

#### E. Action footer

Use `ActionFooter`, as a sibling of `PageBody` and never inside it, for a ghost-weight cancel action and one primary create or save action. Being a sibling is what keeps it in view: the body scrolls, the footer does not. Both carry an icon: cancel takes a leading `X`, and the commit takes its verb's glyph.

## General guidelines

### Do

- Use this layout for simple and medium-complex create or edit tasks.
- Group fields by the user's mental model rather than by storage schema.
- Validate before submission and surface server validation alongside the relevant field.
- Keep the action footer visible until the form is completed or intentionally exited.

### Don't

- Don't use a single-page form for a long, branching, or review-heavy workflow.
- Don't place the primary save action in the header and footer at the same time.
- Don't use placeholder text as the only field label.
- Don't submit directly from UI code outside the application's request boundary.

## Writing guidelines

### General writing guidelines

- Use sentence case, active voice, and present-tense verbs.
- Use complete sentences with end punctuation for hints and validation messages.
- Use specific action labels such as `Create customer` or `Save changes`.

### Component-specific guidelines

#### Page title

Use a verb-led task title, such as `Create customer` or `Edit contract`.

#### Card titles

Use a short noun phrase that identifies the group of fields, such as `Primary information` or `Options`.

#### Field hints and errors

Explain a constraint or purpose in the hint. State what must change in an error message and avoid exposing implementation details.

## Accessibility guidelines

### General accessibility guidelines

- Associate every control with a visible label and expose validation errors to assistive technology.
- Keep the tab order aligned with the visual and reading order.
- Preserve focus indicators and use more than color to communicate errors or required fields.

### Component-specific guidelines

#### Back action

The band's built-in back button renders a real link when given `backTo`, and it carries its own accessible name.

#### Action footer

Keep footer actions reachable after the final field and clearly distinguish cancel from the primary commit action.

## Related patterns

- [Create wizard](../patterns/create-wizard.md)
- [Errors and validation](../patterns/errors-and-validation.md)
- [Action weight](../patterns/action-weight.md)
- [Permission gating](../patterns/permission-gating.md)

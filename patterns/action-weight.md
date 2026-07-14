# Action weight

How to choose a button variant. The rule is one sentence: **the variant follows the slot, not the verb.**

[Button](../components/button.md)

## Key UX concepts

### The same verb changes weight with its slot

_Export_ is `secondary` in a `PageHeader` and `ghost` in a `ListSummaryBar`. This is not an inconsistency to be fixed — it is the rule. A button's weight communicates its standing **on the surface it sits on**, and the same act has different standing in different places.

The summary bar is a low-chrome strip _inside_ the results card. An outlined button there draws a box inside a box, and it competes visually with the result count, which is the thing the bar exists to show. So the bar demotes everything.

### One primary per screen

A screen has at most one `variant="primary"` action. If a second action looks important enough to be primary, it isn't — it is the second most important action, and that is what `secondary` means. Secondary actions do not get to steal primary.

### The summary bar's ladder

Actions in `ListSummaryBar` climb a fixed ladder:

- `ghost` — every tool verb (Export, Import, Refresh) and every neutral bulk verb. This is the default and it covers almost everything.
- `ghost-danger` — a destructive bulk verb, so the whole bulk group still reads at one weight rather than one button shouting.
- `primary` — only when the bar holds the surface's single commit verb **and** no `PageHeader` sits above it. A list page always has a header, so a list page's bar never has a primary.
- `secondary` — last resort, and only with the reason named in a comment.

No component enforces this. `actions` is a caller-supplied node, so the ladder is a review rule, not a type error.

### A header action is a descriptor, and it always has an icon

`PageHeader` and `PageHeaderBand` don't take button JSX in their `actions` prop — they take `HeaderAction[]` descriptors: `{label, icon, to?/onClick?, variant?, disabled?}`. Two consequences fall out of that shape. `icon` is **required**, so a header action without one does not compile. And there is no `size` field, so every header button is `md` and a `sm` one cannot get in — the size rule is enforced by the type, not by review.

The same icon expectation reaches the `ActionFooter`'s primary, which is a children slot and therefore cannot enforce it: give the commit an icon with `Button`'s `iconLeft` / `iconRight`. The conventions are fixed — Continue → a trailing `ChevronRight`, Back → `ChevronLeft`, Cancel → `X`, Create → `Plus`, Save → `Save`, Publish → `CheckCircle2` — and anything else takes the glyph of its verb.

### Danger is a variant, not a colour

A destructive action carries its meaning through `variant="danger"` or `variant="ghost-danger"`. Never paint a neutral button red by hand: the variant also carries the hover, the active, and the focus treatment, and a hand-coloured button loses all of them while looking correct in a screenshot.

### Icon actions are neutral or danger, and nothing else

An icon-only action in a row or a toolbar is `ghost` or `ghost-danger`. It does not get a fill, a stroke emphasis, or a brand colour. The row is the content; the icon is a tool.

## Building blocks

#### A. Page header actions

`PageHeader`'s (or `PageHeaderBand`'s) `actions` prop — a `HeaderAction[]`, each with a required `icon` and no `size`. The screen's one `primary` CTA lives here, with `secondary` for the rest; `secondary` is also the default when a descriptor names no `variant`.

#### B. Summary bar actions

`ListSummaryBar`'s `actions` slot. Ghost by default, `ghost-danger` for a destructive bulk verb.

#### C. Card actions

`CardAction` in a `CardHeader` — a block-level action, `secondary` or `ghost` depending on how much the block should assert itself.

#### D. Row actions

`Table`'s `rowActions` render prop — `ghost` / `ghost-danger` verbs at `size="sm"`, each with a unique `aria-label`. They share the trailing cell with the chevron `Table` appends for a navigable row (verbs first, chevron last); you never build that column yourself.

#### E. Form footer

`ActionFooter` — a `ghost` escape (Cancel, Back) and a `primary` commit, both carrying an icon.

#### F. Dialog footer

The destructive confirmation takes `variant="danger"`; the escape is `ghost`.

## General guidelines

### Do

- Choose the variant by asking what slot the button is in, then what standing it has there.
- Keep exactly one `primary` per screen.
- Give every header action and every footer primary an icon, following the verb conventions.
- Use the `Button` component. A bare `buttonVariants()` className skips `cn()` / tailwind-merge, so `secondary`'s transparent base border never resolves against the real one and the button ships with no border at all. When you need a link, keep the component and swap the element: `<Button render={<Link to={…} />}>`.
- Demote everything in the summary bar to `ghost`, including the verbs that were `secondary` in the header.
- Use `ghost-danger` for destructive actions in low-chrome contexts, and `danger` for the confirmation itself.
- Name the reason in a comment when a slot's default weight is broken.
- Give every icon-only button an `aria-label` that is unique on the page.

### Don't

- Don't pick the variant from the verb. _Delete_ is not automatically `danger`; a `ghost-danger` row icon is often the right weight, and the filled `danger` belongs in the confirmation.
- Don't put a `secondary` or `primary` button in the summary bar.
- Don't run two primaries on one screen.
- Don't try to size a header action. There is no `size` field, and that is deliberate: header buttons are `md`.
- Don't colour a button by hand to make it look destructive.
- Don't give an icon action a fill or a brand tint to make it "findable". If it needs to be findable, it needs a label.

## Writing guidelines

### General writing guidelines

- Use sentence case. No end punctuation in a label.
- Start with an action verb: _Create_, _Export_, _Delete_.

### Component-specific guidelines

- Use one or two words. Add the noun only when the verb is ambiguous on its own: _Create role_, not _Create a new role_.
- Don't confirm with _Yes_. The confirming button names the act — _Delete_, _Revoke_, _Cancel invitation_.
- A tool verb keeps its name across slots. Export is _Export_ whether it is `secondary` or `ghost`; only the weight changes.

## Accessibility guidelines

### General accessibility guidelines

- Weight is a visual signal only. Nothing about a button's importance may depend on its variant to be understood — the label carries the meaning.
- Never remove the focus ring from a ghost button. It is the variant with the least resting affordance, so it needs the focus ring most.

### Component-specific guidelines

- Repeated row actions need distinct accessible names (_Delete Admin role_, not five identical *Delete*s).
- Danger variants must not rely on red alone. The label says what will happen.

## Related patterns and components

- [List page](list-page.md) — the header/summary-bar split that makes this rule visible.
- [Interactive surfaces](interactive-surfaces.md) — why row hover and inline-action hover must differ.
- [Permission gating](permission-gating.md) — hiding an action the user can't perform, which happens _after_ you have chosen its weight.
- Components: `Button`, `PageHeader`, `PageHeaderBand`, `HeaderAction`, `ListSummaryBar`, `ActionFooter`, `CardAction`, `AlertDialog`.

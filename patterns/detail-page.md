# Detail page

Everything known about a single resource, on one page, with tabs when there is more than one sibling block of information.

[Style template](../demos/detail-page.md) | [Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### One page, tabs — not sub-routes

The default detail page is a single route with same-page `Tabs`. The `Tabs` root wraps the **whole page**, including the header band, because the band's bottom edge is where the `TabsList` docks. Per-tab sub-routes are the exception, not the shape.

Split a block into its own sub-route only when it is heavy (its own list, its own pagination) or independently permissioned, and note the reason where you do it.

### The band and the tabs are one object

`PageHeaderBand` carries the title, the status badges, the meta line, and the actions — and its `tabs` slot renders a line-variant `TabsList` with `shadow-none`, so the underline meets the band's bottom edge instead of floating above it. Passing a default `TabsList` there produces a visible seam; that is what the `shadow-none` is for.

### Layout follows the number of blocks

- One or two core blocks: lay them out directly in the overview, no tabs.
- Several sibling blocks: same-page tabs.
- A heavy or separately-permissioned block: a sub-route.

### The overview is a key-value grid

Use `KvGrid` (which applies the `grid-auto-fit-kv` class) with `KeyValue` children. Columns auto-fit to the **card's** width, not to viewport breakpoints — a detail card in a narrow column reflows on its own. Never hand-write `grid-cols-[repeat(auto-fit,minmax(...))]`; the arbitrary-value lint blocks it, and the hand-written version usually forgets the `min(…, 100%)` that keeps a column from overflowing a phone-width container.

### Mutations leave the page

An edit on a detail page opens a modal (or navigates to the edit form) and commits through a route handler. The page then refetches. Detail pages don't hold inline form state for their own fields.

## Building blocks

#### A. Tabs root

`Tabs` wrapping the entire page, with `defaultValue` set to the overview tab.

#### B. Header band

`PageHeaderBand` — back button, title, status badges, meta line, actions, and the `tabs` slot.

#### C. Back button

`Button variant="ghost" size="icon-sm"` with a `ChevronLeft` and a required `aria-label`, far left, no text. It renders a real `Link`.

#### D. Status and meta

`Badge` (with `dot` for status) next to the title; a meta line of small icon-plus-text pairs beneath it — created date, reference, owner.

#### E. Tab strip

`TabsList` with `shadow-none` in the band's `tabs` slot, and a `TabsTrigger` per block. A count in a trigger rides in a small counter element, not in the label text.

#### F. Tab panels

`TabsContent` with `PAGE_BODY_PADDING_CLASS_NAME` — the panel supplies the page padding that `PageBody` would otherwise own, because the tabs live above it.

#### G. Overview blocks

`Card` + `KvGrid` + `KeyValue` for the summary, optionally alongside a `StatCard` column for the at-a-glance numbers.

#### H. Actions

Page-level actions in the band's action slot; block-level actions in each `Card`'s `CardAction`.

## General guidelines

### Do

- Wrap the whole page in `Tabs` so the strip can dock to the band's edge.
- Use `KvGrid` for the overview, and let the columns auto-fit the card.
- Put the status where the title is — a resource's state is part of its identity, not a detail buried in the grid.
- Render an unknown or absent value as `—`.
- Give every modal and every tab panel body its own file. A tab strip with N panels is N components, not one page file.
- Note the reason in a comment when a block becomes a sub-route.

### Don't

- Don't split every tab into a route just to keep the page file small. Split the components instead.
- Don't put a default `TabsList` in the band's `tabs` slot. It needs the line variant and `shadow-none`.
- Don't hand-write the auto-fit grid. Use `KvGrid`.
- Don't edit fields inline on the detail page. Mutations go through a modal or the edit page, then a route handler.
- Don't stack more than one `variant="primary"` action in the band.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Avoid device-specific language such as "click".

### Component-specific guidelines

#### Page title

- Use the resource's own name — the thing the user came looking for — not the resource type.

#### Tab labels

- Use a plural noun for a collection tab (_Items_, _Members_) and a singular noun for a singleton (_Overview_, _Settings_).
- Put a count in the counter slot, not in the label.

#### Key-value labels

- Use a short noun phrase. No trailing colon; the grid supplies the separation.

#### Meta line

- Keep it to identity and time: created, reference, owner. It is not a second key-value grid.

## Accessibility guidelines

### General accessibility guidelines

- Tabs follow the standard keyboard model: arrow keys move between triggers, and the panel is labelled by its trigger.
- Never remove the focus ring.

### Component-specific guidelines

- The back button is icon-only and requires an `aria-label` naming where it goes.
- Status must not be carried by badge colour alone; the badge has text, and the `dot` is an addition to it, not a replacement.
- A tab's count must be part of the trigger's accessible name, so a screen-reader user hears _Items, 2_ rather than just _Items_.

## Related patterns and components

- [List page](list-page.md) — where the user came from.
- [Create form](create-form.md) — where a create lands after success.
- [Edit resource](edit-resource.md) — where the page's _Edit_ action goes, and where a save returns.
- [Delete patterns](delete-patterns.md) — the tier the page's delete action takes, computed from the record.
- [Timestamps](timestamps.md) — how the created/updated values in the meta line are stored and rendered.
- [Permission gating](permission-gating.md) — hiding a block or an action the session can't use.
- Components: `PageHeaderBand`, `Tabs`, `KvGrid`, `KeyValue`, `StatCard`, `Card`, `Badge`, `Modal`.

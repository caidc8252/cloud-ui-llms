# Interactive surfaces

How a clickable thing tells the user it is clickable, and how it tells them what it did. Rows, cards, tiles, toggles — the rules are the same and there is one hard rule among them.

[Binding rules](../../../../.claude/team-rule/coding-rules/ui_ui-and-pages.md)

## Key UX concepts

### Feedback comes from the background

A hover or press is signalled by a **background** change, not by a lone border or ring appearing. A border that materializes on hover shifts the perceived size of the element and reads as a rendering glitch; a background wash reads as a surface responding. Borders belong to structure, backgrounds belong to state.

### Selected is not hover — this is a hard rule

A selected surface uses the primary tone, and **it must override hover**. If hovering a selected row makes it look unselected, or if a hovered row is indistinguishable from a selected one, the user cannot tell what state the interface is in. This is the single most common way a list of selectable things becomes unusable, and it is a hard rule precisely because it looks fine until you have both states on screen at once.

### Navigational and selectable are different behaviours

- **Navigational** — clicking leaves the page. It gets hover and press feedback, and **no lit state**. There is nothing to stay lit for; the user is gone.
- **Selectable / toggle** — clicking changes state and the user stays. It gets a selected state, and that state outranks hover.

Deciding which one a row is happens before you style it. A row that both navigates and can be selected needs the selection to live in its own control (a checkbox), not in the row surface.

### Never hand-roll a clickable div

A selectable or toggleable surface is a `Toggle` or a `Button`, not a `div` with an `onClick`. The hand-rolled version has no keyboard access, no focus ring, no pressed state, and no accessible role — and it will pass every visual review.

### Inline actions must not fire the row

An action button inside a navigational row has two obligations: its hover must be visually **distinct** from the row's hover, and clicking it must **not** trigger the row's navigation. This is why the row hover wash (`state-row-hover`) is deliberately weaker than the general surface hover (`surface-hover`) — it leaves room for a ghost icon button inside the row to hover _deeper_ than the row it sits in. If both used the same value, the button would disappear into its own row on hover.

### Clickable things say so

Every clickable element carries `cursor-pointer`. This is a MUST in the style spec, and it is the cheapest possible affordance.

## Building blocks

#### A. Row hover

`bg-state-row-hover` — the weaker wash, for a navigational table row.

#### B. Surface hover

`bg-surface-hover` — the standard wash, for a control or a ghost button, including one nested inside a hovered row.

#### C. Pressed

`bg-surface-active` — the press state.

#### D. Selected

`bg-state-selected` — the primary-tinted wash, which must win over hover. `--shadow-row-selected` adds the left bar on a selected table row.

#### E. Interactive card

`Card interactive` — hover moves the border to `line-strong` and lifts the shadow. It is presentation only; the card still needs a real interactive element inside it (see [Card](../components/card.md)).

#### F. Toggleable control

`Toggle` or `ToggleGroup` for a surface whose job is to be on or off.

#### G. Row actions

`ghost` or `ghost-danger` icon buttons, with `stopPropagation` on the click so the row's navigation does not also fire.

## General guidelines

### Do

- Signal state with the background.
- Make the selected state override hover, always.
- Decide whether a surface navigates or selects before you style it, and give it only that behaviour's states.
- Use `Toggle` or `Button` for anything selectable.
- Put `cursor-pointer` on everything clickable.
- Stop propagation on inline row actions.
- Let a nested ghost button hover deeper than its row.

### Don't

- Don't use a bare border or ring change as the hover signal.
- Don't let hover repaint a selected surface into looking unselected.
- Don't give a navigational row a lit or persistent state.
- Don't build a clickable `div`.
- Don't give a row action the same hover value as the row.
- Don't put an interactive element inside a card that is itself fully clickable — they compete for the same click.
- Don't emphasize an icon action with a fill or a brand tint. Icon actions are neutral or danger only.

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.

### Component-specific guidelines

- An icon-only row action's `aria-label` names the target, not just the verb: _Delete Admin role_.
- A toggle's label states what being on means, not what pressing it does. _Email notifications_, not _Enable email notifications_.

## Accessibility guidelines

### General accessibility guidelines

- Every interactive surface is keyboard reachable and operable, in the reading order of the page.
- Never remove the focus ring. Ghost and borderless surfaces need it most, because they have the least resting affordance.
- State is never carried by colour alone — a selected row's tint is paired with a checkbox, a badge, or the selected-row bar.

### Component-specific guidelines

- `onRowClick` is a mouse affordance. A row that navigates needs a real focusable link inside it, or keyboard users cannot open it.
- An inline action inside a navigational row must be individually focusable, and activating it with the keyboard must not also activate the row.
- A hand-rolled clickable `div` has no role and no keyboard behaviour. This is not a styling shortcut; it removes the element from the keyboard interface entirely.

## Related patterns and components

- [List page](list-page.md) — rows, row actions, and row navigation.
- [Action weight](action-weight.md) — the variant a row action takes.
- [Card](../components/card.md) — the `interactive` prop and what it does and does not give you.
- Components: `Toggle`, `ToggleGroup`, `Button`, `Card`, `Table`, `ObjectTile`.

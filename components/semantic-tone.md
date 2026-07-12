# Semantic tone

The status vocabulary shared by every status-bearing component: `neutral`, `success`, `warning`, `error`, `info`. **Read this before inventing a status colour or adding a colour-carrying prop.**

[Colors](../foundations/colors.md) | [Design tokens](../foundations/design-tokens.md)

## Development guidelines

Two **orthogonal** styling dimensions run through `@cloud/ui`. Keeping them apart is the whole design:

- **`variant` is form.** How the thing is _drawn_: filled, outline, ghost, soft, link. It carries emphasis, not meaning.
- **`tone` is semantic status colour.** What the thing _means_: neutral, success, warning, error, info. It maps to the semantic tokens (`success-bg`, `error-strong`, …), never to a raw colour.

A component that colours by health, status, or result **exposes `tone`** — it does not grow bespoke `variant` values like `variant="green"`. A component that colours by emphasis exposes `variant`. Most status-bearing components (`Badge`, `Alert`, `Progress`, `StatusCard`) take `tone`.

### Where the two are deliberately fused

`Button` does **not** open a `variant × tone` matrix, because most of its cells would be invalid — there is no such thing as a `ghost × info` button in this system, and offering one invites nonsense. Instead the blessed combinations are folded into a single enumerated `variant`: `danger`, `ghost-danger`, `destructive`.

This is a choice, not an oversight. When you build a component whose form and colour are **not** freely combinable, enumerate the valid pairs rather than crossing two axes — and say so in a comment, so the next reader sees a decision instead of a slip.

### Components subset the union

A component takes only the tones it can actually mean. `Progress` has no `neutral` — omitting `tone` already yields the brand colour, so a `neutral` progress bar would be a second way to say the same thing. Components narrow the union with `Exclude`/`Pick` rather than accepting a tone they will silently ignore.

## General guidelines

### Do

- Expose `tone` for anything coloured by status, health, or result.
- Reserve `variant` for visual form — filled, outline, ghost, soft, link.
- Enumerate the valid pairs when form and colour are not freely combinable, and comment the choice.
- Narrow the tone union to what the component can genuinely mean.
- Reach for `info` when nothing is wrong. `warning` says "look before you continue"; `error` says "this failed".

### Don't

- Don't add a bespoke `variant` value to carry a status colour. That is what `tone` is for.
- Don't cross `variant × tone` on a component whose pairs are not all valid.
- Don't paint a status by hand with a colour utility. If no tone carries the meaning, **stop and raise it** — a sixth status is a system decision, not a local one.
- Don't accept a tone the component will ignore. Subset the union instead.
- Don't borrow `success` green for a category or a neutral value. A status colour that appears on a non-status thing stops meaning anything.

## Features

- #### The union

  ```ts
  type Tone = "neutral" | "success" | "warning" | "error" | "info";
  ```

- #### Meaning, not decoration

  | Tone      | Says                                                                               |
  | --------- | ---------------------------------------------------------------------------------- |
  | `neutral` | no status — a plain label, a count, a category                                     |
  | `success` | healthy, active, completed                                                         |
  | `warning` | attention needed, nothing has failed yet — degraded, expiring, approaching a limit |
  | `error`   | failed, offline, blocking — and the emphasis on a destructive act                  |
  | `info`    | a neutral notice that is neither good nor bad news                                 |

## Accessibility guidelines

### General accessibility guidelines

- **Colour is never the only signal.** Every tone pairs with text or an icon, so the meaning survives when the colour cannot be seen. Green alone is not "healthy".

### Component-specific guidelines

- A tone drives the token pair (background and foreground) together, so contrast holds in both light and dark. Do not override one half of the pair.

## Related patterns and components

- [Colors](../foundations/colors.md) — the tokens each tone resolves to, and where not to reach for them.
- [Badge](badge.md), [Alert](alert.md), [Progress](progress.md), [Status card](status-card.md) — the status-bearing components that take a tone.
- [Button](button.md) — the deliberate exception, with its enumerated danger variants.
- [Action weight](../patterns/action-weight.md) — why a destructive button is a variant, not a colour.

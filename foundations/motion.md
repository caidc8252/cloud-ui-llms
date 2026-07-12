# Motion

Motion helps enhance the user experience by making a user interface both easy to use and more expressive.

[Design tokens](design-tokens.md) | [Interactive surfaces](../patterns/interactive-surfaces.md)

## Why we need motion

Motion in a backoffice interface has one job: to explain a change that just happened. A panel that appears instantly leaves the user to work out where it came from and what it replaced. The same panel sliding two pixels while it fades in answers both questions before the user has to ask them.

That job is narrow, and it sets the budget. Motion here is short, small, and almost invisible — the durations top out at 320ms and the travel distances are measured in single pixels. Anything longer or larger is decoration, and decoration on a working surface is a tax the user pays on every interaction, forever.

## Motion principles

**Motion explains, it does not perform.** Every animation in the system answers "where did this come from" or "what just changed". If it answers neither, it should not exist.

**The tokens carry the timing.** Durations and easings are tokens (`--duration-*`, `--ease-*`), not numbers typed at the call site. This is not tidiness: it is how reduced-motion support works. A component that reads the tokens gets it for free; a component that hardcodes `duration-200` keeps animating for a user who asked it to stop.

**Small travel.** Entrances move 2px, not 20px. The system's slide utilities are `slide-in-from-*-2` — the movement is a hint of direction, not a journey.

**Consistent direction.** A surface exits the way it entered. A dropdown that slides down on open slides up on close; anything else reads as two unrelated events.

## Transform patterns in motion

The system uses three transforms, and combines them rather than inventing new ones:

- **Fade** (`fade-in-0` / `fade-out-0`) — the base of every entrance and exit. On its own it says "this appeared", with no claim about where from.
- **Zoom** (`zoom-in-95` / `zoom-out-95`) — a 5% scale, for surfaces that belong to their trigger: popovers, dropdowns, tooltips, dialogs. It reads as the surface growing out of the thing that opened it.
- **Slide** (`slide-in-from-top-2`, `-bottom-2`, `-left-2`, `-right-2`) — 2px of directional travel, for surfaces with an edge: a dropdown below its trigger, a sheet from the right, a toast from its corner.

A dropdown is fade + zoom + slide-from-top; a sheet is fade + a larger slide from its edge; a tooltip is fade + zoom. The composition tells the user the surface's relationship to what opened it.

Two continuous animations exist and both are status, not transition: `animate-spin` (the `Spinner`, and the `Button`'s loading icon) and `animate-pulse` (`Skeleton`).

## Properties of motion

### Easing

| Token               | Curve                        | Use                                                                                    |
| ------------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| `--ease-standard`   | `cubic-bezier(0.2, 0, 0, 1)` | The default. Everything that opens, closes, expands, or changes colour.                |
| `--ease-emphasized` | `cubic-bezier(0.3, 0, 0, 1)` | Entrances that should feel decisive — a surface arriving that the user is waiting for. |

Both curves start fast and settle slowly. Nothing in the system eases _in_ — a surface that starts slowly reads as sluggish, because the user has already committed to the action by the time it begins.

### Duration

| Token                | Value   | Use                                                                                     |
| -------------------- | ------- | --------------------------------------------------------------------------------------- |
| `--duration-instant` | `80ms`  | A state flip with no perceived travel — a checkbox, a toggle's tick.                    |
| `--duration-fast`    | `120ms` | Hover and press feedback. **The most-used duration in the system.**                     |
| `--duration-normal`  | `200ms` | The default transition: open, close, expand, collapse.                                  |
| `--duration-slow`    | `320ms` | Large surfaces only — sheets and drawers, where the travel distance justifies the time. |

The instinct to reach for something longer than `slow` should be read as a signal that the motion is doing too much, not that the token is too short.

## Supported use cases

### Showing and hiding elements

Overlays — `Popover`, `DropdownMenu`, `Tooltip`, `Modal`, `AlertDialog`, `Sheet`, `HoverCard`, `ContextMenu`, `Menubar` — animate through the `data-[state=open]` / `data-[state=closed]` attributes their primitives already set, composed from fade + zoom + slide. You do not wire this per component; using the primitive gets you the entrance and the exit.

### State transitions

Hover, press, focus, and selection changes are `transition-colors` at `duration-fast`. This is the overwhelming majority of motion in the product, and it is the reason `duration-fast` dominates the codebase.

Transition the properties that actually change — `transition-colors`, `transition-[box-shadow,border-color]` — rather than `transition-all`. `transition-all` animates properties you did not intend to animate, including layout ones, and that is how a hover ends up costing a reflow.

### Loading states

- `Skeleton` — `animate-pulse`, for content whose shape is known. Preferred, because it holds the layout still.
- `Spinner` — `animate-spin`, with `role="status"`, for work whose shape is unknown.
- `Button loading` — swaps the leading icon for a spinner and disables the button.
- `ChartSkeleton` — a shimmer, which **stops entirely** under reduced motion.

### Items

Rows, cards, and list items do not animate on mount. A list that staggers its rows in makes the user wait to read data that had already arrived. Rows animate only in response to a user action — hover, selection, removal.

## Accessibility in motion

Motion is an accessibility hazard before it is a delight. Vestibular disorders make large or rapid movement genuinely painful, which is why the travel distances here are 2px and the durations are short.

`prefers-reduced-motion: reduce` is honoured at the root: **all four duration tokens are set to `0ms`**. Every component that reads them stops transitioning, without any component-level branch. Continuous animations that a zero duration cannot stop are handled explicitly — the chart skeleton's shimmer sets `animation: none`.

The rule that follows: a component that hardcodes a duration silently opts its users out of that protection. This is the concrete reason the tokens are mandatory, and it is worth more than the consistency argument.

Motion is also never the sole carrier of meaning. A spinner is accompanied by `role="status"`; a state change is accompanied by a colour, a label, or an icon that persists after the animation ends.

## Implementation

### Enabling motion

Motion arrives with the stylesheet — `tw-animate-css` is imported by the token sheet, which is imported once in the app's global CSS. Nothing to install per component.

### Respecting user preferences

Handled at the root; see above. Do not write your own `prefers-reduced-motion` block unless you are adding a **continuous** animation (a shimmer, a marquee), which a zero duration cannot switch off. In that case, disable it explicitly, the way the chart skeleton does.

### Use in custom components

```text
# Entrance and exit, driven by the primitive's data-state:
data-[state=open]:animate-in  data-[state=open]:fade-in-0
data-[state=open]:zoom-in-95  data-[state=open]:slide-in-from-top-2
data-[state=closed]:animate-out  data-[state=closed]:fade-out-0
data-[state=closed]:zoom-out-95

# Interaction feedback — name the properties, take the token:
transition-colors duration-fast
transition-[box-shadow,border-color] duration-fast
```

- Take the duration from a token. Never type `duration-[180ms]`; the arbitrary-value lint blocks it, and it would survive a reduced-motion preference.
- Name the properties you are transitioning. Reach for `transition-all` only when you genuinely mean all of them.
- Match the exit to the entrance.
- Don't animate `width`, `height`, or `top` when a transform would do. Transforms don't reflow.

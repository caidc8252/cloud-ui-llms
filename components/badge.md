# Badge

Chip for status, counts, and labels. Color is driven entirely by `tone`.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/badge.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Badge` is a client component built on `@base-ui/react`'s `useRender`. It renders a `<span>` by default. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

A badge is presentation only. It labels or categorizes the thing next to it; it does not fetch, compute, or carry state on its own. Drive its color from the `tone` prop and its text from `children`.

Color is the one styling axis, and it comes entirely from `tone`. Do not hardcode background, text, or border colors through `className`. If a badge needs a color the tones do not carry, stop and raise it rather than reaching for an arbitrary utility. There is no `variant` on `Badge`: status badges differ by tone, not by form.

Use the component props before adding custom classes. Reach for `tone`, `shape`, and `dot` first, then use `className` only for local layout adjustments such as margin or alignment.

The shell is `inline-flex`, a fixed `h-5` (20px), `w-fit`, and `whitespace-nowrap` with `overflow-hidden`. Content never wraps and a long label is clipped, so keep labels to a word or two. To render as an element other than a `<span>` — for example a real link or button — pass `render` instead of wrapping the badge.

## General guidelines

### Do

- Use a badge to label, categorize, or count the item it sits next to, with short text or a number.
- Place the badge in proximity to the item it describes.
- Use `tone` to carry meaning: `neutral` for plain labels and categories, and `success`, `warning`, `error`, or `info` for status or severity.
- Pair a colored tone with a word, so the meaning survives when color cannot be seen.
- Use `shape="tag"` for code-like values such as IDs, versions, or enum tokens, and keep `pill` for prose labels.
- Use `dot` to add a small leading status dot when the tone alone needs reinforcing at a glance.

### Don't

- Don't hardcode colors through `className`. Use `tone`.
- Don't put long or wrapping text in a badge. It is clipped to one line; move detail into the surrounding content.
- Don't rely on tone color as the only signal of status or severity. Add text or an icon.
- Don't use a badge as a button or link by adding an `onClick` to the span. If it must be interactive, pass `render` with a real interactive element and its semantics.
- Don't reach for a badge when the meaning is an action. Use `Button`, or a `FilterChip` for a removable applied-filter.

## Features

- #### Tone

  Tone is the only color axis, mapping to the semantic status tokens. There are five tones, and `neutral` is the default:
  - `neutral` — plain labels and categories. Neutral surface with secondary text.
  - `success` — healthy, complete, or passing status.
  - `warning` — needs-attention or degraded status.
  - `error` — failed, blocked, or offline status.
  - `info` — neutral, non-severity notices.

  ```tsx
  import { Badge } from "@cloud/ui"

  <Badge tone="success">Active</Badge>
  <Badge tone="error">Failed</Badge>
  <Badge>Draft</Badge>
  ```

- #### Shape

  There are two shapes:
  - `pill` is the default. A fully rounded chip for prose labels and status.
  - `tag` is square-cornered and switches to the monospace `font-code`. Use it for code-like values such as IDs, versions, region codes, or enum tokens.

  ```tsx
  <Badge shape="tag">v2.14.0</Badge>
  ```

- #### Dot - optional

  Set `dot` to prefix a small leading status dot. The dot follows the text color (`bg-current`), so it always matches the tone and stays a touch darker than the badge background. It is decorative and marked `aria-hidden`.

  ```tsx
  <Badge tone="success" dot>
    Online
  </Badge>
  ```

- #### Icons - optional

  A badge can carry a small leading or trailing icon alongside its text. Any child `<svg>` is sized to `size-3` (12px) and has pointer events removed. Mark the icon with `data-icon="inline-start"` or `data-icon="inline-end"` so the badge tightens the padding on that side.

  ```tsx
  import { Badge } from "@cloud/ui";
  import { GitBranch } from "lucide-react";

  <Badge tone="info">
    <GitBranch data-icon="inline-start" />
    main
  </Badge>;
  ```

  Keep icons supporting, not load-bearing: the text is the label. See the accessibility guidelines for decorative icons.

- #### Polymorphic render - optional

  Pass `render` to change the underlying element while keeping the badge styling, following the Base UI `useRender` contract. Use it to render a badge as a real link or button when it genuinely needs to be interactive, rather than putting a handler on the default span.

  ```tsx
  <Badge tone="info" render={<a href={`/tags/${tag.id}`} />}>
    {tag.name}
  </Badge>
  ```

### States

- #### Focus

  Focus-visible styling is built in through the semantic ring and shadow tokens (`border-ring`, `shadow-focus`). It only appears when the badge is rendered as a focusable element via `render`; a default `<span>` badge is not focusable. Preserve the focus styles when adding custom classes.

## Writing guidelines

### General writing guidelines

- Use sentence case, but continue to capitalize proper nouns and brand names correctly in context.
- Use present-tense verbs and active voice.
- Avoid terminal punctuation in badge labels.
- Avoid directional language. Use labels that still make sense if layout changes.
- Avoid device-specific language such as "click".

### Component-specific guidelines

- Keep the label to one or two words, or a single number.
- Name the state or category directly, such as `Active`, `Pending`, `Failed`, or `Admin`.
- For counts, use the number alone, such as `3` or `99+`.
- For `shape="tag"`, use the literal token, ID, or version as written, and don't paraphrase it.

## Accessibility guidelines

### General accessibility guidelines

- Don't use color alone to communicate status, severity, or category. Pair every meaningful tone with text.
- Keep the badge next to the item it describes, in a logical reading order.
- The tone tokens carry sufficient text-on-surface contrast in both light and dark themes. Preserve them rather than re-tinting through `className`.

### Component-specific guidelines

#### Color and tone

- A tone is a visual reinforcement, not a label. `<Badge tone="error" />` with no text conveys nothing to a screen reader or to a user who cannot see color.
- When the badge text does not itself name the status, add an accessible name — for example visually-hidden text — so the meaning is available without color.

#### Alternative text

- The leading `dot` is decorative and already `aria-hidden`; it adds no meaning on its own.
- Icons inside a badge are decorative support for the text. Do not rely on them to carry the meaning, and keep the text label present.

#### Keyboard interaction

- A default badge renders a non-interactive `<span>` and is not in the tab order.
- If a badge is made interactive through `render`, the supplied element owns its role, focus, and keyboard behavior. Provide a real link or button so it is reachable by tab and activatable by keyboard.

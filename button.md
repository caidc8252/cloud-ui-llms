# Button

Allows users to initiate actions in the user interface.

[Source](../../src/components/ui/primitives/button.tsx) | [Public exports](../../src/components/ui/index.ts)

The `Button` component is a client component built on `@base-ui/react/button`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

If you want to place multiple buttons next to each other, use layout primitives or flex utilities with a small gap, such as `gap-2`, instead of adding margins to each button.

Use the component props before adding custom classes. Reach for `variant`, `size`, `loading`, `block`, `iconLeft`, and `iconRight` first, then use `className` only for local layout adjustments such as width, alignment, or wrapping.

When using icons, prefer lucide icons with explicit size classes, such as `className="size-4"`. The button prevents SVGs from receiving pointer events and keeps icons from shrinking.

## General guidelines

### Do

- Use buttons for actions that perform work in the current interface.
- Use one `variant="primary"` action per task surface whenever possible.
- Use `variant="secondary"` for ordinary secondary actions, such as search, edit, retry, or refresh.
- Use `variant="danger"` for destructive confirmation actions.
- Use `variant="ghost-danger"` for low-emphasis destructive actions, especially row-level icon buttons.
- Use `loading` while an action is in progress. It replaces `iconLeft` with a spinner, hides `iconRight`, and disables the button.
- Use `block` when the button should fill a narrow container, such as an authentication form or a stacked mobile action area.
- Provide an accessible name for icon-only buttons with `aria-label`.

### Don't

- Don't use buttons for navigation to another page. Use the application's navigation or link component for that.
- Don't use multiple competing primary buttons in the same page, modal, form, or workflow step.
- Don't use `danger` for reversible or low-impact actions.
- Don't rely on icon-only buttons for uncommon or ambiguous actions.
- Don't remove focus-visible styles when adding custom classes.
- Don't use `size="auto"` for plain call-to-action buttons. Prefer `sm`, `md`, or `lg` for normal actions.

## Features

- #### Variant

  There are six button variants:

  - `primary` is the main recommended action on a page, modal, form, or workflow step. It uses primary brand fill and CTA shadow.
  - `secondary` is for standard secondary actions such as search, edit, modify, retry, or refresh. It uses a bordered surface style and supports expanded trigger states.
  - `ghost` is for low-emphasis actions such as cancel, back, clear, duplicate, or inline utility actions. It uses hover and active surface feedback without a border by default.
  - `ghost-danger` is for low-emphasis destructive actions such as cancel invitation, remove filter, or delete row icon. It keeps destructive color without the weight of a filled danger button.
  - `danger` is for destructive confirmation actions in dialogs or irreversible workflows. It uses filled error color and should have clear label text.
  - `link` is for tertiary text actions in compact copy or modal footers. It removes fixed height and padding. Do not use it as page navigation unless the primitive is rendered as a real link.

- #### Size

  There are ten button sizes:

  - `default` is for default medium controls. It has the same dimensions as `md`.
  - `xs` is for dense filter chips, compact tool rows, and secondary inline controls. It reduces text and default SVG size.
  - `sm` is for dense application chrome, table actions, and compact dialogs. It is common for icon plus short text.
  - `md` is for standard form, page, and modal actions. Prefer it when matching other medium controls explicitly.
  - `lg` is for prominent form submits, load-more actions, and spacious portal flows. Use it where the surrounding layout has matching vertical rhythm.
  - `auto` is for clickable cards, option tiles, and list rows with multiline content. Content controls height; add wrapping and text alignment classes as needed.
  - `icon` is for standard icon-only controls. It is a square `2rem` button; include `aria-label`.
  - `icon-xs` is for very dense row or chip icon controls. It is a square `1.5rem` button, and default SVGs shrink to `size-3`.
  - `icon-sm` is for compact icon-only controls in sheets, filters, and toolbar rows. It is a square `1.75rem` button.
  - `icon-lg` is for larger icon-only controls in roomy headers or visual surfaces. It is a square `2.25rem` button.

- #### Icons

  While text should be the default label on a button, icons can support the action when the term is unusual, dense, or frequently repeated.

  Use `iconLeft` for leading icons and `iconRight` for trailing icons:

  ```tsx
  import { Button } from "@cloud/ui"
  import { Search } from "lucide-react"

  <Button
    variant="secondary"
    size="md"
    iconLeft={<Search className="size-4" />}
    onClick={applyFilters}
  >
    Search
  </Button>
  ```

  Use icon-only sizes for standalone action icons:

  ```tsx
  import { Button } from "@cloud/ui"
  import { RefreshCw } from "lucide-react"

  <Button
    variant="ghost"
    size="icon-sm"
    aria-label="Refresh results"
    title="Refresh results"
    onClick={refresh}
  >
    <RefreshCw className="size-4" />
  </Button>
  ```

- #### Full width buttons - optional

  Use `block` when a button should take the full width of its container:

  ```tsx
  <Button block loading={submitting} onClick={submit}>
    Continue
  </Button>
  ```

- #### Loading - optional

  Use `loading` while an async action is in progress:

  ```tsx
  <Button type="submit" loading={submitting} disabled={!isValid}>
    Save
  </Button>
  ```

  Loading sets the underlying button to disabled, shows a spinning `Loader2Icon` before the label, and suppresses `iconRight`.

- #### Disabled reason - optional

  `Button` does not have a built-in `disabledReason` prop. If a disabled action needs explanation, pair it with the shared tooltip pattern and keep the reason short.

### States

- #### Disabled

  Use the disabled state to prevent users from initiating an action that cannot run in the current context. The component applies disabled cursor and opacity, and the primitive receives the native disabled state.

  ```tsx
  <Button disabled>
    Save
  </Button>
  ```

- #### Loading

  Use the loading state when the action has started and the interface is waiting for completion. Because loading also disables the button, avoid separate busy click guards unless the action needs them for data integrity.

- #### Focus

  Focus-visible styling is built in through semantic ring and border tokens. Preserve it when adding custom classes.

- #### Invalid

  `aria-invalid` is styled with destructive border and ring tokens when a button is used as part of an invalid composite control.

- #### Expanded

  `aria-expanded` receives active trigger styling for menu, popover, and disclosure buttons.

## Writing guidelines

### General writing guidelines

- Use sentence case, but continue to capitalize proper nouns and brand names correctly in context.
- Use present-tense verbs and active voice.
- Avoid terminal punctuation in button labels.
- Avoid directional language. Use labels that still make sense if layout changes.
- Avoid device-specific language such as "click". Prefer "choose" or "select" in surrounding instructions.

### Component-specific guidelines

- Use one or two words for the label when possible.
- Start labels with an action verb, such as `Start`, `Continue`, `Open`, `Create`, `Save`, or `Delete`.
- Add a feature or item name only when needed for clarity, such as `Create role` or `Delete user`.
- Don't include `Yes` for buttons that confirm an action. Use the concrete action, such as `Delete`, `Reboot`, or `Cancel invitation`.
- Don't use articles when they do not add clarity. Prefer `Create role` over `Create a role`.
- Keep icon-only actions for familiar commands. If the icon needs explanation, use text or add a nearby label.

#### Disabled reasons

- Keep disabled reasons short and specific.
- Explain the missing condition, not the implementation detail.
- Prefer "Select a user first" over "Button disabled because selectedUserId is null".

## Accessibility guidelines

### General accessibility guidelines

- Ensure every button has an accessible name.
- Preserve keyboard behavior from the Base UI primitive. The button should remain reachable by tab and activatable by keyboard.
- Do not rely on color alone to communicate danger or disabled state.
- Use clear visible labels and surrounding confirmation copy for destructive actions.

### Component-specific guidelines

#### Alternative text

- Text children are enough for text buttons.
- Icon-only buttons need `aria-label`.
- Repeated action names should be unique when possible, such as `Remove Admin role` rather than several identical `Remove` buttons.
- If a text label already describes the icon, do not add redundant alternative text to the icon itself.

#### Additional ARIA Properties

- When a button controls a popover, menu, sheet, or collapsible region, pass the appropriate `aria-expanded` state and relationship attributes supplied by that primitive.
- Use `aria-invalid` only when the button is part of an invalid composite control.

#### Keyboard interaction

- By default, the tab key focuses the button.
- The enter key and space key perform the button action.
# ThemeToggle

Icon button that switches between the light and dark themes.

`ThemeToggle` is a client component. It reads and flips the current theme through the `useTheme` hook, so it must render inside a `ThemeProvider`. Import it from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`ThemeToggle` is a self-contained icon button. It calls `useTheme`, shows a sun icon in dark mode and a moon icon in light mode, and toggles between them on click. Its accessible name switches with the state ("Switch to light mode" / "Switch to dark mode").

It takes only an optional `className`. Because it depends on `useTheme`, ensure a `ThemeProvider` wraps the app; without it the hook has no context.

## General guidelines

### Do

- Place a single `ThemeToggle` in a stable location, such as the app header or account menu.
- Ensure a `ThemeProvider` is present above it.
- Keep it as an icon-only control; the built-in `aria-label` names the action.

### Don't

- Don't render `ThemeToggle` outside a `ThemeProvider`.
- Don't add a redundant visible "theme" label next to it; the icon and `aria-label` are enough.
- Don't scatter multiple theme toggles across one view.

## Features

- #### Toggle

  Renders an icon button that flips the theme. It shows a sun in dark mode and a moon in light mode, and updates its own `aria-label` accordingly.

  ```tsx
  import { ThemeToggle } from "@cloud/ui";

  <ThemeToggle />;
  ```

- #### className - optional

  The only prop is `className`, for local layout adjustments such as alignment within a toolbar.

## Writing guidelines

`ThemeToggle` shows no visible text. Its accessible name is provided and state-aware; do not add a separate visible label.

## Accessibility guidelines

### General accessibility guidelines

- The control is a real `<button>` with an `aria-label` that describes the action it will perform, and it is reachable by tab and activatable by keyboard.
- The label changes with the resolved theme, so it always names the next state rather than the current one.
- Focus-visible styling is built in through the semantic focus shadow; preserve it when adding custom classes.

### Component-specific guidelines

- The sun and moon icons are decorative; the accessible name carries the meaning, so a user relying on a screen reader is not dependent on the glyph.

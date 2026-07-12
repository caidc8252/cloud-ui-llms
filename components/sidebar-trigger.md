# SidebarTrigger

Button that collapses the sidebar rail on desktop, and opens the drawer on mobile.

`SidebarTrigger` is a client component with no props but `className`. Import it from `@cloud/ui`.

## Development guidelines

Drop `SidebarTrigger` into `AppHeader`'s `leading` slot. It reads `useSidebar()` and does the right thing for the context: on desktop it collapses and expands the rail; on mobile it opens and closes the drawer.

The icon and the accessible name follow the state — a menu glyph and `Open navigation` on mobile, and `Collapse sidebar` / `Expand sidebar` on desktop depending on whether the rail is already collapsed. It also carries a `title` showing the `[` shortcut, which `SidebarProvider` binds globally.

Because the labels are baked in, they are **English**. If your app is localized, that's a gap worth knowing about: the trigger's `aria-label` will not follow the user's locale.

## General guidelines

### Do

- Put it in `AppHeader`'s `leading` slot.
- Leave the icon and label to the component; they follow the state.
- Mention the `[` shortcut in your keyboard-shortcut help, since the trigger advertises it.

### Don't

- Don't build your own toggle; `useSidebar().toggle` and this button already exist.
- Don't render it on a page with no sidebar — it would toggle nothing.

## Features

- #### In the header

  ```tsx
  import { AppHeader, SidebarTrigger } from "@cloud/ui";

  <AppHeader leading={<SidebarTrigger />} breadcrumbs={<Breadcrumbs items={items} />} />;
  ```

- #### The keyboard shortcut

  `SidebarProvider` binds `[` globally to the same toggle, and the button's tooltip shows it.

### States

- **Desktop, expanded** — a left-panel glyph, labelled `Collapse sidebar`.
- **Desktop, collapsed** — a right-panel glyph, labelled `Expand sidebar`.
- **Mobile** — a menu glyph, labelled `Open navigation`.

## Writing guidelines

The button's labels are internal to the component and are in English. They are not caller-supplied.

## Accessibility guidelines

### General accessibility guidelines

- The trigger is a real button with an `aria-label` that changes with the state, so its name always says what pressing it will do.
- The `[` shortcut is an accelerator, not a replacement — the button stays reachable by Tab.

### Component-specific guidelines

- The label is not localized. In a localized app, a screen-reader user on a non-English locale will hear an English name here — worth tracking if the app ships in more than one language.

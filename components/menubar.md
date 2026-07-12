# Menubar

Horizontal bar of menus, in the style of a desktop application menu.

`Menubar` is a client component built on `@base-ui/react`'s `Menubar`. It is a set of composable parts — `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarGroup`, `MenubarLabel`, `MenubarSeparator`, `MenubarShortcut`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, the `MenubarSub` / `MenubarSubTrigger` / `MenubarSubContent` trio, and `MenubarPortal`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Menubar` is a row of top-level menus. Each `MenubarMenu` pairs a `MenubarTrigger` with a `MenubarContent`; once one menu is open, hovering another trigger switches to it, the way a desktop menu bar behaves. The item parts match `DropdownMenu`: `MenubarItem` takes `variant` (`default` or `destructive`) and `inset`, `MenubarShortcut` renders a right-aligned keyboard hint, and `MenubarSub` nests a menu.

Reach for a menubar only in a dense, application-like surface — an editor, a console, a canvas — where a persistent command bar earns its space. Most pages in this app should not have one: use a page header with buttons for the few actions that matter, a `DropdownMenu` for the overflow, and `NavigationMenu` or the sidebar for moving between pages.

## General guidelines

### Do

- Use a menubar in editor-like or tool-like surfaces with many commands.
- Group commands into a few well-named top-level menus.
- Show keyboard shortcuts with `MenubarShortcut` where they exist.

### Don't

- Don't use a menubar for navigation. Use `NavigationMenu` or the sidebar.
- Don't use it on an ordinary page with a handful of actions; use buttons and a `DropdownMenu`.
- Don't bury a frequent, primary action in a menu when a button would do.

## Features

- #### Basic menubar

  ```tsx
  import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarShortcut,
  } from "@cloud/ui";

  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          New query
          <MenubarShortcut>⌘N</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem variant="destructive">Delete query</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>…</MenubarContent>
    </MenubarMenu>
  </Menubar>;
  ```

- #### Checkbox items, radio items, and submenus

  `MenubarCheckboxItem`, `MenubarRadioGroup` with `MenubarRadioItem`, and `MenubarSub` behave exactly as their `DropdownMenu` counterparts — a toggle in place, a mutually exclusive set, and a nested menu.

- #### Inset

  `inset` on an item, label, or sub-trigger indents its text to line up with items that carry a leading indicator.

### States

- **Open** — the active trigger is highlighted while its menu is open, and hovering a sibling trigger moves the open menu to it.
- **Destructive** — `variant="destructive"` gives the item destructive text and a destructive-tinted hover.
- **Disabled** — a disabled trigger or item is dimmed and not interactive.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.

### Component-specific guidelines

- Trigger labels: one word naming a category of commands, such as `File`, `Edit`, `View`.
- Item labels: use a verb in the imperative, such as `New query` or `Delete query`.
- Keep the top-level menus to a handful; a menubar that wraps has too many.

## Accessibility guidelines

### General accessibility guidelines

- The bar, triggers, menus, items, and submenus carry the correct roles and relationships through the Base UI primitive.
- Don't rely on the destructive color alone to say a command is destructive; the label should say so too.
- Every command in the menubar should have a discoverable name; don't use icon-only triggers here.

### Component-specific guidelines

#### Keyboard interaction

- The left and right arrow keys move between top-level triggers; Enter, Space, or the down arrow key opens a menu.
- Within a menu, the arrow keys move between items and type-ahead jumps to a matching item.
- The right arrow key opens a submenu, the left arrow key closes it, Enter activates the highlighted item, and Escape closes the menu.

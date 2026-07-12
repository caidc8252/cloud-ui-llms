# ContextMenu

Menu of actions opened by right-clicking a target region.

`ContextMenu` is a client component built on `@base-ui/react`'s `ContextMenu`. It mirrors `DropdownMenu` part for part — `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuGroup`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuCheckboxItem`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, the `ContextMenuSub` / `ContextMenuSubTrigger` / `ContextMenuSubContent` trio, and `ContextMenuPortal`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`ContextMenu` opens at the pointer when the user right-clicks (or long-presses) the region wrapped in `ContextMenuTrigger`. The parts and props match `DropdownMenu`: `ContextMenuItem` takes `variant` (`default` or `destructive`) and `inset`, `ContextMenuShortcut` renders a right-aligned keyboard hint, and `ContextMenuSub` nests a menu.

A context menu is a shortcut, not a home. It is not discoverable and is awkward on touch, so every command in it must also be reachable somewhere visible — a row's `DropdownMenu`, a toolbar button, or a page action. Use it to speed up power users on a canvas, a tree, or a table row.

## General guidelines

### Do

- Use a context menu as an accelerator for commands that also exist in a visible control.
- Scope the trigger tightly to the object the commands act on, such as one row or one node.
- Mark delete-style commands with `variant="destructive"`, below a separator.

### Don't

- Don't make a context menu the only way to reach a command; it is undiscoverable.
- Don't attach one to the whole page and fill it with unrelated commands.
- Don't use it where a visible menu button is expected. Use `DropdownMenu`.

## Features

- #### Basic context menu

  ```tsx
  import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
  } from "@cloud/ui";

  <ContextMenu>
    <ContextMenuTrigger render={<tr />}>{cells}</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem onClick={open}>Open</ContextMenuItem>
      <ContextMenuItem onClick={rename}>Rename</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive" onClick={remove}>
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>;
  ```

- #### Checkbox items, radio items, and submenus

  `ContextMenuCheckboxItem`, `ContextMenuRadioGroup` with `ContextMenuRadioItem`, and `ContextMenuSub` behave exactly as their `DropdownMenu` counterparts.

- #### Inset and shortcuts

  `inset` indents an item's text to line up with items that carry a leading icon or indicator. It is accepted on `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuSubTrigger`, `ContextMenuCheckboxItem`, and `ContextMenuRadioItem`. `ContextMenuShortcut` renders a right-aligned keyboard hint.

- #### Positioning

  `ContextMenuContent` forwards `align`, `alignOffset`, `side`, and `sideOffset` to the Base UI positioner. It defaults to `side="right"`, `sideOffset={0}`, `align="start"`, and `alignOffset={4}`, which places the menu just off the pointer. `ContextMenuSubContent` pins `side="right"` so submenus open away from the parent.

  The popup is at least 220px wide and caps its height at the available space, scrolling inside if the menu is long.

  ```tsx
  <ContextMenuContent align="center" sideOffset={8}>
    …
  </ContextMenuContent>
  ```

### States

- **Destructive** — `variant="destructive"` gives the item destructive text and a destructive-tinted hover.
- **Disabled** — a disabled item is dimmed and not interactive.
- **Checked** — checkbox and radio items render an indicator when selected.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Start command labels with a verb.

### Component-specific guidelines

- Item labels: use the same wording as the equivalent command in the visible menu, so the two read as one command, not two.
- Keep the menu short. A context menu that scrolls has stopped being an accelerator.

## Accessibility guidelines

### General accessibility guidelines

- The trigger, menu, items, and submenus carry the correct roles and relationships through the Base UI primitive, including focus management on open and close.
- A context menu is opened by right-click or long-press, neither of which is discoverable or reliable across devices. Always provide a visible, keyboard-reachable path to the same commands.
- Don't rely on the destructive color alone to say a command is destructive; the label should say so too.

### Component-specific guidelines

#### Keyboard interaction

- The menu can be opened from the keyboard with the platform's context-menu key, and it opens focused.
- The arrow keys move between items, the right and left arrow keys open and close a submenu, Enter activates the highlighted item, and Escape closes the menu.

# DropdownMenu

Menu of actions opened from a button. Supports submenus, checkbox items, and radio items.

`DropdownMenu` is a client component built on `@base-ui/react`'s `Menu`. It is a set of composable parts — `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, and the `DropdownMenuSub` / `DropdownMenuSubTrigger` / `DropdownMenuSubContent` trio, plus `DropdownMenuPortal`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`DropdownMenu` presents a list of commands from a trigger the user clicks. Put the trigger in `DropdownMenuTrigger` and the commands in `DropdownMenuContent` as `DropdownMenuItem`s. Group related commands with `DropdownMenuGroup` and a `DropdownMenuLabel`, and divide sections with `DropdownMenuSeparator`.

`DropdownMenuItem` takes `variant` — `default` or `destructive` (red text and a red hover, for delete-style commands) — and `inset`, which indents the label to line up with items that carry a leading icon or indicator. `DropdownMenuShortcut` renders a right-aligned keyboard hint.

For a persistent toggle inside the menu, use `DropdownMenuCheckboxItem`; for a set of mutually exclusive settings, use `DropdownMenuRadioGroup` with `DropdownMenuRadioItem`s. Nest a menu with `DropdownMenuSub`.

Use a dropdown menu for actions. To set a form value, use `Select`. For a small anchored panel with arbitrary content, use `Popover`. For a menu opened by right-click, use `ContextMenu`.

## General guidelines

### Do

- Use a dropdown menu for a list of commands.
- Mark delete-style commands with `variant="destructive"`.
- Group related commands, and separate the destructive ones.
- Give an icon-only trigger an `aria-label`.

### Don't

- Don't use a dropdown menu to set a form value. Use `Select`.
- Don't hide a page's primary action in a menu; surface it as a button.
- Don't nest more than one level of submenu.

## Features

- #### Basic menu

  ```tsx
  import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    Button,
  } from "@cloud/ui";

  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Actions" />}>
      <MoreHorizontal className="size-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={rename}>Rename</DropdownMenuItem>
      <DropdownMenuItem onClick={duplicate}>Duplicate</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onClick={remove}>
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
  ```

- #### Labels, groups, and shortcuts

  `DropdownMenuGroup` and `DropdownMenuLabel` structure a long menu. `DropdownMenuShortcut` renders a right-aligned keyboard hint.

  ```tsx
  <DropdownMenuGroup>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem>
      Settings
      <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuGroup>
  ```

- #### Checkbox and radio items

  `DropdownMenuCheckboxItem` toggles a setting in place; `DropdownMenuRadioGroup` holds mutually exclusive `DropdownMenuRadioItem`s. Both render their own indicator.

  ```tsx
  <DropdownMenuCheckboxItem checked={dense} onCheckedChange={setDense}>
    Dense rows
  </DropdownMenuCheckboxItem>

  <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
    <DropdownMenuRadioItem value="recent">Most recent</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
  </DropdownMenuRadioGroup>
  ```

- #### Submenus

  `DropdownMenuSub` nests a menu behind a `DropdownMenuSubTrigger`, which renders its own chevron.

  ```tsx
  <DropdownMenuSub>
    <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
    <DropdownMenuSubContent>
      <DropdownMenuItem>Archive</DropdownMenuItem>
      <DropdownMenuItem>Trash</DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuSub>
  ```

- #### Inset

  `inset` on an item, label, or sub-trigger indents its text so it lines up with items that carry a leading icon, checkbox, or radio indicator.

### States

- **Destructive** — `variant="destructive"` gives the item destructive text and a destructive-tinted hover.
- **Disabled** — a disabled item is dimmed and not interactive.
- **Checked** — checkbox and radio items render an indicator when selected.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Start command labels with a verb.

### Component-specific guidelines

- Item labels: use a verb in the imperative, such as `Rename`, `Duplicate`, `Delete`.
- Group labels: name the category of commands, such as `Account`. Labels are not selectable.
- Keep the destructive command last, below a separator.

## Accessibility guidelines

### General accessibility guidelines

- The trigger, menu, items, and submenus carry the correct roles and relationships through the Base UI primitive, including focus management on open and close.
- Give an icon-only trigger an `aria-label` such as `Actions`.
- Don't rely on the destructive color alone to say a command is destructive; the label should say so too, and irreversible actions should confirm through an `AlertDialog`.

### Component-specific guidelines

#### Keyboard interaction

- Enter, Space, or the arrow keys open the menu from the trigger.
- The arrow keys move between items, and type-ahead jumps to a matching item.
- The right arrow key opens a submenu, and the left arrow key closes it.
- Enter activates the highlighted item; Escape closes the menu.

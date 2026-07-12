# Command

Keyboard-driven command palette with search.

`Command` is a client component. It is a set of composable parts — `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandSeparator`, `CommandItem`, and `CommandShortcut`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Command` is a searchable list of commands. `CommandInput` filters the `CommandItem`s by their text content as the user types; `CommandEmpty` renders when nothing matches. `CommandInput` already draws its own leading magnifier and its own bottom rule, so don't wrap it or add a search icon of your own. Group related commands with `CommandGroup`, divide sections with `CommandSeparator`, and show a keyboard hint with `CommandShortcut`.

`CommandDialog` wraps the whole thing in a modal — that is the palette you open with a keyboard shortcut. It has no trigger part: drive it with `open` / `onOpenChange`, which it forwards to the underlying Base UI `Dialog`. Its `title` and `description` props are the dialog's **screen-reader-only** name and description; they default to the untranslated `Command Palette` and `Search for a command to run...`, so pass translated copy even though nothing renders them on screen.

Use `Command` bare when the palette is embedded in a panel or a popover instead. Bare `Command` fills its parent (`size-full`) and draws its own border and shadow, so give it a container with a height.

A command palette is an _accelerator_. It is not discoverable on its own, so every command it offers must also be reachable through the visible UI. Add one when a power user runs the same handful of commands often enough that hunting for the button is the slow part.

## General guidelines

### Do

- Give every command in the palette a visible home elsewhere in the UI.
- Group commands, and name the groups.
- Show keyboard shortcuts with `CommandShortcut` where they exist.
- Write a `CommandEmpty` message; a silent empty list looks broken.

### Don't

- Don't make the palette the only way to reach a command.
- Don't fill it with everything the app can do; a palette that needs scrolling has stopped being fast.
- Don't use it as a dropdown for a form value. Use `Combobox`.

## Features

- #### Palette in a dialog

  ```tsx
  import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
  } from "@cloud/ui";

  <CommandDialog
    open={open}
    onOpenChange={setOpen}
    title={t("command.title")}
    description={t("command.description")}
  >
    <CommandInput placeholder={t("command.search")} />
    <CommandList>
      <CommandEmpty>{t("command.empty")}</CommandEmpty>
      <CommandGroup heading={t("command.navigate")}>
        <CommandItem onSelect={() => router.push("/merchants")}>
          Merchants
          <CommandShortcut>⌘M</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={() => router.push("/settlements")}>Settlements</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>;
  ```

- #### Embedded palette

  Use `Command` directly — without `CommandDialog` — when the palette lives inside a panel or a popover rather than a modal.

- #### Groups, separators, and shortcuts

  `CommandGroup` takes a `heading`; `CommandSeparator` divides sections; `CommandShortcut` renders a right-aligned keyboard hint.

- #### Checked items

  `CommandItem` reserves a trailing check mark for palettes that pick a value rather than run an action. It shows when the item carries `data-checked="true"`, and it is suppressed when the item contains a `CommandShortcut` — an item gets a shortcut hint or a check, never both.

  ```tsx
  <CommandItem
    data-checked={theme === "dark" ? "true" : undefined}
    onSelect={() => setTheme("dark")}
  >
    Dark
  </CommandItem>
  ```

### States

- **Highlighted** — the item under the keyboard cursor takes an active surface.
- **Checked** — `data-checked="true"` on a `CommandItem` reveals its trailing check mark.
- **Empty** — `CommandEmpty` renders when the search matches nothing.
- **Disabled** — `disabled` on a `CommandItem` dims it and makes it unselectable.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Item labels: use the same wording as the visible control that runs the same command, so the two read as one thing.
- Group headings: name the kind of command, such as `Navigate` or `Create`.
- `CommandEmpty`: say nothing matched, such as `No commands match that search`.

## Accessibility guidelines

### General accessibility guidelines

- The input, list, and items carry the correct combobox and listbox roles and relationships, so the filtered results and the active item are announced.
- In `CommandDialog`, focus moves into the palette on open and returns to the trigger on close.
- The palette is opened by a keyboard shortcut, which is not discoverable — every command must also live somewhere visible.

### Component-specific guidelines

#### Keyboard interaction

- The arrow keys move between items, skipping group headings.
- Enter runs the highlighted command.
- Escape closes the palette.

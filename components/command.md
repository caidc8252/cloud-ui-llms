# Command

Keyboard-driven command palette with search.

`Command` is a client component. It is a set of composable parts — `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandSeparator`, `CommandItem`, and `CommandShortcut`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Command` is a searchable list of commands. `CommandInput` filters the `CommandItem`s by their text content as the user types; `CommandEmpty` renders when nothing matches. Group related commands with `CommandGroup`, divide sections with `CommandSeparator`, and show a keyboard hint with `CommandShortcut`.

`CommandDialog` wraps the whole thing in a modal — that is the palette you open with a keyboard shortcut. Use `Command` bare when the palette is embedded in a panel or a popover instead.

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

  <CommandDialog open={open} onOpenChange={setOpen}>
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

### States

- **Highlighted** — the item under the keyboard cursor takes an active surface.
- **Empty** — `CommandEmpty` renders when the search matches nothing.
- **Disabled** — a disabled item is dimmed and not selectable.

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

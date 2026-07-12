# Popover

Floating panel anchored to a trigger, with header, title, and description slots. `MenuItem` renders an action row inside it.

`Popover` is a client component built on `@base-ui/react`'s `Popover`. It is a set of composable parts — `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`, and the `MenuItem` action row. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Popover` is a click-triggered floating panel. Wrap the trigger in `PopoverTrigger`, put the panel content in `PopoverContent`, and position it with `side` (default `bottom`), `align` (default `center`), `sideOffset` (default `4`), and `alignOffset` (default `0`). The panel is a fixed `w-72` column with a `2.5` gap between its children — override the width with `className` when the content needs it.

`PopoverHeader` is a plain `div` wrapper; `PopoverTitle` and `PopoverDescription` are the Base UI title and description parts, so they are wired to the panel's accessible name and description.

Use `MenuItem` for action rows inside the panel; pass `destructive` for a red delete-style row. `MenuItem` is a plain `<button type="button">` (its props are `ComponentProps<"button">` plus `destructive`), so it takes `onClick`, `disabled`, and the rest as you would expect.

There is **no `PopoverClose` export**. Close the panel from inside by controlling it — `open` / `onOpenChange` on the root — and closing in your own handler.

For a full keyboard-navigable action menu, prefer `DropdownMenu`; for a hover preview, use `HoverCard`; for a short text hint, use `Tooltip`.

## General guidelines

### Do

- Use a popover for supplementary content or a small set of actions anchored to a control.
- Use `PopoverHeader`, `PopoverTitle`, and `PopoverDescription` for a titled panel.
- Use `MenuItem` for action rows, with `destructive` for delete-style actions.
- Position with `side` and `align` to keep the panel on screen.

### Don't

- Don't build a full navigable menu from popover `MenuItem`s. Use `DropdownMenu`.
- Don't use a popover for a hover preview. Use `HoverCard`.
- Don't put a long form or a whole task in a popover; use a `Modal` or `Sheet`.
- Don't reach for a `PopoverClose` part — there isn't one. Control `open` and close it yourself.

## Features

- #### Positioning

  `PopoverContent` takes `side` (default `bottom`), `align` (default `center`), `sideOffset` (default `4`), and `alignOffset` (default `0`).

  ```tsx
  import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    MenuItem,
  } from "@cloud/ui";

  <Popover>
    <PopoverTrigger render={<Button variant="secondary" size="icon-sm" aria-label="More" />}>
      <MoreHorizontal className="size-4" />
    </PopoverTrigger>
    <PopoverContent align="end">
      <MenuItem onClick={rename}>Rename</MenuItem>
      <MenuItem destructive onClick={remove}>
        Delete
      </MenuItem>
    </PopoverContent>
  </Popover>;
  ```

- #### Titled panel

  `PopoverHeader` stacks `PopoverTitle` and `PopoverDescription` for a panel that explains itself.

  ```tsx
  import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
  } from "@cloud/ui";

  <Popover>
    <PopoverTrigger render={<Button variant="secondary" />}>Set limit</PopoverTrigger>
    <PopoverContent side="bottom" align="end">
      <PopoverHeader>
        <PopoverTitle>Daily limit</PopoverTitle>
        <PopoverDescription>Applies to every terminal on this account.</PopoverDescription>
      </PopoverHeader>
      <Input value={limit} onChange={(e) => setLimit(e.target.value)} />
    </PopoverContent>
  </Popover>;
  ```

- #### MenuItem

  `MenuItem` is a full-width action row for use inside the panel. `destructive` gives it red text and a red hover for delete actions, and the row is dimmed when `disabled`.

  ```tsx
  <MenuItem disabled={!canRename} onClick={rename}>
    Rename
  </MenuItem>
  <MenuItem destructive onClick={remove}>
    Delete
  </MenuItem>
  ```

- #### Controlled open state

  The root takes `open`, `defaultOpen`, and `onOpenChange`. Since there is no close part, close the panel in the handler that performs the action.

  ```tsx
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger render={<Button variant="secondary" />}>Actions</PopoverTrigger>
    <PopoverContent align="end">
      <MenuItem
        onClick={() => {
          rename();
          setOpen(false);
        }}
      >
        Rename
      </MenuItem>
    </PopoverContent>
  </Popover>
  ```

## Writing guidelines

### General writing guidelines

- Use sentence case, present tense, and active voice.
- Keep titles short and action labels to a verb or two.

### Component-specific guidelines

- Title: name what the panel is about.
- `MenuItem` labels: start with a verb, such as `Rename` or `Delete`.

## Accessibility guidelines

### General accessibility guidelines

- The trigger and panel are wired through the Base UI primitive, including focus management on open and close.
- Give an icon-only trigger an `aria-label`.
- Keep the panel content reachable and in a logical order.

### Component-specific guidelines

- `MenuItem` is a real button and is keyboard operable. For a menu that needs roving focus and type-ahead, use `DropdownMenu` rather than a list of `MenuItem`s.

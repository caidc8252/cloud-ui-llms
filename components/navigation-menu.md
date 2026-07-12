# NavigationMenu

Horizontal navigation with optional rich dropdown panels.

`NavigationMenu` is a client component built on `@base-ui/react`'s `NavigationMenu`. It is a set of composable parts — `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuPositioner`, `NavigationMenuLink`, and `NavigationMenuIndicator` — plus the `navigationMenuTriggerStyle` variant helper for styling a plain link like a trigger. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`NavigationMenu` is for moving between destinations, not for running commands. Put the top-level entries in a `NavigationMenuList` as `NavigationMenuItem`s. An entry is either a direct `NavigationMenuLink` — style it with `navigationMenuTriggerStyle()` so it matches its siblings — or a `NavigationMenuTrigger` that opens a `NavigationMenuContent` panel of grouped links.

`NavigationMenuIndicator` renders the arrow that points at the active trigger, and `NavigationMenuPositioner` places the open panel. Mark the current destination with `aria-current="page"` on its link.

For a list of commands, use `DropdownMenu`. For switching between panels within one page, use `Tabs`. For the app's primary left-hand navigation, use the `Sidebar` layout components.

## General guidelines

### Do

- Use a navigation menu for links between destinations.
- Style a direct link with `navigationMenuTriggerStyle()` so it sits level with the triggers.
- Mark the current page with `aria-current="page"`.
- Group the links in a panel under headings when there are more than a handful.

### Don't

- Don't put actions in a navigation menu. Use `DropdownMenu` or a button.
- Don't use it to switch panels inside one page. Use `Tabs`.
- Don't nest a panel inside a panel.

## Features

- #### Links and panels

  An item is either a direct link or a trigger with a content panel.

  ```tsx
  import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
  } from "@cloud/ui";

  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink
          className={navigationMenuTriggerStyle()}
          render={<Link href="/overview" />}
        >
          Overview
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink render={<Link href="/reports/settlement" />}>
            Settlement
          </NavigationMenuLink>
          <NavigationMenuLink render={<Link href="/reports/disputes" />}>
            Disputes
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>;
  ```

- #### Indicator and positioner

  `NavigationMenuIndicator` renders the arrow that tracks the open trigger, and `NavigationMenuPositioner` anchors the panel beneath the list.

### States

- **Open** — the active trigger is highlighted and its chevron rotates while its panel is open.
- **Current** — set `aria-current="page"` on the link for the destination the user is on.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Name destinations with nouns, not verbs.

### Component-specific guidelines

- Trigger and link labels: use the same words as the destination page's title, so the user lands where the label promised.
- Keep labels to one or two words, and keep them parallel across the bar.

## Accessibility guidelines

### General accessibility guidelines

- The list, triggers, panels, and links carry the correct roles and relationships through the Base UI primitive.
- Mark the current destination with `aria-current="page"` — the highlight alone is not enough.
- Every entry must be reachable and operable by keyboard.

### Component-specific guidelines

#### Keyboard interaction

- Tab moves between the top-level entries.
- Enter, Space, or the down arrow key opens a trigger's panel, and Escape closes it.
- Within an open panel, Tab and the arrow keys move between the links.

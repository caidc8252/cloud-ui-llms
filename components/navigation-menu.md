# NavigationMenu

Horizontal navigation with optional rich dropdown panels.

`NavigationMenu` is a client component built on `@base-ui/react`'s `NavigationMenu`. It is a set of composable parts — `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuPositioner`, `NavigationMenuLink`, and `NavigationMenuIndicator` — plus the `navigationMenuTriggerStyle` variant helper for styling a plain link like a trigger. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`NavigationMenu` is for moving between destinations, not for running commands. Put the top-level entries in a `NavigationMenuList` as `NavigationMenuItem`s. An entry is either a direct `NavigationMenuLink` — style it with `navigationMenuTriggerStyle()` so it matches its siblings — or a `NavigationMenuTrigger` that opens a `NavigationMenuContent` panel of grouped links.

**You do not place the panel yourself.** `NavigationMenu` renders `NavigationMenuPositioner` — portal, positioner, popup, and viewport — internally, and every open `NavigationMenuContent` is shown there. The part is exported for advanced cases; in ordinary use, composing it a second time gives you a second, empty panel. Steer the panel from the root instead: `align` (default `start`) is forwarded to the internal positioner.

`NavigationMenuTrigger` already renders its own chevron, which rotates while its panel is open — don't add one. `NavigationMenuIndicator` is not that chevron and is not an arrow tracking the open trigger: it maps to Base UI's `Icon` part, a span that lives *inside* a trigger to mark it as one that opens a menu. Standard usage does not need it. Mark the current destination with `aria-current="page"` on its link.

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
- Don't render `NavigationMenuPositioner` yourself; the root already renders one.
- Don't add a chevron to a `NavigationMenuTrigger`; it draws its own.
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

- #### Panel placement and open state

  The root owns the panel. It renders `NavigationMenuPositioner` for you and takes `align` (default `start`) to place the panel against the list. It also forwards the Base UI navigation-menu root props: `delay` and `closeDelay` (both default `50`ms) for the hover in/out timing, `orientation` (default `horizontal`), and `value` / `defaultValue` / `onValueChange` to drive which panel is open from outside.

  ```tsx
  <NavigationMenu align="center" delay={100}>
    <NavigationMenuList>…</NavigationMenuList>
  </NavigationMenu>
  ```

  `NavigationMenuPositioner` and `NavigationMenuIndicator` are exported for advanced composition. Neither is needed — and neither should be added — in normal use.

### States

- **Open** — the active trigger is highlighted and its chevron rotates while its panel is open.
- **Current** — set `aria-current="page"` on the link for the destination the user is on; `NavigationMenuLink` also paints an active background when it carries `data-active`.

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

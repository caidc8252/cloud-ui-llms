# Tabs

Tab bar and panels, in an underline variant and a pill variant.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/primitives/tabs.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Tabs` is a client component built on `@base-ui/react`'s `Tabs`. It is a set of four parts — `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Tabs` switches between panels within the same page. Wrap the set in `Tabs`, list the triggers in `TabsList`, and pair each `TabsTrigger` (with a `value`) to a `TabsContent` of the same `value`.

`TabsList` has two variants: `line` (default, an underline indicator) and `default` (pill tabs inside a tray). `TabsTrigger` adapts its active and hover styling from the parent list's variant automatically, so you set the variant once on the list.

Set `orientation` on the root (`horizontal` by default) when you need vertical tabs. Use tabs for peer views of one subject; use `NavigationMenu` or the app navigation for moving between pages.

## General guidelines

### Do

- Use tabs for peer views of a single subject on one page.
- Set the visual style once with the `TabsList` `variant`.
- Match each `TabsTrigger` `value` to a `TabsContent` `value`.
- Keep tab labels short and parallel.

### Don't

- Don't use tabs to navigate between separate pages. Use the app navigation.
- Don't hide a primary, always-needed action inside a non-default tab.
- Don't mix the two list variants within one tab set.

## Features

- #### Variant

  `TabsList` `variant` is `line` (default, underline) or `default` (pill tabs in a tray).

  ```tsx
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "@cloud/ui";

  <Tabs defaultValue="overview">
    <TabsList variant="line">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">…</TabsContent>
    <TabsContent value="activity">…</TabsContent>
  </Tabs>;
  ```

- #### Orientation

  Set `orientation="vertical"` on the root for a vertical tab list. It defaults to `horizontal`.

## Writing guidelines

### General writing guidelines

- Use sentence case.
- Avoid terminal punctuation in tab labels.

### Component-specific guidelines

- Use one or two words per tab, naming the view.
- Keep the labels parallel in form across the set.
- Order tabs by importance or a natural sequence, with the default first.

## Accessibility guidelines

### General accessibility guidelines

- The tab list, triggers, and panels are wired through the Base UI primitive with the correct roles and relationships.
- Each trigger is keyboard operable, and the active panel is associated with its trigger.
- Don't rely on the active color alone; the selected trigger also carries weight and, in the line variant, an underline.

### Component-specific guidelines

#### Keyboard interaction

- The arrow keys move between tabs, and the matching panel is shown.
- Tab moves focus from the active trigger into the panel content.

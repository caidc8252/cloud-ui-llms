# Tabs

Tab bar and panels, in an underline variant and a pill variant.

`Tabs` is a client component built on `@base-ui/react`'s `Tabs`. It is a set of four parts — `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` — plus the `tabsListVariants` helper for styling a custom element like a tab list. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Tabs` switches between panels within the same page. Wrap the set in `Tabs`, list the triggers in `TabsList`, and pair each `TabsTrigger` (with a `value`) to a `TabsContent` of the same `value`.

`TabsList` has two variants: `line` (default, an underline indicator) and `default` (pill tabs inside a tray). `TabsTrigger` adapts its active and hover styling from the parent list's variant automatically, so you set the variant once on the list.

A standalone `line` list draws its own rule under the tabs. A list **docked into `PageHeaderBand`'s `tabs` slot does not**: the band's own bottom border is the rail, and the band suppresses the docked list's rule so the two don't stack into a doubled line. Dock a plain `<TabsList>` and pass nothing — no `shadow-none`, no line-suppressing class of your own.

Set `orientation` on the root (`horizontal` by default) when you need vertical tabs. Use tabs for peer views of one subject; use `NavigationMenu` or the app navigation for moving between pages.

## General guidelines

### Do

- Use tabs for peer views of a single subject on one page.
- Set the visual style once with the `TabsList` `variant`.
- Match each `TabsTrigger` `value` to a `TabsContent` `value`.
- Keep tab labels short and parallel.
- When docking tabs on a detail page, wrap the `PageHeaderBand` and the panels in one `Tabs` root.

### Don't

- Don't use tabs to navigate between separate pages. Use the app navigation.
- Don't hide a primary, always-needed action inside a non-default tab.
- Don't mix the two list variants within one tab set.
- Don't hand a docked `TabsList` a `shadow-none` (or any other rule-killing class) to line it up with the band. The band already owns the rule.

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

- #### Docked in a page header band

  On a detail page, the tab strip sits on the bottom edge of the `PageHeaderBand`. Put the `Tabs` root around both the band and the panels, hand the `TabsList` to the band's `tabs` slot, and leave the panels as siblings. The band draws the rail with its own bottom border and suppresses the docked list's underline, so the active tab's indicator lands on a single, edge-to-edge line.

  ```tsx
  import { Tabs, TabsList, TabsTrigger, TabsContent, PageHeaderBand } from "@cloud/ui";

  <Tabs defaultValue="overview" className="gap-0">
    <PageHeaderBand
      variant="detail"
      title={product.name}
      backTo="/products"
      tabs={
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skus">SKUs</TabsTrigger>
        </TabsList>
      }
    />
    <TabsContent value="overview">…</TabsContent>
    <TabsContent value="skus">…</TabsContent>
  </Tabs>;
  ```

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

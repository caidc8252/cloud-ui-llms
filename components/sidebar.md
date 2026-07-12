# Sidebar

The app's left navigation panel, with a collapsible icon rail.

`Sidebar` is a client component driven by props. It exports the `SidebarProps`, `SidebarBrand`, `SidebarSection`, `SidebarNavItem`, and `SidebarSubItem` types. The `SidebarTrigger` button, the `SidebarProvider` / `useSidebar` context, and the `SIDEBAR_COOKIE` constant come from the same package. Import them from `@cloud/ui`.

## Development guidelines

`Sidebar` renders the navigation from data: a `brand` block, a list of `sections`, a pinned `footer` slot, and a `className`. Those four props are the whole surface.

- `brand` is `{ logo?, title, subtitle? }`. With no `logo` you get a letter avatar built from the first character of `title`.
- `sections` is `{ label?, items }[]`. The section `label` is the small uppercase caption above the group.
- A `SidebarNavItem` is `{ href?, icon?, label, children? }`. **`children` is what makes an item expandable** — a parent with sub-items, each a `SidebarSubItem` of `{ href, label }` (no icon: sub-items are text rows). An item with an `href` and no children is a leaf link; an item with neither is a plain, non-navigable row. A parent's own `href` is **ignored** — an expandable item is a disclosure button, not a link, so give the destination to a child instead.

**Active state is derived from the pathname**, not passed in. The matcher is strict about boundaries: a path matches when it equals the `href` exactly, or starts with `href + "/"`. That's deliberate — `/users` must not light up when the user is on `/users-archive`, and `/` only matches itself. A parent with an active child renders as active and opens by default.

The **collapsed rail** (when `collapsed` is true and you're not on mobile, both from `useSidebar()`) turns the panel icon-only, and the labels move: a leaf's label becomes a `Tooltip`, and a parent's sub-items become a `HoverCard` flyout. **On mobile the drawer always renders expanded** — a rail inside a drawer would be pointless.

Pass this component to `Layout`'s `sidebar` slot once; `Layout` renders it in the desktop rail _and_ in the mobile drawer, and owns the widths (248px expanded, 56px collapsed). The whole thing must sit under a `SidebarProvider` — that's what `useSidebar()` reads, and what persists the collapsed state to the `SIDEBAR_COOKIE`. Wire the provider's `pathname` prop to your router, or the mobile drawer won't close on navigation. Toggle it with `SidebarTrigger`, which also responds to the global `[` shortcut.

## General guidelines

### Do

- Pass the sidebar to `Layout` once; the drawer reuses it.
- Give every item an `icon`, or the collapsed rail has nothing to show.
- Group items into sections with short, uppercase captions.
- Keep the nesting to one level — items and their children, nothing deeper.

### Don't

- Don't pass an "active" flag; the component derives it from the pathname.
- Don't put an action in the sidebar. It navigates; put actions on the page.
- Don't nest an expandable item inside another; the component supports one level.
- Don't give an expandable parent an `href`; it renders as a disclosure button and the `href` is dropped.

## Features

- #### Brand, sections, and items

  ```tsx
  import { Sidebar, type SidebarSection } from "@cloud/ui";

  const sections: SidebarSection[] = [
    {
      label: t("nav.operations"),
      items: [
        { href: "/dashboard", icon: <LayoutGrid size={16} />, label: t("nav.dashboard") },
        {
          icon: <Store size={16} />,
          label: t("nav.merchants"),
          children: [
            { href: "/merchants", label: t("nav.allMerchants") },
            { href: "/merchants/pending", label: t("nav.pending") },
          ],
        },
      ],
    },
  ];

  <Sidebar
    brand={{ title: "Cloud", subtitle: party.name }}
    sections={sections}
    footer={<UserMenu />}
  />;
  ```

- #### Collapsed rail

  Collapse it with `SidebarTrigger` (or the `[` shortcut). Leaves get a tooltip label; parents get a hover flyout of their sub-items.

- #### Footer

  The `footer` slot is pinned to the bottom of the panel — a user menu, a party switcher.

### States

- **Active** — the item whose `href` matches the current path, or a parent with an active child.
- **Expanded parent** — a parent with an active child opens by default; the chevron rotates when open.
- **Rail** — collapsed on desktop: icons only, labels in tooltips and flyouts.
- **Drawer** — on mobile: always expanded.

## Writing guidelines

### General writing guidelines

- Use sentence case for item labels, and no terminal punctuation.
- Never hardcode user-facing strings.

### Component-specific guidelines

- Item labels: nouns naming the destination, matching the page's own title so the label predicts the page.
- Section labels: name the group of destinations, such as `Operations`.
- Keep labels short — a long label truncates in the panel and is invisible in the rail.

## Accessibility guidelines

### General accessibility guidelines

- Each section renders a `<nav>`, and the items are real links, so the navigation is reachable by keyboard and announced as navigation.
- In the collapsed rail the icon links carry `aria-label`, so their names survive the labels being hidden.
- Don't rely on the active fill alone to convey the current page — the sub-item's accent bar and the page's own title carry it too.

### Component-specific guidelines

- An item with no `href` and no children is a plain, unfocusable row. Don't use one as a heading; use the section `label`.
- The collapsed rail's parent flyout opens on hover. It is also keyboard-reachable through the trigger button, but don't collapse the rail by default — the expanded panel is the discoverable form.

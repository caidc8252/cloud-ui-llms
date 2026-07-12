# AppHeader

The app bar's content — a leading slot, breadcrumbs, a search affordance, and a notification slot.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/app-header.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/layout/index.ts)

`AppHeader` is a client component driven by props. Import it from `@cloud/ui`.

## Development guidelines

`AppHeader` goes in `Layout`'s `header` slot. It lays out four things across the bar: `leading` (typically a `SidebarTrigger`), `breadcrumbs`, a search button, and `notification`, with a spacer pushing the last two to the right.

`breadcrumbs` is a **render slot for the items only** — the wrapper supplies the `<Breadcrumb><BreadcrumbList>` around them. So pass `<Breadcrumbs items={…} />` (which renders items and separators), or hand-composed `BreadcrumbItem`s. Don't wrap them in another `Breadcrumb` yourself.

The search button appears **only when `onSearchClick` is defined** — omit the prop and there is no search affordance at all. It renders the `searchPlaceholder` and a `⌘K` hint, so wire it to the same `CommandDialog` that shortcut opens. `searchPlaceholder` defaults to the English `Search…`; pass a translated string.

`notification` is a render slot the caller owns entirely, so you can put a `Popover`-anchored bell with its own badge and panel in it without the header knowing anything about it.

## General guidelines

### Do

- Put a `SidebarTrigger` in `leading`.
- Pass breadcrumb items, not a wrapped `Breadcrumb` — the header wraps them.
- Wire `onSearchClick` to the same command palette the `⌘K` shortcut opens.
- Pass a translated `searchPlaceholder`.

### Don't

- Don't show the search button for a page with nothing to search; omit `onSearchClick`.
- Don't advertise `⌘K` if the shortcut isn't actually bound.
- Don't put page-level actions in the app header. They belong in `PageHeader`.

## Features

- #### Slots

  ```tsx
  import { AppHeader, SidebarTrigger, Breadcrumbs } from "@cloud/ui";

  <AppHeader
    leading={<SidebarTrigger />}
    breadcrumbs={
      <Breadcrumbs
        items={[{ label: t("nav.merchants"), href: "/merchants" }, { label: merchant.name }]}
      />
    }
    onSearchClick={() => setPaletteOpen(true)}
    searchPlaceholder={t("common.search")}
    notification={<NotificationBell />}
  />;
  ```

- #### Search

  The button renders only when `onSearchClick` is provided, and shows the `⌘K` hint.

- #### Notification

  A caller-owned render slot — put a badge, a popover, whatever the app needs.

### States

- **No search** — omit `onSearchClick` and the button isn't rendered.
- **No breadcrumbs** — omit `breadcrumbs` and the trail isn't rendered.

## Writing guidelines

### General writing guidelines

- Use sentence case.
- Never hardcode user-facing strings.

### Component-specific guidelines

- `searchPlaceholder`: say what gets searched when the scope isn't obvious — `Search merchants` beats a bare `Search`.

## Accessibility guidelines

### General accessibility guidelines

- The header sits in `Layout`'s `<header>` landmark, and the breadcrumbs bring their own `<nav aria-label="breadcrumb">`.
- The search control is a real button, reachable by Tab; the `⌘K` hint is a convenience, not the only way in.
- Give whatever you put in `notification` an accessible name — an icon-only bell needs an `aria-label`, and an unread count needs to be announced, not just colored.

### Component-specific guidelines

- Don't make the app header the only place a page's actions live. It is chrome; the page's own actions belong in `PageHeader`, where they are in the reading order of the content.

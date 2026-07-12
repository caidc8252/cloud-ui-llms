# Breadcrumb

Horizontal trail showing where the current page sits in the hierarchy.

`Breadcrumb` is a set of composable parts — `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, and `BreadcrumbEllipsis`. It is plain markup — a `<nav>` around an `<ol>` — with one exception: `BreadcrumbLink` is built on Base UI's `useRender`, so it is a hook-using component and belongs inside a client boundary. Import the parts from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

`Breadcrumb` renders the ancestor trail of the current page. The root is a `<nav aria-label="breadcrumb">`; put the crumbs in a `BreadcrumbList` as `BreadcrumbItem`s, with a `BreadcrumbSeparator` between them.

Every crumb except the last is a `BreadcrumbLink` — pass `render` to hand it your router's link, for example `render={<Link href="/companies" />}`. The **last** crumb is a `BreadcrumbPage`, not a link: it is the page the user is already on, and it carries `aria-current="page"` for you.

`BreadcrumbSeparator` defaults to a `/` glyph and is `aria-hidden`; pass a child to use a different one. When a deep trail would be too long, collapse the middle with a `BreadcrumbEllipsis`.

Breadcrumbs describe _location_, not history — they show where the page sits in the hierarchy, not the path the user clicked to get there. For the app-shell breadcrumb that reads its trail from the route, use the `Breadcrumbs` layout component instead of assembling these parts by hand.

## General guidelines

### Do

- Make the last crumb a `BreadcrumbPage`, and every earlier crumb a `BreadcrumbLink`.
- Match each crumb's label to the title of the page it points at.
- Collapse a long middle with `BreadcrumbEllipsis`.

### Don't

- Don't make the current page a link.
- Don't use breadcrumbs as a back button — they reflect hierarchy, not history.
- Don't put a breadcrumb trail on a top-level page that has no ancestors.

## Features

- #### Trail

  ```tsx
  import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@cloud/ui";

  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink render={<Link href="/companies" />}>Companies</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Acme Corp</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>;
  ```

- #### Separator

  `BreadcrumbSeparator` renders a `/` by default and is `aria-hidden`. Pass a child — an icon, say — to replace it.

  ```tsx
  <BreadcrumbSeparator>
    <ChevronRight />
  </BreadcrumbSeparator>
  ```

- #### Ellipsis

  `BreadcrumbEllipsis` stands in for collapsed middle crumbs. It renders a horizontal-dots glyph and takes no props of its own beyond the `<span>` props.

  It is purely decorative: the whole span is `role="presentation"` and `aria-hidden`, so screen readers skip it (it does contain a visually-hidden `More` string, but the `aria-hidden` wrapper keeps that from being announced). It is not a control — if the collapsed crumbs should be reachable, wrap it in a real `DropdownMenu` trigger that exposes them.

  ```tsx
  <BreadcrumbItem>
    <BreadcrumbEllipsis />
  </BreadcrumbItem>
  ```

### States

- **Link** — a `BreadcrumbLink` is tertiary text that lifts to secondary on hover.
- **Current** — a `BreadcrumbPage` is primary text, medium weight, and not interactive. It renders a `<span>` marked `role="link"`, `aria-disabled="true"`, and `aria-current="page"`, so it reads as the disabled, current link in the trail.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.
- Name destinations with nouns.

### Component-specific guidelines

- Use the destination page's own title as the crumb label, so the label predicts the page.
- Keep crumbs short. If a name is long, truncate it in the last crumb rather than wrapping the trail.

## Accessibility guidelines

### General accessibility guidelines

- The root is a `<nav aria-label="breadcrumb">` around an ordered list, so the trail is announced as navigation and its order is conveyed.
- `BreadcrumbPage` carries `aria-current="page"`, so the current location is announced, not just styled.
- Separators are `role="presentation"` and `aria-hidden`, so they are not read out.

### Component-specific guidelines

- Every crumb before the last must be a real, focusable link. Don't fake one with a click handler on a `<span>`.
